#!/usr/bin/env python3
"""Painel de progresso para o Programa de Parcerias do YouTube (YPP).

Uso:
  python3 -I youtube/scripts/painel_ypp.py --inscritos 320 --views-shorts-90d 1200000 --horas-12m 180

Números das réguas conferidos em 17/10/2026 em fontes de terceiros; a fonte de
verdade é o YouTube Studio -> Ganhos. A régua do nível completo dobra em 01/02/2027
para novos candidatos.
"""
import argparse
from datetime import date

PRAZO = date(2027, 2, 1)
METAS = {
    "Financiamento de fas": {"inscritos": 500, "horas": 3000, "shorts": 3_000_000},
    "Completo (trilha longo)": {"inscritos": 1000, "horas": 4000, "shorts": None},
    "Completo (trilha Shorts)": {"inscritos": 1000, "horas": None, "shorts": 10_000_000},
}
JANELA_SHORTS = 90   # dias da janela movel de Shorts
RPM_SHORTS_BRL = (0.05, 0.17)  # estimativa de reais por 1.000 views de Shorts no Brasil


def barra(atual, meta, largura=24):
    if not meta:
        return "-" * largura
    cheio = min(largura, int(largura * atual / meta))
    return "#" * cheio + "." * (largura - cheio)


def pct(atual, meta):
    return 100.0 * atual / meta if meta else 0.0


def fmt(n):
    return f"{n:,.0f}".replace(",", ".")


def main():
    p = argparse.ArgumentParser(description="Progresso do canal contra as reguas do YPP.")
    p.add_argument("--inscritos", type=int, required=True)
    p.add_argument("--views-shorts-90d", type=int, required=True,
                   help="visualizacoes de Shorts nos ultimos 90 dias (Studio -> Ganhos)")
    p.add_argument("--horas-12m", type=float, default=0.0,
                   help="horas publicas de exibicao de video longo nos ultimos 12 meses")
    p.add_argument("--dias-publicando", type=int, default=JANELA_SHORTS,
                   help="dias desde o primeiro Short, para calcular o ritmo atual (padrao 90)")
    p.add_argument("--hoje", default=None, help="AAAA-MM-DD, para simular outra data")
    a = p.parse_args()

    hoje = date.fromisoformat(a.hoje) if a.hoje else date.today()
    dias = (PRAZO - hoje).days
    dias_ritmo = max(1, min(a.dias_publicando, JANELA_SHORTS))
    ritmo_atual = a.views_shorts_90d / dias_ritmo

    print(f"\nPAINEL YPP - {hoje.isoformat()}")
    print(f"Prazo da regua atual (dobra em 01/02/2027): {dias} dias\n")
    print(f"  inscritos .............. {fmt(a.inscritos)}")
    print(f"  views de Shorts (90d) .. {fmt(a.views_shorts_90d)}  (ritmo atual: {fmt(ritmo_atual)}/dia)")
    print(f"  horas de exibicao (12m)  {a.horas_12m:,.1f}\n".replace(",", "."))

    faltas = []
    for nome, m in METAS.items():
        print(f"- {nome}")
        print(f"    inscritos  [{barra(a.inscritos, m['inscritos'])}] "
              f"{pct(a.inscritos, m['inscritos']):5.1f}%  faltam {fmt(max(0, m['inscritos'] - a.inscritos))}")
        if m["horas"]:
            falta_h = max(0.0, m["horas"] - a.horas_12m)
            print(f"    horas      [{barra(a.horas_12m, m['horas'])}] "
                  f"{pct(a.horas_12m, m['horas']):5.1f}%  faltam {falta_h:,.0f} h"
                  .replace(",", ".") + f"  ->  {falta_h / max(1, dias):.1f} h/dia ate o prazo")
        if m["shorts"]:
            necessario_dia = m["shorts"] / JANELA_SHORTS
            print(f"    Shorts     [{barra(a.views_shorts_90d, m['shorts'])}] "
                  f"{pct(a.views_shorts_90d, m['shorts']):5.1f}%  "
                  f"ritmo necessario {fmt(necessario_dia)}/dia (atual {fmt(ritmo_atual)}/dia)")
        # horas e views de Shorts sao criterios ALTERNATIVOS (OU): vale o mais adiantado.
        candidatos = []
        if m["horas"]:
            candidatos.append(("horas", pct(a.horas_12m, m["horas"]), a.horas_12m >= m["horas"]))
        if m["shorts"]:
            candidatos.append(("views de Shorts", pct(a.views_shorts_90d, m["shorts"]),
                               a.views_shorts_90d >= m["shorts"]))
        melhor = max(candidatos, key=lambda c: c[1]) if candidatos else ("-", 0.0, True)
        tem_inscritos = a.inscritos >= m["inscritos"]
        if tem_inscritos and melhor[2]:
            print("    ELEGIVEL - conferir no Studio e inscrever-se\n")
        else:
            pendencias = ([] if tem_inscritos else ["inscritos"]) + ([] if melhor[2] else [melhor[0]])
            via = f" (via {melhor[0]})" if len(candidatos) > 1 else ""
            faltas.append((nome, melhor[1], pendencias))
            print(f"    pendente: {', '.join(pendencias)}{via}\n")

    if faltas:
        alvo = max(faltas, key=lambda x: x[1])
        print(f"Mais perto: {alvo[0]} ({alvo[1]:.1f}% do criterio de conteudo mais adiantado). "
              f"Pendente: {', '.join(alvo[2])}.")
    r1, r2 = (a.views_shorts_90d / 1000 * RPM_SHORTS_BRL[0], a.views_shorts_90d / 1000 * RPM_SHORTS_BRL[1])
    print(f"Receita estimada se os Shorts atuais fossem monetizados: R$ {r1:,.0f} a R$ {r2:,.0f} "
          f"[estimativa]".replace(",", "."))
    print("Lembrete: hora assistida em Shorts NAO conta para as 4.000 h.\n")


if __name__ == "__main__":
    main()
