# App "Caixa Andre Tattoo" (página privada no Claude)

URL: https://claude.ai/artifact/KhWRM6NkTshaP96W9HrWBN (privada, só o André).

## Arquivos
- `caixa-andre-tattoo.v1791292358-968f.html`: **cópia de segurança** da versão publicada antes das alterações feitas por este repositório. Serve para voltar atrás. Não contém dados (os dados ficam no banco da página, em área privada).

## Capacidades declaradas no app
- `db`: dados do caixa, agenda, pendências, materiais e ajustes (em `data/users/<id>/`, área privada: nem o Claude lê).
- `sample`: o Assistente do Estúdio (IA da própria página, sem chave de API).
- `mcp`: Google Calendar (`list_events`, `create_event`) e Supabase (`execute_sql`, leads do WhatsApp).
- `user`.

## Onde estão as regras do Assistente
Constante `RULES` dentro do script da página (seção "Assistente do estúdio"). A regra 15 (orçamento) é uma cópia das regras de `contexto/marca.md` e `skills/orcamento-tattoo`. **Ao mudar sinal, valor mínimo ou tom em `contexto/marca.md`, atualizar também `RULES` no app.**

## Cuidados ao republicar
- Partir sempre do arquivo salvo da versão atual, nunca de memória.
- Não passar `capabilities` ao republicar (mantém a declaração atual).
- Checar a sintaxe do script antes de publicar (`node --check` no conteúdo do `<script>`).

## Registro de mudanças
- 2026-10-07 (versão 12, id 1791406398-add1): regra 15 do Assistente alinhada ao `contexto/marca.md` (valor mínimo R$ 250; sinal R$ 100 até R$ 1.000 e 20% acima; sinal não reembolsável; só o André passa o preço final; tom e emojis; maori; nota de cor).

Para voltar atrás: republicar `caixa-andre-tattoo.v1791292358-968f.html` na mesma URL (sem passar `capabilities`).

## Versão 13 (2026-10-07): app v2 "Fumaça e Prata"
- Fonte em `app/src/` (index.html, css/app.css, js/base.js + js/novo.js, manifest.json). Montar: `python3 -I app/build.py` (gera `app/dist/`, fora do git). Testar: `NODE_PATH=$(npm root -g) node app/test/smoke.mjs` (Chromium headless com o simulador `app/test/mock-claude.js`, 50+ verificações).
- Telas: Hoje, Agenda, Clientes (com Orçamentos), Finanças (com relatórios), Mais (Pendências, Materiais, Aprendizado, Regras da casa, Backup, CSV, Ajustes).
- Sem WhatsApp/Supabase. Capacidades declaradas: db, sample, user, downloads, mcp (Google Calendar: list_events, create_event). Contrato 0.2.74.
- Dados antigos: mesmos caminhos e campos. Novos (aditivos): `data/users/<id>/orcamentos/itens`, `.../clientes/itens`, config `custosFixos`. Áreas compartilhadas (legíveis pelo Claude): `aprendizado_log`, `aprendizado_sugestoes`, `aprendizado_cfg/regras`.
- As regras da casa (sinal, mínimo, retoque...) estão na constante `POLITICA` em `js/novo.js` e na `RULES` do Assistente em `js/base.js`. Ao mudar `contexto/marca.md`, atualizar os dois.

### Voltar atrás
Republicar `caixa-andre-tattoo.v12-regra-orcamento.html` (ou a v1 original) na mesma URL passando `contract: "0.2.66"` e as capacidades antigas (db, sample, user, mcp com Google Calendar e Supabase).

## Versão 14: ajustes da casa e Instagram
- Aviso na tela Hoje quando os ajustes salvos são antigos (sem `padraoV`): "Aplicar padrões" (meta R$ 20.000, seg a sáb, 9h às 22h; preserva duração e custos fixos) ou "Manter os meus".
- Tela Instagram (Mais): conector Metricool, só leitura (`getBrandSettings`, `getAnalyticsDataByMetrics`, `getBestTimeToPostByNetwork`). Métricas `IGEV*`: seguidores, alcance, visualizações, interações, salvos, compartilhados, reels, contas engajadas, mais melhores horários. Período atual x anterior (7, 30 ou 90 dias).
- Limites do conector: **não há visitas ao perfil nem cliques no link** (campos marcados "não usar"), e o desempenho por post (`IGPF*`) voltou vazio; por isso não há "melhores posts".
- Nome do servidor no manifesto: `METRICOOL` (não verificado no app real).

## Versão 15: agentes
- Três agentes dentro do chat do app (botões na tela Hoje): **Financeiro**, **Vendas** e **Mídias**. Cada um tem regras próprias (derivadas das skills gestor-financeiro, closer-vendas/crm-followup/arquiteto-ofertas e diretor-conteudo-copy/posts-semana-instagram, em `AG_REGRAS` de `js/novo.js`) e recebe só os dados de que precisa (`snapshotAgente`). O de Mídias não recebe nomes de clientes.
- Conteúdo da semana (Mais): calendário de posts com etapas (ideia, gravar, editar, pronto, agendado, publicado) e botão de copiar legenda. Coleção `data/users/<id>/conteudo/itens`. O agente de Mídias propõe posts (ação `post`) que o André confirma.
- **O app não agenda nem publica no Instagram/Metricool.** O rascunho do Metricool exige e-mail de revisores e plano de equipe, e o agendamento direto publicaria no perfil sem formato verificado. O envio ao Metricool é feito pelo Claude na conversa, com aprovação do André.
- O log de aprendizado registra qual agente respondeu (`agente`).

## Versão 16: Google Agenda automático e correção dos agentes
- Toda sessão marcada no app (formulário, Assistente ou "Fechou" no funil) vira evento no Google Agenda com horário, fuso, endereço e descrição (estilo, sinal, valor). O horário passa a ser obrigatório quando o Google está conectado. Remarcar ou editar atualiza o evento (`update_event`).
- Sem duplicar: antes de criar, o app procura no Google um evento do mesmo dia e horário com o nome do cliente e, se houver, adota o existente. A importação do Google também adota a sessão do app em vez de duplicar.
- Aviso na tela Hoje: sessões futuras que ainda não estão no Google, com botão para enviar (não envia sozinho as antigas, para não gravar em massa no calendário sem você pedir).
- Cancelar ou apagar uma sessão no app **não** apaga o evento no Google (falta a ferramenta de exclusão no manifesto).
- Correção: o log gravava o agente errado se você trocasse de agente durante a resposta. Agora o agente é capturado na pergunta e a troca fica bloqueada enquanto há resposta em andamento.

## Versão 17: calendário e avisos dos agentes
- Todo campo de data dos formulários abre um **calendário próprio** (o campo nativo do navegador não funcionava bem no Safari do André). Mostra pontos nos dias com sessão, vermelho para trabalho grande, cinza fora dos dias de atendimento; ao tocar num dia, lista as sessões, avisa a regra de 1 trabalho grande por dia e mostra os horários livres.
- **Ponto de aviso** nos botões dos agentes (tela Hoje). Os avisos são calculados por regras, sem usar IA: Vendas (orçamentos para retomar, clientes 90+ dias, aniversários), Financeiro (sessões por concluir, sem valor combinado, custos fixos, ritmo da meta, material), Mídias (semana sem posts, post de hoje, post atrasado). Ao abrir o agente, os avisos aparecem como mensagem e o ponto some; um aviso novo reacende o ponto. O que já foi visto fica em `localStorage` (`andre-avisos`).

### Ainda não feito
Fotos por projeto (capacidade `assets`), rotina semanal automática do aprendizado, melhores posts (se o Metricool passar a devolver dados por post).
