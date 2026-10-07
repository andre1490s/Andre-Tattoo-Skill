# Agência André Tattoo

Sistema de skills para o estúdio André Tattoo (@andretatuadoor): conteúdo, vendas, operação, análise e aprendizado.

- **Mapa completo, rotinas e fronteiras entre skills:** [`AGENCIA.md`](AGENCIA.md)
- **Contexto de marca (fonte única de verdade):** [`contexto/marca.md`](contexto/marca.md)
- **Skills:** [`skills/`](skills/) (uma pasta por skill, com `SKILL.md`)
- **Memória de aprendizados:** [`aprendizados/`](aprendizados/)
- **Referências de edição aprovadas:** [`referencias/`](referencias/)

## Por onde começar
| Quero... | Use |
|---|---|
| decidir o que fazer primeiro | `cerebro-estrategico` |
| ideias de conteúdo e legendas | `diretor-conteudo-copy` |
| montar a edição de um Reels | `editor-videos-tattoo` (e `buscar-referencias-tattoo` para achar referências) |
| responder/fechar um lead | `closer-vendas` e `crm-followup` |
| criar uma oferta | `arquiteto-ofertas` |
| anúncios | `gestor-de-trafego` |
| entender números | `analista-metricas` e `gestor-financeiro` |
| auditar o perfil | `estrategista-instagram` |
| saber o que funcionou e por quê | `learning-engine` |
| ver quanto as skills gastam de tokens | `buscar-consumo-tokens` |

## Manutenção
```
python3 -I scripts/validar.py
```
Confere o cabeçalho de cada skill, se todas estão no mapa e se o mapa não cita o que não existe. Rode antes de cada commit que mexa em `skills/` ou `AGENCIA.md`.

Para adicionar uma skill: veja `templates/SKILL.template.md` e a seção "Como adicionar uma skill" em `AGENCIA.md`.
