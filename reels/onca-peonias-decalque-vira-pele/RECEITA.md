# Reels: "O decalque vira pele" — onça + peônias (14,5 s, 9:16)

Peça: onça com peônias, costela/costas, preto e cinza realismo.
Material bruto: 2 clipes de celular — o decalque (9,8 s, 1080x1920) e a peça pronta
(16,0 s, 4K com rotação -90, efetivo 2160x3840). Nenhuma outra captura.

## Conceito

O material tem uma simetria que a edição explora: **nos dois clipes a onça está na
mesma posição do corpo e a câmera faz o mesmo movimento**. Isso permite um match cut
— alinhar a cabeça da onça no mesmo ponto do quadro nos dois clipes e dissolver entre
eles, de modo que o decalque roxo *se transforma* na tatuagem pronta sem sair do lugar.
A transformação não é contada, é vista.

Resultado → processo → resultado, com o fecho voltando ao enquadramento de abertura
para o Reels **loopar** sem costura.

## Timeline

| Tempo | Ato | Fonte | Movimento | Corte |
|---|---|---|---|---|
| 0:00–1,6 | **Gancho** | final, t=13,0 | close no rosto, push-in leve (820→780) | — |
| 1,6–4,0 | **O desenho** | decalque, t=0,9 | push-in no decalque (760→680) | corte seco |
| 3,67–4,0 | **O morph** | — | dissolve de 10 frames, cabeças alinhadas | xfade |
| 4,0–10,2 | **Revelação** | final, t=6,0 | pull-out da cabeça até a peça inteira (1362→2160) | — |
| 10,2–12,6 | **Detalhe** | final, t=9,0 | fecha no rosto (1300→1100) | corte seco |
| 12,6–14,5 | **Fecho / loop** | final, t=14,0 | fecha até o enquadramento do frame 0 (950→820) | corte seco |

Depois da revelação abrir no quadro cheio, o fechamento é **monotônico**
(2160 → 1300 → 1100 → 950 → 820). Nada reabre: evita o efeito sanfona.

## Decisões e armadilhas do material

- **Sticker "Bom dia" queimado no decalque.** Caixa preta sólida na fonte a partir de
  y≈1450, x≈601. Não dá para remover sem borrar a pele. Resolvido pelo enquadramento:
  todo recorte do decalque termina antes de y=1410. O push-in que melhora o plano é o
  mesmo que elimina o sticker.
- **Áudio descartado.** O clipe do decalque tem vozes de ambiente; o da peça pronta é
  praticamente mudo (-52,7 dB médio). Nenhum som aproveitável, nenhuma batida de
  máquina. Entrega com faixa silenciosa, para a música entrar no app.
- **A câmera não faz pan monotônico.** A cabeça da onça está em 0,45 da largura em
  t=6, volta para 0,34 em t=9 e vai a 0,69 em t=15,9. Extrapolação linear erra: as
  posições de cada corte foram medidas quadro a quadro.
- **Sem texto.** O Andre escreve a legenda e escolhe a música no Instagram; sobrepor
  texto aqui só atrapalharia. Variante com texto é outro render.

## Reproduzir

```
scripts/montar_reels_onca.sh <decalque.mov> <final.mov> <saida.mp4>
```

## Parâmetros de entrega
1080x1920, 30 fps, H.264 high@4.1, yuv420p, CRF 19, faststart, faixa AAC silenciosa.
