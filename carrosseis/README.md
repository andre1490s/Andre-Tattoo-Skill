# Carrosséis editoriais: série "No estúdio"

Série de artigos em carrossel, no padrão visual de `contexto/marca.md`, com as tattoos do André como fundo. Mecânica de comment-gate definida em `PLANO-30-DIAS-INSTAGRAM.md` 3.6. Origem da tática: `aprendizados/LE-0009.md`.

## Como gerar

```
cd carrosseis/<pasta-do-artigo>
python3 -I ../_template/gerar.py config.json saida/
```

O gerador (`_template/gerar.py`) monta 6 slides 1080x1350 a partir do `config.json`. As fontes ficam em `_template/fontes/` (Playfair Display, Cormorant Garamond itálico, Inter).

## Regras do template

- Fundo: foto real da tattoo, neutralizada para preto e cinza, escurecida, com painel suave atrás da coluna de texto. **A tattoo nunca é redesenhada**: só tratamento de luz e cor, como manda `contexto/marca.md`.
- A neutralização de cor corrige de quebra dominantes de LED colorido no estúdio (o azul da foto da Têmis, por exemplo).
- Texto no canto superior esquerdo. Título em Playfair creme; a palavra entre `*asteriscos*` sai em cursiva dourada.
- Moldura dourada fina com cantos, selo `N/6`, rodapé centralizado `ANDRE TATTOO`.
- CTA de comment-gate só no primeiro e no último slide.
- Sem preço, sem promessa de resultado, sem escassez falsa.
- Material entregue no direct é real e útil, nunca isca vazia: cada artigo tem seu `artigo.md`.

## Artigos

| # | Tema | Palavra do gate | Status |
|---|---|---|---|
| 01 | Preto e cinza desbota com o tempo? | `TINTA` | publicado |
| 02 | Os símbolos do portal energético | `PORTAL` | pronto |
| 03 | Dá pra cobrir qualquer tatuagem? | `REFORMA` | a produzir |
| 04 | Quanto tempo leva um fechamento de braço? | `FECHAMENTO` | a produzir |
| 05 | Qual lugar do corpo dói mais (e por quê) | `DOR` | a produzir |
| 06 | Como escolher a referência de um retrato | `RETRATO` | a produzir |
| 07 | Cicatrização: o que fazer nos primeiros 15 dias | `CUIDADOS` | a produzir |

**Ritmo: um por semana.** Mais que isso vira ruído e queima a mecânica.

O `REFORMA` é o de maior valor comercial: filtra quem já tem tatuagem ruim, público de maior ticket e decisão rápida.

## Operação de cada publicação

1. Publicar terça a sexta, 10h (pico do perfil).
2. Responder **todos** os comentários na primeira hora.
3. Enviar o artigo no direct no mesmo dia.
4. Registrar: comentários, salvamentos, compartilhamentos, alcance, seguidores ganhos.
5. Comparar com a linha de base: **0,5 comentário por reel** (`aprendizados/LE-0008.md`).

## Recursos do gerador (v2)

- **Saída 1440x1800**, alta resolução, com máscara de nitidez antes do tratamento.
- **`recorte: [cx, cy, largura]`** em pixels da foto original, para dar zoom num detalhe. É assim que o carrossel 02 explica símbolo por símbolo dentro da mesma peça.
- **`posicao`**: `sup-esq`, `inf-esq`, `sup-dir`, `inf-dir`. O degradê de escurecimento acompanha o bloco de texto, e o recorte deve ser centrado de modo que o símbolo caia no lado **oposto** ao texto.
- Variar a posição entre os slides evita que o carrossel fique repetitivo.
