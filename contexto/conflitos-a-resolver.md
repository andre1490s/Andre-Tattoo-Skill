# Conflitos a resolver entre as skills importadas e o contexto de marca

As 17 skills operacionais vieram da conta do André no Claude.ai e foram copiadas **sem alteração**.
`contexto/marca.md` registra o que o André disse diretamente nesta conversa (mais recente).
Abaixo, onde os dois divergem. **Nada foi mudado nas skills**: o André decide qual versão vale, e só então atualizamos.

## A. Divergências de dados: **RESOLVIDAS** (o André confirmou: vale o `marca.md`)

Decisão do André: manter os padrões que ele informou nesta conversa. As skills afetadas foram atualizadas (21 trechos em 11 skills) e todas as 17 importadas passaram a apontar para `contexto/marca.md`. Notas da aplicação:
- **A4 (anúncio):** "manter os padrões" não cobriu esse ponto diretamente. Apliquei o mais conservador: foco orgânico; nenhuma skill sugere anúncio sozinha; o André decide e aí entra o `gestor-de-trafego`. Se quiser outro critério, é só dizer.
- **A5 (preço em posts):** passou a valer "nunca citar valor em público, nem 'a partir de'".
- **A3 (horário):** domingo e feriado ficaram como [confirmar].

(Tabela original abaixo, mantida como registro.)

| # | Tema | Skills importadas dizem | `marca.md` diz (André, nesta conversa) | Skills afetadas |
|---|---|---|---|---|
| 1 | Valor mínimo | "mínimo R$ 200"; posts: "a partir de R$ 200" | mínimo **R$ 250** | `orcamento-tattoo`, `posts-semana-instagram` |
| 2 | Sinal | sempre **R$ 100**, abatido do valor final | até R$ 1.000: **R$ 100**; acima: **20%** do valor | `orcamento-tattoo`, `lembrete-sessao`, `resumo-agenda-semanal`, `revisao-conversas-sofia` |
| 3 | Dias e horário | "todos os dias, inclusive fins de semana e feriados, a partir das 9h" | **seg a sáb, 9h às 22h** | `orcamento-tattoo`, `resumo-agenda-semanal` |
| 4 | Anúncio pago | objetivo "sem anúncio pago"; `relatorio-instagram`: "não sugerir anúncio pago" | existe `gestor-de-trafego` (Meta Ads) e `arquiteto-ofertas` | `roteiro-reels-tattoo`, `posts-semana-instagram`, `relatorio-instagram` |
| 5 | Preço em público | posts podem citar "a partir de R$ 200" | preço só quem passa é o André; skills não citam valor ao cliente | `posts-semana-instagram` |
| 6 | Emojis | "no máximo 1 emoji" | "quase nenhum" | várias (compatível; só alinhar a expressão) |
| 7 | Tom | "artista sofisticado e reservado" | formal, com humor ocasional, íntimo pelo nome/"você" e mais próximo ao longo da sessão | todas as de mensagem |

**Sobre o item 2:** o `registrar-no-sistema` e o `revisao-conversas-sofia` tratam "R$ 100 sinal" como verificação de erro (a Sofia "usou corretamente"). Com sinal de 20% acima de R$ 1.000, esse checklist marcaria erro onde não há.

## B. Fatos que só existem nas skills

**Confirmados pelo André e já em `marca.md`:** meta de R$ 20.000/mês; retoque a partir de 40 dias (com a política de falha e de desgaste); idade mínima de 18 anos; um trabalho grande por dia. "Indique e Ganhe" existe, mas as regras seguem indefinidas.
**Ainda não confirmados (continuam só nas skills):** vocabulário ("sinal para reserva do horário", nunca "entrada"; nunca rotular por técnica), texto oficial de cuidados (Cicaplast), referência interna de realismo (média R$ 1.200), tempo de conteúdo (4 a 7 h/semana, 3 a 4 posts), agente Sofia e fluxos do n8n.

Tabela original:

| Fato | Onde aparece |
|---|---|
| Meta mensal: **R$ 20.000** | `fechamento-mensal-estudio`, `posts-semana-instagram`, `revisao-semanal-estudio` |
| Retoque: a partir de **40 dias**; falha de aplicação sem custo; desgaste por cuidado inadequado, refeito e cobrado | `orcamento-tattoo`, `pos-tattoo-avaliacao`, `reativar-clientes-antigos`, `posts-semana-instagram` |
| Idade mínima **18 anos** | `orcamento-tattoo` |
| Trabalho grande: **um por dia** | `orcamento-tattoo`, `resumo-agenda-semanal` |
| Vocabulário: "sinal para reserva do horário" (nunca "entrada" ou "adiantamento"); nunca rotular por técnica (ex.: "pontilhismo") | `orcamento-tattoo`, `legenda-tattoo` |
| Cuidados pós-tattoo: texto oficial (Cicaplast) | `pos-tattoo-avaliacao` |
| Referência interna: realismo em média **R$ 1.200** | `orcamento-tattoo` (só nota interna) |
| Tempo disponível para conteúdo: 4 a 7 h/semana, 3 a 4 posts | `posts-semana-instagram` |
| Agente de WhatsApp **Sofia** (n8n) e fluxo financeiro no n8n | `revisao-conversas-sofia`, `fechamento-mensal-estudio` |
| "Indique e Ganhe": mencionado, regras não definidas | `pos-tattoo-avaliacao`, `reativar-clientes-antigos` |

## C. Colisões de nome e de função

1. **"Cérebro" significa duas coisas.** Nas skills importadas, "Cérebro" é o conjunto de regras do agente Sofia (`claude/cerebro-regras-oficiais.md`, projeto AT Nox). Aqui, `cerebro-estrategico` é a skill de estratégia. Para evitar confusão, nas decisões deste repositório tratar o primeiro como **"regras da Sofia"**.
2. **`registrar-no-sistema` × `learning-engine`.** O primeiro grava entradas no diário (status "Novo") e atualiza planilhas do Google. O segundo valida e gradua aprendizados por nível de confiança. Proposta: `registrar-no-sistema` é o **coletor**; `learning-engine` analisa as entradas do diário e propõe promoção. A fonte da verdade das regras da Sofia continua sendo o documento do AT Nox, e só o André aprova mudanças.
3. **Follow-up em três lugares:** `closer-vendas` (conversa), `crm-followup` (cadência e segmentação), `followup-orcamento` e `reativar-clientes-antigos` (mensagens). A divisão proposta está em `AGENCIA.md`. Regras duras do `followup-orcamento` a preservar: máximo 2 follow-ups por cliente; nada de desconto ou urgência falsa.
4. **Dados fora do repositório.** `registrar-no-sistema` grava clientes em Google Planilhas e regras no projeto AT Nox. Isso continua assim: o repositório guarda as skills e o contexto, não os dados de clientes.

## D. O que já está alinhado (sem ação)
Endereço (Av. Melchert, 606, Vila Matilde); preço final só do André (`[VALOR]` no orçamento); sinal perdido na remarcação; agendamento pelo link da bio/WhatsApp; sem desconto nem urgência falsa; sem prometer que não dói; nada de dados de cliente em público; hashtags e nomes de estilo.

## Como resolver
O André responde os itens A1–A7 e B (confirmar), e eu proponho um patch único para as skills afetadas, para ele aprovar antes de aplicar.
