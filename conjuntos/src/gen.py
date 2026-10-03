"""Ferramentas das resoluções: Venn em SVG (região pintada a partir de uma expressão) e conferência com conjuntos do Python."""
import itertools

def st(label, text, m=None):
    h = f'<div class="st"><span class="pl">{label}</span>'
    if text: h += f"<p>{text}</p>"
    if m: h += f'<div class="m">\\[{m}\\]</div>'
    return h + "</div>"

def S(xs):
    """conjunto em LaTeX, com elementos na ordem dada"""
    xs = list(xs)
    if not xs: return r"\varnothing"
    return r"\{" + ",\\ ".join(str(x) for x in xs) + r"\}"

def srt(s, order=None):
    if order: return [x for x in order if x in s]
    try: return sorted(s)
    except TypeError: return sorted(s, key=str)

_uid = [0]
GEO2 = {"A": (105, 105, 62), "B": (175, 105, 62)}
GEO3 = {"A": (140, 82, 56), "B": (108, 136, 56), "C": (172, 136, 56)}
def venn(f, names=("A", "B"), size=(280, 210), title=None, U=True, geo=None, labels=True):
    """f: função booleana de um dict {nome: bool} -> bool. Pinta as regiões onde f é verdadeira."""
    _uid[0] += 1; p = f"v{_uid[0]}"
    W, H = size
    if geo is None: geo = GEO2 if len(names) == 2 else GEO3
    defs = []
    for n in names:
        cx, cy, r = geo[n]
        defs.append(f'<clipPath id="{p}c{n}"><circle cx="{cx}" cy="{cy}" r="{r}"/></clipPath>')
    shapes = []
    for bits in itertools.product([False, True], repeat=len(names)):
        env = dict(zip(names, bits))
        if not f(env): continue
        inc = [n for n, b in env.items() if b]; exc = [n for n, b in env.items() if not b]
        mid = f"{p}m{''.join('1' if b else '0' for b in bits)}"
        defs.append(f'<mask id="{mid}"><rect x="0" y="0" width="{W}" height="{H}" fill="#fff"/>' + "".join(f'<circle cx="{geo[n][0]}" cy="{geo[n][1]}" r="{geo[n][2]}" fill="#000"/>' for n in exc) + "</mask>")
        inner = f'<rect class="vreg" x="4" y="4" width="{W-8}" height="{H-8}" mask="url(#{mid})"/>'
        for n in inc: inner = f'<g clip-path="url(#{p}c{n})">{inner}</g>'
        shapes.append(inner)
    out = [f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="diagrama de Venn"><defs>{"".join(defs)}</defs>']
    out.append(f'<rect x="4" y="4" width="{W-8}" height="{H-8}" rx="6" fill="none" stroke="var(--muted)" stroke-width="1.2"/>')
    out += shapes
    for n in names:
        cx, cy, r = geo[n]
        out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="var(--ink)" stroke-width="1.8"/>')
    if labels:
        pos2 = {"A": (60, 50), "B": (220, 50)}; pos3 = {"A": (140, 18), "B": (52, 190), "C": (228, 190)}
        pos = pos2 if len(names) == 2 else pos3
        for n in names:
            x, y = pos.get(n, (geo[n][0], geo[n][1]))
            out.append(f'<text x="{x}" y="{y}" font-size="15" font-weight="700" text-anchor="middle" fill="var(--ink)">{n}</text>')
        if U: out.append(f'<text x="{W-16}" y="22" font-size="13" font-weight="700" text-anchor="end" fill="var(--muted)">U</text>')
    if title: out.append(f'<text x="{W/2}" y="{H-8}" font-size="12.5" text-anchor="middle" fill="var(--ink)">{title}</text>')
    out.append("</svg>")
    return "".join(out)

def venn_custom(circles, extra="", size=(280, 210)):
    """circles: lista (nome, cx, cy, r) — para diagramas de situação (inclusões etc.)"""
    W, H = size
    o = [f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="diagrama"><rect x="4" y="4" width="{W-8}" height="{H-8}" rx="6" fill="none" stroke="var(--muted)" stroke-width="1.2"/>']
    for n, cx, cy, r in circles:
        o.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="var(--pri)" fill-opacity=".12" stroke="var(--ink)" stroke-width="1.8"/>')
    o.append(extra)
    for n, cx, cy, r in circles:
        o.append(f'<text x="{cx}" y="{cy - r + 16}" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">{n}</text>')
    o.append("</svg>")
    return "".join(o)

def venn_nums(vals, names=("A", "B", "C"), size=(280, 230), out_val=None):
    """Venn de 3 conjuntos com números em cada região. vals: dict com chaves 'A','B','C','AB','AC','BC','ABC'."""
    W, H = size
    geo = {"A": (140, 88, 62), "B": (104, 146, 62), "C": (176, 146, 62)}
    pos = {"A": (140, 58), "B": (72, 170), "C": (208, 170), "AB": (106, 108), "AC": (174, 108), "BC": (140, 182), "ABC": (140, 132)}
    o = [f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="diagrama com quantidades"><rect x="4" y="4" width="{W-8}" height="{H-8}" rx="6" fill="none" stroke="var(--muted)" stroke-width="1.2"/>']
    for k in "ABC":
        cx, cy, r = geo[k]
        o.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="var(--pri)" fill-opacity=".10" stroke="var(--ink)" stroke-width="1.8"/>')
    lab = {"A": (140, 20), "B": (40, 214), "C": (240, 214)}
    for i, n in enumerate(names):
        k = "ABC"[i]; x, y = lab[k]
        o.append(f'<text x="{x}" y="{y}" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">{n}</text>')
    for k, v in vals.items():
        x, y = pos[k]
        o.append(f'<text x="{x}" y="{y}" font-size="15" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="var(--pri)">{v}</text>')
    if out_val is not None:
        o.append(f'<text x="12" y="22" font-size="13" font-weight="800" text-anchor="start" fill="var(--pri)">fora: {out_val}</text>')
    o.append(f'<text x="{W-14}" y="22" font-size="13" font-weight="700" text-anchor="end" fill="var(--muted)">U</text></svg>')
    return "".join(o)

def wrap(*svgs):
    return '<div class="sk-wrap">' + "".join(svgs) + "</div>"
