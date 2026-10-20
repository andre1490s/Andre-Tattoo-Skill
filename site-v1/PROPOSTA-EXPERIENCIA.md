# Proposta de experiência digital — André Tattoo
Direção criativa, arquitetura e plano de execução · outubro/2026

---

## 0. Etapa 1 — o que NÃO consegui fazer

**Não acessei o domcalais.com.** O ambiente onde eu rodo nega o domínio na camada de rede
(`connect_rejected` no proxy, registrado às 23:45 de 14/10). Testei `domcalais.com` e
`www.domcalais.com`, por HTTP direto e pela ferramenta de leitura de páginas. Também não há
nesta sessão nenhuma ferramenta de navegador real.

Portanto: **zero observação, zero hipótese disfarçada de observação.** As dez perguntas da sua
Etapa 1 ficam em aberto até eu conseguir ver o site.

### Como destravar (em ordem de qualidade do que eu consigo extrair)

| Caminho | O que eu consigo analisar | Esforço seu |
|---|---|---|
| **Gravação de tela, 60–90 s** navegando o site (entrada, rolagem lenta, abrir um projeto, voltar) | **Quase tudo**: carregamento, animação de scroll, transição entre páginas, parallax, ritmo, comportamento no celular | 2 min |
| Liberar `domcalais.com` em *Allowed domains* na configuração de rede do ambiente | Tudo, incluindo o código e as bibliotecas que o site usa | 1 min, se você tiver acesso à config |
| Prints (topo, meio, projeto, rodapé) | Só estética: cor, tipografia, composição. **Nada de interação** | 1 min |

A gravação é disparado o melhor caminho: interação não aparece em print. Se gravar, passe o dedo
devagar — eu analiso quadro a quadro.

---

## 1. Direção artística proposta — "Carvão, Prata e Lâmina"

Sua identidade nova (preto, cinzas, verde sutil, metálico discreto) pede uma direção que o
mercado de tatuagem não usa: **atelier técnico**, não "estúdio dark genérico".

### Paleta
| Papel | Cor | Uso |
|---|---|---|
| Base | Carvão `#0A0B0C` | fundo; mais quente que preto puro, não "apaga" a tela |
| Superfície | Grafite `#121417` | cartões, formulário, rodapé |
| Tinta | Cinza-claro `#E7E7E4` | textos; **não creme** — creme briga com preto e cinza |
| Acento | **Verde-lâmina `#4F7A61`** | detalhes, estados ativos, a palavra em destaque |
| Sinal | Verde-claro `#8FBFA1` | só o CTA principal e o que precisa de contraste real |
| Metal | Prata escovada (gradiente `#8A8F95 → #D6D9DD → #6E7378`) | fios de 1px, borda do botão, o monograma |

O verde entra **em dose pequena**: linha, sublinhado, ponto ativo, palavra única. Verde em área
grande puxa para "clínica". Em fio fino, puxa para instrumento cirúrgico — que é o que você quer.

O metálico **não é cor, é gradiente**: um fio de prata de 1px numa borda, o monograma com
varredura de brilho na entrada. Ouro sai de cena (era a direção antiga).

### Tipografia
- **Display:** serifada de alto contraste, peso leve, em caixa alta espaçada — a peça de galeria.
- **Apoio:** sans neutra para o corpo.
- **Técnica:** uma **monoespaçada** para rótulos, numeração, medidas e dados (`ANTEBRAÇO · 22 CM · 2 SESSÕES`).

O par serifada + monoespaçada é a assinatura da direção: **arte e precisão na mesma página**.
É o que vai te diferenciar de qualquer outro site de tatuador — todos usam serifada + sans.

### Princípio de composição
Uma peça por vez, grande, com muito preto em volta. A tatuagem é a única coisa colorida
(em preto e cinza) da tela. Todo o resto é estrutura.

---

## 2. A experiência, da entrada ao agendamento

**1. Entrada (0–4 s).** Tela cheia, vídeo seu tatuando em slow motion, sem som. O monograma
aparece com uma varredura metálica e o nome se revela por máscara, não por fade. Uma linha
verde fina desce e vira a espinha de rolagem. Nada de barra de progresso falsa: o site já está
pronto quando a animação acaba.

**2. A primeira peça (4–15 s).** Antes de qualquer texto institucional, **uma tatuagem em tela
cheia**. Ela entra com um leve zoom-out, como se a câmera afastasse. A legenda chega depois,
em mono: região, tamanho, sessões.

**3. A lente (o momento que ninguém tem).** No portfólio, o cursor vira uma **lente de aumento**
que revela o pontilhismo em escala real. No celular, toque e segure. É a resposta visual para
"atenção aos detalhes" — e vende realismo melhor que qualquer frase.

**4. Exploração horizontal.** As peças em destaque correm na horizontal com inércia, como mesa
de galeria. Rolagem vertical continua funcionando — nunca sequestro de scroll.

**5. Projeto individual.** Clicar numa peça não troca de página com piscada: a imagem **cresce e
se torna** a capa do projeto (transição de elemento compartilhado). Dentro: fotos grandes,
o stencil, o vídeo do processo, e a ficha técnica em mono.

**6. Bastidor.** Bloco cinematográfico: bancada sendo montada, decalque aplicado, agulha
entrando. Vídeos curtos, silenciosos por padrão, com **botão de som** — nunca áudio automático.

**7. Agendamento.** O formulário de 3 passos que já existe, com a nova pele. O CTA acompanha o
visitante numa barra discreta, sempre a um toque.

---

## 3. Interações que valem adaptar (e as que não valem)

| Interação | Serve para | Custo | Veredito |
|---|---|---|---|
| Rolagem suave com inércia (Lenis) | Base de toda animação ligada ao scroll | Baixo | **Sim** |
| Linha do tempo por seção (ScrollTrigger) | Fixar, revelar, cronometrar | Médio | **Sim** |
| Lente de aumento no detalhe | Prova de técnica | Médio | **Sim — é a assinatura** |
| Transição de elemento compartilhado peça → projeto | Sensação de app, não de site | Médio | **Sim** |
| Galeria horizontal com inércia | Ritmo de galeria | Baixo | **Sim** |
| Cursor customizado com estados | Sofisticação, só no desktop | Baixo | Sim |
| Som ambiente opcional | Imersão | Baixo | Sim, **desligado por padrão** |
| Máscaras de revelação em vídeo | Entrada cinematográfica | Médio | Sim, uma só |
| WebGL / Three.js (fumaça, partículas, distorção) | Impacto | **Alto** | **Não na v1** |

Sobre WebGL, sendo direto: **custa bateria, peso e tempo de carregamento no iPhone, e não
vende tatuagem.** Um shader de fumaça impressiona outro designer; o seu cliente quer ver a
pele. Se um dia fizer sentido, entra isolado num bloco só — não no site inteiro.

---

## 4. Tecnologia — recomendação honesta

| Opção | Quando faz sentido | Veredito |
|---|---|---|
| **Astro + GSAP/ScrollTrigger + Lenis** | Conteúdo estático, páginas por projeto, SEO, hospedagem grátis | **Recomendada** |
| Next.js + React + Framer Motion | Se vier painel de administração, login ou conteúdo dinâmico | Depois, se precisar |
| Continuar em HTML/CSS/JS puro (atual) | Custo zero de migração | Trava nas páginas por projeto |
| Three.js / WebGL | Um efeito específico e justificado | Fora da v1 |

**Por que Astro:** gera HTML estático (ótimo para Google e para 4G), carrega JavaScript só onde
há interação, e resolve nativamente as **páginas por projeto** que você quer. Next.js entregaria
o mesmo com mais peso e complexidade para um site sem backend.

**Orçamento de desempenho (regra fechada, não meta vaga):**
- Primeira tela: **≤ 1,2 MB** no celular · vídeo do topo **≤ 1,5 MB**
- Maior elemento visível em **≤ 2,5 s** em 4G · nada de travar a rolagem
- GSAP + Lenis juntos: ~45 KB comprimidos. Aceitável. Three.js sozinho: ~150 KB. Não.
- `prefers-reduced-motion` desliga tudo · teclado navega tudo · texto real, não imagem

---

## 5. O que preciso receber de você

### Fotos (hoje: 8 peças — o gargalo real do projeto)
| Categoria | Quantidade | Observação |
|---|---|---|
| Realismo preto e cinza | 8 a 10 | hoje 4 |
| Fine line / delicado | 5 a 6 | hoje 3 |
| Cobertura (antes e depois) | 2 a 3 | hoje nenhuma |
| Fechamento de braço, perna, costas | 3 a 4 | hoje nenhuma |
| **Cicatrizada, 30+ dias** | 3 a 4 | **nenhuma — e é a que mais convence** |
| Detalhe macro (pontilhismo de perto) | 4 a 6 | **a lente de aumento depende disso** |
| Stencil + resultado da mesma peça | 2 a 3 | hoje 1 par |

Luz lateral, fundo limpo, pele seca, vertical, peça inteira com folga. Celular serve.

### Vídeos
- Bancada sendo montada (15 s) · decalque aplicado (15 s) · agulha trabalhando, macro (15 s)
- Peça cicatrizada girando devagar (10 s)
- **Sem áudio importa:** eu removo. O que importa é luz e estabilidade.

### Áudio (se quiser a camada sonora)
- Ambiente do estúdio, 30 s em loop · zumbido da máquina, 10 s. Gravação de celular serve.

### Decisões
- Verde exato (se já tiver) ou aprovar o `#4F7A61` que propus
- Logo em vetor ou PNG grande, se existir
- Os 3 a 5 depoimentos reais — continua pendente desde o começo

---

## 6. Etapas de execução

| Etapa | Entrega | Depende de |
|---|---|---|
| **0. Diagnóstico da referência** | Análise do domcalais com o que você gravar | gravação de tela |
| **1. Direção visual** | Uma página-amostra com a paleta nova, tipografia e o topo cinematográfico, para aprovar antes do resto | aprovação da direção |
| **2. Base técnica** | Migração para Astro, rolagem suave, estrutura de páginas por projeto | etapa 1 aprovada |
| **3. Portfólio imersivo** | Galeria horizontal, lente de aumento, transição para o projeto | fotos novas + macros |
| **4. Páginas de projeto** | Uma página por peça selecionada, com processo e ficha | fotos e vídeos por peça |
| **5. Bastidor e som** | Bloco de bastidores, controle de áudio | vídeos e áudios |
| **6. Conversão e medição** | Formulário na pele nova, GA4, Pixel, Search Console | IDs das contas |
| **7. Publicação** | Netlify, domínio, Perfil da Empresa no Google | decisão de domínio |

---

## 7. Uma ressalva que eu seria omisso em não fazer

A experiência que você descreveu é inteiramente realizável. Mas o que separa o seu site de um
site premiado hoje **não é tecnologia — é acervo**. Oito peças não enchem uma galeria imersiva;
uma lente de aumento sem foto macro não tem o que ampliar; páginas por projeto precisam de
projetos documentados.

Se eu construir a experiência inteira antes do material chegar, você terá uma moldura cara com
pouca arte dentro — e vai sentir o mesmo "meio pobre" de antes, agora com mais animação.

**Ordem que eu defendo:** etapa 1 (direção visual, rápida, para você ver a cara nova) → **você
fotografa** → etapas 2 a 5 com material real. A direção artística não depende das fotos; a
imersão depende inteiramente delas.
