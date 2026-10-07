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

### Camada de aprendizado
| Skill | Função | Status |
|---|---|---|
| `learning-engine` | observa resultados, feedback e skills; extrai padrões com nível de confiança; propõe melhorias entre skills | ✅ `skills/` |

### 0. Direção e aquisição
| Skill | Função | Status |
|---|---|---|
| `cerebro-estrategico` | diagnóstico, prioridades, plano de ação e decisão entre frentes | ✅ `skills/` |
| `gestor-de-trafego` | Meta Ads/Instagram: público, criativos, testes e métricas | ✅ `skills/` |
| `arquiteto-ofertas` | ofertas com motivo, prazo e limite; desconto nunca é a primeira solução | ✅ `skills/` |
| `estrategista-instagram` | auditoria do perfil como sistema de aquisição e posicionamento | ✅ `skills/` |

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
| `closer-vendas` | conduz a conversa 1:1: qualificação, orçamento, objeções, decisão, sinal | ✅ `skills/` |
| `crm-followup` | organiza a base por etapa do funil e define cadências por idade do lead | ✅ `skills/` |
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
| `analista-metricas` | dado → diagnóstico → teste → resultado → decisão (conteúdo, vendas, tráfego) | ✅ `skills/` |
| `gestor-financeiro` | faturamento ≠ lucro ≠ caixa; ponto de equilíbrio, margem, receita por hora | ✅ `skills/` |
| `relatorio-instagram` | desempenho do perfil via Metricool | 🟡 |
| `revisao-semanal-estudio` | leads, agenda, caixa, Instagram e 3 ajustes | 🟡 |
| `revisao-conversas-sofia` | revisão das conversas do agente de WhatsApp | 🟡 |
| `registrar-no-sistema` | grava o que foi aprendido (ciclo entre agentes) | 🟡 |

> As 12 skills ✅ foram importadas dos arquivos do André; o contexto global que se repetia nelas está em `contexto/marca.md`. A lista 🟡 vem dos nomes das skills disponíveis na conta do André no Claude.ai. Só conheço o nome e a descrição curta; o conteúdo só entra aqui quando o André enviar cada arquivo.

## Aprendizado (Learning Engine)

O `learning-engine` fica **acima** das outras skills: não executa tarefas, aprende com elas.
- **Entrada:** métricas (via `analista-metricas`), feedback do André, fichas de `referencias/` e conflitos entre skills.
- **Memória:** `aprendizados/` (um arquivo por aprendizado + `INDEX.md`), com nível de confiança de 1 a 5.
- **Saída:** proposta de melhoria ao André. Nenhuma skill é alterada sem o OK dele.
- **Relação com `registrar-no-sistema` 🟡:** é a skill mais próxima do Learning Engine (ciclo de aprendizado). Quando o André enviar o arquivo, decidimos se ela vira o "coletor" que alimenta o Learning Engine ou se é substituída por ele.

## Fronteiras entre skills que se sobrepõem

| Tema | Quem faz o quê |
|---|---|
| Follow-up | `crm-followup` decide **quem** contatar e **quando** (segmento + cadência). `closer-vendas` conduz a **conversa** com cada lead. As 🟡 `followup-orcamento` e `reativar-clientes-antigos` são tratadas como especialistas de mensagem dentro do CRM, a validar. |
| Métricas | `analista-metricas` interpreta dados e decide testes. `gestor-de-trafego` só opera anúncios. 🟡 `relatorio-instagram` é a fonte (Metricool) que alimenta o analista. |
| Dinheiro | `gestor-financeiro` analisa números do estúdio. 🟡 `fechamento-mensal-estudio` é a rotina mensal que o alimenta. |
| Oferta | `arquiteto-ofertas` cria a condição. `closer-vendas` e `diretor-conteudo-copy` só a usam; nenhum dos dois dá desconto por conta própria. |
| Instagram | `estrategista-instagram` audita o perfil (estrutura). `diretor-conteudo-copy` produz o conteúdo. 🟡 `posts-semana-instagram` é a execução semanal no Metricool. |
| Orquestração | Em conflito entre skills, vale a prioridade definida pelo `cerebro-estrategico`. |

## Rotinas (como a agência roda)

| Rotina | Sequência |
|---|---|
| **Semanal** | `analista-metricas` (semana passada) → `cerebro-estrategico` (3 prioridades) → `diretor-conteudo-copy` (pauta) → `editor-videos-tattoo` (vídeos) → `crm-followup` (lista de contatos da semana) |
| **Mensal** | `gestor-financeiro` + `analista-metricas` → `cerebro-estrategico` (metas do mês) → `arquiteto-ofertas` (se agenda com buraco) → `gestor-de-trafego` (testes do mês) |
| **Por lead novo** | `closer-vendas` → `crm-followup` (entra no funil) → resultado volta ao `cerebro-estrategico` |
| **Por vídeo novo** | `buscar-referencias-tattoo` → `editor-videos-tattoo` → `gestor-de-trafego` (teste como criativo) |
| **Perfil parado** | `estrategista-instagram` (auditoria) → `cerebro-estrategico` → execução |

## Handoffs principais (contratos entre skills)

| De → Para | O que passa |
|---|---|
| `buscar-referencias-tattoo` → `referencias/` | ficha de DNA aprovada (`referencias/<padrão>.md`) |
| `referencias/` → `editor-videos-tattoo` | DNA mais recente ("faça nesse estilo") |
| `diretor-conteudo-copy` / `roteiro-reels-tattoo` → `editor-videos-tattoo` | ideia aprovada: objetivo, hook, cenas, texto de tela e CTA |
| `editor-videos-tattoo` → `gestor-de-trafego` | vídeos com melhor retenção viram criativos para teste |
| `gestor-de-trafego` → `closer-vendas` | leads vindos de anúncio, com origem e criativo |
| `closer-vendas` ↔ `crm-followup` | lead e etapa atualizada; lista de quem recontatar e a cadência |
| `crm-followup` / `closer-vendas` → `analista-metricas` | funil: leads, orçamentos, sinais, agendamentos, conversão, ticket, receita recuperada |
| `analista-metricas` → `cerebro-estrategico` | o que aconteceu, o que não se pode concluir, o que testar |
| `gestor-financeiro` → `cerebro-estrategico` / `arquiteto-ofertas` | margem, ocupação e meta: define se cabe oferta e quanto de agenda abrir |
| `arquiteto-ofertas` → `closer-vendas` / `diretor-conteudo-copy` / `gestor-de-trafego` | oferta aprovada: conceito, limite, prazo, copy e CTA |
| `estrategista-instagram` → `cerebro-estrategico` | problemas críticos, melhorias rápidas e estruturais, testes |
| `cerebro-estrategico` → qualquer skill | prioridade, objetivo e métrica de sucesso da ação |
| `editor-videos-tattoo` → `legenda-tattoo` | vídeo final + tema da tattoo |
| `legenda-tattoo` → `posts-semana-instagram` | legenda aprovada para agendar |
| `responder-instagram` / `orcamento-tattoo` → `briefing-projeto-tattoo` | lead com ideia de tattoo |
| `briefing-projeto-tattoo` → `resumo-agenda-semanal` | projeto fechado e data |
| `pos-tattoo-avaliacao` → `responder-avaliacoes-google` | avaliações recebidas |
| `relatorio-instagram` → `buscar-referencias-tattoo` / `roteiro-reels-tattoo` | o que performou, para repetir |
| qualquer skill → `registrar-no-sistema` | cliente, decisão e aprendizado ao fim do atendimento |
| `analista-metricas` / feedback do André → `learning-engine` | resultado com número e fonte, ou feedback direto |
| `learning-engine` → `cerebro-estrategico` | aprendizados de nível 3+ que mudam prioridade ou estratégia |
| `learning-engine` → qualquer skill | recomendação de melhoria (só com OK do André) |

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
aprendizados/           memória do Learning Engine (LE-NNNN.md + INDEX.md)
reels/<projeto>/        projetos de vídeo em andamento
templates/              modelo para novas skills
```

## Como adicionar uma skill
1. André envia o arquivo `.md` da skill.
2. Salvo em `skills/<nome>/SKILL.md`, com frontmatter (`name`, `description`) se faltar.
3. Reviso: conflito com outra skill, regras duplicadas, dependência de ferramenta que não existe aqui.
4. Atualizo o status em `AGENCIA.md` (🟡 → ✅) e os handoffs.
