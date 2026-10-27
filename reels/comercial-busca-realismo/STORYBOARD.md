# Storyboard

Quadros-chave em `previews/` (JPEG 1080×1920), um por beat.

| # | Arquivo | t | Beat |
|---|---|---|---|
| 01 | `previews/t2_6.jpg` | 2,6 s | Pinterest, busca sendo digitada, três sugestões |
| 02 | `previews/t5.jpg` | 5,0 s | Mosaico entrando, pin por pin |
| 03 | `previews/t7_75.jpg` | 7,75 s | Toque no retrato de realismo (anel + ondulação) |
| 04 | `previews/t8_8.jpg` | 8,8 s | Detalhe do pin — fonte `andretattoo.ink` |
| 05 | `previews/t11.jpg` | 11,0 s | Recuo: celular flutuando, pins orbitando, dock de vidro |
| 06 | `previews/t12_2.jpg` | 12,2 s | Toque no ícone do Instagram, anel aceso |
| 07 | `previews/t15_25.jpg` | 15,25 s | Busca `andretattoo.ink`, resultado, toque |
| 08 | `previews/t17_2.jpg` | 17,2 s | Perfil carregado com a grade real |
| 09 | `previews/t19_45.jpg` | 19,45 s | Link da bio aceso em verde |
| 10 | `previews/t20_4.jpg` | 20,4 s | Folha `Agende sua sessão` |
| 11 | `previews/t22_9.jpg` | 22,9 s | `ANDRÉ TATTOO` + chamada |

Para gerar qualquer outro instante:
```bash
cd build && ONLY=6.2,13.4,21.8 node render.mjs
```

## Grade de segurança 9:16
- Margem lateral mínima: **110 px** (10,2 %).
- Zona segura do Reels: evitar os **250 px de baixo** (interface) e os **220 px de topo**. Todo texto de marca está entre `y=720` e `y=1360`.
- Ponto focal: `y≈760` no Pinterest (campo de busca), `y≈960` no recuo, `y≈500` no perfil. As trocas são graduais — sem salto de olhar.
- O aparelho ocupa 87 % da largura nos planos fechados e 55 % no plano aberto.
