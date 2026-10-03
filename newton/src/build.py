"""Monta a apostila num único HTML autocontido (KaTeX e fontes embutidos).

Uso:  python3 build.py        -> gera ../dist/apostila-binomio-cap2.html e o ZIP
"""
import base64, glob, os, re, zipfile, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
FIGS = {}
import listas

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
    out = os.path.join(dist, "apostila-binomio-cap2.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(t)
    zpath = os.path.join(dist, "apostila-binomio-cap2.zip")
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        z.write(out, "apostila-binomio-cap2/apostila-binomio-cap2.html")
        z.write(os.path.join(HERE, "..", "LEIA-ME.txt"), "apostila-binomio-cap2/LEIA-ME.txt")
        z.write(os.path.join(HERE, "vendor/katex/LICENSE"), "apostila-binomio-cap2/licencas/KaTeX-LICENSE.txt")
    print(out, os.path.getsize(out) // 1024, "KB")
    print(zpath, os.path.getsize(zpath) // 1024, "KB")

if __name__ == "__main__":
    build()
