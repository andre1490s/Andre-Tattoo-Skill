# Storyboard

Quadros extraídos do arquivo final, em `previews/` (JPEG 500×889). O tempo é o do arquivo.

## Ato 0 — Introdução de marca (0,0–9,9 s)

| # | Arquivo | t | Beat |
|---|---|---|---|
| 00a | `00a-logo.jpg` | 1,1 s | O **A** entra com punch; tattoos orbitando, luz verde no piso |
| 00b | `00b-marca.jpg` | 3,0 s | A logo avança para a lente e borra |
| 00c | `00c-frase1.jpg` | 3,6 s | "Você salvou **mil referências**." |
| 00d | `00d-enxame.jpg` | 5,0 s | **"mil"** — 260 ícones minúsculos explodem pela tela |
| 00e | `00e-frase2.jpg` | 6,4 s | "E não **marcou** nenhuma." |
| 00f | `00f-anel.jpg` | 7,6 s | "Você só quer começar, né?" — o anel se forma |
| 00g | `00g-comquem.jpg` | 8,8 s | "mas **com quem**?" — o anel fecha |
| 00h | `00h-dock.jpg` | 9,6 s | Dock sobe, toque no **Pinterest** |

## Ato 1–3 — O filme (9,9–33,9 s)

| # | Arquivo | t | Beat |
|---|---|---|---|
| 01 | `01-feed.jpg` | 10,6 s | Pinterest aberto, feed cheio |
| 02 | `02-busca.jpg` | 11,8 s | Digitação + sugestões |
| 03 | `03-resultados.jpg` | 13,8 s | Mosaico em cascata |
| 04 | `04-toque-pin.jpg` | 15,8 s | Toque no retrato + zoom punch |
| 05 | `05-pin.jpg` | 16,8 s | Detalhe do pin |
| 06 | `06-whip.jpg` | 18,6 s | **Whip pan** com blur direcional |
| 07 | `07-recuo-dock.jpg` | 19,8 s | Celular revelado, pins orbitando |
| 08 | `08-estouro-insta.jpg` | 20,7 s | **Estouro do Instagram** em tela cheia |
| 09 | `09-busca-insta.jpg` | 22,3 s | Digitando `andretatuadoor` |
| 10 | `10-perfil.jpg` | 24,6 s | Perfil com os dados reais |
| 11 | `11-link-destaque.jpg` | 28,2 s | **Spotlight no link** |
| 12 | `12-folha.jpg` | 29,9 s | `Agende sua sessão` / `Abrir conversa` |
| 13 | `13-marca-final.jpg` | 33,5 s | `ANDRÉ TATTOO` + chamada + `@andretatuadoor` |

Para gerar qualquer outro instante:
```bash
cd build && ONLY=1.3,5.0,20.7 node render.mjs
```

## Grade de segurança 9:16
- **1080×1920 (9:16)** do primeiro ao último quadro — celular em pé, para Reels e Status.
- Margem lateral mínima: **110 px** (10,2 %).
- Zona segura do Reels: evitar os **250 px de baixo** e os **220 px de topo**.
- A logo ocupa 59 % da largura na abertura. O aparelho ocupa 87 % nos planos fechados.
