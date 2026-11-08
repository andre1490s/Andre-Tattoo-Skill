#!/usr/bin/env bash
# Montador de Reels a partir de um modelo de edicao (EDL).
# Padrao tecnico em skills/editor-videos-tattoo/SKILL.md secao 1.B.
#
#   ./scripts/montar_reels.sh medir  CLIPE.mov 2,6,9,13    saida.png
#   ./scripts/montar_reels.sh montar MODELO.edl SAIDA.mp4  A=clipe1.mov B=clipe2.mov
#
# `medir` gera frames com grade de 10% para localizar o ponto focal em cada
# timecode. `montar` le o EDL e renderiza o corte inteiro ja acabado.
set -euo pipefail

SAIDA_W=1080; SAIDA_H=1920; FPS=30
# Zona segura do Reels: topo 220, base 420, direita 220 de 1080x1920.
ZONA="drawbox=0:0:1080:220:red@0.38:t=fill,drawbox=0:1500:1080:420:red@0.38:t=fill,drawbox=860:220:220:1280:red@0.38:t=fill"
FONTE_TTF=$(ls /usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf 2>/dev/null || fc-match -f '%{file}' sans:bold)
ff(){ ffmpeg -hide_banner -loglevel error -nostdin -y "$@"; }

# --- medir: grade de 10% nos timecodes pedidos ----------------------------
cmd_medir(){
  local src="$1" tempos="$2" dst="$3" tmp; tmp=$(mktemp -d); trap 'rm -rf "$tmp"' RETURN
  local i=0 args=() n=0
  IFS=',' read -ra TS <<< "$tempos"
  for t in "${TS[@]}"; do
    ff -ss "$t" -i "$src" -frames:v 1 -vf \
      "drawgrid=w=iw/10:h=ih/10:t=4:c=red@0.9,drawtext=fontfile=$FONTE_TTF:text='t=$t':x=15:y=15:fontsize=70:fontcolor=yellow:box=1:boxcolor=black:boxborderw=10,scale=470:-2,pad=480:iw*16/9+10:5:5:black" \
      "$tmp/f$i.png"
    args+=(-i "$tmp/f$i.png"); i=$((i+1)); n=$((n+1))
  done
  ff "${args[@]}" -filter_complex "hstack=$n" "$dst"
  echo "medicao: $dst  ($n frames, grade de 10%)"
  echo "leia o x,y do ponto focal como fracao e multiplique pela resolucao da fonte."
}

# --- montar ---------------------------------------------------------------
# Movimento com easing smoothstep; x,y sao coordenadas DA ENTRADA; z = fonte/recorte;
# z so aceita >=1, por isso o render interno em 1620 e o lanczos no fim.
zp(){
  local S=$1 x0=$2 y0=$3 w0=$4 x1=$5 y1=$6 w1=$7 N=$8 R=$9
  local P="(on/$N)" E; E="(pow(${P},2)*(3-2*${P}))"
  local RH; RH=$(awk -v r="$R" 'BEGIN{printf "%d", int(r*16/9/2)*2}')
  echo "zoompan=z='$S/($w0+($w1-$w0)*$E)':x='($x0+($x1-$x0)*$E)':y='($y0+($y1-$y0)*$E)':d=1:s=${R}x${RH}:fps=${FPS},scale=${SAIDA_W}:${SAIDA_H}:flags=lanczos"
}

# ffprobe informa a largura ARMAZENADA; um clipe com rotacao entrega outra ao
# filtro. Decodificar um frame e a unica leitura confiavel. Resultado em cache.
declare -A _LARG
larg_exibida(){
  local src="$1"
  if [ -z "${_LARG[$src]:-}" ]; then
    local t; t=$(mktemp -d)
    ff -ss 0 -i "$src" -frames:v 1 "$t/p.png"
    _LARG[$src]=$(ffprobe -v error -show_entries stream=width -of default=nw=1:nk=1 "$t/p.png")
    rm -rf "$t"
  fi
  echo "${_LARG[$src]}"
}

cmd_montar(){
  local edl="$1" dst="$2"; shift 2
  declare -A CLIPE
  for kv in "$@"; do CLIPE[${kv%%=*}]="${kv#*=}"; done
  local tmp; tmp=$(mktemp -d); trap 'rm -rf "$tmp"' RETURN

  local -a NOME DUR TRANS; local i=0 total=0
  while read -r nome clipe ss dur x0 y0 w0 x1 y1 w1 trans; do
    [[ -z "${nome:-}" || "$nome" == \#* ]] && continue
    local src="${CLIPE[$clipe]:-}"
    [ -z "$src" ] && { echo "erro: EDL usa o clipe '$clipe', nao recebido como ${clipe}=arquivo" >&2; exit 1; }
    local S; S=$(larg_exibida "$src")
    # fonte vertical de baixa resolucao pede mais nitidez e menos saturacao (estencil)
    local corr="unsharp=5:5:0.30:5:5:0.0"
    [ "$S" -le 1200 ] && corr="eq=brightness=-0.012:saturation=0.88,unsharp=5:5:0.85:5:5:0.0"
    local R=1620; [ "$S" -le 1200 ] && R=1300
    local N; N=$(awk -v d="$dur" -v f="$FPS" 'BEGIN{printf "%d", d*f}')
    ff -ss "$ss" -i "$src" -t "$dur" -vf "$(zp "$S" "$x0" "$y0" "$w0" "$x1" "$y1" "$w1" "$N" "$R"),$corr" \
       -c:v libx264 -preset slow -crf 15 -pix_fmt yuv420p -an -r $FPS "$tmp/p$i.mp4"
    NOME[$i]="$nome"; DUR[$i]="$dur"; TRANS[$i]="${trans:-corte}"
    i=$((i+1))
  done < "$edl"
  local n=$i
  [ "$n" -eq 0 ] && { echo "erro: EDL sem planos" >&2; exit 1; }

  # Monta o grafo: corte seco vira concat, morph vira xfade de 0,25s.
  local fc="" inputs=() k
  for ((k=0;k<n;k++)); do inputs+=(-i "$tmp/p$k.mp4"); fc+="[${k}:v]settb=AVTB,fps=${FPS},format=yuv420p[a${k}];"; done
  local cur="a0" acc="${DUR[0]}"
  for ((k=1;k<n;k++)); do
    local out="c$k"
    if [ "${TRANS[$((k-1))]}" = morph ]; then
      local off; off=$(awk -v a="$acc" 'BEGIN{printf "%.4f", a-0.25}')
      fc+="[$cur][a${k}]xfade=transition=fade:duration=0.25:offset=${off},settb=AVTB,fps=${FPS}[$out];"
      acc=$(awk -v a="$acc" -v d="${DUR[$k]}" 'BEGIN{printf "%.4f", a+d-0.25}')
    else
      fc+="[$cur][a${k}]concat=n=2:v=1:a=0,settb=AVTB,fps=${FPS}[$out];"
      acc=$(awk -v a="$acc" -v d="${DUR[$k]}" 'BEGIN{printf "%.4f", a+d}')
    fi
    cur="$out"
  done
  # Acabamento numa passada unica, para fontes diferentes ficarem com a mesma textura.
  fc+="[$cur]curves=master='0/0 0.25/0.22 0.5/0.5 0.75/0.78 1/1',vignette=angle=PI/4.2,noise=alls=4:allf=t+u[v]"

  ff "${inputs[@]}" -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
     -filter_complex "$fc" -map "[v]" -map "${n}:a" -shortest -t "$acc" \
     -c:v libx264 -preset slow -crf 18 -profile:v high -level 4.1 -pix_fmt yuv420p \
     -r $FPS -g 60 -movflags +faststart -c:a aac -b:a 128k "$dst"

  echo "== $dst =="
  local t=0
  for ((k=0;k<n;k++)); do
    printf "  %-10s %5.1fs  corte em %5.2fs  %s\n" "${NOME[$k]}" "${DUR[$k]}" \
      "$(awk -v a="$t" -v d="${DUR[$k]}" 'BEGIN{print a+d}')" "${TRANS[$k]}"
    t=$(awk -v a="$t" -v d="${DUR[$k]}" -v m="${TRANS[$k]}" 'BEGIN{print a+d-(m=="morph"?0.25:0)}')
  done
  awk -v a="$acc" 'BEGIN{ r=a*2; if (r != int(r+0.5)) printf "  aviso: duracao %.2fs fora da grade de 0,5s (musica nao cai na batida)\n", a }'
  echo "  total ${acc}s · $(du -h "$dst" | cut -f1)"
}

cmd_conferir(){
  local v="$1" dst="$2"
  ff -i "$v" -vf "fps=1/0.6,${ZONA},scale=250:-2,drawtext=fontfile=$FONTE_TTF:text='%{pts\:hms}':x=6:y=58:fontsize=h/13:fontcolor=yellow:box=1:boxcolor=black@0.85:boxborderw=5,tile=7x3" "$dst"
  echo "conferencia da zona segura: $dst (vermelho = coberto pela interface do Reels)"
}

case "${1:-}" in
  medir)    shift; cmd_medir "$@" ;;
  montar)   shift; cmd_montar "$@" ;;
  conferir) shift; cmd_conferir "$@" ;;
  *) sed -n '2,9p' "$0"; exit 1 ;;
esac
