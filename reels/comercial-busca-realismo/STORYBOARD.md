# Storyboard

Quadros extraídos do arquivo final, em `previews/` (JPEG 540×960).

| # | Arquivo | t | Beat |
|---|---|---|---|
| 01 | `previews/01-busca.jpg` | 2,6 s | Pinterest, busca sendo digitada, três sugestões sobre o feed escurecido |
| 02 | `previews/02-feed.jpg` | 5,0 s | Mosaico entrando pin por pin depois da busca |
| 03 | `previews/03-toque-pin.jpg` | 7,7 s | Toque no retrato de realismo (anel + ondulação) |
| 04 | `previews/04-pin.jpg` | 8,8 s | Detalhe do pin — sem fonte nem @ |
| 05 | `previews/05-recuo.jpg` | 11,0 s | Recuo: celular flutuando, pins orbitando, dock de vidro |
| 06 | `previews/06-dock.jpg` | 12,2 s | Toque no ícone do Instagram, anel aceso |
| 07 | `previews/07-troca.jpg` | 13,3 s | Gradiente do Instagram limpando a tela |
| 08 | `previews/08-busca-insta.jpg` | 14,4 s | Busca `andretatuadoor` |
| 09 | `previews/09-perfil.jpg` | 15,5 s | Perfil carregado: números reais, bio, link azul, destaques |
| 10 | `previews/10-perfil-rolando.jpg` | 18,0 s | Rolagem curta revelando a grade |
| 11 | `previews/11-link-azul.jpg` | 19,5 s | Toque no link da bio — acende em azul |
| 12 | `previews/12-folha.jpg` | 20,7 s | Folha `Agende sua sessão` / `Abrir conversa` |
| 13 | `previews/13-marca.jpg` | 23,0 s | `ANDRÉ TATTOO` + chamada |
| 14 | `previews/14-cta.jpg` | 24,2 s | `@andretatuadoor` |

Para gerar qualquer outro instante:
```bash
cd build && ONLY=6.2,13.4,21.8 node render.mjs
```

## Grade de segurança 9:16
- O arquivo é **1080×1920 (9:16)** do primeiro ao último quadro — formato de celular em pé, para Reels e Status. Não existe plano deitado.
- Margem lateral mínima: **110 px** (10,2 %).
- Zona segura do Reels: evitar os **250 px de baixo** (interface) e os **220 px de topo**. Todo texto de marca está entre `y=720` e `y=1360`.
- O aparelho ocupa 87 % da largura nos planos fechados e 55 % no plano aberto.
