"""Tira a logo do fundo preto e grava os PNGs de marca d'agua.

A logo e luz sobre preto, entao o canal alfa sai da propria luminancia.
O RGB e des-premultiplicado para a borda nao escurecer sobre foto clara.
As versoes de marca d'agua levam uma curva de gama no alfa: sem isso as
facetas cinza somem na composicao e sobra so um fio de contorno.

Sai em duas familias: so o A (emblema) e a logo completa, com o nome.
"""
from PIL import Image
import numpy as np
import os

ORIGEM = "/root/.claude/uploads/588b166d-8152-50ba-86f1-d3fa614ccb65/e1714b41-image.jpg"
DESTINO = "/home/user/Andre-Tattoo-Skill/marca"
SO_O_A = (0, 0, 832, 800)          # o nome ANDRE comeca depois disso
PRETO, BRANCO = 10, 205            # ponto preto e ponto branco da chave
PISO = 10                          # alfa abaixo disso e ruido de JPEG
GAMA = 0.55                        # reforco das facetas nas marcas d'agua
LARGURA_MINIMA = 12                # linha mais estreita que isso e so a agulha

os.makedirs(DESTINO, exist_ok=True)


def chave(corte=None):
    """Separa a logo do preto e devolve (cor, alfa)."""
    im = Image.open(ORIGEM).convert("RGB")
    if corte:
        im = im.crop(corte)
    rgb = np.asarray(im, dtype=np.float64)
    lum = rgb @ np.array([0.2126, 0.7152, 0.0722])

    alfa = np.clip((lum - PRETO) / (BRANCO - PRETO), 0, 1)
    alfa[alfa * 255 < PISO] = 0

    # des-premultiplica: a cor volta ao tom cheio, so o alfa controla a presenca
    cor = np.zeros_like(rgb)
    onde = alfa > 0
    cor[onde] = np.clip(rgb[onde] / alfa[onde, None], 0, 255)
    return cor, alfa


def grava(nome, canais, a, escala=1.0, gama=1.0, aparar=None):
    a = np.clip(a, 0, 1) ** gama * escala
    dados = np.dstack([canais, np.clip(a, 0, 1) * 255]).astype(np.uint8)
    img = Image.fromarray(dados, "RGBA")
    if aparar:
        img = img.crop((0, aparar[0], img.width, aparar[1]))
    img = img.crop(img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    caminho = os.path.join(DESTINO, nome)
    img.save(caminho)
    print("%-32s %3dx%4d  %4.0f KB" % (nome, img.width, img.height,
                                       os.path.getsize(caminho) / 1024))


def familia(corte, sufixo, aparar_pontas):
    cor, alfa = chave(corte)
    branco = np.full_like(cor, 255.0)
    preto = np.zeros_like(cor)

    aparar = None
    if aparar_pontas:
        # linhas com corpo: descarta as pontas de brilho e o fio da agulha
        corpo = (alfa > 0.1).sum(axis=1) >= LARGURA_MINIMA
        aparar = (int(np.argmax(corpo)), len(corpo) - int(np.argmax(corpo[::-1])))

    # arquivos-mestre, opacidade cheia
    grava("logo-%s.png" % sufixo, cor, alfa)
    grava("logo-%s-branco.png" % sufixo, branco, alfa)
    grava("logo-%s-preto.png" % sufixo, preto, alfa)

    # prontas para usar, com a transparencia ja embutida
    grava("marca-dagua-%s-branca.png" % sufixo, branco, alfa, 0.40, GAMA, aparar)
    grava("marca-dagua-%s-preta.png" % sufixo, preto, alfa, 0.30, GAMA, aparar)


familia(SO_O_A, "a", aparar_pontas=True)
familia(None, "completa", aparar_pontas=False)
