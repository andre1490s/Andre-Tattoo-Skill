# Identidade das peças visuais

Padrão aprovado pelo André em 2026-10-27 (carrossel) e 2026-10-30 (story). Vale para **toda peça gráfica da marca**: carrossel, story, capa de destaque, arte de post, peça de anúncio. Fonte da marca: `contexto/marca.md`.

Gerador: `carrosseis/_template/gerar.py`. Uma peça é um `config.json`, nunca um arquivo montado à mão.

```
python3 -I carrosseis/_template/gerar.py config.json saida/
```

## Formatos

| Formato | Medida | Uso |
|---|---|---|
| `feed` | 1440 x 1800 (4:5) | carrossel e post |
| `story` | 1080 x 1920 (9:16) | story e destaque |

Saída sempre em alta resolução, com máscara de nitidez antes do tratamento, qualidade 96 e sem subamostragem de croma.

## Paleta

| Elemento | Cor |
|---|---|
| Fundo | `#0C0C0B` |
| Título e texto forte | creme `#EFE6D6` |
| Acento, moldura, etiqueta | dourado `#C9A250` |
| Corpo de texto | `#B2AA9E` |

## Tipografia

| Papel | Fonte |
|---|---|
| Título | Playfair Display Bold |
| Palavra de destaque no título | Cormorant Garamond Itálico, em dourado |
| Etiqueta e corpo | Inter |

A palavra entre `*asteriscos*` no campo `titulo` sai automaticamente em cursiva dourada. Uma por peça, no máximo duas.

## Estrutura

Etiqueta em caixa alta espaçada, título, filete dourado curto, corpo. Moldura dourada fina com cantos reforçados.

**Não entram na arte:** numeração de slide, assinatura no topo, assinatura no rodapé, caixa de CTA, CTA de comentário. O CTA de carrossel vive na legenda. No story, o caminho é o sticker de link, colado por cima da faixa inferior, que a peça já deixa livre de propósito.

## Tratamento da foto

A tattoo **nunca** é redesenhada. Só luz, cor e enquadramento.

1. Mistura de 70% com a versão em cinza, o que neutraliza dominantes de cor. Isso corrige de quebra o LED azul do estúdio.
2. Escurecimento conforme o campo `escuro`, mais contraste leve.
3. Tom quente sutil, imitando a luz lateral do padrão editorial.
4. Degradê que acompanha a posição do texto.

## Modo retrato (peça de alto padrão)

Campo `modo: "retrato"`. A foto ocupa o topo (`altura_foto`, padrão 0.66 da altura) e **morre no preto** a partir de 46% da própria altura. O texto vive no preto, sem disputar com a imagem.

É o modo certo quando a foto tem fundo bagunçado ou elementos que roubam atenção no pé: o enquadramento corta o problema e o resto some no escuro. Usa dessaturação mais forte (82%) e escurecimento mais leve (`escuro` por volta de 0.30), porque a foto já está protegida pelo corte.

## Numeral protagonista

Campo `numeral`, com `tam_numeral` por volta de 250. Renderiza o número em Playfair, bem grande, acima do título.

Serve para quando o número **é** a mensagem: vagas restantes, anos de profissão, número de sessões. Número grande lê em meio segundo numa tela de celular; número embutido na frase não lê. Um numeral por peça.

## Posição do texto

**Feed:** campo `posicao` com `sup-esq`, `inf-esq`, `sup-dir` ou `inf-dir`. Variar entre os slides para o carrossel não ficar repetitivo.

**Regra do enquadramento:** o campo `recorte: [cx, cy, largura]` dá zoom num detalhe da foto, em pixels da imagem original. O centro deve ser escolhido de modo que **o assunto caia no lado oposto ao bloco de texto**. Sem isso o texto senta em cima do desenho.

**Story:** texto sempre na faixa inferior, com a foto respirando em cima. O rodapé fica livre para o sticker de link. O degradê escurece a partir de 30% da altura.

## Regras de texto

Valem as de `contexto/marca.md`, com atenção a estas:

- Sem travessão e sem meia-risca, em nenhuma peça.
- Sem preço, nem "a partir de".
- Sem promessa de resultado.
- Sem escassez falsa. Urgência só quando a data é verdadeira.
- Nada que soe como desespero por agenda.
- Título curto. Corpo de no máximo três linhas em story.

## Gatilho de venda com escassez verdadeira

O story de agenda usa três fatos reais, nessa ordem:

1. **Quantidade concreta:** "Restam 4 finais de semana". Número exato, não "poucas vagas".
2. **Justificativa que também vende:** "Projeto grande ocupa o dia inteiro, então cada data fecha uma vez só". Explica a escassez e ao mesmo tempo posiciona o trabalho de ticket alto.
3. **Consequência, não ameaça:** "Quem fecha primeiro escolhe o dia". Urgência sem pressão.

Esse é o modelo para qualquer peça de agenda. Se o número não for verdadeiro, a peça não sai.
