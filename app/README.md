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
