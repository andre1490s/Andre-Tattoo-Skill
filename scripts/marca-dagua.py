"""Tira o A da logo do fundo preto e grava os PNGs de marca d'agua.

A logo e luz sobre preto, entao o canal alfa sai da propria luminancia.
O RGB e des-premultiplicado para a borda nao escurecer sobre foto clara.
As versoes de marca d'agua levam uma curva de gama no alfa: sem isso as
facetas cinza do A somem e sobra so um fio de contorno.
"""
from PIL import Image
import numpy as np
import os

ORIGEM = "/root/.claude/uploads/588b166d-8152-50ba-86f1-d3fa614ccb65/e1714b41-image.jpg"
DESTINO = "/home/user/Andre-Tattoo-Skill/marca"
CORTE_EMBLEMA = (0, 0, 832, 800)   # so o A; o nome ANDRE comeca depois disso
PRETO, BRANCO = 10, 205            # ponto preto e ponto branco da chave
PISO = 10                          # alfa abaixo disso e ruido de JPEG
GAMA = 0.55                        # reforco das facetas nas marcas d'agua
LARGURA_MINIMA = 12                # linha mais estreita que isso e so a agulha

os.makedirs(DESTINO, exist_ok=True)

im = Image.open(ORIGEM).convert("RGB").crop(CORTE_EMBLEMA)
rgb = np.asarray(im, dtype=np.float64)
lum = rgb @ np.array([0.2126, 0.7152, 0.0722])

alfa = np.clip((lum - PRETO) / (BRANCO - PRETO), 0, 1)
alfa[alfa * 255 < PISO] = 0

# des-premultiplica: a cor volta ao tom cheio, so o alfa controla a presenca
cor = np.zeros_like(rgb)
onde = alfa > 0
cor[onde] = np.clip(rgb[onde] / alfa[onde, None], 0, 255)

branco = np.full_like(rgb, 255.0)
preto = np.zeros_like(rgb)

# linhas em que o desenho tem corpo: descarta as pontas de brilho e a agulha
corpo = (alfa > 0.1).sum(axis=1) >= LARGURA_MINIMA
y0, y1 = np.argmax(corpo), len(corpo) - np.argmax(corpo[::-1])


def grava(nome, canais, a, escala=1.0, gama=1.0, so_corpo=False):
    a = np.clip(a, 0, 1) ** gama * escala
    dados = np.dstack([canais, np.clip(a, 0, 1) * 255]).astype(np.uint8)
    img = Image.fromarray(dados, "RGBA")
    if so_corpo:
        img = img.crop((0, y0, img.width, y1))
    img = img.crop(img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    caminho = os.path.join(DESTINO, nome)
    img.save(caminho)
    print("%-28s %3dx%3d  %4.0f KB" % (nome, img.width, img.height,
                                       os.path.getsize(caminho) / 1024))


# originais, opacidade cheia: sao os arquivos-mestre
grava("logo-a.png", cor, alfa)
grava("logo-a-branco.png", branco, alfa)
grava("logo-a-preto.png", preto, alfa)

# prontas para usar, ja com a transparencia embutida
grava("marca-dagua-branca.png", branco, alfa, 0.40, GAMA, so_corpo=True)
grava("marca-dagua-preta.png", preto, alfa, 0.30, GAMA, so_corpo=True)
