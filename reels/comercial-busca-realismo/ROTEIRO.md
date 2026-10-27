# Roteiro — "Busca" | André Tattoo
**Formato:** 9:16 · 1080×1920 · 30 fps · **24,0 s** · Reels e Stories
**Premissa:** alguém procura tatuagem de realismo no Pinterest, encontra um trabalho do André, vai até o Instagram dele e toca no link da bio.

**Perfil de destino:** `@andretatuadoor`.

O aparelho é o personagem: a câmera começa colada na tela, chicoteia para fora e revela o celular flutuando no escuro, e volta a entrar. A troca de app é a dobradiça do filme — o mundo claro do Pinterest vira o grafite da marca.

## Decupagem

| # | In–Out | Dur | Cena | O que acontece | Câmera | Tela |
|---|---|---|---|---|---|---|
| 01 | 0,00–2,40 | 2,40 | **A busca** | Feed do Pinterest já cheio das tattoos dele no primeiro quadro. O campo é digitado; três sugestões sobem e escurecem o feed. | Colada (1,58) | Pinterest claro |
| 02 | 2,40–2,95 | 0,55 | **Enter** | Sugestão acende, flash de 2 quadros, **zoom punch** de 10 %, spinner vermelho. | Punch | branco |
| 03 | 2,95–5,70 | 2,75 | **Os resultados** | Mosaico volta em cascata rápida (35 ms por pin) e rola 430 px. | Estática | Pinterest |
| 04 | 5,70–7,70 | 2,00 | **O pin** | Toque num retrato de realismo + **punch** de 9 %. O detalhe sobe: foto grande, título, `Tatuagem · realismo · braço`. Sem fonte e sem @. | Punch | detalhe |
| 05 | 7,70–9,30 | 1,60 | **Whip pan + recuo** | A câmera **chicoteia 620 px para a direita** com blur direcional e abre, revelando o celular flutuando. Dez pins descolam da tela e orbitam. | Whip → 0,95 | — |
| 06 | 9,30–10,40 | 1,10 | **Dock** | Dock de vidro sobe, cursor toca o ícone do Instagram. Riser de 1,05 s sobe junto. | Estática | — |
| 07 | 10,40–11,30 | 0,90 | **ESTOURO** | O ícone explode em **gradiente de tela cheia** com o glifo da câmera gigante. Flash branco, sub de 88 Hz, **punch de 22 %**, e a câmera **chicoteia de volta** 560 px pela esquerda. | Punch + whip | gradiente |
| 08 | 11,30–13,70 | 2,40 | **Achando o perfil** | Instagram escuro. Digita `andretatuadoor` em 1,07 s. Resultado com avatar e nome. Toque. | 0,95 → 1,58 | Instagram |
| 09 | 13,70–16,90 | 3,20 | **O perfil** | Entra com **punch** de 7 %: avatar real, nome, números, bio, link azul, destaques com o monograma, grade. Rolagem de 130 px. | Punch | Instagram |
| 10 | 16,90–19,40 | 2,50 | **O LINK** | **Spotlight**: o perfil inteiro escurece menos o link, que cresce 14 % e acende em azul. Uma **elipse verde é traçada à mão** em volta dele. Seta pulsa e entra `O LINK ESTÁ AQUI`. Então o toque. | Estática | Instagram |
| 11 | 19,40–20,90 | 1,50 | **A conversa** | Folha sobe: `andretattoo.netlify.app` → **Agende sua sessão** → `Abrir conversa`. | Estática | Instagram |
| 12 | 20,90–24,00 | 3,10 | **A LOGO** | O aparelho sai desfocado. A **logo do André em branco** entra com punch, flash e rotação. Halo verde se abre em volta. Depois `ANDRÉ TATTOO`, a chamada e o `@`. | Saída 0,42 | — |

### Textos em tela
- Busca Pinterest: `tatuagem realismo preto e cinza sp`
- Sugestões: `tatuagem realismo **preto e cinza**` · `tatuagem realismo **braço fechado**` · `tatuador realismo **são paulo**`
- Pin: `Realismo preto e cinza em São Paulo` · `Tatuagem · realismo · braço` (sem fonte)
- Busca Instagram: `andretatuadoor`
- Destaque: `O LINK ESTÁ AQUI`
- Folha: `Agende sua sessão` · `Abrir conversa`
- Fecho: logo · `ANDRÉ TATTOO` · `REALISMO PRETO E CINZA · SÃO PAULO` · `Seu próximo projeto começa aqui.` · `@andretatuadoor`

## Gramática de corte
Três técnicas, cada uma usada o mínimo necessário — efeito repetido vira filtro.

- **Whip pan (2 usos).** Blur **direcional** de verdade, via filtro SVG `feGaussianBlur stdDeviation="N 0"`, que borra só no eixo X. Blur circular entrega o truque. A direção é coerente: sai pela direita em 8,5 s (720 px), volta pela esquerda em 11,0 s (660 px). Duração de 0,32 s cada — curto e seco.
- **Zoom punch (4 usos).** Estouro curto de escala, 0,09 s subindo e 0,20 s voltando. **Cada um tem um impacto sonoro no mesmo quadro** — sem isso a mudança parece arbitrária, não causada.
- **Spotlight (1 uso).** Reservado para o link, que é o único lugar onde o filme pede uma ação.

Corte de pausa, não de conteúdo: a digitação do Pinterest caiu de 2,65 s para 1,75 s e nenhum plano passa de 3,2 s, mas nenhuma cena foi removida. São 12 beats em 24 s.

**Marcas de terceiros.** Os ícones do Pinterest e do Instagram são os oficiais, recortados da imagem de referência do André — não versões desenhadas. Um ícone redesenhado fica torto e o espectador percebe, mesmo sem saber o que incomodou.

## Decisões de direção
- **Nenhum número inventado.** Os do perfil (1.248 posts, 11 mil seguidores, 1.025 seguindo) são os reais, do print do André. Eles datam o filme — se preferir uma peça que não envelhece, a linha de números sai de `build/cena.html`.
- **Verde é acento, nunca bloco.** Anel do avatar, elipse do link, seta, halo da logo, fio da assinatura, ponto do @. Menos de 2 % da área do quadro. Pinterest mantém o vermelho dele e o Instagram o gradiente dele — misturar a marca do André nessas telas quebraria a verossimilhança.
- **Claro → escuro.** O Pinterest ilumina o ambiente; quando o app troca, a luz morre e sobra o grafite da marca.
- **A tatuagem nunca é alterada.** Corte uniforme, reescala Lanczos e grade global. Nenhum pixel de desenho, anatomia ou traço é gerado ou recomposto por IA.
- **Sem locução.** Funciona no mudo.
