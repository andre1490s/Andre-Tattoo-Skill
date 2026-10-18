#!/usr/bin/env python3
"""Registra no painel o que os agentes fizeram e os numeros do estudio.

Uso:
  python3 -I painel/registrar.py execucao --agente financeiro \
      --acao "Fechamento de setembro" --status entregue \
      --proximo-passo "Andre confirmar gasto de material" --saida relatorios/2026-09.md

  python3 -I painel/registrar.py metrica --categoria financeiro --periodo 2026-10 \
      --fonte "app Caixa" entradas_mes=12500 custos_mes=3100 tattoos_mes=9

Grava em painel/dados/execucoes.jsonl e painel/dados/metricas.jsonl (uma linha por
registro, nada e sobrescrito). Depois rode painel/gerar.py para atualizar o painel.
Nao coloque nome, telefone nem foto de cliente aqui (regra 6 do AGENCIA.md).
"""
import argparse
import json
import pathlib
import re
import sys
from datetime import datetime

RAIZ = pathlib.Path(__file__).resolve().parent.parent
DADOS = RAIZ / "painel" / "dados"
AGENTES = ["carrossel", "editor-video", "financeiro", "marketing", "vendas", "andre", "claude"]
STATUS = ["entregue", "aguardando-andre", "travado"]
CHAVES = {
    "financeiro": ["entradas_mes", "custos_mes", "sinais_mes", "tattoos_mes", "horas_mes"],
    "funil": ["leads", "orcamentos", "sinais", "agendados", "perdidos"],
    "instagram": ["alcance", "seguidores", "posts", "interacoes", "visitas_perfil", "dms"],
    "youtube": ["inscritos", "views_shorts_90d", "horas_12m", "shorts_publicados"],
}
PERIODO = re.compile(r"^\d{4}-(0[1-9]|1[0-2]|W\d{1,2})$")


def anexar(arquivo, registro):
    DADOS.mkdir(parents=True, exist_ok=True)
    with (DADOS / arquivo).open("a", encoding="utf-8") as f:
        f.write(json.dumps(registro, ensure_ascii=False) + "\n")


def cmd_execucao(a):
    if a.agente not in AGENTES:
        sys.exit(f"agente desconhecido: {a.agente} (use um de {', '.join(AGENTES)})")
    registro = {
        "ts": a.quando or datetime.now().isoformat(timespec="minutes"),
        "agente": a.agente,
        "acao": a.acao.strip(),
        "status": a.status,
        "proximo_passo": (a.proximo_passo or "").strip(),
        "saida": (a.saida or "").strip(),
        "nota": (a.nota or "").strip(),
    }
    anexar("execucoes.jsonl", registro)
    print(f"registrado: {registro['agente']} | {registro['acao']} | {registro['status']}")
    if registro["status"] == "aguardando-andre" and not registro["proximo_passo"]:
        print("AVISO: status 'aguardando-andre' sem --proximo-passo; o painel nao sabe o que pedir a ele")


def cmd_metrica(a):
    if a.categoria not in CHAVES:
        sys.exit(f"categoria desconhecida: {a.categoria} (use {', '.join(CHAVES)})")
    if not PERIODO.match(a.periodo):
        sys.exit(f"periodo fora do padrao: {a.periodo} (use 2026-10 para mes ou 2026-W42 para semana)")
    if not a.pares:
        sys.exit("informe ao menos um chave=valor, ex.: entradas_mes=12500")
    hoje = a.quando or datetime.now().date().isoformat()
    gravados = []
    for par in a.pares:
        if "=" not in par:
            sys.exit(f"esperado chave=valor, recebi: {par}")
        chave, bruto = par.split("=", 1)
        chave = chave.strip()
        try:
            valor = float(bruto.replace(".", "").replace(",", ".") if bruto.count(",") == 1 else bruto)
        except ValueError:
            sys.exit(f"valor nao numerico em {par}")
        if chave not in CHAVES[a.categoria]:
            print(f"AVISO: chave nova '{chave}' em {a.categoria} (conhecidas: {', '.join(CHAVES[a.categoria])})")
        anexar("metricas.jsonl", {
            "data": hoje,
            "categoria": a.categoria,
            "periodo": a.periodo,
            "chave": chave,
            "valor": valor,
            "fonte": (a.fonte or "").strip(),
        })
        gravados.append(f"{chave}={valor:g}")
    print(f"registrado em {a.categoria}/{a.periodo}: " + ", ".join(gravados))


def main():
    p = argparse.ArgumentParser(description="Registra execucoes de agentes e metricas no painel.")
    sub = p.add_subparsers(dest="cmd", required=True)

    e = sub.add_parser("execucao", help="o que um agente fez")
    e.add_argument("--agente", required=True, help=", ".join(AGENTES))
    e.add_argument("--acao", required=True, help="uma linha: o que foi feito")
    e.add_argument("--status", default="entregue", choices=STATUS)
    e.add_argument("--proximo-passo", default="", help="o que falta, de preferencia o que depende do Andre")
    e.add_argument("--saida", default="", help="caminho do arquivo entregue, se houver")
    e.add_argument("--nota", default="", help="observacao curta (sem dado de cliente)")
    e.add_argument("--quando", default="", help="AAAA-MM-DDTHH:MM, para registrar algo do passado")
    e.set_defaults(func=cmd_execucao)

    m = sub.add_parser("metrica", help="numeros de um periodo")
    m.add_argument("--categoria", required=True, help=", ".join(CHAVES))
    m.add_argument("--periodo", required=True, help="2026-10 (mes) ou 2026-W42 (semana)")
    m.add_argument("--fonte", default="", help="de onde veio o numero (app Caixa, Metricool, YouTube Studio)")
    m.add_argument("--quando", default="", help="AAAA-MM-DD da leitura")
    m.add_argument("pares", nargs="*", help="chave=valor, ex.: entradas_mes=12500 tattoos_mes=9")
    m.set_defaults(func=cmd_metrica)

    a = p.parse_args()
    a.func(a)


if __name__ == "__main__":
    main()
