"""Gera CLUBE-15-TEXTO.md a partir do site, para o Andre ler e revisar.

O texto do clube mora em site/js/dados.js, e é de lá que o site monta a home
e a página do clube. Este script só traduz aquele bloco para um documento
legível. Rode de novo depois de qualquer edição no dados.js:

    python3 scripts/texto-do-clube.py

Nunca edite o CLUBE-15-TEXTO.md esperando que o site mude: a fonte é o
dados.js, e o que estiver só no documento se perde na próxima geração.
"""
import re
import pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
DADOS = RAIZ / "site" / "js" / "dados.js"
SAIDA = RAIZ / "CLUBE-15-TEXTO.md"


def sem_tags(txt):
    """O dados.js aceita negrito em HTML; aqui o documento é texto puro."""
    return re.sub(r"<[^>]+>", "", txt)


def gerar():
    s = DADOS.read_text(encoding="utf-8")
    bloco = s[s.index("  clube: {"):s.index("  /* ---------- 3. TRABALHOS")]

    chamada = re.search(r'chamada:\s*"(.*?)",\n', bloco, re.S).group(1)
    resumo = re.search(r'resumo:\s*"(.*?)",\n', bloco, re.S).group(1)
    inclui = re.findall(r'\{\s*t:"(.*?)",\s*\n\s*d:"(.*?)"\s*\}', bloco, re.S)
    regras = re.findall(r'\{\s*p:"(.*?)",\s*\n\s*r:"(.*?)"\s*\}', bloco, re.S)
    msg = re.search(r'clube:\s*"(.*?)",', s).group(1)
    espera = re.search(r'clubeEspera:\s*"(.*?)"', s).group(1)

    L = [
        "# Clube 15: o texto que está no site",
        "",
        "Documento gerado por `scripts/texto-do-clube.py`. A fonte do texto é",
        "`site/js/dados.js`, bloco `clube`. Editar este arquivo não muda o site.",
        "",
        "---",
        "",
        "## Frase de abertura",
        "",
        chamada,
        "",
        "## Resumo",
        "",
        "Aparece na home e no topo da página do clube.",
        "",
        resumo,
        "",
        "---",
        "",
        "## O que entra na vaga (%d itens)" % len(inclui),
        "",
    ]
    for i, (t, d) in enumerate(inclui, 1):
        L += ["**%d. %s**" % (i, t), sem_tags(d), ""]

    L += ["---", "", "## O regulamento (%d perguntas)" % len(regras), ""]
    for i, (p, r) in enumerate(regras, 1):
        L += ["**%d. %s**" % (i, p), sem_tags(r), ""]

    L += [
        "---",
        "",
        "## A mensagem que abre no WhatsApp",
        "",
        "Com vaga aberta:",
        "",
        "> " + msg,
        "",
        "Quando as quinze estiverem ocupadas, o botão troca sozinho para:",
        "",
        "> " + espera,
        "",
    ]
    SAIDA.write_text("\n".join(L), encoding="utf-8")
    print("%s: %d benefícios, %d regras" % (SAIDA.name, len(inclui), len(regras)))


if __name__ == "__main__":
    gerar()
