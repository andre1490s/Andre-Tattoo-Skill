# Renda extra: R$ 1.000 por semana

Decisão do André em 2026-10-14: criar uma fonte de renda extra de **R$ 1.000/semana (R$ 4.000/mês)**.
Investimento disponível: **R$ 0** — só tempo.
Direção e horas semanais ainda não confirmadas; este plano assume a direção recomendada (Fase 1) e
cerca de 4 a 7 h/semana. Alternativas na seção 7.

> Este documento é interno. Não contém dados de clientes. Vale o `contexto/marca.md` em qualquer divergência.

---

## 1. A matemática, antes de qualquer ideia

| | Valor |
|---|---|
| Meta de renda extra | R$ 4.000/mês |
| Meta atual do estúdio (`marca.md`) | R$ 20.000/mês de entradas |
| Total pretendido | R$ 24.000/mês |

Três formas de chegar aos R$ 4.000, e elas custam coisas muito diferentes:

| Caminho | Quantos "sim" por mês | Usa sua mão? | Previsível? |
|---|---|---|---|
| Tattoo express (R$ 300) | 13 a 14 | Sim, ~20 h/mês | Não |
| Mentoria (R$ 1.200) | 3 a 4 | Sim, ~16 h/mês | Não |
| **Serviço mensal (R$ 1.300)** | **3, uma vez** | **Não** | **Sim — recorrente** |

A diferença decisiva: nos dois primeiros você recomeça do zero todo mês. No terceiro, o mês 2 começa
com R$ 4.000 já vendidos. Para uma meta **semanal**, previsibilidade vale mais que ticket.

E há um dado do próprio repositório que muda a ordem do plano: hoje seu gargalo não é capacidade de
atender, é **fluxo de leads** (site com 8 peças, zero depoimento, Ads ligado em 08/10 com R$ 20/dia).
Enquanto isso for verdade, existe caixa parado em canais que você já construiu e não está operando.
Por isso o plano tem duas fases, e a Fase 0 não é negócio novo nenhum.

---

## 2. Fase 0 — Caixa nas próximas 2 semanas (R$ 0, ~3 h)

Vale **qualquer** direção que você escolher depois. É o dinheiro mais barato que existe no seu negócio:
clientes que já te conhecem, já te procuraram, e nunca receberam uma segunda mensagem.

### 2.1 Orçamentos parados — skill `followup-orcamento`
Você tem a skill escrita e as regras definidas (máximo 2 contatos, sem desconto, sem urgência falsa).
O que falta é rodar.

- **Ação:** abrir o app Caixa > Orçamentos > funil, e listar todo orçamento sem resposta dos últimos 90 dias.
- **Cenário (hipótese, não previsão):** 20 orçamentos parados → 15% retomam → 3 fechamentos → a R$ 400
  médios = **R$ 1.200**. Com 10 parados e 10%, é 1 fechamento e R$ 400. O número real sai do app.
- **Tempo:** 40 min para gerar as mensagens, mais o envio.

### 2.2 Clientes antigos — skill `reativar-clientes-antigos`
Aqui o ticket é maior que em lead novo, porque o caminho é **continuação de projeto**, não peça isolada.

- **Prioridade 1:** quem tem fechamento ou projeto em partes inacabado. É o único grupo onde um "sim"
  pode valer R$ 1.500 a R$ 5.000 sozinho.
- **Prioridade 2:** 1 ano de tattoo (pedir foto, convidar para a próxima ideia).
- **Regra sua, que o plano respeita:** máximo 1 reativação a cada 3 meses por cliente.
- **Tempo:** 1 h para listar e gerar.

### 2.3 Destravar o "Indique e Ganhe" (pendência aberta há semanas)
É canal de lead com custo R$ 0 e está parado porque as regras nunca foram definidas — e por isso
nenhuma skill pode mencionar o programa. Proposta para você aprovar ou cortar:

> Quem indicar um cliente que **fechar e tatuar** ganha **R$ 100 de crédito** na própria próxima sessão.
> Crédito acumula até R$ 300, vale por 6 meses, não vira dinheiro e não soma com outra condição.
> O indicado não recebe desconto — recebe prioridade de agenda.

Por que assim: crédito traz o cliente de volta à cadeira em vez de tirar dinheiro do caixa; o indicado
não ganha desconto, então não corrói preço; e "prioridade de agenda" é benefício real, não escassez falsa.
Uma linha sua — "aprovado" ou o que mudar — e eu atualizo `marca.md` e as skills.

---

## 3. Fase 1 — O negócio: sistema de IA e conteúdo para tatuadores

### 3.1 Por que esta e não outra
Você passou meses construindo algo que quase nenhum tatuador do Brasil tem: 33 skills, um app de caixa
com assistente que aprende, site, CRM, funil de orçamento, rotina de conteúdo. Você construiu isso
**para si mesmo** — e é exatamente isso que o torna vendável, porque o case é o seu próprio estúdio.

O cliente é o tatuador que **tatua bem e vende mal**: feed abandonado, legenda de duas palavras,
orçamento que morre no "vou pensar", nenhum follow-up. É a maioria do mercado.

### 3.2 A oferta (3 níveis)

| Nível | Entrega mensal | Preço |
|---|---|---|
| **Conteúdo** | 8 posts (arte + legenda) e 4 roteiros de Reels | R$ 597 |
| **Conteúdo + Vendas** | o de cima, mais scripts de WhatsApp/Direct, funil de orçamento e follow-up semanal | R$ 1.297 |
| **Completo** | o de cima, mais gestão de Ads e relatório mensal com números | R$ 1.897 |

**Meta batida com 3 clientes no nível do meio.** Prefira 3 clientes de R$ 1.297 a 7 de R$ 597: metade
do trabalho, mesmo dinheiro, e cliente que paga mais reclama menos.

**Preço de fundação (com motivo, prazo e limite, como manda o `marca.md`):** os **3 primeiros** estúdios
pagam R$ 997 no nível do meio, travado por 6 meses, em troca de depoimento e autorização para usar os
números. Depois do terceiro, tabela cheia. O motivo é verdadeiro: você precisa dos cases.

### 3.3 Como a entrega cabe em poucas horas
Produção **em lote, uma noite por semana**, todos os clientes de uma vez — porque as skills já fazem o trabalho:

| O que | Skill que já existe |
|---|---|
| Pauta e posts da semana | `posts-semana-instagram`, `diretor-conteudo-copy` |
| Arte dos posts | `arte-post-gemini` (app do Gemini, grátis) |
| Roteiros de Reels | `roteiro-reels-tattoo` |
| Scripts de resposta e orçamento | `responder-instagram`, `closer-vendas`, `orcamento-tattoo` |
| Follow-up e CRM | `followup-orcamento`, `crm-followup` |
| Relatório mensal | `relatorio-instagram`, `fechamento-mensal-estudio` |

Nada precisa ser construído. O que precisa é de um **contexto de marca por cliente** — um `marca.md`
igual ao seu, mas dele. É a primeira coisa a fazer em cada venda e leva ~1 h.

**Custo real de tempo:** ~1 h a 1h30 por cliente por semana na entrega. Com 3 clientes: 3 a 4 h/semana
de entrega, mais 2 a 3 h/semana de prospecção enquanto você ainda está vendendo. Então **6 a 7 h/semana
na fase de construção** e ~4 h/semana depois de fechar os três. Se suas horas reais forem 3 ou menos,
me diga: o plano passa a ser 2 clientes a R$ 1.897, não 3.

### 3.4 Prospecção com R$ 0

**Quem procurar:** tatuador com 1.000 a 15.000 seguidores, portfólio visivelmente bom, feed irregular
ou legenda pobre, **fora da zona leste de São Paulo** (regra da seção 6).

**O que mandar — e isto é o ponto todo:** não mande pitch. Mande entrega.

> Fulano, acompanho seu trabalho — o [peça específica] ficou muito bom.
> Escrevi três legendas para esse post e um roteiro de Reels pra ele, estão aí embaixo. Use se quiser,
> é seu, não quero nada em troca.
> Eu tatuo em São Paulo e montei um sistema pra resolver isso no meu estúdio. Se quiser saber como
> funciona, me fala.

Custo seu: ~10 min com as skills. Taxa de resposta muito acima de um DM de venda, porque chega como
presente de colega, não como abordagem comercial.

**Volume e conversão (hipótese de trabalho):** 10 contatos/dia útil = 50/semana → ~15% respondem
(7 a 8 conversas) → 2 a 4% fecham = **1 a 2 clientes/mês**. Nessa taxa, os 3 clientes saem em **2 a 3 meses**.
Se depois de 100 contatos a resposta estiver abaixo de 5%, o problema é a mensagem ou o público-alvo,
não o volume — a gente reescreve, não insiste.

---

## 4. Cronograma de 90 dias

| Semana | Fase 0 | Fase 1 | Entradas esperadas |
|---|---|---|---|
| 1 | Rodar `followup-orcamento` e reativação P1. Aprovar Indique e Ganhe | Listar 50 tatuadores-alvo | R$ 400 a R$ 1.500 |
| 2 | Reativação P2. Pedir depoimento a 5 clientes | 50 primeiros contatos | R$ 400 a R$ 1.200 |
| 3–4 | — | 100 contatos. Fechar cliente 1 (fundação) | R$ 997 |
| 5–8 | — | Entregar cliente 1. 200 contatos. Fechar cliente 2 | R$ 2.000/mês |
| 9–12 | — | Fechar cliente 3. Primeiro relatório com números reais | **R$ 3.000 a R$ 4.000/mês** |

Fase 0 cobre o caixa das primeiras semanas enquanto a Fase 1 ainda não paga. Os R$ 1.000/semana
estáveis chegam no **mês 3 ou 4**, não na semana 1 — qualquer plano que prometa isso em 7 dias está mentindo.

---

## 5. O que eu meço, toda semana
Sem isso o negócio vira sensação, não gestão (`gestor-financeiro`):

- contatos enviados / respostas / conversas / propostas / fechamentos;
- MRR (soma das mensalidades ativas) — é este número que precisa chegar a R$ 4.000;
- churn: cliente que saiu no mês;
- horas gastas na entrega, por cliente — se passar de 2 h/semana por cliente, o preço está errado;
- faturamento do estúdio, separado. Se cair, a Fase 1 está roubando atenção e a gente pausa.

---

## 6. Riscos e regras fixas

1. **Não vender para concorrente direto.** Nada de tatuador num raio relevante da Vila Matilde. Preferência
   por outros estados. Essa regra não se negocia por dinheiro.
2. **O estúdio vem primeiro.** Se o faturamento do estúdio cair dois meses seguidos, a Fase 1 pausa.
   R$ 4.000 de renda extra não compensa perder R$ 20.000 de operação principal.
3. **Contrato mensal, nunca semestral.** Serviço recorrente é obrigação: mês a mês, cancelável, sem multa.
   Protege a sua reputação mais que a receita.
4. **Não vender o que você não entrega.** Ads só no nível Completo e só se você quiser mesmo operar Ads
   de terceiro. Na dúvida, venda os dois primeiros níveis.
5. **Nada de prometer resultado.** Vale aqui a mesma regra do `marca.md`: você vende sistema e execução,
   não "x seguidores" nem "y clientes".
6. **Formalização:** R$ 4.000/mês de serviço é receita de prestação de serviço, atividade diferente da
   tattoo. Confirmar com seu contador antes do terceiro cliente — enquadramento, nota e limite de faturamento.
   Não é urgente na semana 1; é obrigatório antes de virar R$ 4.000 recorrentes.
7. **Repositório privado.** Pendência ainda aberta no `PENDENCIAS.md`. Vai vender esse sistema — ele não
   pode estar público. Resolver antes do primeiro contato de prospecção.

---

## 7. Se você preferir outra direção

**Mentoria de realismo preto e cinza (R$ 1.200, 3 a 4 alunos/mês).** Ticket alto e reforça a autoridade
que a marca já persegue. Custo: precisa de conteúdo de prova antes de vender (Reels de processo,
peça cicatrizada, depoimento de aluno) e usa suas noites. Com R$ 0 de verba, a venda depende do orgânico
que hoje ainda está fraco. Caminho certo, mês 5 ou 6 — não mês 1.

**Tattoo express / flash day (R$ 300 x 13 por mês).** Começa nesta semana e não exige aprender nada.
Custo: ~20 h/mês da sua mão e risco real de puxar o posicionamento de alto padrão pra baixo. Se escolher,
que seja **flash day com tema e dia único** (`arquiteto-ofertas`), nunca "tattoo barata permanente".

**Desenhos autorais para tatuadores (R$ 30 a 150).** Escala sem hora marcada, mas ticket baixo exige
tráfego que você não tem. Faz sentido como produto **adicional** depois da Fase 1, vendido para a base
de tatuadores que você já estará atendendo.

---

## 8. O que eu preciso de você para começar

1. **Direção confirmada:** Fase 1 como está, ou uma das alternativas da seção 7.
2. **Horas reais por semana** fora do estúdio (muda 3 clientes para 2).
3. **Indique e Ganhe:** aprovar, ajustar ou cortar a proposta da seção 2.3.
4. **Quantos orçamentos parados** existem hoje no app (número, sem nome de cliente) — troca a hipótese
   da seção 2.1 por conta real.
5. **Repositório privado** (seção 6.7).

Com 1 e 2 respondidos eu já produzo, no mesmo dia: a lista de 50 alvos de prospecção, as mensagens de
abordagem e o `marca.md` modelo para o primeiro cliente.
