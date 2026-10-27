"""Vetorizador por niveis: posteriza em bandas de luminancia, tracca o contorno
de cada banda e emite SVG. Bordas ficam nitidas em qualquer tamanho e o
degrade cromado da marca e preservado em camadas."""
import sys, numpy as np
sys.setrecursionlimit(50000)
from PIL import Image, ImageFilter

SRC, OUT = sys.argv[1], sys.argv[2]
UP     = int(sys.argv[3]) if len(sys.argv) > 3 else 6     # fator de supersampling
LEVELS = [20, 38, 56, 74, 92, 110, 128, 146, 164, 182, 200, 216, 232, 244]
EPS    = 1.5                                               # simplificacao (px @ UP)

im = Image.open(SRC).convert('L')
W0, H0 = im.size
im = im.resize((W0*UP, H0*UP), Image.LANCZOS).filter(ImageFilter.GaussianBlur(UP*0.20))
g = np.asarray(im, dtype=np.int16)
H, W = g.shape

# --- rastreio de contorno (Moore) sobre a mascara binaria ---
NB = [(-1,0),(-1,1),(0,1),(1,1),(1,0),(1,-1),(0,-1),(-1,-1)]   # horario a partir do norte
def contours(mask):
    m = np.zeros((H+2, W+2), dtype=bool); m[1:-1,1:-1] = mask
    seen = np.zeros_like(m)
    out = []
    ys, xs = np.nonzero(m & ~np.roll(m, 1, axis=0))            # borda superior de cada regiao
    for y, x in zip(ys, xs):
        if seen[y, x]: continue
        pts, cy, cx, bdir = [], y, x, 6
        start = (y, x)
        for _ in range(400000):
            seen[cy, cx] = True
            pts.append((cx, cy))
            found = False
            for k in range(8):
                d = (bdir + 1 + k) % 8
                ny, nx = cy + NB[d][0], cx + NB[d][1]
                if m[ny, nx]:
                    bdir = (d + 5) % 8
                    cy, cx = ny, nx
                    found = True
                    break
            if not found or (cy, cx) == start and len(pts) > 2:
                break
        if len(pts) > 14:
            out.append(np.array(pts, dtype=float))
    return out

# --- Douglas-Peucker ---
def dp(p, eps):
    if len(p) < 3: return p
    a, b = p[0], p[-1]; ab = b - a; L = np.hypot(*ab)
    if L < 1e-9:
        d = np.hypot(*(p - a).T)
    else:
        q = p - a
        d = np.abs(ab[0]*q[:,1] - ab[1]*q[:,0]) / L
    i = int(np.argmax(d))
    if d[i] > eps:
        return np.vstack([dp(p[:i+1], eps)[:-1], dp(p[i:], eps)])
    return np.vstack([a, b])

# --- polilinha fechada -> path de quadraticas pelos pontos medios ---
def path(p, s):
    p = p * s
    if len(p) < 3: return ''
    mids = (p + np.roll(p, -1, axis=0)) / 2
    d = [f'M{mids[-1,0]:.2f},{mids[-1,1]:.2f}']
    for i in range(len(p)):
        d.append(f'Q{p[i,0]:.2f},{p[i,1]:.2f} {mids[i,0]:.2f},{mids[i,1]:.2f}')
    return ' '.join(d) + 'Z'

s = 1.0 / UP
parts = []
for L in LEVELS:
    cs = contours(g >= L)
    ds = ' '.join(path(dp(c, EPS), s) for c in cs if len(c) > 14)
    if ds.strip():
        parts.append(f'<path fill="#{L:02x}{L:02x}{L:02x}" fill-rule="evenodd" d="{ds}"/>')

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W0} {H0}" width="{W0}" height="{H0}">'
       f'<defs><clipPath id="c"><circle cx="{W0/2}" cy="{H0/2}" r="{W0/2-1}"/></clipPath></defs>'
       f'<g clip-path="url(#c)"><rect width="{W0}" height="{H0}" fill="#000"/>'
       + ''.join(parts) + '</g></svg>')
open(OUT, 'w').write(svg)
print(f'{OUT}: {len(parts)} niveis, {len(svg)//1024} KB')
