# Estudo de SEO em trilha
### André Tattoo — como ser achado no Google, em etapas com portão de passagem
Novembro/2026 · base: `contexto/marca.md`, medição direta do Perfil da Empresa e do site no ar, dados de busca de São Paulo e documentação do Google

---

## 0. Como ler este estudo

**"Em trilha"** significa que o estudo não termina em recomendação: termina em **etapas numeradas, uma
destravando a outra**, no mesmo formato das trilhas de monetização do YouTube (`youtube/MONETIZACAO.md`).
Cada etapa tem objetivo, quem executa, esforço, **como saber que funcionou** e um **portão** — a condição
para passar para a próxima. Fazer a etapa 3 antes da etapa 0 é desperdiçar trabalho, e este estudo existe
principalmente para provar isso com número.

**O que foi medido de verdade, em 06/11/2026:**

| O que | Como |
|---|---|
| Perfil da Empresa no Google (nota, avaliações, categoria, site vinculado) | dados públicos do Google Maps |
| Ritmo de avaliações dos últimos 24 meses e taxa de resposta | amostra das 60 avaliações mais recentes |
| 20 estúdios concorrentes num raio de ~2,5 km | busca "estúdio de tatuagem Vila Matilde São Paulo" |
| O site no ar (`andretattoo.com.br`): cabeçalho, dados estruturados, títulos, sitemap, robots | leitura da página publicada e do código-fonte da branch que a Netlify publica |
| O que São Paulo pesquisa em 12 meses | consultas relacionadas de busca, estado de SP |
| Peso de cada fator de ranqueamento local | pesquisa Local Search Ranking Factors 2026 + documentação do Google |

**Limites declarados.** Não tenho acesso ao Search Console nem ao painel do Perfil da Empresa — portanto
**não sei quantas impressões, cliques ou ligações o perfil recebe hoje**, nem se o site está indexado no
Google (só sei que ele não aparece em busca de marca em índice de terceiro, o que é sinal, não prova).
Também não existe dado público de volume absoluto de busca por bairro: os números de demanda aqui são
**relativos**, úteis para ordenar prioridade, não para projetar visita. Quem resolve as duas lacunas é a
etapa 1 da trilha.

---

## 1. O diagnóstico que reordena tudo

Duas descobertas mudam a ordem de qualquer plano de SEO deste estúdio.

### 1.1 O ativo mais forte do estúdio está desligado do site

O Perfil da Empresa no Google **já existe, já foi verificado e é muito bom**:

| | |
|---|---|
| Nome no perfil | **Studio Andre Tattoo** |
| Nota | **5,0** |
| Avaliações | **229** |
| Categoria principal | Estúdio de tatuagem |
| Telefone | (11) 98271-3543 ✅ igual ao do site |
| Endereço | Av. Melchert, 606 — Vila Matilde — 03508-000 ✅ igual ao do site |
| **Site vinculado** | **nenhum** ❌ |

Em 229 avaliações com nota cheia, o estúdio tem um ativo que a maioria dos concorrentes **não tem como
comprar nem copiar no curto prazo** — e o campo que levaria essa reputação para o site está vazio. Hoje o
perfil ganha a busca local e manda o cliente para o Maps e para o telefone; o site fica fora do caminho.

> **A primeira coisa a fazer neste estudo leva 2 minutos e não é no site: é colar o endereço do site no
> Perfil da Empresa.** É o único item deste documento que, sozinho, muda a função do site inteiro.

Sentido contrário também vale: o site exibe "228 avaliações" e hoje são **229** — ou seja, o número está
escrito na página e não vem do Google em tempo real.
Esse número vai envelhecer sozinho e, pior, é exatamente o tipo de dado que o Google prefere ler do perfil,
não da página (item 5.3).

### 1.2 Correção de 07/11/2026: o site no ar é deste repositório, em outra branch

**O que este item dizia antes estava errado, e a correção importa.** Consultando o projeto na Netlify, o
deploy de produção vem de:

| | |
|---|---|
| Repositório | `github.com/andre1490s/Andre-Tattoo-Skill` — **este** |
| Branch publicada | **`claude/awesome-gauss-8n5y96`** |
| Pasta | `site/` daquela branch (o site antigo foi renomeado lá para `site-v1/`) |
| Commit no ar | `3833811`, publicado em 06/11/2026 |
| **Endereço principal** | **`https://andretattoo.com.br`** — o domínio próprio já está no ar |

Ou seja: não são dois projetos, são **duas branches do mesmo repositório**. A `site/` que eu li para
escrever este estudo é a versão antiga (lá chamada `site-v1/`); o site que o cliente vê é a `site/` da outra
branch. A comparação abaixo continua valendo — ela descreve a diferença entre as duas versões:

| | `site/` desta branch (versão antiga) | `site/` da branch publicada |
|---|---|---|
| Tema | escuro | claro (`#F3F1EC`) |
| Topo | vídeo em slow motion | título "Transformando suas ideias em desenhos únicos" |
| Seções | destaques, processo, artista, portfólio, dúvidas | trabalhos, sobre, **avaliações**, clube, dúvidas, agendar, estúdio |
| Formulário | 3 passos com upload de referência | 5 campos, sem upload |
| Página do clube | `clube-15.html` | `/clube-15` (sem extensão) |
| TikTok no rodapé | não existe | **@andretattoo.ink** |
| Dados estruturados | `TattooParlor` + `FAQPage` | `LocalBusiness`, `TattooParlor`, `AggregateRating`, `Review`, `FAQPage`, `BreadcrumbList` |

**Consequência direta:** correção de SEO precisa ser feita na `site/` da branch `claude/awesome-gauss-8n5y96`,
não na desta branch. Mexer na versão antiga é trabalho que não chega ao cliente. O que falta agora não é
informação, é decidir como juntar as duas linhas de trabalho — está no item 9.

Observação de marca: o TikTok **@andretattoo.ink** aparece no site no ar e **não existe em
`contexto/marca.md`**. Para o Google, cada perfil oficial é um sinal de que a entidade "André Tattoo" é real
e única; para o repositório, é fato de marca faltando na fonte única de verdade.

---

## 2. A disputa real: 20 estúdios, 2,5 km

Quem disputa o cliente que pesquisa no celular na Vila Matilde não é o estúdio famoso de Pinheiros. É isto
(dados públicos do Maps, 06/11/2026, busca por "estúdio de tatuagem Vila Matilde São Paulo"):

| # | Estúdio | Nota | Avaliações | Onde | Site vinculado |
|---|---|---|---|---|---|
| 1 | Cybergi Studio Tattoo e Depilação | 4,9 | **250** | Vila Talarico | nenhum |
| 2 | **Studio Andre Tattoo** | **5,0** | **229** | Vila Matilde | **nenhum** |
| 3 | TIMELESS TATTOO PIERCING | 4,9 | 191 | R. Dona Matilde, 377 | link de Reel do Instagram |
| 4 | Tatuador Isaac — GGD TATTOO | 5,0 | 137 | **Av. Melchert, 606** | link de WhatsApp |
| 5 | Sophia Gomes Studio | 5,0 | 87 | R. Frei Mont'Alverne, 293 | **sophiagomes.com.br** |
| 6 | Paulo Viana Tattoo | 4,9 | 43 | Av. Waldemar C. Pereira, 554 | nenhum |
| 7 | Casa Nanquim | 4,7 | 43 | R. Maria Carlota, 859 | Instagram |
| 8 | MICAELE INK | 5,0 | 18 | R. José Mascarenhas | Instagram |
| 9 | Isadora Matarello | 5,0 | 16 | R. José Mascarenhas, 1051 | Instagram |
| 10 | Invictus Tattoaria | 3,7 | 15 | R. Cel. Pedro Dias de Campos | Instagram |

Os outros dez têm 11 avaliações ou menos. Três leituras que importam:

**a) A briga de verdade é com dois nomes, não com vinte.** Cybergi (250) e Timeless (191) são os únicos na
mesma ordem de grandeza de reputação. A diferença para o Cybergi é de **21 avaliações** — e ele tem 4,9
contra 5,0. É uma distância que se cobre em um trimestre de rotina (item 6, etapa 2), e não se cobre em
nenhum tempo sem rotina.

**b) Existe um concorrente no mesmo número da mesma avenida.** "Tatuador Isaac — GGD TATTOO" está em
**Av. Melchert, 606**, com 137 avaliações e nota 5,0. Para o Google, proximidade do ponto de busca é um dos
fatores mais fortes do bloco local — e nesse fator os dois são **empatados por definição**. Contra um vizinho
de porta, proximidade não decide nada: decidem categoria, reputação e o que o Google consegue entender
sobre cada um. Detalhe que vale conferir: esse perfil declara o 606 como **Vila Esperança**, e o do André como
**Vila Matilde**. Pode ser divergência de cadastro do Google — vale saber qual bairro o CEP 03508-000 diz ser,
porque bairro errado no perfil é relevância jogada fora.

**c) Só um concorrente tem domínio próprio.** Sophia Gomes (87 avaliações) é o único dos vinte com site de
verdade vinculado. Os outros vinculam Instagram ou WhatsApp, ou nada. Quer dizer: **o espaço de "estúdio da
região com site real" está vazio** — e o André tem site pronto e reputação quatro vezes maior. É a assimetria
mais aproveitável do estudo.

---

## 3. O que o Google pesa, de fato

A documentação do Google é curta e direta: resultado local sai de **relevância**, **distância** e
**prominência** — e prominência inclui, com nome e sobrenome, *"quantos sites apontam para o seu negócio e
quantas avaliações você tem"*.

A pesquisa Local Search Ranking Factors 2026 (consenso de especialistas, compilado pela BrightLocal) coloca
peso nos grupos:

| Grupo de fator | Bloco local (Maps) | Orgânico local (lista azul) |
|---|---|---|
| **Perfil da Empresa no Google** | **32%** | 7% |
| **Avaliações** | **20%** | 6% |
| On-page (o site) | 15% | **33%** |
| Comportamento (clique, ligação, rota) | 9% | 10% |
| Links | 8% | **24%** |
| Citações (nome/endereço/telefone em outros sites) | 6% | 7% |
| Personalização | 6% | 8% |
| Social | 4% | 5% |

E os três fatores individuais mais fortes do bloco local: **categoria principal do perfil**, **proximidade do
endereço** e palavras-chave no **nome do perfil**.

**O que isso significa aqui, sem rodeio:**

- Metade do que decide o bloco local (32% + 20%) está **no Perfil da Empresa e nas avaliações** — exatamente
  onde o estúdio já é forte e onde o trabalho é barato. Site bonito não substitui isso.
- O site pesa 15% no bloco local, mas **33% no orgânico** — a lista de links abaixo do mapa, onde se ganha
  busca de significado, de cuidado e de região do corpo (item 4). São dois jogos diferentes, e o site é o
  único jogador do segundo.
- Links e citações somam 14% no local e 31% no orgânico. É o item mais lento de todos e, por isso, o último
  da trilha — não o primeiro.
- Sobre "palavras-chave no nome do perfil": a pesquisa diz que **funciona**, e a política do Google diz que
  nome inventado é motivo de **suspensão**. Com 229 avaliações em jogo, isto não é um teste a fazer. A
  recomendação é usar no perfil exatamente o nome real do estúdio e ganhar relevância pela categoria, pelos
  serviços e pela descrição — que são campos feitos para isso (item 6, etapa 0).

---

## 4. O que São Paulo realmente pesquisa

Consultas relacionadas dos últimos 12 meses no estado de São Paulo (índice relativo; 100 = a mais buscada do
grupo):

**Em volta de "tatuador":**
| Consulta | Índice |
|---|---|
| tatuador de auschwitz / o tatuador de auschwitz | 100 / 91 |
| **tatuador perto de mim** | **59** |
| curso tatuador / curso de tatuador | 30 / 20 |
| quanto ganha um tatuador | 11 |

**Em volta de "tatuagem":**
| Consulta | Índice | | Consulta | Índice |
|---|---|---|---|---|
| **tatuagem braço** | **100** | | tatuagem masculina | 40 |
| **tatuagem feminina** | **92** | | tatuagem borboleta | 35 |
| tatuagem no braço | 79 | | tatuagem perna | 31 |
| tatuagem nas costas | 43 | | tatuagem pequena | 19 |
| tatuagem pescoço | 43 | | tatuagem antebraço | 15 |
| tatuagem peito | 41 | | tatuagem delicada | 16 |

**Subindo nos últimos 12 meses:** `tatuagem santa ceia` +70%, `tatuagem temporária personalizada` +70%,
`pomada pra tatuagem` +50%, `tatuagem nas costa` +40%, `o que significa tatuagem de borboleta` +40%.

**E o dado mais desconfortável:** `tatuagem realismo` e `estudio de tatuagem` **não têm consultas
relacionadas suficientes** no estado de São Paulo para aparecerem nessa base. Volume baixo demais.

Quatro conclusões, e elas contrariam o instinto:

1. **Ninguém pesquisa estilo. Pesquisa região do corpo.** "Braço", "costas", "pescoço", "peito", "antebraço",
   "perna" — é assim que a demanda está organizada. "Realismo preto e cinza" é como o *André* descreve o
   trabalho; não é como o cliente procura. O posicionamento continua o mesmo; o **vocabulário da página** é
   que precisa ser o do cliente.
2. **A consulta comercial que mais importa é "perto de mim"** (índice 59, terceira do grupo, atrás só de um
   filme). Essa busca não é ganha com texto: é ganha com Perfil da Empresa, categoria e avaliação. Mais um
   voto para a ordem da trilha.
3. **"Feminina" (92) está quase empatada com "braço" (100)** e muito à frente de "masculina" (40). O
   `contexto/marca.md` já registra fine line e trabalho delicado como linha secundária; a busca diz que essa
   linha secundária é metade do mercado.
4. **A busca de significado está subindo** — "o que significa tatuagem de borboleta" +40%. E significado é
   justamente a doutrina de conteúdo que o repositório já adotou ("significado sempre presente", em
   `contexto/marca.md`). O que hoje vira legenda de Instagram e some em 48 horas é, no site, uma página que
   trabalha por anos. Vale também para `tatuagem santa ceia` (+70%): realismo religioso é repertório que o
   André já tem no portfólio (arcanjo, leão com cruz).

---

## 5. Auditoria do site no ar

Leitura da página publicada em 06/11/2026 e **do código-fonte da branch publicada em 07/11/2026**.

> **Três itens desta auditoria foram corrigidos em 07/11/2026.** A primeira leitura foi feita por extração
> automática da página renderizada, e ela errou em três pontos: disse que não havia `canonical` (há, e aponta
> para `https://andretattoo.com.br/`, correto); disse que havia dois `<h1>` (há um só); e listou dados
> estruturados de `LocalBusiness`, `AggregateRating`, `Review` e `BreadcrumbList` que **não existem no
> código**. Conferido no fonte: a página declara `TattooParlor` (com endereço e horário) e injeta `FAQPage`
> por JavaScript — nada mais. As ferramentas de extração reescrevem endereços para o host consultado e
> inferem o que não está lá; o fonte manda.

### 5.1 O que já está certo (e não precisa de ninguém)
- `<title>` com estúdio + estilo + bairro + cidade, dentro do tamanho que o Google exibe inteiro
- `description` com proposta, bairro e ação ("agende pelo WhatsApp")
- `lang="pt-BR"`, `meta robots: index, follow`, **`canonical` correto** e Open Graph completo com imagem 1200×630
- Dados estruturados de `LocalBusiness`/`TattooParlor` com endereço, telefone e horário, e `FAQPage` com as
  perguntas que o cliente faz de verdade (sinal, desenho, higiene, preparação)
- Imagens em `.webp`, com `loading=lazy` e **texto alternativo descritivo de verdade** ("Dama da Justiça com
  balança e espada, em realismo preto e cinza no antebraço"). Isso é raro e é exatamente o que o Google usa
  para entender foto de tatuagem
- `robots.txt` e `sitemap.xml` publicados e válidos

### 5.2 Os quatro problemas, em ordem de impacto

| # | Problema | Por que importa | Custo de corrigir |
|---|---|---|---|
| 1 | **O único `<h1>` da página não diz o que o negócio é** — "Transformando suas ideias em desenhos únicos." | O `<title>` acerta tudo (estúdio + estilo + bairro); o `<h1>`, que é o título do conteúdo, não tem "tatuagem", "realismo" nem "Vila Matilde". Logo acima dele existe a frase certa — "Tatuador na Vila Matilde, São Paulo" — em texto comum | 10 min |
| 2 | **Uma página só** (mais `/clube-15`) | Com 15% de peso no bloco local e **33% no orgânico**, uma página só consegue competir por um assunto. A demanda do item 4 está dividida em cinco ou seis assuntos | etapa 3 |
| 3 | **Nenhuma medição instalada** — sem GA4, sem Pixel (conferido no fonte: nenhum `gtag`, nenhum `fbq`) | Sem isso, toda decisão de SEO daqui para frente é palpite, inclusive avaliar esta trilha | 20 min (depende dos IDs) |
| 4 | **`sitemap.xml` sem `lastmod`**, com duas URLs, e imagens sem `width`/`height` declarados | `lastmod` ajuda o Google a priorizar a recoleta; dimensão declarada evita a página "pular" enquanto carrega, o que conta na experiência medida | 15 min |

### 5.3 Um aviso para não criar problema: avaliação não se marca como dado estruturado

A página mostra a nota e seis avaliações do Google, e a tentação óbvia de quem for mexer nela é marcar isso
como `AggregateRating` para tentar estrela na busca. **Não faça.** O Google documenta:

> *"Se a entidade avaliada controla as avaliações sobre si mesma, as páginas que usam `LocalBusiness` ou
> qualquer outro tipo de `Organization` são inelegíveis para o recurso de estrela. Por exemplo, uma avaliação
> sobre a entidade A colocada no site da entidade A, diretamente nos dados estruturados ou por um widget de
> terceiro (como o widget de avaliações do Google)."*

Hoje o site **não** faz isso, e está certo assim. A seção de avaliações vale muito para o cliente que lê —
é prova social perto do botão, é o que o estudo de CRO pede. O que não funcionaria é marcá-la esperando
estrela: **não é punição, é inelegibilidade.** A estrela do André já aparece na busca, pelo Perfil da
Empresa, que é o lugar certo dela.

Na mesma linha: o `FAQPage` que o `main.js` injeta não custa nada e pode ficar, mas não conte com resultado
rico por causa dele — desde 2023 o Google restringiu a exibição de FAQ em destaque a sites de governo e de
saúde. Ele serve hoje para a máquina entender a página, não para ganhar espaço na tela.

---

## 6. A trilha

Seis etapas. Cada uma com portão: **não avance sem fechar o portão anterior**, porque o esforço da etapa
seguinte rende menos (ou zero) sem ele.

---

### Etapa 0 — Ligar o que já existe · hoje · 20 minutos · só o André

O estúdio tem reputação de primeira linha e um site que ninguém encontra. Esta etapa liga os dois.

1. **Colar o endereço do site no Perfil da Empresa** (google.com/business → Informações → Site). É o item de
   maior retorno por minuto de todo este documento.
2. **Conferir a categoria principal.** Deve ser exatamente **Estúdio de tatuagem** (está correta hoje —
   confirmar que não mudou). É o fator individual mais forte do bloco local. Categoria secundária: só se for
   verdade; "Tatuador" cabe, "Piercing" **não**, porque o estúdio não faz.
3. **Conferir o bairro do endereço** (Vila Matilde vs. Vila Esperança, item 2c).
4. **Preencher descrição e serviços** do perfil com o vocabulário do item 4 — braço, antebraço, costas,
   fechamento, cobertura, realismo preto e cinza, fine line — sem preço (regra da marca) e sem lista
   artificial de palavras. **Texto pronto para colar em [`PERFIL-GOOGLE.md`](PERFIL-GOOGLE.md)**, com
   descrição, 12 serviços, atributos, perguntas e respostas e a checagem final.
5. **Ligar o botão de agendamento** do perfil para o site ou para o WhatsApp.
6. **Subir 10 a 15 fotos** no perfil, com a mesma luz lateral e o mesmo enquadramento descritos em
   `ESTUDO-MERCADO-UX-CRO.md`, seção 6.1.

**Como saber que funcionou:** no painel do Perfil da Empresa, a linha "cliques no site" sai do zero.
**Portão:** o site aparece no perfil e a categoria está correta.

---

### Etapa 1 — Enxergar e consertar · semana 1 · André (acessos) + Claude (correções)

Enquanto não existe Search Console, ninguém sabe se o site está indexado — e esta trilha inteira fica sem
régua.

1. **Search Console** — a **posse já está confirmada**: o arquivo de verificação
   `site/google7695fdf6c6a1b3b8.html` está na branch publicada. Falta a parte que gera dado: entrar em
   search.google.com/search-console na propriedade `andretattoo.com.br`, **enviar o `sitemap.xml`** e pedir
   indexação das páginas. Passo a passo em `site/GOOGLE.md`.
2. **GA4** (e Pixel, se o Ads continuar): criar e me passar os IDs.
3. **Decidir como juntar as duas branches** (item 1.2). As correções abaixo valem para a `site/` da branch
   `claude/awesome-gauss-8n5y96`, que é a publicada.
4. **Corrigir os itens de código do 5.2:** tirar `AggregateRating`/`Review` dos dados estruturados; reescrever
   o `<h1>` para dizer o que o negócio é e onde fica (a frase "Tatuador na Vila Matilde, São Paulo" já está na
   página, logo acima — basta promovê-la, mantendo a frase atual como subtítulo); `lastmod` no `sitemap.xml`;
   `width`/`height` nas imagens; e trocar o "228 avaliações" escrito à mão por número que não envelheça errado.

**Como saber que funcionou:** Search Console mostra as duas páginas como indexadas e começa a listar consultas
reais. **Portão:** existe dado de busca próprio. A partir daqui, a trilha deixa de ser hipótese.

---

### Etapa 2 — O motor de avaliações · semanas 2 a 12 · André · a etapa que mais rende

Avaliação é 20% do bloco local e, segundo a mesma pesquisa, o **segundo fator mais importante também para
quem é citado por IA**. E aqui o número revela um padrão claro.

**Ritmo medido (60 avaliações mais recentes, de jan/2024 até hoje):**

| Período | Avaliações |
|---|---|
| out/2026 | 6 |
| set/2026 | 3 |
| ago/2026 | 2 |
| jul/2026 | 0 |
| jun/2026 | 1 |
| mai/2026 | **8** |
| jan a abr/2026 | 1 (só em fevereiro) |
| ano de 2025 inteiro | 16 — sendo **12 em fevereiro** |
| nov/2026 até hoje | 0 |

Média dos últimos 12 meses: **1,75 avaliação por mês** — mas **em metade dos meses, nenhuma**. O desenho é
inconfundível: o André pede avaliação em lote, de vez em quando (fevereiro/2025: 12; maio/2026: 8), e depois
para. E tem mais um número, este excelente: **96,7% de taxa de resposta do dono** (58 das 60). Ele responde
quase tudo — só não pede com regularidade.

| | Hoje | Meta da trilha |
|---|---|---|
| Avaliações por mês | 1,75 (irregular) | **4, todo mês** |
| Meses com zero | 6 de 12 | 0 |
| Taxa de resposta | 96,7% | manter acima de 95% |

**Por que 4:** com 4 por mês, a diferença de 21 avaliações para o Cybergi se fecha em cerca de **5 a 6 meses**
— supondo que ele continue no ritmo atual, o que é suposição, não previsão. Mais importante que ultrapassar:
**constância é sinal de negócio vivo**, e mês com zero avaliação é o oposto disso.

**Como fazer com o que já existe no repositório:** a skill `pos-tattoo-avaliacao` é exatamente este pedido, e
a `responder-avaliacoes-google` é a resposta. O que falta não é ferramenta, é **gatilho fixo**: pedir no fim de
cada sessão, com o link curto do perfil, e não "quando lembrar". Em volume de agenda, 4 por mês é uma fração
dos clientes atendidos.

**Como saber que funcionou:** três meses seguidos com 4 ou mais avaliações novas e nenhum mês em zero.
**Portão:** o ritmo existe sem alguém ter que lembrar dele. Só então vale investir em página nova — porque
página nova sem reputação atrás não ranqueia em busca local.

---

### Etapa 3 — Páginas para a demanda medida · mês 2 a 3 · Claude escreve, André aprova

> **Escritas em 07/11/2026.** As cinco páginas estão em `site/`, com peças reais do portfólio, `<h1>`
> único, `canonical`, `BreadcrumbList`, `sitemap.xml` com `lastmod` e links da home. Detalhe em
> `site/README.md`. **Elas ainda não estão no ar**, pelo motivo do item 1.2: o site publicado não sai
> deste repositório. E falta o André aprovar o texto oficial de cuidados, que é o único conteúdo da
> etapa que ainda está como "a confirmar" em `contexto/conflitos-a-resolver.md`.

Agora, e não antes, o site ganha páginas. Cinco, não trinta: a regra é **uma página por assunto que alguém
pesquisa**, cada uma com foto real do portfólio do André, não texto de preenchimento.

| Página sugerida | Demanda que atende (item 4) | O que entra |
|---|---|---|
| `/tatuagem-no-braco` | braço 100 · no braço 79 · antebraço 15 | as peças de antebraço e braço do portfólio, como funciona um fechamento, quantas sessões, cuidado na dobra |
| `/tatuagem-nas-costas` | costas 43 · a variante "nas costa" subindo +40% | projeto grande, divisão em sessões, o que muda no preço (sem valor em público) |
| `/realismo-preto-e-cinza` | o posicionamento da marca | o que é, por que pede paciência e luz, o par stencil → pele cicatrizada |
| `/tatuagem-feminina-delicada` | feminina 92 · delicada 16 · borboleta 35 | fine line e trabalho delicado, peças reais, primeira tattoo |
| `/cuidados-depois-da-tatuagem` | pomada pra tatuagem +50% | o texto de cuidados do estúdio, cicatrização, quando é retoque e quando é descuido (regra de 40 dias) |

Duas regras que não se negociam, porque são da marca: **sem preço em nenhuma delas** e **sem inventar número
de clientes ou anos de carreira**. E uma regra de SEO: página que não tem foto do André e texto dele **não
deve existir** — conteúdo genérico de tatuagem é o que mais abunda na internet e o que menos ranqueia.

Vale ligar também o que já existe: cada peça publicada com descrição própria e `alt` descritivo (o site já
faz isso muito bem) é conteúdo novo aos olhos do Google. **Mais fotos publicadas = mais site**, e isso já é a
pendência nº 1 do `ESTUDO-MERCADO-UX-CRO.md`.

**Como saber que funcionou:** no Search Console, consultas que **não** contêm "andré" nem "tattoo" começam a
aparecer (ex.: "tatuagem antebraço realismo zona leste"). **Portão:** ao menos uma página nova recebendo
clique de busca que não é de marca.

---

### Etapa 4 — Prominência fora do Google · mês 3 em diante · André + Claude

Links e citações somam 14% no bloco local e 31% no orgânico — e são lentos. Por isso são aqui, não antes.

1. **Citações básicas, com nome, endereço e telefone idênticos aos do perfil:** Apple Maps (Business Connect),
   Bing Places. Em 2026, uma parcela crescente de consumidor lê avaliação fora do Google — Apple Maps saiu de
   14% para 27% em um ano, enquanto o Google caiu de 83% para 71%.
2. **Reivindicar o que já existe sem controle.** O estúdio já aparece em pelo menos um agregador
   (**Fresha**, com nome e endereço corretos) sem que ninguém tenha cadastrado. Dado desatualizado em
   agregador é citação contra o estúdio, não a favor.
3. **Ligar a entidade.** Nos dados estruturados do site, `sameAs` com Instagram, **TikTok (@andretattoo.ink)**
   e YouTube (`youtube.com/@andretatuadoor`). É assim que o Google entende que são todos a mesma pessoa.
4. **Links de verdade, que um tatuador consegue:** fornecedor de material, convenção ou evento em que tatuou
   (já tem foto de evento no site), parceria com estúdio ou barbearia da região, matéria em veículo de bairro.
   Quatro links reais valem mais que quarenta de diretório.
5. **Ser citado por IA.** Quem recomenda hoje responde ChatGPT e Gemini — e o Gemini lê os dados do Google
   Maps, o que faz do perfil completo o mesmo trabalho duas vezes. A referência de mercado é dura: numa base
   de 350 mil locais, a média aparece no bloco local do Google 35,9% das vezes, mas é recomendada pelo ChatGPT
   em só 1,2% e pelo Gemini em 11%. A conclusão prática é a mesma da etapa 0: **perfil completo, avaliações
   com texto e informação consistente em todo lugar**.

**Como saber que funcionou:** aparecer no Maps buscando de outro bairro da zona leste, não só da Vila Matilde.
**Portão:** nenhum — daqui em diante é rotina.

---

### Etapa 5 — A régua · contínuo · toda segunda, junto do `cerebro-estrategico`

Sem isto, SEO vira opinião. Quatro números, uma vez por mês:

| Número | Onde | Base de hoje (06/11/2026) |
|---|---|---|
| Avaliações no Google e nota | Perfil da Empresa | **229 · 5,0** |
| Avaliações novas no mês | Perfil da Empresa | 0 (mês em curso) · média 1,75/mês |
| Cliques no site vindos do perfil | painel do Perfil | **0 — o site não está vinculado** |
| Cliques e consultas da busca | Search Console | não existe ainda |

E a única métrica que decide se tudo isso valeu: **quantos leads que chegaram pela busca viraram sessão
agendada** — cruzamento que só o app Caixa sabe fazer (`gestor-financeiro`, `analista-metricas`).

---

## 7. O que este estudo recomenda NÃO fazer

- **Não pôr palavra-chave no nome do Perfil da Empresa.** Funciona, é contra a política e o risco é suspensão
  — com 229 avaliações no lastro, é aposta ruim.
- **Não comprar, pedir em troca de desconto nem escrever avaliação.** Além de ser proibido, destrói o ativo
  mais valioso do estúdio. Pedir a quem acabou de sentar na cadeira é o caminho inteiro.
- **Não abrir blog de volume** ("10 ideias de tatuagem"). É o conteúdo mais replicado da internet; o que o
  André tem de único é foto própria, processo e significado.
- **Não brigar por "tatuagem realismo São Paulo" como primeira meta.** Volume baixo na base pública e disputa
  com estúdio de centro. "Perto de mim" + bairro + região do corpo paga mais rápido.
- **Não citar preço em página nenhuma** (regra da marca; a mensalidade do Clube 15 é a única exceção já
  autorizada).
- **Não trocar de domínio de novo.** O `andretattoo.com.br` já está no ar como endereço principal, e o
  código já usa ele no `canonical`. Trocar endereço outra vez custa autoridade acumulada. O que vale
  conferir no Search Console é se a propriedade do domínio é a que está recebendo dado, e se o
  `andretattoo.netlify.app` responde com redirecionamento para o domínio em vez de servir o mesmo conteúdo
  nos dois endereços.

---

## 8. Resumo em uma tela

| Etapa | Quando | Quem | Esforço | O que muda |
|---|---|---|---|---|
| **0 — ligar o que existe** | hoje | André | 20 min | o site entra no caminho do cliente que já acha o estúdio |
| **1 — enxergar e consertar** | semana 1 | André + Claude | 1 h + código | a trilha passa a ter régua; o site fica tecnicamente limpo |
| **2 — motor de avaliações** | semanas 2–12 | André | 1 min por sessão | 1,75/mês irregular → 4/mês constante |
| **3 — páginas da demanda** | mês 2–3 | Claude + André | 5 páginas | o site passa a competir por busca que não é de marca |
| **4 — prominência** | mês 3+ | André + Claude | rotina | o estúdio aparece de outros bairros e para a IA |
| **5 — a régua** | contínuo | Claude | 10 min/mês | decisão com número, não com palpite |

**Se for para fazer só uma coisa:** a etapa 0, item 1. Colar o endereço do site no Perfil da Empresa.
Dois minutos, e é a diferença entre ter um site e ter um site que alguém encontra.

---

## 9. Pendências que dependem do André

| Item | Impacto | Por quê |
|---|---|---|
| **Vincular o site no Perfil da Empresa** | **Altíssimo** | 229 avaliações apontando para lugar nenhum |
| **Decidir como juntar as duas branches** (item 1.2) | **Altíssimo** | a branch publicada é a `claude/awesome-gauss-8n5y96`; correção feita na outra não chega ao ar |
| Enviar o `sitemap.xml` no Search Console (a posse já está confirmada) | Alto | é a régua de tudo |
| Criar GA4 (e Pixel) e passar os IDs | Alto | sem medição, SEO é palpite |
| Confirmar o bairro do CEP 03508-000 no perfil | Médio | bairro divergente é relevância perdida |
| Confirmar e registrar o TikTok @andretattoo.ink em `contexto/marca.md` | Médio | é sinal de entidade e está fora da fonte de verdade |
| Autorizar o pedido de avaliação no fim de cada sessão | Alto | é a etapa 2 inteira |
| Mais fotos publicadas (25 a 30, alvo já definido) | Alto | cada peça é conteúdo novo; vale para SEO e para conversão |

---

## Fontes consultadas
- [Tips to improve your local ranking on Google — Google Business Help](https://support.google.com/business/answer/7091?hl=en) (relevância, distância, prominência)
- [Review snippet (Review, AggregateRating) structured data — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) (diretriz sobre avaliação autoatribuída)
- [Making Review Rich Results more helpful — Google Search Central Blog](https://developers.google.com/search/blog/2019/09/making-review-rich-results-more-helpful)
- [Local Business (LocalBusiness) structured data — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Google's Local Algorithm and Local Ranking Factors — BrightLocal](https://www.brightlocal.com/learn/google-local-algorithm-and-ranking-factors/) (pesos da pesquisa Local Search Ranking Factors 2026)
- [Local Search Ranking Factors — Whitespark](https://whitespark.ca/blog/local-search-ranking-factors/)
- [Why the Google local 3-pack matters to your local business — Blu Mint](https://blumint.co/blog/google-local-seo-3-pack-matters-local-business) (dados SOCi de visibilidade em IA e BrightLocal sobre Apple Maps)
- [Local SEO Ranking Factors 2026 — ClickRank](https://www.clickrank.ai/local-seo-ranking-factors/) (campos do perfil; risco de palavra-chave no nome)
- [Tattoo shop SEO: Ranking on Google, Maps, and AI search — LaunchCodex](https://launchcodex.com/blog/seo-geo-ai/tattoo-shop-seo/)
- [SEO for Tattoo Studios and Artists — LinkGraph](https://www.linkgraph.com/blog/seo-for-tattoo-artists/)

**Dados próprios coletados em 06/11/2026:** Perfil da Empresa e 20 concorrentes via dados públicos do Google
Maps; ritmo de avaliações pela amostra das 60 avaliações mais recentes; consultas relacionadas de busca do
estado de São Paulo (12 meses, índice relativo); leitura da página publicada em
`andretattoo.com.br` e do fonte da branch `claude/awesome-gauss-8n5y96`.
