#!/usr/bin/env bash
# Uso: analisar_cortes.sh <video> [saida_dir] [limiar=0.30]
# Detecta cortes (mudança de cena), calcula duração dos takes e gera uma folha de contato
# com o primeiro frame de cada take. Serve de base para a timeline da referência.
set -euo pipefail
V="${1:?uso: analisar_cortes.sh <video> [saida_dir] [limiar]}"
OUT="${2:-./analise_$(basename "${V%.*}")}"
TH="${3:-0.30}"
mkdir -p "$OUT/frames"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
RES=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of csv=p=0 "$V")
ffmpeg -hide_banner -i "$V" -vf "select='gt(scene,$TH)',showinfo" -an -f null - 2>&1 \
  | grep -o 'pts_time:[0-9.]*' | cut -d: -f2 > "$OUT/cortes.txt" || true
python3 -I - "$DUR" "$OUT/cortes.txt" <<'PY' | tee "$OUT/timeline.md"
import sys
dur=float(sys.argv[1]); cuts=[0.0]+[float(x) for x in open(sys.argv[2]).read().split()]+[dur]
cuts=sorted(set(round(c,2) for c in cuts))
takes=[(a,b,b-a) for a,b in zip(cuts,cuts[1:]) if b-a>0.05]
print(f"Duração: {dur:.2f}s | takes: {len(takes)} | duração média do take: {dur/len(takes):.2f}s")
print("| # | início | fim | duração |\n|---|---|---|---|")
for i,(a,b,d) in enumerate(takes,1): print(f"| {i} | {a:.2f} | {b:.2f} | {d:.2f}s |")
print("\nAviso: detecção automática. Zooms, whips e speed ramps contínuos podem não gerar corte; cortes escondidos por whip/flash podem sair imprecisos. Conferir na folha de contato.")
PY
i=0; for t in $(python3 -I -c "
import sys
c=[0.0]+[float(x) for x in open('$OUT/cortes.txt').read().split()]
print(' '.join(f'{x+0.05:.2f}' for x in sorted(set(c))))"); do
  i=$((i+1)); ffmpeg -loglevel error -y -ss "$t" -i "$V" -frames:v 1 -vf scale=270:-1 "$OUT/frames/$(printf %03d $i).png"
done
ffmpeg -loglevel error -y -framerate 1 -i "$OUT/frames/%03d.png" -vf "tile=8x0:padding=4" -frames:v 1 "$OUT/folha_de_contato.png" 2>/dev/null || true
echo "Resolução/fps: $RES"; echo "Saída em: $OUT"
