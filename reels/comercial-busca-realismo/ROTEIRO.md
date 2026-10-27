# Roteiro — "Busca" | André Tattoo
**Formato:** 9:16 · 1080×1920 · 30 fps · **25,0 s** · Reels e Stories
**Premissa:** alguém procura tatuagem de realismo no Pinterest, encontra um trabalho do André, vai até o Instagram dele e toca no link da bio. Nada de número inventado, nada de preço.

**Perfil de destino:** `@andretatuadoor` (confirmado pelo André em 27/10/2026, igual a `contexto/marca.md`).

O aparelho é o personagem: a câmera começa colada na tela, recua e revela o celular flutuando no escuro, e volta a entrar. A troca de app é a dobradiça do filme — o mundo claro do Pinterest vira o mundo escuro da marca.

## Decupagem

| # | In–Out | Dur | Cena | O que acontece | Câmera | Tela |
|---|---|---|---|---|---|---|
| 01 | 0,00–3,40 | 3,40 | **A busca** | Pinterest aberto. O campo é digitado letra a letra; três sugestões sobem embaixo. Cursor vermelho piscando. | Colada na tela (escala 1,58) | Pinterest claro |
| 02 | 3,40–4,15 | 0,75 | **Enter** | A sugestão acende, flash curto, spinner vermelho do Pinterest. | Estática | branco |
| 03 | 4,15–7,45 | 3,30 | **Os resultados** | O mosaico em duas colunas entra escalonado, pin por pin, com as **tatuagens reais** do André. Rolagem contínua de 430 px. | Estática | Pinterest |
| 04 | 7,45–9,80 | 2,35 | **O pin** | Toque num retrato de realismo. O detalhe sobe cobrindo a tela: foto grande, título e a linha `Tatuagem · realismo · braço`. **Sem fonte e sem @** — a marca só aparece quando o filme chega no Instagram. | Estática | detalhe do pin |
| 05 | 9,80–11,90 | 2,10 | **O recuo** | A câmera abre e revela o celular flutuando no vazio grafite, com luz de estúdio e reflexo varrendo o vidro. Dez pins descolam da tela e orbitam o aparelho em 3D. Um dock de vidro sobe por baixo. | Recuo 1,58 → 0,95, giro Y −13° | — |
| 06 | 11,90–12,70 | 0,80 | **Troca de app** | Toque no ícone do Instagram. O ícone pulsa, o anel acende e o gradiente inunda a tela. Flash. | Estática | gradiente |
| 07 | 12,70–15,45 | 2,75 | **Achando o perfil** | Câmera volta a entrar. Instagram escuro. Digita `andretattoo.ink`. O resultado aparece com avatar e nome. Toque. | Aproximação 0,95 → 1,58 | Instagram |
| 08 | 15,45–19,20 | 3,75 | **O perfil** | Carrega: avatar com anel verde, André Tattoo, Tatuador · São Paulo, bio, link e a grade com os trabalhos reais. Rolagem curta. | Colada | Instagram |
| 09 | 19,20–21,20 | 2,00 | **O link da bio** | Toque no link. A linha acende em verde. A folha sobe: `andretattoo.netlify.app` → **Agende sua sessão** → `Abrir conversa`. | Colada | Instagram |
| 10 | 21,20–25,00 | 3,80 | **Marca** | O aparelho recua, desfoca e some. Textura de tatuagem desfocada ao fundo. Letreiro, fio verde, chamada e o @. Fade a preto. | Saída 1,58 → 0,52 | — |

### Textos em tela
- Busca Pinterest: `tatuagem realismo preto e cinza sp`
- Sugestões: `tatuagem realismo **preto e cinza**` · `tatuagem realismo **braço fechado**` · `tatuador realismo **são paulo**`
- Pin: `Realismo preto e cinza em São Paulo` · `Tatuagem · realismo · braço` (sem fonte)
- Busca Instagram: `andretatuadoor`
- Bio: `Realismo preto e cinza. / Projetos sob medida, agenda por mensagem.`
- Folha: `Agende sua sessão` · `Abrir conversa`
- Fecho: `ANDRÉ TATTOO` / `REALISMO PRETO E CINZA · SÃO PAULO` / `Seu próximo projeto começa aqui.` / `@andretatuadoor`

## Decisões de direção
- **Nenhum número.** Sem seguidores, publicações, avaliação, "+X clientes", posição em ranking. O perfil mostra identidade, bio e trabalho — nada que eu não possa comprovar.
- **Pinterest não leva o nome.** O pin não mostra fonte nem @, porque o André não mantém conta lá. A cena é o gatilho da busca, não uma afirmação de que ele está no Pinterest. Se ele abrir conta um dia, a atribuição pode voltar (`#pdet .src` em `build/cena.html`).
- **Verde é acento, nunca bloco.** Anel do avatar, link aceso, botão da folha, fio da assinatura, ponto do @. Soma menos de 2 % da área do quadro. Pinterest mantém o vermelho dele e o Instagram o gradiente dele — misturar a marca do André nessas telas quebraria a verossimilhança.
- **Claro → escuro.** O Pinterest ilumina o ambiente (há um halo de luz da tela no fundo). Quando o app troca, a luz morre e sobra o grafite da marca. A troca de temperatura é o que faz a chegada ao perfil parecer "chegar em casa".
- **A tatuagem nunca é alterada.** As fotos passam só por corte uniforme (sem deformar), reescala Lanczos e um grade global de contraste/saturação. Nenhum pixel de desenho, anatomia ou traço é gerado ou recomposto por IA.
- **Ritmo de Reels.** Em 1,2 s o espectador já lê a busca. O pico de energia é o recuo em 9,8 s. O clímax é o toque no link.
- **Sem locução.** Funciona no mudo, que é como a maioria assiste.
