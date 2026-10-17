---
name: cortes-de-sessao
description: Use quando o Andre tiver filmado uma sessao e quiser transformar o material bruto em um lote de Shorts e um video longo ("tenho o material da sessao de ontem", "o que da pra tirar disso").
---

> Contexto global da marca (tom, sinal, precos, estudio): `contexto/marca.md`. Em caso de divergencia, vale o `contexto/marca.md`.
> Estrategia do canal: `youtube/ESTRATEGIA-SHORTS.md` · Formatos: `youtube/FORMATOS.md` · Planos de gravacao: `youtube/KIT-GRAVACAO.md`

# SKILL: CORTES DE SESSAO → LOTE DE SHORTS

## 1. Funcao
Transformar **uma sessao filmada em 8 a 15 Shorts + 1 video longo**, decidindo quais formatos usar com o material que existe de verdade.

Faz: inventario do material, mapa de cortes, ordem de publicacao do lote.
Nao faz: roteiro detalhado de cada Short (skill `roteiro-shorts-youtube`), receita de edicao (skill `editor-videos-tattoo`), titulo e descricao (skill `publicar-shorts-youtube`).

## 2. Entradas
Minimo: a peca (o que e, estilo, regiao do corpo), a duracao da sessao e **quais dos 12 planos obrigatorios ele conseguiu filmar** (`youtube/KIT-GRAVACAO.md`).
Pode ser assumido por padrao: realismo preto e cinza, 9:16, publico-alvo cliente, autorizacao do cliente **nao** concedida para rosto/nome (pedir confirmacao explicita antes de usar qualquer plano com pessoa identificavel).

Se ele mandar a lista de arquivos, ler os nomes no padrao `AAAAMMDD_peca_NN-plano.mp4` e montar o inventario sozinha, sem perguntar.

## 3. Passos
1. **Inventario:** listar os planos disponiveis e marcar os ausentes. Se faltarem os planos 5, 7 ou 11, avisar que o lote sai menor e dizer o que filmar na proxima sessao.
2. **Cruzar com os formatos:** para cada formato de `youtube/FORMATOS.md`, dizer se o material permite. Nao forcar formato sem plano.
3. **Mapa de cortes:** uma linha por Short, com o formato, os planos usados, a duracao alvo e o publico (cliente/tatuador).
4. **Checar o mix:** o lote deve ficar em ~70% cliente / 30% tatuador. Se desequilibrar, propor a troca.
5. **Ordem de publicacao:** o de maior potencial de retencao primeiro (normalmente formato 1, 2 ou 3), espalhando os tecnicos ao longo da semana.
6. **Separar o video longo:** indicar qual bloco continuo serve (20–40 min) e onde cortar inicio e fim.
7. **Apontar o que faltou** para a proxima sessao, em no maximo 3 itens.

## 4. Saida
```
LOTE — <peca> — <data da sessao>

Inventario: planos presentes / ausentes
Rende: N Shorts + 1 longo (ou "sem longo", se nao houver bloco continuo)

| # | Formato | Planos | Duracao | Publico | Prioridade |
|---|---|---|---|---|---|

Video longo: bloco <arquivo>, cortar <inicio> e <fim>, titulo provisorio
Mix do lote: X% cliente / Y% tatuador
Para a proxima sessao: 1–3 planos a nao esquecer
```

## 5. Handoff
Cada linha do mapa → `roteiro-shorts-youtube` (gancho e texto de tela) → `editor-videos-tattoo` (receita de edicao) → `publicar-shorts-youtube` (pacote de publicacao).
O lote inteiro → `youtube/CALENDARIO-90-DIAS.md` para encaixar na semana.

## 6. Limites e honestidade
- **Nao assisto video.** Trabalho pela descricao dos planos e pelos nomes dos arquivos. Nao afirmar que um take "esta bom" sem o Andre dizer.
- Nao inventar plano que ele nao filmou para fechar um formato bonito no papel.
- Plano com cliente identificavel so entra com autorizacao declarada por ele na conversa.
- Sessao sem os planos 5, 7 e 11 rende poucos Shorts: dizer isso em vez de prometer 10.

## 7. Checklist final
[ ] Todo Short do mapa tem plano real por tras
[ ] Mix 70/30 conferido
[ ] Video longo identificado (ou ausencia declarada)
[ ] Nenhum plano com cliente identificavel sem autorizacao
[ ] No maximo 3 itens de melhoria para a proxima sessao
