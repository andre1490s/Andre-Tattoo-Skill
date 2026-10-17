---
name: metricas-shorts-youtube
description: Use quando o Andre trouxer numeros do YouTube Studio e quiser saber o que funcionou, por que um Short nao rendeu e o que repetir ou aposentar.
---

> Contexto global da marca (tom, sinal, precos, estudio): `contexto/marca.md`. Em caso de divergencia, vale o `contexto/marca.md`.
> Alvos e indicadores: `youtube/ESTRATEGIA-SHORTS.md` secao 10 · Formatos: `youtube/FORMATOS.md`

# SKILL: DIAGNOSTICO DE SHORTS (YOUTUBE STUDIO)

## 1. Funcao
Transformar numero do Studio em decisao: qual formato dobrar, qual gancho trocar, qual aposentar.

Faz: diagnostico por Short e por formato, ranking, teste da semana.
Nao faz: Instagram (`relatorio-instagram`), estrategia geral de dado (`analista-metricas`, que recebe o resultado daqui), progresso na regua do YPP (`monetizacao-youtube`).

## 2. Entradas
Do Studio, por Short: visualizacoes, **taxa de assistidos vs. rolados**, duracao media da visualizacao, **% medio assistido** (pode passar de 100% com loop) e inscritos ganhos.
Se ele mandar so "o video X foi bem", pedir os dois numeros minimos: visualizacoes em 48 h e % medio assistido. Sem eles, nao ha diagnostico, so palpite.

## 3. Passos
1. Montar o ranking dos Shorts do periodo por **% medio assistido** e por **visualizacoes em 48 h** — as duas colunas lado a lado, porque elas discordam com frequencia e e justamente ai que esta a informacao.
2. Agrupar por formato (`youtube/FORMATOS.md`) e tirar a media de cada um. Formato com menos de 3 Shorts publicados nao tem conclusao: declarar amostra insuficiente.
3. Aplicar a arvore de diagnostico:

| Sintoma | Causa provavel | Acao |
|---|---|---|
| Views baixas (< 500 em 48 h) e rolados alto | primeiro frame e gancho | refazer o primeiro frame, nao o video |
| Views boas e % assistido baixo (< 50%) | promessa nao cumprida no meio | encurtar; antecipar a recompensa |
| % assistido alto (> 90%) e views baixas | o video e bom e nao foi distribuido | republicar com gancho e titulo novos |
| Views altas e nenhum inscrito | nao ha motivo para seguir o canal | serie continua, CTA de canal, playlist |
| Views altas e nenhum orcamento | publico tatuador, nao cliente | corrigir o mix 70/30 |
| Queda geral depois de volume alto | repeticao excessiva do mesmo molde | variar formato antes de variar cadencia |

4. Escolher **um** teste para a semana seguinte (uma variavel por vez: primeiro frame **ou** duracao **ou** formato — nunca as tres).
5. Registrar o que virou conhecimento.

## 4. Saida
```
SEMANA <datas> — N Shorts publicados

Top 3 por % assistido · Top 3 por views em 48 h
Por formato: media de views, media de % assistido, amostra

Diagnostico: 2 a 4 frases, com a causa e a evidencia
Dobrar: <formatos>     Aposentar: <formatos>     Amostra insuficiente: <formatos>
Teste da semana: <uma variavel, com o resultado esperado e como medir>
O que nao se pode concluir ainda: <...>
```

## 5. Handoff
→ `analista-metricas` (entra na leitura geral de dados) · → `cerebro-estrategico` (prioridade da semana) · → `cortes-de-sessao` (o lote da proxima sessao ja sai enviesado para o formato vencedor) · → `registrar-no-sistema` e `learning-engine` (aprendizado com nivel de confianca) · → `monetizacao-youtube` (ritmo contra a regua).

## 6. Limites e honestidade
- **Nao acesso o YouTube Studio.** Trabalho com os numeros que o Andre colar. Nao inventar metrica, nao estimar view que ele nao informou.
- Menos de 3 Shorts por formato: declarar amostra insuficiente em vez de concluir.
- Alcance de Shorts e irregular por natureza: um video fora da curva nao prova que o formato funciona. Dizer isso quando for o caso.
- Nao atribuir orcamento ao YouTube sem o cliente ter dito de onde veio.

## 7. Checklist final
[ ] As duas colunas (views 48 h e % assistido) estao no ranking
[ ] Amostra declarada por formato
[ ] Causa apoiada em numero, nao em impressao
[ ] Um unico teste proposto, com forma de medir
[ ] O que nao se pode concluir esta escrito
