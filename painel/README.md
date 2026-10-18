# Painel da Agência

Um lugar só para ver o que os agentes fizeram, o que está parado esperando você e como o mês está indo.
O painel é um arquivo HTML gerado a partir de arquivos de texto — não depende de internet, login nem servidor.

```
painel/
  index.html            o painel (abrir no navegador; gerado, não editar na mão)
  gerar.py              lê dados/ e escreve index.html + resumo no terminal
  registrar.py          grava o que aconteceu (agentes e você usam este)
  dados/
    estado.json         metas, prazos e lista de conexões (editável na mão)
    execucoes.jsonl     uma linha por tarefa de agente
    metricas.jsonl      uma linha por número informado
```

## Ver o painel
```
python3 -I painel/gerar.py          # atualiza o HTML e imprime o resumo
python3 -I painel/gerar.py --resumo # só o resumo, sem mexer no HTML
```
Depois é só abrir `painel/index.html` (duplo clique, ou no GitHub baixar o arquivo).
No chat, basta pedir **"abrir o painel"** que eu rodo e te leio o resumo.

## Alimentar o painel

**O que um agente fez** (todo agente faz isso ao terminar uma tarefa):
```
python3 -I painel/registrar.py execucao \
  --agente financeiro \
  --acao "Fechamento de setembro" \
  --status entregue \
  --saida "painel/saidas/financeiro-2026-09.md" \
  --proximo-passo "André confirmar gasto de material"
```
- `--agente`: `carrossel`, `editor-video`, `financeiro`, `marketing`, `vendas` (ou `andre`, `claude`).
- `--status`: `entregue` · `aguardando-andre` (precisa de decisão sua) · `travado` (falta dado ou acesso).
- Tudo com `aguardando-andre` ou `travado` aparece no bloco **"Aguardando você"**.

**Números do estúdio:**
```
python3 -I painel/registrar.py metrica --categoria financeiro --periodo 2026-10 \
  --fonte "app Caixa" entradas_mes=12500 custos_mes=3100 tattoos_mes=9 horas_mes=42

python3 -I painel/registrar.py metrica --categoria funil --periodo 2026-W42 \
  --fonte "app Caixa" leads=22 orcamentos=14 sinais=6 agendados=5

python3 -I painel/registrar.py metrica --categoria instagram --periodo 2026-W42 \
  --fonte Metricool alcance=8200 posts=4 interacoes=310 seguidores=1240 dms=12

python3 -I painel/registrar.py metrica --categoria youtube --periodo 2026-10 \
  --fonte "YouTube Studio" inscritos=180 views_shorts_90d=240000 horas_12m=65 shorts_publicados=22
```
Período: `2026-10` para mês, `2026-W42` para semana. Informar o mesmo período duas vezes não duplica:
vale sempre o último valor, então dá para corrigir um número só repetindo o comando.

### Chaves que o painel entende
| categoria | chaves | vira o quê no painel |
|---|---|---|
| `financeiro` | `entradas_mes`, `custos_mes`, `sinais_mes`, `tattoos_mes`, `horas_mes` | entradas x meta, lucro, ticket médio, receita por hora, gráfico de meses |
| `funil` | `leads`, `orcamentos`, `sinais`, `agendados`, `perdidos` | funil e conversão lead → agendado |
| `instagram` | `alcance`, `seguidores`, `posts`, `interacoes`, `visitas_perfil`, `dms` | card de posts e linha de alcance |
| `youtube` | `inscritos`, `views_shorts_90d`, `horas_12m`, `shorts_publicados` | régua do YPP e prazo de 31/01/2027 |

Chave nova não quebra nada: entra no arquivo com um aviso e fica guardada para quando virar bloco no painel.

## Metas e conexões
`dados/estado.json` guarda a meta do mês (hoje R$ 20.000, igual ao `contexto/marca.md`), as metas da semana,
o prazo do YPP e a lista de conexões com status (`ligada`, `instavel`, `manual`, `fora do ar`).
Mudou a meta ou entrou uma ferramenta nova: edite esse arquivo e rode `gerar.py`.

## Regras
- **Sem dado de cliente** (nome, telefone, foto, conversa) — só números e padrões. Regra 6 do `AGENCIA.md`.
- O painel **mostra**, não decide. Quem decide prioridade é o `cerebro-estrategico`; quem interpreta número é o `analista-metricas`.
- `index.html` é gerado: para mudar o visual, mexa em `gerar.py` e gere de novo.

## Rotina sugerida
- **Segunda:** lançar os números da semana (funil + Instagram), rodar o painel, olhar "Aguardando você".
- **Todo dia 1º:** lançar `entradas_mes`, `custos_mes`, `tattoos_mes`, `horas_mes` do mês fechado.
- **Quando bater o olho e algo estiver vermelho:** pedir o agente responsável por aquele bloco.
