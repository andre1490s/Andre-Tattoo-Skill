# Site Andre Tattoo

Página única, sem framework e sem build, pronta para a Netlify.
Direção visual: papel claro, tipografia Bodoni, fotos em preto e branco e uma
linha de agulha dourada que costura a página conforme você rola.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | a página inteira: topo, trabalhos, sobre, como agendar, estúdio |
| `css/style.css` | todo o visual (cores e fontes ficam nas variáveis do topo do arquivo) |
| `js/dados.js` | **o arquivo do dia a dia**: WhatsApp, Instagram, nota e avaliações do Google, lista de trabalhos |
| `js/main.js` | monta a galeria e as avaliações, linha da agulha, entrada suave, foto ampliada |
| `img/` | 10 fotos de trabalhos + 6 fotos do Andre e do estúdio |
| `404.html` | página de erro |
| `netlify.toml`, `robots.txt`, `sitemap.xml` | configuração de publicação e Google |

## Contato que está no ar
- **WhatsApp:** (11) 98271-3543 — aparece em 5 botões, todos com a mesma mensagem pronta
- **Instagram:** @andretatuadoor
- **Endereço:** Av. Melchert, 606 — Vila Matilde, São Paulo

Para trocar o número ou o @, mexa só em `js/dados.js` — todos os botões se atualizam sozinhos.

## Publicar
**Opção A — arrastar:** app.netlify.com → site `andretattoo` → *Deploys* → arraste a pasta `site/`.
**Opção B — ligar ao GitHub** (publica sozinho a cada commit): *Site configuration → Build & deploy →
Link repository*, com **Base directory: `site`**, **Build command:** vazio, **Publish directory: `site`**.

## Publicar uma tattoo nova
1. Salve a foto em `img/` (WebP, ~1200 px de largura, até ~150 KB)
2. Copie uma linha da lista `trabalhos` em `js/dados.js` e troque `img`, `cap` e `alt`

A galeria se monta sozinha: **a primeira peça da lista é a grande**, as outras entram
em fileiras de três. Pode ter 9, 15 ou 30 peças — a grade se ajusta.

## Avaliações do Google
A nota (`5,0`) aparece sempre. Os cards só aparecem quando houver texto real em
`google.avaliacoes` no `js/dados.js` — **nenhuma avaliação é escrita aqui**, só copiada
do Google. Preencha também `google.url` (link do Perfil da Empresa) para ligar o botão
"Ver no Google", e `google.total` para mostrar quantas avaliações são.

## Versão anterior
A primeira versão do site (tema escuro, formulário de 3 passos, FAQ e vídeo no topo)
está inteira em `../site-v1/`, com a documentação de mercado e de SEO dela.
