# Desenho de som

`saida/trilha.wav` já vem sintetizada e sincronizada (25,0 s · 48 kHz · estéreo). Sem sample licenciado — nada que o Instagram possa silenciar.

## Mapa de eventos

| Tempo | Evento | Som |
|---|---|---|
| 0,0–25,0 | Leito | Drone de 48 Hz + 72,5 Hz e ar rosa filtrado (1,8–9 kHz) a −26 dB. Entra em 1,3 s, sai em 1,4 s. |
| 0,55–3,20 | Digitação Pinterest | 34 cliques de 34 ms, 1.550–1.970 Hz, um por caractere. |
| 3,42 | Enter | Tom de 430 Hz com eco curto (55 ms / 0,3). |
| 4,10 | Carregando | Whoosh de ruído filtrado (500–7.000 Hz), 1,1 s. |
| 7,55 | Toque no pin | Clique seco de 2.100 Hz, 50 ms. |
| 7,95 | Detalhe sobe | Sub de 150 Hz, cauda de 0,92 s. |
| 9,82 | **Recuo da câmera** | Whoosh largo (180–5.200 Hz), 1,8 s. É o maior gesto sonoro do filme. |
| 10,60 | Dock sobe | Sub de 150 Hz. |
| 11,45 | Riser | Ruído agudo (900–11.000 Hz) subindo 0,72 s até o toque. |
| 11,95 | Toque no Instagram | Clique seco. |
| 12,15 | Abertura do app | Sub de 88 Hz, 2,2 s — o impacto. |
| 13,25–14,45 | Digitação Instagram | 14 cliques, 1.700–2.050 Hz. |
| 14,48 | Resultado aparece | Díade 1046 + 1568 Hz (dó/sol). |
| 15,10 | Toque no resultado | Clique seco. |
| 15,50 | Perfil carrega | Sub de 150 Hz. |
| 19,25 | Toque no link | Clique seco. |
| 19,75 | Folha sobe | Sub de 150 Hz. |
| 21,30 | Saída | Sub de 88 Hz. |
| 21,80 | Assinatura | Díade 660 + 990 Hz, 1,5 s. |
| 22,80 | Chamada | Repete a díade 1046 + 1568, fechando o arco. |
| 24,30 | Fim | Fade de 0,7 s. |

Limitador em 0,92. Pico abaixo de −1 dBFS — dentro do que o Instagram aceita sem recomprimir.

## Se quiser trocar por música
1. Use faixa licenciada ou a biblioteca do próprio Instagram, adicionada **dentro do app** na publicação (não embutida no arquivo).
2. Mantenha os acentos: deixe a trilha sintetizada por baixo a −18 dB só com os impactos de `9,82`, `12,15` e `19,75`. É o que dá peso.
3. Pontos de corte musical: **3,42 / 9,82 / 12,15 / 21,30**. O drop ideal é em `12,15` — a abertura do Instagram.

## Regerar
```bash
bash build/audio.sh
```
