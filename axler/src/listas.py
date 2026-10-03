"""Gera content/20_listas.html com as listas de exercícios (enunciado, resposta e resolução).
Executado pelo build.py antes de montar a página. As respostas são conferidas por check_listas.py."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))

def st(label, text, m=None):
    h = f'<div class="st"><span class="pl">{label}</span>'
    if text: h += f"<p>{text}</p>"
    if m: h += f'<div class="m">\\[{m}\\]</div>'
    return h + "</div>"

def item(iid, num, enun, ans, steps=None, extra=""):
    h = f'<div class="li" data-id="{iid}"><div class="lh"><span class="ln">{num}</span></div><div class="enun">{enun}</div>{extra}'
    h += f'<div class="li-a"><b>Resposta:</b> {ans}</div>'
    if steps: h += '<div class="sol steps">' + "".join(steps) + "</div>"
    return h + "</div>"

def page(n, short, title, desc, intro, items, mods, kicker=None):
    links = " · ".join(f'<a href="#{m}">{t}</a>' for m, t in mods)
    return (f'<section class="page lista" id="lista{n}" data-num="{n}" data-short="{short}" data-desc="{desc}" data-kicker="{kicker or ("Lista " + str(n))}">'
            f'<div class="mhead"><span class="mi"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></svg></span>'
            f'<div style="flex:1;min-width:0"><div class="eyebrow">{kicker or ("Lista de Exercícios " + str(n))}</div><h1>{title}</h1><p class="muted small">Teoria: {links}</p></div></div>'
            f'<div class="book"><div class="btns lprog" style="gap:12px"></div><p class="small muted">{intro}</p><div class="qs">' + "".join(items) +
            '</div><div class="mnav"><a class="btn" href="#listas">Todas as listas</a></div></div></section>')

out = []
INTRO = "Resolva no caderno antes de abrir a resposta. Depois marque se acertou: isso alimenta o seu progresso."

# ============================================================ LISTA 1
L1 = [
 item("L1-1", "Questão 1", r"Calcule \((2-3i)+(-5+i)\) e \((2-3i)(-5+i)\).", r"\(-3-2i\) e \(-7+17i\)",
      [st("Soma", "Some partes reais e partes imaginárias separadamente.", r"(2-5)+(-3+1)i=-3-2i"),
       st("Produto", "Distribua e troque \\(i^2\\) por \\(-1\\).", r"-10+2i+15i-3i^2=-10+17i+3=-7+17i")]),
 item("L1-2", "Questão 2", r"Calcule \(i^{7}\), \(i^{100}\) e \(i^{-1}\).", r"\(-i\), \(1\) e \(-i\)",
      [st("Ciclo de 4", r"\(7=4+3\Rightarrow i^7=i^3=-i\); \(100=4\cdot25\Rightarrow i^{100}=1\)."),
       st("Inverso", r"\(i\cdot(-i)=-i^2=1\), logo \(i^{-1}=-i\).")]),
 item("L1-3", "Questão 3", r"Escreva \(\dfrac{2+i}{1-i}\) na forma \(a+bi\).", r"\(\frac12+\frac32i\)",
      [st("Conjugado", "Multiplique em cima e embaixo por \\(1+i\\).", r"\frac{(2+i)(1+i)}{(1-i)(1+i)}=\frac{2+2i+i+i^2}{1+1}=\frac{1+3i}{2}")]),
 item("L1-4", "Questão 4", r"Resolva \((2+i)z+3=4i\) em \(\mathbb C\).", r"\(z=-\frac25+\frac{11}5i\)",
      [st("Isole", "", r"z=\frac{-3+4i}{2+i}=\frac{(-3+4i)(2-i)}{5}=\frac{-6+3i+8i-4i^2}{5}=\frac{-2+11i}{5}"),
       st("Confira", r"\((2+i)\left(-\frac25+\frac{11}5i\right)=\frac{-4+22i-2i+11i^2}{5}=\frac{-15+20i}{5}=-3+4i\) ✓")]),
 item("L1-5", "Questão 5", r"Ache todos os \(z\in\mathbb C\) com \(z^2=-9\) e todos com \(z^2=2i\).", r"\(\pm3i\); \(\pm(1+i)\)",
      [st("Primeira", r"\((3i)^2=9i^2=-9\) e \((-3i)^2=-9\)."),
       st("Segunda", "Escreva \\(z=a+bi\\) e iguale partes:", r"a^2-b^2=0,\quad 2ab=2\ \Rightarrow\ a=b=\pm1")]),
 item("L1-6", "Questão 6", r"Mostre que \(\overline{zw}=\bar z\,\bar w\) para \(z=a+bi\), \(w=c+di\).", r"Os dois lados valem \((ac-bd)-(ad+bc)i\).",
      [st("Lado esquerdo", "", r"\overline{(ac-bd)+(ad+bc)i}=(ac-bd)-(ad+bc)i"),
       st("Lado direito", "", r"(a-bi)(c-di)=ac-adi-bci+bdi^2=(ac-bd)-(ad+bc)i")]),
 item("L1-7", "Questão 7", r"Para \(\alpha=1+2i\), calcule \(\alpha\bar\alpha\) e \(1/\alpha\). Qual a interpretação de \(\alpha\bar\alpha\)?", r"\(5\); \(\frac15-\frac25i\); é o quadrado da distância de \(\alpha\) à origem.",
      [st("Conta", "", r"(1+2i)(1-2i)=1-4i^2=5,\qquad \frac1\alpha=\frac{\bar\alpha}{\alpha\bar\alpha}=\frac{1-2i}{5}")]),
]
out.append(page(1, "Complexos", "Números complexos (pré-requisito)", "Aritmética, potências de i, divisão, equações e conjugado.", INTRO, L1, [("m2", "Complexos e corpo F")]))

# ============================================================ LISTA 2
L2 = [
 item("L2-1", "Questão 1", r"Em \(\mathbf C^3\), calcule \(2(1,i,0)-i(i,1,1+i)\).", r"\((3,\ i,\ 1-i)\)",
      [st("Escalar", "", r"2(1,i,0)=(2,2i,0),\qquad i(i,1,1+i)=(i^2,\ i,\ i+i^2)=(-1,i,-1+i)"),
       st("Subtraia", "", r"(2-(-1),\ 2i-i,\ 0-(-1+i))=(3,\ i,\ 1-i)")]),
 item("L2-2", "Questão 2", r"Ache \(x\in\mathbf R^3\) com \(3x+(1,2,3)=(4,-1,0)\).", r"\(x=(1,-1,-1)\)",
      [st("Isole", "Some \\(-(1,2,3)\\) e multiplique por \\(\\tfrac13\\).", r"x=\tfrac13(3,-3,-3)=(1,-1,-1)")]),
 item("L2-3", "Questão 3", r"\(\mathbf R^2\) com a soma usual e \(\lambda(x,y)=(\lambda x,\ y)\) é espaço vetorial?", r"Não: falha \((a+b)v=av+bv\).",
      [st("Contraexemplo", r"\(v=(0,1)\), \(a=b=1\): \((1+1)v=(0,1)\), mas \(1v+1v=(0,1)+(0,1)=(0,2)\).")]),
 item("L2-4", "Questão 4", r"\(\mathbf R^2\) com \((x_1,y_1)\oplus(x_2,y_2)=(x_1+x_2,\ 0)\) e o produto escalar usual é espaço vetorial?", r"Não: não existe identidade aditiva.",
      [st("Busca do zero", r"Precisaríamos \((x,y)\oplus z=(x,y)\) para todo \((x,y)\); mas o resultado de \(\oplus\) tem sempre 2ª coordenada \(0\), então \((0,1)\oplus z\ne(0,1)\) para todo \(z\).")]),
 item("L2-5", "Questão 5", r"\(\mathbf R^2\) com \((a,b)\oplus(c,d)=(a+c-2,\ b+d+3)\) e \(\lambda\odot(a,b)=(\lambda a-2\lambda+2,\ \lambda b+3\lambda-3)\). Ache o zero e o inverso de \((a,b)\).", r"Zero \((2,-3)\); inverso \((4-a,\ -6-b)\). (É espaço vetorial: é \(\mathbf R^2\) “transladado”.)",
      [st("Zero", "", r"(a,b)\oplus(z_1,z_2)=(a,b)\iff z_1-2=0,\ z_2+3=0"),
       st("Inverso", "", r"a+c-2=2,\ b+d+3=-3\ \Rightarrow\ (c,d)=(4-a,\,-6-b)"),
       st("Por que é espaço", r"Com \(\varphi(a,b)=(a-2,b+3)\), as operações viram as usuais: \(\varphi(u\oplus v)=\varphi(u)+\varphi(v)\) e \(\varphi(\lambda\odot u)=\lambda\varphi(u)\).")]),
 item("L2-6", "Questão 6", r"O conjunto \(\{(x,y)\in\mathbf R^2: x\ge0\}\), com as operações usuais, é espaço vetorial real?", r"Não: \((-1)(1,0)=(-1,0)\) sai do conjunto (a multiplicação escalar não é operação nele; também falta o inverso aditivo).",
      [st("Fechamento", r"\((1,0)\) está no conjunto, mas \(-(1,0)=(-1,0)\) não.")]),
 item("L2-7", "Questão 7", r"Em \(\mathbf R^{\mathbf R}\), com \(f(x)=x^2\) e \(g(x)=\cos x\), calcule \((2f-3g)(0)\) e \((2f-3g)(\pi)\).", r"\(-3\) e \(2\pi^2+3\)",
      [st("Ponto a ponto", "", r"(2f-3g)(x)=2x^2-3\cos x\ \Rightarrow\ 0-3=-3,\quad 2\pi^2-3(-1)=2\pi^2+3")]),
]
out.append(page(2, "Definição e exemplos", "Definição de espaço vetorial e exemplos", "Contas em F^n e F^S, estruturas que são e que não são espaços vetoriais.", INTRO, L2, [("m3", "Listas e F^n"), ("m4", "Definição"), ("m5", "F^∞ e F^S")]))

# ============================================================ LISTA 3
L3 = [
 item("L3-1", "Questão 1", r"Prove que \(a(v-w)=av-aw\) em qualquer espaço vetorial.", r"Distributiva + \(a(-w)=-(aw)\).",
      [st("Cadeia", "", r"a(v-w)=a(v+(-w))=av+a(-w)=av+(-(aw))=av-aw"),
       st("Justificativas", r"definição de subtração; distributiva; \(a(-w)=a((-1)w)=(a(-1))w=(-a)w=-(aw)\) pelo 1.32 e associatividade; definição de subtração.")]),
 item("L3-2", "Questão 2", r"Prove que \((-a)(-v)=av\).", r"Use \((-1)v=-v\) duas vezes.",
      [st("Cadeia", "", r"(-a)(-v)=(-a)((-1)v)=((-a)(-1))v=av")]),
 item("L3-3", "Questão 3", r"Prove: se \(v+v=0\) num espaço vetorial real, então \(v=0\).", r"\(v=\tfrac12(2v)=\tfrac12\cdot0=0\).",
      [st("Cadeia", "", r"v=1v=\left(\tfrac12\cdot2\right)v=\tfrac12(2v)=\tfrac12\big((1+1)v\big)=\tfrac12(v+v)=\tfrac12\,0=0"),
       st("Usou", r"identidade multiplicativa, associatividade escalar, distributiva, hipótese e 1.31 (\(a0=0\)).")]),
 item("L3-4", "Questão 4", r"Resolva em \(V\): \(2x-v=5w+x\) (isto é, ache \(x\) em função de \(v\) e \(w\)).", r"\(x=v+5w\)",
      [st("Some \\(-x\\) e \\(v\\)", "", r"2x-v-x=5w\ \Rightarrow\ x-v=5w\ \Rightarrow\ x=v+5w")]),
 item("L3-5", "Questão 5", r"Em \(\mathbf R^2\), qual é o único \(x\) com \(3x+(1,2)=(7,-4)\)? (Ex. 3 da seção.)", r"\(x=(2,-2)\)",
      [st("Fórmula", "", r"x=\tfrac13\big((7,-4)-(1,2)\big)=\tfrac13(6,-6)=(2,-2)")]),
 item("L3-6", "Questão 6", r"Prove a lei do cancelamento: \(u+w=v+w\Rightarrow u=v\).", r"Some \(-w\) aos dois lados.",
      [st("Cadeia", "", r"u=u+0=u+(w+(-w))=(u+w)+(-w)=(v+w)+(-w)=v+(w+(-w))=v+0=v")]),
 item("L3-7", "Questão 7", r"Seja \(\mathbf R_+=(0,\infty)\) com \(x\oplus y=xy\) e \(\lambda\odot x=x^\lambda\). Calcule \(2\odot3\oplus(-1)\odot6\) e diga quem é o “zero”.", r"\(\frac32\); o zero é \(1\).",
      [st("Conta", "", r"3^2\cdot6^{-1}=\frac96=\frac32"), st("Zero", r"\(x\oplus1=x\cdot1=x\).")]),
]
out.append(page(3, "Propriedades", "Propriedades elementares e provas", "Unicidade, regras de sinal, cancelamento e equações em V.", INTRO, L3, [("m6", "Unicidade"), ("m7", "Zeros e sinais"), ("m8", "Exercícios 1B")]))

def build():
    with open(os.path.join(HERE, "content", "20_listas.html"), "w", encoding="utf-8") as f:
        f.write("\n".join(out))

if __name__ == "__main__":
    build()
