# Marca d'água Andre Tattoo

A logo recortada do fundo preto, com transparência de verdade (PNG com canal
alfa). Pode jogar por cima de qualquer foto que o fundo não aparece.

São duas famílias: **`-a-`** é só o emblema do A, **`-completa-`** é a logo
inteira, com o nome ANDRÉ TATTOO embaixo.

## Prontas para usar

Já saem com a transparência embutida (40% as brancas, 30% as pretas). É só
colar na foto.

| Arquivo | Quando usar |
|---|---|
| `marca-dagua-completa-branca.png` | Logo inteira, foto escura |
| `marca-dagua-completa-preta.png` | Logo inteira, foto clara |
| `marca-dagua-a-branca.png` | Só o A, foto escura |
| `marca-dagua-a-preta.png` | Só o A, foto clara |

Use a **completa** quando a marca d'água for o único lugar onde seu nome
aparece (foto solta, print, story sem legenda). Use **só o A** quando seu nome
já estiver no post, porque aí a logo inteira fica repetitiva e rouba espaço da
tatuagem.

## Arquivos-mestre

Saem 100% opacos, para você mesmo regular a transparência no app que usar.

`logo-completa.png`, `logo-completa-branco.png`, `logo-completa-preto.png`
`logo-a.png`, `logo-a-branco.png`, `logo-a-preto.png`

As versões `-branco` e `-preto` são a logo chapada numa cor só. As sem sufixo
mantêm os tons metálicos do original.

## Como aplicar

1. Tamanho: a marca ocupando entre **18% e 22% da largura da foto**. Menor que
   isso ninguém vê, maior começa a competir com a tatuagem.
2. Posição: canto **inferior direito**, margem de uns 5% da largura.
3. Branca ou preta se escolhe pelo fundo **daquele canto**, não pela foto
   inteira. Canto escuro pede branca, canto claro pede preta.

No celular, o Canva e o Snapseed abrem PNG com transparência.

## Resolução

O A sai com 539 x 696 pixels e a logo completa com 699 x 946. É o que o
original da logo que temos aqui permite. Para marca d'água sobra: numa foto de
2000 pixels de largura, a marca em 20% fica com 400 pixels.

Se precisar da logo grande (camiseta, placa, adesivo), peça o arquivo vetorial
para quem desenhou a logo. Daí amplia sem limite.

## Como estes arquivos foram feitos

`scripts/marca-dagua.py` recria todos eles a partir da foto original da logo.
A logo é luz sobre fundo preto, então o canal de transparência sai da própria
luminância: onde é preto fica invisível, onde brilha fica sólido. Rode o script
de novo se quiser outra opacidade.
