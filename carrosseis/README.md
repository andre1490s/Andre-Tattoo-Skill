# Carrosséis editoriais — série "No estúdio"

Série de artigos em carrossel, no padrão visual de `contexto/marca.md`, com as tattoos do André como fundo. Mecânica de comment-gate definida em `PLANO-30-DIAS-INSTAGRAM.md` 3.6. Origem da tática: `aprendizados/LE-0009.md`.

## Como gerar

```
cd carrosseis/<pasta-do-artigo>
python3 -I ../_template/gerar.py config.json saida/
```

O gerador (`_template/gerar.py`) monta 6 slides 1080x1350 a partir do `config.json`. As fontes ficam em `_template/fontes/` (Playfair Display, Cormorant Garamond itálico, Inter).

## Regras do template

- Fundo: foto real da tattoo, neutralizada para preto e cinza, escurecida, com painel suave atrás da coluna de texto. **A tattoo nunca é redesenhada** — só tratamento de luz e cor, como manda `contexto/marca.md`.
- A neutralização de cor corrige de quebra dominantes de LED colorido no estúdio (o azul da foto da Têmis, por exemplo).
- Texto no canto superior esquerdo. Título em Playfair creme; a palavra entre `*asteriscos*` sai em cursiva dourada.
- Moldura dourada fina com cantos, selo `N/6`, rodapé centralizado `ANDRE TATTOO`.
- CTA de comment-gate só no primeiro e no último slide.
- Sem preço, sem promessa de resultado, sem escassez falsa.
- Material entregue no direct é real e útil, nunca isca vazia: cada artigo tem seu `artigo.md`.

## Artigos

| # | Tema | Palavra do gate | Status |
|---|---|---|---|
| 01 | Preto e cinza desbota com o tempo? | `TINTA` | pronto |
| 02 | Dá pra cobrir qualquer tatuagem? | `REFORMA` | a produzir |
| 03 | Quanto tempo leva um fechamento de braço? | `FECHAMENTO` | a produzir |
| 04 | Qual lugar do corpo dói mais (e por quê) | `DOR` | a produzir |
| 05 | Como escolher a referência de um retrato | `RETRATO` | a produzir |
| 06 | Cicatrização: o que fazer nos primeiros 15 dias | `CUIDADOS` | a produzir |

**Ritmo: um por semana.** Mais que isso vira ruído e queima a mecânica.

O 02 (`REFORMA`) é o de maior valor comercial: filtra quem já tem tatuagem ruim, público de maior ticket e decisão rápida.

## Operação de cada publicação

1. Publicar terça a sexta, 10h (pico do perfil).
2. Responder **todos** os comentários na primeira hora.
3. Enviar o artigo no direct no mesmo dia.
4. Registrar: comentários, salvamentos, compartilhamentos, alcance, seguidores ganhos.
5. Comparar com a linha de base: **0,5 comentário por reel** (`aprendizados/LE-0008.md`).
