# Comercial "Busca" — André Tattoo

Filme publicitário 9:16 para Reels e Stories. Alguém procura tatuagem de realismo no Pinterest, encontra um trabalho do André, vai até o Instagram dele e toca no link da bio.

**Saída:** `saida/andre-tattoo-busca-9x16.mp4` — 1080×1920 · 30 fps · 24,0 s · H.264 CRF 19 · AAC 192k · 19 MB
**Prévia leve:** `saida/andre-tattoo-busca-720p.mp4` (720×1280, para WhatsApp)

| Documento | O que tem |
|---|---|
| [`ROTEIRO.md`](ROTEIRO.md) | Decupagem com tempo exato de cada cena, textos em tela e decisões de direção |
| [`STORYBOARD.md`](STORYBOARD.md) | Quadros-chave em `previews/` e grade de segurança 9:16 |
| [`PROMPTS-IA.md`](PROMPTS-IA.md) | Prompts para trocar planos por live-action (Veo, Runway, Kling) |
| [`SOM.md`](SOM.md) | Mapa de eventos sonoros e como trocar por música |

## Como foi feito
O filme inteiro é **renderizado**, não montado em editor. `build/cena.html` desenha o quadro e `build/motor.js` expõe `seek(t)`, que posiciona cada elemento a partir do instante `t`. O Playwright percorre os 720 quadros chamando `seek()` e fotografando; o ffmpeg junta tudo. O resultado é determinístico: o mesmo comando sempre produz o mesmo arquivo, e mudar um tempo é mudar um número.

```
build/cena.html   estrutura e estilo das cenas (telas do Pinterest e do Instagram, aparelho, marca)
build/motor.js    coreografia — câmera, digitação, mosaico, órbita 3D, toques, marca
build/render.mjs  Playwright: 720 PNG 1080×1920 (FROM/TO para render parcial)
build/audio.sh    trilha sintetizada com ffmpeg (sem sample licenciado)
build/build.sh    pipeline completo
assets/           fotos reais tratadas, avatar, monograma e a logo (ver abaixo)
```

## Rodar de novo
```bash
cd build && bash build.sh          # tudo
cd build && node render.mjs        # só os quadros
cd build && ONLY=6.2,13.4 node render.mjs   # só alguns quadros, para conferir
```

## As fotos
As tatuagens vêm de `site/img/portfolio/` — fotos reais, as mesmas do site. O tratamento em `assets/` é só:
1. corte **uniforme** para 3:4 (nunca esticado — nenhuma proporção é alterada),
2. reescala Lanczos para 720×960,
3. grade global: contraste +10 %, saturação 32 %, brilho −1,5 %.

Nenhum pixel de desenho, anatomia ou traço é gerado ou recomposto por IA. `assets/cards-original/` tem quatro delas sem o grade, para comparar lado a lado.

**Para trocar as fotos:** coloque as novas em `site/img/portfolio/`, rode o bloco de preparo do topo de `ROTEIRO.md` (ou repita os comandos de corte) e ajuste as listas `COLA`, `COLB`, `OF` em `build/motor.js` e a grade do perfil em `build/cena.html`.

## O que o filme não diz
Sem seguidores, publicações, avaliação, posição em ranking, "+X clientes" ou preço. O perfil mostra identidade, bio e trabalho. O pin do Pinterest não é atribuído a ninguém. Isso é decisão de direção, não limitação: número inventado em peça publicitária é o jeito mais rápido de perder a confiança que o resto do filme constrói.

## A logo
A logo real do André — o monograma do "A" com a agulha — foi reconstruída a partir dos destaques do Instagram dele, única fonte disponível e com só **148 px**.

Vetorizar o badge cromado não resolveu: reproduzir degradê exige detalhe que a fonte nunca teve, então ele continuava borrado por mais nítidas que ficassem as bordas. A solução foi **a marca em branco chapado** — sem degradê, não há o que perder. `build/vetorizar.py` traça a silhueta inteira (A, anel, agulha, fita e mira) como uma forma vetorial sólida, com limiar 24 sobre a média dos três destaques.

Saídas: `assets/logo.svg` (mestre escalável) e `assets/logo.png` a 1400 px, que é o que o filme usa. Aparece a 372 px — 3,7× sobreamostrada.

```bash
python3 -I build/vetorizar.py origem.png assets/logo.svg 8
```

Se aparecer o arquivo original da marca, basta substituir `assets/logo.png`.

## Os ícones de Pinterest e Instagram
`assets/icons/` traz os ícones oficiais recortados da imagem de referência que o André enviou, não versões desenhadas em CSS:

| Arquivo | Onde aparece |
|---|---|
| `instagram.png` | ícone do dock, com cantos arredondados em alfa |
| `instagram-glifo.png` | o traço branco da câmera, no estouro de tela cheia |
| `pinterest-marca.png` | o P branco, no cabeçalho do app |
| `pinterest-icone.png` | quadrado branco com o P vermelho, no dock |

O glifo foi extraído por **saturação** (baixa S, alto V), não por brilho — assim a sombra do ícone original fica de fora. Era ela que deixava a transição torta.

## Onde mexer no @
O filme usa **`@andretatuadoor`** (confirmado em 27/10/2026, igual a `contexto/marca.md`). Ele aparece em três pontos:
- `build/motor.js` → constante `QI` (o texto digitado na busca do Instagram)
- `build/cena.html` → `#ires .row .n` (resultado), `.ipt span` (cabeçalho do perfil) e `#handle .h` (fecho)

O pin do Pinterest **não** leva o @ nem a foto de perfil: o André não mantém conta lá, então a cena serve de gatilho da busca sem afirmar presença que não existe. Se um dia abrir conta, a atribuição volta em `#pdet .src`.
