---
name: depoimento-para-o-site
description: Use quando o Andre mandar um elogio, áudio, mensagem de WhatsApp ou avaliação do Google de um cliente e quiser transformar isso em depoimento publicado no site.
---

# SKILL: DEPOIMENTO PARA O SITE

## 1. Função
Transforma uma mensagem real de cliente em depoimento publicável no site, com autorização e sem maquiagem.
**Não faz:** escrever depoimento, "melhorar" o que o cliente disse a ponto de mudar o sentido, nem publicar
sem o cliente saber.

## 2. Entradas
- O texto original (print, transcrição do áudio ou avaliação do Google)
- Primeiro nome do cliente e qual peça ele fez
- Confirmação de que o cliente autorizou aparecer no site

## 3. Passos
1. **Checar autorização.** Sem ela, preparar a mensagem de pedido ao cliente e parar aí.
2. **Limpar sem reescrever:** tirar saudação, emoji e repetição; corrigir ortografia. Manter as palavras dele.
   Alvo: 1 a 3 linhas. Se o original for longo, cortar — nunca resumir com palavras novas.
3. **Verificar as regras da marca:** o depoimento não pode citar valor, prometer resultado nem usar
   superlativo que o estúdio não sustenta ("melhor do Brasil"). Se o cliente disse isso, cortar o trecho.
4. **Guardar o depoimento pronto** em `contexto/depoimentos.md` (criar o arquivo se não existir),
   com `nome`, `peça`, `texto` e a data da autorização.
5. **Atenção:** o site atual (`site/`) **ainda não tem seção de depoimentos** — ela existia na v1
   (`site-v1/`) e não foi reconstruída. Com **3 ou mais** depoimentos guardados, avisar o André que vale
   criar a seção e combinar onde ela entra (o lugar natural é entre "Sobre" e "Como agendar").
6. Se houver avaliação pública no Google, guardar o link junto — prova verificável vale mais
   que texto no site.

## 4. Saída
- Depoimento guardado em `contexto/depoimentos.md`
- Se faltar autorização: mensagem pronta para o André mandar ao cliente, no tom de `contexto/marca.md`
  (formal, próximo, sem emoji, tratando pelo nome)

## 5. Handoff
`pos-tattoo-avaliacao` é quem pede a avaliação ao cliente; esta skill entra depois, quando a resposta chega.
Depoimento forte também vira post: passar para `diretor-conteudo-copy`.

## 6. Limites e honestidade
- **Nunca inventar depoimento.** Texto genérico é identificado na hora e destrói a credibilidade que o
  site inteiro tenta construir.
- Não publicar sobrenome, telefone nem foto do rosto do cliente sem pedido explícito dele.
- Máximo de 1 depoimento por cliente. Repetir pessoa parece escassez de prova.
- Se os depoimentos disponíveis forem todos sobre a mesma peça ou estilo, avisar o André: convém buscar
  variedade antes de ligar a seção.

## 7. Checklist final
- [ ] Autorização confirmada
- [ ] Palavras do cliente preservadas
- [ ] Sem valor, sem promessa de resultado, sem superlativo vazio
- [ ] Guardado em `contexto/depoimentos.md` com a data da autorização
- [ ] Com 3 ou mais, André avisado de que dá para criar a seção no site
