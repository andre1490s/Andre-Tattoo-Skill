#!/usr/bin/env python3
"""
Gerador de carrosseis editoriais do Andre Tattoo.
Padrao visual de contexto/marca.md: fundo escuro, serifada creme, acento dourado,
rodape sem assinatura. Saida 1440x1800 (4:5), alta resolucao.

Uso:  python3 -I gerar.py config.json saida/

Campos por slide:
  imagem    caminho da foto
  recorte   [cx, cy, largura] em pixels da foto original, para dar zoom num detalhe
  foco      0..1, usado quando nao ha recorte (enquadramento vertical ou horizontal)
  posicao   sup-esq | inf-esq | sup-dir | inf-dir  (varia para o carrossel nao repetir)
  etiqueta  linha pequena em caixa alta
  titulo    palavra entre *asteriscos* sai em cursiva dourada
  texto     corpo
  escuro    0..1, forca do escurecimento

A tattoo nunca e redesenhada: so luz, cor e enquadramento.
"""
import json, sys, os, re
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

FORMATOS = {'feed': (1440, 1800), 'story': (1080, 1920)}
W, H = FORMATOS['feed']
E = 1.0                             # escala em relacao ao projeto original (1080 de largura)
CREME, DOURADO = (239, 230, 214), (201, 162, 80)
APAGADO, ESCURO = (178, 170, 158), (12, 12, 11)
FD = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fontes')
F = lambda n, t: ImageFont.truetype(os.path.join(FD, n), int(t * E))

def usar_formato(nome):
    global W, H, E
    W, H = FORMATOS[nome]
    E = W / 1080.0

def tratar(cfg):
    im = Image.open(cfg['imagem']).convert('RGB')
    rec = cfg.get('recorte')
    if rec:
        cx, cy, lw = rec; lh = int(lw * H / W)
        x0, y0 = max(0, cx - lw // 2), max(0, cy - lh // 2)
        x1, y1 = min(im.width, x0 + lw), min(im.height, y0 + lh)
        im = im.crop((x0, y0, x1, y1))
    else:
        w, h = im.size; alvo = W / H; foco = cfg.get('foco', 0.5)
        if w / h > alvo:
            nw = int(h * alvo); x = int((w - nw) * foco); im = im.crop((x, 0, x + nw, h))
        else:
            nh = int(w / alvo); y = int((h - nh) * foco); im = im.crop((0, y, w, y + nh))
    im = im.resize((W, H), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=58, threshold=3))
    im = Image.blend(im, im.convert('L').convert('RGB'), 0.70)
    f = cfg.get('escuro', 0.78)
    im = ImageEnhance.Brightness(im).enhance(1 - f * 0.42)
    im = ImageEnhance.Contrast(im).enhance(1.15)
    r, g, b = im.split()
    im = Image.merge('RGB', (r.point(lambda v: min(255, int(v * 1.06))), g,
                             b.point(lambda v: int(v * 0.95))))
    if cfg.get('formato') == 'story':
        g = Image.new('L', (W, H), 0); d = ImageDraw.Draw(g)
        for y in range(H):
            t = min(1.0, max(0.0, (y - H * 0.30) / (H * 0.32)))
            d.line([(0, y), (W, y)], fill=int(250 * t))
        im = Image.composite(Image.new('RGB', (W, H), ESCURO), im, g)
        gt = Image.new('L', (W, H), 0); d = ImageDraw.Draw(gt)
        for y in range(int(H * 0.22)):
            d.line([(0, y), (W, y)], fill=int(150 * (1 - y / (H * 0.22)) ** 1.5))
        return Image.composite(Image.new('RGB', (W, H), ESCURO), im, gt)
    pos = cfg.get('posicao', 'sup-esq')
    dire, vert = pos.split('-')[1], pos.split('-')[0]
    g1 = Image.new('L', (W, H), 0); d = ImageDraw.Draw(g1)
    for x in range(W):
        t = (1 - x / (W * 0.82)) if dire == 'esq' else ((x - W * 0.18) / (W * 0.82))
        d.line([(x, 0), (x, H)], fill=int(228 * max(0.0, t) ** 1.45))
    im = Image.composite(Image.new('RGB', (W, H), ESCURO), im, g1)
    g2 = Image.new('L', (W, H), 0); d = ImageDraw.Draw(g2)
    for y in range(H):
        t = (1 - y / (H * 0.55)) if vert == 'sup' else ((y - H * 0.45) / (H * 0.55))
        d.line([(0, y), (W, y)], fill=int(150 * max(0.0, t) ** 1.6))
    im = Image.composite(Image.new('RGB', (W, H), ESCURO), im, g2)
    return im

def partir(titulo):
    out = []
    for m in re.finditer(r'\*([^*]+)\*([^\s*]*)|([^*]+)', titulo):
        if m.group(1) is not None:
            out.append(((m.group(1) + (m.group(2) or '')).strip(), True))
        elif m.group(3) and m.group(3).strip():
            out.append((m.group(3).strip(), False))
    return out

def quebrar(d, txt, fonte, larg):
    linhas, atual = [], ''
    for p in txt.split():
        t = (atual + ' ' + p).strip()
        if d.textlength(t, font=fonte) <= larg: atual = t
        else:
            if atual: linhas.append(atual)
            atual = p
    if atual: linhas.append(atual)
    return linhas

def espacado(d, xy, txt, fonte, fill, esp):
    x, y = xy
    for c in txt:
        d.text((x, y), c, font=fonte, fill=fill); x += d.textlength(c, font=fonte) + esp
    return x

def slide(cfg, out):
    im = tratar(cfg); d = ImageDraw.Draw(im)
    m = int(34 * E); r = int(14 * E)
    d.rectangle([m, m, W - m, H - m], outline=(150, 122, 64), width=2)
    for (cx, cy, sx, sy) in [(m,m,1,1), (W-m,m,-1,1), (m,H-m,1,-1), (W-m,H-m,-1,-1)]:
        d.line([(cx + sx*r, cy), (cx + sx*r, cy + sy*r)], fill=DOURADO, width=2)
        d.line([(cx, cy + sy*r), (cx + sx*r, cy + sy*r)], fill=DOURADO, width=2)

    story = cfg.get('formato') == 'story'
    if story:
        larg, X = int(880 * E), int(100 * E)
    else:
        pos = cfg.get('posicao', 'sup-esq')
        vert, dire = pos.split('-')
        larg = int(560 * E)
        X = int(86 * E) if dire == 'esq' else W - int(86 * E) - larg

    tam = cfg.get('tam_titulo', 78)
    f_et = F('inter.ttf', 21); f_ti = F('pf-bold.ttf', tam)
    f_it = F('cormorant-italic.ttf', int(tam * 1.17)); f_tx = F('inter.ttf', 31)
    lh = int(tam * 1.17 * E); lhx = int(46 * E)

    linha, linhas = [], []
    for txt, it in partir(cfg['titulo']):
        for pal in txt.split():
            f = f_it if it else f_ti
            tent = linha + [(pal, it, f)]
            if sum(d.textlength(w, font=ff) for w, _, ff in tent) + 14*E*(len(tent)-1) <= larg or not linha:
                linha = tent
            else:
                linhas.append(linha); linha = [(pal, it, f)]
    if linha: linhas.append(linha)
    corpo = quebrar(d, cfg['texto'], f_tx, larg) if cfg.get('texto') else []

    alt = (int(62*E) if cfg.get('etiqueta') else 0) + len(linhas)*lh + int(54*E) + len(corpo)*lhx
    if story:
        alt += int(150 * E) if cfg.get('cta') else 0
        y = H - int(430 * E) - alt          # deixa a faixa inferior livre para o sticker de link
    else:
        y = int(168 * E) if vert == 'sup' else H - int(150 * E) - alt

    if cfg.get('etiqueta'):
        espacado(d, (X, y), cfg['etiqueta'].upper(), f_et, DOURADO, 5.5 * E)
        y += int(62 * E)
    for ln in linhas:
        x = X
        for pal, it, f in ln:
            d.text((x, y - (int(lh*0.10) if it else 0)), pal, font=f,
                   fill=DOURADO if it else CREME)
            x += d.textlength(pal, font=f) + 14 * E
        y += lh
    y += int(14 * E)
    d.line([(X, y), (X + int(112*E), y)], fill=DOURADO, width=2)
    y += int(40 * E)
    for ln in corpo:
        d.text((X, y), ln, font=f_tx, fill=APAGADO); y += lhx

    if cfg.get('cta'):
        y += int(44 * E)
        f_c = F('inter.ttf', 33)
        tw = d.textlength(cfg['cta'], font=f_c)
        bh = int(86 * E)
        d.rounded_rectangle([X, y, X + tw + int(76*E), y + bh], radius=int(43*E),
                            outline=DOURADO, width=3, fill=(18, 17, 15))
        d.text((X + int(38*E), y + int(24*E)), cfg['cta'], font=f_c, fill=CREME)

    im.save(out, quality=96, subsampling=0)
    return out

if __name__ == '__main__':
    cfg = json.load(open(sys.argv[1], encoding='utf-8')); outd = sys.argv[2]
    os.makedirs(outd, exist_ok=True)
    for i, s in enumerate(cfg['slides'], 1):
        usar_formato(s.get('formato', 'feed'))
        print('ok', slide(s, os.path.join(outd, f"{i:02d}.jpg")))
