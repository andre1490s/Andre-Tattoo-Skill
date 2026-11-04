# Stories

Peças 1080x1920 geradas pelo mesmo motor dos carrosséis. Padrão visual completo em `contexto/identidade-pecas.md`.

```
cd stories/<pasta>
python3 -I ../../carrosseis/_template/gerar.py config.json saida/
```

O story leva caixa de CTA na arte, porque não tem legenda. O rodapé fica livre para o sticker de link.

| Peça | Tema | Status |
|---|---|---|
| agenda-novembro | Vagas restantes de novembro | pronto |
| sexta-vaga | Sexta que vagou por remarcação de cliente | pronto |

## Ao reaproveitar o story de agenda

Conferir o número antes de publicar. A peça só sai se a quantidade for verdadeira (ver a seção de gatilho em `contexto/identidade-pecas.md`).

## Peça de vaga avulsa

Quando uma data vaga por remarcação, **dizer o motivo é o que salva a peça**. "Um cliente precisou remarcar" explica a vaga e evita que o story leia como agenda vazia, que é o que `contexto/marca.md` proíbe. Sem o motivo, a mesma frase vira pedido.

Modelo: motivo real, depois a escassez concreta ("é uma data só"), depois o prazo ("nesta semana"). Nunca o contrário.
