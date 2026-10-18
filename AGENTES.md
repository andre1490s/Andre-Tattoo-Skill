# Agentes da Agência André Tattoo

**Skill é o manual. Agente é quem atende.**
As 40 skills continuam sendo as instruções detalhadas de cada tarefa. Os agentes são 5 "funcionários" que pegam um pedido seu, leem as skills certas sozinhos, fazem o trabalho e registram no painel o que fizeram e o que depende de você.

Ficam em `.claude/agents/` (um arquivo por agente). O painel fica em `painel/` (ver `painel/README.md`).

## Os cinco

| Agente | Chama ele para | Lê as skills | Entrega |
|---|---|---|---|
| **carrossel** | post em carrossel para o Instagram: educativo, erros/mitos, portfólio comentado, processo, prova social | `carrossel-instagram`, `arte-post-gemini`, `diretor-conteudo-copy`, `posts-semana-instagram` | formato + texto card a card + nota de arte + legenda + hashtags + alt text + horário |
| **editor-video** | cortar e montar Reels e Shorts, decidir quantos vídeos saem de uma sessão | `editor-videos-tattoo`, `buscar-referencias-tattoo`, `roteiro-reels-tattoo`, `roteiro-shorts-youtube`, `cortes-de-sessao`, `publicar-shorts-youtube` | mapa de cortes + receita segundo a segundo + comandos `ffmpeg` prontos + título/capa para o YouTube |
| **financeiro** | fechamento do mês, lucro, ticket, receita por hora, meta, impacto de desconto | `gestor-financeiro`, `fechamento-mensal-estudio`, `monetizacao-youtube` | quadro do mês + indicadores + diagnóstico + uma decisão sugerida |
| **marketing** | pauta da semana, auditoria do perfil, anúncio no Meta Ads, leitura do Metricool | `diretor-conteudo-copy`, `estrategista-instagram`, `posts-semana-instagram`, `gestor-de-trafego`, `relatorio-instagram`, `arquiteto-ofertas` | pauta de 3 a 4 peças + leitura dos números + proposta de anúncio |
| **vendas** | lead novo, orçamento, objeção, sinal, quem sumiu, cliente antigo | `closer-vendas`, `orcamento-tattoo`, `briefing-projeto-tattoo`, `crm-followup`, `followup-orcamento`, `reativar-clientes-antigos`, `responder-instagram`, `lembrete-sessao` | mensagem pronta para colar + ficha do projeto + lista de quem contatar |

## Como chamar
No Claude Code, basta pedir em português: *"agente de vendas: cliente pediu orçamento de leão no antebraço, 15 cm, preto e cinza"*.
Ou citar o nome do agente no começo do pedido: `carrossel`, `editor-video`, `financeiro`, `marketing`, `vendas`.

Agente novo criado agora só aparece na lista depois de reabrir a sessão; se eu disser que não encontrei o agente, é isso — peça de novo que eu executo seguindo o mesmo arquivo.

## Regras que valem para todos (herdadas do `AGENCIA.md` e do `contexto/marca.md`)
1. **Preço final é só do André.** Nenhum agente informa, confirma ou negocia valor com cliente.
2. **Nada vai ao ar sozinho.** Publicar, enviar, agendar e gastar exigem seu "pode ir". O padrão é deixar pronto.
3. **Sem invenção.** Dado que falta vira `[confirmar]`.
4. **Sem dado de cliente no repositório.** Nome, telefone, foto e conversa ficam no app e no WhatsApp; aqui só entram contagens e padrões.
5. **Arquivo de entrega vai em `painel/saidas/`** (fora do GitHub). No repositório, só número e padrão.
6. **Toda tarefa termina registrada no painel**, com status `entregue`, `aguardando-andre` ou `travado`.
7. Em conflito de prioridade entre agentes, vale o `cerebro-estrategico`.

## O ciclo
```
você pede  →  agente lê marca.md + skills  →  faz  →  registra no painel
                                                        │
      melhorias (skills, conexões, plugins)  ◄──────────┘
```
O painel mostra onde o sistema está fraco (funil que trava, alcance parado, custo sem lançar, agente que nunca é usado). É a partir dele que a gente decide a próxima skill, a próxima conexão e o próximo agente — em vez de chutar.

## Como criar o próximo agente
1. Copie um arquivo de `.claude/agents/` e troque: `name`, `description`, as skills que ele lê e os limites.
2. Se a função ainda não tem manual, crie a skill antes (`templates/SKILL.template.md`) e registre no `AGENCIA.md`.
3. Acrescente o nome dele na lista `AGENTES` de `painel/registrar.py`, para as execuções aparecerem no painel.
4. Rode `python3 -I scripts/validar.py` e `python3 -I painel/gerar.py`.
