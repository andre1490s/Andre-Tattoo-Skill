# Storyboard

Quadros extraídos do arquivo final, em `previews/` (JPEG 540×960). O tempo é o do arquivo.

| # | Arquivo | t | Beat |
|---|---|---|---|
| 00a | `previews/00a-gancho1.jpg` | 1,1 s | **Gancho**: "Você salvou mil referências." |
| 00b | `previews/00b-gancho2.jpg` | 2,8 s | "E não marcou nenhuma." — o anel se fecha |
| 00c | `previews/00c-gancho3.jpg` | 4,4 s | "Falta escolher **quem faz**." |
| 01 | `previews/01-feed.jpg` | 5,8 s | Feed do Pinterest já cheio |
| 02 | `previews/02-busca.jpg` | 7,0 s | Digitação + sugestões sobre o feed escurecido |
| 03 | `previews/03-resultados.jpg` | 9,0 s | Mosaico voltando em cascata |
| 04 | `previews/04-toque-pin.jpg` | 11,0 s | Toque no retrato de realismo + zoom punch |
| 05 | `previews/05-pin.jpg` | 12,0 s | Detalhe do pin — sem fonte nem @ |
| 06 | `previews/06-whip.jpg` | 13,8 s | **Whip pan** com blur direcional |
| 07 | `previews/07-recuo-dock.jpg` | 15,0 s | Celular revelado, pins orbitando, dock |
| 08 | `previews/08-estouro-insta.jpg` | 15,9 s | **Estouro do Instagram** em tela cheia |
| 09 | `previews/09-busca-insta.jpg` | 17,5 s | Digitando `andretatuadoor` |
| 10 | `previews/10-perfil.jpg` | 19,8 s | Perfil: números reais, bio, link azul, destaques |
| 11 | `previews/11-link-destaque.jpg` | 23,4 s | **Spotlight no link** com a elipse verde |
| 12 | `previews/12-folha.jpg` | 25,1 s | `Agende sua sessão` / `Abrir conversa` |
| 13 | `previews/13-marca.jpg` | 28,7 s | `ANDRÉ TATTOO` + chamada + `@andretatuadoor` |

Para gerar qualquer outro instante:
```bash
cd build && ONLY=4.4,15.9,23.4 node render.mjs
```

## Grade de segurança 9:16
- **1080×1920 (9:16)** do primeiro ao último quadro — celular em pé, para Reels e Status. Não existe plano deitado.
- Margem lateral mínima: **110 px** (10,2 %).
- Zona segura do Reels: evitar os **250 px de baixo** (interface) e os **220 px de topo**. Todo texto está entre `y=560` e `y=1600`.
- O aparelho ocupa 87 % da largura nos planos fechados e 55 % no plano aberto.
