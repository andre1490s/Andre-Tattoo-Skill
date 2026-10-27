# Storyboard

Quadros extraídos do arquivo final, em `previews/` (JPEG 540×960).

| # | Arquivo | t | Beat |
|---|---|---|---|
| 01 | `previews/01-feed.jpg` | 0,6 s | Feed do Pinterest já cheio no primeiro segundo |
| 02 | `previews/02-busca.jpg` | 1,8 s | Digitação + três sugestões sobre o feed escurecido |
| 03 | `previews/03-resultados.jpg` | 3,8 s | Mosaico voltando em cascata depois da busca |
| 04 | `previews/04-toque-pin.jpg` | 5,8 s | Toque no retrato de realismo + zoom punch |
| 05 | `previews/05-pin.jpg` | 6,8 s | Detalhe do pin — sem fonte nem @ |
| 06 | `previews/06-whip.jpg` | 8,6 s | **Whip pan** com blur direcional |
| 07 | `previews/07-recuo-dock.jpg` | 9,8 s | Celular revelado, pins orbitando, dock de vidro |
| 08 | `previews/08-estouro-insta.jpg` | 10,6 s | **Estouro do Instagram** em tela cheia com o glifo |
| 09 | `previews/09-busca-insta.jpg` | 12,3 s | Digitando `andretatuadoor` |
| 10 | `previews/10-perfil.jpg` | 14,6 s | Perfil carregado: números reais, bio, link azul, destaques |
| 11 | `previews/11-link-destaque.jpg` | 18,2 s | **Spotlight no link** com a elipse verde e `O LINK ESTÁ AQUI` |
| 12 | `previews/12-folha.jpg` | 19,9 s | `Agende sua sessão` / `Abrir conversa` |
| 13 | `previews/13-fecho.jpg` | 21,5 s | `ANDRÉ TATTOO` resolvendo (fecho sem logo — ver README) |
| 14 | `previews/14-marca.jpg` | 23,5 s | `ANDRÉ TATTOO` + chamada + `@andretatuadoor` |

Para gerar qualquer outro instante:
```bash
cd build && ONLY=8.7,10.5,18.1 node render.mjs
```

## Grade de segurança 9:16
- O arquivo é **1080×1920 (9:16)** do primeiro ao último quadro — formato de celular em pé, para Reels e Status. Não existe plano deitado.
- Margem lateral mínima: **110 px** (10,2 %).
- Zona segura do Reels: evitar os **250 px de baixo** (interface) e os **220 px de topo**. Todo texto de marca está entre `y=560` e `y=1600`.
- O aparelho ocupa 87 % da largura nos planos fechados e 55 % no plano aberto. A logo ocupa 35 %.
