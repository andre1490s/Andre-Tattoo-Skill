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
| `img/` | 12 fotos de trabalhos + fotos do Andre e do estúdio |
| `tatuagem-no-braco.html` · `tatuagem-nas-costas.html` · `realismo-preto-e-cinza.html` · `tatuagem-feminina-delicada.html` · `cuidados-depois-da-tatuagem.html` | as cinco páginas de conteúdo (ver abaixo) |
| `css/pagina.css` | o pouco que só as cinco páginas usam; carrega depois do `style.css` e não altera a home |
| `404.html` | página de erro |
| `netlify.toml`, `robots.txt`, `sitemap.xml` | configuração de publicação e Google |

## As cinco páginas de conteúdo (08/11/2026)

A home disputa uma busca só. Estas cinco disputam as buscas que São Paulo realmente faz — que se
organizam por **região do corpo** e por **significado**, não por nome de estilo (medição em
`ESTUDO-SEO.md`, na branch `claude/seo-em-trilha-23ouwm`).

| Página | Para que busca | Peças |
|---|---|---|
| `tatuagem-no-braco` | braço, no braço, antebraço, fechamento | samurai, leão, cigana, justiça, urso, retrato |
| `tatuagem-nas-costas` | costas, projeto grande | lírio nas costas, processo, stencil |
| `realismo-preto-e-cinza` | o posicionamento da marca | leão, Poseidon, arcanjo, retrato, rostos, peitoral |
| `tatuagem-feminina-delicada` | feminina, delicada, fine line | fada, lírios na perna, pet |
| `cuidados-depois-da-tatuagem` | pomada, cicatrização, retoque | foto do estúdio |

**Como mexer.** Diferente da home, o conteúdo delas está **no HTML, não no `dados.js`** — de propósito:
texto montado por JavaScript conta pouco para busca, e essas páginas existem para serem encontradas. Para
editar, abra o arquivo. O cabeçalho, o rodapé e os botões continuam vindo do `dados.js` e do `main.js`.

**Regras que valem ao editar:** nenhum valor em nenhuma delas, nem "a partir de"; nada de depoimento,
número de clientes ou ano de carreira inventado; e o texto de cuidados é o **oficial**, idêntico ao da
skill `pos-tattoo-avaliacao` e do app Caixa — se mudar, mude nos três.

Cinco imagens vieram do site antigo (`site-v1/img/portfolio/`): a fada, os dois lírios, a Nossa Senhora e o
stencil do vaso. São fotos do próprio Andre, já publicadas antes. Elas **não** entraram na galeria da home.

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

A galeria se monta sozinha: **todas as peças aparecem do mesmo tamanho**, três por fileira
no computador e duas no celular. Pode ter 9, 15 ou 30 peças, a grade se ajusta.

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

## Medição (Analytics e Pixel)

Os dois códigos ficam no bloco `medicao` do `js/dados.js`. **Vazios = desligado:**
nada é baixado e nada é enviado. Para ligar, é só colar e publicar; vale para as
sete páginas de uma vez, porque todas carregam o mesmo `js/main.js`.

| Campo | Onde achar |
|---|---|
| `ga4` | analytics.google.com → Administrador → Fluxos de dados → Web (começa com `G-`) |
| `pixel` | facebook.com/events_manager2 → Conjuntos de dados **do tipo Web** (uns 15 dígitos) |

Nenhum dos dois é senha: ficam visíveis no código de qualquer site que os use.

**O que é medido não é visita, é contato:**

| Evento | O que responde |
|---|---|
| `whatsapp` / `Contact` | quantos chamaram, e de **qual botão** saíram |
| `generate_lead` / `Lead` | quantos preencheram o formulário inteiro |
| `clube_15` / `ViewContent` | quantos foram olhar o clube |

Para conferir depois de mexer: `node site/test/medicao.mjs`. Ele abre o site num
navegador de verdade e checa cinco coisas: o estado desligado (não pode baixar
nem enviar nada), o estado ligado, o campo isca anti-robô mesmo sem CSS, o que
está publicado de verdade no `dados.js`, e **a medição em cada uma das páginas**.

Esse último cenário existe por causa de um bug real: a `clube-15.html` não tem o
elemento da galeria ampliada, a linha que o usava estourava e tudo o que vinha
depois no `main.js` parava de rodar **só naquela página**, medição inclusive.
Passou despercebido porque o teste só abria a home. Página nova com um pedaço a
menos pode repetir isso, então agora toda página que carrega o `main.js` é
verificada.

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

**Hoje esse número está em 3 sem ter 3 membros reais.** O André pediu assim em
08/11/2026, para criar urgência, ciente de que contraria a regra abaixo. Quando
entrarem membros de verdade, substitua estes 3 em vez de somar em cima.

A regra original, que volta a valer assim que houver membros reais: mantenha
esse número honesto. Escassez inventada funciona uma vez e queima a sua palavra,
porque cliente que descobre não volta e ainda conta para os outros. Num grupo de
quinze pessoas que se falam, a chance de aparecer é alta.

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

