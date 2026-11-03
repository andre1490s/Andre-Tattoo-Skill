#!/usr/bin/env bash
# Monta o Reels "O decalque vira pele" (onca + peonias).
# Receita e decisoes: reels/onca-peonias-decalque-vira-pele/RECEITA.md
#
#   ./scripts/montar_reels_onca.sh DECALQUE.mov FINAL.mov SAIDA.mp4
#
# As coordenadas abaixo sao especificas DESTE material: foram medidas quadro a
# quadro. Para outra peca, remedir (ver RECEITA.md) em vez de reaproveitar.
set -euo pipefail

A="${1:?clipe do decalque}"; B="${2:?clipe da peca pronta}"; DST="${3:?mp4 de saida}"
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT

# Recorte animado de (x0,y0,w0) ate (x1,y1,w1), altura = largura*16/9, saida 1080x1920.
# zoompan exibe iw/z da entrada e x,y sao coordenadas DA ENTRADA (nao da imagem
# ja ampliada) -- por isso nao se multiplica x,y por z. $9 = resolucao interna:
# o clipe 4K renderiza em 1620 e desce com lanczos, que preserva mais detalhe.
zp(){
  local S=$1 x0=$2 y0=$3 w0=$4 x1=$5 y1=$6 w1=$7 N=$8 R=${9:-1080}
  local W="($w0+($w1-$w0)*on/$N)" X="($x0+($x1-$x0)*on/$N)" Y="($y0+($y1-$y0)*on/$N)"
  local RH; RH=$(awk -v r="$R" 'BEGIN{printf "%d", int(r*16/9/2)*2}')
  local tail=""; [ "$R" != 1080 ] && tail=",scale=1080:1920:flags=lanczos"
  echo "zoompan=z='$S/$W':x='$X':y='$Y':d=1:s=${R}x${RH}:fps=30${tail}"
}
GB="eq=contrast=1.06:saturation=0.95,unsharp=5:5:0.35:5:5:0.0"   # peca pronta
GA="eq=contrast=1.12:saturation=0.86,unsharp=5:5:0.70:5:5:0.0"   # decalque: upscale pede mais nitidez
ENC=(-c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -an -r 30)
ff(){ ffmpeg -hide_banner -loglevel error -y "$@"; }

# Cabeca da onca medida na fonte do clipe final (2160x3840):
#   t=6 (943,1690) | t=9 (734,1728) | t=11.4 (1004,1786) | t=14 (1220,1747) | t=15.9 (1490,1766)
# Alvo do match: cabeca em (0.44, 0.53) do quadro ocupando ~0.62 da largura.
# Todo recorte do decalque termina antes de y=1410 para excluir o sticker "Bom dia".
ff -ss 13.0 -i "$B" -t 1.6  -vf "$(zp 2160 519 845  820  625 880  780  48 1620),$GB" "${ENC[@]}" "$TMP/s1.mp4"
ff -ss 0.9  -i "$A" -t 2.4  -vf "$(zp 1080   0  90  760   95 200  680  72),$GA"      "${ENC[@]}" "$TMP/s2.mp4"
ff -ss 6.0  -i "$B" -t 6.5  -vf "$(zp 2160 349 409 1362    0   0 2160 195 1620),$GB" "${ENC[@]}" "$TMP/s3.mp4"
ff -ss 9.0  -i "$B" -t 2.4  -vf "$(zp 2160 123 619 1300  487 847 1100  72 1620),$GB" "${ENC[@]}" "$TMP/s4.mp4"
ff -ss 14.0 -i "$B" -t 1.95 -vf "$(zp 2160 745 953  950  872 842  820  58 1620),$GB" "${ENC[@]}" "$TMP/s5.mp4"

# settb/fps nas duas pontas: concat entrega timebase 1/1000000 e o arquivo 1/15360,
# e a xfade recusa pontas com timebases diferentes.
ff -i "$TMP/s1.mp4" -i "$TMP/s2.mp4" -i "$TMP/s3.mp4" -i "$TMP/s4.mp4" -i "$TMP/s5.mp4" \
   -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 \
   -filter_complex "\
[0:v]settb=AVTB,fps=30,format=yuv420p[a0];[1:v]settb=AVTB,fps=30,format=yuv420p[a1];\
[2:v]settb=AVTB,fps=30,format=yuv420p[a2];[3:v]settb=AVTB,fps=30,format=yuv420p[a3];\
[4:v]settb=AVTB,fps=30,format=yuv420p[a4];\
[a0][a1]concat=n=2:v=1:a=0,settb=AVTB,fps=30[pa];\
[pa][a2]xfade=transition=fade:duration=0.33:offset=3.67,settb=AVTB,fps=30[pb];\
[pb][a3][a4]concat=n=3:v=1:a=0[v]" \
   -map "[v]" -map 5:a -shortest \
   -c:v libx264 -preset slow -crf 19 -profile:v high -level 4.1 -pix_fmt yuv420p \
   -r 30 -g 60 -movflags +faststart -c:a aac -b:a 128k "$DST"

echo "pronto: $DST  ($(du -h "$DST" | cut -f1), $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$DST")s)"
