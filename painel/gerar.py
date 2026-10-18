#!/usr/bin/env python3
"""Gera o painel da agencia (painel/index.html) a partir de painel/dados/.

Uso:
  python3 -I painel/gerar.py            # escreve painel/index.html e imprime o resumo
  python3 -I painel/gerar.py --resumo   # so imprime o resumo no terminal

Sem dependencia externa. Cada bloco sem dado mostra o comando que o alimenta.
Cores: ramp neutra da marca (carvao e prata), validada para fundo #101012;
status usa a paleta reservada e vem sempre com palavra, nunca so a cor.
"""
import argparse
import json
import pathlib
from datetime import date, datetime
from html import escape

RAIZ = pathlib.Path(__file__).resolve().parent.parent
DADOS = RAIZ / "painel" / "dados"
SAIDA = RAIZ / "painel" / "index.html"

RAMP = ["#F4F2ED", "#C9C6BF", "#8F8B84", "#5B5954"]  # ordinal, claro -> escuro
STATUS_COR = {"entregue": "#0ca30c", "aguardando-andre": "#fab219", "travado": "#d03b3b"}
STATUS_ROTULO = {"entregue": "entregue", "aguardando-andre": "aguardando André", "travado": "travado"}
AGENTES = ["carrossel", "editor-video", "financeiro", "marketing", "vendas"]


# ---------------------------------------------------------------- leitura
def ler_jsonl(nome):
    caminho = DADOS / nome
    if not caminho.exists():
        return []
    linhas = []
    for n, linha in enumerate(caminho.read_text(encoding="utf-8").splitlines(), 1):
        linha = linha.strip()
        if not linha:
            continue
        try:
            linhas.append(json.loads(linha))
        except json.JSONDecodeError:
            print(f"AVISO: {nome} linha {n} nao e JSON valido; ignorada")
    return linhas


def ler_estado():
    caminho = DADOS / "estado.json"
    return json.loads(caminho.read_text(encoding="utf-8")) if caminho.exists() else {}


def consolidar(metricas):
    """Ultimo valor informado para cada (categoria, periodo, chave)."""
    mapa = {}
    for m in metricas:
        try:
            mapa[(m["categoria"], m["periodo"], m["chave"])] = (float(m["valor"]), m.get("fonte", ""), m.get("data", ""))
        except (KeyError, TypeError, ValueError):
            continue
    return mapa


def serie(mapa, categoria, chave):
    itens = [(p, v[0]) for (c, p, k), v in mapa.items() if c == categoria and k == chave]
    return sorted(itens)


def ultimo(mapa, categoria, chave):
    s = serie(mapa, categoria, chave)
    return s[-1] if s else (None, None)


# ---------------------------------------------------------------- formato
def brl(v):
    if v is None:
        return "—"
    return "R$ " + f"{v:,.0f}".replace(",", ".")


def num(v, casas=0):
    if v is None:
        return "—"
    return f"{v:,.{casas}f}".replace(",", "X").replace(".", ",").replace("X", ".")


def pct(v):
    return "—" if v is None else f"{v:.0f}%".replace(".", ",")


def rotulo_periodo(p):
    meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
    if "-W" in p:
        return "sem " + p.split("-W")[1]
    ano, mes = p.split("-")
    return f"{meses[int(mes) - 1]}/{ano[2:]}"


def e(t):
    return escape(str(t), quote=True)


# ---------------------------------------------------------------- svg
def teto_bonito(v, divisoes=4):
    """Topo do eixo divisivel por `divisoes` em passos redondos (1, 2, 2,5 ou 5 x 10^k)."""
    import math
    if v <= 0:
        return float(divisoes)
    alvo = v / divisoes
    k = 10 ** math.floor(math.log10(alvo))
    for m in (1, 2, 2.5, 5, 10):
        if alvo <= m * k:
            return m * k * divisoes
    return 10 * k * divisoes


def topo_arredondado(x, y, w, h, r=4):
    r = min(r, w / 2, h) if h > 0 else 0
    return (f"M{x:.1f},{y + h:.1f} V{y + r:.1f} Q{x:.1f},{y:.1f} {x + r:.1f},{y:.1f} "
            f"H{x + w - r:.1f} Q{x + w:.1f},{y:.1f} {x + w:.1f},{y + r:.1f} V{y + h:.1f} Z")


def grafico_barras(dados, meta, titulo_y="entradas"):
    """Barras verticais de uma serie, com linha de meta tracejada."""
    if not dados:
        return ""
    L, R, T, B = 76, 12, 16, 34
    larg, alt = 720, 240
    area_l, area_a = larg - L - R, alt - T - B
    topo = teto_bonito(max([v for _, v in dados] + [meta or 0]) * 1.08)
    n = len(dados)
    passo = area_l / n
    bw = min(46, passo - 10)
    partes = []
    # grade recessiva
    for i in range(5):
        y = T + area_a * i / 4
        valor = topo * (4 - i) / 4
        partes.append(f'<line x1="{L}" y1="{y:.1f}" x2="{larg - R}" y2="{y:.1f}" class="grid"/>')
        partes.append(f'<text x="{L - 8}" y="{y + 4:.1f}" class="tick ar">{e(brl(valor))}</text>')
    for i, (p, v) in enumerate(dados):
        h = area_a * v / topo
        x = L + passo * i + (passo - bw) / 2
        y = T + area_a - h
        partes.append(f'<path d="{topo_arredondado(x, y, bw, h)}" fill="{RAMP[1]}" class="mark" '
                      f'data-tip="{e(rotulo_periodo(p))} · {e(brl(v))}"/>')
        partes.append(f'<text x="{x + bw / 2:.1f}" y="{alt - B + 18:.1f}" class="tick mid">{e(rotulo_periodo(p))}</text>')
    if meta:
        y = T + area_a - area_a * meta / topo
        partes.append(f'<line x1="{L}" y1="{y:.1f}" x2="{larg - R}" y2="{y:.1f}" class="meta"/>')
        partes.append(f'<text x="{larg - R}" y="{y - 7:.1f}" class="tick ar meta-txt">meta {e(brl(meta))}</text>')
    corpo = "".join(partes)
    tabela = tabela_html([(rotulo_periodo(p), brl(v)) for p, v in dados], ["mês", titulo_y])
    return (f'<svg viewBox="0 0 {larg} {alt}" role="img" aria-label="{e(titulo_y)} por mês">{corpo}</svg>' + tabela)


def grafico_funil(etapas):
    """Barras horizontais em ramp ordinal + conversao entre etapas."""
    if not etapas or not any(v for _, v in etapas):
        return ""
    larg, lin = 720, 46
    alt = lin * len(etapas) + 8
    topo = max(v for _, v in etapas) or 1
    L = 150
    partes = []
    for i, (nome, v) in enumerate(etapas):
        y = i * lin + 8
        w = max(2, (larg - L - 90) * v / topo)
        cor = RAMP[min(i, len(RAMP) - 1)]
        conv = ""
        if i > 0 and etapas[i - 1][1]:
            conv = f"{100 * v / etapas[i - 1][1]:.0f}% da etapa anterior".replace(".", ",")
        partes.append(f'<text x="{L - 12}" y="{y + 22}" class="tick ar">{e(nome)}</text>')
        partes.append(f'<rect x="{L}" y="{y + 6}" width="{w:.1f}" height="24" rx="4" fill="{cor}" class="mark" '
                      f'data-tip="{e(nome)} · {e(num(v))}{" · " + e(conv) if conv else ""}"/>')
        sufixo = f"<tspan class='conv'>  {e(conv)}</tspan>" if conv else ""
        partes.append(f'<text x="{L + w + 10:.1f}" y="{y + 23}" class="val">{e(num(v))}{sufixo}</text>')
    corpo = "".join(partes)
    tabela = tabela_html([(nome, num(v)) for nome, v in etapas], ["etapa", "leads"])
    return f'<svg viewBox="0 0 {larg} {alt}" role="img" aria-label="funil de vendas">{corpo}</svg>' + tabela


def grafico_linha(dados, rotulo):
    if len(dados) < 2:
        return ""
    L, R, T, B = 68, 34, 16, 30
    larg, alt = 720, 200
    area_l, area_a = larg - L - R, alt - T - B
    topo = teto_bonito(max(v for _, v in dados) * 1.08)
    n = len(dados)
    xs = [L + (area_l * i / (n - 1)) for i in range(n)]
    ys = [T + area_a - area_a * v / topo for _, v in dados]
    partes = []
    for i in range(4):
        y = T + area_a * i / 3
        partes.append(f'<line x1="{L}" y1="{y:.1f}" x2="{larg - R}" y2="{y:.1f}" class="grid"/>')
        partes.append(f'<text x="{L - 8}" y="{y + 4:.1f}" class="tick ar">{e(num(topo * (3 - i) / 3))}</text>')
    pontos = " ".join(f"{x:.1f},{y:.1f}" for x, y in zip(xs, ys))
    partes.append(f'<polyline points="{pontos}" fill="none" stroke="{RAMP[0]}" stroke-width="2" '
                  f'stroke-linejoin="round" stroke-linecap="round"/>')
    for (p, v), x, y in zip(dados, xs, ys):
        partes.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="{RAMP[0]}" stroke="#101012" stroke-width="2" '
                      f'class="mark" data-tip="{e(rotulo_periodo(p))} · {e(num(v))}"/>')
    for i, (p, _) in enumerate(dados):
        if n <= 8 or i % 2 == 0:
            classe = "tick mid" if i < n - 1 else "tick ar"
            partes.append(f'<text x="{xs[i] + (0 if i < n - 1 else 6):.1f}" y="{alt - B + 18:.1f}" '
                          f'class="{classe}">{e(rotulo_periodo(p))}</text>')
    corpo = "".join(partes)
    tabela = tabela_html([(rotulo_periodo(p), num(v)) for p, v in dados], ["período", rotulo])
    return f'<svg viewBox="0 0 {larg} {alt}" role="img" aria-label="{e(rotulo)} por período">{corpo}</svg>' + tabela


def tabela_html(linhas, cabecalho):
    th = "".join(f"<th>{e(c)}</th>" for c in cabecalho)
    tr = "".join("<tr>" + "".join(f"<td>{e(c)}</td>" for c in linha) + "</tr>" for linha in linhas)
    return f"<details class='tab'><summary>ver tabela</summary><table><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table></details>"


# ---------------------------------------------------------------- blocos
def vazio(texto, comando):
    return (f"<p class='vazio'>{e(texto)}</p><pre class='cmd'>{e(comando)}</pre>")


def card(rotulo, valor, apoio="", medidor=None):
    barra = ""
    if medidor is not None:
        p = max(0, min(100, medidor))
        barra = (f"<div class='medidor' role='img' aria-label='{p:.0f} por cento da meta'>"
                 f"<i style='width:{p:.1f}%'></i></div>")
    return (f"<div class='card'><span class='rot'>{e(rotulo)}</span>"
            f"<strong class='num'>{e(valor)}</strong>{barra}"
            f"<span class='apoio'>{apoio}</span></div>")


def construir(estado, mapa, execucoes, hoje):
    meta = estado.get("meta_mes_brl")
    mes_atual = hoje.strftime("%Y-%m")
    entradas_serie = serie(mapa, "financeiro", "entradas_mes")
    p_ent, entradas = ultimo(mapa, "financeiro", "entradas_mes")
    custos = mapa.get(("financeiro", p_ent, "custos_mes"), (None,))[0] if p_ent else None
    tattoos = mapa.get(("financeiro", p_ent, "tattoos_mes"), (None,))[0] if p_ent else None
    horas = mapa.get(("financeiro", p_ent, "horas_mes"), (None,))[0] if p_ent else None
    retiradas = mapa.get(("financeiro", p_ent, "retiradas_mes"), (None,))[0] if p_ent else None
    lucro = entradas - custos if (entradas is not None and custos is not None) else None
    sobra = lucro - retiradas if (lucro is not None and retiradas is not None) else None
    margem = 100 * lucro / entradas if (lucro is not None and entradas) else None
    ticket = entradas / tattoos if (entradas and tattoos) else None
    por_hora = entradas / horas if (entradas and horas) else None

    p_funil = max([p for (c, p, _) in mapa if c == "funil"], default=None)
    etapas = []
    if p_funil:
        for chave, nome in [("leads", "leads"), ("orcamentos", "orçamentos"),
                            ("sinais", "sinais pagos"), ("agendados", "agendados")]:
            v = mapa.get(("funil", p_funil, chave), (None,))[0]
            if v is not None:
                etapas.append((nome, v))
    conv = None
    if len(etapas) >= 2 and etapas[0][1]:
        conv = 100 * etapas[-1][1] / etapas[0][1]

    alcance = serie(mapa, "instagram", "alcance")
    p_ig = max([p for (c, p, _) in mapa if c == "instagram"], default=None)
    posts = mapa.get(("instagram", p_ig, "posts"), (None,))[0] if p_ig else None
    seguidores = mapa.get(("instagram", p_ig, "seguidores"), (None,))[0] if p_ig else None
    p_yt = max([p for (c, p, _) in mapa if c == "youtube"], default=None)
    inscritos = mapa.get(("youtube", p_yt, "inscritos"), (None,))[0] if p_yt else None
    views_90 = mapa.get(("youtube", p_yt, "views_shorts_90d"), (None,))[0] if p_yt else None

    prazo = estado.get("prazo_ypp")
    dias_prazo = (date.fromisoformat(prazo) - hoje).days if prazo else None
    metas_semana = estado.get("metas_semana") or {}
    meta_posts = metas_semana.get("posts_instagram")
    meta_contatos = metas_semana.get("contatos_crm")
    contatos = mapa.get(("funil", p_funil, "contatos"), (None,))[0] if p_funil else None

    cards = [
        card("entradas do mês" + (f" ({rotulo_periodo(p_ent)})" if p_ent else ""), brl(entradas),
             (f"meta {brl(meta)} · falta {brl(max(0, meta - entradas))}" if (meta and entradas is not None)
              else f"meta {brl(meta)}" if meta else ""),
             medidor=(100 * entradas / meta) if (meta and entradas is not None) else None),
        card("lucro do estúdio", brl(lucro),
             (f"margem {pct(margem)} · custo {brl(custos)}" if lucro is not None else "falta lançar custos_mes")),
        card("sobra depois do pessoal", brl(sobra),
             (f"retiradas {brl(retiradas)}" if sobra is not None
              else "lance retiradas_mes para separar estúdio e pessoal")),
        card("ticket médio", brl(ticket), f"{num(tattoos)} tattoos no mês" if tattoos else "falta tattoos_mes"),
        card("receita por hora", brl(por_hora), f"{num(horas)} h tatuando" if horas else "falta horas_mes"),
        card("contatos de CRM na semana", num(contatos),
             (f"meta {num(meta_contatos)}/semana" if meta_contatos else "retomadas e follow-ups enviados"),
             medidor=(100 * contatos / meta_contatos) if (meta_contatos and contatos is not None) else None),
        card("conversão do funil", pct(conv),
             f"lead → agendado ({e(rotulo_periodo(p_funil))})" if p_funil else "sem funil registrado"),
        card("posts no Instagram", num(posts),
             (f"meta {num(meta_posts)}/semana" if meta_posts else "") +
             (f" · {num(seguidores)} seguidores" if seguidores else "")),
        card("Shorts: régua do YPP", num(views_90),
             (f"views 90d · {num(inscritos)} inscritos" if inscritos else "views em 90 dias")),
        card("prazo da régua do YPP", f"{dias_prazo} dias" if dias_prazo is not None else "—",
             f"até {e(prazo)}" if prazo else ""),
    ]

    # atividade dos agentes
    por_agente = {a: 0 for a in AGENTES}
    for x in execucoes:
        if x.get("agente") in por_agente:
            por_agente[x["agente"]] += 1
    recentes = sorted(execucoes, key=lambda x: x.get("ts", ""), reverse=True)[:12]
    linhas_ativ = []
    for x in recentes:
        st = x.get("status", "entregue")
        cor = STATUS_COR.get(st, RAMP[2])
        quando = (x.get("ts", "") or "").replace("T", " ")[:16]
        extra = []
        if x.get("saida"):
            extra.append(f"saída: <code>{e(x['saida'])}</code>")
        if x.get("proximo_passo"):
            extra.append(f"próximo: {e(x['proximo_passo'])}")
        if x.get("nota"):
            extra.append(e(x["nota"]))
        linhas_ativ.append(
            f"<li><span class='quando num'>{e(quando)}</span>"
            f"<span class='ag'>{e(x.get('agente', '?'))}</span>"
            f"<span class='acao'>{e(x.get('acao', ''))}</span>"
            f"<span class='st'><i style='background:{cor}'></i>{e(STATUS_ROTULO.get(st, st))}</span>"
            + (f"<span class='extra'>{' · '.join(extra)}</span>" if extra else "") + "</li>")
    carga = "".join(
        f"<li><span class='ag'>{e(a)}</span><span class='barrinha'>"
        f"<i style='width:{(100 * n / max(1, max(por_agente.values()))):.0f}%'></i></span>"
        f"<span class='num'>{n}</span></li>" for a, n in por_agente.items())

    pendentes = [x for x in execucoes if x.get("status") in ("aguardando-andre", "travado")]
    pendentes.sort(key=lambda x: x.get("ts", ""), reverse=True)
    linhas_pend = "".join(
        f"<li><span class='st'><i style='background:{STATUS_COR.get(x['status'], RAMP[2])}'></i>"
        f"{e(STATUS_ROTULO.get(x['status'], x['status']))}</span>"
        f"<span class='acao'>{e(x.get('proximo_passo') or x.get('acao', ''))}</span>"
        f"<span class='ag'>{e(x.get('agente', ''))}</span></li>" for x in pendentes) or \
        "<li class='vazio'>nada aguardando você. Os agentes registram aqui o que depende de uma decisão sua.</li>"

    conexoes = "".join(
        f"<li><span class='ag'>{e(c.get('nome'))}</span><span class='acao'>{e(c.get('uso', ''))}</span>"
        f"<span class='tagst t-{e(str(c.get('status', '')).replace(' ', '-'))}'>"
        f"{e(c.get('status', ''))}</span></li>"
        for c in estado.get("conexoes", []))

    return {
        "cards": "".join(cards),
        "entradas": grafico_barras(entradas_serie, meta) or vazio(
            "Nenhuma entrada registrada ainda.",
            "python3 -I painel/registrar.py metrica --categoria financeiro --periodo "
            f"{mes_atual} --fonte \"app Caixa\" entradas_mes=12500 custos_mes=3100 tattoos_mes=9 horas_mes=42"),
        "funil": grafico_funil(etapas) or vazio(
            "Funil sem dados. Uma leitura por semana já mostra onde o lead para.",
            "python3 -I painel/registrar.py metrica --categoria funil --periodo 2026-W42 "
            "--fonte \"app Caixa\" leads=14 orcamentos=9 sinais=3 agendados=3"),
        "instagram": grafico_linha(alcance, "alcance") or vazio(
            "Alcance do Instagram sem série ainda (precisa de 2 semanas para virar linha).",
            "python3 -I painel/registrar.py metrica --categoria instagram --periodo 2026-W42 "
            "--fonte Metricool alcance=8200 posts=4 interacoes=310 seguidores=1240 dms=12"),
        "carga": carga,
        "atividade": "".join(linhas_ativ) or "<li class='vazio'>Nenhuma execução registrada. Cada agente grava a dele ao terminar.</li>",
        "pendencias": linhas_pend,
        "conexoes": conexoes,
        "resumo_txt": resumo_texto(entradas, p_ent, meta, lucro, sobra, margem, ticket, conv, p_funil, etapas,
                                   posts, inscritos, views_90, dias_prazo, por_agente, pendentes),
    }


def resumo_texto(entradas, p_ent, meta, lucro, sobra, margem, ticket, conv, p_funil, etapas,
                 posts, inscritos, views_90, dias_prazo, por_agente, pendentes):
    L = []
    L.append(f"entradas{f' ({rotulo_periodo(p_ent)})' if p_ent else ''}: {brl(entradas)}"
             + (f" de {brl(meta)} ({pct(100 * entradas / meta)})" if (meta and entradas is not None) else ""))
    L.append(f"lucro do estudio: {brl(lucro)} (margem {pct(margem)}) | sobra depois do pessoal: {brl(sobra)}"
             f" | ticket medio: {brl(ticket)}")
    if etapas:
        L.append(f"funil {p_funil}: " + " -> ".join(f"{n} {num(v)}" for n, v in etapas) + f" | conversao {pct(conv)}")
    else:
        L.append("funil: sem dados")
    L.append(f"instagram: {num(posts)} posts | youtube: {num(inscritos)} inscritos, {num(views_90)} views 90d"
             + (f" | {dias_prazo} dias de regua" if dias_prazo is not None else ""))
    L.append("execucoes por agente: " + ", ".join(f"{a}={n}" for a, n in por_agente.items()))
    L.append(f"aguardando Andre: {len(pendentes)}")
    for x in pendentes[:5]:
        L.append(f"  - [{x.get('agente')}] {x.get('proximo_passo') or x.get('acao')}")
    return "\n".join(L)


# ---------------------------------------------------------------- html
CSS = """
:root{color-scheme:dark;
 --bg:#060607;--surface:#101012;--surface2:#17171a;--line:#232326;
 --ink:#ECEAE5;--muted:#8D8A85;--prata:#C9C6BF;--serif:"Cormorant Garamond",Cormorant,Georgia,serif;
 --sans:Manrope,ui-sans-serif,-apple-system,"Segoe UI",Roboto,sans-serif}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:15px;line-height:1.5}
.wrap{max-width:980px;margin:0 auto;padding:28px 16px 80px}
header{border-bottom:1px solid var(--line);padding-bottom:16px;margin-bottom:24px}
h1{font-family:var(--serif);font-weight:600;font-size:30px;letter-spacing:.02em;margin:0 0 4px}
h2{font-family:var(--serif);font-weight:600;font-size:21px;margin:34px 0 10px;letter-spacing:.02em}
.sub,.apoio,.extra,.tick,.vazio{color:var(--muted)}
.sub{font-size:13px}
.num{font-variant-numeric:lining-nums tabular-nums}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:10px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:4px;padding:14px 14px 12px;display:flex;flex-direction:column;gap:4px}
.card .rot{font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)}
.card strong{font-family:var(--serif);font-size:30px;font-weight:600;line-height:1.1}
.card .apoio{font-size:12.5px;min-height:1.2em}
.medidor{height:4px;background:#232326;border-radius:2px;overflow:hidden;margin:4px 0 2px}
.medidor i{display:block;height:100%;background:var(--prata)}
.bloco{background:var(--surface);border:1px solid var(--line);border-radius:4px;padding:16px}
svg{width:100%;height:auto;display:block}
.grid{stroke:#232326;stroke-width:1}
.meta{stroke:var(--prata);stroke-width:1;stroke-dasharray:5 4;opacity:.75}
.tick{font-size:11px;fill:var(--muted);font-family:var(--sans)}
.meta-txt{fill:var(--prata)}
.ar{text-anchor:end}.mid{text-anchor:middle}
.val{font-size:13px;fill:var(--ink);font-family:var(--sans)}
.conv{fill:var(--muted);font-size:11.5px}
.mark{transition:opacity .12s}
svg:hover .mark{opacity:.55}
svg .mark:hover{opacity:1}
ul{list-style:none;margin:0;padding:0}
.lista li{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;padding:9px 0;border-bottom:1px solid var(--line)}
.lista li:last-child{border-bottom:0}
.quando{font-size:12px;color:var(--muted);min-width:102px}
.ag{font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--prata);min-width:96px}
.acao{flex:1 1 240px}
.extra{font-size:12.5px;flex-basis:100%}
.extra code{font-size:12px}
.st{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--muted)}
.st i{width:8px;height:8px;border-radius:50%;display:inline-block}
.barrinha{flex:1 1 160px;height:6px;background:#232326;border-radius:3px;overflow:hidden}
.barrinha i{display:block;height:100%;background:var(--prata)}
.tagst{font-size:11px;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--line);border-radius:999px;padding:2px 9px;color:var(--muted)}
.t-ligada{color:#0ca30c;border-color:#1d3a1d}.t-instavel,.t-manual{color:#fab219;border-color:#3a3119}
.t-fora-do-ar{color:#d03b3b;border-color:#3a1d1d}
.cmd{background:#0b0b0c;border:1px solid var(--line);border-radius:4px;padding:10px 12px;font-size:12px;overflow-x:auto;color:var(--prata);white-space:pre-wrap;word-break:break-word}
.vazio{font-size:13.5px;margin:0 0 10px}
.tab{margin-top:12px;font-size:13px}
.tab summary{cursor:pointer;color:var(--muted);font-size:12.5px}
table{border-collapse:collapse;margin-top:8px;width:100%}
th,td{text-align:left;padding:5px 10px 5px 0;border-bottom:1px solid var(--line);font-size:12.5px;font-variant-numeric:tabular-nums}
th{color:var(--muted);font-weight:500}
#tip{position:fixed;pointer-events:none;opacity:0;transition:opacity .1s;background:var(--surface2);border:1px solid var(--line);
 border-radius:4px;padding:6px 9px;font-size:12.5px;color:var(--ink);z-index:9;white-space:nowrap;box-shadow:0 6px 18px rgba(0,0,0,.5)}
footer{margin-top:42px;border-top:1px solid var(--line);padding-top:14px;font-size:12.5px;color:var(--muted)}
footer code{color:var(--prata)}
@media (max-width:620px){h1{font-size:25px}.card strong{font-size:23px}.card .rot{font-size:11px}.card .apoio{font-size:11.5px}.quando{min-width:0}.ag{min-width:0}}
"""

JS = """
(function(){const t=document.getElementById('tip');
document.addEventListener('mouseover',e=>{const m=e.target.closest('[data-tip]');
 if(!m)return;t.textContent=m.getAttribute('data-tip');t.style.opacity='1';});
document.addEventListener('mousemove',e=>{if(t.style.opacity==='1'){
 const x=Math.min(e.clientX+14,window.innerWidth-t.offsetWidth-10);
 t.style.left=x+'px';t.style.top=(e.clientY+16)+'px';}});
document.addEventListener('mouseout',e=>{if(e.target.closest('[data-tip]'))t.style.opacity='0';});})();
"""


def html(b, estado, hoje, n_skills, n_agentes):
    return f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Painel da Agência — André Tattoo</title>
<style>{CSS}</style></head><body><div class="wrap">
<header>
  <h1>Painel da Agência</h1>
  <p class="sub">André Tattoo · gerado em {e(hoje.strftime('%d/%m/%Y'))} ·
  {n_agentes} agentes, {n_skills} skills · fonte: <code>painel/dados/</code></p>
</header>

<h2>Onde o mês está</h2>
<div class="cards">{b['cards']}</div>

<h2>Entradas por mês</h2>
<div class="bloco">{b['entradas']}</div>

<h2>Funil de vendas</h2>
<div class="bloco">{b['funil']}</div>

<h2>Alcance no Instagram</h2>
<div class="bloco">{b['instagram']}</div>

<h2>Aguardando você</h2>
<div class="bloco"><ul class="lista">{b['pendencias']}</ul></div>

<h2>O que os agentes fizeram</h2>
<div class="bloco"><ul class="lista">{b['carga']}</ul></div>
<div class="bloco" style="margin-top:10px"><ul class="lista">{b['atividade']}</ul></div>

<h2>Conexões e capacidades</h2>
<div class="bloco"><ul class="lista">{b['conexoes']}</ul></div>

<footer>
  <p>Para atualizar: <code>python3 -I painel/gerar.py</code>. Para alimentar:
  <code>python3 -I painel/registrar.py</code> (ver <code>painel/README.md</code>).</p>
  <p>Sem dado de cliente neste painel — só números e padrões (regra 6 do <code>AGENCIA.md</code>).</p>
</footer>
</div><div id="tip"></div><script>{JS}</script></body></html>
"""


def main():
    p = argparse.ArgumentParser(description="Gera o painel da agência.")
    p.add_argument("--resumo", action="store_true", help="só imprime o resumo, sem escrever o HTML")
    a = p.parse_args()

    estado = ler_estado()
    mapa = consolidar(ler_jsonl("metricas.jsonl"))
    execucoes = ler_jsonl("execucoes.jsonl")
    hoje = date.today()
    b = construir(estado, mapa, execucoes, hoje)

    n_skills = len(list((RAIZ / "skills").glob("*/SKILL.md")))
    n_agentes = len(list((RAIZ / ".claude" / "agents").glob("*.md"))) if (RAIZ / ".claude" / "agents").exists() else 0

    print(f"PAINEL DA AGENCIA — {hoje.isoformat()} ({n_agentes} agentes, {n_skills} skills)")
    print(b["resumo_txt"])
    if not a.resumo:
        SAIDA.write_text(html(b, estado, hoje, n_skills, n_agentes), encoding="utf-8")
        print(f"\npainel escrito: {SAIDA.relative_to(RAIZ)} ({SAIDA.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
