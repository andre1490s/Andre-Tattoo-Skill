#!/usr/bin/env bash
# Desenho de som sintetizado. Saida: saida/trilha.wav — 29,2 s, 48 kHz, estereo.
# OFF = deslocamento do filme, que comeca depois do gancho tipografico.
# Cada impacto esta ancorado num punch de camera (ver ROTEIRO.md).
set -e
cd "$(dirname "$0")"; OUT=../saida/trilha.wav; TMP=$(mktemp -d)
OFF=9900; DURT=33.9
mk(){ ffmpeg -v error -y "$@"; }

mk -f lavfi -i "sine=f=48:d=$DURT" -f lavfi -i "sine=f=72.5:d=$DURT" -f lavfi -i "anoisesrc=d=$DURT:c=pink:a=0.06" \
  -filter_complex "[0:a]volume=0.19[a];[1:a]volume=0.095[b];[2:a]highpass=f=1800,lowpass=f=9000,volume=0.05[c];
   [a][b][c]amix=inputs=3:normalize=0,afade=t=in:st=0:d=1.2,afade=t=out:st=32.7:d=1.2" $TMP/bed.wav

CI=""; CF=""; KM=""; n=0
addkey(){ CI="$CI -i $1"; d=$(python3 -c "print(int($2*1000))")
  CF="$CF[$((n+1)):a]adelay=$d|$d[k$n];"; KM="$KM[k$n]"; n=$((n+1)); }
for i in $(seq 0 33); do
  mk -f lavfi -i "sine=f=$((1550+(i*53)%420)):d=0.030" -af "volume=0.15,afade=t=out:st=0.004:d=0.026" $TMP/pk$i.wav
  addkey $TMP/pk$i.wav "$(python3 -c "print(f'{10.25+$i*0.0515:.3f}')")"
done
for i in $(seq 0 13); do
  mk -f lavfi -i "sine=f=$((1700+(i*61)%380)):d=0.028" -af "volume=0.13,afade=t=out:st=0.004:d=0.024" $TMP/ik$i.wav
  addkey $TMP/ik$i.wav "$(python3 -c "print(f'{21.45+$i*0.0764:.3f}')")"
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

mk -f lavfi -i "sine=f=196:d=1.6" -f lavfi -i "sine=f=294:d=1.6" -filter_complex "[0:a]volume=0.10[x];[1:a]volume=0.055[y];[x][y]amix=inputs=2:normalize=0,afade=t=in:st=0:d=0.4,afade=t=out:st=0.6:d=0.95" $TMP/frase.wav
mk -f lavfi -i "anoisesrc=d=1.5:c=white:a=0.5" -af "highpass=f=700,lowpass=f=10000,volume=0.20,afade=t=in:st=0:d=1.3,afade=t=out:st=1.32:d=0.16" $TMP/griser.wav

mk -f lavfi -i "anoisesrc=d=1.2:c=white:a=0.5" -af "highpass=f=2000,lowpass=f=14000,volume=0.14,afade=t=in:st=0:d=0.35,afade=t=out:st=0.4:d=0.78" $TMP/shimmer.wav

EV=(" $TMP/chord.wav 180" " $TMP/subig.wav 180" " $TMP/griser.wav 350"
    " $TMP/whip.wav 2000"
    " $TMP/frase.wav 2900" " $TMP/shimmer.wav 4450" " $TMP/frase.wav 5700"
    " $TMP/frase.wav 7100" " $TMP/griser.wav 7100" " $TMP/frase.wav 8050"
    " $TMP/sheet.wav 8950" " $TMP/click.wav 9460" " $TMP/subig.wav 9800" " $TMP/whip.wav 9780"
    " $TMP/enter.wav 12360" " $TMP/load.wav 12420" " $TMP/click.wav 15660" " $TMP/sub.wav 15670"
    " $TMP/sheet.wav 15990" " $TMP/sub.wav 17660"  " $TMP/whip.wav 18360" " $TMP/sheet.wav 19080"
    " $TMP/rise.wav 19180"  " $TMP/click.wav 20070" " $TMP/subig.wav 20330" " $TMP/whip.wav 20860"
    " $TMP/bell.wav 22540" " $TMP/click.wav 23270" " $TMP/sub.wav 23640" " $TMP/reveal.wav 26800"
    " $TMP/bell.wav 27220" " $TMP/click.wav 28430" " $TMP/sheet.wav 29330"
    " $TMP/subig.wav 30860" " $TMP/chord.wav 30900" " $TMP/bell.wav 32300")
EI=""; EF=""; EM=""; m=0
for e in "${EV[@]}"; do set -- $e; EI="$EI -i $1"
  EF="$EF[$((n+1+m)):a]adelay=$2|$2[v$m];"; EM="$EM[v$m]"; m=$((m+1)); done

ffmpeg -v error -y -i $TMP/bed.wav $CI $EI -filter_complex "
 $CF $EF
 [0:a]$KM$EM amix=inputs=$((1+n+m)):normalize=0,
 alimiter=limit=0.93,aformat=sample_rates=48000:channel_layouts=stereo,
 afade=t=out:st=33.2:d=0.7,atrim=0:33.9" $OUT
rm -rf $TMP; echo "trilha: $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 $OUT)s)"
