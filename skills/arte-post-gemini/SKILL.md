---
name: arte-post-gemini
description: Use quando o Andre mandar foto de tattoo (pronta ou arte/desenho) e quiser o prompt do Gemini para gerar a arte do post no padrão editorial, já com os textos e o significado da tattoo.
---

> Contexto global da marca (tom, estilos, regras de comunicação): `contexto/marca.md`. Em caso de divergência, vale o `contexto/marca.md`.

# SKILL: ARTE DE POST NO GEMINI

## 1. Função
Recebe a foto de uma tattoo, entende o que está nela e entrega **um prompt pronto para colar no Gemini**, que trata a foto no padrão editorial (fundo escuro, luz lateral quente, tinta preta e cinza neutra) e **escreve os textos na imagem**: título, palavra em cursiva, linha de significado e rodapé da marca.
A cada foto, registra o que funcionou e o que o Gemini errou, para o prompt melhorar com o uso.

Não faz: legenda do Instagram (é da `legenda-tattoo`), agendamento (é da `posts-semana-instagram`), não gera a imagem (quem gera é o Gemini, do lado do Andre).

## 2. Entradas
- **Obrigatório:** foto da tattoo (ou da arte/desenho).
- **Opcional, só se o Andre informar:** história ou significado contado pelo cliente (e se o cliente autorizou usar), local do corpo, tempo de sessão, se é tattoo pronta ou arte.
- **Padrão quando não informado:** tattoo pronta, post único (1 imagem), sem história do cliente.

## 3. Passos
1. **Ler a memória antes de tudo:** `referencias/prompts-gemini-fotos.md` (base do estilo) e `referencias/registro-arte-gemini.md` (ajustes aprovados e erros do Gemini já vistos). Aplicar todo ajuste com status "Aprovado".
2. **Analisar a foto:** elementos do desenho, estilo (vocabulário da `legenda-tattoo`: "realismo preto e cinza", "realismo colorido", fine line, delicado, aquarela, blackwork, cobertura, fechamento), local do corpo, se é foto de pele ou de papel.
3. **Significado:**
   - Se o Andre trouxe a história do cliente e ela foi autorizada: usar a história, sem nome do cliente.
   - Se não: usar o **simbolismo tradicional dos elementos** (ex.: leão = força e proteção; rosa = amor e beleza que exige cuidado; relógio = tempo e finitude). Apresentar ao Andre como "simbolismo do elemento", nunca como se fosse a história do cliente.
   - Elemento com simbolismo incerto ou com mais de uma leitura forte: dar as opções e perguntar. Não inventar.
4. **Escrever os textos da imagem** (curtos, porque o Gemini erra texto longo):
   - **Título:** 1 a 3 palavras, caixa alta (ex.: "FORÇA E FÉ").
   - **Palavra em cursiva:** 1 palavra que complementa o título (ex.: "proteção").
   - **Linha de significado:** no máximo 8 palavras (ex.: "O leão guarda. A cruz conduz.").
   - **Rodapé fixo:** "ANDRE TATTOO" e, abaixo, o estilo (ex.: "REALISMO PRETO E CINZA").
   - Tom da marca: sério e técnico, sem emoji, sem clichê ("cada tatuagem conta uma história"), sem exagero ("único", "melhor"), sem preço.
5. **Montar o prompt** no modelo da seção 4, trocando só os campos. Arte/desenho: usar o cenário de papel sobre mesa de estúdio (Prompt 2 de `referencias/prompts-gemini-fotos.md`) no bloco CENÁRIO.
6. **Entregar** no formato da seção 4.
7. **Aprender:** quando o Andre contar o resultado (ficou bom, errou letra, mudou a tattoo, ficou claro demais), acrescentar uma linha em `referencias/registro-arte-gemini.md`. Se o mesmo erro aparecer **2 vezes ou mais**, propor ao Andre a mudança no modelo do prompt; só alterar a skill ou a base com o OK dele.

## 4. Saída

**Tattoo:** [elementos] · [estilo] · [local]
**Significado:** [2 a 3 linhas; marcar "simbolismo do elemento" ou "história do cliente (autorizada)"]
**Textos da arte:** título / cursiva / linha / rodapé

**Prompt para o Gemini** (bloco de código, para copiar no celular):

```
TAREFA: Edite a foto anexada para virar a arte de um post de Instagram de um estúdio de tatuagem.

PRESERVAR (obrigatório): a tatuagem deve ficar EXATAMENTE igual à original: mesmos traços, sombras, tons de preto e cinza, tamanho e posição. Não redesenhe, não corrija, não adicione nem remova nenhum detalhe. Mantenha o corpo, a pele e a anatomia como estão.

CENÁRIO E LUZ: fundo escuro e desfocado de estúdio de tatuagem, em preto, verde-musgo escuro e marrom. Luz quente e lateral de fim de tarde batendo na tatuagem, realçando o relevo da pele, sombras profundas. A tinta continua preta e cinza neutra, sem amarelar. Fotografia editorial de revista, cinematográfica, alto contraste, leve granulação de filme, profundidade de campo rasa com a tatuagem nítida.

LAYOUT: formato vertical 4:5. A tatuagem ocupa o centro e a parte de cima. O terço inferior fica escuro, com degradê suave para preto, e é onde ficam os textos.

TEXTOS NA IMAGEM (escreva exatamente como está entre aspas, em português, com acentos, sem trocar nem acrescentar nenhuma letra):
1. Título, em letra serifada elegante, grande, caixa alta, cor creme: "[TÍTULO]"
2. Logo abaixo do título, em letra cursiva fina, cor dourada: "[cursiva]"
3. Abaixo, em letra serifada pequena, cor creme: "[linha de significado]"
4. Rodapé centralizado, letra pequena com espaçamento largo entre as letras, cor creme: "ANDRE TATTOO"
5. Embaixo do rodapé, ainda menor: "[ESTILO]"
Os textos ficam alinhados à esquerda no terço inferior (o rodapé centralizado), com margem confortável das bordas, sem cobrir a tatuagem.

PROIBIDO: qualquer outro texto, logo, marca d'água, moldura, emoji ou elemento gráfico além dos listados.
```

**Se o Gemini errar:**
- Mudou a tattoo: "A tatuagem mudou. Refaça mantendo a tatuagem idêntica à foto original, traço por traço, mudando só o fundo, a luz e os textos."
- Errou letra: "O texto [X] saiu errado. Reescreva exatamente: \"[texto correto]\", mantendo todo o resto igual."
- Errou de novo: gerar sem textos (apagar o bloco TEXTOS e trocar o PROIBIDO por "Não escreva nenhum texto") e colocar os textos no Canva.

**Depois de testar, me conte:** ficou bom? Algo mudou na tattoo ou nos textos? (é isso que faz a skill aprender)

## 5. Handoff
- Significado e textos aprovados → `legenda-tattoo` (a legenda aprofunda o que a arte resume, sem repetir o título).
- Arte pronta → `posts-semana-instagram` para agendar.
- Resultado e erro do Gemini → `referencias/registro-arte-gemini.md`; padrão repetido (2x ou mais) → `learning-engine`.
- Cliente e post publicado → `registrar-no-sistema`.

## 6. Limites e honestidade
- Não vejo a imagem que o Gemini gera; o aprendizado depende do Andre contar o resultado.
- O Gemini pode errar acento e letra, e às vezes altera a tattoo. Por isso a conferência lado a lado com a original é obrigatória antes de postar.
- Não invento história do cliente, tempo de sessão nem significado pessoal. Sem informação, vale o simbolismo do elemento, marcado como tal.
- Nada de nome, rosto identificável ou foto de cliente no repositório (regra 6 do `AGENCIA.md`): o registro guarda só o tema da tattoo e o aprendizado.
- Na legenda, sugerir a linha "foto tratada, tatuagem real" para manter a confiança se o Instagram marcar o post como IA.

## 7. Checklist final
[ ] Li o registro e apliquei os ajustes aprovados
[ ] O bloco PRESERVAR está intacto no prompt
[ ] Significado marcado como "simbolismo do elemento" ou "história do cliente (autorizada)"
[ ] Título até 3 palavras, linha até 8 palavras, sem emoji, clichê ou preço
[ ] Textos entre aspas, com acentos, e o mesmo texto repetido na lista "Textos da arte"
[ ] Prompt em bloco de código, pronto para copiar
[ ] Pedi o retorno do Andre sobre o resultado
