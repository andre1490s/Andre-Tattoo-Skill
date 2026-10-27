#!/usr/bin/env bash
# Desenho de som sintetizado (sem trilha licenciada). Saida: saida/trilha.wav — 25,0 s, 48 kHz, estereo.
set -e
cd "$(dirname "$0")"; OUT=../saida/trilha.wav; TMP=$(mktemp -d)
mk(){ ffmpeg -v error -y "$@"; }

# leito: drone grave + ar
mk -f lavfi -i "sine=f=48:d=25" -f lavfi -i "sine=f=72.5:d=25" -f lavfi -i "anoisesrc=d=25:c=pink:a=0.06" \
  -filter_complex "[0:a]volume=0.19[a];[1:a]volume=0.095[b];[2:a]highpass=f=1800,lowpass=f=9000,volume=0.05[c];
   [a][b][c]amix=inputs=3:normalize=0,afade=t=in:st=0:d=1.3,afade=t=out:st=23.6:d=1.4" $TMP/bed.wav

# teclas: Pinterest (34 em 0,55->3,20) e Instagram (15 em 13,25->14,45)
CI=""; CF=""; KM=""; n=0
addkey(){ # $1=arquivo $2=tempo
  CI="$CI -i $1"; d=$(python3 -c "print(int($2*1000))")
  CF="$CF[$((n+1)):a]adelay=$d|$d[k$n];"; KM="$KM[k$n]"; n=$((n+1)); }
for i in $(seq 0 33); do
  mk -f lavfi -i "sine=f=$((1550+(i*53)%420)):d=0.034" -af "volume=0.15,afade=t=out:st=0.005:d=0.028" $TMP/pk$i.wav
  addkey $TMP/pk$i.wav "$(python3 -c "print(f'{0.55+$i*0.0779:.3f}')")"
done
for i in $(seq 0 13); do
  mk -f lavfi -i "sine=f=$((1700+(i*61)%380)):d=0.032" -af "volume=0.13,afade=t=out:st=0.005:d=0.026" $TMP/ik$i.wav
  addkey $TMP/ik$i.wav "$(python3 -c "print(f'{13.25+$i*0.0857:.3f}')")"
done

# eventos
mk -f lavfi -i "sine=f=430:d=0.5"   -af "volume=0.26,afade=t=out:st=0.03:d=0.45,aecho=0.7:0.6:55:0.3"                 $TMP/e_enter.wav
mk -f lavfi -i "anoisesrc=d=1.1:c=white:a=0.5" -af "highpass=f=500,lowpass=f=7000,volume=0.16,afade=t=in:st=0:d=0.55,afade=t=out:st=0.6:d=0.45" $TMP/e_load.wav
mk -f lavfi -i "sine=f=2100:d=0.05" -af "volume=0.17,afade=t=out:st=0.008:d=0.04"                                      $TMP/e_click.wav
mk -f lavfi -i "sine=f=150:d=1.0"   -af "volume=0.30,afade=t=out:st=0.05:d=0.92"                                       $TMP/e_sheet.wav
mk -f lavfi -i "anoisesrc=d=1.8:c=white:a=0.5" -af "highpass=f=180,lowpass=f=5200,volume=0.23,afade=t=in:st=0:d=1.0,afade=t=out:st=1.05:d=0.7" $TMP/e_pull.wav
mk -f lavfi -i "sine=f=88:d=2.2"    -af "volume=0.36,afade=t=in:st=0:d=0.04,afade=t=out:st=0.2:d=1.95"                 $TMP/e_sub.wav
mk -f lavfi -i "anoisesrc=d=1.0:c=white:a=0.5" -af "highpass=f=900,lowpass=f=11000,volume=0.19,afade=t=in:st=0:d=0.72,afade=t=out:st=0.74:d=0.25" $TMP/e_rise.wav
mk -f lavfi -i "sine=f=1046:d=0.9" -f lavfi -i "sine=f=1568:d=0.9" -filter_complex "[0:a]volume=0.12[x];[1:a]volume=0.07[y];[x][y]amix=inputs=2:normalize=0,afade=t=out:st=0.05:d=0.82" $TMP/e_bell.wav
mk -f lavfi -i "sine=f=660:d=1.5" -f lavfi -i "sine=f=990:d=1.5" -filter_complex "[0:a]volume=0.09[x];[1:a]volume=0.05[y];[x][y]amix=inputs=2:normalize=0,afade=t=in:st=0:d=0.3,afade=t=out:st=0.45:d=1.0" $TMP/e_sig.wav

EV=(" $TMP/e_enter.wav 3420" " $TMP/e_load.wav 4100" " $TMP/e_click.wav 7550" " $TMP/e_sheet.wav 7950"
    " $TMP/e_pull.wav 9820"  " $TMP/e_sheet.wav 10600" " $TMP/e_click.wav 11950" " $TMP/e_rise.wav 11450"
    " $TMP/e_sub.wav 12150"  " $TMP/e_bell.wav 14480" " $TMP/e_click.wav 15100" " $TMP/e_sheet.wav 15500"
    " $TMP/e_click.wav 19250" " $TMP/e_sheet.wav 19750" " $TMP/e_sub.wav 21300" " $TMP/e_sig.wav 21800"
    " $TMP/e_bell.wav 22800")
EI=""; EF=""; EM=""; m=0
for e in "${EV[@]}"; do set -- $e; EI="$EI -i $1"
  EF="$EF[$((n+1+m)):a]adelay=$2|$2[v$m];"; EM="$EM[v$m]"; m=$((m+1)); done

ffmpeg -v error -y -i $TMP/bed.wav $CI $EI -filter_complex "
 $CF $EF
 [0:a]$KM$EM amix=inputs=$((1+n+m)):normalize=0,
 alimiter=limit=0.92,aformat=sample_rates=48000:channel_layouts=stereo,
 afade=t=out:st=24.3:d=0.7,atrim=0:25" $OUT
rm -rf $TMP; echo "trilha: $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 $OUT)s)"
