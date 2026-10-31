# Site André Tattoo — v2

Site de captação: uma página, sem framework e sem build, pronto para a Netlify.
A arquitetura de seções e as decisões de conversão estão justificadas em
[`ESTUDO-MERCADO-UX-CRO.md`](ESTUDO-MERCADO-UX-CRO.md) — leia antes de mudar a ordem das seções.

## 1. O que já está configurado
- **WhatsApp:** (11) 98271-3543
- **Portfólio:** 9 peças reais + 2 fotos de processo (stencil) + 2 fotos do artista
- **Vídeo do topo:** você tatuando, em slow motion, sem áudio (MP4 + WebM, versão separada para celular)
- **Formulário de 3 passos** com upload de até 4 imagens de referência

## 2. Como o formulário entrega o lead (importante)
Ao enviar, acontecem **duas coisas ao mesmo tempo**:
1. O pedido é gravado no **Netlify Forms** com as fotos anexadas → você recebe por e-mail e vê em
   *Netlify → seu site → Forms → orçamento*
2. O **WhatsApp abre** no celular do cliente com o resumo escrito, pronto para ele enviar

Se o cliente desistir de apertar "enviar" no WhatsApp, **você ainda tem o lead** gravado. Esse é o ponto
que mais muda a conversão.

**Para o e-mail chegar:** Netlify → *Forms → Form notifications → Add notification → Email notification*,
e coloque seu e-mail. O plano gratuito aceita 100 envios por mês.

> O formulário só grava quando o site está hospedado na Netlify. Aberto localmente, ele apenas abre o
> WhatsApp — o que é o comportamento esperado.

## 2.1 Clube 15: as duas páginas do clube

| Página | Quem vê | Para quê |
|---|---|---|
| `clube-15.html` | qualquer um (link da bio) | explica o clube, as regras e **capta o cadastro** (formulário Netlify `clube15`) |
| `clube-15-membro.html` | **só quem é membro** | mostra as **datas de 2027** abertas antes do público e o link da mensalidade |

A página do membro é **não listada**: tem `noindex`, está bloqueada no `robots.txt` e fora do
`sitemap.xml`. Ela não tem senha — o que protege é o link não estar em lugar nenhum. Mande só para
quem entrou, e não publique em story.

**O caminho do cliente, do começo ao fim:**
link da bio → `clube-15.html` → formulário → você conversa no WhatsApp → você manda o link da
mensalidade → ele assina → você manda o link da área do membro → ele escolhe a data → confirma no
WhatsApp → você marca a sessão no app.

### Onde se mexe (tudo em `js/config.js`, bloco `clube`)

| Campo | O que faz |
|---|---|
| `assinatura` | link de cobrança recorrente. **Vazio**: a página não mostra botão de pagar e manda falar no WhatsApp. Preenchido: aparece o botão nas duas páginas |
| `ocupadas` | quantas das 15 vagas já estão ocupadas. A página calcula as restantes. Com 15, os botões viram "Entrar na lista de espera" |
| `datas` | as datas que aparecem para os membros. Datas passadas somem sozinhas |
| `atualizado` | data que aparece no rodapé da lista de datas |

**Não preencha `datas` e `ocupadas` na mão.** No app Caixa: **Mais > Clube 15 > Datas para o site**.
Ele gera esse bloco inteiro com os números certos — é só copiar e trocar o bloco `clube` do
`config.js`. O campo `assinatura` o app não preenche: cole o link uma vez e ele fica.

## 3. Publicar
**Opção A — arrastar:** app.netlify.com → site `andretattoo` → *Deploys* → arraste a pasta `site/`.
**Opção B — ligar ao GitHub** (publica sozinho a cada commit): *Site configuration → Build & deploy →
Link repository*, com **Base directory: `site`**, **Build command:** vazio, **Publish directory: `site`**.

## 4. Mexer no conteúdo
Tudo em **`js/config.js`**:

| Quero | Onde |
|---|---|
| Trocar WhatsApp / Instagram | `whatsapp`, `instagram` |
| Endereço, horário, mapa | `estudio` |
| Publicar tattoo nova | `portfolio` (ver skill `publicar-no-site`) |
| Fotos de stencil / processo | `processo` |
| Ligar depoimentos | `depoimentos.ativo = true` + lista (ver skill `depoimento-para-o-site`) |
| Google Analytics / Meta Pixel | `analytics` |

### Publicar uma tattoo nova
1. Salve a foto em `img/portfolio/` em 4 arquivos: `nome.jpg`, `nome.webp` (1200 px) e
   `nome-sm.jpg`, `nome-sm.webp` (640 px).
2. Acrescente uma linha em `portfolio`, no topo da lista:
```js
{ img:"leao-antebraco", estilo:"realismo", local:"Antebraço", titulo:"Força Serena",
  palavra:"leão", significado:"Coragem que não precisa rugir",
  alt:"Leão em realismo preto e cinza no antebraço", destaque:true },
```
`estilo` precisa ser um dos filtros: `realismo`, `fineline`, `blackwork`, `lettering`.
`destaque: true` coloca a peça também no slider do topo — mantenha no máximo 6.

**Peça ao Claude:** "publica essa tattoo no site" e a skill `publicar-no-site` faz os 4 arquivos,
a legenda no padrão da marca e o commit.

## 5. Medição (ligar quando tiver as contas)
Em `config.js → analytics`, cole `ga4: "G-XXXXXXX"` e/ou `metaPixel: "000000000"`.
Os eventos já disparam sozinhos: `form_inicio`, `form_passo2`, `form_passo3`, `form_envio`,
`form_upload`, `portfolio_ampliar`, `portfolio_filtro`, `faq_abrir`, `video_play` e os cliques de CTA
(`cta_hero`, `cta_nav`, `cta_barra`, `whatsapp_barra`...). Sem ID, nada é carregado — zero peso extra.

## 6. Regras de marca que o site respeita
Sem preço em lugar nenhum · sinal explicado sem valor, com a regra de não devolução · retoque a partir de
40 dias · maori declarado como estilo que o estúdio não faz · 18 anos em três pontos · sem escassez falsa ·
sem depoimento, número de clientes ou tempo de carreira inventados.

## 7. Estrutura
```
site/
├── index.html              página única
├── 404.html
├── css/style.css           tokens de cor e tipografia no topo (:root)
├── js/config.js            ÚNICO arquivo de edição no dia a dia
├── js/main.js              interações
├── img/portfolio/          peças (jpg + webp, 1200 e 640 px)
├── img/estudio/            fotos do artista
├── video/                  hero (desktop/mobile, mp4+webm), poster e vídeo da obra
├── netlify.toml            cabeçalhos e cache
└── ESTUDO-MERCADO-UX-CRO.md
```

## 8. Trocar o vídeo do topo
Mande o vídeo novo ao Claude. A receita usada (ffmpeg) foi:
```
-vf "setpts=1.75*PTS,scale=1080:1920,eq=contrast=1.06:saturation=0.35:brightness=-0.03"
-an -r 25 -crf 31           # +versão 640px para celular e WebM para cada uma
```
Alvo: **até 1,5 MB no desktop e 600 KB no celular**. Acima disso o topo trava no 4G e você perde o cliente
antes da primeira dobra.

## 9. Prévia pelo celular
Há uma cópia navegável publicada em **https://claude.ai/artifact/GDtCW8VDthc1cBajSBqWzf**
(privada: só abre na conta do André). Serve para ver o site no iPhone antes do deploy.
Nela, o formulário **não grava no servidor** (isso só existe na Netlify) e a abertura do
WhatsApp pode ser bloqueada pelo ambiente da prévia. Para gerar de novo após mudanças:
`python3` monta a versão de prévia a partir de `index.html` removendo `<head>`/`<body>`
(a hospedagem injeta o próprio esqueleto) — peça ao Claude "atualiza a prévia".

## 10. Trocar entre fundo escuro e claro
`js/config.js` → `tema: "escuro"` ou `tema: "claro"`.
- **escuro**: preto fuligem, creme serifado, dourado (o original)
- **claro**: fundo osso estilo galeria, tinta escura, acento bronze; o topo com vídeo
  continua escuro de propósito, para o impacto do primeiro contato

Os dois usam os mesmos tokens de cor (`:root` e `:root[data-tema="claro"]` no topo do CSS) —
nenhum componente foi duplicado. Na prévia publicada existe um seletor flutuante para comparar
os dois no celular; no site publicado ele não aparece.
