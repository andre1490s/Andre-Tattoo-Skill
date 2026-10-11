# Site André Tattoo

Site institucional do estúdio: uma página só (`index.html`), sem framework, sem build
e sem dependência externa além das fontes do Google. Abre em qualquer navegador e
sobe em qualquer hospedagem estática (Netlify, GitHub Pages, Vercel).

Segue o `contexto/marca.md`: realismo preto e cinza no centro, tipografia serifada
creme com palavra cursiva dourada, tom formal e **nenhum preço em lugar público**.

## 1. O que falta preencher antes de publicar

| Onde | O quê |
|---|---|
| `js/config.js` → `whatsapp` | número com DDI e DDD, só dígitos (ex.: `5511912345678`). **Enquanto estiver vazio, todo botão de orçamento abre o Direct do Instagram.** |
| `js/config.js` → `portfolio` | as fotos reais (ver item 3) |
| `js/config.js` → `retrato` e `fotosEstudio` | foto do André e do estúdio (opcional) |
| `index.html` | confirmar cidade, domingo/feriado e "só com hora marcada" quando o André decidir |

Enquanto não houver nenhuma foto no portfólio, a grade mostra espaços "Em breve"
com os títulos e significados — assim o layout não fica vazio. Na hora em que a
**primeira** foto real entrar, os espaços somem sozinhos e só os trabalhos reais
aparecem.

## 2. Publicar na Netlify

**Opção A — arrastar a pasta** (mais rápido): app.netlify.com → o site
`andretattoo` → *Deploys* → arrastar a pasta `site/` inteira na área de upload.

**Opção B — ligar ao GitHub** (publica sozinho a cada commit): no site da Netlify,
*Site configuration → Build & deploy → Link repository*, escolher este repositório e usar:
- Base directory: `site`
- Build command: *(vazio)*
- Publish directory: `site`

O `netlify.toml` já cuida de cabeçalhos de segurança e cache.

## 3. Publicar uma tattoo no portfólio

1. Salve a foto em `img/portfolio/` (JPG, lado maior de ~1600px, até ~400 KB).
   Proporção 4:5 fica perfeita — outras são cortadas no centro.
2. Abra `js/config.js` e acrescente/edite a linha do trabalho:

```js
{ src: "/img/portfolio/leao.jpg", alt: "Leão em realismo preto e cinza no antebraço",
  titulo: "Força Serena", palavra: "leão", significado: "Coragem que não precisa rugir",
  estilo: "realismo", local: "Antebraço", tratada: false },
```

- `estilo` precisa ser um destes: `realismo`, `fineline`, `delicado`, `coverup`, `colorido`
  (são os filtros da página).
- `titulo` até 3 palavras, `significado` até 8 — o mesmo padrão editorial dos posts.
- `tratada: true` quando a foto passou por tratamento de fundo e luz por IA: a legenda
  da ampliação passa a trazer "Foto tratada, tatuagem real.", como manda a marca.
- **Não commitar foto de cliente sem autorização** (regra do `PENDENCIAS.md`).

## 4. Regras de marca que o site já respeita

- Nenhum preço, nem "a partir de" — o valor sai só do André, na conversa.
- Sinal explicado sem valor, com a regra de não devolução em cancelamento ou reagendamento.
- Retoque a partir de 40 dias, depois de avaliação.
- Maori declarado como estilo que o estúdio não faz.
- 18 anos como idade mínima, dito em três lugares (sobre, estúdio, formulário).
- Sem escassez falsa, sem promessa de resultado, sem antes/depois.
- Sem depoimento inventado: quando houver avaliações reais do Google, dá para abrir
  uma seção para elas.

## 5. Como o site é por dentro

```
site/
├── index.html         página única, todas as seções
├── 404.html
├── css/style.css      tokens de cor/tipografia no topo (:root)
├── js/config.js       ÚNICO arquivo de edição no dia a dia
├── js/main.js         interações
├── img/               favicon, og.png, portfolio/, estudio/
├── netlify.toml       cabeçalhos e cache
├── robots.txt  sitemap.xml
```

Interações: carregamento com traço do logo, fumaça em canvas no topo (reage ao
mouse e para quando sai da tela), revelação ao rolar, cards com inclinação 3D,
portfólio com filtro e ampliação (teclado e arraste no celular), trilho do
processo que preenche com a rolagem, dúvidas em acordeão e o formulário de
orçamento em 3 passos que monta a mensagem e abre o WhatsApp.

Tudo tem versão sem movimento: quem liga "reduzir animações" no sistema recebe a
página estática, sem canvas e sem cursor customizado.

## 6. Mexer no visual

As cores e fontes estão todas em `css/style.css`, no bloco `:root` (primeiras 30 linhas):
`--gold` é o dourado dos detalhes, `--cream` o creme dos títulos, `--ink` o fundo.
Trocar o dourado por prata (como no app) é mudar duas linhas.
