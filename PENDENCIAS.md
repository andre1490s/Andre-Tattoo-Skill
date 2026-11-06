# Pendências (retomar daqui)

Atualizado em 2026-11-06. Sem dados de clientes neste arquivo.

## AMANHÃ: iniciar o Ads (decisão do André em 2026-10-07)
- [x] (feito nas skills e marca.md; falta só o agente de Mídias do app) Mudança de regra: "foco orgânico". Atualizar `contexto/marca.md`, o agente de Mídias do app e as skills `roteiro-reels-tattoo`, `posts-semana-instagram` e `relatorio-instagram`. A skill `gestor-de-trafego` passa a ser usada de verdade.
- Trazer para começar: (1) verba mensal ou diária; (2) objetivo (conversas no WhatsApp, cliques no link da bio ou seguidores); (3) região do público (bairros ou raio em volta da Vila Matilde, ou São Paulo inteira); (4) 2 a 4 fotos ou vídeos de realismo preto e cinza para os criativos; (5) se a conta de anúncios do Meta já existe e está ligada ao Instagram @andretatuadoor; (6) se há alguma oferta com motivo, prazo e limite (sem desconto permanente).
- Regras do `contexto/marca.md` valem nos anúncios: sem preço em peça pública, sem escassez falsa, sem prometer resultado, só o André passa o valor final.
- Antes de qualquer gasto ou publicação: o Claude propõe a campanha e o André aprova cada passo. Nada vai ao ar sem confirmação.

## URGENTE: privacidade do repositório
- [ ] Conferido em 06/11/2026: o repositório `andre1490s/Andre-Tattoo-Skill` continua **PÚBLICO**. Tornar privado: GitHub > Settings > Danger Zone > Change repository visibility. Hoje ele expõe: valores de referência e políticas (marca.md, skills), o e-mail do Google (skill registrar-no-sistema) e o id do projeto Supabase (backup do app). Não há senhas, chaves nem dados de clientes.
- Regra daqui para frente: não commitar fotos de tattoos, dados de clientes nem builds com imagens embutidas.

## Aviso de lead no Telegram (falta um número no n8n)

Quando alguém preenche o formulário do site, o fluxo "Leads do site" no n8n grava o
pedido na Data Table e deveria te avisar no Telegram. O aviso não sai porque o nó do
Telegram está com um chat ID de exemplo.

- **Chat ID do André: `6800960252`** (ele mandou em 06/11/2026, pelo @get_id_bot)
- Onde colar: n8n > fluxo **Leads do site** (`arSPpODp7X9BPs3n`) > nó **Telegram** >
  campo **Chat ID** > salvar e publicar.
- [ ] Trocar o chat ID no nó do Telegram e disparar um teste pelo formulário do site.

Não consegui fazer isso daqui: o conector do n8n não conecta nesta sessão e o endereço de
ngrok do n8n está fora da lista de domínios liberados na rede deste ambiente (a conexão é
recusada antes de sair, 403 do proxy). Os dois caminhos estão fechados do meu lado.

### CORREÇÃO de um erro meu (06/11/2026)

Eu havia escrito aqui que "o lead é gravado mesmo sem o aviso, nada se perde". **Isso está
errado** e só vale se o n8n estiver no ar. Fui ler o `site/js/main.js` (bloco 7) e o que
acontece de verdade é:

1. O site abre o WhatsApp **primeiro**, com nome, ideia, região e quando a pessoa pode.
2. Depois manda o pedido ao n8n **em silêncio**: `fetch(...).catch(function(){})` engole
   qualquer erro.

Ou seja: com o n8n fora, o cliente ainda chega no WhatsApp (essa parte está salva), mas
**o lead não é gravado e ninguém é avisado da falha**. Nem o André, nem o visitante.

O desenho do site está certo (abrir o WhatsApp primeiro é o que importa). O problema é a
base: ngrok gratuito, sem nenhum aviso quando quebra.

### O 502 e o que conferir no n8n

Quando o André reconectou o n8n em 06/11/2026, o erro do conector mudou de **404** para
**502**. O 404 dizia "não achei esse conector"; o 502 diz "achei, tentei falar com o n8n
e não teve resposta". Indica que a reconexão funcionou e o que não responde é o n8n.

A conferir com o n8n aberto:
- [ ] O n8n está rodando e o túnel do **ngrok está ativo**.
- [ ] O fluxo **Leads do site** está **ativo/publicado**, não só salvo.
- [ ] O endereço do webhook que o n8n mostra bate com o do site
      (`webhook` no `js/dados.js`, hoje `https://unsaddle-arrange-track.ngrok-free.dev/webhook/lead-andre-tattoo`).
      **Principal suspeito:** endereço de ngrok gratuito muda a cada reinício do n8n. Se
      mudou, o site manda lead para um endereço morto desde então. É uma linha no
      `dados.js`.

### Proposta para quando o André quiser (não autorizada ainda)

Tirar a captação de lead de cima do ngrok gratuito e colocar um aviso quando o formulário
falhar, em vez de falhar calado. Caminho mais simples: Netlify Forms, que já roda no mesmo
lugar onde o site está publicado, não cai junto com o n8n e manda e-mail a cada envio. O
n8n continua recebendo também, como hoje. **Não mexer nisso sem o André mandar.**

Esse número não é senha: quem manda mensagem é o bot, e o token do bot não está neste
repositório. Mesmo assim, enquanto o repositório estiver público, é só avisar se preferir
que eu tire o número daqui.

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

Decisões que ficaram em aberto na troca de versão (revisto em 06/11/2026):
- [x] **No ar.** A v3 está publicada na Netlify, ligada ao GitHub, com domínio próprio
      **https://andretattoo.com.br** (HTTPS pela Netlify) e o `sitemap.xml` já reenviado no
      Search Console. Detalhes do domínio e do DNS em `site/README.md`.
- [x] **O formulário voltou.** Home e `clube-15.html` têm formulário que grava o lead no n8n
      antes de abrir o WhatsApp. Cada botão manda uma mensagem diferente, então pela frase você
      sabe de onde o cliente saiu. Só falta o aviso no Telegram (ver seção acima).
- [x] **FAQ e dados estruturados voltaram.** As perguntas ficam na lista `duvidas` do
      `js/dados.js`; o `main.js` monta a sanfona e o FAQPage que o Google lê a partir dela.
- [ ] **Não há medição nenhuma** (confirmado: zero tag de GA4 ou Pixel no `index.html`).
      Criar GA4 e Meta Pixel e me passar os IDs. É o que falta para saber quanto o site traz.
- [x] **Avaliações no ar.** Seis avaliações reais copiadas do Perfil da Empresa no Google,
      com a nota 5,0, a contagem e o botão "Ver no Google". Nada escrito por nós.
- [x] **Clube 15** publicado: selo no topo da home, seção escura depois das avaliações e a
      página `clube-15.html` com o regulamento inteiro. Nenhum valor no site, como combinado.
      No dia a dia você mexe em um número só: `clube.ocupadas` no `js/dados.js`.

O que continua dependendo de você:
- [ ] **MAIS FOTOS.** A galeria tem 12 peças. Alvo: 25 a 30. A grade não tem posição fixa:
      é só somar linhas na lista `trabalhos` do `js/dados.js` que ela se ajusta sozinha.
- [ ] **Autorização de imagem** dos clientes das 12 peças publicadas — regra do repositório.
- [x] **Perfil da Empresa no Google** criado em 11/2026, aguardando a análise do Google.
- [x] **Link do Perfil da Empresa** já no site (`google.url` no `js/dados.js`), ligando o botão
      "Ver no Google".
- [ ] **Atualizar o link do site** na bio do Instagram (@andretatuadoor) e do TikTok
      (@andretattoo.ink) para `https://andretattoo.com.br`.
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
