---
name: publicar-shorts-youtube
description: Use quando o Andre tiver um Short pronto e precisar do pacote de publicacao no YouTube (titulo, descricao, hashtags, frame de capa, comentario fixo, horario e playlist).
---

> Contexto global da marca (tom, sinal, precos, estudio): `contexto/marca.md`. Em caso de divergencia, vale o `contexto/marca.md`.
> Montagem do canal: `youtube/SETUP-CANAL.md` · Cadencia e horarios: `youtube/CALENDARIO-90-DIAS.md`

# SKILL: PACOTE DE PUBLICACAO DE SHORT

## 1. Funcao
Produzir tudo o que vai nos campos do upload, pronto para copiar e colar.

Faz: titulo, descricao, hashtags, escolha do frame de capa, comentario fixo, horario, playlist e as configuracoes do upload.
Nao faz: roteiro (`roteiro-shorts-youtube`), edicao (`editor-videos-tattoo`), legenda de Instagram (`legenda-tattoo`), agendamento no Metricool (`posts-semana-instagram`).

## 2. Entradas
Minimo: o que o Short mostra (peca, estilo, regiao do corpo) e o formato usado.
Padroes assumidos: idioma portugues (Brasil), nao feito para criancas, comentarios ativos, publico cliente, playlist conforme o estilo.

## 3. Passos
1. **Titulo** — 40 a 60 caracteres, a palavra que se busca na frente, sem clickbait:
   - bom: `Cobertura de tatuagem antiga em preto e cinza`
   - ruim: `OLHA O QUE EU FIZ 😱 #viral`
   O titulo serve para busca e recomendacao; o gancho visual e que decide o feed. `[hipotese]` sobre o peso exato do titulo no alcance de Shorts.
2. **Descricao** — 2 a 4 linhas: o que e a peca, o significado ou a tecnica em meia linha, a cidade (`realismo preto e cinza em Sao Paulo`), o link de agendamento e, quando existir, o apontador para a sessao completa no canal. **Nunca preco.**
3. **Hashtags** — `#shorts` + 2 a 4 especificas (`#realismo`, `#tatuagem`, `#coverup`, `#blackandgrey`). Nao empilhar 20.
4. **Frame de capa** — indicar o segundo exato do frame mais forte (normalmente a revelacao). `[confirmar]` se a conta ja permite enviar capa propria em Short; se nao, escolher o frame.
5. **Comentario fixo** — uma linha com CTA sem preco, do tipo: "Projeto em preto e cinza, feito em Sao Paulo. Orcamento pelo link do canal."
6. **Horario** — conforme a fase do calendario (2/dia: 12h e 19h · 3/dia: 8h, 13h, 20h), com no minimo 4 h entre Shorts.
7. **Playlist** — conforme o estilo (`youtube/SETUP-CANAL.md`).
8. **Conferir os bloqueios** antes de subir: sem marca d'agua de TikTok ou de modelo do CapCut, sem musica comercial em video que deve monetizar, sem cliente identificavel sem autorizacao, sem imagem grafica demorada.

## 4. Saida
```
SHORT: <nome>
Titulo: <...>
Descricao:
<...>
Hashtags: #shorts <...>
Capa: frame em <0:0X> (<descricao>)
Comentario fixo: <...>
Horario sugerido: <data e hora>
Playlist: <...>
Config: nao feito para criancas · idioma pt-BR · comentarios ativos
Bloqueios conferidos: marca d'agua [ ] musica [ ] cliente [ ] imagem grafica [ ]
```

## 5. Handoff
→ publicacao manual pelo Andre (nenhuma skill publica sozinha: regra 5 do `AGENCIA.md`).
Depois de 48 h → `metricas-shorts-youtube`.

## 6. Limites e honestidade
- **Nao publico nada.** Entrego o pacote pronto; subir e decisao do Andre.
- Marca d'agua de outra plataforma e um dos riscos mais concretos de perda de alcance e de reprovacao por conteudo reutilizado: barrar sempre.
- Nao prometer posicao em busca nem numero de views.
- Preco nunca, em nenhum campo, nem "a partir de" (`contexto/marca.md`).

## 7. Checklist final
[ ] Titulo com a palavra de busca na frente, sem clickbait
[ ] Descricao com cidade e link, sem preco
[ ] `#shorts` presente
[ ] Frame de capa escolhido
[ ] Comentario fixo pronto
[ ] Quatro bloqueios conferidos
