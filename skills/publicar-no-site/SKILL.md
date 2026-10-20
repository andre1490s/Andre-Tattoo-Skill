---
name: publicar-no-site
description: Use quando o Andre mandar foto de uma tattoo pronta e quiser publicá-la no site (andretattoo.netlify.app), ou pedir para atualizar portfólio, textos, WhatsApp, horário ou qualquer informação do site.
---

# SKILL: PUBLICAR NO SITE

## 1. Função
Coloca uma peça nova na galeria do site e publica a alteração. Também atualiza dados do estúdio,
textos e configurações.
**Não faz:** criar o site do zero, mexer em preço (nenhum valor vai ao site) nem publicar foto de
cliente sem autorização.

## 2. Entradas
- **Obrigatório:** a foto (melhor qualidade disponível) e a confirmação de que **o cliente autorizou** a publicação.
- **Ideal:** região do corpo, estilo e o que a peça representa.
- **Pode ser assumido:** a legenda curta (`data-cap`) segue o padrão `Estilo · Peça`
  (ex.: `Realismo · Arcanjo`, `Blackwork · Peitoral`), e o `alt` descreve a foto para quem não enxerga.
  Qualquer texto novo no site segue o tom de `contexto/marca.md` — sem clichê de tatuagem e sem superlativo.

## 3. Como o site está montado
Uma página só, em `site/`: `index.html` (conteúdo), `css/style.css` (visual), `js/main.js` (interações).
A galeria são 9 botões dentro de `<div class="gallery">`, cada um com a classe de posição `w1` a `w9`:

- `w1` é a **peça grande** da esquerda — só entra aí trabalho forte, de preferência braço fechado
- `w2` a `w5` formam o miolo
- `w6` a `w9` são a fileira de baixo
- as posições são fixas no CSS: **trocar a ordem das peças é trocar o `src`/`alt`/`data-cap` dos botões**,
  não mover as classes

## 4. Passos
1. **Conferir autorização.** Sem ela, parar e avisar o André. Nada vai ao site sem isso.
2. **Decidir o lugar:** a peça substitui qual das 9? (a mais fraca sai) Ou o André quer uma galeria maior —
   aí avisar que isso mexe no CSS e combinar antes.
3. **Otimizar a imagem** com Pillow: um `.webp` de ~1200 px de largura em `site/img/`, mirando
   menos de 150 KB (qualidade 76 costuma bastar). Nome em minúsculas, sem acento, com hífen.
4. **Trocar o botão** correspondente no `index.html`: `src`, `alt` e `data-cap`.
5. **Conferir no navegador** antes de publicar: a peça aparece na grade sem corte feio e amplia na galeria.
6. **Commitar e empurrar.** O deploy da Netlify sai sozinho do branch publicado; se o site estiver em modo
   "arrastar pasta", avisar o André que ele precisa subir a pasta `site/`.

## 5. Saída
- Arquivo `.webp` em `site/img/`
- Botão atualizado em `site/index.html`
- Commit com a descrição da peça
- Uma frase ao André: o que entrou, em que posição e o que saiu

## 6. Handoff
Depois de publicar, a mesma foto costuma render post: passar para `legenda-tattoo` (legenda do Instagram) e
`posts-semana-instagram` (encaixe no calendário). Se a peça gerou conversa com o cliente, `registrar-no-sistema`.

## 7. Limites e honestidade
- **Nunca** publicar preço, faixa de preço ou "a partir de" no site.
- **Nunca** inventar significado, depoimento, número de clientes ou tempo de carreira.
- Foto de cliente sem autorização registrada: não entra. Na dúvida, perguntar.
- Se a foto estiver ruim (desfocada, luz dura, pele muito vermelha), dizer isso ao André em vez de publicar:
  peça ruim no site derruba a percepção de todas as outras.
- O repositório é público: não commitar nada identificável do cliente além da própria tattoo.

## 8. Checklist final
- [ ] Autorização do cliente confirmada
- [ ] `.webp` gerado com menos de ~150 KB
- [ ] `src`, `alt` e `data-cap` trocados no botão certo
- [ ] Sem nenhum valor em reais no site
- [ ] Testado no navegador (grade e ampliação) antes do commit

## 9. Versão anterior
A v1 do site (tema escuro, `js/config.js`, filtros por estilo, formulário de 3 passos) está preservada
em `site-v1/`. Se o André pedir algo que só existia lá (filtro por estilo, FAQ, formulário), é
reconstrução — combinar antes, não improvisar.
