# Agência André Tattoo: mapa do sistema

Um sistema de skills que cobre o ciclo completo: atrair → atender → fechar → tatuar → pós-venda → aprender.
Cada skill é um "agente" com função única. Elas passam resultado umas para as outras (handoff) e todas leem `contexto/marca.md`.

## Camada de comando
O `cerebro-estrategico` é o orquestrador: recebe dados (marketing, vendas, agenda, conteúdo, financeiro), diagnostica, define prioridades P1/P2/P3 e indica **qual skill executa cada ação**, com indicador e prazo de revisão. As demais skills executam; o Cérebro decide a ordem.

## Pipeline

```
ESTRATÉGIA ─► CONTEÚDO ─► ATENDIMENTO ─► OPERAÇÃO ─► PÓS-VENDA ─► ANÁLISE
     ▲                                                              │
     └────────────────── aprendizado (registrar-no-sistema) ◄───────┘
```

## Departamentos e skills

Status: ✅ no repositório · 🟡 existe no Claude.ai do André, ainda não importada · ⬜ a criar

### 0. Direção e aquisição
| Skill | Função | Status |
|---|---|---|
| `cerebro-estrategico` | diagnóstico, prioridades, plano de ação e decisão entre frentes | ✅ `skills/` |
| `gestor-de-trafego` | Meta Ads/Instagram: público, criativos, testes e métricas | ✅ `skills/` |

### 1. Conteúdo e vídeo
| Skill | Função | Status |
|---|---|---|
| `buscar-referencias-tattoo` | acha vídeos de tattoo com edição forte e extrai o DNA | ✅ `skills/` |
| `editor-videos-tattoo` | transforma DNA + material bruto em receita de edição (CapCut/Premiere/DaVinci) | ✅ `skills/` |
| `diretor-conteudo-copy` | pilares, ideias, hooks, calendário, stories e copy | ✅ `skills/` |
| `roteiro-reels-tattoo` | roteiro, ideia e texto de tela para Reels | 🟡 |
| `legenda-tattoo` | legenda para o Instagram a partir da foto/detalhes da tattoo | 🟡 |
| `posts-semana-instagram` | planejamento semanal e agendamento no Metricool | 🟡 |

### 2. Atendimento e vendas
| Skill | Função | Status |
|---|---|---|
| `closer-vendas` | funil lead → sinal → agendamento, objeções e cadências de follow-up | ✅ `skills/` |
| `responder-instagram` | respostas a comentários e Direct | 🟡 |
| `orcamento-tattoo` | resposta pronta para pedido de orçamento | 🟡 |
| `followup-orcamento` | retoma quem pediu orçamento e sumiu | 🟡 |
| `briefing-projeto-tattoo` | ficha do projeto a partir da conversa com o cliente | 🟡 |

### 3. Operação do estúdio
| Skill | Função | Status |
|---|---|---|
| `lembrete-sessao` | confirmação/lembrete de sessão | 🟡 |
| `resumo-agenda-semanal` | sessões, sinais, material e pendências da semana | 🟡 |
| `fechamento-mensal-estudio` | faturamento, ticket médio, gastos, meta | 🟡 |

### 4. Pós-venda e relacionamento
| Skill | Função | Status |
|---|---|---|
| `pos-tattoo-avaliacao` | cuidados, cicatrização e pedido de avaliação | 🟡 |
| `responder-avaliacoes-google` | resposta a avaliações do Google | 🟡 |
| `reativar-clientes-antigos` | aniversário, retoque, continuação de fechamento | 🟡 |

### 5. Análise e aprendizado
| Skill | Função | Status |
|---|---|---|
| `relatorio-instagram` | desempenho do perfil via Metricool | 🟡 |
| `revisao-semanal-estudio` | leads, agenda, caixa, Instagram e 3 ajustes | 🟡 |
| `revisao-conversas-sofia` | revisão das conversas do agente de WhatsApp | 🟡 |
| `registrar-no-sistema` | grava o que foi aprendido (ciclo entre agentes) | 🟡 |

> As skills ✅ de direção, tráfego, conteúdo e vendas foram importadas dos arquivos do André; o contexto global que se repetia nelas está em `contexto/marca.md`. A lista 🟡 vem dos nomes das skills disponíveis na conta do André no Claude.ai. Só conheço o nome e a descrição curta; o conteúdo só entra aqui quando o André enviar cada arquivo.

## Handoffs principais (contratos entre skills)

| De → Para | O que passa |
|---|---|
| `buscar-referencias-tattoo` → `referencias/` | ficha de DNA aprovada (`referencias/<padrão>.md`) |
| `referencias/` → `editor-videos-tattoo` | DNA mais recente ("faça nesse estilo") |
| `diretor-conteudo-copy` / `roteiro-reels-tattoo` → `editor-videos-tattoo` | ideia aprovada: objetivo, hook, cenas, texto de tela e CTA |
| `editor-videos-tattoo` → `gestor-de-trafego` | vídeos com melhor retenção viram criativos para teste |
| `gestor-de-trafego` → `closer-vendas` | leads vindos de anúncio, com origem e criativo |
| `closer-vendas` → `cerebro-estrategico` | funil: leads, orçamentos, sinais, agendamentos, conversão, ticket |
| `cerebro-estrategico` → qualquer skill | prioridade, objetivo e métrica de sucesso da ação |
| `editor-videos-tattoo` → `legenda-tattoo` | vídeo final + tema da tattoo |
| `legenda-tattoo` → `posts-semana-instagram` | legenda aprovada para agendar |
| `responder-instagram` / `orcamento-tattoo` → `briefing-projeto-tattoo` | lead com ideia de tattoo |
| `briefing-projeto-tattoo` → `resumo-agenda-semanal` | projeto fechado e data |
| `pos-tattoo-avaliacao` → `responder-avaliacoes-google` | avaliações recebidas |
| `relatorio-instagram` → `buscar-referencias-tattoo` / `roteiro-reels-tattoo` | o que performou, para repetir |
| qualquer skill → `registrar-no-sistema` | cliente, decisão e aprendizado ao fim do atendimento |

## Regras do sistema
1. **Uma função por skill.** Se a skill faz duas coisas, divida.
2. **Contexto compartilhado (`contexto/marca.md`):** nada de repetir preço, tom ou identidade dentro da skill; leia `contexto/marca.md`.
3. **Sem invenção:** dado ausente vira `[confirmar]`, nunca um palpite.
4. **Ações externas só com confirmação:** enviar mensagem, publicar, agendar, apagar. O padrão é preparar o rascunho.
5. **Dados de clientes:** não vão para o repositório (fotos de clientes, telefones, conversas). Só padrões e aprendizados anonimizados.
6. **Honestidade de capacidade:** cada skill declara o que não consegue fazer (ex.: ver vídeo sem acesso à rede).

## Estrutura do repositório

```
AGENCIA.md              este mapa
contexto/marca.md       identidade, tom, serviços, estúdio
skills/<nome>/SKILL.md  uma pasta por skill (+ scripts/ se houver)
referencias/            DNAs de edição aprovados
reels/<projeto>/        projetos de vídeo em andamento
templates/              modelo para novas skills
```

## Como adicionar uma skill
1. André envia o arquivo `.md` da skill.
2. Salvo em `skills/<nome>/SKILL.md`, com frontmatter (`name`, `description`) se faltar.
3. Reviso: conflito com outra skill, regras duplicadas, dependência de ferramenta que não existe aqui.
4. Atualizo o status em `AGENCIA.md` (🟡 → ✅) e os handoffs.
