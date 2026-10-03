"""Monta a apostila num único HTML autocontido (KaTeX e fontes embutidos).

Uso:  python3 build.py        -> gera ../dist/apostila-conjuntos.html e o ZIP
"""
import base64, glob, os, re, zipfile, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
FIGS = {}
import listas, gen
def _fig(svgs, cap):
    return '<figure class="fig"><div class="sk-wrap">' + "".join(svgs) + '</div><figcaption>' + cap + '</figcaption></figure>'
V = gen.venn
FIGS["ops2"] = lambda: _fig([V(lambda e: e["A"] or e["B"], title="A ∪ B"), V(lambda e: e["A"] and e["B"], title="A ∩ B")], "União: tudo que está em pelo menos um. Interseção: só o que está nos dois (a “lente”).")
FIGS["casos"] = lambda: _fig([V(lambda e: e["A"] and e["B"], title="A ∩ B ≠ ∅"), V(lambda e: e["A"] and e["B"], geo={"A": (78, 100, 56), "B": (202, 100, 56)}, title="disjuntos: A ∩ B = ∅"),
    V(lambda e: e["A"] and e["B"], geo={"A": (140, 108, 78), "B": (150, 115, 38)}, title="B ⊂ A: A ∩ B = B")], "As três situações possíveis entre dois conjuntos.")
FIGS["dif"] = lambda: _fig([V(lambda e: e["A"] and not e["B"], title="A − B"), V(lambda e: e["B"] and not e["A"], title="B − A"), V(lambda e: not e["A"], title="Ā = U − A")], "Diferença: tire de A o que é de B. Complementar: tudo que está fora (dentro de U).")
FIGS["demorgan"] = lambda: _fig([V(lambda e: not (e["A"] or e["B"]), title="(A ∪ B)‾ = Ā ∩ B̄"), V(lambda e: not (e["A"] and e["B"]), title="(A ∩ B)‾ = Ā ∪ B̄")], "Leis de De Morgan: o complementar troca ∪ por ∩ (e vice-versa) e complementa cada parte.")
FIGS["difsim"] = lambda: _fig([V(lambda e: e["A"] != e["B"], title="A Δ B = (A − B) ∪ (B − A)")], "Diferença simétrica: está em exatamente um dos dois. Também é (A ∪ B) − (A ∩ B).")
FIGS["distrib"] = lambda: _fig([V(lambda e: e["A"] and (e["B"] or e["C"]), ("A","B","C"), title="A ∩ (B ∪ C)"), V(lambda e: (e["A"] and e["B"]) or (e["A"] and e["C"]), ("A","B","C"), title="(A ∩ B) ∪ (A ∩ C)")], "Distributiva: as duas expressões pintam exatamente a mesma região.")
FIGS["regioes3"] = lambda: _fig([gen.venn_nums({"A": "1", "B": "2", "C": "3", "AB": "4", "AC": "5", "BC": "6", "ABC": "7"}, ("A","B","C"), out_val="8")], "Três conjuntos dividem U em 8 regiões. Na inclusão-exclusão, preenchemos da região 7 (centro) para fora.")

def rd(p):
    with open(os.path.join(HERE, p), encoding="utf-8") as f:
        return f.read()

def katex_css():
    css = rd("vendor/katex/katex.min.css")
    def repl(m):
        name = m.group(1)
        with open(os.path.join(HERE, "vendor/katex/fonts", name + ".woff2"), "rb") as f:
            b64 = base64.b64encode(f.read()).decode()
        return f'src:url(data:font/woff2;base64,{b64}) format("woff2")'
    css, n = re.subn(r'src:url\(fonts/([A-Za-z0-9_-]+)\.woff2\) format\("woff2"\)(?:,url\([^)]*\) format\("[a-z]+"\))*', repl, css)
    assert n >= 15, n
    return css

def content():
    parts = [rd(os.path.relpath(p, HERE)) for p in sorted(glob.glob(os.path.join(HERE, "content", "*.html")))]
    html = "\n".join(parts)
    html = re.sub(r"\{\{FIG:([a-z0-9_]+)\}\}", lambda m: FIGS[m.group(1)](), html)
    return html

def build():
    listas.build()
    t = rd("template.html")
    reps = {
        "/*KATEX_CSS*/": katex_css(),
        "/*APP_CSS*/": rd("style.css"),
        "<!--CONTENT-->": content(),
        "/*KATEX_JS*/": rd("vendor/katex/katex.min.js"),
        "/*AUTORENDER_JS*/": rd("vendor/katex/auto-render.min.js"),
        "/*WIDGETS_JS*/": rd("widgets.js"),
        "/*APP_JS*/": rd("app.js"),
    }
    for k, v in reps.items():
        assert k in t, k
        t = t.replace(k, v.replace("</script>", "<\\/script>") if k.endswith("JS*/") else v)
    dist = os.path.join(HERE, "..", "dist")
    os.makedirs(dist, exist_ok=True)
    out = os.path.join(dist, "apostila-conjuntos.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(t)
    zpath = os.path.join(dist, "apostila-conjuntos.zip")
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        z.write(out, "apostila-conjuntos/apostila-conjuntos.html")
        z.write(os.path.join(HERE, "..", "LEIA-ME.txt"), "apostila-conjuntos/LEIA-ME.txt")
        z.write(os.path.join(HERE, "vendor/katex/LICENSE"), "apostila-conjuntos/licencas/KaTeX-LICENSE.txt")
    print(out, os.path.getsize(out) // 1024, "KB")
    print(zpath, os.path.getsize(zpath) // 1024, "KB")

if __name__ == "__main__":
    build()
