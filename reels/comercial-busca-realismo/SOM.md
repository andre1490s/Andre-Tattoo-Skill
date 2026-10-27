# Desenho de som

`saida/trilha.wav` vem sintetizada e sincronizada (24,0 s · 48 kHz · estéreo). Sem sample licenciado — nada que o Instagram possa silenciar.

**Regra que guia a trilha:** todo zoom punch tem um impacto sonoro **no mesmo quadro**. Sem isso a mudança de velocidade parece arbitrária em vez de causada — é o que separa um corte com peso de um efeito solto.

## Mapa de eventos

| Tempo | Evento | Som |
|---|---|---|
| 0,0–24,0 | Leito | Drone de 48 Hz + 72,5 Hz e ar rosa filtrado (1,8–9 kHz) a −26 dB |
| 0,35–2,10 | Digitação Pinterest | 34 cliques de 30 ms, 1.550–1.970 Hz |
| **2,46** | **Enter** (punch 10 %) | Tom de 430 Hz com eco curto |
| 2,52 | Carregando | Whoosh filtrado 500–7.000 Hz |
| **5,76** | **Toque no pin** (punch 9 %) | Clique seco de 2.100 Hz + sub de 110 Hz |
| 6,09 | Detalhe sobe | Sub de 150 Hz |
| 7,76 | Pins descolam | Sub de 110 Hz |
| **8,46** | **WHIP PAN** | Ruído 300–9.000 Hz, ataque de 0,22 s — curto e agressivo |
| 9,18 | Dock sobe | Sub de 150 Hz |
| 9,28 | Riser | Ruído agudo subindo 1,05 s até o toque |
| 10,17 | Toque no Instagram | Clique seco |
| **10,43** | **ESTOURO** (punch 22 %) | Sub de 88 Hz por 2 s — o maior impacto do filme |
| **10,96** | **Whip de volta** | Mesmo ruído, direção oposta |
| 11,55–12,62 | Digitação Instagram | 14 cliques |
| 12,64 | Resultado | Díade 1046 + 1568 Hz |
| 13,37 | Toque no resultado | Clique seco |
| **13,74** | **Perfil** (punch 7 %) | Sub de 110 Hz |
| **16,90** | **Spotlight no link** | Díade 520 + 784 Hz subindo 1,1 s — o som de "olha aqui" |
| 17,32 | Elipse traçada | Díade 1046 + 1568 Hz |
| 18,53 | Toque no link | Clique seco |
| 19,43 | Folha sobe | Sub de 150 Hz |
| **21,00** | **A LOGO** | Sub de 88 Hz + acorde de 330/495/660 Hz por 2,4 s |
| 22,40 | Chamada | Díade 1046 + 1568, fechando o arco |
| 23,30 | Fim | Fade de 0,7 s |

Limitador em 0,93. Pico abaixo de −1 dBFS — dentro do que o Instagram aceita sem recomprimir.

## Se quiser trocar por música
1. Use faixa licenciada ou a biblioteca do próprio Instagram, adicionada **dentro do app** na publicação.
2. Mantenha os acentos: deixe a trilha sintetizada por baixo a −18 dB só com os impactos de `8,46`, `10,43` e `21,00`. É o que dá peso.
3. Pontos de corte musical: **2,46 / 8,46 / 10,43 / 16,90 / 21,00**. O drop ideal é em `10,43` — o estouro do Instagram.

## Regerar
```bash
bash build/audio.sh
```
