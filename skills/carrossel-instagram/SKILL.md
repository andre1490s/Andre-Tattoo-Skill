---
name: carrossel-instagram
description: Use quando o Andre quiser um post em carrossel para o Instagram (vários cards): educativo, portfólio comentado, processo, prova social ou resposta a dúvida comum, com texto card a card, nota de arte, legenda e hashtags.
---

> Contexto global da marca (tom, estilos, regras de comunicação, preço): `contexto/marca.md`.
> Padrão visual: seção "Identidade visual dos posts" do `contexto/marca.md`. A arte de foto de tattoo é feita pela `arte-post-gemini`.

# SKILL — CARROSSEL PARA INSTAGRAM

## 1. Função
Transformar um tema, uma peça pronta ou uma dúvida de cliente em **roteiro de carrossel**: texto de cada card, nota de arte de cada card, legenda, hashtags e ordem de publicação.

Não faz: montar a imagem final (é Canva/Gemini, com o prompt da `arte-post-gemini`), legenda de peça única (`legenda-tattoo`), agendamento (`posts-semana-instagram`), roteiro de vídeo (`roteiro-reels-tattoo`). Não publica nada sem o André aprovar.

## 2. Entradas
- **Obrigatório:** o tema **ou** a(s) foto(s) da peça.
- **Opcional:** objetivo (autoridade, educação, prova social, preencher agenda), material disponível (fotos de processo, estêncil, cicatrizado), dúvida real de cliente que motivou o post.
- **Padrão quando não informado:** 7 cards, objetivo autoridade + intenção de orçamento, formato 4:5.

## 3. Formatos (escolher um e dizer por que)
| Formato | Quando usa | Cards |
|---|---|---|
| **Educativo** | dúvida que aparece no Direct (dor, cicatrização, preparação, retoque, tamanho mínimo) | 6 a 8 |
| **Erros / mitos** | tema com opinião forte ("5 erros ao escolher uma tattoo de realismo") | 6 a 7 |
| **Portfólio comentado** | uma peça boa, contada em etapas (referência → estêncil → luz e sombra → final) | 5 a 7 |
| **Processo** | mostrar método e cuidado técnico (higiene, agulha, sessão longa) | 5 a 6 |
| **Prova social** | depoimento real autorizado + foto da peça | 4 a 5 |
| **Antes e depois (cobertura)** | cover-up, só com autorização do cliente | 4 a 6 |

## 4. Estrutura padrão
1. **Capa:** gancho em até 7 palavras + promessa do que a pessoa leva ao final. Título serifado em caixa alta, canto superior esquerdo, no padrão do `contexto/marca.md`.
2. **Card 2:** o problema ou o contexto — por que isso importa para quem vai tatuar.
3. **Cards 3 a (n−2):** **uma ideia por card**. Título curto (até 5 palavras) + 1 a 2 linhas de explicação (até 25 palavras no total do card).
4. **Penúltimo:** o resumo em uma frase — o que a pessoa deve levar daqui.
5. **Último:** CTA. Sempre "me chama no link da bio" (o link leva ao WhatsApp com formulário). Nunca preço, nunca "a partir de".

Regras de texto: tom formal, técnico quando o assunto é tattoo, quase sem emoji, sem clichê ("cada tatuagem conta uma história"), sem superlativo ("o melhor", "exclusivo"). Nada de escassez falsa.

## 5. Saída (sempre nesta ordem)
1. **Formato escolhido e por quê** (1 linha).
2. **Tabela card a card:** nº · texto que vai na imagem · nota de arte (qual foto, qual plano, o que destacar).
3. **Legenda:** gancho de 1 linha + 2 a 4 linhas úteis + chamada para o link da bio. Se usar arte tratada: incluir "Foto tratada, tatuagem real."
4. **5 hashtags** (sem bloco gigante).
5. **Alt text** de cada card (acessibilidade e alcance).
6. **Como montar:** se o Canva estiver conectado, montar lá nas medidas 1080×1350; para card com foto de tattoo, usar o prompt da `arte-post-gemini`.
7. **Quando postar:** se o Metricool estiver conectado, consultar o melhor horário; senão, propor e marcar `[confirmar]`.

## 6. Limites
- Preço nunca aparece — nem faixa, nem "a partir de" (`contexto/marca.md`).
- Dado técnico que o André não confirmou vira `[confirmar]`, nunca palpite.
- História de cliente só com autorização; sem ela, usar o simbolismo tradicional do elemento.
- Não promete resultado ("sua tattoo vai durar para sempre") nem diagnostica pele.

## 7. Handoff
- `arte-post-gemini` → arte dos cards com foto de tattoo.
- `posts-semana-instagram` → entra no plano da semana e no agendamento.
- `relatorio-instagram` / `analista-metricas` → salvamentos e compartilhamentos do carrossel dizem se o formato se repete.
- Ao terminar, registrar no painel:
  `python3 -I painel/registrar.py execucao --agente carrossel --acao "<tema>" --status aguardando-andre --proximo-passo "<o que falta>"`
