# Como colocar o site no Google — sem Ads e sem pagar hospedagem

Três coisas diferentes costumam ser confundidas:

| | O que é | Precisa? | Custo |
|---|---|---|---|
| **Hospedagem** | onde o site fica no ar, com endereço público | **Sim, obrigatório** | **R$ 0** na Netlify |
| **Busca orgânica do Google** | aparecer quando alguém pesquisa | Sim, é o objetivo | R$ 0 |
| **Google Ads** | anúncio pago no topo da busca | Não | pago |

**Sem hospedagem não existe site no ar, e sem site no ar o Google não tem o que listar.**
Mas hospedagem gratuita resolve: a Netlify dá `andretattoo.netlify.app` de graça, para sempre,
com HTTPS. É o plano que o site já está preparado para usar.

> A prévia em `claude.ai/artifact/...` **não serve** para isso: é privada e não é indexada pelo Google.

---

## Passo 1 — Pôr no ar (15 min, R$ 0)
app.netlify.com → *Add new site* → arraste a pasta `site/`, ou ligue o repositório
(Base e Publish = `site`). Em *Forms → Form notifications*, coloque seu e-mail para receber os pedidos.

## Passo 2 — Perfil da Empresa no Google (prioridade de verdade)
**google.com/business** — grátis. Para tatuador local, isso traz cliente **antes** do site:
é o que aparece no Maps e no bloco de resultados locais de "tatuador vila matilde",
"tatuagem realismo são paulo".
- Categoria: **Estúdio de tatuagem**
- Endereço: Av. Melchert, 606 — Vila Matilde
- Horário: seg a sáb, 9h às 22h
- Telefone: (11) 98271-3543
- Site: o endereço da Netlify
- Suba 10 a 15 fotos das tattoos e do estúdio
- **Peça avaliação a cada cliente** — é o fator que mais pesa no ranking local

O Google manda um código de verificação (cartão, vídeo ou telefone). Sem verificar, não aparece.

## Passo 3 — Search Console (10 min)
**search.google.com/search-console** → adicionar propriedade → confirmar a posse
(a Netlify permite por registro DNS ou arquivo HTML) → em *Sitemaps*, enviar `sitemap.xml`.
Depois, em *Inspeção de URL*, colar o endereço do site e pedir indexação.
Indexar leva de alguns dias a 2 semanas.

## Passo 4 — Instagram
Trocar o link da bio para o site. Além do tráfego, link de perfil forte ajuda o Google a achar o site.

---

## O que o site já tem pronto para o Google
- Título e descrição escritos para busca local (estúdio + bairro + estilo)
- Dados estruturados `TattooParlor`: endereço, horário, telefone, área atendida, Instagram
- Dados estruturados `FAQPage` com 8 perguntas — pode render resposta destacada na busca
- `sitemap.xml`, `robots.txt`, endereço canônico
- Carrega em ~1 MB no celular (velocidade conta no ranking)
- Texto real nas seções (o Google não lê imagem; por isso as descrições existem)

## Expectativa honesta
Site novo não ranqueia em uma semana. Realista: **2 semanas a 3 meses** para aparecer em buscas
de bairro, mais tempo para termos disputados como "tatuagem realismo são paulo". O **Perfil da
Empresa** dá resultado bem antes disso. O que mais acelera o site: mais peças publicadas (cada
uma é conteúdo novo) e avaliações no Google.

## Domínio próprio (opcional)
`andretattoo.com.br` custa cerca de R$ 40/ano no **registro.br** e se liga à Netlify sem custo
extra. Não muda nada no Google no curto prazo, mas passa mais credibilidade do que um
endereço `.netlify.app` — principalmente para cliente de ticket alto.
Se fizer isso, me avise: troco o endereço canônico e o sitemap.

## WhatsApp (já está pronto)
O número (11) 98271-3543 já está no site em quatro pontos: barra fixa no celular, rodapé,
atalho na área de orçamento e o próprio formulário, que abre a conversa com o resumo escrito.
Funciona em hospedagem gratuita — não depende de servidor nem de plano pago.
