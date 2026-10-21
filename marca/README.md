# Marca d'água Andre Tattoo

O "A" da logo recortado do fundo preto, com transparência de verdade (PNG com
canal alfa). Pode jogar por cima de qualquer foto que o fundo não aparece.

## Qual arquivo usar

| Arquivo | Para quê |
|---|---|
| `marca-dagua-branca.png` | **Pronta para usar** em foto escura (preto e cinza, pele morena, fundo escuro) |
| `marca-dagua-preta.png` | **Pronta para usar** em foto clara (pele clara, maca branca, luz forte) |
| `logo-a-branco.png` | O A todo branco, opacidade cheia. Use quando quiser escolher você mesmo a transparência |
| `logo-a-preto.png` | O mesmo, todo preto |
| `logo-a.png` | O A com os tons metálicos originais da logo, opacidade cheia |

As duas primeiras já saem com a transparência embutida (40% a branca, 30% a
preta), então é só colar e pronto. As três de baixo são os arquivos-mestre:
saem 100% opacos para você regular a transparência no app que usar.

## Como aplicar

1. Tamanho: deixe o A ocupando entre **18% e 22% da largura da foto**. Menor que
   isso ninguém vê, maior começa a competir com a tatuagem.
2. Posição: canto **inferior direito**, com uma margem de uns 5% da largura.
3. Se a foto for clara de um lado e escura do outro, escolha o canto pelo fundo,
   não pela composição.

No Instagram dá para fazer isso direto pelo Canva ou pelo app Marca d'Água.
No celular, o Snapseed também abre PNG com transparência.

## Resolução

O recorte sai com 539 x 696 pixels, que é o tamanho do original da logo que
temos. Dá e sobra para marca d'água: numa foto de 2000 pixels de largura, o A
em 20% fica com 400 pixels, abaixo do que o arquivo tem.

Se um dia você precisar da logo grande (camiseta, placa, adesivo), peça o
arquivo vetorial para quem desenhou a logo. Daí dá para ampliar sem limite.

## Como estes arquivos foram feitos

`scripts/marca-dagua.py` recria todos eles a partir da foto original da logo.
A logo é luz sobre fundo preto, então o canal de transparência sai da própria
luminância da imagem: onde é preto fica invisível, onde brilha fica sólido.
