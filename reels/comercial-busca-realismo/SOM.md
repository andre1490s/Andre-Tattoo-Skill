# Desenho de som

`saida/trilha.wav` vem sintetizada e sincronizada (33,9 s · 48 kHz · estéreo). Sem sample licenciado — nada que o Instagram possa silenciar.

**Regra que guia a trilha:** todo zoom punch tem um impacto sonoro **no mesmo quadro**. Sem isso a mudança de velocidade parece arbitrária em vez de causada — é o que separa um corte com peso de um efeito solto.

## Mapa de eventos

O filme começa em **9,90 s** — antes disso é o gancho tipográfico. Os tempos abaixo são os do arquivo.

### Gancho
| Tempo | Evento | Som |
|---|---|---|
| 0,30 · 2,00 · 3,55 | Cada frase | Díade 196 + 294 Hz, 1,6 s, entrada suave |
| 3,70 | Riser | Ruído 700–10.000 Hz subindo 1,3 s até o flash da passagem |

### Filme
| Tempo | Evento | Som |
|---|---|---|
| 0,0–33,9 | Leito | Drone de 48 Hz + 72,5 Hz e ar rosa filtrado (1,8–9 kHz) a −26 dB |
| 5,55 | Digitação Pinterest | 34 cliques de 30 ms, 1.550–1.970 Hz |
| 7,66 | **Enter** (punch 10 %) | Tom de 430 Hz com eco curto |
| 7,72 | Carregando | Whoosh filtrado 500–7.000 Hz |
| 10,96 | **Toque no pin** (punch 9 %) | Clique seco de 2.100 Hz + sub de 110 Hz |
| 11,29 | Detalhe sobe | Sub de 150 Hz |
| 12,96 | Pins descolam | Sub de 110 Hz |
| 13,66 | **WHIP PAN** | Ruído 300–9.000 Hz, ataque de 0,22 s — curto e agressivo |
| 14,38 | Dock sobe | Sub de 150 Hz |
| 14,48 | Riser | Ruído agudo subindo 1,05 s até o toque |
| 15,37 | Toque no Instagram | Clique seco |
| 15,63 | **ESTOURO** (punch 22 %) | Sub de 88 Hz por 2 s — o maior impacto do filme |
| 16,16 | **Whip de volta** | Mesmo ruído, direção oposta |
| 16,75 | Digitação Instagram | 14 cliques |
| 17,84 | Resultado | Díade 1046 + 1568 Hz |
| 18,57 | Toque no resultado | Clique seco |
| 18,94 | **Perfil** (punch 7 %) | Sub de 110 Hz |
| 22,10 | **Spotlight no link** | Díade 520 + 784 Hz subindo 1,1 s — o som de "olha aqui" |
| 22,52 | Elipse traçada | Díade 1046 + 1568 Hz |
| 23,73 | Toque no link | Clique seco |
| 24,63 | Folha sobe | Sub de 150 Hz |
| 26,20 | **A LOGO** | Sub de 88 Hz + acorde de 330/495/660 Hz por 2,4 s |
| 27,60 | Chamada | Díade 1046 + 1568, fechando o arco |
| 28,50 | Fim | Fade de 0,7 s |

Limitador em 0,93. Pico abaixo de −1 dBFS — dentro do que o Instagram aceita sem recomprimir.

## Se quiser trocar por música
1. Use faixa licenciada ou a biblioteca do próprio Instagram, adicionada **dentro do app** na publicação.
2. Mantenha os acentos: deixe a trilha sintetizada por baixo a −18 dB só com os impactos de `13,66`, `15,63` e `26,20`. É o que dá peso.
3. Pontos de corte musical: **5,20 / 7,66 / 13,66 / 15,63 / 22,10 / 26,20**. O drop ideal é em `15,63` — o estouro do Instagram.

## Regerar
```bash
bash build/audio.sh
```
