#!/usr/bin/env python3
"""Valida o repositório: frontmatter das skills, mapa em AGENCIA.md e referências cruzadas.
Uso: python3 -I scripts/validar.py   (sai com código 1 se houver erro)"""
import re, sys, pathlib
raiz = pathlib.Path(__file__).resolve().parent.parent
erros, avisos = [], []
ORIGEM_EXTERNA = {'buscar-referencias-tattoo','editor-videos-tattoo','buscar-consumo-tokens'}  # skills com contexto próprio
sem_marca = []
skills = {}
for f in sorted((raiz/"skills").glob("*/SKILL.md")):
    txt = f.read_text(encoding="utf-8"); pasta = f.parent.name
    m = re.match(r'---\nname: "?(.+?)"?\ndescription: "?(.+?)"?\n---\n', txt)
    if not m: erros.append(f"{pasta}: frontmatter ausente ou fora do padrão (name/description)"); continue
    nome, desc = m.group(1).strip(), m.group(2).strip()
    if nome != pasta: erros.append(f"{pasta}: name '{nome}' difere da pasta")
    if not desc.startswith("Use "): erros.append(f"{pasta}: description deve começar com 'Use ' (gatilho de uso)")
    if len(desc) > 600: avisos.append(f"{pasta}: description longa ({len(desc)} caracteres)")
    if "contexto/marca.md" not in txt and pasta not in ORIGEM_EXTERNA: sem_marca.append(pasta)
    skills[pasta] = txt
mapa = (raiz/"AGENCIA.md").read_text(encoding="utf-8")
linhas = [l for l in mapa.splitlines() if l.startswith("| `")]
no_mapa = {}
for l in linhas:
    c = [x.strip() for x in l.strip("|").split("|")]
    if len(c) == 3: no_mapa[c[0].strip("`")] = c[2]
for s in skills:
    if s not in no_mapa: erros.append(f"{s}: existe em skills/ mas não está no AGENCIA.md")
    elif "✅" not in no_mapa[s]: erros.append(f"{s}: está em skills/ mas o status no AGENCIA.md não é ✅")
for s, st in no_mapa.items():
    if "✅" in st and s not in skills: erros.append(f"{s}: marcada ✅ no mapa mas não existe em skills/")
conhecidas = set(no_mapa) | {"referencias", "registrar-no-sistema"}
for nome in set(re.findall(r"`([a-z]+(?:-[a-z]+)+)`", mapa)):
    if nome not in conhecidas and nome not in {"cerebro-estrategico"}: avisos.append(f"AGENCIA.md cita `{nome}` que não está nas tabelas")
for p in re.findall(r"`((?:contexto|aprendizados|referencias|templates|skills)/[^`\s]*)`", mapa):
    alvo = p.split("<")[0].rstrip("/")
    if alvo and not (raiz/alvo).exists() and "NNNN" not in p and "nome" not in p: avisos.append(f"AGENCIA.md cita caminho inexistente: {p}")
if sem_marca: avisos.append(f"{len(sem_marca)} skills não apontam para contexto/marca.md (importadas sem alteração; ver contexto/conflitos-a-resolver.md)")
pend = len(re.findall(r"\[confirmar\]", (raiz/"contexto/marca.md").read_text(encoding="utf-8")))
print(f"skills: {len(skills)} | no mapa: {len(no_mapa)} | pendências [confirmar] em marca.md: {pend}")
for a in avisos: print("AVISO:", a)
for e in erros: print("ERRO:", e)
sys.exit(1 if erros else 0)
