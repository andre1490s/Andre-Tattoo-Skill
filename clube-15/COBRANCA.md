# Clube 15 — como cobrar os R$ 150 todo mês

Consultado em **31/10/2026** nas páginas oficiais de preços. **Taxa de gateway muda sem aviso** —
confirme o número na hora de abrir a conta.

> O que decide o clube não é a taxa: é a cobrança acontecer sozinha. Cobrar 15 pessoas na mão todo
> mês custa o seu tempo, gera atraso, e o atraso é a porta de saída do membro.

---

## 1. As opções, com o custo real sobre R$ 150

| Caminho | Taxa | Custo por membro | 15 membros/mês | Cobra sozinho? |
|---|---|---|---|---|
| **Asaas — Pix recorrente** | R$ 2,15 por cobrança (R$ 1,08 nos 3 primeiros meses) | R$ 2,15 | **R$ 32** | Sim, envia todo mês |
| **Pix Automático** (débito pré-autorizado) | depende do banco ou plataforma | baixo | baixo | Sim, debita sem o cliente agir |
| Asaas — cartão de crédito à vista | R$ 0,49 + 2,99% | R$ 4,98 | R$ 75 | Sim |
| Mercado Pago — assinatura (receber em 30 dias) | 3,99% | R$ 5,99 | R$ 90 | Sim |
| Mercado Pago — assinatura (receber na hora) | 4,99% | R$ 7,49 | R$ 112 | Sim |
| InfinitePay — Planos e Recorrências | gestão de cobrança gratuita, lembrete por WhatsApp; a taxa é a do meio de pagamento | confirmar | — | Sim |
| Pix manual, você cobrando | R$ 0 | R$ 0 | R$ 0 | **Não** |

Fontes: `asaas.com/precos-e-taxas`, `mercadopago.com.br/blog/como-receber-pagamentos-recorrentes`,
`infinitepay.io/recorrencia-assinatura`.

## 2. A recomendação

**Asaas com Pix recorrente, e Pix Automático para quem o banco permitir.**

Por quê: R$ 32 por mês em taxa sobre R$ 2.250 de entrada é **1,4%**. É o preço de nunca mais
lembrar de cobrar ninguém. Cartão custaria o dobro ou o triplo e só faz sentido para o membro que
não quer pagar por Pix.

**Pix manual está fora**, mesmo custando zero. Em três meses você vira cobrador, esquece alguém, e
o membro usa o esquecimento para sair. O custo real dele não é R$ 0, é um membro perdido —
R$ 1.800 em 12 meses.

> Se você já usa alguma dessas contas, fique nela e pule a comparação. Trocar de plataforma custa
> mais do que a diferença de taxa.

## 3. Como montar, passo a passo

1. **Abrir a conta** no Asaas (ou na plataforma que você já usa) como pessoa física ou MEI, com os
   seus dados e a chave Pix do estúdio.
2. **Criar uma assinatura** chamada `Clube 15`: valor R$ 150, ciclo mensal, cobrança por Pix.
3. **Dia da cobrança:** escolha um só dia para todo mundo (sugestão: dia 5). Cobrar no aniversário
   de entrada de cada membro espalha 15 cobranças pelo mês inteiro e você perde a visão do caixa.
4. **Cadastrar o membro** com nome, CPF, WhatsApp e e-mail. A plataforma manda o lembrete; você não.
5. **Ligar o aviso de pagamento recebido** no WhatsApp ou e-mail. É esse aviso que você usa para
   lançar no app.
6. **Testar com você mesmo** antes do primeiro membro: crie uma assinatura de R$ 1, veja chegar o
   lembrete, pague e confira o aviso. Trinta minutos agora evitam um erro na frente de um cliente.
7. **Colar o link no site.** Em `site/js/config.js`, bloco `clube`, campo `assinatura`. Enquanto
   estiver vazio, as páginas do clube não mostram botão de pagar — mandam falar com você no
   WhatsApp, que é o certo até a conta existir. Com o link preenchido, o botão aparece sozinho nas
   duas páginas.

## 4. O que fazer quando o dinheiro cai

No app Caixa, **Mais > Clube 15 > Recebi a mensalidade**. Um toque faz três coisas:

- registra a mensalidade do membro;
- **lança a entrada no caixa** (descrição `Clube 15 — mensalidade MM/AAAA`);
- aumenta o crédito do membro.

**Não lance a mensalidade como entrada comum**, senão o valor entra duas vezes no caixa.

E quando o membro tatuar: **Usar crédito**, que abate do saldo dele. Esse abatimento **não entra no
caixa** — o dinheiro já entrou quando a mensalidade foi paga. Lançar de novo infla o seu
faturamento e estraga a meta do mês.

## 5. Quando alguém atrasa

O app avisa na tela Hoje e marca o membro como **em atraso**. O regulamento (item 4.5) diz que
atraso suspende a prioridade na agenda, mas **não** apaga o crédito já acumulado.

| Quando | O que fazer |
|---|---|
| 3 dias de atraso | Mensagem curta, sem cobrança dura: "[Nome], o Pix do clube deste mês não caiu. Deu algum problema com a cobrança?" |
| 10 dias | Avisar que a prioridade está suspensa até regularizar. Sem drama, é a regra que ele aceitou. |
| 30 dias | Perguntar se ele quer continuar. Se não quiser, aplique o item 4.3: o crédito continua dele por 6 meses. |
| 60 dias | Liberar a vaga para a lista de espera e marcar como **saiu** no app. |

Nunca humilhe e nunca ameace. O membro atrasado de hoje é o fechamento de costas do ano que vem.

## 6. Para o contador

Três perguntas, junto com as do `REGULAMENTO.md`:

1. A mensalidade recebida é receita no mês em que entra, ou quando o crédito vira tattoo?
   Isso muda o que você declara em 2027.
2. Emite nota fiscal a cada mensalidade ou só quando a sessão acontece?
3. A devolução de saldo (regulamento 4.4) entra como estorno ou como despesa? No app, ela é
   lançada como **saída** no caixa.
