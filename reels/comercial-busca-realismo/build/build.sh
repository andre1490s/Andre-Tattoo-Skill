#!/usr/bin/env bash
# Pipeline completo: assets -> quadros -> trilha -> MP4
set -e
cd "$(dirname "$0")"
FPS=${FPS:-30}
OUT=../saida/andre-tattoo-busca-9x16.mp4

echo "1/3 quadros (Playwright)..."
[ -d ../.frames ] && [ "$(ls ../.frames | wc -l)" -gt 700 ] || node render.mjs

echo "2/3 trilha..."
[ -f ../saida/trilha.wav ] || bash audio.sh

echo "3/3 codificacao..."
ffmpeg -v error -y -framerate $FPS -i ../.frames/%05d.png -i ../saida/trilha.wav \
  -map 0:v -map 1:a -shortest \
  -c:v libx264 -profile:v high -level 4.2 -preset slow -crf 19 -maxrate 9M -bufsize 18M \
  -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -x264-params "keyint=60:min-keyint=30:scenecut=0" \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT"

# versao leve para WhatsApp / previa
ffmpeg -v error -y -i "$OUT" -c:v libx264 -crf 24 -preset fast -vf scale=720:1280 \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart ../saida/andre-tattoo-busca-720p.mp4

ls -la ../saida/*.mp4
