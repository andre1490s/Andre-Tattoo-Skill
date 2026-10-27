#!/usr/bin/env python3
"""
Gerador de carrosséis editoriais — André Tattoo.
Padrão visual de contexto/marca.md: fundo escuro, serifada creme, acento dourado,
texto no canto superior esquerdo, rodapé "ANDRE TATTOO". Formato 4:5 (1080x1350).

Uso:  python3 -I gerar.py config.json saida/
A tattoo NUNCA é alterada: só escurecimento e neutralização de dominante de cor.
"""
import json, sys, os, re
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

W, H = 1080, 1350
CREME   = (239, 230, 214)
DOURADO = (201, 162, 80)
APAGADO = (176, 168, 156)
ESCURO  = (12, 12, 11)
FD = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fontes')

def F(nome, tam):
    return ImageFont.truetype(os.path.join(FD, nome), tam)

def tratar(path, foco=0.5, forca=0.78):
    """Corta 4:5, neutraliza dominante de cor (mata LED azul), escurece e aplica
    gradiente lateral para o texto respirar. A arte da tattoo não é redesenhada."""
    im = Image.open(path).convert('RGB')
    w, h = im.size
    alvo = W / H
    if w / h > alvo:
        nw = int(h * alvo); x = int((w - nw) * foco)
        im = im.crop((x, 0, x + nw, h))
    else:
        nh = int(w / alvo); y = int((h - nh) * foco)
        im = im.crop((0, y, w, y + nh))
    im = im.resize((W, H), Image.LANCZOS)
    # neutraliza dominante: mistura com a versão em cinza (preto e cinza é a promessa)
    im = Image.blend(im, im.convert('L').convert('RGB'), 0.72)
    im = ImageEnhance.Brightness(im).enhance(1 - forca * 0.42)
    im = ImageEnhance.Contrast(im).enhance(1.14)
    # leve tom quente, como a luz lateral do padrão editorial
    r, g, b = im.split()
    im = Image.merge('RGB', (r.point(lambda v: min(255, int(v*1.06))), g,
                             b.point(lambda v: int(v*0.95))))
    # gradiente escuro da esquerda e do rodapé
    gl = Image.new('L', (W, H), 0); d = ImageDraw.Draw(gl)
    for x in range(W):
        d.line([(x,0),(x,H)], fill=int(236 * max(0.0, 1 - (x / (W*0.80)))**1.45))
    im = Image.composite(Image.new('RGB',(W,H),ESCURO), im, gl)
    gb = Image.new('L', (W, H), 0); d = ImageDraw.Draw(gb)
    for y in range(H):
        t = max(0.0, (y - H*0.60) / (H*0.40))
        d.line([(0,y),(W,y)], fill=int(205 * t**1.5))
    im = Image.composite(Image.new('RGB',(W,H),ESCURO), im, gb)
    # painel suave atras da coluna de texto: garante leitura sem apagar a tattoo
    pn = Image.new('L', (W, H), 0); d = ImageDraw.Draw(pn)
    d.rectangle([0, 150, 700, 1010], fill=118)
    pn = pn.filter(ImageFilter.GaussianBlur(120))
    im = Image.composite(Image.new('RGB',(W,H),ESCURO), im, pn)
    return im

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

def espacado(d, xy, txt, fonte, fill, esp=4):
    x, y = xy
    for c in txt:
        d.text((x, y), c, font=fonte, fill=fill)
        x += d.textlength(c, font=fonte) + esp
    return x

def moldura(d):
    m, r = 34, 14
    d.rectangle([m, m, W-m, H-m], outline=(150,122,64), width=2)
    for (cx, cy, sx, sy) in [(m,m,1,1), (W-m,m,-1,1), (m,H-m,1,-1), (W-m,H-m,-1,-1)]:
        d.line([(cx+sx*r, cy+sy*r*0), (cx+sx*r, cy+sy*r)], fill=DOURADO, width=2)
        d.line([(cx+sx*r*0, cy+sy*r), (cx+sx*r, cy+sy*r)], fill=DOURADO, width=2)

def slide(cfg, n, total, out):
    im = tratar(cfg['imagem'], cfg.get('foco', 0.5), cfg.get('escuro', 0.78))
    d = ImageDraw.Draw(im)
    moldura(d)
    X, larg = 86, 560

    # selo N/total
    f_num = F('inter.ttf', 26)
    cx = f"{n}/{total}"
    tw = d.textlength(cx, font=f_num)
    d.rectangle([X, 92, X + tw + 36, 92 + 52], outline=(150,122,64), width=2)
    d.text((X + 18, 92 + 12), cx, font=f_num, fill=CREME)
    espacado(d, (X, 92 + 68), 'ANDRÉ TATTOO', F('inter.ttf', 17), (150,142,130), 2.4)

    y = 236
    if cfg.get('etiqueta'):
        espacado(d, (X, y), cfg['etiqueta'].upper(), F('inter.ttf', 21), DOURADO, 5.5)
        y += 62

    # título: palavra entre *asteriscos* sai em cursiva dourada
    f_tit = F('pf-bold.ttf', cfg.get('tam_titulo', 82))
    f_it  = F('cormorant-italic.ttf', int(cfg.get('tam_titulo', 82) * 1.17))
    partes = []
    for m in re.finditer(r'\*([^*]+)\*([^\s*]*)|([^*]+)', cfg['titulo']):
        if m.group(1) is not None:
            partes.append(((m.group(1) + (m.group(2) or '')).strip(), True))
        elif m.group(3) and m.group(3).strip():
            partes.append((m.group(3).strip(), False))

    linha, linhas = [], []
    for txt, it in partes:
        for pal in txt.split():
            f = f_it if it else f_tit
            tent = linha + [(pal, it, f)]
            lw = sum(d.textlength(w, font=ff) for w,_,ff in tent) + 14*(len(tent)-1)
            if lw <= larg or not linha: linha = tent
            else: linhas.append(linha); linha = [(pal, it, f)]
    if linha: linhas.append(linha)

    lh = int(cfg.get('tam_titulo', 82) * 1.17)
    for ln in linhas:
        x = X
        for pal, it, f in ln:
            dy = int(lh*0.10) if it else 0
            d.text((x, y - dy), pal, font=f, fill=DOURADO if it else CREME)
            x += d.textlength(pal, font=f) + 14
        y += lh
    y += 14

    d.line([(X, y), (X + 112, y)], fill=DOURADO, width=2); y += 40

    if cfg.get('texto'):
        f_tx = F('inter.ttf', 31)
        for ln in quebrar(d, cfg['texto'], f_tx, larg):
            d.text((X, y), ln, font=f_tx, fill=APAGADO); y += 46

    if cfg.get('cta'):
        f_c = F('inter.ttf', 27)
        tw = d.textlength(cfg['cta'], font=f_c)
        bx, by, bh = X, H - 212, 68
        d.rounded_rectangle([bx, by, bx + tw + 58, by + bh], radius=34,
                            outline=DOURADO, width=2, fill=(16,16,14))
        d.text((bx + 29, by + 19), cfg['cta'], font=f_c, fill=CREME)

    f_rod = F('inter.ttf', 20)
    lrg = sum(d.textlength(c, font=f_rod) + 7 for c in 'ANDRE TATTOO') - 7
    espacado(d, ((W - lrg)/2, H - 92), 'ANDRE TATTOO', f_rod, (168,158,144), 7)

    im.save(out, quality=95)
    return out

if __name__ == '__main__':
    cfgp, outd = sys.argv[1], sys.argv[2]
    cfg = json.load(open(cfgp, encoding='utf-8'))
    os.makedirs(outd, exist_ok=True)
    n = len(cfg['slides'])
    for i, s in enumerate(cfg['slides'], 1):
        p = os.path.join(outd, f"{i:02d}.jpg")
        slide(s, i, n, p)
        print('ok', p)
