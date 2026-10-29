#!/usr/bin/env bash
# Pipeline de edicao de sessao filmada -> 1 video longo + lote de Shorts 9:16
# Executa a receita definida pelas skills `cortes-de-sessao` e `editor-videos-tattoo`.
#
#   ./scripts/editar_sessao.sh inventario BRUTO.mp4 [saida/]
#   ./scripts/editar_sessao.sh longo      BRUTO.mp4 INICIO FIM  SAIDA.mp4
#   ./scripts/editar_sessao.sh short      BRUTO.mp4 INICIO DUR  SAIDA.mp4 [offset_x|c] [velocidade]
#
# INICIO/FIM/DUR aceitam segundos (90) ou timecode (01:30, 00:01:30.5).
set -euo pipefail

FONTE=""
for c in /usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf \
         /usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf; do
  [ -f "$c" ] && FONTE="$c" && break
done
[ -z "$FONTE" ] && FONTE="$(fc-match -f '%{file}' sans:bold 2>/dev/null || true)"

ALVO_YT="loudnorm=I=-14:TP=-1.5:LRA=11"   # alvo de loudness do YouTube
ff() { ffmpeg -hide_banner -loglevel error -y "$@"; }

# Classifica o audio: `nenhum` (sem faixa), `mudo` (silencio digital, onde
# loudnorm gera NaN e aborta o encode) ou `ok` (normalizavel).
audio_modo() {
  local src="$1" maxv
  ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "$src" 2>/dev/null \
    | grep -q . || { echo nenhum; return; }
  maxv=$(ffmpeg -hide_banner -i "$src" -map 0:a:0 -af volumedetect -f null - 2>&1 \
         | grep -o 'max_volume: [-0-9.]*' | awk '{print $2}' | head -1)
  if [ -z "$maxv" ] || awk -v v="$maxv" 'BEGIN{exit !(v < -70)}'; then echo mudo; else echo ok; fi
}

# Monta -map/-af/-c:a conforme o audio da fonte. $2 = filtro extra (ex. atempo).
monta_audio() {
  local modo="$1" extra="${2:-}"
  case "$modo" in
    nenhum) printf '%s\0' -an ;;
    mudo)   printf '%s\0' -map 0:a:0 ${extra:+-af} ${extra:+"${extra#,}"} -c:a aac -b:a 192k ;;
    ok)     printf '%s\0' -map 0:a:0 -af "${ALVO_YT}${extra}" -c:a aac -b:a 192k ;;
  esac
}

# --- inventario: tudo que eu preciso para montar o mapa de cortes ---------
cmd_inventario() {
  local src="$1" out="${2:-inventario}"
  mkdir -p "$out/frames"
  local dur modo
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
  modo=$(audio_modo "$src")

  echo "== FICHA TECNICA =="
  ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height,r_frame_rate,codec_name,bit_rate \
    -show_entries format=duration,size -of default=noprint_wrappers=1 "$src"
  echo "audio: $(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,channels,sample_rate -of csv=p=0 "$src" 2>/dev/null || true) [modo=$modo]"

  echo
  echo "== TROCAS DE PLANO (scene > 0.3) =="
  ff -i "$src" -filter:v "select='gt(scene,0.3)',showinfo" -f null - 2>&1 \
    | { grep -o 'pts_time:[0-9.]*' || true; } | cut -d: -f2 \
    | awk '{printf "%02d:%02d:%05.2f  (%.1fs)\n", $1/3600, ($1%3600)/60, $1%60, $1}' \
    > "$out/trocas-de-plano.txt"
  if [ -s "$out/trocas-de-plano.txt" ]; then
    head -60 "$out/trocas-de-plano.txt"
    echo "   -> $(wc -l < "$out/trocas-de-plano.txt") trocas em $out/trocas-de-plano.txt"
  else
    echo "nenhuma troca detectada (plano continuo)"
  fi

  echo
  echo "== SILENCIOS / AR MORTO (< -35dB por 1.5s+) =="
  if [ "$modo" = ok ]; then
    ff -i "$src" -af "silencedetect=noise=-35dB:d=1.5" -f null - 2>&1 \
      | { grep -E 'silence_(start|end|duration)' || true; } > "$out/silencios.txt"
    if [ -s "$out/silencios.txt" ]; then head -40 "$out/silencios.txt"; echo "   -> $out/silencios.txt"
    else echo "nenhum trecho de ar morto"; fi
  else
    echo "pulado (audio: $modo)"
  fi

  # Contact sheets com timecode queimado: 1 frame a cada 10s, grades de 4x4.
  echo
  echo "== CONTACT SHEETS (1 frame / 10s, timecode queimado) =="
  local dt=""
  [ -n "$FONTE" ] && dt=",drawtext=fontfile='$FONTE':text='%{pts\\:hms}':x=18:y=18:fontsize=h/14:fontcolor=white:box=1:boxcolor=black@0.65:boxborderw=10"
  ff -i "$src" -vf "fps=1/10,scale=480:-2${dt},tile=4x4" -an "$out/frames/grade_%03d.jpg"
  echo "duracao: ${dur}s  |  grades:"
  ls -1 "$out/frames/" | sed "s|^|  $out/frames/|"
}

# --- longo: limpar, mantendo o enquadramento original ---------------------
cmd_longo() {
  local src="$1" ini="$2" fim="$3" dst="$4"
  local vf="unsharp=5:5:0.6:5:5:0.0,eq=contrast=1.06:saturation=0.97"
  local modo; modo=$(audio_modo "$src")
  [ "$modo" = mudo ] && echo "aviso: faixa de audio muda -- loudnorm desligado" >&2
  mapfile -d '' -t AOPTS < <(monta_audio "$modo")
  ffmpeg -hide_banner -y -ss "$ini" -to "$fim" -i "$src" \
    -map 0:v:0 -vf "$vf" \
    -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -movflags +faststart \
    "${AOPTS[@]}" "$dst" 2>&1 | grep -viE '^\[libx264|^\[aac|^ |ref [BP]|kb/s|frame=|Qavg' || true
  echo "longo: $dst ($(du -h "$dst" | cut -f1)) $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$dst")s"
}

# --- short: recorte 9:16 em 1080x1920 ------------------------------------
cmd_short() {
  local src="$1" ini="$2" dur="$3" dst="$4" offx="${5:-c}" vel="${6:-1}"
  local x; [ "$offx" = "c" ] && x="(iw-ow)/2" || x="$offx"
  # Recorta a maior area 9:16 possivel e sobe para 1080x1920.
  local vf="crop='min(iw,ih*9/16)':'min(ih,iw*16/9)':${x}:(ih-oh)/2,scale=1080:1920:flags=lanczos,unsharp=5:5:0.5:5:5:0.0"
  local extra=""
  if [ "$vel" != "1" ]; then vf="$vf,setpts=PTS/${vel}"; extra=",atempo=${vel}"; fi
  local modo; modo=$(audio_modo "$src")
  [ "$modo" = mudo ] && echo "aviso: faixa de audio muda -- loudnorm desligado" >&2
  mapfile -d '' -t AOPTS < <(monta_audio "$modo" "$extra")
  ffmpeg -hide_banner -y -ss "$ini" -t "$dur" -i "$src" \
    -map 0:v:0 -vf "$vf" -r 30 \
    -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart \
    "${AOPTS[@]}" "$dst" 2>&1 | grep -viE '^\[libx264|^\[aac|^ |ref [BP]|kb/s|frame=|Qavg' || true
  echo "short: $dst ($(du -h "$dst" | cut -f1)) $(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$dst")"
}

case "${1:-}" in
  inventario) shift; cmd_inventario "$@" ;;
  longo)      shift; cmd_longo "$@" ;;
  short)      shift; cmd_short "$@" ;;
  *) sed -n '2,12p' "$0"; exit 1 ;;
esac
