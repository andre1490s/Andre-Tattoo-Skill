#!/usr/bin/env python3
"""Gera a arte do post no Gemini a partir da foto da tattoo e do prompt da skill.

Uso:
  python3 -I skills/arte-post-gemini/scripts/gerar_imagem.py FOTO PROMPT.txt [SAIDA.png]

Chave: variável de ambiente GEMINI_API_KEY, ou "segredo de rede" do ambiente (o proxy injeta a
chave na chamada e o script não precisa vê-la). Nunca no código nem no chat.
Modelo: variável GEMINI_MODELO (padrão gemini-2.5-flash-image).
A saída padrão fica em artes-geradas/ (fora do git: fotos de cliente não vão para o repositório).
"""
import base64, json, mimetypes, os, pathlib, ssl, sys, urllib.error, urllib.request

def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    chave = os.environ.get("GEMINI_API_KEY")
    foto, arq_prompt = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
    saida = pathlib.Path(sys.argv[3]) if len(sys.argv) > 3 else pathlib.Path("artes-geradas") / f"{foto.stem}-arte.png"
    modelo = os.environ.get("GEMINI_MODELO", "gemini-2.5-flash-image")
    mime = mimetypes.guess_type(foto.name)[0] or "image/jpeg"

    corpo = {
        "contents": [{"parts": [
            {"text": arq_prompt.read_text(encoding="utf-8")},
            {"inline_data": {"mime_type": mime, "data": base64.b64encode(foto.read_bytes()).decode()}},
        ]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"], "imageConfig": {"aspectRatio": "4:5"}},
    }
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent",
        data=json.dumps(corpo).encode(),
        headers={"Content-Type": "application/json", **({"x-goog-api-key": chave} if chave else {})},
    )
    ca = os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None)
    ctx = ssl.create_default_context(cafile=ca)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=180) as r:
            resp = json.load(r)
    except urllib.error.HTTPError as e:
        dica = "" if chave or e.code not in (401, 403) else "\nSem GEMINI_API_KEY e sem segredo de rede ativo para generativelanguage.googleapis.com."
        sys.exit(f"Erro {e.code} do Gemini: {e.read().decode()[:800]}{dica}")

    partes = (resp.get("candidates") or [{}])[0].get("content", {}).get("parts", [])
    imagens = [p for p in partes if "inlineData" in p or "inline_data" in p]
    for p in partes:
        if "text" in p:
            print("Gemini:", p["text"].strip())
    if not imagens:
        sys.exit("O Gemini não devolveu imagem. Resposta: " + json.dumps(resp)[:800])
    dado = imagens[0].get("inlineData") or imagens[0]["inline_data"]
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_bytes(base64.b64decode(dado["data"]))
    print(f"Arte salva em {saida}")

if __name__ == "__main__":
    main()
