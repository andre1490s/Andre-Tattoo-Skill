---
name: "revisao-conversas-sofia"
description: "Use quando o Andre colar conversas do agente de WhatsApp (Sofia) com clientes e quiser saber o que ela errou, acertou e quais regras melhorar no Cérebro."
---

# Revisão das conversas da Sofia — Andre Tattoo

## Passos
1. Ler cada conversa (ou exportação do n8n/WhatsApp) e identificar o cliente, o pedido e o resultado (virou orçamento, agendou, sumiu, foi para o Andre).
2. Conferir cada resposta da Sofia contra o checklist.
3. Entregar o relatório no formato abaixo.

## Checklist
- Inventou preço, horário, promoção ou regra?
- Confirmou agendamento sem confirmação do sistema?
- Fingiu ser o Andre ou disse que é humana?
- Pediu de novo algo que o cliente já tinha mandado?
- Fez interrogatório (muitas perguntas de uma vez) ou mandou texto enorme?
- Usou "sinal para reserva do horário" de R$ 100 corretamente (nunca "entrada")?
- Deu orientação médica ou prometeu que não dói?
- Deveria ter encaminhado para o Andre (reclamação, pagamento, saúde, pedido direto) e não encaminhou?
- Tom: natural e profissional, sem gíria excessiva nem formalidade exagerada?
- Deixou claro o próximo passo para o cliente?

## Formato
**Resumo:** X conversas · Y viraram orçamento completo · Z agendaram · W encaminhadas

**Erros graves** (inventou informação, confirmou sem sistema, saúde): trecho → o que deveria ter dito

**Ajustes de estilo:** trecho → versão melhor

**Perguntas sem resposta no Cérebro:** dúvidas que se repetiram e que a Sofia não sabia responder

**Sugestões de regra para o Cérebro** (o Andre aprova antes de entrar):
- Regra nova, em uma frase, pronta para colar no prompt do agente.

**Ideias de conteúdo:** dúvidas frequentes que viram post educativo (passar para posts-semana-instagram)

## Regras fixas
- Não mudar nenhuma regra sozinho: tudo é sugestão para o Andre aprovar.
- Não expor dados de cliente no relatório além do primeiro nome.
- Citar trechos curtos, não a conversa inteira.