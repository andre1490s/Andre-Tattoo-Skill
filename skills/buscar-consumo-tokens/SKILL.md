---
name: buscar-consumo-tokens
description: Use quando o Andre pedir para buscar, medir ou conferir quanto o sistema gasta de tokens do Claude: quais skills pesam mais, quanto custa uma rotina, onde um termo se repete, onde dá para enxugar sem perder qualidade.
---

# SKILL: BUSCADOR DE CONSUMO DE TOKENS

## 1. Função
Medir e localizar onde as skills do repositório ocupam espaço no contexto do Claude, e propor cortes seguros.
**Não faz:** alterar skill (só propõe; o OK é do André), medir o uso real da conta ou do plano, converter em dinheiro.

## 2. Entradas
Basta o pedido do André. Sem detalhe, rode o resumo do repositório inteiro. Opcionais: nome de uma skill, uma rotina (semanal, mensal...) ou um termo para buscar.

## 3. Passos
1. Escolha o modo pelo pedido (comando base: `python3 -I skills/buscar-consumo-tokens/scripts/contar_tokens.py`):

| O André quer saber | Opção |
|---|---|
| visão geral, quais skills pesam mais | (sem opção) |
| quanto custa uma skill específica | `--skill NOME` |
| quanto custa a rotina semanal, mensal... | `--rotina [NOME]` |
| onde um assunto se repete (ex.: "preço") | `--buscar TERMO` |
| quais arquivos são os maiores | `--arquivos` |

2. Rode o script e leia a tabela inteira antes de concluir.
3. Procure os 3 maiores ganhos. Cortes seguros, em ordem:
   - regra repetida em várias skills que já está no arquivo de contexto da marca (regra 2 do mapa da agência);
   - exemplo ou texto longo que só serve em um caso raro: pode virar arquivo separado, lido só quando precisar;
   - descrição acima de 600 caracteres (o validador avisa).
4. Estime o ganho em tokens (antes − depois) e o risco de cada corte.
5. Se o script não rodar (sem Python, fora do repositório), diga isso e estime por tamanho do arquivo, marcando "estimativa grosseira".

## 4. Saída
1. **Resumo em 2 linhas:** custo fixo (descrições) e a skill ou rotina mais pesada.
2. **Tabela do script**, só as linhas que respondem ao pedido.
3. **Onde dá para economizar** (máx. 3): o quê, ganho estimado, risco.
4. **Margem:** "estimativa, ±25%, não é a contagem oficial".

Linguagem simples, sem jargão técnico além de "token" e "contexto".

## 5. Handoff
Propostas de corte aprovadas pelo André → `learning-engine`, que registra a melhoria e acompanha se a skill continuou funcionando. Nenhuma skill muda sem o OK dele.

## 6. Limites e honestidade
- O número é **estimativa** por caracteres (÷ 3,2). Português, acentos e markdown tokenizam diferente do inglês; a margem é de ±25%.
- Mede o que **está no repositório**. Não vê skills que só existem no Claude.ai, nem imagens, vídeos ou PDFs.
- "Arquivos que manda ler" = arquivos `.md` citados no corpo da skill. Citar não é ler: se o número parecer alto demais, confira no texto da skill antes de propor corte.
- A conversa em si (mensagens do André, dados colados, respostas) fica fora da conta, e conversas longas pesam mais porque o histórico é relido.
- Contagem exata exige a API de contagem de tokens da Anthropic com chave de API. Não há chave configurada: [confirmar] se o André quiser esse nível.
- Não converter tokens em reais nem em "% do limite do plano": o limite não é visível daqui. Nunca inventar preço.
- **Nunca propor cortar:** limites e honestidade (seção 6 das skills), regra de preço final só do André, confirmação antes de ação externa, checklists.

## 7. Checklist final
[ ] rodei o script (ou avisei que não deu) e li a tabela inteira
[ ] números vêm do script, não de memória
[ ] marquei como estimativa, com a margem
[ ] cada proposta tem ganho em tokens e risco
[ ] não propus cortar regra de honestidade, preço ou confirmação
[ ] não alterei nenhuma skill
