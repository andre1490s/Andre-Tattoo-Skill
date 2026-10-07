# Retomada: transformar o app Caixa Andre Tattoo no app completo de gestão

Pausado em 2026-10-07 a pedido do André (limite de uso). Nada do app em produção foi alterado além da versão 12 (regra de orçamento do Assistente). O app publicado continua funcionando como está.

## O que o André decidiu
- Autorização total para mudar o app. O objetivo é o app mais completo de gestão e controle do negócio, para não precisar de outros meios para ter as informações.
- Interativo, fácil de entender, visual moderno, com cores e fontes que mostrem a identidade dele: o estilo de tattoo (realismo preto e cinza, a capa do Instagram) e o logo.
- **Não pode parecer que nada mudou.** O visual precisa ser claramente novo.
- **Sem WhatsApp no app por enquanto.** Remover a integração de leads do WhatsApp (Supabase). Mensagens prontas continuam, com "Copiar".
- Continuar na página do Claude (migrar para outra hospedagem só no futuro).
- Registro de aprendizado do Assistente inclui o nome do cliente (decisão dele).

## Plano em fases (tarefas)
1. Descoberta: 8 agentes em paralelo (`app/docs/workflows/descoberta.js`). **Só o relatório de identidade terminou** (fica local, não vai ao repositório público). Faltam: funcionalidades dos apps antigos, estilo das fotos, Metricool, API de capacidades + mock do `window.claude`, pesquisa de mercado, regras de negócio das skills, inventário do app atual.
2. Especificação e arquitetura (SPEC.md).
3. Design system.
4. Construção dos módulos em paralelo.
5. Verificação adversarial (Chromium headless com mock).
6. Publicação com passada funcional no banco.

## Decisões técnicas já tomadas
- Código em módulos em `app/src/` (manifest.json, css, js) montado em **um único HTML** por `python3 -I app/build.py` (já pronto, valida sintaxe e tamanho). O resultado (`app/dist/`) e as imagens-fonte (`app/assets-src/`) ficam fora do git.
- Dados existentes não podem ser tocados: mesmos caminhos do banco, só campos novos (aditivo). Caminhos: coleção do caixa em `data/users/<uid>` (docs com `kind` in/out), subcoleções `agenda/itens`, `pendencias/itens`, `materiais/itens` e o doc `config`. Inventário completo ainda a produzir (fase 1).
- Republicar na mesma URL, partindo do arquivo da versão atual, com `capabilities` explícitas: db, sample, user, mcp (Google Calendar e Metricool; **sem Supabase**), e possivelmente assets (fotos de projeto) e downloads (exportar dados). Subir o contrato para 0.2.73 só depois de testar.
- Teste: Playwright 1.56 e Chromium estão em `/opt/pw-browsers`; o mock fiel de `window.claude` ainda precisa ser escrito (`app/test/mock-claude.js`).
- Backup para voltar atrás: `app/caixa-andre-tattoo.v1791292358-968f.html` (antes das mudanças) e a versão 12 é a base atual.

## Achados de identidade (resumo seguro)
- Identidade real: preto tinta, cinza e off-white quente, metal discreto como acento, serifa clássica em caixa alta com espaçamento largo nos títulos, Manrope no texto, linhas finas de 1px, foto da tattoo em preto e branco como protagonista. Ideia que costura tudo: a luz vem por último.
- Logo: monograma "A" prata com agulha de máquina atravessando, círculo ao fundo e estrela no topo, sobre preto. Existe só em baixa resolução (128x160) dentro do app; pedir o original ao André.
- Divergência de metal: prata (logo e app) contra ouro (site V1 e cartões recentes). Recomendação: prata como acento do app; ouro só em momentos premium. **Decisão do André pendente.**
- O app atual usa cantos arredondados; site e design system usam cantos retos ou quase retos. É o caminho mais seguro para o app parecer novo sem perder a marca.
- Direção visual sugerida: "Fumaça e Prata".
- O texto de alguns artifacts antigos ainda tem valores desatualizados; vale o `contexto/marca.md`.

## Como retomar
Dizer "retomar o app". Passos: (1) rerodar a descoberta sem o agente de identidade, (2) escrever a especificação, (3) design system, (4) construir, (5) verificar, (6) publicar.

## Segurança
O repositório está **público** e deve ser tornado privado pelo André (ver `PENDENCIAS.md`). Não commitar fotos de tattoos, números de telefone, valores de clientes, nem relatórios com dados do negócio.
