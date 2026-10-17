# Monetização: as réguas, o prazo e de onde o dinheiro realmente vem

Fonte de verdade sobre o progresso: **YouTube Studio → Ganhos**. Os números abaixo vieram de publicações especializadas em 17/10/2026 (a central de ajuda oficial estava inacessível nesta sessão) — tratar como referência de planejamento e conferir no Studio. `[confirmar]`

## 1. As três réguas

| Nível | Inscritos | Exibição | Shorts | Libera |
|---|---|---|---|---|
| **Financiamento de fãs** | 500 | 3.000 h em 12 meses | ou 3 M views em 90 dias | Super Thanks, associações, Super Chat. Exige também 3 uploads públicos em 90 dias |
| **Completo — trilha longo** | 1.000 | 4.000 h em 12 meses | — | receita de anúncio |
| **Completo — trilha Shorts** | 1.000 | — | 10 M views válidas em 90 dias | receita de anúncio |

**Prazo:** em **1º/02/2027** a régua do nível completo dobra para novos candidatos (8.000 h ou 20 M views). Quem já está dentro não é afetado. Faltam 106 dias contados de 17/10/2026.

## 2. O que conta e o que não conta

| Conta para as horas de exibição | Não conta |
|---|---|
| Vídeos longos públicos | **Qualquer hora assistida em Shorts** |
| Lives públicas | Vídeos privados, não listados ou excluídos |
| Exibição por assinantes do Premium | Views de anúncio pagas |
| | Conteúdo não original / reutilizado |

O erro mais comum é achar que hora de Shorts soma nas 4.000 h. Não soma. São duas contabilidades separadas — e é exatamente por isso que o canal precisa das duas trilhas.

## 3. De onde o dinheiro vem, em ordem de velocidade

| # | Fonte | Quando | Valor estimado `[estimativa]` |
|---|---|---|---|
| 1 | **Cliente novo via WhatsApp** | desde o dia 1 | R$ 250 a R$ 5.000 por projeto |
| 2 | **Preço sustentado por autoridade** | 60–90 dias | não aparece em extrato, aparece na margem |
| 3 | Super Thanks / associações | ao bater 500 inscritos | dezenas de reais/mês |
| 4 | Anúncio em vídeo longo | ao entrar no YPP | RPM muito maior que Shorts |
| 5 | Anúncio em Shorts | ao entrar no YPP | ~R$ 500 a 1.700 por 10 M de views |
| 6 | **Produto para tatuadores** (pack de estêncil, curso, mentoria) | 90–180 dias | ticket alto, custo marginal quase zero |
| 7 | Parceria com marca de material | a partir de ~10 mil inscritos | permuta ou cachê |

**A conclusão desconfortável:** 10 milhões de visualizações de Shorts no Brasil pagam menos que um fechamento de costas. O AdSense do Shorts é bônus. O canal se paga pelos itens 1, 2 e 6.

**O detalhe que quase ninguém nota:** 4.000 horas de vídeo longo provavelmente geram **mais** receita de anúncio que 10 milhões de views de Shorts, porque o vídeo longo tem anúncio in-stream e RPM muito superior. A trilha mais fácil de bater também é a que paga melhor. É a trilha principal.

## 4. O que derruba a monetização (ler antes de produzir)

- **Conteúdo reutilizado:** compilação de vídeo de terceiros, mesmo com crédito. Só material próprio.
- **Música comercial** em vídeo que deve monetizar: usar áudio original (som da máquina) ou a Biblioteca de Áudio do YouTube. Faixa do catálogo de Shorts altera a divisão de receita. `[confirmar]` no Studio.
- **Imagem gráfica:** sangue ou plasma acumulado em macro demorado pode render anúncio limitado. Limpar e seguir. `[hipótese]`
- **Conteúdo inautêntico / repetitivo em massa:** 40 Shorts quase idênticos, com o mesmo áudio e o mesmo texto, é risco. É por isso que o `youtube/FORMATOS.md` tem 12 moldes diferentes.
- **Strike ativo** de qualquer tipo bloqueia a entrada. Conferir antes de inscrever.

## 5. Painel de progresso

```
python3 -I youtube/scripts/painel_ypp.py --inscritos 320 --views-shorts-90d 1200000 --horas-12m 180
```

Mostra, para cada régua: quanto falta, o ritmo diário necessário, o ritmo atual e qual trilha está mais perto. Rodar toda segunda com os números do Studio → Ganhos, e levar o resultado para a skill `monetizacao-youtube`.
