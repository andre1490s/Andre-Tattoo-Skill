# Registro da skill arte-post-gemini

Memória da skill `arte-post-gemini`: o que o Gemini acertou e errou em cada foto. A skill lê este arquivo antes de montar cada prompt.
Sem nome nem dado de cliente: só o tema da tattoo e o aprendizado.

## Ajustes do prompt
Mudanças no modelo do prompt. Só entram como "Aprovado" com OK do André; a partir daí a skill aplica sempre.

| Data | Ajuste | Motivo (vezes visto) | Status |
|---|---|---|---|
| 2026-10-09 | Rodapé só com "ANDRE TATTOO"; tirar a linha de estilo (ex.: "FINE LINE") | preferência do André após a arte do lírio | Aprovado |
| 2026-10-09 | Texto no canto superior esquerdo como padrão do feed; se faltar espaço, afastar o enquadramento estendendo o fundo | funcionou no lírio; padroniza o grid | Aprovado |
| 2026-10-09 | Modo INTENSO para peças agressivas (preto-carvão, fumaça, luz dura de claro-escuro, ar masculino), mesma tipografia do modo delicado | pedido do André | Aprovado |
| 2026-10-09 | API do Gemini sem cota grátis para imagem (429, limit 0 em 2.5-flash-image, 3.1-flash-image, 3.1-flash-lite-image); a chave via segredo de rede funcionou | teste direto (1x) | Fato registrado |

## Significados
Elemento → significado usado na arte. Reutilizar para manter coerência entre posts.

| Elemento | Título | Cursiva | Linha de significado | Fonte |
|---|---|---|---|---|
| Lírio | PUREZA E RECOMEÇO | lírio | Pureza, renovação e força para recomeçar. | simbolismo do elemento |
| Leão com cruz e figura em oração | FORÇA E FÉ | leão | Força para lutar, fé para seguir. | simbolismo (leão = força, coragem e proteção; cruz e oração = fé) |
| Fada com asas de borboleta e estrela | LEVEZA E LIBERDADE | fada | Asas de transformação, luz que guia. | simbolismo (fada = liberdade e magia; asas de borboleta = transformação; estrela = guia) |
| São Miguel Arcanjo vencendo o demônio | PROTEÇÃO E VITÓRIA | São Miguel | A vitória do bem sobre o mal. | simbolismo cristão (arcanjo protetor, vence o mal) |
| Urso rugindo com floresta, lua e montanhas | INSTINTO E CORAGEM | urso | Força selvagem que protege o que é seu. | simbolismo (urso = força, coragem e proteção; lua = ciclos; montanhas = superação) |

## Diário por foto
| Data | Tattoo (tema · estilo) | Textos usados | Resultado | O que o Gemini errou | Correção que funcionou |
|---|---|---|---|---|---|
| 2026-10-09 | Lírios (2 flores, botões e folhas) · fine line [confirmar estilo] · antebraço | PUREZA E RECOMEÇO / lírio / Pureza, renovação e força para recomeçar. | Aprovado pelo André ("impecável"); gerado no app do Gemini. Tattoo fiel na comparação lado a lado; acentos e Ç corretos; texto no canto superior esquerdo funcionou | Omitiu a 5ª linha ("FINE LINE" abaixo do rodapé) | — (arte aprovada sem ela) |
| 2026-10-09 | Leão, cruz e figura em oração · realismo preto e cinza · antebraço · modo intenso | FORÇA E FÉ / leão / Força para lutar, fé para seguir. | aguardando teste | — | — |
| 2026-10-09 | Fada com asas de borboleta e estrela · fine line [confirmar] · modo delicado | LEVEZA E LIBERDADE / fada / Asas de transformação, luz que guia. | aguardando teste | — | — |
| 2026-10-09 | São Miguel Arcanjo vencendo o demônio · realismo preto e cinza · modo intenso | PROTEÇÃO E VITÓRIA / São Miguel / A vitória do bem sobre o mal. | aguardando teste | — | — |
| 2026-10-09 | Urso rugindo, floresta, lua e montanhas · realismo preto e cinza · braço · modo intenso | INSTINTO E CORAGEM / urso / Força selvagem que protege o que é seu. | aguardando teste | — | — |
