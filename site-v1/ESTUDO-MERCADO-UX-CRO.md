# Estudo de mercado, UX/UI e arquitetura de informação
### André Tattoo — site de captação de clientes de alto padrão
Outubro/2026 · base: `contexto/marca.md`, pesquisa de mercado e princípios de CRO

---

## 0. Limite declarado deste estudo

Os quatro sites que você mandou como referência (**fernandosouzatattoo.com.br**, **robertocarlosart.com**,
**dobskennel.com.br**, **camilotuero.art**) **não puderam ser abertos**: a política de rede deste ambiente
nega o acesso a esses domínios. O que está escrito aqui sobre eles é, portanto, **hipótese de categoria**, não
leitura direta — e está marcado como tal. Liberando os domínios nas configurações de rede do ambiente, eu faço
a análise página a página (hierarquia, copy, CTAs, formulário, provas) e atualizo esta seção com dados reais.

O resto do estudo não depende disso: vem do seu contexto de marca, de pesquisa de mercado e de princípios de
conversão que valem para serviço de alto valor com decisão emocional.

---

## 1. O mercado em que você joga

Tatuagem de alto padrão não é mercado de preço, é **mercado de risco percebido**. O cliente não está comprando
um desenho: está comprando uma decisão irreversível no próprio corpo, feita por um estranho, com dor envolvida
e sem possibilidade de devolução. Isso muda tudo no site.

**Três perfis de concorrente disputam o mesmo cliente:**

| Perfil | Como se apresenta | Onde falha |
|---|---|---|
| **Instagram-only** (maioria) | Só o perfil, link na bio direto no WhatsApp | Sem contexto, sem processo, sem autoridade fora do feed. Cliente de ticket alto não decide por feed |
| **Site de agência genérico** | Template, estoque de fotos, "sua tatuagem dos sonhos" | Não transmite autoria. Parece um estúdio qualquer. Destrói diferenciação |
| **Artista com site autoral** (minoria) | Portfólio curado, processo exposto, agendamento estruturado | É onde você precisa estar. Barreira baixa de entrada técnica, alta de execução |

**Consequência estratégica:** o site não compete por preço nem por volume de seguidores. Compete por
**autoridade percebida em 8 segundos**. Quem chega vindo do Instagram já viu a arte — o site precisa responder
o que o feed não responde: *quem é esse profissional, como ele trabalha, e isso vai dar certo comigo?*

### Objeções reais do seu público (ordem de peso)
1. **"Vai ficar bom na minha pele?"** → portfólio com variedade de tons de pele e regiões, trabalho cicatrizado
2. **"Esse cara é profissional de verdade?"** → bastidor, estúdio, material, processo documentado
3. **"Quanto custa?"** → sua regra é não publicar preço. Logo: o site precisa fazer o cliente **aceitar**
   que o valor vem na conversa, mostrando que o projeto é personalizado (preço de tabela é para trabalho de tabela)
4. **"Quanto tempo demora para me responderem?"** → o canal precisa ser óbvio e único
5. **"E se eu me arrepender?"** → processo com desenho aprovado antes da sessão, retoque, cicatrização

> Cada uma dessas objeções vira uma seção do site. Essa é a lógica da arquitetura proposta no item 4.

---

## 2. O que a pesquisa de mercado aponta (fontes no fim)

- **Formulário de briefing antes da conversa** é prática dominante no segmento: descrição da ideia, região do
  corpo, tamanho aproximado e **imagens de referência**. Reduz o vaivém no WhatsApp e já chega qualificado.
- **Upload de referência direto no formulário** é citado como item que precisa funcionar pelo celular
  (câmera ou galeria) — é onde a maioria dos sites de tatuador trava.
- **Fluxo curto** e transparência sobre regras (sinal, disponibilidade) aparecem como o que mais sustenta a
  conversão; cada campo a mais cobra um preço em desistência.
- **Prova social perto do CTA**, não isolada numa página "depoimentos" que ninguém abre.
- **Velocidade de resposta** é apontada como o fator que decide entre você e o concorrente quando o cliente
  manda mensagem para dois estúdios ao mesmo tempo.
- Para serviço de ticket alto, o que reduz atrito não é pressão promocional e sim **redução de risco**:
  credenciais visíveis, processo explicado, prova verificável.

Ressalva honesta: essas fontes são majoritariamente blogs de fornecedores de software de agendamento. Valem
como direção, **não como benchmark medido**. Número real só sai testando no seu próprio site (item 7).

---

## 3. Estudo de UX/UI para o seu posicionamento

### 3.1 O que comunica "alto padrão" numa interface
Não é dourado nem "luxo" escrito. É:
- **Espaço negativo generoso** — aperto visual é sinônimo de barato
- **Uma obra por vez, grande** — galeria em mosaico apertado desvaloriza a peça
- **Tipografia editorial** (serifada com peso leve nos títulos) contra uma sans neutra no corpo
- **Fundo escuro e neutro**, que faz o preto e cinza da tattoo brilhar — é a sua especialidade, a interface
  tem que servir a ela
- **Movimento lento**: transições de 600–900 ms, nunca "saltos". Rapidez excessiva parece banner de promoção
- **Fotografia como protagonista**; o texto entra depois, como legenda de catálogo

### 3.2 Decisões específicas para este projeto
| Decisão | Por quê |
|---|---|
| Vídeo em slow motion no topo, você tatuando | Resolve a objeção nº 2 em 3 segundos, antes de qualquer texto. É a sua mão, no seu estúdio, com luva e maquininha |
| Vídeo silencioso, com poster e fallback | Áudio automático espanta; precisa carregar rápido e nunca travar o primeiro contato |
| Slider de destaques + grade completa | O slider dá a peça em tamanho grande (contemplação); a grade dá volume (prova de repertório) |
| Stencil → resultado final | É a prova mais forte de autoria que você tem: mostra que o desenho é seu, não catálogo |
| Formulário em 3 passos com upload | Um passo por tipo de decisão. Campo único e longo assusta no celular |
| Zero preço em qualquer lugar | Regra da marca e, aqui, também estratégia: preço publicado transforma projeto autoral em commodity |

### 3.3 Mobile
Mais de 80% do tráfego vai vir do link da bio do Instagram, ou seja: **celular, em pé, com pressa, 4G**.
Isso define: vídeo leve com versão mobile separada, CTA fixo no rodapé da tela, formulário com teclado certo
por campo, upload que abre a câmera, nada de hover como única forma de revelar informação.

---

## 4. Nova arquitetura de informação (proposta)

A ordem abaixo não é estética: cada bloco responde a uma objeção na sequência em que ela aparece na cabeça do
cliente, e oferece uma saída para o agendamento logo depois de resolvê-la.

```
1  TOPO (vídeo)            → "existe um profissional real aqui"      [CTA primário]
2  SELOS DE CREDIBILIDADE  → higiene, hora marcada, estúdio próprio
3  TRABALHOS EM DESTAQUE   → "ele sabe fazer o que eu quero"         (slider)
4  ESPECIALIDADES          → "o meu estilo está entre os dele"       [CTA]
5  COMO FUNCIONA (5 passos)→ "entendi o caminho, não tem pegadinha"
6  PROCESSO / BASTIDOR     → "o desenho é autoral, não é catálogo"   (stencil → final, vídeo)
7  O ARTISTA               → "sei com quem estou falando"            [CTA]
8  PORTFÓLIO COMPLETO      → volume e variedade (grade + ampliação)
9  DEPOIMENTOS             → prova de terceiros                      (pendente: ver item 6)
10 DÚVIDAS (FAQ)           → objeções finais: preço, sinal, retoque, idade
11 AGENDAMENTO             → formulário de 3 passos + upload          [conversão]
12 ESTÚDIO                 → endereço, horário, mapa
13 RODAPÉ                  → último CTA + canais
```

**O que mudou em relação à versão anterior do site e por quê:**
- O portfólio saiu da posição 3 única e virou **dois momentos** (destaque curado no topo, acervo completo
  depois do artista). Peça grande converte; grade grande informa.
- Entraram **selos de credibilidade** logo abaixo do topo — é o bloco que mais barato resolve objeção.
- Entrou **processo/bastidor com stencil**, que é diferenciação pura e você já tem o material.
- O **formulário saiu do meio e virou destino único**: todos os CTAs da página levam para ele (ou para o
  WhatsApp direto, para quem já está decidido).
- FAQ foi reposicionada **imediatamente antes** do formulário: é o último filtro de dúvida antes da ação.

### 4.1 Hierarquia de CTA
- **Primário (dourado, sólido):** "Agendar minha avaliação" → leva ao formulário
- **Secundário (contorno):** "Falar no WhatsApp" → conversa direta, para quem já decidiu
- **Terciário:** "Ver trabalhos"
- Regra: **no máximo um primário visível por tela**. Dois CTAs do mesmo peso dividem a decisão e derrubam a conversão.

### 4.2 Formulário — campos e ordem
**Passo 1 — O projeto** (o que o cliente mais quer falar; começar pelo prazer, não pelo dado)
`Nome` · `Estilo` (chips) · `Descrição da ideia` (texto livre)

**Passo 2 — A pele**
`Região do corpo` (chips) · `Tamanho aproximado` (régua visual) · `Referências` (upload, múltiplas fotos)
· `É cobertura?` · `Primeira tattoo?`

**Passo 3 — A agenda**
`WhatsApp` · `Disponibilidade` (dias e turnos) · `Data desejada` · `Confirmação 18+`

Microcopy que sustenta a regra de preço, no passo 3:
> "O valor é fechado direto comigo depois que eu vir o projeto — cada peça tem um tempo de sessão diferente."

**Por que 3 passos e não 1:** cada passo tem um único tipo de decisão, a barra de progresso cria compromisso
(efeito de objetivo gradual) e o celular mostra 4 campos por tela em vez de 14. O custo é um clique a mais;
o ganho é não abandonar na metade.

**Dupla entrega do lead:** o formulário grava no servidor (com as fotos) **e** abre o WhatsApp com o resumo
escrito. Se o cliente desistir de apertar "enviar" no WhatsApp, você ainda tem o lead. Isso é o ponto de maior
ganho de conversão de toda a reforma.

---

## 5. O que o site intencionalmente NÃO faz

- **Não publica preço**, nem faixa, nem "a partir de" — regra da marca e proteção do seu posicionamento
- **Não inventa depoimento, número de clientes nem anos de carreira**
- **Não usa antes/depois de cobertura como chamada** (regra da marca para anúncio, mantida aqui por coerência)
- **Não cria urgência falsa** ("últimas vagas", contador)
- **Não pede e-mail**: seu canal é WhatsApp; campo a mais sem uso é desistência de graça

---

## 6. Pendências que dependem de você (impacto direto na conversão)

| Item | Impacto | Por quê |
|---|---|---|
| **3 a 5 depoimentos reais** de clientes (texto + primeiro nome + peça) | **Alto** | É o único bloco de prova que falta. Seção já está construída e desligada, liga em 5 minutos |
| **Link do seu Perfil da Empresa no Google** | Alto | Avaliação pública verificável vale mais que depoimento no site |
| **Autorização de imagem** dos clientes das fotos publicadas | Obrigatório | Regra do próprio repositório |
| 2 a 3 fotos do estúdio (ambiente, bancada) | Médio | Credibilidade de instalação física |
| Confirmar: atende só com hora marcada? domingo/feriado? | Médio | Está no ar como "hora marcada" |
| Vídeo de 10 s de cicatrizado (30+ dias) | Médio | Mata a objeção nº 1 melhor que qualquer texto |

---

### 6.1 O que fotografar (prioridade 1)

O site tem 8 peças publicadas. Para um estúdio de alto padrão, o acervo precisa de **25 a 30**.
Isso é o que mais separa este site de um site caro — mais do que qualquer ajuste de layout.

**Quantidade e variedade (o que o cliente procura):**
| Precisa de | Quantas | Por quê |
|---|---|---|
| Realismo preto e cinza | 8 a 10 | É o seu posicionamento. Hoje são 4 |
| Fine line / delicado | 5 a 6 | Público feminino, ticket de entrada. Hoje são 3 |
| Cobertura (antes e depois) | 2 a 3 | Objeção cara de resolver, e você não tem nenhuma |
| Fechamento de braço / perna / costas | 3 a 4 | Mostra que você aguenta projeto grande. Hoje: nenhuma |
| Blackwork | 2 a 3 | Hoje é 1 |
| **Cicatrizada (30+ dias)** | 3 a 4 | **A prova que nenhum concorrente mostra.** Resolve "vai ficar bom na minha pele?" |
| Peles de tons diferentes | o que tiver | O cliente quer se ver na foto |
| Stencil → resultado da mesma peça | 2 a 3 | Prova de autoria; o par da fada é o melhor bloco do site hoje |

**Como fotografar (muda mais que a câmera):**
- **Luz lateral**, não de frente. Luz de frente apaga o cinza e achata o realismo.
- **Fundo escuro e limpo** — sem lixeira, sem papel toalha, sem rosto de cliente no reflexo.
- Pele **limpa e sem brilho** de pomada (dá estourado na foto). Secar antes.
- **Peça inteira enquadrada**, com um palmo de pele em volta. Sem cortar extremidade.
- **Vertical (3:4)** — é o formato do site e do Instagram.
- 3 fotos por peça: inteira, um detalhe, e uma com o membro em posição natural.
- Celular serve. Foto tremida, amarelada ou com flash direto, não.

**Vídeo (vale muito):** 10 a 15 s de uma peça **cicatrizada**, girando devagar. É o conteúdo que
mais falta no mercado inteiro e o que mais derruba objeção.

## 7. Como medir (sem isso, CRO é chute)

1. **GA4 + Meta Pixel** no site (eu instalo quando você me passar os IDs)
2. **Eventos a medir:** `form_inicio`, `form_passo2`, `form_passo3`, `form_envio`, `whatsapp_click`,
   `portfolio_ampliar`, `video_play`
3. **A métrica que importa:** `form_envio ÷ visitantes` (meta inicial realista: 3–6% para tráfego de bio
   de Instagram) e, principalmente, **quantos desses viram sessão agendada** — isso só o seu app de caixa sabe cruzar
4. **Primeiro teste A/B sugerido:** headline do topo (promessa de técnica × promessa de significado)
5. **Onde o funil costuma vazar:** passo 2 do formulário (upload). Se cair mais de 40% ali, o upload vira opcional

---

## Fontes consultadas
- [10 Elements to Include in Your Tattoo Appointment Form — Porter](https://www.getporter.io/blog/tattoo-appointment-form)
- [Tattoo Shop Website Best Practices for 2026 — Apprentice](https://useapprentice.com/blog/best-practices-for-tattoo-shop-websites-in-2026-a-comprehensive-guide)
- [Tattoo Artist Website Blueprint: Pages, Portfolio, Booking and SEO — Stencil Studio](https://www.stencilstudio.art/blog/tattoo-artist-website)
- [Streamline Tattoo Bookings: Guide to Tattoo Booking Forms — Vagaro](https://www.vagaro.com/learn/tattoo-booking-form)
- [Tattoo Booking Form vs. Consent Form — Bookedin](https://bookedin.com/blog/tattoo-booking-form-vs-consent-form/)
- [The Power of Social Proof — Luxury Presence](https://www.luxurypresence.com/blogs/let-others-do-the-selling-for-you-the-power-of-social-proof-in-your-real-estate-business/)
- [Luxury Ecommerce Trust — Elogic](https://elogic.co/blog/luxury-ecommerce-trust/)
- [Why Service Businesses Feel Premium — Blab](https://www.blab.co/blog/why-service-businesses-feel-premium-before-you-speak-to-them)
