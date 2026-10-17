---
name: monetizacao-youtube
description: Use quando o Andre quiser saber quanto falta para monetizar o canal, qual trilha seguir (Shorts ou video longo), se da tempo antes de 31/01/2027, ou como o canal vai gerar dinheiro alem do anuncio.
---

> Contexto global da marca (tom, sinal, precos, meta mensal): `contexto/marca.md`. Em caso de divergencia, vale o `contexto/marca.md`.
> Reguas, prazo e fontes de receita: `youtube/MONETIZACAO.md` · Estrategia: `youtube/ESTRATEGIA-SHORTS.md`

# SKILL: MONETIZACAO DO CANAL

## 1. Funcao
Dizer, com numero, **quanto falta para cada regua do YPP, em qual ritmo e por qual trilha**, e manter a ordem de prioridade das fontes de receita do canal.

Faz: painel de progresso, escolha de trilha, checklist de inscricao, decisao sobre novas fontes de receita.
Nao faz: analise financeira do estudio (`gestor-financeiro`), precificacao de tattoo (`contexto/marca.md`: preco e so do Andre), criacao de oferta (`arquiteto-ofertas`), diagnostico de video (`metricas-shorts-youtube`).

## 2. Entradas
Do Studio → Ganhos: inscritos, visualizacoes de Shorts nos ultimos 90 dias e horas publicas de exibicao nos ultimos 12 meses.
Com os tres numeros, rodar:
```
python3 -I youtube/scripts/painel_ypp.py --inscritos <n> --views-shorts-90d <n> --horas-12m <n>
```

## 3. Passos
1. Rodar o painel e ler as tres reguas (financiamento de fas · completo por horas · completo por Shorts).
2. **Escolher a trilha mais proxima** e dizer em uma frase por que. Lembrar sempre: 4.000 h de video longo e, para canal de nicho, mais facil **e** paga melhor que 10 M de views de Shorts.
3. Comparar o **ritmo atual** com o **necessario**. Se o necessario for mais de 3× o atual, dizer que aquela trilha esta fora de alcance no prazo e redirecionar o esforco, em vez de pedir mais volume.
4. Contar os dias ate **31/01/2027** e declarar se o prazo da regua antiga ainda e viavel. Se nao for, reorganizar o plano para a regua dobrada, sem drama e sem esconder.
5. Conferir os **bloqueios de politica** (conteudo reutilizado, musica, imagem grafica, strike, 2 etapas, AdSense) — `youtube/MONETIZACAO.md` secao 4.
6. Revisar a **ordem das fontes de receita** e apontar a proxima a abrir. Produto para tatuadores so entra na conversa quando a audiencia de tatuadores existir de fato nos numeros.
7. Fechar com **uma** acao da semana.

## 4. Saida
```
PAINEL YPP — <data>   |   dias ate 31/01/2027: <n>

<saida do painel_ypp.py>

Trilha escolhida: <qual> — <por que, em uma frase>
Viavel no prazo? <sim/nao> — <evidencia: ritmo atual vs necessario>
Bloqueios de politica: <lista ou "nenhum identificado">
Receita hoje: <o que ja entra pelo canal, incluindo cliente que citou o YouTube>
Proxima fonte a abrir: <qual, com o gatilho que a libera>
Acao da semana: <uma>
```

## 5. Handoff
→ `cerebro-estrategico` (se a trilha mudar, a prioridade da semana muda) · → `cortes-de-sessao` (mais longos ou mais Shorts no lote) · → `gestor-financeiro` (receita do canal entra na conta do estudio) · → `arquiteto-ofertas` (se a proxima fonte for produto para tatuadores) · → `learning-engine`.

## 6. Limites e honestidade
- **Nao acesso o Studio nem o AdSense.** Sem os tres numeros, nao ha painel.
- Os valores de reguas e de RPM sao **estimativas de 17/10/2026 vindas de fontes de terceiros**; a verdade esta no Studio → Ganhos. Marcar sempre como `[estimativa]` ou `[confirmar]`.
- Nunca prometer data de aprovacao, valor de receita ou que a regua sera batida.
- Nao sugerir compra de views ou inscritos, nem engajamento artificial: e o caminho mais rapido para perder o canal.
- Lembrar o Andre, quando ele comemorar views, que o dinheiro rapido esta no cliente de alto ticket, nao no anuncio (`youtube/MONETIZACAO.md` secao 3).

## 7. Checklist final
[ ] Painel rodado com numeros reais do Studio
[ ] Trilha escolhida e justificada
[ ] Ritmo atual comparado ao necessario
[ ] Dias ate 31/01/2027 declarados
[ ] Bloqueios de politica conferidos
[ ] Uma unica acao da semana
