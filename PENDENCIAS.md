# Pendências (retomar daqui)

Atualizado em 2026-10-07. Sem dados de clientes neste arquivo.

## AMANHÃ: iniciar o Ads (decisão do André em 2026-10-07)
- [x] (feito nas skills e marca.md; falta só o agente de Mídias do app) Mudança de regra: "foco orgânico". Atualizar `contexto/marca.md`, o agente de Mídias do app e as skills `roteiro-reels-tattoo`, `posts-semana-instagram` e `relatorio-instagram`. A skill `gestor-de-trafego` passa a ser usada de verdade.
- Trazer para começar: (1) verba mensal ou diária; (2) objetivo (conversas no WhatsApp, cliques no link da bio ou seguidores); (3) região do público (bairros ou raio em volta da Vila Matilde, ou São Paulo inteira); (4) 2 a 4 fotos ou vídeos de realismo preto e cinza para os criativos; (5) se a conta de anúncios do Meta já existe e está ligada ao Instagram @andretatuadoor; (6) se há alguma oferta com motivo, prazo e limite (sem desconto permanente).
- Regras do `contexto/marca.md` valem nos anúncios: sem preço em peça pública, sem escassez falsa, sem prometer resultado, só o André passa o valor final.
- Antes de qualquer gasto ou publicação: o Claude propõe a campanha e o André aprova cada passo. Nada vai ao ar sem confirmação.

## URGENTE: privacidade do repositório
- [ ] O repositório `andre1490s/Andre-Tattoo-Skill` está **PÚBLICO**. Tornar privado: GitHub > Settings > Danger Zone > Change repository visibility. Hoje ele expõe: valores de referência e políticas (marca.md, skills), o e-mail do Google (skill registrar-no-sistema) e o id do projeto Supabase (backup do app). Não há senhas, chaves nem dados de clientes.
- Regra daqui para frente: não commitar fotos de tattoos, dados de clientes nem builds com imagens embutidas.

## App v2 publicado (versão 13)
- Feito: redesign Fumaça e Prata, Hoje, Orçamentos (funil e retomadas), Finanças com relatórios, ficha do cliente, menu Mais, Aprendizado do Assistente (registro, avaliação e sugestões que o André aprova), backup JSON e CSV. Sem WhatsApp. Detalhes em `app/README.md`.
- André: abrir o app no Safari e testar (principalmente Hoje, Orçamentos e o Assistente). Dizer o que mudar.
- Próximos módulos (não feitos): Instagram/Metricool no app, fotos por projeto, rotina semanal do aprendizado.
- Para gerar sugestões de melhoria: pedir ao Claude "analisar o aprendizado do app".
- Perguntas: prata ou ouro como acento (hoje é prata); logo original em boa resolução; regras do Indique e Ganhe.

## App Caixa Andre Tattoo (melhoria com IA que aprende)
- [x] Etapa 1: regra de orçamento do Assistente alinhada ao `contexto/marca.md` (versão 12). Cópia de segurança em `app/`.
- [ ] André testar no app: colar um pedido de orçamento no Assistente e conferir valor mínimo, sinal (R$ 100 até R$ 1.000, 20% acima), tom e ausência de preço final.
- [x] (feito na v2) Etapa 2: registrar cada resposta do Assistente + botões "Serviu / Editei / Errou". **Decisão do André: o registro inclui o nome do cliente** (ele compara com o WhatsApp; quanto mais informação do cliente, melhor). Confirmar com ele se inclui também telefone e valores.
- [x] (feito na v2) Etapa 3: tela de sugestões de melhoria, aprovadas pelo André, que atualizam as regras sem republicar o app.
- [ ] Etapa 4 (opcional): análise semanal agendada.
- [ ] Revisar em Ajustes do app: dias e horário de atendimento (padrão do app é todos os dias, 09:00 às 18:00; o André atende seg a sáb, 9h às 22h).
- [ ] Mensagem de lembrete do app diz "remarcação perde o sinal"; a política inclui cancelamento. Alinhar quando o André quiser.

## Site do estúdio (`site/`) — v3, direção papel claro
Versão nova no repositório desde 20/10: papel claro, Bodoni, fotos P&B e a linha de agulha dourada.
A v1 (tema escuro, formulário de 3 passos, FAQ, vídeo no topo) está inteira em `site-v1/`, junto com
o estudo de mercado (`site-v1/ESTUDO-MERCADO-UX-CRO.md`) e o passo a passo do Google (`site-v1/GOOGLE.md`).

Decisões que ficaram em aberto na troca de versão:
- [ ] **Publicar a v3 na Netlify** (hoje o ar ainda é a v2). Depois disso, reenviar o `sitemap.xml` no Search Console.
- [ ] **O site perdeu o formulário de orçamento** — a v3 manda todo mundo para o WhatsApp. Isso significa
      **nenhum lead gravado** se a pessoa não apertar enviar no WhatsApp. Decidir: fica assim ou volta o formulário?
- [ ] **O site perdeu FAQ e dados estruturados de perguntas** (valiam busca no Google). Decidir se voltam.
- [ ] **Não há medição nenhuma** na v3 (a v1 tinha os eventos prontos). Criar GA4 e Meta Pixel e me passar os IDs.
- [ ] **Depoimentos:** a v3 não tem a seção. Com 3 depoimentos reais guardados, ela volta — ver skill `depoimento-para-o-site`.

O que continua dependendo de você:
- [ ] **MAIS FOTOS.** A galeria tem 9 peças e as posições são fixas. Alvo: 25 a 30 peças para valer uma galeria maior.
- [ ] **Autorização de imagem** dos clientes das 9 peças publicadas — regra do repositório.
- [ ] **Perfil da Empresa no Google** (google.com/business) — grátis e é o que traz cliente local antes do site ranquear.
- [ ] **Link do seu Perfil da Empresa no Google** (avaliações públicas valem mais que depoimento no site).
- [ ] 2 a 3 fotos do ambiente do estúdio (bancada, sala) — hoje as fotos são quase todas de você tatuando.
- [ ] Confirmar: atende só com hora marcada? domingo e feriado?
- [ ] Opcional, alto impacto: vídeo de 10 s de uma peça **cicatrizada** (30+ dias).
- [ ] Liberar na rede do ambiente os domínios dos sites de referência (fernandosouzatattoo.com.br,
      robertocarlosart.com, dobskennel.com.br, camilotuero.art) para eu completar a análise de concorrência.

## Aguardando o André
- [ ] Foto da tattoo do leão pronta (e autorização do cliente) → `legenda-tattoo`, `pos-tattoo-avaliacao`, portfólio e possível Reels.
- [ ] Gravação de tela (ou frames) de um Reels de referência → `buscar-referencias-tattoo` / DNA em `referencias/`. O Instagram está bloqueado na rede deste ambiente.
- [ ] Música e BPM do Reels "Pele em 4 atos" para continuar o vídeo (`reels/exemplo-pele-em-4-atos/`, feito até 0:03).

## Contexto de marca ainda em aberto (`contexto/marca.md`)
- [ ] R$ 1.000 exato: entra no sinal de R$ 100 ou no de 20%?
- [ ] Formas de pagamento (Pix, cartão, parcelamento) e como o sinal é passado ao cliente.
- [ ] Atende só com hora marcada? Domingo e feriado?
- [ ] Cidade (presumida São Paulo/SP).
- [ ] Texto de preparação para a sessão (o que o cliente faz antes).
- [ ] Regras do "Indique e Ganhe".
- [ ] Confirmar ou descartar: vocabulário, texto de cuidados (Cicaplast), referência interna de R$ 1.200, tempo de conteúdo 4–7 h/semana, agente Sofia e n8n (lista B em `contexto/conflitos-a-resolver.md`).

## Aprendizados em observação (`aprendizados/`)
- [ ] LE-0001 (cor no orçamento): reavaliar se a ambiguidade voltar em outros leads.
- [ ] LE-0002 (etapas "valor + sinal" e "sinal recebido + agendamento"): reavaliar com mais leads; se confirmar, propor extensão do `orcamento-tattoo` ao André.

## Decisões do André a revisar quando quiser
- [x] Anúncio pago: autorizado a partir de 08/10/2026 (R$ 20/dia). Ver artifact "Plano de Anúncios".
- [ ] `registrar-no-sistema` como coletor e `learning-engine` como analista (proposta em `contexto/conflitos-a-resolver.md`).
