#!/usr/bin/env python3
"""Monta o app em um único arquivo HTML publicável.

Uso: python3 -I app/build.py [--out app/dist/caixa-andre-tattoo.html]

Lê app/src/manifest.json:
  {"template": "index.html",
   "css": ["css/tokens.css", ...],
   "js":  ["js/core/util.js", ...],
   "assets": {"logo": {"src": "assets-src/logo.png", "max": 256, "fmt": "png"},
              "foto-leao": {"src": "assets-src/foto-leao.jpg", "max": 900, "fmt": "jpg", "q": 70, "gray": true}}}

No template e nos arquivos CSS/JS, o texto @@ASSET:nome@@ vira um data URI.
O template deve conter <!--@@CSS@@--> e <!--@@JS@@-->.
Falha (código 1) se: arquivo faltando, "</script" dentro do JS, sintaxe inválida (node --check) ou saída maior que 8 MB.
"""
import base64, io, json, pathlib, re, subprocess, sys, tempfile

RAIZ = pathlib.Path(__file__).resolve().parent
SRC = RAIZ / "src"
MAX_BYTES = 8 * 1024 * 1024

def asset_uri(nome, cfg):
    from PIL import Image
    p = RAIZ / cfg["src"]
    im = Image.open(p)
    if cfg.get("gray"):
        im = im.convert("L").convert("RGB")
    elif im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGB")
    mx = cfg.get("max", 800)
    im.thumbnail((mx, mx))
    buf = io.BytesIO()
    fmt = cfg.get("fmt", "jpg")
    if fmt == "png":
        im.save(buf, "PNG", optimize=True); mime = "image/png"
    elif fmt == "webp":
        im.save(buf, "WEBP", quality=cfg.get("q", 72)); mime = "image/webp"
    else:
        im.convert("RGB").save(buf, "JPEG", quality=cfg.get("q", 72), optimize=True, progressive=True); mime = "image/jpeg"
    return "data:%s;base64,%s" % (mime, base64.b64encode(buf.getvalue()).decode())

def main():
    out = RAIZ / "dist" / "caixa-andre-tattoo.html"
    if "--out" in sys.argv:
        out = pathlib.Path(sys.argv[sys.argv.index("--out") + 1])
    man = json.loads((SRC / "manifest.json").read_text(encoding="utf-8"))
    erros = []
    def ler(rel):
        f = SRC / rel
        if not f.exists():
            erros.append("arquivo faltando: src/" + rel); return ""
        return f.read_text(encoding="utf-8")
    css = "\n".join("/* ==== %s ==== */\n%s" % (r, ler(r)) for r in man["css"])
    js = "\n".join("/* ==== %s ==== */\n%s" % (r, ler(r)) for r in man["js"])
    html = ler(man["template"])
    if "<!--@@CSS@@-->" not in html or "<!--@@JS@@-->" not in html:
        erros.append("template sem <!--@@CSS@@--> ou <!--@@JS@@-->")
    if "</script" in js.lower():
        erros.append("o JS contém </script (quebraria a página)")
    assets = man.get("assets", {})
    cache = {}
    def sub_assets(txt):
        def rep(m):
            n = m.group(1)
            if n not in assets:
                erros.append("asset desconhecido: " + n); return ""
            if n not in cache:
                cache[n] = asset_uri(n, assets[n])
            return cache[n]
        return re.sub(r"@@ASSET:([A-Za-z0-9_.-]+)@@", rep, txt)
    css, js = sub_assets(css), sub_assets(js)
    html = html.replace("<!--@@CSS@@-->", "<style>\n" + css + "\n</style>").replace("<!--@@JS@@-->", "<script>\n" + js + "\n</script>")
    html = sub_assets(html)
    # checagem de sintaxe do JS
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as t:
        t.write(js); tmp = t.name
    r = subprocess.run(["node", "--check", tmp], capture_output=True, text=True)
    if r.returncode != 0:
        erros.append("sintaxe do JS inválida:\n" + r.stderr[:1500])
    if erros:
        print("BUILD FALHOU"); [print(" -", e) for e in erros]; sys.exit(1)
    data = html.encode("utf-8")
    if len(data) > MAX_BYTES:
        print("BUILD FALHOU: saída com %.1f MB (limite 8 MB)" % (len(data) / 1e6)); sys.exit(1)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(data)
    print("OK %s | %.0f KB | css %.0f KB | js %.0f KB | assets: %s" % (out, len(data) / 1024, len(css) / 1024, len(js) / 1024, ", ".join(sorted(cache)) or "nenhum"))

if __name__ == "__main__":
    main()
