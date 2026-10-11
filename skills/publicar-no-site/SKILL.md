---
name: publicar-no-site
description: Use quando o Andre mandar foto de uma tattoo pronta e quiser publicá-la no site (andretattoo.netlify.app), ou pedir para atualizar portfólio, textos, WhatsApp, horário ou qualquer informação do site.
---

# SKILL: PUBLICAR NO SITE

## 1. Função
Coloca uma peça nova no portfólio do site e publica a alteração. Também atualiza dados do estúdio,
textos e configurações.
**Não faz:** criar o site do zero, mexer em preço (nenhum valor vai ao site) nem publicar foto de
cliente sem autorização.

## 2. Entradas
- **Obrigatório:** a foto (melhor qualidade disponível) e a confirmação de que **o cliente autorizou** a publicação.
- **Ideal:** região do corpo, estilo e o significado do elemento.
- **Pode ser assumido:** título, palavra cursiva e significado seguem o padrão editorial de `contexto/marca.md`
  (título até 3 palavras em caixa alta; palavra cursiva = nome do elemento; significado até 8 palavras).
- Se a foto foi tratada por IA no fundo/luz: marcar `tratada: true`.

## 3. Passos
1. **Conferir autorização.** Sem ela, parar e avisar o André. Nada vai ao site sem isso.
2. **Classificar a peça:** `realismo` | `fineline` | `blackwork` | `lettering`. Se não existir filtro para
   o estilo, propor ao André criar um novo (mexe em `index.html` e `main.js`).
3. **Otimizar a imagem** com Pillow, gerando 4 arquivos em `site/img/portfolio/`:
   `<nome>.jpg` e `<nome>.webp` (1200 px de largura) e `<nome>-sm.jpg` / `<nome>-sm.webp` (640 px).
   Qualidade: JPG 80/74, WEBP 76/70. Nome do arquivo em minúsculas, sem acento, com hífen.
4. **Escrever a legenda** no padrão da marca: título, palavra cursiva, significado. O significado fala do que
   o elemento representa em tatuagem, não descreve a foto (regra de `contexto/marca.md`).
5. **Acrescentar a linha** em `window.SITE.portfolio` (`site/js/config.js`), no topo da lista se for o
   trabalho mais recente. `destaque: true` só para as 6 melhores peças — o slider do topo não deve crescer.
6. **Conferir no navegador** antes de publicar: a peça aparece na grade, no filtro certo e amplia sem corte feio.
7. **Commitar e empurrar.** O deploy da Netlify sai sozinho do branch publicado; se o site estiver em modo
   "arrastar pasta", avisar o André que ele precisa subir a pasta `site/`.

## 4. Saída
- Arquivos de imagem em `site/img/portfolio/`
- Linha nova em `site/js/config.js`
- Commit com a descrição da peça
- Uma frase ao André: o que entrou, em qual filtro e se virou destaque

## 5. Handoff
Depois de publicar, a mesma foto costuma render post: passar para `legenda-tattoo` (legenda do Instagram) e
`posts-semana-instagram` (encaixe no calendário). Se a peça gerou conversa com o cliente, `registrar-no-sistema`.

## 6. Limites e honestidade
- **Nunca** publicar preço, faixa de preço ou "a partir de" no site.
- **Nunca** inventar significado, depoimento, número de clientes ou tempo de carreira.
- Foto de cliente sem autorização registrada: não entra. Na dúvida, perguntar.
- Se a foto estiver ruim (desfocada, luz dura, pele muito vermelha), dizer isso ao André em vez de publicar:
  peça ruim no site derruba a percepção de todas as outras.
- O repositório é público: não commitar nada identificável do cliente além da própria tattoo.

## 7. Checklist final
- [ ] Autorização do cliente confirmada
- [ ] 4 arquivos de imagem gerados e com menos de ~150 KB no webp
- [ ] Linha no `config.js` com estilo válido e `alt` descritivo
- [ ] Significado no padrão da marca, sem clichê
- [ ] Sem nenhum valor em reais no site
- [ ] Testado no navegador (grade, filtro, ampliação) antes do commit
