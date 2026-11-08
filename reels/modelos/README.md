# Modelos de corte

Cada arquivo `.edl` é um molde executável de um formato do `youtube/FORMATOS.md`:
muda a peça, a estrutura continua. O montador é `scripts/montar_reels.sh`.

| Modelo | Formato | Duração | Público |
|---|---|---|---|
| `01-revelacao-invertida.edl` | 1 — Revelação invertida | 18 s | cliente |
| `03-cobertura.edl` | 3 — Cobertura (cover-up) | 25 s | cliente |
| `04-cicatrizada-30-dias.edl` | 4 — Cicatrizada 30 dias | 15 s | cliente |
| `05-estencil-vira-pele.edl` | 5 — Estêncil vira pele | 12,5 s | ambos |

## Fluxo

```
cp reels/modelos/05-estencil-vira-pele.edl reels/<peca>/corte.edl
./scripts/montar_reels.sh medir   CLIPE.mov 2,6,9,13 medicao.png   # mede o ponto focal
#   preencher x,y,w no .edl
./scripts/montar_reels.sh montar  reels/<peca>/corte.edl saida.mp4 A=... B=...
./scripts/montar_reels.sh conferir saida.mp4 zona.png              # confere a zona segura
```

O montador já aplica sozinho: easing no movimento, grade de 0,5 s (avisa se sair
dela), correção por fonte, e uma passada única de grade, vinheta e grão no fim.
Entrega sem áudio — a música entra no app.

O único trabalho manual é medir o ponto focal, porque pan de câmera na mão não é
linear e extrapolar erra (ver `skills/editor-videos-tattoo` § 1.B).

Exemplo preenchido e testado: `reels/onca-peonias-decalque-vira-pele/corte.edl`.
