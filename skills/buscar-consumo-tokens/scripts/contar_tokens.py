#!/usr/bin/env python3
"""Estima e busca o consumo de tokens das skills do repositório.

Uso (sempre com -I):
  python3 -I contar_tokens.py                      resumo: custo fixo + ranking de skills
  python3 -I contar_tokens.py --skill NOME         detalhe de uma skill
  python3 -I contar_tokens.py --rotina [NOME]      custo das rotinas do AGENCIA.md
  python3 -I contar_tokens.py --buscar TERMO       onde o termo aparece e quanto cada arquivo pesa
  python3 -I contar_tokens.py --arquivos           ranking de todos os arquivos de texto
Opções: --top N (padrão 10) · --chars-por-token X (padrão 3.2) · --raiz CAMINHO

ESTIMATIVA: caracteres ÷ 3.2, margem de ±25%. Não é a contagem oficial do Claude."""
import argparse, math, pathlib, re, sys

CPT_PADRAO = 3.2
IGNORAR = {".git", "node_modules", "dist", "assets-src", "out", "descoberta"}
SUFIXOS = {".md", ".py", ".sh", ".js", ".css", ".json", ".txt"}
FM = re.compile(r'---\nname: "?(.+?)"?\ndescription: "?(.+?)"?\n---\n(.*)', re.S)
LE = re.compile(r"(?<![\w/])((?:contexto|aprendizados|referencias|templates)/[\w.\-/]+\.md|AGENCIA\.md)")


def tk(txt, cpt):
    return math.ceil(len(txt) / cpt)


def ler(f):
    return f.read_text(encoding="utf-8", errors="replace")


def tabela(cab, linhas):
    print("| " + " | ".join(cab) + " |")
    print("|" + "|".join("---" for _ in cab) + "|")
    for l in linhas:
        print("| " + " | ".join(str(x) for x in l) + " |")
    print()


def carregar(raiz, cpt):
    """Por skill: tokens da descrição (sempre no contexto), do corpo e dos .md que o corpo manda ler."""
    skills = {}
    for f in sorted((raiz / "skills").glob("*/SKILL.md")):
        m = FM.match(ler(f))
        if not m:
            print(f"AVISO: {f.parent.name}: frontmatter fora do padrão, ignorada", file=sys.stderr)
            continue
        nome, desc, corpo = m.group(1).strip(), m.group(2).strip(), m.group(3)
        lidos = {p: tk(ler(raiz / p), cpt) for p in dict.fromkeys(LE.findall(corpo)) if (raiz / p).is_file()}
        skills[nome] = {"desc": tk(nome + desc, cpt), "corpo": tk(corpo, cpt), "lidos": lidos}
    return skills


def ao_acionar(s):
    return s["corpo"] + sum(s["lidos"].values())


def arquivos_texto(raiz):
    for f in sorted(raiz.rglob("*")):
        rel = f.relative_to(raiz)
        if f.is_file() and f.suffix in SUFIXOS and not (IGNORAR & set(rel.parts)):
            yield f, rel.as_posix()


def resumo(skills, top):
    fixo = sum(s["desc"] for s in skills.values())
    print(f"Custo fixo (descrições de {len(skills)} skills, sempre no contexto): ~{fixo} tokens\n")
    rank = sorted(skills.items(), key=lambda kv: -ao_acionar(kv[1]))[:top]
    print(f"## Top {len(rank)} skills por peso ao acionar\n")
    tabela(["#", "skill", "descrição", "corpo", "arquivos que manda ler", "ao acionar"],
           [(i, n, s["desc"], s["corpo"], sum(s["lidos"].values()), ao_acionar(s)) for i, (n, s) in enumerate(rank, 1)])
    print("`ao acionar` = corpo + arquivos lidos; a descrição já está no custo fixo.")
    print("`arquivos que manda ler` = .md citados no corpo; citar não é ler, então pode superestimar.")


def detalhe(skills, nome):
    if nome not in skills:
        sys.exit(f"Skill '{nome}' não existe. Disponíveis: {', '.join(skills)}")
    s = skills[nome]
    print(f"## {nome}\n")
    linhas = [("descrição (sempre no contexto)", s["desc"]), ("corpo do SKILL.md", s["corpo"])]
    linhas += [(f"lê: {p}", t) for p, t in s["lidos"].items()]
    tabela(["parte", "tokens"], linhas)
    print(f"Ao acionar: ~{ao_acionar(s)} tokens (fora a conversa).")


def rotinas(raiz, skills):
    txt = ler(raiz / "AGENCIA.md")
    sec = re.search(r"^## Rotinas.*?\n(.*?)(?=^## |\Z)", txt, re.S | re.M)
    out = {}
    for l in (sec.group(1).splitlines() if sec else []):
        c = [x.strip() for x in l.strip().strip("|").split("|")]
        if len(c) == 2 and c[0].startswith("**"):
            out[c[0].strip("*")] = [n for n in dict.fromkeys(re.findall(r"`([a-z0-9-]+)`", c[1])) if n in skills]
    return out


def mostrar_rotinas(raiz, skills, filtro):
    todas = rotinas(raiz, skills)
    if not todas:
        sys.exit("Nenhuma rotina encontrada na seção '## Rotinas' do AGENCIA.md.")
    if filtro != "*":
        todas = {k: v for k, v in todas.items() if filtro.lower() in k.lower()}
        if not todas:
            sys.exit(f"Rotina '{filtro}' não existe. Disponíveis: {', '.join(rotinas(raiz, skills))}")
    for nome, passos in todas.items():
        comuns = {}
        for p in passos:
            comuns.update(skills[p]["lidos"])  # arquivo lido por várias skills entra uma vez só
        total = sum(skills[p]["corpo"] for p in passos) + sum(comuns.values())
        print(f"## Rotina {nome}: ~{total} tokens\n")
        tabela(["passo", "skill", "corpo"], [(i, p, skills[p]["corpo"]) for i, p in enumerate(passos, 1)])
        if comuns:
            tabela(["arquivo lido (contado uma vez)", "tokens"], list(comuns.items()))
    print("Soma do que entra no contexto. A conversa em si (suas mensagens, dados colados, respostas) fica de fora.")


def buscar(raiz, termo, cpt, top):
    rx = re.compile(re.escape(termo), re.I)
    achados = []
    for f, rel in arquivos_texto(raiz):
        txt = ler(f)
        hits = [(i, l.strip()) for i, l in enumerate(txt.splitlines(), 1) if rx.search(l)]
        if hits:
            achados.append((rel, len(hits), tk(txt, cpt), f"L{hits[0][0]}: {hits[0][1][:90]}"))
    if not achados:
        sys.exit(f"'{termo}' não aparece em nenhum arquivo de texto.")
    achados.sort(key=lambda a: (-a[1], -a[2]))
    print(f"## '{termo}': {sum(a[1] for a in achados)} linhas em {len(achados)} arquivos (top {min(top, len(achados))})\n")
    tabela(["arquivo", "linhas", "tokens do arquivo", "primeira ocorrência"], [a[:4] for a in achados[:top]])
    print("Mesmo trecho repetido em várias skills é candidato a ficar só em `contexto/marca.md` (regra 2 do AGENCIA.md).")


def ranking_arquivos(raiz, cpt, top):
    pesos = sorted(((rel, tk(ler(f), cpt)) for f, rel in arquivos_texto(raiz)), key=lambda x: -x[1])
    print(f"## Top {min(top, len(pesos))} arquivos de texto mais pesados ({len(pesos)} no total)\n")
    tabela(["arquivo", "tokens"], pesos[:top])
    print("Só entram no contexto os arquivos que o Claude abre; peso alto não é problema se raramente é lido.")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--skill")
    ap.add_argument("--rotina", nargs="?", const="*")
    ap.add_argument("--buscar")
    ap.add_argument("--arquivos", action="store_true")
    ap.add_argument("--top", type=int, default=10)
    ap.add_argument("--chars-por-token", type=float, default=CPT_PADRAO)
    ap.add_argument("--raiz", type=pathlib.Path, default=pathlib.Path(__file__).resolve().parents[3])
    a = ap.parse_args()
    if a.chars_por_token <= 0 or a.top < 1:
        ap.error("--chars-por-token e --top precisam ser positivos")
    print(f"_Estimativa: caracteres ÷ {a.chars_por_token:g}, margem ±25%. Não é a contagem oficial._\n")
    skills = carregar(a.raiz, a.chars_por_token)
    if a.skill:
        detalhe(skills, a.skill)
    elif a.rotina:
        mostrar_rotinas(a.raiz, skills, a.rotina)
    elif a.buscar:
        buscar(a.raiz, a.buscar, a.chars_por_token, a.top)
    elif a.arquivos:
        ranking_arquivos(a.raiz, a.chars_por_token, a.top)
    else:
        resumo(skills, a.top)


if __name__ == "__main__":
    main()
