"""Gera as figuras SVG estáticas da apostila (chamado pelo build.py).

Cada função devolve uma string <svg>. As cores vêm de classes CSS
(.s-op, .s-adj, .s-hip, ...), então as figuras acompanham o tema claro/escuro.
"""
import math

def _u(p, q):
    dx, dy = q[0] - p[0], q[1] - p[1]
    n = math.hypot(dx, dy) or 1
    return dx / n, dy / n

def _f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")

def _text(x, y, s, cls="", size=15, anchor="middle", weight=None):
    w = f' font-weight="{weight}"' if weight else ""
    c = f' class="{cls}"' if cls else ""
    return f'<text x="{_f(x)}" y="{_f(y)}"{c} font-size="{size}" text-anchor="{anchor}" dominant-baseline="middle"{w}>{s}</text>'

def _line(p, q, cls="s-line", extra=""):
    return f'<line x1="{_f(p[0])}" y1="{_f(p[1])}" x2="{_f(q[0])}" y2="{_f(q[1])}" class="{cls}" {extra}/>'

def right_mark(v, p, q, s=13, cls="s-thin"):
    u1, u2 = _u(v, p), _u(v, q)
    a = (v[0] + u1[0] * s, v[1] + u1[1] * s)
    b = (a[0] + u2[0] * s, a[1] + u2[1] * s)
    c = (v[0] + u2[0] * s, v[1] + u2[1] * s)
    dot = (v[0] + (u1[0] + u2[0]) * s * .5, v[1] + (u1[1] + u2[1]) * s * .5)
    return (f'<path d="M{_f(a[0])} {_f(a[1])} L{_f(b[0])} {_f(b[1])} L{_f(c[0])} {_f(c[1])}" class="{cls}"/>'
            f'<circle cx="{_f(dot[0])}" cy="{_f(dot[1])}" r="1.8" class="s-ink"/>')

def arc(v, p, q, r=30, label=None, cls="s-ang", fcls="f-ang", lr=None, size=14):
    u1, u2 = _u(v, p), _u(v, q)
    a = (v[0] + u1[0] * r, v[1] + u1[1] * r)
    b = (v[0] + u2[0] * r, v[1] + u2[1] * r)
    cross = u1[0] * u2[1] - u1[1] * u2[0]
    sweep = 1 if cross > 0 else 0
    out = f'<path d="M{_f(a[0])} {_f(a[1])} A{r} {r} 0 0 {sweep} {_f(b[0])} {_f(b[1])}" class="{cls}" stroke-width="2" fill="none"/>'
    if label:
        bx, by = u1[0] + u2[0], u1[1] + u2[1]
        n = math.hypot(bx, by) or 1
        L = lr if lr else r + 14
        out += _text(v[0] + bx / n * L, v[1] + by / n * L, label, fcls, size, weight="700")
    return out

def side_label(p, q, label, centroid, cls="s-ink", d=15, size=15):
    m = ((p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
    ux, uy = _u(p, q)
    nx, ny = -uy, ux
    if (m[0] + nx - centroid[0]) ** 2 + (m[1] + ny - centroid[1]) ** 2 < (m[0] - centroid[0]) ** 2 + (m[1] - centroid[1]) ** 2:
        nx, ny = -nx, -ny
    return _text(m[0] + nx * d, m[1] + ny * d, label, cls, size, weight="700")

def vertex_label(v, centroid, label, d=15, size=15):
    ux, uy = _u(centroid, v)
    return _text(v[0] + ux * d, v[1] + uy * d, label, "s-ink", size, weight="700")

def triangle(pts, sides=None, right=None, arcs=None, vb=(0, 0, 380, 240), extra="", pre="", title=""):
    """pts: dict nome->(x,y) (3 vértices). sides: {("B","C"): (rótulo, classe_traço, classe_texto)}
    right: vértice do ângulo reto. arcs: {vértice: (rótulo, raio)}"""
    names = list(pts)
    cen = (sum(p[0] for p in pts.values()) / 3, sum(p[1] for p in pts.values()) / 3)
    s = [f'<svg viewBox="{" ".join(map(str, vb))}" role="img" aria-label="{title}">', pre]
    sides = sides or {}
    for i in range(3):
        P, Q = names[i], names[(i + 1) % 3]
        key = (P, Q) if (P, Q) in sides else (Q, P)
        st = sides.get(key)
        cls = "s-line " + (st[1] if st and st[1] else "")
        s.append(_line(pts[P], pts[Q], cls, 'stroke-width="3"' if st and st[1] else ""))
    if right:
        o = [n for n in names if n != right]
        s.append(right_mark(pts[right], pts[o[0]], pts[o[1]]))
    for v, (lab, r) in (arcs or {}).items():
        o = [n for n in names if n != v]
        s.append(arc(pts[v], pts[o[0]], pts[o[1]], r, lab))
    for (P, Q), st in sides.items():
        if st[0]:
            s.append(side_label(pts[P], pts[Q], st[0], cen, st[2] if len(st) > 2 else "s-ink"))
    for n in names:
        s.append(vertex_label(pts[n], cen, n))
    s.append(extra)
    s.append("</svg>")
    return "".join(s)

# ------------------------------------------------------------------ figuras
def fig_notacao():
    P = {"B": (50, 200), "A": (320, 200), "C": (320, 50)}
    return triangle(P, sides={("B", "C"): ("a (hipotenusa)", "s-hip", "f-hip"),
                              ("A", "C"): ("b", "s-op", "f-op"),
                              ("B", "A"): ("c", "s-adj", "f-adj")},
                    right="A", arcs={"B": ("B̂", 40), "C": ("Ĉ", 28)}, vb=(0, 20, 380, 215),
                    title="Triângulo retângulo em A com hipotenusa a, catetos b e c")

def fig_semelhanca():
    B = (30, 220)
    ang = math.radians(33)
    s = ['<svg viewBox="0 -28 420 275" role="img" aria-label="Triângulos semelhantes com o mesmo ângulo B">']
    cols = ["var(--adj)", "var(--op)", "var(--hip)"]
    for i, L in enumerate([150, 250, 340]):
        A = (B[0] + L, B[1]); C = (A[0], B[1] - L * math.tan(ang))
        s.append(f'<path d="M{_f(B[0])} {_f(B[1])} L{_f(A[0])} {_f(A[1])} L{_f(C[0])} {_f(C[1])} Z" fill="none" stroke="{cols[i]}" stroke-width="2.4"/>')
        s.append(right_mark(A, B, C, 10))
        s.append(_text(C[0] + 14, C[1] - 2, f"C{i+1}", size=13, weight="700"))
        s.append(_text(A[0], A[1] + 16, f"A{i+1}", size=13, weight="700"))
    s.append(arc(B, (400, 220), (B[0] + 100, B[1] - 100 * math.tan(ang)), 42, "B̂"))
    s.append(_text(B[0] - 10, B[1] + 14, "B", size=14, weight="700"))
    s.append("</svg>")
    return "".join(s)

def fig_pitagoras():
    k = 34; b, c = 3, 4; L = (b + c) * k; o = 20
    def p(x, y): return (o + x * k, o + y * k)
    P1, P2, P3, P4 = p(c, 0), p(b + c, c), p(b, b + c), p(0, b)
    s = [f'<svg viewBox="0 0 {L + 2*o + 150} {L + 2*o}" role="img" aria-label="Quadrado de lado b mais c com quatro triângulos e um quadrado interno de lado a">']
    s.append(f'<rect x="{o}" y="{o}" width="{L}" height="{L}" class="s-line" fill="none"/>')
    corners = [(p(0, 0), P1, P4), (p(b + c, 0), P2, P1), (p(b + c, b + c), P3, P2), (p(0, b + c), P4, P3)]
    for v, q, r in corners:
        s.append(f'<path d="M{_f(v[0])} {_f(v[1])} L{_f(q[0])} {_f(q[1])} L{_f(r[0])} {_f(r[1])} Z" class="s-fillsoft" stroke="var(--adj)" stroke-width="1.5"/>')
    s.append(f'<path d="M{_f(P1[0])} {_f(P1[1])} L{_f(P2[0])} {_f(P2[1])} L{_f(P3[0])} {_f(P3[1])} L{_f(P4[0])} {_f(P4[1])} Z" class="s-fillamb" stroke="var(--hip)" stroke-width="2.5"/>')
    cx, cy = o + L / 2, o + L / 2
    s.append(_text(cx, cy, "a²", "f-hip", 26, weight="800"))
    # rótulos dos lados externos
    s.append(_text(o + c * k / 2, o - 9, "c", "f-adj", 15, weight="700"))
    s.append(_text(o + c * k + b * k / 2, o - 9, "b", "f-op", 15, weight="700"))
    s.append(_text(o - 10, o + b * k / 2, "b", "f-op", 15, weight="700"))
    s.append(_text(o - 10, o + b * k + c * k / 2, "c", "f-adj", 15, weight="700"))
    s.append(side_label(P1, P2, "a", (cx, cy), "f-hip", 12))
    lx = L + 2 * o + 10
    s.append(_text(lx, 60, "lado do quadrado", anchor="start", size=13, cls="s-mut"))
    s.append(_text(lx, 80, "grande: b + c", anchor="start", size=14, weight="700"))
    s.append(_text(lx, 120, "4 triângulos", anchor="start", size=13, cls="s-mut"))
    s.append(_text(lx, 140, "de catetos b e c", anchor="start", size=14, weight="700"))
    s.append(_text(lx, 180, "no meio: quadrado", anchor="start", size=13, cls="s-mut"))
    s.append(_text(lx, 200, "de lado a", anchor="start", size=14, weight="700"))
    s.append("</svg>")
    return "".join(s)

def fig_45():
    P = {"C": (80, 40), "A": (80, 220), "B": (260, 220)}
    return triangle(P, sides={("C", "A"): ("b = 1", "s-op", "f-op"), ("A", "B"): ("c = 1", "s-adj", "f-adj"),
                              ("C", "B"): ("a = √2", "s-hip", "f-hip")},
                    right="A", arcs={"B": ("45°", 34), "C": ("45°", 30)}, vb=(0, 10, 340, 245),
                    title="Triângulo retângulo isósceles com catetos 1 e hipotenusa raiz de 2")

def fig_eq():
    L = 220; h = L * math.sqrt(3) / 2
    X0, Y0 = 60, 230
    B, C, T = (X0, Y0), (X0 + L, Y0), (X0 + L / 2, Y0 - h)
    M = (X0 + L / 2, Y0)
    s = ['<svg viewBox="0 20 360 240" role="img" aria-label="Triângulo equilátero de lado 2 dividido pela altura raiz de 3">']
    s.append(f'<path d="M{_f(B[0])} {_f(B[1])} L{_f(C[0])} {_f(C[1])} L{_f(T[0])} {_f(T[1])} Z" class="s-line"/>')
    s.append(_line(T, M, "s-line s-op", 'stroke-width="3" stroke-dasharray="6 4"'))
    s.append(right_mark(M, C, T, 11))
    s.append(arc(B, C, T, 30, "60°"))
    s.append(arc(C, B, T, 30, "60°"))
    s.append(arc(T, B, M, 30, "30°", lr=48, size=13))
    s.append(arc(T, C, M, 38, "30°", lr=56, size=13))
    s.append(_text((B[0] + M[0]) / 2, Y0 + 16, "1", "f-adj", 16, weight="700"))
    s.append(_text((M[0] + C[0]) / 2, Y0 + 16, "1", "f-adj", 16, weight="700"))
    s.append(_text((T[0] + C[0]) / 2 + 16, (T[1] + C[1]) / 2 - 6, "2", "f-hip", 16, weight="700"))
    s.append(_text((T[0] + B[0]) / 2 - 16, (T[1] + B[1]) / 2 - 6, "2", "f-hip", 16, weight="700"))
    s.append(_text(M[0] + 22, (T[1] + M[1]) / 2 + 20, "h = √3", "f-op", 15, weight="700"))
    s.append("</svg>")
    return "".join(s)

def fig_q1():
    P = {"B": (90, 40), "A": (90, 200), "C": (330, 200)}
    return triangle(P, sides={("B", "C"): ("2√17", "", "f-f")}, right="A", arcs={"B": ("", 22)},
                    vb=(40, 15, 330, 215), title="Figura da 1ª questão: triângulo retângulo em A, hipotenusa BC = 2 raiz de 17")

def fig_q3():
    P = {"C": (70, 40), "A": (70, 210), "B": (330, 210)}
    return triangle(P, sides={("C", "A"): ("b", "", "f-f"), ("C", "B"): ("a", "", "f-f"), ("A", "B"): ("c", "", "f-f")},
                    right="A", arcs={"B": ("35°", 38)}, vb=(20, 15, 360, 230),
                    title="Figura da 3ª questão: retângulo em A, ângulo B de 35 graus")

def fig_q4(ang_c=30):
    B, C = (40, 200), (360, 200)
    # A tal que o ângulo em A é reto e o ângulo em C vale ang_c
    t = math.radians(ang_c)
    BC = C[0] - B[0]
    AC = BC * math.cos(t)
    A = (C[0] - AC * math.cos(t), C[1] - AC * math.sin(t))
    H = (A[0], 200)
    s = ['<svg viewBox="0 0 400 240" role="img" aria-label="Triângulo retângulo em A com altura h relativa à hipotenusa, dividindo BC em x e y">']
    s.append(f'<path d="M{_f(B[0])} {_f(B[1])} L{_f(C[0])} {_f(C[1])} L{_f(A[0])} {_f(A[1])} Z" class="s-line"/>')
    s.append(_line(A, H, "s-dash", 'stroke="var(--f)"'))
    s.append(right_mark(A, B, C, 11))
    s.append(arc(C, B, A, 40, f"{ang_c}°", "s-ang", "f-f"))
    s.append(_text(A[0] - 12, (A[1] + H[1]) / 2, "h", "f-f", 16, weight="700"))
    s.append(_text((B[0] + H[0]) / 2, 214, "x", "f-f", 16, weight="700"))
    s.append(_text((H[0] + C[0]) / 2, 214, "y", "f-f", 16, weight="700"))
    s.append(_text(A[0], A[1] - 12, "A", size=15, weight="700"))
    s.append(_text(B[0] - 12, 206, "B", size=15, weight="700"))
    s.append(_text(C[0] + 12, 206, "C", size=15, weight="700"))
    s.append(_text(H[0] + 10, 188, "H", "s-mut", 12, weight="700"))
    s.append("</svg>")
    return "".join(s)

def fig_q5():
    s = ['<svg viewBox="0 0 420 240" role="img" aria-label="Esquema: prédio de altura H, observador a d metros vê o topo a 60 graus e, a d mais 30 metros, a 45 graus">']
    G = 205; Xp = 360; H = 150
    s.append(_line((10, G), (410, G), "s-ground"))
    s.append(f'<rect x="{Xp}" y="{G - H}" width="34" height="{H}" class="s-fillsoft" stroke="var(--ink)" stroke-width="1.5"/>')
    top = (Xp, G - H)
    P1 = (Xp - H / math.tan(math.radians(60)), G)
    P2 = (Xp - H, G)
    s.append(_line(P1, top, "s-line s-op", 'stroke-width="1.8"'))
    s.append(_line(P2, top, "s-line s-adj", 'stroke-width="1.8"'))
    s.append(arc(P1, (Xp, G), top, 26, "60°", "s-op", "f-op", lr=40))
    s.append(arc(P2, (Xp, G), top, 34, "45°", "s-adj", "f-adj", lr=50))
    for P, n in ((P1, "P₁"), (P2, "P₂")):
        s.append(f'<circle cx="{_f(P[0])}" cy="{_f(P[1])}" r="4" class="s-ink"/>')
        s.append(_text(P[0], G + 16, n, size=14, weight="700"))
    s.append(_text(Xp + 17 + 30, G - H / 2, "H", "f-hip", 17, weight="800"))
    # cotas
    y = G + 30
    s.append(_line((P2[0], y), (P1[0], y), "s-thin"))
    s.append(_text((P2[0] + P1[0]) / 2, y - 9, "30 m", size=13, weight="700"))
    s.append(_line((P1[0], y), (Xp, y), "s-thin"))
    s.append(_text((P1[0] + Xp) / 2, y - 9, "d", size=14, weight="700"))
    s.append(_line((P2[0], y - 5), (P2[0], y + 5), "s-thin")); s.append(_line((P1[0], y - 5), (P1[0], y + 5), "s-thin")); s.append(_line((Xp, y - 5), (Xp, y + 5), "s-thin"))
    s.append("</svg>")
    return "".join(s).replace('viewBox="0 0 420 240"', 'viewBox="0 30 420 220"')

def fig_q6():
    s = ['<svg viewBox="0 0 420 270" role="img" aria-label="Figura da 6ª questão: horizontal AB, ângulo beta acima até D, ângulo alfa abaixo até C, BC = h, CD = H">']
    A, B, C, D = (40, 150), (290, 150), (290, 245), (290, 25)
    s.append(f'<path d="M{A[0]} {A[1]} L{D[0]} {D[1]} L{C[0]} {C[1]} Z" class="s-line"/>')
    s.append(_line(A, B, "s-line"))
    s.append(right_mark(B, A, D, 10))
    s.append(arc(A, B, D, 62, "β", "s-ang", "f-f", lr=76))
    s.append(arc(A, B, C, 78, "α", "s-ang", "f-f", lr=92))
    for P, n, dx, dy in ((A, "A", -14, 0), (B, "B", 14, -10), (C, "C", 0, 16), (D, "D", 0, -13)):
        s.append(_text(P[0] + dx, P[1] + dy, n, size=15, weight="700"))
    # cotas
    s.append(_line((305, B[1]), (345, B[1]), "s-thin", 'stroke="var(--f)"'))
    s.append(_line((305, C[1]), (400, C[1]), "s-thin", 'stroke="var(--f)"'))
    s.append(_line((305, D[1]), (400, D[1]), "s-thin", 'stroke="var(--f)"'))
    s.append(_line((330, B[1]), (330, C[1]), "s-thin", 'stroke="var(--f)"'))
    s.append(_line((385, D[1]), (385, C[1]), "s-thin", 'stroke="var(--f)"'))
    s.append(_text(318, (B[1] + C[1]) / 2, "h", "f-f", 15, weight="700"))
    s.append(_text(372, (D[1] + C[1]) / 2, "H", "f-f", 15, weight="700"))
    s.append("</svg>")
    return "".join(s)

def fig_q7():
    k = 52; G = 262; W = 300
    th = math.radians(20)
    s = ['<svg viewBox="120 15 300 270" role="img" aria-label="Esquema: parede de 4 m, escada de 3 m fazendo 20 graus com a parede, apoiada sobre um suporte de altura s">']
    s.append(_line((10, G), (410, G), "s-ground"))
    s.append(f'<rect x="{W}" y="{G - 4*k}" width="22" height="{4*k}" class="s-fillsoft" stroke="var(--ink)" stroke-width="1.5"/>')
    s.append(f'<path d="M{W - 30} {G - 4*k} L{W + 60} {G - 4*k - 30} L{W + 110} {G - 4*k}" class="s-line" fill="none"/>')
    top = (W, G - 4 * k)
    base = (W - 3 * k * math.sin(th), top[1] + 3 * k * math.cos(th))
    sh = G - base[1]
    s.append(f'<rect x="{_f(base[0] - 26)}" y="{_f(base[1])}" width="40" height="{_f(sh)}" class="s-fillamb" stroke="var(--amber)" stroke-width="1.5"/>')
    s.append(_line(base, top, "s-line s-hip", 'stroke-width="4"'))
    s.append(_line((W, base[1]), top, "s-dash"))
    s.append(_line(base, (W, base[1]), "s-dash"))
    s.append(arc(top, base, (W, base[1]), 44, "20°", lr=60))
    mid = (base[0] + (top[0] - base[0]) * .3, base[1] + (top[1] - base[1]) * .3)
    s.append(_text(mid[0] - 26, mid[1], "3 m", "f-hip", 16, weight="800"))
    s.append(_text(W + 40, G - 2 * k, "4 m", size=15, weight="700"))
    s.append(_text(base[0] - 44, base[1] + sh / 2, "s = ?", "f-amb", 15, weight="800"))
    s.append(_text(W - 12, top[1] + .72 * (base[1] - top[1]), "v", "f-adj", 15, weight="700"))
    s.append("</svg>")
    return "".join(s)

def fig_elevacao():
    s = ['<svg viewBox="0 0 420 230" role="img" aria-label="Ângulo de elevação medido da horizontal para cima e ângulo de depressão medido da horizontal para baixo">']
    O = (60, 170); T = (360, 50); Bt = (360, 170)
    s.append(_line((20, 200), (410, 200), "s-ground"))
    s.append(_line(O, (380, 170), "s-dash"))
    s.append(_line(O, T, "s-line s-op"))
    s.append(f'<circle cx="{O[0]}" cy="{O[1]}" r="5" class="s-ink"/>')
    s.append(_line((O[0], O[1]), (O[0], 200), "s-thin"))
    s.append(arc(O, (380, 170), T, 60, "θ (elevação)", lr=100, size=13))
    s.append(f'<circle cx="{T[0]}" cy="{T[1]}" r="5" class="s-ink"/>')
    s.append(_line(T, (140, 50), "s-dash"))
    s.append(arc(T, (140, 50), O, 60, "θ (depressão)", lr=108, size=13))
    s.append(_text(O[0], O[1] - 16, "observador", "s-mut", 12))
    s.append(_text(T[0] + 8, T[1] - 16, "topo", "s-mut", 12))
    s.append(_text(230, 185, "horizontal", "s-mut", 12))
    s.append("</svg>")
    return "".join(s)

FIGS = {
    "notacao": fig_notacao, "semelhanca": fig_semelhanca, "pitagoras": fig_pitagoras,
    "45": fig_45, "eq": fig_eq, "q1": fig_q1, "q3": fig_q3, "q4": fig_q4,
    "q4_45": lambda: fig_q4(45), "q5": fig_q5, "q6": fig_q6, "q7": fig_q7, "elevacao": fig_elevacao,
}

# ------------------------------------------------------------ Lista de Revisão e Avaliações
def fig_rev1():
    P0, Q, R, T = (40, 200), (230, 200), (340, 200), (340, 30)
    s = ['<svg viewBox="10 10 380 220" role="img" aria-label="Triângulo com ângulo de 30 graus, hipotenusa 40, ângulo externo de 60 graus e distância x">']
    s.append(_line(P0, R)); s.append(_line(P0, T)); s.append(_line(Q, T)); s.append(_line(R, T))
    s.append(right_mark(R, P0, T, 11))
    s.append(arc(P0, R, T, 40, "30°", "s-ang", "f-ang"))
    s.append(arc(Q, R, T, 26, "60°", "s-ang", "f-ang", lr=42))
    s.append(side_label(P0, T, "40", (230, 160), "f-hip"))
    s.append(_line((Q[0], 214), (R[0], 214), "s-thin")); s.append(_text((Q[0] + R[0]) / 2, 226, "x", "f-f", 16, weight="800"))
    s.append("</svg>"); return "".join(s)
def fig_rev2():
    A, B, C = (60, 200), (360, 200), (60, 40)
    M = ((B[0] + C[0]) / 2, (B[1] + C[1]) / 2)
    s = ['<svg viewBox="20 20 380 210" role="img" aria-label="Triângulo retângulo em A com M ponto médio de BC">']
    s.append(f'<path d="M{A[0]} {A[1]} L{B[0]} {B[1]} L{C[0]} {C[1]} Z" class="s-line"/>'); s.append(_line(A, M, "s-line s-hip", 'stroke-width="2.5"'))
    s.append(right_mark(A, B, C, 11)); s.append(arc(C, A, B, 26, "60°", "s-ang", "f-ang", lr=42)); s.append(arc(M, C, A, 22, "60°", "s-ang", "f-ang", lr=36))
    s.append(_text(A[0] - 12, A[1] + 6, "A", weight="700")); s.append(_text(B[0] + 12, B[1] + 6, "B", weight="700")); s.append(_text(C[0] - 12, C[1] - 4, "C", weight="700")); s.append(_text(M[0] + 10, M[1] - 12, "M", weight="700"))
    s.append(_text((A[0] + B[0]) / 2, 216, "AB = 12 cm", "f-adj", 14, weight="700"))
    s.append("</svg>"); return "".join(s)
def fig_rev3():
    s = ['<svg viewBox="0 10 420 250" role="img" aria-label="Prédio e observador a 12 m de distância e 12 m de altura, ângulo total de 75 graus">']
    G = 240; X = 150; O = (X + 12 * 12, G - 12 * 12)
    s.append(_line((10, G), (410, G), "s-ground"))
    top = (X, G - (12 + 12 * 0.57735) * 12)
    s.append(f'<rect x="{X-90}" y="{top[1]:.1f}" width="90" height="{G-top[1]:.1f}" class="s-fillsoft" stroke="var(--ink)" stroke-width="1.5"/>')
    s.append(_line(O, (X, O[1]), "s-dash")); s.append(_line(O, (X, G), "s-line s-adj", 'stroke-width="2"')); s.append(_line(O, top, "s-line s-op", 'stroke-width="2"'))
    s.append(arc(O, (X, O[1]), top, 30, "30°", "s-ang", "f-ang", lr=46)); s.append(arc(O, (X, O[1]), (X, G), 44, "45°", "s-ang", "f-ang", lr=62))
    s.append(_text(O[0] + 10, O[1], "O", weight="800", anchor="start"))
    s.append(_line((X + 8, O[1]), (X + 8, G), "s-thin")); s.append(_text(X + 22, (O[1] + G) / 2, "12 m", size=13, weight="700", anchor="start"))
    s.append(_text((X + O[0]) / 2, O[1] - 12, "12 m", size=13, weight="700"))
    s.append(_text(X - 45, top[1] - 12, "topo", "s-mut", 12))
    s.append("</svg>"); return "".join(s)
def fig_rev4():
    import math
    cx, cy, R = 200, 130, 100
    A = (cx + R, cy); D = (cx - R, cy)
    ang = math.radians(210)
    B = (cx + R * math.cos(ang), cy - R * math.sin(ang)); C = (B[0], cy)
    s = ['<svg viewBox="70 20 280 220" role="img" aria-label="Circunferência de raio 1, corda AB fazendo 15 graus com o diâmetro, BC perpendicular ao diâmetro">']
    s.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" class="s-line"/>'); s.append(_line(D, A, "s-line")); s.append(_line(A, B, "s-line s-hip", 'stroke-width="2.2"')); s.append(_line(B, C, "s-line s-op", 'stroke-width="3"'))
    s.append(_line((cx, cy), B, "s-dash"))
    s.append(right_mark(C, A, B, 9)); s.append(arc(A, D, B, 50, "15°", "s-ang", "f-ang", lr=66))
    s.append(f'<circle cx="{cx}" cy="{cy}" r="3" class="s-ink"/>')
    for P0, n, dx, dy in ((A, "A", 12, 0), (B, "B", -12, 8), (C, "C", -12, -10), ((cx, cy), "O", 0, -12)):
        s.append(_text(P0[0] + dx, P0[1] + dy, n, weight="700"))
    s.append("</svg>"); return "".join(s)
def fig_p1q2():
    s = ['<svg viewBox="0 0 420 260" role="img" aria-label="Rio de margens paralelas: A na margem próxima a 3 m da margem M, B na margem oposta, C a 30 m de A, ângulo BCA de 70 graus">']
    A, M, B, C = (120, 235), (120, 205), (120, 30), (270, 235)
    s.append(_line((10, 215), (410, 185), "s-thin")); s.append(_line((10, 45), (410, 15), "s-thin"))
    s.append(f'<path d="M10 45 L410 15 L410 185 L10 215 Z" style="fill:var(--pri-soft);opacity:.5"/>')
    s.append(_line(A, B, "s-line")); s.append(_line(A, C, "s-line")); s.append(_line(B, C, "s-dash"))
    s.append(right_mark(A, B, C, 11)); s.append(arc(C, A, B, 34, "70°", "s-ang", "f-ang", lr=52))
    for P0, n, dx, dy in ((A, "A", -12, 8), (M, "M", -14, -6), (B, "B", -12, -4), (C, "C", 12, 8)):
        s.append(_text(P0[0] + dx, P0[1] + dy, n, weight="700"))
    s.append(_text(195, 250, "30 m", size=13, weight="700")); s.append(_text(132, 222, "3 m", size=12, weight="700", anchor="start")); s.append(_text(132, 110, "x (largura)", "f-f", 13, weight="700", anchor="start"))
    s.append(_text(300, 120, "rio", "s-mut", 14))
    s.append("</svg>"); return "".join(s)
def fig_p2q1():
    import math
    E = (100, 210); A = (100, 60); k = 37.5
    ang = math.radians(45)
    B = (A[0] + 5 * k * math.sin(ang), A[1] + 5 * k * math.cos(ang))
    s = ['<svg viewBox="30 20 340 220" role="img" aria-label="Estação, lago A a 4 km e lago B a 5 km do lago A, formando 45 graus">']
    s.append(_line(E, A, "s-line s-adj", 'stroke-width="2.5"')); s.append(_line(A, B, "s-line s-hip", 'stroke-width="2.5"')); s.append(_line(E, B, "s-dash", 'stroke="var(--bad)"'))
    s.append(arc(A, E, B, 28, "45°", "s-ang", "f-ang", lr=44))
    s.append(_text(E[0] - 8, E[1] + 16, "Estação", size=13, weight="700")); s.append(_text(A[0], A[1] - 14, "Lago A", size=13, weight="700")); s.append(_text(B[0] + 8, B[1] + 16, "Lago B", size=13, weight="700"))
    s.append(_text(A[0] - 22, (A[1] + E[1]) / 2, "4 km", "f-adj", 13, weight="700")); s.append(side_label(A, B, "5 km", (130, 170), "f-hip")); s.append(_text((E[0] + B[0]) / 2, (E[1] + B[1]) / 2 + 16, "a = ?", "f-f", 14, weight="800"))
    s.append("</svg>"); return "".join(s)
def fig_p2q3():
    import math
    ox, oy, kx, ky = 40, 120, 300 / (4 * math.pi), 24
    s = ['<svg viewBox="0 0 380 240" role="img" aria-label="Gráfico de f com máximo 4, mínimo −4 e zeros em múltiplos de π/2">']
    for y in range(-4, 5):
        s.append(_line((ox, oy - y * ky), (ox + 300, oy - y * ky), "s-thin", 'stroke-dasharray="3 4" stroke-opacity=".6"'))
        if y: s.append(_text(ox - 8, oy - y * ky, str(y), "s-mut", 11, anchor="end"))
    labs = ["π/2", "π", "3π/2", "2π", "5π/2", "3π", "7π/2", "4π"]
    for i, l in enumerate(labs, 1):
        X = ox + i * math.pi / 2 * kx
        s.append(_line((X, oy - 4 * ky), (X, oy + 4 * ky), "s-thin", 'stroke-dasharray="3 4" stroke-opacity=".6"'))
        s.append(_text(X, oy + 14, l, "s-mut", 10))
    s.append(_line((ox, oy), (ox + 310, oy), "s-line")); s.append(_line((ox, oy - 110), (ox, oy + 110), "s-line"))
    pts = " L".join(f"{ox + t * kx:.1f} {oy - 4 * math.sin(2 * t) * ky:.1f}" for t in [4 * math.pi * i / 400 for i in range(401)])
    s.append(f'<path d="M{pts}" fill="none" stroke="var(--c-sen)" stroke-width="2.5"/>')
    s.append(_text(ox - 6, 10, "f", "s-mut", 12)); s.append(_text(ox + 318, oy, "t", "s-mut", 12, anchor="start"))
    s.append("</svg>"); return "".join(s)
FIGS.update({"rev1": fig_rev1, "rev2": fig_rev2, "rev3": fig_rev3, "rev4": fig_rev4, "p1q2": fig_p1q2, "p2q1": fig_p2q1, "p2q3": fig_p2q3})
