# Site Andre Tattoo

Página única, sem framework e sem build, pronta para a Netlify.
Direção visual: papel claro, tipografia Bodoni, fotos em preto e branco e uma
linha de agulha dourada que costura a página conforme você rola.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | a página inteira: topo, trabalhos, sobre, como agendar, estúdio |
| `css/style.css` | todo o visual (cores e fontes ficam nas variáveis do topo do arquivo) |
| `js/dados.js` | **o arquivo do dia a dia**: WhatsApp, Instagram, TikTok, endereço do formulário, nota e avaliações do Google, dúvidas e lista de trabalhos |
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

## Dúvidas
As perguntas ficam em `duvidas`, no `js/dados.js`. A sanfona do site e os dados
estruturados que o Google lê saem da mesma lista — mexeu numa, mudou nas duas.

> **Regra da casa:** nenhum valor, faixa de preço ou "a partir de" entra no site.
> Preço é conversa do André com o cliente.

## Avaliações do Google
A nota (`5,0`) aparece sempre. Os cards só aparecem quando houver texto real em
`google.avaliacoes` no `js/dados.js` — **nenhuma avaliação é escrita aqui**, só copiada
do Google. Preencha também `google.url` (link do Perfil da Empresa) para ligar o botão
"Ver no Google", e `google.total` para mostrar quantas avaliações são.

## Versão anterior
A primeira versão do site (tema escuro, formulário de 3 passos, FAQ e vídeo no topo)
está inteira em `../site-v1/`, com a documentação de mercado e de SEO dela.

## Trocar para o domínio próprio

Enquanto o domínio novo não estiver respondendo, o site segue apontando para
`andretattoo.netlify.app`. Trocar antes da hora faz o Google desindexar a página,
porque o endereço canônico passa a apontar para um lugar que não existe.

Ordem certa: publicar na Netlify → registrar o domínio → ligar o domínio na
Netlify → esperar o HTTPS → só então trocar as **6 linhas** abaixo.

| Arquivo | Linha | O que é |
|---|---|---|
| `index.html` | `<link rel="canonical">` | o endereço oficial da página para o Google |
| `index.html` | `og:url` | endereço no card de compartilhamento |
| `index.html` | `og:image` | imagem do card de compartilhamento |
| `index.html` | `"url"` e `"image"` no JSON-LD | ficha do estúdio para o Google |
| `sitemap.xml` | `<loc>` | o mapa do site |
| `robots.txt` | `Sitemap:` | onde o mapa está |

Depois da troca: reenviar o `sitemap.xml` no Search Console e atualizar o link
do site no Perfil da Empresa no Google, no Instagram e no TikTok.

### Registro do domínio

`andretattoo.com.br` estava livre no whois do Registro.br em 2026-10-27.
Registro.br, R$ 40,00 por ano, pago com CPF. Conferido na origem nessa data;
valor e disponibilidade podem ter mudado desde então.

### Apontar o domínio para a Netlify

Dois caminhos. O primeiro é o recomendado.

**DNS na Netlify.** No Registro.br, trocar os servidores DNS pelos que a Netlify
mostra ao adicionar o domínio. É o único jeito de o domínio sem `www` usar a
rede de distribuição da Netlify, em vez de cair num IP fixo.

**DNS no Registro.br.** Manter o DNS onde está e criar dois registros:

| Nome | Tipo | Valor |
|---|---|---|
| (vazio ou `@`) | A | `75.2.60.5` |
| `www` | CNAME | `andretattoo.netlify.app` |

O Registro.br não oferece ALIAS nem ANAME, então o domínio raiz precisa mesmo
do registro A. Valores conferidos na documentação da Netlify em 2026-10-27;
a própria Netlify mostra os atuais na tela de adicionar domínio, e é por ela
que se deve conferir na hora.

Em qualquer um dos dois, o HTTPS é emitido sozinho pela Netlify depois que o
DNS propaga. Só trocar as 6 linhas acima quando o cadeado já estiver aparecendo.
