"""Geradores de resoluções passo a passo (LaTeX) para determinantes, adjunta, Cramer e vetores.
Todas as contas são feitas com sympy (frações exatas) e o texto é montado a partir delas."""
from sympy import Matrix, Rational, latex, gcd, sympify, simplify, eye, factor
import functools

def st(label, text, m=None):
    h = f'<div class="st"><span class="pl">{label}</span>'
    if text: h += f"<p>{text}</p>"
    if m: h += f'<div class="m">\\[{m}\\]</div>'
    return h + "</div>"

def L(x):
    return latex(sympify(x))

def mat(A, br="b"):
    A = Matrix(A)
    rows = r"\\".join("&".join(L(A[i, j]) for j in range(A.cols)) for i in range(A.rows))
    return r"\begin{%smatrix}%s\end{%smatrix}" % (br, rows, br)

def dm(A):
    return mat(A, "v")

def vec(v):
    return "(" + ",\\ ".join(L(x) for x in v) + ")"

def coef(c):
    """coeficiente na frente de um determinante"""
    c = sympify(c)
    if c == 1: return ""
    if c == -1: return "-"
    s = L(c)
    return (r"\left(" + s + r"\right)") if (c < 0 or not c.is_integer) else s

def rowop_txt(i, j, k):
    k = sympify(k)
    if k < 0:
        return rf"\(L_{i+1}\leftarrow L_{i+1}+{L(-k)}L_{j+1}\)"
    return rf"\(L_{i+1}\leftarrow L_{i+1}-{L(k)}L_{j+1}\)"

def det_rowred(A, factor_rows=True, intro=True):
    """Redução por linhas a triangular superior, acompanhando o fator c com det(A)=c·det(atual)."""
    A = Matrix(A); n = A.rows; c = sympify(1); cur = A.copy(); out = []
    if intro:
        out.append(st("Estratégia", r"Levar a matriz à forma triangular superior com operações elementares, anotando o efeito de cada uma: trocar linhas muda o sinal; tirar um fator comum de uma linha o coloca para fora; somar a uma linha um múltiplo de outra <b>não</b> muda o determinante. No fim, o determinante de uma triangular é o produto da diagonal."))
    k = 1
    for col in range(n):
        # pivô
        piv = None
        for r in range(col, n):
            if cur[r, col] != 0:
                piv = r; break
        if piv is None:
            out.append(st(f"Passo {k}", rf"A coluna {col+1} não tem pivô (só zeros da diagonal para baixo): a matriz triangular terá um zero na diagonal.", rf"\det(A)={coef(c)}{dm(cur)}=0"))
            return out, sympify(0)
        if piv != col:
            cur.row_swap(piv, col); c = -c
            out.append(st(f"Passo {k}", rf"Trocamos \(L_{col+1}\leftrightarrow L_{piv+1}\) para ter um pivô não nulo (o determinante troca de sinal).", rf"\det(A)={coef(c)}{dm(cur)}")); k += 1
        if factor_rows:
            row = [cur[col, j] for j in range(n)]
            if all(sympify(x).is_integer for x in row):
                g = functools.reduce(gcd, [abs(x) for x in row if x != 0] or [1])
                if g > 1 and col < n - 1:
                    cur[col, :] = cur[col, :] / g; c = c * g
                    out.append(st(f"Passo {k}", rf"Colocamos o fator comum \({L(g)}\) da linha {col+1} para fora do determinante.", rf"\det(A)={coef(c)}{dm(cur)}")); k += 1
        ops = []
        for r in range(col + 1, n):
            if cur[r, col] != 0:
                m = cur[r, col] / cur[col, col]
                cur[r, :] = cur[r, :] - m * cur[col, :]
                ops.append(rowop_txt(r, col, m))
        if ops:
            out.append(st(f"Passo {k}", "Zeramos abaixo do pivô: " + ", ".join(ops) + " (não muda o determinante).", rf"\det(A)={coef(c)}{dm(cur)}")); k += 1
    d = c * functools.reduce(lambda a, b: a * b, [cur[i, i] for i in range(n)], 1)
    diag = r"\cdot".join(r"\left(" + L(cur[i, i]) + r"\right)" if cur[i, i] < 0 else L(cur[i, i]) for i in range(n))
    pre = "" if c == 1 else ("-" if c == -1 else coef(c) + r"\cdot")
    out.append(st("Triangular: produto da diagonal", "", r"\det(A)=" + pre + diag + "=" + L(d)))
    assert simplify(d - A.det()) == 0
    return out, d

def det2_txt(A):
    A = Matrix(A); a, b, c, d = A[0, 0], A[0, 1], A[1, 0], A[1, 1]
    def p(x): return r"\left(" + L(x) + r"\right)" if sympify(x).is_number and sympify(x) < 0 else L(x)
    return rf"{dm(A)}={p(a)}\cdot{p(d)}-{p(b)}\cdot{p(c)}={L(A.det())}"

def det_cof(A, along=None):
    """Expansão em cofatores (3x3 ou 4x4 com zeros), escolhendo a linha/coluna com mais zeros."""
    A = Matrix(A); n = A.rows; out = []
    if n == 2:
        out.append(st("Fórmula 2×2", r"\(ad-bc\): diagonal principal menos diagonal secundária.", det2_txt(A))); return out, A.det()
    if along is None:
        best = None
        for i in range(n):
            z = sum(1 for j in range(n) if A[i, j] == 0)
            if best is None or z > best[0]: best = (z, "l", i)
        for j in range(n):
            z = sum(1 for i in range(n) if A[i, j] == 0)
            if z > best[0]: best = (z, "c", j)
        along = best[1:]
    kind, idx = along
    terms = []; parts = []; total = 0
    for t in range(n):
        i, j = (idx, t) if kind == "l" else (t, idx)
        a = A[i, j]
        if a == 0: continue
        Mij = A.minor_submatrix(i, j); s = (-1) ** (i + j)
        mval = Mij.det(); total += a * s * mval
        terms.append(("+" if s * a > 0 else "-") + (L(abs(a)) if abs(a) != 1 else "") + dm(Mij))
        parts.append((a, s, mval))
    nome = f"linha {idx+1}" if kind == "l" else f"coluna {idx+1}"
    out.append(st("Escolha", rf"Expandimos pela {nome} (a que tem mais zeros). Sinais do tabuleiro: \(C_{{ij}}=(-1)^{{i+j}}M_{{ij}}\)."))
    out.append(st("Expansão", "", r"\det(A)=" + "".join(terms).lstrip("+")))
    vals = " ".join(("+" if s * a >= 0 else "-") + rf"{L(abs(a))}\cdot({L(mval)})" for a, s, mval in parts).lstrip("+")
    out.append(st("Calcule os menores", "", vals + "=" + L(total)))
    assert simplify(total - A.det()) == 0
    return out, total

def adj_steps(A, label_inv=True):
    A = Matrix(A); n = A.rows; out = []
    d = A.det()
    C = Matrix(n, n, lambda i, j: (-1) ** (i + j) * A.minor_submatrix(i, j).det())
    lst = r",\quad ".join(rf"C_{{{i+1}{j+1}}}={L(C[i, j])}" for i in range(n) for j in range(n))
    out.append(st("Cofatores", r"\(C_{ij}=(-1)^{i+j}M_{ij}\), em que \(M_{ij}\) é o determinante que sobra ao apagar a linha \(i\) e a coluna \(j\).", lst))
    out.append(st("Adjunta = transposta da matriz de cofatores", "", r"\operatorname{adj}(A)=" + mat(C.T)))
    out.append(st("Determinante", r"Expandindo pela 1ª linha com os cofatores já calculados: \(\det A=a_{11}C_{11}+a_{12}C_{12}+\dots\)", r"\det(A)=" + "+".join(rf"({L(A[0, j])})({L(C[0, j])})" for j in range(n)) + "=" + L(d)))
    if d != 0 and label_inv:
        inv = C.T / d
        out.append(st("Inversa", "", r"A^{-1}=\frac{1}{\det A}\operatorname{adj}(A)=\frac{1}{" + L(d) + "}" + mat(C.T) + "=" + mat(inv)))
        assert inv == A.inv()
    return out, d

def cramer_steps(A, b, xs=None):
    A = Matrix(A); b = Matrix(b); n = A.rows; out = []
    xs = xs or [f"x_{i+1}" for i in range(n)]
    d = A.det()
    out.append(st("Matriz dos coeficientes", "", r"A=" + mat(A) + r",\qquad \det(A)=" + L(d)))
    if d == 0:
        out.append(st("Cramer não se aplica", r"Como \(\det(A)=0\), a regra de Cramer não pode ser usada (o sistema pode ser impossível ou ter infinitas soluções)."))
        return out, None
    sol = []
    for j in range(n):
        Aj = A.copy(); Aj[:, j] = b; dj = Aj.det(); sol.append(dj / d)
        out.append(st(rf"\({xs[j]}\)", rf"Troque a coluna {j+1} de \(A\) pela coluna \(\mathbf b\):", rf"A_{j+1}={mat(Aj)},\quad \det(A_{j+1})={L(dj)},\quad {xs[j]}=\frac{{{L(dj)}}}{{{L(d)}}}={L(dj/d)}"))
    assert A * Matrix(sol) == b
    return out, sol

# ---------------------------------------------------------------- esboços em SVG
def _f(x): return float(sympify(x))

def svg2d(vecs, pts=(), size=220):
    """vecs: lista de (origem, ponta, rótulo). pts: lista de (ponto, rótulo). Eixos com grade."""
    xs = [0] + [_f(c) for o, p, _ in vecs for c in (o[0], p[0])] + [_f(p[0]) for p, _ in pts]
    ys = [0] + [_f(c) for o, p, _ in vecs for c in (o[1], p[1])] + [_f(p[1]) for p, _ in pts]
    R = max(1, max(abs(v) for v in xs + ys)) + 1
    s = size / (2 * R); c = size / 2
    X = lambda x: c + _f(x) * s; Y = lambda y: c - _f(y) * s
    g = []
    for k in range(-int(R), int(R) + 1):
        g.append(f'<line x1="{X(k):.1f}" y1="0" x2="{X(k):.1f}" y2="{size}" stroke="var(--line)" stroke-width="0.6"/>')
        g.append(f'<line x1="0" y1="{Y(k):.1f}" x2="{size}" y2="{Y(k):.1f}" stroke="var(--line)" stroke-width="0.6"/>')
    g.append(f'<line x1="0" y1="{c}" x2="{size}" y2="{c}" stroke="var(--muted)" stroke-width="1.2"/><line x1="{c}" y1="0" x2="{c}" y2="{size}" stroke="var(--muted)" stroke-width="1.2"/>')
    g.append(f'<text x="{size-10}" y="{c-4}" font-size="11" fill="var(--muted)">x</text><text x="{c+5}" y="11" font-size="11" fill="var(--muted)">y</text>')
    for o, p, lab in vecs:
        g.append(f'<line x1="{X(o[0]):.1f}" y1="{Y(o[1]):.1f}" x2="{X(p[0]):.1f}" y2="{Y(p[1]):.1f}" stroke="var(--pri)" stroke-width="2.4" marker-end="url(#ah)"/>')
        g.append(f'<text x="{X(p[0])+5:.1f}" y="{Y(p[1])-5:.1f}" font-size="11" font-weight="700" fill="var(--pri)">{lab}</text>')
    for p, lab in pts:
        g.append(f'<circle cx="{X(p[0]):.1f}" cy="{Y(p[1]):.1f}" r="3.5" fill="var(--acc, var(--pri))"/><text x="{X(p[0])+5:.1f}" y="{Y(p[1])+13:.1f}" font-size="10.5" fill="var(--ink)">{lab}</text>')
    defs = '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--pri)"/></marker></defs>'
    return f'<svg class="sk" viewBox="0 0 {size} {size}" width="{size}" height="{size}" role="img" aria-label="esboço">{defs}{"".join(g)}</svg>'

def svg3d(vecs=(), pts=(), size=230):
    """Projeção oblíqua: x aponta para baixo-esquerda, y para a direita, z para cima. Pontos com linhas de chamada."""
    allc = [abs(_f(c)) for o, p, _ in vecs for c in list(o) + list(p)] + [abs(_f(c)) for p, _ in pts for c in p] + [1]
    R = max(allc) + 1
    s = size / (2.6 * R); cx, cy = size * 0.48, size * 0.55
    def P(v):
        x, y, z = (_f(t) for t in v)
        return cx + y * s - x * s * 0.55, cy - z * s + x * s * 0.45
    g = []
    for axis, lab in (((R, 0, 0), "x"), ((0, R, 0), "y"), ((0, 0, R), "z")):
        a = P(axis); b = P(tuple(-t for t in axis))
        g.append(f'<line x1="{b[0]:.1f}" y1="{b[1]:.1f}" x2="{a[0]:.1f}" y2="{a[1]:.1f}" stroke="var(--muted)" stroke-width="1.1"/><text x="{a[0]+3:.1f}" y="{a[1]+4:.1f}" font-size="11" fill="var(--muted)">{lab}</text>')
    def guide(p):
        x, y, z = p
        q1 = P((x, 0, 0)); q2 = P((x, y, 0)); q3 = P((x, y, z)); q0 = P((0, y, 0))
        return (f'<path d="M{q1[0]:.1f} {q1[1]:.1f}L{q2[0]:.1f} {q2[1]:.1f}L{q0[0]:.1f} {q0[1]:.1f}M{q2[0]:.1f} {q2[1]:.1f}L{q3[0]:.1f} {q3[1]:.1f}" '
                f'fill="none" stroke="var(--muted)" stroke-dasharray="3 3" stroke-width="0.9"/>')
    for p, lab in pts:
        g.append(guide(p)); q = P(p)
        g.append(f'<circle cx="{q[0]:.1f}" cy="{q[1]:.1f}" r="3.5" fill="var(--pri)"/><text x="{q[0]+5:.1f}" y="{q[1]-5:.1f}" font-size="10.5" font-weight="700" fill="var(--ink)">{lab}</text>')
    for o, p, lab in vecs:
        g.append(guide(p)); a = P(o); b = P(p)
        g.append(f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="var(--pri)" stroke-width="2.4" marker-end="url(#ah3)"/><text x="{b[0]+5:.1f}" y="{b[1]-5:.1f}" font-size="11" font-weight="700" fill="var(--pri)">{lab}</text>')
    defs = '<defs><marker id="ah3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--pri)"/></marker></defs>'
    return f'<svg class="sk" viewBox="0 0 {size} {size}" width="{size}" height="{size}" role="img" aria-label="esboço 3D">{defs}{"".join(g)}</svg>'

def combo(A, depth=0):
    """Combina operações com linhas e expansão em cofatores: zera uma coluna usando um pivô e expande."""
    A = Matrix(A); n = A.rows; out = []
    if n <= 3:
        o, d = det_cof(A); return o, d
    # escolhe a coluna com mais zeros e, nela, um pivô ±1 se houver
    bestj = max(range(n), key=lambda j: (sum(1 for i in range(n) if A[i, j] == 0), any(abs(A[i, j]) == 1 for i in range(n))))
    rows = [i for i in range(n) if A[i, bestj] != 0]
    if not rows:
        out.append(st("Coluna nula", rf"A coluna {bestj+1} só tem zeros, logo o determinante é 0.")); return out, 0
    piv = min(rows, key=lambda i: (abs(A[i, bestj]) != 1, abs(A[i, bestj])))
    B = A.copy(); ops = []
    for i in rows:
        if i == piv: continue
        m = B[i, bestj] / B[piv, bestj]
        B[i, :] = B[i, :] - m * B[piv, :]; ops.append(rowop_txt(i, piv, m))
    if ops:
        out.append(st("Operações com linhas", "Usando a linha " + str(piv + 1) + " como pivô, zeramos o resto da coluna " + str(bestj + 1) + ": " + ", ".join(ops) + " (não muda o determinante).", r"\det(A)=" + dm(B)))
    s = (-1) ** (piv + bestj); a = B[piv, bestj]; Mn = B.minor_submatrix(piv, bestj)
    out.append(st("Expansão pela coluna " + str(bestj + 1), rf"Só sobrou um termo: \((-1)^{{{piv+1}+{bestj+1}}}\cdot {L(a)}\cdot M_{{{piv+1}{bestj+1}}}\).", r"\det(A)=" + ("-" if s * a < 0 else "") + (L(abs(a)) if abs(a) != 1 else "") + dm(Mn)))
    o, dd = combo(Mn, depth + 1); out += o
    d = s * a * dd
    out.append(st("Resultado", "", r"\det(A)=" + L(s * a) + r"\cdot(" + L(dd) + ")=" + L(d)))
    assert simplify(d - A.det()) == 0
    return out, d
