# Agência André Tattoo

Sistema de skills para o estúdio André Tattoo (@andretatuadoor): conteúdo, vendas, operação, análise e aprendizado.

- **Os 5 agentes (carrossel, vídeo, financeiro, marketing, vendas):** [`AGENTES.md`](AGENTES.md)
- **Painel (uma tela com tudo):** [`painel/README.md`](painel/README.md) — rode `python3 -I painel/gerar.py` e abra `painel/index.html`
- **Mapa completo, rotinas e fronteiras entre skills:** [`AGENCIA.md`](AGENCIA.md)
- **Contexto de marca (fonte única de verdade):** [`contexto/marca.md`](contexto/marca.md)
- **Skills:** [`skills/`](skills/) (uma pasta por skill, com `SKILL.md`)
- **Memória de aprendizados:** [`aprendizados/`](aprendizados/)
- **Referências de edição aprovadas:** [`referencias/`](referencias/)
- **Site do estúdio (andretattoo.netlify.app):** [`site/`](site/) — ver [`site/README.md`](site/README.md)
- **Canal do YouTube (Shorts, retenção e monetização):** [`youtube/`](youtube/) — ver [`youtube/README.md`](youtube/README.md)

## Por onde começar
| Quero... | Use |
|---|---|
| ver tudo que está acontecendo | o painel: `python3 -I painel/gerar.py` |
| um post em carrossel | agente **carrossel** (skill `carrossel-instagram`) |
| cortar e montar um Reels ou Short | agente **editor-video** |
| saber como o mês está de dinheiro | agente **financeiro** |
| pauta da semana, perfil ou anúncio | agente **marketing** |
| atender um lead, orçamento ou follow-up | agente **vendas** |
| decidir o que fazer primeiro | `cerebro-estrategico` |
| ideias de conteúdo e legendas | `diretor-conteudo-copy` |
| montar a edição de um Reels | `editor-videos-tattoo` (e `buscar-referencias-tattoo` para achar referências) |
| responder/fechar um lead | `closer-vendas` e `crm-followup` |
| criar uma oferta | `arquiteto-ofertas` |
| anúncios | `gestor-de-trafego` |
| entender números | `analista-metricas` e `gestor-financeiro` |
| auditar o perfil | `estrategista-instagram` |
| criar Shorts e monetizar o YouTube | `youtube/README.md` e as skills `cortes-de-sessao`, `roteiro-shorts-youtube`, `publicar-shorts-youtube`, `metricas-shorts-youtube`, `monetizacao-youtube` |
| saber o que funcionou e por quê | `learning-engine` |
| ver quanto as skills gastam de tokens | `buscar-consumo-tokens` |

## Manutenção
```
python3 -I scripts/validar.py     # skills, mapa e referências cruzadas
python3 -I painel/gerar.py        # atualiza painel/index.html e imprime o resumo
```
Confere o cabeçalho de cada skill, se todas estão no mapa e se o mapa não cita o que não existe. Rode antes de cada commit que mexa em `skills/` ou `AGENCIA.md`.

Para adicionar uma skill: veja `templates/SKILL.template.md` e a seção "Como adicionar uma skill" em `AGENCIA.md`.
