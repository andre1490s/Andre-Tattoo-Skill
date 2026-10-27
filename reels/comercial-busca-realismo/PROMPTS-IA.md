# Prompts de geração — por cena

O MP4 entregue já está pronto para postar. Estes prompts servem para **substituir planos por versões live-action** quando quiser subir mais um degrau (Veo, Runway Gen-4, Kling, Luma). Cada bloco diz onde entra e como encaixar.

**Regras que valem para todos**
- Pedir sempre `9:16 vertical`, `shot on ARRI Alexa, 35mm`, `shallow depth of field`.
- **Nunca** pedir para a IA gerar ou reconstruir tatuagem. Onde a tatuagem aparece, o plano é gerado com a pele **limpa** ou com a tela **verde**, e a foto real entra por composição.
- Paleta: `deep graphite, charcoal black, off-white, single emerald green accent`.
- Negativos: `no text, no watermark, no logo, no tattoos, no skin markings, oversaturated, neon, plastic skin, warped hands, extra fingers`.

---

## Plano A — Mãos segurando o celular (substitui os planos fechados, 0–9,8 s e 12,7–21,2 s)
É o que mais eleva a produção. Gere **com a tela verde** e substitua pela captura do app.

> Two hands holding a modern black smartphone in portrait orientation, the screen is a flat solid green rectangle, soft studio key light from upper left with a subtle rim light, dark graphite background with gentle falloff, natural unmarked skin, hands steady with slow micro-drift, shallow depth of field, shot on ARRI Alexa 35mm, 9:16 vertical, cinematic commercial, no text, no tattoos, no jewelry.

Sem IA, mais rápido e 100 % real: filme você mesmo o celular de alguém exibindo um fundo verde chapado, luz de janela à esquerda, fundo escuro.

**Como encaixar:** chroma key no verde, coloque por baixo o trecho correspondente do MP4 com corner-pin nos quatro cantos da tela.

---

## Plano B — Revelação do aparelho flutuando (substitui 9,8–11,9 s)
O plano mais caro do filme. Se quiser em live-action:

> Slow orbit around a floating black smartphone in a dark graphite studio void, volumetric haze, single soft key from upper left plus a cold rim from the right, dust particles drifting through the beam, the screen is a flat solid green rectangle, product commercial lighting, anamorphic 35mm, 9:16 vertical, no text, no logo.

Os pins que orbitam continuam vindo do HTML — compostos por cima em `screen`/`normal`.

---

## Plano C — Tinta que resolve na assinatura (reforça 21,2–25,0 s)
> Black ink diffusing in clear water against a dark background, slow motion 240fps, the cloud expands and settles into stillness, a single emerald green light accent from the left edge, graphite and off-white palette, macro lens, 9:16 vertical, cinematic, no text.

**Como encaixar:** camada em `screen`/`lighten` a 25–35 % atrás do letreiro.

---

## Plano D — Partida de câmera (0,6 s como transição em 11,9 s)
> Rapid forward camera push through floating dust particles in a dark studio void, motion blur streaks, a single green light flare passing the lens, graphite black, anamorphic lens flare, 9:16 vertical, 0.6 seconds, no text.

---

## Placas de fundo (Nano Banana / Gemini 3 Pro Image / Midjourney)
> Empty dark photography studio, graphite grey seamless backdrop, a single soft overhead light pool on the floor, volumetric haze, no furniture, no people, no text, 9:16 vertical, cinematic still, muted neutral palette with one faint emerald reflection.

> Macro texture of matte black steel with fine brushed grain, dramatic raking light from the left, deep shadow on the right, 9:16 vertical, neutral graphite, no text.

---

## O que NÃO gerar
- Tatuagem, desenho na pele, stencil, "arte no estilo do André". A tatuagem no vídeo é sempre fotografia real.
- Rosto do André. Use a foto real (`site/img/estudio/andre-retrato.jpg`).
- Tela de Pinterest ou Instagram com número (seguidores, pins, salvos, nota). Nenhuma métrica aparece no filme e nenhuma deve ser inventada.
- Atribuição do pin a uma conta de Pinterest que não existe. O pin no filme não tem fonte, de propósito.
