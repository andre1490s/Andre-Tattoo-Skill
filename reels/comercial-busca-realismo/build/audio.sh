#!/usr/bin/env bash
# Desenho de som sintetizado. Saida: saida/trilha.wav — 24,0 s, 48 kHz, estereo.
# Cada impacto esta ancorado num punch de camera (ver ROTEIRO.md).
set -e
cd "$(dirname "$0")"; OUT=../saida/trilha.wav; TMP=$(mktemp -d)
mk(){ ffmpeg -v error -y "$@"; }

mk -f lavfi -i "sine=f=48:d=24" -f lavfi -i "sine=f=72.5:d=24" -f lavfi -i "anoisesrc=d=24:c=pink:a=0.06" \
  -filter_complex "[0:a]volume=0.19[a];[1:a]volume=0.095[b];[2:a]highpass=f=1800,lowpass=f=9000,volume=0.05[c];
   [a][b][c]amix=inputs=3:normalize=0,afade=t=in:st=0:d=1.0,afade=t=out:st=22.8:d=1.2" $TMP/bed.wav

CI=""; CF=""; KM=""; n=0
addkey(){ CI="$CI -i $1"; d=$(python3 -c "print(int($2*1000))")
  CF="$CF[$((n+1)):a]adelay=$d|$d[k$n];"; KM="$KM[k$n]"; n=$((n+1)); }
for i in $(seq 0 33); do
  mk -f lavfi -i "sine=f=$((1550+(i*53)%420)):d=0.030" -af "volume=0.15,afade=t=out:st=0.004:d=0.026" $TMP/pk$i.wav
  addkey $TMP/pk$i.wav "$(python3 -c "print(f'{0.35+$i*0.0515:.3f}')")"
done
for i in $(seq 0 13); do
  mk -f lavfi -i "sine=f=$((1700+(i*61)%380)):d=0.028" -af "volume=0.13,afade=t=out:st=0.004:d=0.024" $TMP/ik$i.wav
  addkey $TMP/ik$i.wav "$(python3 -c "print(f'{11.55+$i*0.0764:.3f}')")"
done

mk -f lavfi -i "sine=f=430:d=0.45"  -af "volume=0.24,afade=t=out:st=0.03:d=0.40,aecho=0.7:0.6:50:0.3"                  $TMP/enter.wav
mk -f lavfi -i "anoisesrc=d=0.9:c=white:a=0.5" -af "highpass=f=500,lowpass=f=7000,volume=0.15,afade=t=in:st=0:d=0.45,afade=t=out:st=0.5:d=0.38" $TMP/load.wav
mk -f lavfi -i "sine=f=2100:d=0.045" -af "volume=0.18,afade=t=out:st=0.006:d=0.038"                                    $TMP/click.wav
mk -f lavfi -i "sine=f=150:d=0.9"   -af "volume=0.30,afade=t=out:st=0.04:d=0.84"                                       $TMP/sheet.wav
# whip: ruido filtrado com varredura, curto e agressivo
mk -f lavfi -i "anoisesrc=d=0.8:c=white:a=0.6" -af "highpass=f=300,lowpass=f=9000,volume=0.30,afade=t=in:st=0:d=0.22,afade=t=out:st=0.26:d=0.5" $TMP/whip.wav
mk -f lavfi -i "sine=f=88:d=2.0"    -af "volume=0.40,afade=t=in:st=0:d=0.03,afade=t=out:st=0.15:d=1.8"                 $TMP/subig.wav
mk -f lavfi -i "sine=f=110:d=1.2"   -af "volume=0.30,afade=t=in:st=0:d=0.03,afade=t=out:st=0.1:d=1.05"                 $TMP/sub.wav
mk -f lavfi -i "anoisesrc=d=1.3:c=white:a=0.5" -af "highpass=f=900,lowpass=f=12000,volume=0.21,afade=t=in:st=0:d=1.05,afade=t=out:st=1.08:d=0.2" $TMP/rise.wav
mk -f lavfi -i "sine=f=1046:d=0.8" -f lavfi -i "sine=f=1568:d=0.8" -filter_complex "[0:a]volume=0.12[x];[1:a]volume=0.07[y];[x][y]amix=inputs=2:normalize=0,afade=t=out:st=0.05:d=0.74" $TMP/bell.wav
# revelacao do link: tom subindo
mk -f lavfi -i "sine=f=520:d=1.1" -f lavfi -i "sine=f=784:d=1.1" -filter_complex "[0:a]volume=0.10[x];[1:a]volume=0.06[y];[x][y]amix=inputs=2:normalize=0,afade=t=in:st=0:d=0.5,afade=t=out:st=0.6:d=0.48" $TMP/reveal.wav
# acorde da marca
mk -f lavfi -i "sine=f=330:d=2.4" -f lavfi -i "sine=f=495:d=2.4" -f lavfi -i "sine=f=660:d=2.4" \
  -filter_complex "[0:a]volume=0.11[x];[1:a]volume=0.07[y];[2:a]volume=0.05[z];[x][y][z]amix=inputs=3:normalize=0,afade=t=in:st=0:d=0.25,afade=t=out:st=0.7:d=1.6" $TMP/chord.wav

EV=(" $TMP/enter.wav 2460" " $TMP/load.wav 2520" " $TMP/click.wav 5760" " $TMP/sub.wav 5770"
    " $TMP/sheet.wav 6090" " $TMP/sub.wav 7760"  " $TMP/whip.wav 8460" " $TMP/sheet.wav 9180"
    " $TMP/rise.wav 9280"  " $TMP/click.wav 10170" " $TMP/subig.wav 10430" " $TMP/whip.wav 10960"
    " $TMP/bell.wav 12640" " $TMP/click.wav 13370" " $TMP/sub.wav 13740" " $TMP/reveal.wav 16900"
    " $TMP/bell.wav 17320" " $TMP/click.wav 18530" " $TMP/sheet.wav 19430"
    " $TMP/subig.wav 20960" " $TMP/chord.wav 21000" " $TMP/bell.wav 22400")
EI=""; EF=""; EM=""; m=0
for e in "${EV[@]}"; do set -- $e; EI="$EI -i $1"
  EF="$EF[$((n+1+m)):a]adelay=$2|$2[v$m];"; EM="$EM[v$m]"; m=$((m+1)); done

ffmpeg -v error -y -i $TMP/bed.wav $CI $EI -filter_complex "
 $CF $EF
 [0:a]$KM$EM amix=inputs=$((1+n+m)):normalize=0,
 alimiter=limit=0.93,aformat=sample_rates=48000:channel_layouts=stereo,
 afade=t=out:st=23.3:d=0.7,atrim=0:24" $OUT
rm -rf $TMP; echo "trilha: $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 $OUT)s)"
