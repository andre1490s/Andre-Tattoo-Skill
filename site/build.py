#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build.py — grava no index.html o que antes so existia depois do JavaScript rodar.

POR QUE EXISTE
  A galeria e as duvidas eram montadas por js/main.js a partir de js/dados.js.
  Quem le a pagina sem executar JavaScript (Google Imagens e os rastreadores de
  ChatGPT, Gemini e Perplexity) via duas caixas vazias: o portfolio inteiro, que
  e o maior ativo comercial do site, ficava de fora.

O QUE FAZ
  1. grava a galeria e as duvidas dentro do index.html, entre marcadores
  2. grava o JSON-LD do FAQ no HTML, em vez de injetar por JS
  3. acrescenta as fotos ao sitemap.xml, no padrao image:image do Google

COMO USAR
  python3 site/build.py        depois de qualquer mudanca em js/dados.js

  Esquecer de rodar nao quebra nada: o main.js percebe que o HTML esta
  diferente do dados.js e volta a montar a galeria sozinho, como antes. So o
  ganho de SEO daquela foto fica adiado ate o build rodar.
"""
import io, os, re, json, datetime

RAIZ = os.path.dirname(os.path.abspath(__file__))
# 3 colunas no computador (~380px) e 2 no celular (meia tela). Se o layout da
# galeria mudar em css/style.css, este valor muda junto.
SIZES_GALERIA = '(max-width:900px) 50vw, 380px'
def caminho(*p): return os.path.join(RAIZ, *p)

# ---------------------------------------------------------------- dimensoes
def tamanho_webp(arq):
    """Largura e altura de um .webp, sem depender de biblioteca externa."""
    with open(arq, 'rb') as f:
        d = f.read(32)
    if d[:4] != b'RIFF' or d[8:12] != b'WEBP':
        raise ValueError('nao e webp: %s' % arq)
    fmt = d[12:16]
    if fmt == b'VP8 ':
        return (int.from_bytes(d[26:28], 'little') & 0x3FFF,
                int.from_bytes(d[28:30], 'little') & 0x3FFF)
    if fmt == b'VP8L':
        n = int.from_bytes(d[21:25], 'little')
        return ((n & 0x3FFF) + 1, ((n >> 14) & 0x3FFF) + 1)
    if fmt == b'VP8X':
        return (int.from_bytes(d[24:27], 'little') + 1,
                int.from_bytes(d[27:30], 'little') + 1)
    raise ValueError('formato webp desconhecido: %s' % fmt)

# ---------------------------------------------------------------- leitura
def ler_dados():
    s = io.open(caminho('js', 'dados.js'), encoding='utf-8').read()

    b = re.search(r'trabalhos:\s*\[(.*?)\n  \]', s, re.S)
    if not b: raise SystemExit('ERRO: array "trabalhos" nao encontrado em dados.js')
    trabalhos = [{'img': m.group(1), 'cap': m.group(2), 'alt': m.group(3)}
                 for m in re.finditer(
                     r'\{\s*img:"([^"]+)"\s*,\s*cap:"([^"]+)"\s*,\s*alt:"([^"]+)"\s*\}', b.group(1))]

    b = re.search(r'duvidas:\s*\[(.*?)\n  \]', s, re.S)
    if not b: raise SystemExit('ERRO: array "duvidas" nao encontrado em dados.js')
    duvidas = [{'p': m.group(1), 'r': m.group(2)} for m in re.finditer(
        r'\{\s*p:"([^"]+)"\s*,\s*\n?\s*r:"((?:[^"\\]|\\.)*)"\s*\}', b.group(1), re.S)]

    if not trabalhos: raise SystemExit('ERRO: nenhum trabalho lido do dados.js')
    if not duvidas:   raise SystemExit('ERRO: nenhuma duvida lida do dados.js')
    return trabalhos, duvidas

def esc(t):
    return (t.replace('&', '&amp;').replace('<', '&lt;')
             .replace('>', '&gt;').replace('"', '&quot;'))

# ---------------------------------------------------------------- geracao
def html_galeria(trabalhos):
    """Mesmo HTML que o main.js produzia, mais width e height lidos do arquivo.
       As dimensoes acabam com o salto de layout enquanto a foto carrega (CLS)."""
    out = []
    for i, o in enumerate(trabalhos):
        arq = caminho('img', o['img'] + '.webp')
        if not os.path.exists(arq):
            raise SystemExit('ERRO: falta a imagem %s, citada em dados.js' % arq)
        w, h = tamanho_webp(arq)
        # versao de 600px para o celular, que mostra a foto em meia tela. O
        # lightbox continua abrindo o arquivo grande, que fica no src.
        pequena = caminho('img', o['img'] + '-600.webp')
        if not os.path.exists(pequena):
            raise SystemExit('ERRO: falta %s' % pequena)
        srcset = (' srcset="img/%s-600.webp 600w, img/%s.webp %dw" sizes="%s"'
                  % (esc(o['img']), esc(o['img']), w, SIZES_GALERIA))
        out.append(
            '<button class="work reveal" data-cap="%s">'
            '<img src="img/%s.webp"%s alt="%s" width="%d" height="%d"%s decoding="async">'
            '<span class="cap">%s</span></button>'
            % (esc(o['cap']), esc(o['img']), srcset, esc(o['alt']), w, h,
               ' loading="lazy"' if i else '', esc(o['cap'].split('·')[-1].strip())))
    return '\n        '.join(out)

def html_duvidas(duvidas):
    return '\n        '.join(
        '<details class="acc__item reveal"><summary><span>%s</span>'
        '<i aria-hidden="true"></i></summary><div class="acc__corpo"><p>%s</p></div></details>'
        % (esc(d['p']), d['r']) for d in duvidas)

def jsonld_faq(duvidas):
    return json.dumps({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        'mainEntity': [{'@type': 'Question', 'name': d['p'],
                        'acceptedAnswer': {'@type': 'Answer',
                                           'text': re.sub(r'<[^>]+>', '', d['r'])}}
                       for d in duvidas]}, ensure_ascii=False, indent=1)

def trocar(s, marca, conteudo, recuo='        '):
    ini, fim = '<!--%s:inicio-->' % marca, '<!--%s:fim-->' % marca
    pad = re.compile(re.escape(ini) + '.*?' + re.escape(fim), re.S)
    if not pad.search(s):
        raise SystemExit('ERRO: marcadores de "%s" nao encontrados' % marca)
    return pad.sub(lambda _: '%s\n%s%s\n%s%s' % (ini, recuo, conteudo, recuo, fim), s)

def imagens_sitemap(trabalhos):
    return '\n'.join(
        '    <image:image><image:loc>https://andretattoo.com.br/img/%s.webp</image:loc>'
        '<image:title>%s</image:title><image:caption>%s</image:caption></image:image>'
        % (esc(o['img']), esc(o['cap'].replace('·', '-')), esc(o['alt'])) for o in trabalhos)

# ---------------------------------------------------------------- escrita
def miniaturas(trabalhos):
    """Gera img/<nome>-600.webp para cada foto do portfolio que ainda nao tem."""
    from PIL import Image
    for o in trabalhos:
        src = caminho('img', o['img'] + '.webp'); dst = caminho('img', o['img'] + '-600.webp')
        if os.path.exists(dst): continue
        im = Image.open(src); w, h = im.size
        im.resize((600, round(h * 600 / w)), Image.LANCZOS).save(dst, 'WEBP', quality=82, method=6)
        print('miniatura    %s' % os.path.basename(dst))

def main():
    trabalhos, duvidas = ler_dados()
    miniaturas(trabalhos)   # foto nova ganha a versao de 600px sozinha

    p = caminho('index.html')
    s = io.open(p, encoding='utf-8').read()
    s = trocar(s, 'galeria', html_galeria(trabalhos))
    s = trocar(s, 'duvidas', html_duvidas(duvidas))
    s = trocar(s, 'faq-schema',
               '<script type="application/ld+json">\n%s\n</script>' % jsonld_faq(duvidas), '')
    io.open(p, 'w', encoding='utf-8').write(s)
    print('index.html   %d fotos e %d duvidas no HTML, FAQ schema no HTML'
          % (len(trabalhos), len(duvidas)))

    p = caminho('sitemap.xml')
    s = io.open(p, encoding='utf-8').read()
    s = trocar(s, 'imagens', imagens_sitemap(trabalhos), '')
    s = re.sub(r'<lastmod>\d{4}-\d{2}-\d{2}</lastmod>',
               '<lastmod>%s</lastmod>' % datetime.date.today().isoformat(), s)
    io.open(p, 'w', encoding='utf-8').write(s)
    print('sitemap.xml  %d imagens declaradas, lastmod de hoje' % len(trabalhos))

if __name__ == '__main__':
    main()
