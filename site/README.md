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
- **WhatsApp:** (11) 98271-3543: aparece em 5 botões, todos com a mesma mensagem pronta
- **Instagram:** @andretatuadoor
- **Endereço:** Av. Melchert, 606: Vila Matilde, São Paulo

Para trocar o número ou o @, mexa só em `js/dados.js`, todos os botões se atualizam sozinhos.

## Publicar
**Opção A, arrastar:** app.netlify.com → site `andretattoo` → *Deploys* → arraste a pasta `site/`.
**Opção B, ligar ao GitHub** (publica sozinho a cada commit): *Site configuration → Build & deploy →
Link repository*, com **Base directory: `site`**, **Build command:** vazio, **Publish directory: `site`**.

## Publicar uma tattoo nova
1. Salve a foto em `img/` (WebP, ~1200 px de largura, até ~150 KB)
2. Copie uma linha da lista `trabalhos` em `js/dados.js` e troque `img`, `cap` e `alt`

A galeria se monta sozinha: **a primeira peça da lista é a grande**, as outras entram
em fileiras de três. Pode ter 9, 15 ou 30 peças, a grade se ajusta.

## Dúvidas
As perguntas ficam em `duvidas`, no `js/dados.js`. A sanfona do site e os dados
estruturados que o Google lê saem da mesma lista, mexeu numa, mudou nas duas.

> **Regra da casa:** nenhum valor, faixa de preço ou "a partir de" entra no site.
> Preço é conversa do André com o cliente.

## Avaliações do Google
A nota (`5,0`) aparece sempre. Os cards só aparecem quando houver texto real em
`google.avaliacoes` no `js/dados.js`, **nenhuma avaliação é escrita aqui**, só copiada
do Google. Preencha também `google.url` (link do Perfil da Empresa) para ligar o botão
"Ver no Google", e `google.total` para mostrar quantas avaliações são.

## Versão anterior
A primeira versão do site (tema escuro, formulário de 3 passos, FAQ e vídeo no topo)
está inteira em `../site-v1/`, com a documentação de mercado e de SEO dela.

## Clube 15

Grupo fechado de 15 clientes, com página própria em `clube-15.html`. O convite
aparece em dois lugares da home: um selo no topo, logo abaixo dos botões, e a
seção escura depois das avaliações. Os três lugares leem o mesmo bloco `clube`
do `js/dados.js`.

**No dia a dia você mexe em um número só:** `ocupadas`. Os quinze risquinhos se
pintam sozinhos a partir dele, e o texto ao lado vira "3 vagas abertas",
"última vaga" ou "vagas esgotadas". Quando chega a zero, o botão deixa de
oferecer vaga e passa a oferecer lista de espera, com outra mensagem de
WhatsApp. Nada mais precisa ser editado.

Mantenha esse número honesto. Escassez inventada funciona uma vez e queima a
sua palavra: cliente que descobre não volta e ainda conta para os outros.

**Nenhum valor aparece aqui**, igual ao resto do site. A página explica o que é
e o botão abre o WhatsApp com "quero entrar no Clube 15". O valor da entrada
sai na conversa, depois que você confirma que existe vaga. Essa ordem evita o
pior cenário de um clube limitado, que é alguém pagar por uma vaga que já
acabou e você passar a semana devolvendo dinheiro.

## O domínio próprio

Feito em 05/11/2026. O site responde em **https://andretattoo.com.br**, com
HTTPS emitido pela Netlify.

O domínio está no Registro.br, no CPF do André, e **expira em 05/11/2027**.
Se vencer, volta ao mercado e qualquer um registra: renove antes.

O DNS continua nos servidores do Registro.br (`a.auto.dns.br` e `b.auto.dns.br`),
de propósito. O domínio nasceu com DNSSEC ativo, e trocar os servidores para os
da Netlify sem desligar o DNSSEC antes derruba o site. Lá dentro existe um
registro A apontando o domínio para `75.2.60.5`, que é o balanceador da Netlify.

O endereço `andretattoo.netlify.app` continua funcionando e não atrapalha: a
tag canonical de cada página aponta para o domínio próprio, então o Google
entende qual é o oficial.

Se um dia o endereço mudar de novo, estas são as linhas:

| Arquivo | Linha |
|---|---|
| `index.html` | `canonical`, `og:url`, `og:image`, e `url` e `image` no JSON-LD |
| `clube-15.html` | `canonical`, `og:url`, `og:image` |
| `sitemap.xml` | os dois `<loc>` |
| `robots.txt` | `Sitemap:` |

Depois de trocar: reenviar o `sitemap.xml` no Search Console e atualizar o link
do site no Perfil da Empresa no Google, no Instagram e no TikTok.

