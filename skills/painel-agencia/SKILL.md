---
name: painel-agencia
description: Use quando o Andre pedir para abrir, atualizar ou entender o painel da agência (o que os agentes fizeram, o que está parado, como o mês está), ou para lançar números de faturamento, funil, Instagram e YouTube.
---

> Contexto global da marca (meta do mês, preços, regras): `contexto/marca.md`.
> Documentação do painel e das chaves: `painel/README.md`.

# SKILL — PAINEL DA AGÊNCIA

## 1. Função
Manter e ler o painel em `painel/index.html`: executar o gerador, lançar números, mostrar o que está esperando o André e apontar o agente certo para cada ponto fraco.

Não faz: interpretar métrica a fundo (`analista-metricas`), decidir prioridade (`cerebro-estrategico`), análise financeira (`gestor-financeiro`). O painel mostra; eles decidem.

## 2. Comandos
```
python3 -I painel/gerar.py           # atualiza painel/index.html e imprime o resumo
python3 -I painel/gerar.py --resumo  # só o resumo
python3 -I painel/registrar.py metrica --categoria <financeiro|funil|instagram|youtube> --periodo <2026-10|2026-W42> --fonte "<de onde veio>" chave=valor ...
python3 -I painel/registrar.py execucao --agente <nome> --acao "<o que fez>" --status <entregue|aguardando-andre|travado> [--proximo-passo "..."] [--saida "..."]
```

## 3. Passos
1. Rodar `gerar.py` e **ler o resumo em voz alta para o André**: entradas x meta, lucro, ticket, funil, Instagram/YouTube, o que está aguardando ele.
2. Se ele trouxer números soltos ("fechei 14.200 em junho", "22 leads essa semana"), converter em comando `registrar.py` — **confirmar o período antes de gravar**.
3. Se faltar dado para um bloco, dizer **qual comando** preenche e de onde tirar o número (app Caixa, Metricool, YouTube Studio).
4. Apontar, no máximo em 3 linhas, onde o painel está pior e **qual agente resolve**:
   - entradas abaixo da meta → `financeiro` e `vendas`;
   - funil perdendo no meio → `vendas` (`closer-vendas`, `crm-followup`);
   - poucos posts ou alcance caindo → `marketing` e `carrossel`;
   - Shorts/retenção → `editor-video` e as skills de `youtube/`.
5. Nunca inventar número. Dado ausente é `—` no painel e `[confirmar]` na conversa.

## 4. Manutenção
- Meta do mês, metas da semana, prazo do YPP e lista de conexões ficam em `painel/dados/estado.json`.
- Mudou a meta no `contexto/marca.md`: mudar também aqui, no mesmo dia.
- `painel/index.html` é **gerado**. Mudança de visual é em `painel/gerar.py`, seguida de `gerar.py` de novo.
- Nunca gravar nome, telefone, foto ou conversa de cliente (regra 6 do `AGENCIA.md`).

## 5. Handoff
- `painel-agencia` → `cerebro-estrategico`: quadro do mês para definir P1/P2/P3.
- `painel-agencia` → `analista-metricas`: série de números para diagnóstico.
- qualquer agente → `painel-agencia`: toda execução registrada com status e próximo passo.
