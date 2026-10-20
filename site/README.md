# Site Andre Tattoo

Página única, sem framework e sem build, pronta para a Netlify.
Direção visual: papel claro, tipografia Bodoni, fotos em preto e branco e uma
linha de agulha dourada que costura a página conforme você rola.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | a página inteira: topo, trabalhos, sobre, como agendar, estúdio |
| `css/style.css` | todo o visual (cores e fontes ficam nas variáveis do topo do arquivo) |
| `js/main.js` | linha da agulha, entrada suave das fotos, galeria ampliada, botão flutuante |
| `img/` | 9 fotos de trabalhos + 6 fotos do Andre e do estúdio |
| `404.html` | página de erro |
| `netlify.toml`, `robots.txt`, `sitemap.xml` | configuração de publicação e Google |

## Contato que está no ar
- **WhatsApp:** (11) 98271-3543 — aparece em 5 botões, todos com a mesma mensagem pronta
- **Instagram:** @andretatuadoor
- **Endereço:** Av. Melchert, 606 — Vila Matilde, São Paulo

Para trocar o número, procure por `5511982713543` no `index.html` (5 ocorrências).

## Publicar
**Opção A — arrastar:** app.netlify.com → site `andretattoo` → *Deploys* → arraste a pasta `site/`.
**Opção B — ligar ao GitHub** (publica sozinho a cada commit): *Site configuration → Build & deploy →
Link repository*, com **Base directory: `site`**, **Build command:** vazio, **Publish directory: `site`**.

## Publicar uma tattoo nova
Hoje as 9 peças estão escritas direto no `index.html`, no bloco `<div class="gallery">`.
Para trocar uma: salve a foto em `img/` (WebP, ~1200px de largura) e troque o `src`,
o `alt` e o `data-cap` do botão correspondente.

> As posições da grade (`w1` a `w9`) são fixas: `w1` é a peça grande da esquerda.
> Se quiser que a galeria passe a ser montada sozinha a partir de uma lista,
> isso é a próxima etapa combinada.

## Versão anterior
A primeira versão do site (tema escuro, formulário de 3 passos, FAQ e vídeo no topo)
está inteira em `../site-v1/`, com a documentação de mercado e de SEO dela.
