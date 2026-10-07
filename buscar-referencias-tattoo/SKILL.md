---
name: buscar-referencias-tattoo
description: Use quando o Andre pedir para buscar, achar ou garimpar vídeos virais de tatuagem (Reels, TikTok, Shorts) para usar como referência de edição, ou disser "busca referências", "o que está viralizando em tattoo", "acha edições para eu seguir". Faz a busca, filtra o que realmente vale como referência, analisa a edição e entrega o DNA para a skill editor-videos-tattoo.
---

# SKILL: BUSCADOR DE REFERÊNCIAS DE EDIÇÃO (TATTOO)

## 1. FUNÇÃO

Encontrar vídeos de tatuagem com edição forte e transformá-los em referência utilizável para o André Tattoo.
O resultado final é sempre um **DNA de edição** (ver skill `editor-videos-tattoo`), não uma lista de links.

Prioridade: **edição aplicável ao estilo do André** (realismo preto e cinza, premium) > popularidade bruta.

## 2. HONESTIDADE SOBRE O QUE É POSSÍVEL (ler antes de prometer qualquer coisa)

Antes de buscar, verifique em que modo estamos:

| Modo | Condição | O que dá para fazer |
|---|---|---|
| **A. Descoberta** | só `WebSearch` funciona | achar contas, páginas, links e descrições. NÃO dá para ver o vídeo, nem métricas confiáveis. |
| **B. Análise completa** | rede liberada para a plataforma (ou o André envia o arquivo) | baixar/abrir o vídeo, rodar `scripts/analisar_cortes.sh`, extrair frames, montar a timeline com tempos reais. |
| **C. Análise assistida** | o André envia frames, gravação de tela ou descrição | analisar os frames enviados; tempos são "aprox.". |

Regras:
- Teste o acesso (uma busca e uma tentativa de abrir 1 link) antes de dizer em que modo está. Não presuma.
- Em ambiente de nuvem, TikTok e Instagram costumam estar bloqueados pela política de rede. Se `EGRESS_BLOCKED`, diga o domínio bloqueado e que o André pode liberar em *Network access* do ambiente. Siga com o que não depende disso.
- No modo A, entregue **candidatos a referência**, claramente marcados como "não analisados". Nunca descreva cortes, ritmo ou música de um vídeo que você não viu.
- Nunca invente visualizações, curtidas, datas ou nomes de música. Se o dado não apareceu na fonte, escreva "não disponível".
- Não faça login, não use contas de terceiros, não burle bloqueio. Só conteúdo público.

## 3. O QUE CONTA COMO "VIRAL"

Métrica pública é difícil de obter, então use **sinais**, e diga quais usou:

1. Visualizações muito acima do normal da conta (quando a fonte mostrar).
2. Aparece repetido em agregadores/curadorias de tattoo reels, listas "top" ou recomendações.
3. Formato replicado por vários criadores (sinal de tendência).
4. Comentários pedindo "como faz?" / "qual música?" (sinal de edição que chama atenção).
5. Conta com audiência grande no nicho **e** vídeo recente.

Marque cada candidato com a confiança: **alta** (métrica vista), **média** (vários sinais indiretos), **baixa** (só apareceu na busca).
Prefira conteúdo dos últimos 3–6 meses; tendência de edição envelhece rápido. Registre sempre a data da busca.

## 4. COMO BUSCAR

Rode várias buscas **em paralelo**, em português e inglês, e use `allowed_domains` para focar nas plataformas.

Banco de consultas (adapte ao pedido):
- Formato: `tattoo reel transition`, `stencil to tattoo transition`, `tattoo process time lapse reel`, `tattoo reveal reel`, `before after tattoo reel`, `healed tattoo reel`, `tattoo whip transition`, `tattoo beat sync edit`
- Nicho do André: `black and grey realism tattoo reel`, `realismo preto e cinza tatuagem reels`, `tatuagem realista processo reels`, `lion tattoo realism process`
- Brasil: `tatuador reels viral`, `tatuagem realismo reels`, `tattoo artist brasil reels`
- Plataformas: `site:instagram.com/reel tattoo`, `site:tiktok.com tattoo transition`, `site:youtube.com/shorts tattoo edit`
- Tendência: `tattoo content trends 2026`, `instagram reels tattoo artists what works`
- Contas-hub: curadorias de "best tattoo reels" servem para achar criadores, não como prova de viralização.

Fontes de vendedores (templates, apps de edição, sites de freelancer) **não são referência**: descarte.

## 5. FILTRO DE QUALIDADE (o que entra na lista)

Entra se atender a pelo menos 3:
- [ ] edição com intenção clara (corte na batida, match cut, whip, speed ramp, revelação construída)
- [ ] hook forte nos primeiros 2 s
- [ ] tattoo continua protagonista
- [ ] estética compatível com premium / preto e cinza (ou adaptável)
- [ ] reproduzível em CapCut sem plugin especial
- [ ] recente e/ou com sinais de tração

Descartar: efeitos aleatórios, filtros pesados, texto gigante, vídeo que só funciona por trend de áudio, conteúdo que exige copiar a identidade de outro criador.

## 6. ANÁLISE DE CADA REFERÊNCIA (Modo B ou C)

1. Se tiver o arquivo: `scripts/analisar_cortes.sh <video> [saida_dir] [limiar]` gera `timeline.md` (cortes e duração dos takes), frames e folha de contato.
   - A detecção é automática: zoom, speed ramp e whip contínuos podem não aparecer como corte. Conferir pela folha de contato e corrigir à mão.
2. Complete com a análise em camadas da skill `editor-videos-tattoo` (estrutura, timeline, transições, ritmo, áudio, texto, hook, payoff).
3. Marque como "provável" tudo que não puder confirmar.
4. Extraia o DNA e diga **o que é a lógica** e **o que não deve ser copiado** (identidade, música própria, marca, texto/arte do criador).

## 7. FORMATO DE ENTREGA

### 7.1 Relatório da busca
- Data da busca, modo (A/B/C), termos e domínios usados, o que ficou bloqueado.
- Tabela de candidatos:

| # | Link | Plataforma | Criador | Formato | Sinais de viralização | Confiança | Analisado? |
|---|---|---|---|---|---|---|---|

- Top 3 recomendados para o André, com 1 linha explicando por que combina com o estilo dele.

### 7.2 Ficha de referência (só para os analisados)
```
REFERÊNCIA <letra>
Nome do padrão:
Link / data de coleta:
Duração / nº de takes / take médio:
Estrutura:
Hook (0–2 s):
Transições:
Ritmo e música (BPM aprox., se conhecido):
Texto:
Payoff / CTA:
DNA (lista curta):
Como aplicar ao André Tattoo:
O que NÃO copiar:
Dificuldade no CapCut: (baixa/média/alta)
```

### 7.3 Próximo passo
Perguntar qual referência o André aprova. Ao aprovar, salvar a ficha em `referencias/<nome-do-padrao>.md` no repositório; o último aprovado vira o padrão do comando "faça nesse estilo".

## 8. DADOS PRÓPRIOS DO ANDRE

Quando houver Metricool/Windsor conectado, use o desempenho do perfil @andretatuadoor (retenção, alcance, melhores posts) para calibrar **qual referência escolher**: repetir o que já funcionou nele pesa mais que tendência genérica. Só leitura; não publique nem agende nada sem pedir.

## 9. CHECKLIST ANTES DE ENTREGAR

[ ] Informei o modo e o que ficou bloqueado?
[ ] Nenhuma métrica ou detalhe de edição foi inventado?
[ ] Cada candidato tem confiança e status "analisado/não analisado"?
[ ] Descartei fontes de vendedores e templates?
[ ] As recomendações combinam com realismo preto e cinza premium?
[ ] Deixei claro o que não copiar?
[ ] Existe próximo passo (aprovar → salvar em `referencias/`)?
