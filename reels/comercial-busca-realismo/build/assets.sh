#!/usr/bin/env bash
# Prepara as fotos reais para o filme. Corte UNIFORME (nunca estica) + grade global.
# A tatuagem em si nunca e alterada: sem IA, sem retoque local, sem reconstrucao.
set -e
cd "$(dirname "$0")"
SRC=../../../site/img/portfolio
EST=../../../site/img/estudio
A=../assets
mkdir -p $A/cards $A/cards-original $A/tiles

GRADE="eq=contrast=1.10:saturation=0.32:brightness=-0.015:gamma=0.98"

for f in "$SRC"/*.jpg; do
  b=$(basename "$f" .jpg); case "$b" in *-sm) continue;; esac
  # cartao 3:4 (mosaico do Pinterest e orbita)
  ffmpeg -v error -y -i "$f" -vf "crop='min(iw,ih*3/4)':'min(ih,iw*4/3)',scale=720:960:flags=lanczos,$GRADE" -q:v 3 "$A/cards/$b.jpg"
  # tile 1:1 (grade do perfil)
  ffmpeg -v error -y -i "$f" -vf "crop='min(iw,ih)':'min(iw,ih)',scale=340:340:flags=lanczos,$GRADE"           -q:v 3 "$A/tiles/$b.jpg"
done

# quatro sem grade, para conferir lado a lado
for b in cigana-braco retrato-bone retrato-oculos nossa-senhora; do
  ffmpeg -v error -y -i "$SRC/$b.jpg" -vf "crop='min(iw,ih*3/4)':'min(ih,iw*4/3)',scale=720:960:flags=lanczos" -q:v 3 "$A/cards-original/$b.jpg"
done

# avatar
ffmpeg -v error -y -i "$EST/andre-retrato.jpg" -vf "crop='min(iw,ih)':'min(iw,ih)',scale=256:256:flags=lanczos,eq=contrast=1.06:saturation=0.40" -q:v 3 "$A/avatar.jpg"
echo "assets prontos em $A"
