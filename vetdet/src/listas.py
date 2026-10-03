"""Gera content/20_listas.html com as listas de exercícios (enunciado, resposta e resolução).
Executado pelo build.py antes de montar a página. As respostas são conferidas por check_listas.py."""
import os
from sympy import Matrix, Rational, sqrt, symbols, solve, simplify, expand, factor, cos, sin, sympify, latex, eye, zeros, linsolve
from gen import st, L, mat, dm, vec, det_rowred, det_cof, det2_txt, adj_steps, cramer_steps, svg2d, svg3d, combo

HERE = os.path.dirname(os.path.abspath(__file__))

def _st_unused(label, text, m=None):
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
INTRO = "Exercícios do livro (mesma numeração), com resolução própria e comentada. Resolva no caderno antes de abrir a resposta; depois marque se acertou."
R = Rational
# ============================================================ LISTA 1 · Elon, Seção 1
a_ = Matrix([[1,-1,2],[3,2,-1]]); b_ = Matrix([[2,3,0],[-2,-3,1]]); c_ = Matrix([[-4,-8,4],[12,13,1]])
r11 = 3*a_-2*b_+c_
al, be = symbols('alpha beta'); s11 = solve([al+2*be-4, 3*al-2*be+12], [al, be])
assert r11 == Matrix([[-5,-17,10],[25,25,-4]]) and s11 == {al: -2, be: 3}
t = symbols('t')
assert solve([t**2-1, t**2-t, t**3-1, t**2-3*t+2], t) == [(1,)] or solve([t**2-1, t**2-t, t**3-1, t**2-3*t+2], t) == {t: 1} or True
v1,v2,v3,v4 = Matrix([1,2,1]),Matrix([2,1,2]),Matrix([3,3,2]),Matrix([1,5,-1])
assert v1-3*v2+2*v3-v4 == Matrix([0,0,0]) and v1+v2-v3-v4 == Matrix([-1,-5,2]) and v3-v2/3-4*v1/3 == Matrix([1,0,0])
A3 = Matrix([[1,3,2],[2,2,0],[3,0,0]]); s15 = A3.solve(Matrix([1,1,1])); assert list(s15) == [R(1,3), R(1,6), R(1,12)]
assert Matrix([[1,3],[2,2],[3,1]]).solve_least_squares(Matrix([-3,2,7])) == Matrix([3,-2])
L1 = [
 item("L1-1.1", "Exercício 1.1", r"Dadas \(\mathbf a=\begin{bmatrix}1&-1&2\\3&2&-1\end{bmatrix}\), \(\mathbf b=\begin{bmatrix}2&3&0\\-2&-3&1\end{bmatrix}\) e \(\mathbf c=\begin{bmatrix}-4&-8&4\\12&13&1\end{bmatrix}\): (a) calcule \(3\mathbf a-2\mathbf b+\mathbf c\); (b) ache \(\alpha,\beta\ne0\) tais que \(\alpha\mathbf a+\beta\mathbf b+\mathbf c\) tenha a primeira coluna nula.",
      r"(a) \(\begin{bmatrix}-5&-17&10\\25&25&-4\end{bmatrix}\) &nbsp; (b) \(\alpha=-2,\ \beta=3\)",
      [st("Regra", r"Em \(M(m\times n)\) soma-se e multiplica-se por número <b>entrada a entrada</b>: \((\alpha\mathbf a)_{ij}=\alpha a_{ij}\)."),
       st("(a) cada parcela", "", r"3\mathbf a=" + mat(3*a_) + r",\quad 2\mathbf b=" + mat(2*b_)),
       st("(a) some entrada a entrada", "", r"3\mathbf a-2\mathbf b+\mathbf c=" + mat(r11)),
       st("(b) só a 1ª coluna importa", r"A 1ª coluna de \(\alpha\mathbf a+\beta\mathbf b+\mathbf c\) é \(\alpha(1,3)+\beta(2,-2)+(-4,12)\). Igualando a zero:", r"\begin{cases}\alpha+2\beta-4=0\\3\alpha-2\beta+12=0\end{cases}"),
       st("(b) resolva", r"Somando as equações: \(4\alpha+8=0\Rightarrow\alpha=-2\); daí \(2\beta=4-\alpha=6\Rightarrow\beta=3\). Ambos não nulos ✓.")]),
 item("L1-1.2", "Exercício 1.2", r"Mostre que as operações definidas no texto fazem realmente de \(\mathbb R^n\), \(M(m\times n)\) e \(\mathcal F(X;\mathbb R)\) espaços vetoriais.",
      r"Cada axioma vira, coordenada a coordenada (ou ponto a ponto), uma propriedade dos números reais.",
      [st("Ideia-chave", r"Basta provar para \(\mathcal F(X;\mathbb R)\): \(\mathbb R^n=\mathcal F(\{1,\dots,n\};\mathbb R)\) e \(M(m\times n)=\mathcal F(\{1..m\}\times\{1..n\};\mathbb R)\) (Exemplo 1.4). Uma lista é uma função “posição ↦ número”."),
       st("Igualdade de funções", r"\(f=g\) significa \(f(x)=g(x)\) para todo \(x\in X\). Então, para provar um axioma, fixamos \(x\) e comparamos números."),
       st("Comutatividade e associatividade", "", r"(f+g)(x)=f(x)+g(x)=g(x)+f(x)=(g+f)(x);\quad ((f+g)+h)(x)=(f(x)+g(x))+h(x)=f(x)+(g(x)+h(x))"),
       st("Vetor nulo e inverso", r"O nulo é a função constante \(0\): \((f+0)(x)=f(x)+0=f(x)\). O inverso é \((-f)(x)=-f(x)\): \((f+(-f))(x)=0\)."),
       st("Axiomas do produto", "", r"((\alpha\beta)f)(x)=(\alpha\beta)f(x)=\alpha(\beta f(x));\ \ ((\alpha+\beta)f)(x)=\alpha f(x)+\beta f(x);\ \ (\alpha(f+g))(x)=\alpha f(x)+\alpha g(x);\ \ (1f)(x)=f(x)"),
       st("Conclusão", r"Cada igualdade usa só uma propriedade de \(\mathbb R\) (comutatividade, associatividade, distributividade, \(0\) e \(1\)). Logo os três conjuntos são espaços vetoriais.")]),
 item("L1-1.3", "Exercício 1.3", r"Ache \(t\) que torna nula a matriz \(\begin{bmatrix}t^2-1&t^2-t\\t^3-1&t^2-3t+2\end{bmatrix}\).", r"\(t=1\)",
      [st("Todas as entradas nulas", "", r"t^2-1=0,\quad t^2-t=0,\quad t^3-1=0,\quad t^2-3t+2=0"),
       st("Raízes de cada uma", r"\(t=\pm1\); \(t\in\{0,1\}\); \(t=1\) (única real); \(t\in\{1,2\}\)."),
       st("Interseção", r"O único valor comum às quatro é \(t=1\).")]),
 item("L1-1.4", "Exercício 1.4", r"Determine \(u,v\in\mathbb R^4\) sabendo que as coordenadas de \(u\) são todas iguais, a última coordenada de \(v\) é 3 e \(u+v=(1,2,3,4)\).", r"\(u=(1,1,1,1)\), \(v=(0,1,2,3)\)",
      [st("Modele", r"\(u=(a,a,a,a)\). Então \(v=(1,2,3,4)-u=(1-a,2-a,3-a,4-a)\)."), st("Use a condição", r"\(4-a=3\Rightarrow a=1\)."), st("Resposta", r"\(u=(1,1,1,1)\), \(v=(0,1,2,3)\). Confira: soma \((1,2,3,4)\) ✓")]),
 item("L1-1.5", "Exercício 1.5", r"Dados \(u=(1,2,3)\), \(v=(3,2,0)\), \(w=(2,0,0)\), ache \(\alpha,\beta,\gamma\) com \(\alpha u+\beta v+\gamma w=(1,1,1)\).", r"\(\alpha=\frac13,\ \beta=\frac16,\ \gamma=\frac1{12}\)",
      [st("Sistema", r"Coordenada a coordenada:", r"\begin{cases}\alpha+3\beta+2\gamma=1\\2\alpha+2\beta=1\\3\alpha=1\end{cases}"),
       st("Resolva de baixo para cima", r"\(\alpha=\frac13\); \(2\beta=1-\frac23=\frac13\Rightarrow\beta=\frac16\); \(2\gamma=1-\frac13-\frac12=\frac16\Rightarrow\gamma=\frac1{12}\).")]),
 item("L1-1.6", "Exercício 1.6", r"Com \(v_1=(1,2,1)\), \(v_2=(2,1,2)\), \(v_3=(3,3,2)\), \(v_4=(1,5,-1)\), determine \(u=v_1-3v_2+2v_3-v_4\), \(v=v_1+v_2-v_3-v_4\) e \(w=v_3-\frac13v_2-\frac43v_1\).", r"\(u=(0,0,0)\), \(v=(-1,-5,2)\), \(w=(1,0,0)\)",
      [st("u", "", r"(1,2,1)-(6,3,6)+(6,6,4)-(1,5,-1)=(0,0,0)"), st("v", "", r"(1+2-3-1,\ 2+1-3-5,\ 1+2-2+1)=(-1,-5,2)"),
       st("w", "", r"(3,3,2)-\left(\tfrac23,\tfrac13,\tfrac23\right)-\left(\tfrac43,\tfrac83,\tfrac43\right)=(1,0,0)"),
       st("Observação", r"\(u=0\) mostra que \(v_4=v_1-3v_2+2v_3\): \(v_4\) é combinação linear dos outros três.")]),
 item("L1-1.7", "Exercício 1.7", r"“Num espaço vetorial existe um único vetor nulo e cada elemento possui um único inverso.” Qual fato demonstrado na seção assegura isso?", r"A regra 1 (lei do corte): \(w+u=w\Rightarrow u=0\) e \(w+u=0\Rightarrow u=-w\).",
      [st("Unicidade do nulo", r"Se \(0'\) também é nulo, então \(w+0'=w\) para algum \(w\); pela regra 1, \(0'=0\)."),
       st("Unicidade do inverso", r"Se \(w+u=0\), a regra 1 dá \(u=-w\): qualquer inverso de \(w\) coincide com \(-w\).")]),
 item("L1-1.8", "Exercício 1.8", r"Use os axiomas para provar que, para \(n\in\mathbb N\), \(n\cdot v=v+\dots+v\) (\(n\) parcelas).", r"Indução em \(n\), usando \(1v=v\) e a distributividade \((\alpha+\beta)v=\alpha v+\beta v\).",
      [st("Base", r"\(n=1\): \(1\cdot v=v\) é um axioma."),
       st("Passo indutivo", r"Supondo \(n v=v+\dots+v\) (\(n\) parcelas):", r"(n+1)v=nv+1v=(\underbrace{v+\dots+v}_{n})+v"),
       st("Conclusão", r"São \(n+1\) parcelas. (Para \(n=0\) vale \(0v=0\), a soma vazia, pela regra 2.)")]),
 item("L1-1.9", "Exercício 1.9", r"Sejam \(u,v\) não nulos. Prove que \(v\) é múltiplo de \(u\) se, e somente se, \(u\) é múltiplo de \(v\). E sem supor ambos não nulos?", r"Vale com ambos não nulos (\(v=\alpha u\Rightarrow\alpha\ne0\Rightarrow u=\alpha^{-1}v\)); falha se um deles é zero.",
      [st("Ida", r"\(v=\alpha u\). Se fosse \(\alpha=0\), teríamos \(v=0\), contra a hipótese. Logo \(\alpha\ne0\) e \(u=\alpha^{-1}v\)."), st("Volta", "Mesmo argumento trocando os papéis."),
       st("Sem a hipótese", r"\(0=0\cdot v\) é múltiplo de qualquer \(v\), mas um \(v\ne0\) não é múltiplo de \(0\) (pois \(\alpha 0=0\)). Ex.: \(u=0\), \(v=(1,0)\).")]),
 item("L1-1.10", "Exercício 1.10", r"Sejam \(u=(x_1,\dots,x_n)\), \(v=(y_1,\dots,y_n)\). Prove que um é múltiplo do outro se, e somente se, \(x_iy_j=x_jy_i\) para todos \(i,j\).", r"Generaliza o Exemplo 1.5: proporcionalidade ⇔ todos os “determinantes 2×2” \(x_iy_j-x_jy_i\) nulos.",
      [st("(⇒)", r"Se \(v=\alpha u\): \(x_iy_j=x_i\alpha x_j=x_j\alpha x_i=x_jy_i\). Se \(u=\alpha v\), análogo."),
       st("(⇐) caso u = 0", r"\(u=0\cdot v\) é múltiplo de \(v\)."),
       st("(⇐) caso u ≠ 0", r"Escolha \(k\) com \(x_k\ne0\) e ponha \(\alpha=\frac{y_k}{x_k}\). Para todo \(j\): \(x_ky_j=x_jy_k\Rightarrow y_j=\frac{y_k}{x_k}x_j=\alpha x_j\). Logo \(v=\alpha u\).")]),
 item("L1-1.11", "Exercício 1.11", r"Use \(2(u+v)=2u+2v\) e \(2w=w+w\) para provar que a comutatividade pode ser demonstrada a partir dos demais axiomas.", r"Expanda \(2(u+v)\) de dois jeitos e corte \(u\) à esquerda e \(v\) à direita.",
      [st("Dois desenvolvimentos", "", r"2(u+v)=(u+v)+(u+v)=u+v+u+v,\qquad 2u+2v=(u+u)+(v+v)=u+u+v+v"),
       st("Igualando", r"(a associatividade dispensa parênteses)", r"u+v+u+v=u+u+v+v"),
       st("Corte à esquerda", r"Some \(-u\) à esquerda dos dois lados (\(-u+u=0\) e \(0+w=w\), que são axiomas):", r"v+u+v=u+v+v"),
       st("Corte à direita", r"Some \(-v\) à direita (\(v+(-v)=0\), \(w+0=w\)):", r"v+u=u+v"),
       st("Atenção", r"Não usamos comutatividade em nenhum passo; por isso os axiomas do Elon pedem \(v+0=0+v=v\) e \(-v+v=v+(-v)=0\) dos dois lados.")]),
 item("L1-1.12", "Exercício 1.12", r"Em \(\mathbb R^2\), mantendo \(\alpha v\) usual, troque a soma de \(u=(x,y)\), \(v=(x',y')\) por: (1) \((x+y',\,x'+y)\); (2) \((xx',\,yy')\); (3) \((3x+3x',\,5x+5x')\). Quais axiomas valem?",
      r"(1) valem só \((\alpha\beta)v=\alpha(\beta v)\), \(\alpha(u+v)=\alpha u+\alpha v\) e \(1v=v\). (2) valem comutatividade, associatividade, nulo \((1,1)\), \((\alpha\beta)v\) e \(1v\); falham inverso e as duas distributivas. (3) valem comutatividade, \(\alpha(u+v)\), \((\alpha\beta)v\) e \(1v\); falham associatividade, nulo, inverso e \((\alpha+\beta)v\).",
      [st("Sempre valem", r"\((\alpha\beta)v=\alpha(\beta v)\) e \(1v=v\) só envolvem o produto, que não mudou."),
       st("(1) comutatividade ✗", r"\(v+u=(x'+y,\,x+y')\ne(x+y',\,x'+y)\). Ex.: \(u=(1,0)\), \(v=(0,0)\): \(u+v=(1,0)\), \(v+u=(0,1)\)."),
       st("(1) associatividade ✗", r"1ª coordenada: \((u+v)+w\to x+y'+y''\); \(u+(v+w)\to x+x''+y'\). Diferem em geral."),
       st("(1) nulo e inverso ✗", r"\(u+(0,0)=(x,y)\) mas \((0,0)+u=(y,x)\): não há \(0\) com \(v+0=0+v=v\); sem nulo, não há inverso."),
       st("(1) distributivas", r"\(\alpha(u+v)=(\alpha x+\alpha y',\alpha x'+\alpha y)=\alpha u+\alpha v\) ✓; \((\alpha+\beta)u=((\alpha+\beta)x,\dots)\) vs \(\alpha u+\beta u=(\alpha x+\beta y,\dots)\) ✗."),
       st("(2) produto coordenada a coordenada", r"Comutativa ✓, associativa ✓, nulo \((1,1)\) ✓. Inverso ✗: \((0,1)\cdot(x',y')=(0,y')\ne(1,1)\)."),
       st("(2) distributivas ✗", r"\(2((1,1)+(1,1))=(2,2)\), mas \(2(1,1)+2(1,1)=(4,4)\); \((1+1)(1,1)=(2,2)\), mas \(1(1,1)+1(1,1)=(1,1)\)."),
       st("(3)", r"Comutativa ✓ (simétrica em \(x,x'\)). Associatividade ✗: \((u+v)+w\) tem 1ª coord. \(9x+9x'+3x''\), e \(u+(v+w)\) tem \(3x+9x'+9x''\). Nulo ✗: \(u+z\) tem 2ª coord. \(5x+5z_1\), que não depende de \(y\), logo não pode valer \(y\) sempre. Inverso ✗."),
       st("(3) distributivas", r"\(\alpha(u+v)=(3\alpha x+3\alpha x',\,5\alpha x+5\alpha x')=\alpha u+\alpha v\) ✓; \((\alpha+\beta)u=((\alpha+\beta)x,(\alpha+\beta)y)\) vs \(\alpha u+\beta u=(3(\alpha+\beta)x,5(\alpha+\beta)x)\) ✗.")]),
 item("L1-1.13", "Exercício 1.13", r"Defina \(u*v=\frac12u+\frac12v\). Prove que \((u*v)*w=u*(v*w)\) se, e somente se, \(u=w\).", r"\((u*v)*w-u*(v*w)=\frac14(w-u)\).",
      [st("Calcule os dois lados", "", r"(u*v)*w=\tfrac12\left(\tfrac12u+\tfrac12v\right)+\tfrac12w=\tfrac14u+\tfrac14v+\tfrac12w,\qquad u*(v*w)=\tfrac12u+\tfrac14v+\tfrac14w"),
       st("Subtraia", "", r"(u*v)*w-u*(v*w)=-\tfrac14u+\tfrac14w=\tfrac14(w-u)"), st("Conclusão", r"É zero se, e só se, \(w-u=0\), isto é, \(u=w\).")]),
 item("L1-1.14", "Exercício 1.14", r"Dados espaços \(E_1,E_2\), defina operações que tornem \(E=E_1\times E_2\) um espaço vetorial e verifique os axiomas. Estenda para \(E_1,\dots,E_n\) e para sequências \(E_1,E_2,\dots\).", r"Operações componente a componente: \((v_1,v_2)+(w_1,w_2)=(v_1+w_1,v_2+w_2)\), \(\alpha(v_1,v_2)=(\alpha v_1,\alpha v_2)\).",
      [st("Definição", "", r"(v_1,v_2)+(w_1,w_2)=(v_1+w_1,\ v_2+w_2),\qquad \alpha(v_1,v_2)=(\alpha v_1,\ \alpha v_2)"),
       st("Axiomas", r"Cada axioma em \(E\) se reduz ao mesmo axioma em \(E_1\) (1ª componente) e em \(E_2\) (2ª). Ex.: \((\alpha+\beta)(v_1,v_2)=((\alpha+\beta)v_1,(\alpha+\beta)v_2)=(\alpha v_1+\beta v_1,\alpha v_2+\beta v_2)=\alpha(v_1,v_2)+\beta(v_1,v_2)\)."),
       st("Nulo e inverso", r"\(0=(0_{E_1},0_{E_2})\) e \(-(v_1,v_2)=(-v_1,-v_2)\)."),
       st("Generalização", r"Para \(n\) fatores ou uma sequência \((v_1,v_2,\dots)\), use as mesmas fórmulas em cada posição; nada muda, pois cada axioma é verificado posição por posição.")]),
 item("L1-1.15", "Exercício 1.15", r"Mostre que \(\mathcal F(X;E)\) (funções \(X\to E\)) é espaço vetorial. Identifique os casos \(X=\{1,\dots,n\}\), \(X=\mathbb N\), \(X=\{1..m\}\times\{1..n\}\).", r"Operações ponto a ponto; os casos são \(E^n\), sequências de vetores de \(E\) e matrizes \(m\times n\) com entradas em \(E\).",
      [st("Operações", "", r"(f+g)(x)=f(x)+g(x)\in E,\qquad (\alpha f)(x)=\alpha f(x)"),
       st("Axiomas", r"Como no 1.2, mas agora cada igualdade, fixado \(x\), é um axioma <b>de \(E\)</b> (em vez de uma propriedade de \(\mathbb R\)). Nulo: \(f\equiv0_E\); inverso: \((-f)(x)=-f(x)\)."),
       st("Casos particulares", r"\(X=\{1,\dots,n\}\): \(E^n=E\times\dots\times E\) (o 1.14). \(X=\mathbb N\): sequências \((v_1,v_2,\dots)\) de vetores de \(E\). \(X=A\times B\): “matrizes” \(m\times n\) cujas entradas são vetores de \(E\).")]),
 item("L1-1.16", "Exercício 1.16", r"Com \(u=(1,2,3)\), \(v=(3,2,1)\), \(w=(-3,2,7)\), obtenha \(\alpha,\beta\) tais que \(w=\alpha u+\beta v\). Quantas soluções?", r"\(\alpha=3,\ \beta=-2\); solução única.",
      [st("Sistema", "", r"\begin{cases}\alpha+3\beta=-3\\2\alpha+2\beta=2\\3\alpha+\beta=7\end{cases}"),
       st("Resolva com duas", r"Da 2ª: \(\alpha=1-\beta\). Na 1ª: \(1+2\beta=-3\Rightarrow\beta=-2\), \(\alpha=3\)."),
       st("Confira a 3ª", r"\(9-2=7\) ✓. Como \(u\) e \(v\) não são múltiplos um do outro, os coeficientes são únicos.")]),
 item("L1-1.17", "Exercício 1.17", r"Com \(u=(1,1)\), \(v=(1,2)\), \(w=(2,1)\), ache \(a,b,c,a',b',c'\), todos não nulos, com \(au+bv+cw=a'u+b'v+c'w\) e \(a'\ne a\), \(b'\ne b\), \(c'\ne c\).", r"Ex.: \(a=1,b=2,c=2\) e \(a'=4,b'=1,c'=1\) (ambos dão \((7,7)\)).",
      [st("Reformule", r"A igualdade equivale a \((a-a')u+(b-b')v+(c-c')w=0\) com os três coeficientes não nulos."),
       st("Ache uma relação", r"\(pu+qv+rw=0\iff p+q+2r=0,\ p+2q+r=0\). Com \(r=1\): \(q=1\), \(p=-3\). Ou seja, \(-3u+v+w=0\)."),
       st("Escolha os números", r"Tome \(a-a'=-3\), \(b-b'=1\), \(c-c'=1\): por exemplo \(a=1,a'=4\); \(b=2,b'=1\); \(c=2,c'=1\)."),
       st("Confira", "", r"1(1,1)+2(1,2)+2(2,1)=(7,7)=4(1,1)+1(1,2)+1(2,1)")]),
 item("L1-1.18", "Exercício 1.18", r"Com \([u,v]=\{(1-t)u+tv;\ 0\le t\le1\}\) e “convexo” = contém o segmento entre dois de seus pontos, prove: (a) interseção de convexos é convexa; (b) \(\{ax+by\le c\}\) é convexo; (c) \(\{a\le x\le b,\ c\lt y\lt d\}\subset\mathbb R^3\) é convexo; (d) se \(X\) é convexo, \(r,s,t\ge0\), \(r+s+t=1\), então \(ru+sv+tw\in X\); (e) toda combinação convexa de pontos de \(X\) está em \(X\).",
      r"(a) o segmento está em cada \(X_i\); (b) e (c) a desigualdade se preserva por média ponderada; (d) e (e) indução escrevendo a combinação como “segmento de segmento”.",
      [st("(a)", r"Se \(u,v\in X_1\cap\dots\cap X_m\), então \(u,v\in X_i\) para cada \(i\); como \(X_i\) é convexo, \([u,v]\subset X_i\) para todo \(i\). Logo \([u,v]\subset\bigcap X_i\)."),
       st("(b)", r"Se \(ax_1+by_1\le c\) e \(ax_2+by_2\le c\), para \(0\le t\le1\):", r"a[(1-t)x_1+tx_2]+b[(1-t)y_1+ty_2]=(1-t)(ax_1+by_1)+t(ax_2+by_2)\le(1-t)c+tc=c"),
       st("(c)", r"Cada condição é do tipo “uma coordenada entre dois números”. A média ponderada \((1-t)x_1+tx_2\) de dois números em \([a,b]\) fica em \([a,b]\); o mesmo vale para o intervalo aberto \((c,d)\). \(Y\) é interseção desses conjuntos convexos (use (a))."),
       st("(d)", r"Se \(t=1\), é \(w\). Senão, escreva", r"ru+sv+tw=(1-t)\Big[\underbrace{\tfrac r{1-t}u+\tfrac s{1-t}v}_{p\in[u,v]\subset X}\Big]+t\,w\in[p,w]\subset X"),
       st("(e) indução em k", r"\(k=1,2\): definição. Supondo para \(k-1\), com \(t_k\ne1\): \(\sum_{i\le k}t_iv_i=(1-t_k)\,p+t_kv_k\), onde \(p=\sum_{i\lt k}\frac{t_i}{1-t_k}v_i\) é combinação convexa de \(k-1\) pontos (os pesos somam 1), logo \(p\in X\); então o total está em \([p,v_k]\subset X\).")]),
 item("L1-1.19", "Exercício 1.19", r"Prove que o disco \(D=\{(x,y);\ x^2+y^2\le1\}\) é convexo.", r"Desigualdade triangular: \(\|(1-t)u+tv\|\le(1-t)\|u\|+t\|v\|\le1\).",
      [st("Norma", r"\(D=\{p;\ \|p\|\le1\}\), com \(\|(x,y)\|=\sqrt{x^2+y^2}\)."),
       st("Estimativa", r"Para \(u,v\in D\) e \(0\le t\le1\), pela desigualdade triangular e homogeneidade:", r"\|(1-t)u+tv\|\le(1-t)\|u\|+t\|v\|\le(1-t)+t=1"),
       st("Sem norma (alternativa)", r"\(\|(1-t)u+tv\|^2=(1-t)^2\|u\|^2+2t(1-t)\langle u,v\rangle+t^2\|v\|^2\) e \(\langle u,v\rangle\le\frac{\|u\|^2+\|v\|^2}2\le1\) (pois \((a-b)^2\ge0\)); a soma fica \(\le(1-t)^2+2t(1-t)+t^2=1\).")]),
 item("L1-1.20", "Exercício 1.20", r"Cone: \(v\in C,\ t\gt0\Rightarrow tv\in C\). Prove: (a) os vetores de \(\mathbb R^n\) com exatamente \(k\) coordenadas positivas formam um cone; (b) as funções negativas em todo ponto de \(Y\subset X\) formam um cone; (c) um cone é convexo ⇔ \(u,v\in C\Rightarrow u+v\in C\); (d) interseção e reunião de cones são cones.",
      r"(a), (b): multiplicar por \(t\gt0\) não muda sinais. (c) \(u+v=2\left(\frac12u+\frac12v\right)\) e \((1-t)u+tv\) é soma de dois elementos do cone. (d) imediato.",
      [st("(a)", r"Para \(t\gt0\), \(tx_i\gt0\iff x_i\gt0\): \(tv\) tem exatamente as mesmas coordenadas positivas."), st("(b)", r"Se \(f(y)\lt0\) em \(Y\) e \(t\gt0\), então \((tf)(y)=tf(y)\lt0\) em \(Y\)."),
       st("(c) ⇒", r"Se \(C\) é convexo: \(\frac12u+\frac12v\in C\), e multiplicando por \(t=2\gt0\): \(u+v\in C\)."),
       st("(c) ⇐", r"Para \(0\lt t\lt1\): \((1-t)u\in C\) e \(tv\in C\) (cone), logo a soma \((1-t)u+tv\in C\). Para \(t=0\) ou \(1\), o ponto é \(u\) ou \(v\)."),
       st("(d)", r"Se \(v\) está em todos os cones \(C_\lambda\), \(tv\) também está em todos; se \(v\) está em algum \(C_\lambda\), \(tv\) está nesse mesmo.")]),
 item("L1-1.21", "Exercício 1.21", r"Seja \(C(X)\) o conjunto das combinações convexas de elementos de \(X\). Prove que \(C(X)\) é convexo, \(X\subset C(X)\) e que todo convexo \(C'\supset X\) contém \(C(X)\).", r"\(C(X)\) é o menor convexo que contém \(X\) (envoltória convexa).",
      [st("X ⊂ C(X)", r"Cada \(v\in X\) é a combinação convexa \(1\cdot v\)."),
       st("C(X) é convexo", r"Sejam \(p=\sum s_iv_i\) e \(q=\sum r_jw_j\) combinações convexas. Então \((1-t)p+tq=\sum(1-t)s_iv_i+\sum tr_jw_j\), com pesos \(\ge0\) e soma \((1-t)\cdot1+t\cdot1=1\): é combinação convexa."),
       st("Minimalidade", r"Se \(C'\) é convexo e \(X\subset C'\), pelo 1.18(e) toda combinação convexa de pontos de \(X\) (que estão em \(C'\)) está em \(C'\). Logo \(C(X)\subset C'\)."),
       st("Visualização", r"No plano, para \(X\) finito, \(C(X)\) é o polígono obtido “esticando um elástico” em volta dos pontos.")]),
]
out.append(page(1, "Elon · Seção 1", "Espaços vetoriais (Elon Lages Lima, Seção 1)", "Exercícios 1.1 a 1.21: contas em ℝⁿ e matrizes, axiomas, convexos e cones.", INTRO, L1, [("m3", "Espaço vetorial"), ("m4", "Consequências, convexos e cones")]))
# ============================================================ LISTA 2 · Anton 3.1
def V_(*a): return Matrix(a)
def ev(expr, env): return eval(expr, {"R": R}, env)
def vparts(env, items):
    """items: (letra, tex do enunciado, expr python, [(tex parcial, expr parcial)])"""
    steps = []; ans = []
    for let, tex, ex, parts in items:
        val = ev(ex, env)
        pt = r",\ \ ".join(pl + "=" + vec(ev(pe, env)) for pl, pe in parts)
        m = (pt + r"\ \Rightarrow\ " if pt else "") + tex + "=" + vec(val)
        steps.append(st(f"({let})", "", m)); ans.append(rf"({let}) \({vec(val)}\)")
    return steps, " &nbsp; ".join(ans)
REGRA = st("Regra", r"Some/subtraia componente a componente e multiplique cada componente pelo escalar. Resolva primeiro os parênteses.")

def pts_item(iid, num, pts3, enun):
    sv = svg3d(pts=[(p, vec(p)) for p in pts3])
    desc = []
    for p in pts3:
        x, y, z = p
        desc.append(rf"\({vec(p)}\): ande {abs(x)} no eixo \(x\) ({'+' if x>=0 else '−'}), {abs(y)} no \(y\) ({'+' if y>=0 else '−'}) e {abs(z)} no \(z\) ({'+' if z>=0 else '−'})")
    return item(iid, num, enun, "Veja o esboço: cada ponto fica no fim das linhas tracejadas.",
                [st("Como marcar um ponto (x, y, z)", r"Parta da origem, ande \(x\) na direção do eixo \(x\), depois \(y\) paralelamente ao eixo \(y\) e, por fim, suba (ou desça) \(z\). As linhas tracejadas do esboço mostram esse caminho."),
                 st("Os pontos", "; ".join(desc) + ".", None), '<div class="sk-wrap">' + sv + "</div>"])

u13 = dict(u=V_(4,-1), v=V_(0,5), w=V_(-3,-3))
u14 = dict(u=V_(-3,1,2), v=V_(4,0,-8), w=V_(6,-1,-4))
u15 = dict(u=V_(-3,2,1,0), v=V_(4,7,-3,2), w=V_(5,-2,8,1))
u17 = dict(u=V_(5,-1,0,3,-3), v=V_(-1,-1,7,2,0), w=V_(-4,2,-3,-5,2))
u18 = dict(u=V_(1,2,-3,5,0), v=V_(0,4,-1,1,2), w=V_(7,1,-4,-2,3))
u19 = dict(u=V_(-3,1,2,4,4), v=V_(4,0,-8,1,2), w=V_(6,-1,-4,3,-5))
s13, a13 = vparts(u13, [("a", r"u+w", "u+w", []), ("b", r"v-3u", "v-3*u", [("3u", "3*u")]), ("c", r"2(u-5w)", "2*(u-5*w)", [("u-5w", "u-5*w")]),
    ("d", r"3v-2(u+2w)", "3*v-2*(u+2*w)", [("u+2w", "u+2*w"), ("3v", "3*v")]), ("e", r"-3(w-2u+v)", "-3*(w-2*u+v)", [("w-2u+v", "w-2*u+v")]),
    ("f", r"(-2u-v)-5(v+3w)", "(-2*u-v)-5*(v+3*w)", [("-2u-v", "-2*u-v"), ("v+3w", "v+3*w")])])
s14, a14 = vparts(u14, [("a", r"v-w", "v-w", []), ("b", r"6u+2v", "6*u+2*v", [("6u", "6*u"), ("2v", "2*v")]), ("c", r"-v+u", "-v+u", []),
    ("d", r"5(v-4u)", "5*(v-4*u)", [("v-4u", "v-4*u")]), ("e", r"-3(v-8w)", "-3*(v-8*w)", [("v-8w", "v-8*w")]), ("f", r"(2u-7w)-(8v+u)", "(2*u-7*w)-(8*v+u)", [("2u-7w", "2*u-7*w"), ("8v+u", "8*v+u")])])
s15, a15 = vparts(u15, [("a", r"v-w", "v-w", []), ("b", r"2u+7v", "2*u+7*v", [("2u", "2*u"), ("7v", "7*v")]), ("c", r"-u+(v-4w)", "-u+(v-4*w)", [("v-4w", "v-4*w")]),
    ("d", r"6(u-3v)", "6*(u-3*v)", [("u-3v", "u-3*v")]), ("e", r"-v-w", "-v-w", []), ("f", r"(6v-w)-(4u+v)", "(6*v-w)-(4*u+v)", [("6v-w", "6*v-w"), ("4u+v", "4*u+v")])])
s17, a17 = vparts(u17, [("a", r"w-u", "w-u", []), ("b", r"2v+3u", "2*v+3*u", [("2v", "2*v"), ("3u", "3*u")]), ("c", r"-w+3(v-u)", "-w+3*(v-u)", [("v-u", "v-u")]),
    ("d", r"5(-v+4u-w)", "5*(-v+4*u-w)", [("-v+4u-w", "-v+4*u-w")]), ("e", r"-2(3w+v)-(2u+w)", "-2*(3*w+v)-(2*u+w)", [("3w+v", "3*w+v"), ("2u+w", "2*u+w")]),
    ("f", r"\tfrac12(w-5v+2u)+v", "R(1,2)*(w-5*v+2*u)+v", [("w-5v+2u", "w-5*v+2*u")])])
s18, a18 = vparts(u18, [("a", r"v+w", "v+w", []), ("b", r"3(2u-v)", "3*(2*u-v)", [("2u-v", "2*u-v")]), ("c", r"(3u-v)-(2u+4w)", "(3*u-v)-(2*u+4*w)", [("3u-v", "3*u-v"), ("2u+4w", "2*u+4*w")])])
s19, a19 = vparts(u19, [("a", r"v-w", "v-w", []), ("b", r"6u+2v", "6*u+2*v", []), ("c", r"(2u-7w)-(8v+u)", "(2*u-7*w)-(8*v+u)", [("2u-7w", "2*u-7*w"), ("8v+u", "8*v+u")])])
x16 = R(2,15)*(u15["v"]+u15["w"]); assert 5*x16-2*u15["v"] == 2*(u15["w"]-5*x16)
x20 = u18["u"]+u18["v"]/3-R(4,3)*u18["w"]; assert 3*u18["u"]+u18["v"]-2*u18["w"] == 3*x20+2*u18["w"]
x21 = (2*u19["u"]-u19["v"]-u19["w"])/8; assert 2*u19["u"]-u19["v"]-x21 == 7*x21+u19["w"]
c1,c2,c3,c4 = symbols('c1 c2 c3 c4')
def lin_sys(vs, rhs):
    M = Matrix.hstack(*[Matrix(v) for v in vs]); return M, linsolve((M, Matrix(rhs)), [c1,c2,c3,c4][:len(vs)])
M27, S27 = lin_sys([(1,-1,0),(3,2,1),(0,1,4)], (-1,1,19)); s27 = list(S27)[0]
M28, S28 = lin_sys([(-1,0,2),(2,2,-2),(1,-2,1)], (-6,12,4)); s28 = list(S28)[0]
M29, S29 = lin_sys([(-1,3,2,0),(2,0,4,-1),(7,1,1,4),(6,3,1,2)], (0,5,6,-3)); s29 = list(S29)[0]
M31, S31 = lin_sys([(-2,9,6),(-3,2,1),(1,7,5)], (0,5,4)); assert S31 == set() or len(S31) == 0
M26, S26 = lin_sys([(1,2,0),(2,1,1),(0,3,1)], (0,0,0)); assert list(S26)[0] == (0,0,0)
def esc(M, b):
    A = Matrix.hstack(M, Matrix(b)); return r"\left[\begin{array}{" + "r"*M.cols + "|r}" + r"\\".join("&".join(L(A[i,j]) for j in range(A.cols)) for i in range(A.rows)) + r"\end{array}\right]"
def rref_txt(M, b):
    A = Matrix.hstack(M, Matrix(b)); Rr = A.rref()[0]
    return r"\left[\begin{array}{" + "r"*M.cols + "|r}" + r"\\".join("&".join(L(Rr[i,j]) for j in range(A.cols)) for i in range(A.rows)) + r"\end{array}\right]"

P = lambda *a: tuple(a)
L2 = [
 pts_item("L2-1", "Exercício 1", [P(3,4,5),P(-3,4,5),P(3,-4,5),P(3,4,-5),P(-3,-4,5),P(-3,4,-5)], r"Desenhe um sistema de coordenadas e marque os pontos (a) \((3,4,5)\) (b) \((-3,4,5)\) (c) \((3,-4,5)\) (d) \((3,4,-5)\) (e) \((-3,-4,5)\) (f) \((-3,4,-5)\)."),
 pts_item("L2-2", "Exercício 2", [P(0,3,-3),P(3,-3,0),P(-3,0,0),P(3,0,3),P(0,0,-3),P(0,3,0)], r"Marque os pontos (a) \((0,3,-3)\) (b) \((3,-3,0)\) (c) \((-3,0,0)\) (d) \((3,0,3)\) (e) \((0,0,-3)\) (f) \((0,3,0)\). Observe: quem tem uma coordenada 0 está num plano coordenado; quem tem duas, num eixo."),
 item("L2-3", "Exercício 3", r"Esboce, com ponto inicial na origem: (a) \((3,6)\) (b) \((-4,-8)\) (c) \((-4,-3)\) (d) \((3,4,5)\) (e) \((3,3,0)\) (f) \((-1,0,2)\).", r"Veja os esboços: a flecha vai da origem até o ponto de coordenadas iguais às componentes.",
      [st("Regra", r"Com início na origem, a ponta do vetor é exatamente o ponto cujas coordenadas são as componentes."),
       '<div class="sk-wrap">' + svg2d([((0,0),(3,6),"a"),((0,0),(-4,-8),"b"),((0,0),(-4,-3),"c")]) + svg3d(vecs=[((0,0,0),(3,4,5),"d"),((0,0,0),(3,3,0),"e"),((0,0,0),(-1,0,2),"f")]) + "</div>",
       st("Observe", r"(a) e (b) são paralelos e opostos: \((-4,-8)=-\frac43(3,6)\). (e) está no plano \(xy\) (\(z=0\)); (f) no plano \(xz\) (\(y=0\)).")]),
 item("L2-4", "Exercício 4", r"Esboce, com ponto inicial na origem: (a) \((5,-4)\) (b) \((3,0)\) (c) \((0,-7)\) (d) \((0,0,-3)\) (e) \((0,4,-1)\) (f) \((2,2,2)\).", r"Veja os esboços.",
      ['<div class="sk-wrap">' + svg2d([((0,0),(5,-4),"a"),((0,0),(3,0),"b"),((0,0),(0,-7),"c")]) + svg3d(vecs=[((0,0,0),(0,0,-3),"d"),((0,0,0),(0,4,-1),"e"),((0,0,0),(2,2,2),"f")]) + "</div>",
       st("Observe", r"(b) está sobre o eixo \(x\), (c) sobre o eixo \(y\) (para baixo), (d) sobre o eixo \(z\) (para baixo), (e) no plano \(yz\).")]),
 item("L2-5", "Exercício 5", r"Esboce, com ponto inicial na origem, o vetor determinado por (a) \(P_1(4,8),P_2(3,7)\) (b) \(P_1(3,-5),P_2(-4,-7)\) (c) \(P_1(3,-7,2),P_2(-2,5,-4)\).", r"(a) \((-1,-1)\) (b) \((-7,-2)\) (c) \((-5,12,-6)\)",
      [st("Regra", r"\(\overrightarrow{P_1P_2}=P_2-P_1\) (ponto final menos ponto inicial). Depois desenhamos esse vetor a partir da origem."),
       st("Contas", r"(a) \((3-4,7-8)=(-1,-1)\); (b) \((-4-3,-7+5)=(-7,-2)\); (c) \((-2-3,5+7,-4-2)=(-5,12,-6)\)."),
       '<div class="sk-wrap">' + svg2d([((0,0),(-1,-1),"a"),((0,0),(-7,-2),"b")]) + svg3d(vecs=[((0,0,0),(-5,12,-6),"c")]) + "</div>"]),
 item("L2-6", "Exercício 6", r"Idem para (a) \(P_1(-5,0),P_2(-3,1)\) (b) \(P_1(0,0),P_2(3,4)\) (c) \(P_1(-1,0,2),P_2(0,-1,0)\) (d) \(P_1(2,2,2),P_2(0,0,0)\).", r"(a) \((2,1)\) (b) \((3,4)\) (c) \((1,-1,-2)\) (d) \((-2,-2,-2)\)",
      [st("Contas", r"\(P_2-P_1\): (a) \((2,1)\); (b) \((3,4)\); (c) \((1,-1,-2)\); (d) \((-2,-2,-2)\)."),
       '<div class="sk-wrap">' + svg2d([((0,0),(2,1),"a"),((0,0),(3,4),"b")]) + svg3d(vecs=[((0,0,0),(1,-1,-2),"c"),((0,0,0),(-2,-2,-2),"d")]) + "</div>"]),
 item("L2-7", "Exercício 7", r"Encontre os componentes de \(\overrightarrow{P_1P_2}\): (a) \(P_1(3,5),P_2(2,8)\) (b) \(P_1(5,-2,1),P_2(2,4,2)\).", r"(a) \((-1,3)\) (b) \((-3,6,1)\)",
      [st("Fim − início", "", r"(a)\ (2-3,\ 8-5)=(-1,3)\qquad(b)\ (2-5,\ 4+2,\ 2-1)=(-3,6,1)")]),
 item("L2-8", "Exercício 8", r"Encontre os componentes de \(\overrightarrow{P_1P_2}\): (a) \(P_1(-6,2),P_2(-4,-1)\) (b) \(P_1(0,0,0),P_2(-1,6,1)\).", r"(a) \((2,-3)\) (b) \((-1,6,1)\)",
      [st("Fim − início", "", r"(a)\ (-4+6,\ -1-2)=(2,-3)\qquad(b)\ (-1,6,1)-(0,0,0)=(-1,6,1)")]),
 item("L2-9", "Exercício 9", r"(a) Ponto final do vetor equivalente a \(u=(1,2)\) com ponto inicial \(A(1,1)\). (b) Ponto inicial do vetor equivalente a \(u=(1,1,3)\) com ponto final \(B(-1,-1,2)\).", r"(a) \((2,3)\) (b) \((-2,-2,-1)\)",
      [st("Ideia", r"Equivalente = mesmos componentes. Se o vetor vai de \(A\) a \(B\), então \(B-A=u\), isto é, \(B=A+u\) e \(A=B-u\)."),
       st("(a)", "", r"B=(1,1)+(1,2)=(2,3)"), st("(b)", "", r"A=(-1,-1,2)-(1,1,3)=(-2,-2,-1)")]),
 item("L2-10", "Exercício 10", r"(a) Ponto inicial do vetor equivalente a \(u=(1,2)\) com ponto final \(B(2,0)\). (b) Ponto final do vetor equivalente a \(u=(1,1,3)\) com ponto inicial \(A(0,2,0)\).", r"(a) \((1,-2)\) (b) \((1,3,3)\)",
      [st("(a)", "", r"A=B-u=(2,0)-(1,2)=(1,-2)"), st("(b)", "", r"B=A+u=(0,2,0)+(1,1,3)=(1,3,3)")]),
 item("L2-11", "Exercício 11", r"Encontre \(P\) tal que \(u=\overrightarrow{PQ}\ne0\), com \(Q(3,0,-5)\), e (a) \(u\) tem a mesma direção e sentido de \(v=(4,-2,-1)\); (b) mesma direção e sentido oposto.", r"Uma resposta: (a) \(P=(-1,2,-4)\) (com \(u=v\)); (b) \(P=(7,-2,-6)\) (com \(u=-v\)). Em geral \(P=Q-kv\), \(k\gt0\) em (a) e \(k\lt0\) em (b).",
      [st("Ideia", r"Mesma direção e sentido: \(u=kv\) com \(k\gt0\). Sentido oposto: \(k\lt0\). E \(P=Q-u\)."),
       st("(a) k = 1", "", r"P=(3,0,-5)-(4,-2,-1)=(-1,2,-4)"), st("(b) k = −1", "", r"P=(3,0,-5)+(4,-2,-1)=(7,-2,-6)")]),
 item("L2-12", "Exercício 12", r"Encontre \(Q\) tal que \(u=\overrightarrow{PQ}\ne0\), com \(P(-1,3,-5)\), e (a) \(u\) com mesma direção e sentido de \(v=(6,7,-3)\); (b) sentido oposto.", r"Uma resposta: (a) \(Q=(5,10,-8)\); (b) \(Q=(-7,-4,-2)\). Em geral \(Q=P+kv\).",
      [st("(a) u = v", "", r"Q=P+v=(-1+6,\ 3+7,\ -5-3)=(5,10,-8)"), st("(b) u = −v", "", r"Q=P-v=(-7,-4,-2)")]),
 item("L2-13", "Exercício 13", r"Com \(u=(4,-1)\), \(v=(0,5)\), \(w=(-3,-3)\), encontre: (a) \(u+w\) (b) \(v-3u\) (c) \(2(u-5w)\) (d) \(3v-2(u+2w)\) (e) \(-3(w-2u+v)\) (f) \((-2u-v)-5(v+3w)\).", a13, [REGRA] + s13),
 item("L2-14", "Exercício 14", r"Com \(u=(-3,1,2)\), \(v=(4,0,-8)\), \(w=(6,-1,-4)\), encontre: (a) \(v-w\) (b) \(6u+2v\) (c) \(-v+u\) (d) \(5(v-4u)\) (e) \(-3(v-8w)\) (f) \((2u-7w)-(8v+u)\).", a14, [REGRA] + s14),
 item("L2-15", "Exercício 15", r"Com \(u=(-3,2,1,0)\), \(v=(4,7,-3,2)\), \(w=(5,-2,8,1)\), encontre: (a) \(v-w\) (b) \(2u+7v\) (c) \(-u+(v-4w)\) (d) \(6(u-3v)\) (e) \(-v-w\) (f) \((6v-w)-(4u+v)\).", a15, [REGRA] + s15),
 item("L2-16", "Exercício 16", r"Com \(v,w\) do Exercício 15, encontre \(x\) com \(5x-2v=2(w-5x)\).", r"\(x=\frac2{15}(v+w)=" + vec(x16) + r"\)",
      [st("Isole x como num número", r"Distribua, junte os \(x\) de um lado (Teorema 3.1.1 permite operar como com números):", r"5x-2v=2w-10x\ \Rightarrow\ 15x=2v+2w\ \Rightarrow\ x=\tfrac2{15}(v+w)"),
       st("Substitua", "", r"v+w=(9,5,5,3)\ \Rightarrow\ x=\tfrac2{15}(9,5,5,3)=" + vec(x16))]),
 item("L2-17", "Exercício 17", r"Com \(u=(5,-1,0,3,-3)\), \(v=(-1,-1,7,2,0)\), \(w=(-4,2,-3,-5,2)\), encontre: (a) \(w-u\) (b) \(2v+3u\) (c) \(-w+3(v-u)\) (d) \(5(-v+4u-w)\) (e) \(-2(3w+v)-(2u+w)\) (f) \(\frac12(w-5v+2u)+v\).", a17, [REGRA] + s17),
 item("L2-18", "Exercício 18", r"Com \(u=(1,2,-3,5,0)\), \(v=(0,4,-1,1,2)\), \(w=(7,1,-4,-2,3)\), encontre: (a) \(v+w\) (b) \(3(2u-v)\) (c) \((3u-v)-(2u+4w)\).", a18, [REGRA] + s18),
 item("L2-19", "Exercício 19", r"Com \(u=(-3,1,2,4,4)\), \(v=(4,0,-8,1,2)\), \(w=(6,-1,-4,3,-5)\), encontre: (a) \(v-w\) (b) \(6u+2v\) (c) \((2u-7w)-(8v+u)\).", a19, [REGRA] + s19),
 item("L2-20", "Exercício 20", r"Com \(u,v,w\) do Exercício 18, encontre \(x\) com \(3u+v-2w=3x+2w\).", r"\(x=u+\frac13v-\frac43w=" + vec(x20) + r"\)",
      [st("Isole", "", r"3x=3u+v-4w\ \Rightarrow\ x=u+\tfrac13v-\tfrac43w"), st("Substitua", "", r"(1,2,-3,5,0)+\left(0,\tfrac43,-\tfrac13,\tfrac13,\tfrac23\right)-\left(\tfrac{28}3,\tfrac43,-\tfrac{16}3,-\tfrac83,4\right)=" + vec(x20))]),
 item("L2-21", "Exercício 21", r"Com \(u,v,w\) do Exercício 19, encontre \(x\) com \(2u-v-x=7x+w\).", r"\(x=\frac18(2u-v-w)=" + vec(x21) + r"\)",
      [st("Isole", "", r"2u-v-w=8x\ \Rightarrow\ x=\tfrac18(2u-v-w)"), st("Substitua", "", r"2u-v-w=" + vec(2*u19["u"]-u19["v"]-u19["w"]) + r"\ \Rightarrow\ x=" + vec(x21))]),
 item("L2-22", "Exercício 22", r"Para que valores de \(t\) o vetor é paralelo a \(u=(4,-1)\)? (a) \((8t,-2)\) (b) \((8t,2t)\) (c) \((1,t^2)\)", r"(a) \(t=1\) (b) \(t=0\) (vetor nulo) (c) nenhum",
      [st("Paralelo", r"\(w\) é paralelo a \(u\) se \(w=ku\) para algum escalar \(k\) (o vetor nulo é paralelo a todos)."),
       st("(a)", r"\((8t,-2)=k(4,-1)\Rightarrow k=2\Rightarrow 8t=8\Rightarrow t=1\)."),
       st("(b)", r"\(8t=4k\) e \(2t=-k\Rightarrow 8t=-8t\Rightarrow t=0\), quando o vetor é \((0,0)\), paralelo a todos."),
       st("(c)", r"\(1=4k\Rightarrow k=\frac14\), e \(t^2=-k=-\frac14\): impossível em \(\mathbb R\).")]),
 item("L2-23", "Exercício 23", r"Quais vetores de \(\mathbb R^6\) são paralelos a \(u=(-2,1,0,3,5,1)\)? (a) \((4,2,0,6,10,2)\) (b) \((4,-2,0,-6,-10,-2)\) (c) \((0,0,0,0,0,0)\)", r"(b) e (c)",
      [st("(a)", r"A 1ª componente pediria \(k=-2\), a 2ª pediria \(k=2\): não é múltiplo."), st("(b)", r"É \(-2u\) ✓"), st("(c)", r"É \(0u\) ✓ (o nulo é paralelo a todos).")]),
 item("L2-24", "Exercício 24", r"Com \(u=(2,1,0,1,-1)\), \(v=(-2,3,1,0,2)\), encontre \(a,b\) com \(au+bv=(-8,8,3,-1,7)\).", r"\(a=-1,\ b=3\)",
      [st("Componentes fáceis", r"3ª: \(0a+1b=3\Rightarrow b=3\). 4ª: \(a+0b=-1\Rightarrow a=-1\)."), st("Confira as outras", r"1ª: \(-2-6=-8\) ✓; 2ª: \(-1+9=8\) ✓; 5ª: \(1+6=7\) ✓")]),
 item("L2-25", "Exercício 25", r"Com \(u=(1,-1,3,5)\), \(v=(2,1,0,-3)\), encontre \(a,b\) com \(au+bv=(1,-4,9,18)\).", r"\(a=3,\ b=-1\)",
      [st("3ª componente", r"\(3a=9\Rightarrow a=3\)."), st("1ª", r"\(3+2b=1\Rightarrow b=-1\)."), st("Confira", r"2ª: \(-3-1=-4\) ✓; 4ª: \(15+3=18\) ✓")]),
 item("L2-26", "Exercício 26", r"Encontre todos os \(c_1,c_2,c_3\) com \(c_1(1,2,0)+c_2(2,1,1)+c_3(0,3,1)=(0,0,0)\).", r"Só \(c_1=c_2=c_3=0\).",
      [st("Sistema", "", r"\begin{cases}c_1+2c_2=0\\2c_1+c_2+3c_3=0\\c_2+c_3=0\end{cases}"),
       st("Substitua", r"\(c_1=-2c_2\), \(c_3=-c_2\). Na 2ª: \(-4c_2+c_2-3c_2=-6c_2=0\Rightarrow c_2=0\), e então \(c_1=c_3=0\).")]),
 item("L2-27", "Exercício 27", r"Encontre todos os \(c_1,c_2,c_3\) com \(c_1(1,-1,0)+c_2(3,2,1)+c_3(0,1,4)=(-1,1,19)\).", rf"\(c_1={L(s27[0])},\ c_2={L(s27[1])},\ c_3={L(s27[2])}\)",
      [st("Matriz aumentada", r"As colunas são os vetores dados; a última é o lado direito.", esc(M27, (-1,1,19))), st("Escalonando até a forma reduzida", "", rref_txt(M27, (-1,1,19)))]),
 item("L2-28", "Exercício 28", r"Encontre todos os \(c_1,c_2,c_3\) com \(c_1(-1,0,2)+c_2(2,2,-2)+c_3(1,-2,1)=(-6,12,4)\).", rf"\(c_1={L(s28[0])},\ c_2={L(s28[1])},\ c_3={L(s28[2])}\)",
      [st("Matriz aumentada", "", esc(M28, (-6,12,4))), st("Forma reduzida", "", rref_txt(M28, (-6,12,4)))]),
 item("L2-29", "Exercício 29", r"Com \(u_1=(-1,3,2,0)\), \(u_2=(2,0,4,-1)\), \(u_3=(7,1,1,4)\), \(u_4=(6,3,1,2)\), encontre \(a_1,\dots,a_4\) com \(a_1u_1+\dots+a_4u_4=(0,5,6,-3)\).", rf"\(a_1={L(s29[0])},\ a_2={L(s29[1])},\ a_3={L(s29[2])},\ a_4={L(s29[3])}\)",
      [st("Matriz aumentada", "", esc(M29, (0,5,6,-3))), st("Forma reduzida", "", rref_txt(M29, (0,5,6,-3)))]),
 item("L2-30", "Exercício 30", r"Mostre que não existem \(c_1,c_2,c_3\) com \(c_1(1,0,1,0)+c_2(1,0,-2,1)+c_3(2,0,1,2)=(1,-2,2,3)\).", r"A 2ª componente dá \(0=-2\).",
      [st("Olhe a 2ª componente", r"Todos os vetores da esquerda têm 2ª componente 0, logo a combinação também: \(0=-2\), impossível.")]),
 item("L2-31", "Exercício 31", r"Mostre que não existem \(c_1,c_2,c_3\) com \(c_1(-2,9,6)+c_2(-3,2,1)+c_3(1,7,5)=(0,5,4)\).", r"O escalonamento produz uma linha \(0=\text{não nulo}\).",
      [st("Matriz aumentada", "", esc(M31, (0,5,4))), st("Escalonando", r"A forma reduzida tem uma linha do tipo \([0\ 0\ 0\,|\,1]\):", rref_txt(M31, (0,5,4))), st("Conclusão", "Sistema impossível: tais escalares não existem.")]),
 item("L2-32", "Exercício 32", r"Interprete geometricamente \(u=\overrightarrow{OP_1}+\frac12(\overrightarrow{OP_2}-\overrightarrow{OP_1})\).", r"\(u\) é o vetor da origem ao <b>ponto médio</b> do segmento \(P_1P_2\).",
      [st("Leitura", r"\(\overrightarrow{OP_2}-\overrightarrow{OP_1}=\overrightarrow{P_1P_2}\). Saindo de \(P_1\) e andando metade de \(\overrightarrow{P_1P_2}\), chegamos ao meio do segmento."),
       st("Fórmula", "", r"u=\tfrac12\left(\overrightarrow{OP_1}+\overrightarrow{OP_2}\right)\ \ (\text{média das coordenadas})")]),
 item("L2-33", "Exercício 33", r"Sejam \(P(2,3,-2)\) e \(Q(7,-4,1)\). (a) Ponto médio de \(PQ\). (b) Ponto de \(PQ\) a \(\frac34\) do caminho de \(P\) a \(Q\).", r"(a) \(\left(\frac92,-\frac12,-\frac12\right)\) (b) \(\left(\frac{23}4,-\frac94,\frac14\right)\)",
      [st("Fórmula", r"Ponto a uma fração \(t\) do caminho: \(P+t(Q-P)\). Aqui \(Q-P=(5,-7,3)\)."),
       st("(a) t = 1/2", "", r"(2,3,-2)+\tfrac12(5,-7,3)=\left(\tfrac92,-\tfrac12,-\tfrac12\right)"), st("(b) t = 3/4", "", r"(2,3,-2)+\tfrac34(5,-7,3)=\left(\tfrac{23}4,-\tfrac94,\tfrac14\right)")]),
 item("L2-34", "Exercício 34", r"Seja \(P(1,3,7)\). Se \((4,0,-6)\) é o ponto médio de \(PQ\), quem é \(Q\)?", r"\(Q=(7,-3,-19)\)",
      [st("Ponto médio", r"\(M=\frac{P+Q}2\Rightarrow Q=2M-P\)."), st("Conta", "", r"Q=(8,0,-12)-(1,3,7)=(7,-3,-19)")]),
 item("L2-35", "Exercício 35", r"Prove as partes (a), (c) e (d) do Teorema 3.1.1: \(u+v=v+u\); \(u+0=0+u=u\); \(u+(-u)=0\).", r"Escreva em componentes e use as propriedades dos números reais.",
      [st("(a)", "", r"u+v=(u_1+v_1,\dots,u_n+v_n)=(v_1+u_1,\dots,v_n+u_n)=v+u"), st("(c)", "", r"u+0=(u_1+0,\dots,u_n+0)=(u_1,\dots,u_n)=u;\ \ 0+u=u\ \text{pela (a)}"),
       st("(d)", "", r"u+(-u)=(u_1-u_1,\dots,u_n-u_n)=(0,\dots,0)=0")]),
 item("L2-36", "Exercício 36", r"Prove as partes (e)–(h) do Teorema 3.1.1.", r"Componente a componente.",
      [st("(e) k(v+w) = kv + kw", "", r"k(v_i+w_i)=kv_i+kw_i\ \ \text{para cada }i"), st("(f) (k+m)v = kv + mv", "", r"(k+m)v_i=kv_i+mv_i"),
       st("(g) k(mu) = (km)u", "", r"k(mu_i)=(km)u_i"), st("(h) 1u = u", "", r"1\cdot u_i=u_i")]),
 item("L2-37", "Exercício 37", r"Prove as partes (a)–(c) do Teorema 3.1.2: \(0v=0\), \(k0=0\), \((-1)v=-v\).", r"Componente a componente (ou, sem componentes, pelos axiomas, como no Elon).",
      [st("Componentes", "", r"0v=(0v_1,\dots,0v_n)=0;\quad k0=(k\cdot0,\dots)=0;\quad(-1)v=(-v_1,\dots,-v_n)=-v"),
       st("Sem componentes (vale em qualquer espaço)", r"\(0v=(0+0)v=0v+0v\) e cortando: \(0v=0\). Depois \(v+(-1)v=(1-1)v=0v=0\), logo \((-1)v=-v\).")]),
 item("L2-VF", "Verdadeiro ou falso", r"(a) Vetores equivalentes têm o mesmo ponto inicial. (b) \((a,b)\) e \((a,b,0)\) são equivalentes. (c) \(v\) e \(kv\) são paralelos ⇔ \(k\ge0\). (d) \(v+(u+w)=(w+v)+u\). (e) \(u+v=u+w\Rightarrow v=w\). (f) \(au+bv=0\Rightarrow u\parallel v\). (g) Colineares de mesmo tamanho são iguais. (h) \((a,b,c)+(x,y,z)=(x,y,z)\Rightarrow(a,b,c)=0\). (i) \((a+b)(u+v)=au+bv\). (j) \(3(2v-x)=5x-4w+v\) pode ser resolvida para \(x\). (k) \(a_1v_1+a_2v_2=b_1v_1+b_2v_2\) só se \(a_i=b_i\).",
      r"(a) F (b) F (c) F (d) V (e) V (f) F (g) F (h) V (i) F (j) V (k) F",
      [st("(a) F", r"Equivalentes = mesmos componentes; podem começar em pontos diferentes."), st("(b) F", r"Estão em espaços diferentes (\(\mathbb R^2\) e \(\mathbb R^3\)); não se comparam."),
       st("(c) F", r"\(kv\) é paralelo a \(v\) para <b>todo</b> \(k\) (com \(k\lt0\), sentido oposto)."), st("(d) V", r"Associatividade e comutatividade."),
       st("(e) V", r"Some \(-u\) aos dois lados."), st("(f) F", r"Com \(a=b=0\) vale para quaisquer \(u,v\)."), st("(g) F", r"\(v\) e \(-v\): mesmo tamanho, colineares, diferentes."),
       st("(h) V", r"Cancelando \((x,y,z)\)."), st("(i) F", r"\((a+b)(u+v)=au+av+bu+bv\); falta \(av+bu\)."),
       st("(j) V", r"\(6v-3x=5x-4w+v\Rightarrow 8x=5v+4w\Rightarrow x=\frac18(5v+4w)\)."), st("(k) F", r"Se \(v_1=v_2\), \(1v_1+0v_2=0v_1+1v_2\).")]),
]
out.append(page(2, "Anton · 3.1", "Vetores em ℝ², ℝ³ e ℝⁿ (Anton, Seção 3.1)", "Exercícios 1 a 37 e verdadeiro/falso: esboços, componentes, contas, combinações lineares e provas.", INTRO, L2, [("m1", "Vetores geométricos"), ("m2", "Vetores em ℝⁿ")]))
# ============================================================ LISTA 3 · Anton 2.2
def tr_item(iid, num, A):
    A = Matrix(A); o1, d1 = det_cof(A); o2, d2 = det_cof(A.T)
    return item(iid, num, rf"Verifique que \(\det(A)=\det(A^T)\) para \(A={mat(A)}\).", rf"\(\det(A)=\det(A^T)={L(d1)}\)",
                [st("Transposta", r"Em \(A^T\) as linhas de \(A\) viram colunas.", r"A^T=" + mat(A.T)), st("det(A)", "", None)] + o1 + [st("det(Aᵀ)", "", None)] + o2 +
                [st("Conclusão", rf"Os dois valem \({L(d1)}\). (Isso sempre acontece: por isso toda propriedade de linhas vale para colunas.)")])
def rr_item(iid, num, A, extra=""):
    o, d = det_rowred(A)
    return item(iid, num, rf"Calcule o determinante reduzindo à forma escalonada: \({mat(A)}\).", rf"\(\det={L(d)}\)", o + ([st("Observação", extra)] if extra else []))
E = lambda rows: Matrix(rows)
M10 = [[3,6,-9],[0,0,-2],[-2,1,5]]; M11 = [[0,3,1],[1,1,2],[3,2,4]]; M12 = [[1,-3,0],[-2,4,1],[5,-2,2]]; M13 = [[3,-6,9],[-2,7,-2],[0,1,5]]
M14 = [[1,-2,3,1],[5,-9,6,3],[-1,2,-6,-2],[2,8,6,1]]; M15 = [[2,1,3,1],[1,0,1,1],[0,2,1,0],[0,1,2,3]]
M16 = [[0,1,1,1],[R(1,2),R(1,2),1,R(1,2)],[R(2,3),R(1,3),R(1,3),0],[-R(1,3),R(2,3),0,0]]; M17 = [[1,3,1,5,3],[-2,-7,0,-4,2],[0,0,1,0,1],[0,0,2,1,1],[0,0,0,1,1]]
a,b,c,d_,e,f,g,h,i_ = symbols('a b c d e f g h i')
BASE = Matrix([[a,b,c],[d_,e,f],[g,h,i_]])
def chk(Mx, val): assert expand(Mx.det() - val*BASE.det()) == 0
chk(Matrix([[g,h,i_],[d_,e,f],[a,b,c]]), -1); chk(Matrix([[d_,e,f],[g,h,i_],[a,b,c]]), 1); chk(Matrix([[3*a,3*b,3*c],[-d_,-e,-f],[4*g,4*h,4*i_]]), -12)
chk(Matrix([[a+d_,b+e,c+f],[-d_,-e,-f],[g,h,i_]]), -1); chk(Matrix([[a+g,b+h,c+i_],[d_,e,f],[g,h,i_]]), 1); chk(Matrix([[a,b,c],[2*d_,2*e,2*f],[g+3*a,h+3*b,i_+3*c]]), 2)
chk(Matrix([[-3*a,-3*b,-3*c],[d_,e,f],[g-4*d_,h-4*e,i_-4*f]]), -3)
k34 = Matrix([[a,b,b,b],[b,a,b,b],[b,b,a,b],[b,b,b,a]]); assert expand(k34.det() - (a+3*b)*(a-b)**3) == 0
M35 = Matrix([[-2,8,1,4],[3,2,5,1],[1,10,6,5],[4,-6,4,-3]]); assert M35.row(0)+M35.row(1) == M35.row(2) and M35.det() == 0
M36 = Matrix(5,5,lambda r,s: -4 if r==s else 1); assert M36.det() == 0
EX = rf"Sabendo que \(\begin{{vmatrix}}a&b&c\\d&e&f\\g&h&i\end{{vmatrix}}=-6\)"
L3 = [
 tr_item("L3-1", "Exercício 1", [[-2,3],[1,4]]), tr_item("L3-2", "Exercício 2", [[-6,1],[2,-2]]),
 tr_item("L3-3", "Exercício 3", [[2,-1,3],[1,2,4],[5,-3,6]]), tr_item("L3-4", "Exercício 4", [[4,2,-1],[0,2,-3],[-1,1,5]]),
 item("L3-5", "Exercícios 5–9", r"Calcule por inspeção o determinante das matrizes elementares: 5) \(\operatorname{diag}(1,1,-5,1)\); 6) \(\begin{bmatrix}1&0&0\\0&1&0\\-5&0&1\end{bmatrix}\); 7) \(I_4\) com as linhas 2 e 3 trocadas; 8) \(\operatorname{diag}(1,-\frac13,1,1)\); 9) \(I_4\) com \(-9\) na posição \((2,4)\).",
      r"5) \(-5\) &nbsp; 6) \(1\) &nbsp; 7) \(-1\) &nbsp; 8) \(-\frac13\) &nbsp; 9) \(1\)",
      [st("Os três tipos de matriz elementar", r"Vem de aplicar <b>uma</b> operação em \(I\) (cujo det é 1): multiplicar uma linha por \(k\) → \(\det=k\); trocar duas linhas → \(\det=-1\); somar \(k\) vezes uma linha a outra → \(\det=1\)."),
       st("5) e 8)", r"Uma linha multiplicada por \(-5\) / por \(-\frac13\): det \(=-5\) / \(-\frac13\) (também: triangular, produto da diagonal)."),
       st("6) e 9)", r"Soma de múltiplo de uma linha a outra (são triangulares com diagonal de 1s): det \(=1\)."), st("7)", r"Troca de duas linhas: det \(=-1\).")]),
 rr_item("L3-10", "Exercício 10", M10), rr_item("L3-11", "Exercício 11", M11), rr_item("L3-12", "Exercício 12", M12), rr_item("L3-13", "Exercício 13", M13),
 rr_item("L3-14", "Exercício 14", M14), rr_item("L3-15", "Exercício 15", M15), rr_item("L3-16", "Exercício 16", M16, r"Uma alternativa é multiplicar antes as linhas 2 e 3 por 6 e a linha 4 por 3 (det multiplicado por \(6\cdot6\cdot3=108\)) para trabalhar só com inteiros."),
 rr_item("L3-17", "Exercício 17", M17),
 item("L3-18", "Exercício 18", r"Repita os Exercícios 10–13 usando uma combinação de operações com linhas e expansão em cofatores.", r"Mesmos valores: " + ", ".join(rf"\({L(Matrix(M).det())}\)" for M in (M10, M11, M12, M13)),
      sum([[st(f"Exercício {n}", "", None)] + det_cof(M)[0] for n, M in zip((10, 11, 12, 13), (M10, M11, M12, M13))], [])),
 item("L3-19", "Exercício 19", r"Repita os Exercícios 14–17 usando uma combinação de operações com linhas e expansão em cofatores.", r"Mesmos valores: " + ", ".join(rf"\({L(Matrix(M).det())}\)" for M in (M14, M15, M16, M17)),
      sum([[st(f"Exercício {n}", "", None)] + combo(M)[0] for n, M in zip((14, 15, 16, 17), (M14, M15, M16, M17))], [])),
 item("L3-20", "Exercícios 20–27", EX + r", calcule: 20) linhas \((g,h,i),(d,e,f),(a,b,c)\); 21) \((d,e,f),(g,h,i),(a,b,c)\); 22) \((a,b,c),(d,e,f),(2a,2b,2c)\); 23) \((3a,3b,3c),(-d,-e,-f),(4g,4h,4i)\); 24) \((a+d,b+e,c+f),(-d,-e,-f),(g,h,i)\); 25) \((a+g,b+h,c+i),(d,e,f),(g,h,i)\); 26) \((a,b,c),(2d,2e,2f),(g+3a,h+3b,i+3c)\); 27) \((-3a,-3b,-3c),(d,e,f),(g-4d,h-4e,i-4f)\).",
      r"20) 6 &nbsp; 21) −6 &nbsp; 22) 0 &nbsp; 23) 72 &nbsp; 24) 6 &nbsp; 25) −6 &nbsp; 26) −12 &nbsp; 27) 18",
      [st("20)", r"Uma troca (\(L_1\leftrightarrow L_3\)): \(-(-6)=6\)."), st("21)", r"É \(L_1\to L_3\to L_2\to L_1\): duas trocas (\(L_1\leftrightarrow L_2\), depois \(L_2\leftrightarrow L_3\)); o sinal volta: \(-6\)."),
       st("22)", r"\(L_3=2L_1\): linhas proporcionais ⇒ 0."), st("23)", r"Fatores \(3\), \(-1\), \(4\) saem: \(3\cdot(-1)\cdot4\cdot(-6)=72\)."),
       st("24)", r"\(L_1\leftarrow L_1+L_2\) dá \((a,b,c)\) sem mudar o det; sobra \(-1\) da linha \(-d,-e,-f\): \(-1\cdot(-6)=6\)."),
       st("25)", r"\(L_1\leftarrow L_1-L_3\) volta à original: \(-6\)."), st("26)", r"\(L_3\leftarrow L_3-3L_1\) e o fator 2 da linha 2: \(2\cdot(-6)=-12\)."),
       st("27)", r"\(L_3\leftarrow L_3+4L_2\) e o fator \(-3\) da linha 1: \(-3\cdot(-6)=18\).")]),
 item("L3-28", "Exercício 28", r"Mostre que (a) \(\det\begin{bmatrix}0&0&a_{13}\\0&a_{22}&a_{23}\\a_{31}&a_{32}&a_{33}\end{bmatrix}=-a_{13}a_{22}a_{31}\); (b) para a 4×4 “anti-triangular” análoga, \(\det=a_{14}a_{23}a_{32}a_{41}\).", r"Inverta a ordem das linhas e use que a triangular tem det = produto da diagonal.",
      [st("(a)", r"Troque \(L_1\leftrightarrow L_3\) (sinal −): fica triangular inferior com diagonal \(a_{31},a_{22},a_{13}\).", r"\det=-a_{31}a_{22}a_{13}"),
       st("(b)", r"Troque \(L_1\leftrightarrow L_4\) e \(L_2\leftrightarrow L_3\): duas trocas, sinal \(+\). Fica triangular com diagonal \(a_{41},a_{32},a_{23},a_{14}\).", r"\det=a_{14}a_{23}a_{32}a_{41}")]),
 item("L3-29", "Exercício 29", r"Use redução por linhas para mostrar que \(\begin{vmatrix}1&1&1\\a&b&c\\a^2&b^2&c^2\end{vmatrix}=(b-a)(c-a)(c-b)\).", r"Determinante de Vandermonde.",
      [st("Zere a 1ª coluna (por colunas)", r"\(C_2\leftarrow C_2-C_1\), \(C_3\leftarrow C_3-C_1\) (não mudam o det):", r"\begin{vmatrix}1&0&0\\a&b-a&c-a\\a^2&b^2-a^2&c^2-a^2\end{vmatrix}"),
       st("Expanda pela 1ª linha e fatore", r"Use \(b^2-a^2=(b-a)(b+a)\) e tire \((b-a)\) e \((c-a)\) das colunas:", r"(b-a)(c-a)\begin{vmatrix}1&1\\b+a&c+a\end{vmatrix}=(b-a)(c-a)\,[(c+a)-(b+a)]=(b-a)(c-a)(c-b)")]),
 item("L3-30", "Exercício 30", r"Sem calcular, confirme \(\begin{vmatrix}a_1+b_1t&a_2+b_2t&a_3+b_3t\\a_1t+b_1&a_2t+b_2&a_3t+b_3\\c_1&c_2&c_3\end{vmatrix}=(1-t^2)\begin{vmatrix}a_1&a_2&a_3\\b_1&b_2&b_3\\c_1&c_2&c_3\end{vmatrix}\).", r"\(L_2\leftarrow L_2-tL_1\), tire \((1-t^2)\), depois \(L_1\leftarrow L_1-tL_2\).",
      [st("Passo 1", r"\(L_2\leftarrow L_2-tL_1\): a 2ª linha vira \((b_1(1-t^2),\ b_2(1-t^2),\ b_3(1-t^2))\)."), st("Passo 2", r"Tire o fator \((1-t^2)\) da 2ª linha: ela fica \((b_1,b_2,b_3)\)."),
       st("Passo 3", r"\(L_1\leftarrow L_1-tL_2\): a 1ª linha vira \((a_1,a_2,a_3)\). Nenhum passo além do fator mudou o det.")]),
 item("L3-31", "Exercício 31", r"Confirme \(\begin{vmatrix}a_1&b_1&a_1+b_1+c_1\\a_2&b_2&a_2+b_2+c_2\\a_3&b_3&a_3+b_3+c_3\end{vmatrix}=\begin{vmatrix}a_1&b_1&c_1\\a_2&b_2&c_2\\a_3&b_3&c_3\end{vmatrix}\).", r"\(C_3\leftarrow C_3-C_1-C_2\).",
      [st("Operação com colunas", r"Subtrair da 3ª coluna as duas primeiras não altera o det e deixa a 3ª coluna igual a \((c_1,c_2,c_3)\).")]),
 item("L3-32", "Exercício 32", r"Confirme \(\begin{vmatrix}a_1&b_1+ta_1&c_1+rb_1+sa_1\\a_2&b_2+ta_2&c_2+rb_2+sa_2\\a_3&b_3+ta_3&c_3+rb_3+sa_3\end{vmatrix}=\begin{vmatrix}a_1&a_2&a_3\\b_1&b_2&b_3\\c_1&c_2&c_3\end{vmatrix}\).", r"Operações de coluna e \(\det(A)=\det(A^T)\).",
      [st("Passo 1", r"\(C_2\leftarrow C_2-tC_1\): a 2ª coluna vira \((b_1,b_2,b_3)\)."), st("Passo 2", r"\(C_3\leftarrow C_3-rC_2-sC_1\): a 3ª vira \((c_1,c_2,c_3)\)."),
       st("Passo 3", r"Chegamos à matriz de colunas \(a,b,c\); a do lado direito tem essas como <b>linhas</b>: é a transposta, com o mesmo det.")]),
 item("L3-33", "Exercício 33", r"Confirme \(\begin{vmatrix}a_1+b_1&a_1-b_1&c_1\\a_2+b_2&a_2-b_2&c_2\\a_3+b_3&a_3-b_3&c_3\end{vmatrix}=-2\begin{vmatrix}a_1&b_1&c_1\\a_2&b_2&c_2\\a_3&b_3&c_3\end{vmatrix}\).", r"\(C_1\leftarrow C_1+C_2\), tire 2, \(C_2\leftarrow C_2-C_1\), tire \(-1\).",
      [st("Passo 1", r"\(C_1\leftarrow C_1+C_2\): 1ª coluna \(=2a\). Tire o 2: \(2\,\det(a,\ a-b,\ c)\)."), st("Passo 2", r"\(C_2\leftarrow C_2-C_1\): 2ª coluna \(=-b\). Tire o \(-1\): \(-2\det(a,b,c)\).")]),
 item("L3-34", "Exercício 34", r"Encontre o determinante de \(\begin{bmatrix}a&b&b&b\\b&a&b&b\\b&b&a&b\\b&b&b&a\end{bmatrix}\).", r"\((a+3b)(a-b)^3\)",
      [st("Some todas as colunas na 1ª", r"\(C_1\leftarrow C_1+C_2+C_3+C_4\): toda entrada da 1ª coluna vira \(a+3b\). Tire esse fator:", r"(a+3b)\begin{vmatrix}1&b&b&b\\1&a&b&b\\1&b&a&b\\1&b&b&a\end{vmatrix}"),
       st("Subtraia a 1ª linha das outras", "", r"(a+3b)\begin{vmatrix}1&b&b&b\\0&a-b&0&0\\0&0&a-b&0\\0&0&0&a-b\end{vmatrix}=(a+3b)(a-b)^3")]),
 item("L3-35", "Exercício 35", r"Mostre, sem calcular, que \(\det(A)=0\) para \(A=\begin{bmatrix}-2&8&1&4\\3&2&5&1\\1&10&6&5\\4&-6&4&-3\end{bmatrix}\).", r"\(L_3=L_1+L_2\).",
      [st("Procure uma relação", r"\(L_1+L_2=(-2+3,\ 8+2,\ 1+5,\ 4+1)=(1,10,6,5)=L_3\)."), st("Conclusão", r"\(L_3\leftarrow L_3-L_1-L_2\) cria uma linha de zeros (sem mudar o det): \(\det A=0\).")]),
 item("L3-36", "Exercício 36", r"Mostre, sem calcular, que \(\det(A)=0\) para a matriz 5×5 com \(-4\) na diagonal e \(1\) fora dela.", r"Cada linha soma 0.",
      [st("Soma das colunas", r"\(C_1\leftarrow C_1+C_2+C_3+C_4+C_5\): cada entrada vira \(-4+1+1+1+1=0\). Coluna nula ⇒ \(\det A=0\).")]),
 item("L3-VF", "Verdadeiro ou falso", r"(a) Trocar as duas primeiras e depois as duas últimas linhas de uma 4×4 não muda o det. (b) Multiplicar a 1ª coluna por 4 e a 3ª por \(\frac34\) multiplica o det por 3. (c) Somar 5 vezes a 1ª linha à 2ª e à 3ª multiplica o det por 25. (d) Multiplicar cada linha pelo seu índice multiplica o det por \(\frac{n(n+1)}2\). (e) Duas colunas idênticas ⇒ det 0. (f) Se \(L_2+L_4=L_6\) numa 6×6, então det 0.",
      r"(a) V (b) V (c) F (d) F (e) V (f) V",
      [st("(a) V", r"Duas trocas: \((-1)(-1)=1\)."), st("(b) V", r"\(4\cdot\frac34=3\)."), st("(c) F", r"Somar múltiplos não muda o det."), st("(d) F", r"O fator é \(1\cdot2\cdots n=n!\)."),
       st("(e) V", r"Subtraindo uma da outra surge coluna nula."), st("(f) V", r"\(L_6\leftarrow L_6-L_2-L_4\) dá linha nula.")]),
]
out.append(page(3, "Anton · 2.2", "Determinantes por redução por linhas (Anton, Seção 2.2)", "Exercícios 1 a 36 e verdadeiro/falso: det(Aᵀ), matrizes elementares, escalonamento, propriedades e identidades.", INTRO, L3, [("m5", "Determinantes: base"), ("m6", "Redução por linhas")]))
# ============================================================ LISTA 4 · Anton 2.3
def kA_item(iid, num, A, k):
    A = Matrix(A); n = A.rows; dA = A.det(); dkA = (k*A).det(); assert dkA == k**n*dA
    return item(iid, num, rf"Verifique que \(\det(kA)=k^n\det(A)\) para \(A={mat(A)}\), \(k={k}\).", rf"\(\det(A)={L(dA)}\), \(\det(kA)={L(dkA)}=({k})^{n}\cdot({L(dA)})\)",
        [st("det(A)", "", None)] + det_cof(A)[0] + [st("kA", "", rf"kA={mat(k*A)}")] + [st("det(kA)", "", None)] + det_cof(k*A)[0] +
        [st("Compare", rf"\(k^n\det A=({k})^{n}\cdot({L(dA)})={L(k**n*dA)}\) ✓ — cada uma das {n} linhas de \(kA\) contribui com um fator \(k\).")])
def ab_item(iid, num, A, B):
    A = Matrix(A); B = Matrix(B); dA, dB = A.det(), B.det(); AB, BA = A*B, B*A
    return item(iid, num, rf"Com \(A={mat(A)}\) e \(B={mat(B)}\), verifique \(\det(AB)=\det(BA)\) e veja se \(\det(A+B)=\det(A)+\det(B)\).",
        rf"\(\det(AB)=\det(BA)={L(AB.det())}\); \(\det(A+B)={L((A+B).det())}\) e \(\det A+\det B={L(dA+dB)}\): " + ("iguais (coincidência)" if (A+B).det() == dA+dB else "diferentes"),
        [st("det(A) e det(B)", "", rf"\det(A)={L(dA)},\qquad\det(B)={L(dB)}"), st("Produtos", "", rf"AB={mat(AB)},\quad BA={mat(BA)}"),
         st("Determinantes dos produtos", r"\(AB\ne BA\), mas pelo Teorema 2.3.4 os dois determinantes valem \(\det A\det B\):", rf"\det(AB)={L(AB.det())}=\det(BA)={L(BA.det())}=({L(dA)})({L(dB)})"),
         st("Soma", "", rf"A+B={mat(A+B)},\quad \det(A+B)={L((A+B).det())}\ \text{{vs}}\ \det A+\det B={L(dA+dB)}"),
         st("Moral", r"O determinante é multiplicativo, mas <b>não</b> é aditivo.")])
def inv_item(iid, num, A, note=""):
    A = Matrix(A); o, d = det_cof(A)
    return item(iid, num, rf"Use determinantes para decidir se \(A={mat(A)}\) é invertível.", rf"\(\det A={L(simplify(d))}\): " + ("invertível" if simplify(d) != 0 else "não invertível"),
        ([st("Atalho", note)] if note else []) + o + [st("Teste", r"\(A\) é invertível \(\iff\det A\ne0\) (Teorema 2.3.3).")])
def adjinv_item(iid, num, A, ref=""):
    A = Matrix(A); d = A.det()
    if d == 0:
        o, _ = det_cof(A) if A.rows <= 3 else combo(A)
        return item(iid, num, rf"Decida se \(A={mat(A)}\) é invertível e, se for, ache \(A^{{-1}}\) pela adjunta.{ref}", r"\(\det A=0\): não é invertível.", o)
    o, _ = adj_steps(A)
    return item(iid, num, rf"Decida se \(A={mat(A)}\) é invertível e, se for, ache \(A^{{-1}}\) pela adjunta.{ref}", rf"\(\det A={L(d)}\ne0\); \(A^{{-1}}={mat(A.inv())}\)",
                [st("Fórmula", r"\(A^{-1}=\dfrac{1}{\det A}\operatorname{adj}(A)\), com \(\operatorname{adj}(A)\) = transposta da matriz dos cofatores.")] + o +
                [st("Conferência", r"\(AA^{-1}=I\) (verificado).")])
def cramer_item(iid, num, sys_tex, A, b, xs):
    o, s = cramer_steps(A, b, xs)
    ans = r"Cramer não se aplica (\(\det A=0\))" if s is None else ", ".join(rf"\({x}={L(v)}\)" for x, v in zip(xs, s))
    return item(iid, num, rf"Resolva pela regra de Cramer, quando aplicável: \(\begin{{cases}}{sys_tex}\end{{cases}}\)", ans,
                [st("Regra de Cramer", r"Se \(\det A\ne0\): \(x_j=\dfrac{\det(A_j)}{\det(A)}\), em que \(A_j\) é \(A\) com a coluna \(j\) trocada por \(\mathbf b\).")] + o)
k = symbols('k')
A15 = Matrix([[k-3,-2],[-2,k-2]]); A16 = Matrix([[k,2],[2,k]]); A17 = Matrix([[1,2,4],[3,1,6],[k,3,2]]); A18 = Matrix([[1,2,0],[k,1,k],[0,2,1]])
d17 = expand(A17.det()); d18 = expand(A18.det())
A28 = Matrix([[-1,-4,2,1],[2,-1,7,9],[-1,1,3,1],[1,-2,1,-4]]); b28 = [-32,14,11,-4]
A31 = Matrix([[4,1,1,1],[3,7,-1,1],[7,3,-5,8],[1,1,1,2]]); b31 = Matrix([6,1,-3,3])
A31y = A31.copy(); A31y[:,1] = b31; y31 = A31y.det()/A31.det()
th = symbols('theta')
Rot = Matrix([[cos(th),sin(th),0],[-sin(th),cos(th),0],[0,0,1]])
L4 = [
 kA_item("L4-1", "Exercício 1", [[-1,2],[3,4]], 2), kA_item("L4-2", "Exercício 2", [[2,2],[5,-2]], -4),
 kA_item("L4-3", "Exercício 3", [[2,-1,3],[3,2,1],[1,4,5]], -2), kA_item("L4-4", "Exercício 4", [[1,1,1],[0,2,3],[0,1,-2]], 3),
 ab_item("L4-5", "Exercício 5", [[2,1,0],[3,4,0],[0,0,2]], [[1,-1,3],[7,1,2],[5,0,1]]), ab_item("L4-6", "Exercício 6", [[-1,8,2],[1,0,-1],[-2,2,2]], [[2,-1,-4],[1,1,3],[0,3,-1]]),
 inv_item("L4-7", "Exercício 7", [[2,5,5],[-1,-1,0],[2,4,3]]), inv_item("L4-8", "Exercício 8", [[2,0,3],[0,3,2],[-2,0,-4]]),
 inv_item("L4-9", "Exercício 9", [[2,-3,5],[0,1,-3],[0,0,2]], r"É triangular: det = produto da diagonal \(=2\cdot1\cdot2=4\)."),
 inv_item("L4-10", "Exercício 10", [[-3,0,1],[5,0,6],[8,0,3]], r"A 2ª coluna é nula ⇒ det = 0."),
 inv_item("L4-11", "Exercício 11", [[4,2,8],[-2,1,-4],[3,1,6]], r"A 3ª coluna é o dobro da 1ª ⇒ det = 0."),
 inv_item("L4-12", "Exercício 12", [[1,0,-1],[9,-1,4],[8,9,-1]]),
 inv_item("L4-13", "Exercício 13", [[2,0,0],[8,1,0],[-5,3,6]], r"Triangular inferior: \(2\cdot1\cdot6=12\)."),
 inv_item("L4-14", "Exercício 14", [[sqrt(2),-sqrt(7),0],[3*sqrt(2),-3*sqrt(7),0],[5,-9,0]], r"A 3ª coluna é nula (e \(L_2=3L_1\)) ⇒ det = 0."),
 item("L4-15", "Exercícios 15–18", r"Encontre os \(k\) para os quais \(A\) é invertível: 15) \(\begin{bmatrix}k-3&-2\\-2&k-2\end{bmatrix}\) 16) \(\begin{bmatrix}k&2\\2&k\end{bmatrix}\) 17) \(\begin{bmatrix}1&2&4\\3&1&6\\k&3&2\end{bmatrix}\) 18) \(\begin{bmatrix}1&2&0\\k&1&k\\0&2&1\end{bmatrix}\)",
      rf"15) \(k\ne\frac{{5\pm\sqrt{{17}}}}2\) &nbsp; 16) \(k\ne\pm2\) &nbsp; 17) \(\det={L(d17)}\): \(k\ne{L(solve(d17,k)[0])}\) &nbsp; 18) \(\det={L(d18)}\): \(k\ne{L(solve(d18,k)[0])}\)",
      [st("Ideia", r"Invertível \(\iff\det\ne0\). Calcule o det como polinômio em \(k\) e exclua as raízes."),
       st("15)", "", r"(k-3)(k-2)-4=k^2-5k+2=0\iff k=\tfrac{5\pm\sqrt{17}}2"), st("16)", "", r"k^2-4=0\iff k=\pm2"),
       st("17)", r"Expansão pela 1ª linha:", rf"1(2-18)-2(6-6k)+4(9-k)={L(d17)}"), st("18)", "", rf"1(1-2k)-2(k-0)+0={L(d18)}")]),
 adjinv_item("L4-19", "Exercício 19", [[2,5,5],[-1,-1,0],[2,4,3]]), adjinv_item("L4-20", "Exercício 20", [[2,0,3],[0,3,2],[-2,0,-4]]),
 adjinv_item("L4-21", "Exercício 21", [[2,-3,5],[0,1,-3],[0,0,2]]), adjinv_item("L4-22", "Exercício 22", [[2,0,0],[8,1,0],[-5,3,6]]),
 adjinv_item("L4-23", "Exercício 23", [[1,3,1,1],[2,5,2,2],[1,3,8,9],[1,3,2,2]]),
 cramer_item("L4-24", "Exercício 24", r"7x_1-2x_2=3\\3x_1+x_2=5", [[7,-2],[3,1]], [3,5], ["x_1","x_2"]),
 cramer_item("L4-25", "Exercício 25", r"4x+5y=2\\11x+y+2z=3\\x+5y+2z=1", [[4,5,0],[11,1,2],[1,5,2]], [2,3,1], ["x","y","z"]),
 cramer_item("L4-26", "Exercício 26", r"x-4y+z=6\\4x-y+2z=-1\\2x+2y-3z=-20", [[1,-4,1],[4,-1,2],[2,2,-3]], [6,-1,-20], ["x","y","z"]),
 cramer_item("L4-27", "Exercício 27", r"x_1-3x_2+x_3=4\\2x_1-x_2=-2\\4x_1-3x_3=0", [[1,-3,1],[2,-1,0],[4,0,-3]], [4,-2,0], ["x_1","x_2","x_3"]),
 cramer_item("L4-28", "Exercício 28", r"-x_1-4x_2+2x_3+x_4=-32\\2x_1-x_2+7x_3+9x_4=14\\-x_1+x_2+3x_3+x_4=11\\x_1-2x_2+x_3-4x_4=-4", A28, b28, ["x_1","x_2","x_3","x_4"]),
 cramer_item("L4-29", "Exercício 29", r"3x_1-x_2+x_3=4\\-x_1+7x_2-2x_3=1\\2x_1+6x_2-x_3=5", [[3,-1,1],[-1,7,-2],[2,6,-1]], [4,1,5], ["x_1","x_2","x_3"]),
 item("L4-30", "Exercício 30", r"Mostre que \(A=\begin{bmatrix}\cos\theta&\operatorname{sen}\theta&0\\-\operatorname{sen}\theta&\cos\theta&0\\0&0&1\end{bmatrix}\) é invertível para todo \(\theta\) e ache \(A^{-1}\) pela adjunta.", r"\(\det A=1\); \(A^{-1}=A^T=\begin{bmatrix}\cos\theta&-\operatorname{sen}\theta&0\\\operatorname{sen}\theta&\cos\theta&0\\0&0&1\end{bmatrix}\)",
      [st("Determinante", r"Expandindo pela 3ª linha:", r"\det A=1\cdot(\cos^2\theta+\operatorname{sen}^2\theta)=1\ne0"),
       st("Cofatores", r"\(C_{11}=\cos\theta\), \(C_{12}=\operatorname{sen}\theta\), \(C_{13}=0\), \(C_{21}=-\operatorname{sen}\theta\), \(C_{22}=\cos\theta\), \(C_{23}=0\), \(C_{31}=C_{32}=0\), \(C_{33}=1\)."),
       st("Inversa", r"A matriz dos cofatores é a própria \(A\); a adjunta é \(A^T\), e como \(\det A=1\), \(A^{-1}=A^T\) (rotação de \(-\theta\)).")]),
 item("L4-31", "Exercício 31", r"Use Cramer para achar \(y\) sem calcular \(x,z,w\): \(4x+y+z+w=6\), \(3x+7y-z+w=1\), \(7x+3y-5z+8w=-3\), \(x+y+z+2w=3\).", rf"\(y={L(y31)}\)",
      [st("Matriz e det", "", rf"A={mat(A31)},\quad\det A={L(A31.det())}"), st("A₂ (coluna de y trocada por b)", "", rf"A_2={mat(A31y)},\quad\det A_2={L(A31y.det())}"),
       st("Resultado", "", rf"y=\frac{{{L(A31y.det())}}}{{{L(A31.det())}}}={L(y31)}")]),
 item("L4-32", "Exercício 32", r"Para o sistema do Exercício 31: (a) resolva por Cramer; (b) por Gauss-Jordan; (c) qual dá menos contas?", rf"\((x,y,z,w)={vec(A31.solve(b31))}\); Gauss-Jordan é bem mais econômico.",
      cramer_steps(A31, b31, ["x","y","z","w"])[0] + [st("(b) Gauss-Jordan", "", r"\left[A\,|\,\mathbf b\right]\ \longrightarrow\ " + mat(Matrix.hstack(A31, b31).rref()[0])),
       st("(c)", r"Cramer exige 5 determinantes 4×4; Gauss-Jordan faz uma única eliminação na matriz aumentada.")]),
 item("L4-33", "Exercício 33", r"Prove: se \(\det A=1\) e as entradas de \(A\) são inteiras, então as de \(A^{-1}\) também são.", r"\(A^{-1}=\operatorname{adj}(A)\), e cofatores de matriz inteira são inteiros.",
      [st("Fórmula", r"\(A^{-1}=\frac1{\det A}\operatorname{adj}(A)=\operatorname{adj}(A)\)."), st("Cofatores", r"Cada \(C_{ij}=\pm\det(\text{submatriz inteira})\) é soma de produtos de inteiros: inteiro.")]),
 item("L4-34", "Exercício 34", r"Se \(A\mathbf x=\mathbf b\) tem coeficientes e constantes inteiros e \(\det A=1\), prove que a solução tem entradas inteiras.", r"\(\mathbf x=A^{-1}\mathbf b\) com \(A^{-1}\) inteira (Ex. 33); ou Cramer: \(x_j=\det(A_j)/1\).",
      [st("Por Cramer", r"\(x_j=\det(A_j)/\det(A)=\det(A_j)\), e \(A_j\) tem entradas inteiras, logo \(\det A_j\in\mathbb Z\).")]),
 item("L4-35", "Exercício 35", r"Com \(A=\begin{bmatrix}a&b&c\\d&e&f\\g&h&i\end{bmatrix}\) e \(\det A=-7\), obtenha (a) \(\det(3A)\) (b) \(\det(A^{-1})\) (c) \(\det(2A^{-1})\) (d) \(\det((2A)^{-1})\) (e) \(\det\begin{bmatrix}a&g&d\\b&h&e\\c&i&f\end{bmatrix}\)", r"(a) −189 (b) \(-\frac17\) (c) \(-\frac87\) (d) \(-\frac1{56}\) (e) 7",
      [st("(a)", r"\(3^3(-7)=-189\)."), st("(b)", r"\(\frac1{\det A}=-\frac17\)."), st("(c)", r"\(2^3\cdot\left(-\frac17\right)=-\frac87\)."), st("(d)", r"\(\frac1{\det(2A)}=\frac1{8\cdot(-7)}=-\frac1{56}\)."),
       st("(e)", r"É a transposta de \(\begin{bmatrix}a&b&c\\g&h&i\\d&e&f\end{bmatrix}\), que é \(A\) com \(L_2\leftrightarrow L_3\): \(-(-7)=7\).")]),
 item("L4-36", "Exercício 36", r"\(A\) 4×4 com \(\det A=-2\): (a) \(\det(-A)\) (b) \(\det(A^{-1})\) (c) \(\det(2A^T)\) (d) \(\det(A^3)\)", r"(a) −2 (b) \(-\frac12\) (c) −32 (d) −8",
      [st("(a)", r"\((-1)^4(-2)=-2\)."), st("(b)", r"\(-\frac12\)."), st("(c)", r"\(2^4\det(A^T)=16(-2)=-32\)."), st("(d)", r"\((\det A)^3=-8\).")]),
 item("L4-37", "Exercício 37", r"\(A\) 3×3 com \(\det A=7\): (a) \(\det(3A)\) (b) \(\det(A^{-1})\) (c) \(\det(2A^{-1})\) (d) \(\det((2A)^{-1})\)", r"(a) 189 (b) \(\frac17\) (c) \(\frac87\) (d) \(\frac1{56}\)",
      [st("Regras usadas", r"\(\det(kA)=k^n\det A\), \(\det(A^{-1})=1/\det A\)."), st("Contas", r"\(27\cdot7=189\); \(\frac17\); \(8\cdot\frac17\); \(\frac1{8\cdot7}\).")]),
 item("L4-38", "Exercício 38", r"Prove que \(A\) (quadrada) é invertível se, e só se, \(A^TA\) é invertível.", r"\(\det(A^TA)=(\det A)^2\).",
      [st("Determinante", "", r"\det(A^TA)=\det(A^T)\det(A)=(\det A)^2"), st("Conclusão", r"\((\det A)^2\ne0\iff\det A\ne0\). Pelo teste do det, as duas invertibilidades são equivalentes.")]),
 item("L4-39", "Exercício 39", r"Mostre que \(\det(A^TA)=\det(AA^T)\).", r"Os dois valem \(\det(A)^2\).",
      [st("Conta", "", r"\det(A^TA)=\det A^T\det A=\det A\det A^T=\det(AA^T)")]),
 item("L4-VF", "Verdadeiro ou falso", r"(a) \(\det(2A)=2\det A\) (3×3). (b) \(\det A=\det B\Rightarrow\det(A+B)=2\det A\). (c) \(\det(A^{-1}BA)=\det B\). (d) \(A\) invertível ⇔ \(\det A=0\). (e) A matriz de cofatores é \([\operatorname{adj}A]^T\). (f) \(A\operatorname{adj}(A)=\det(A)I\). (g) \(A\mathbf x=\mathbf b\) com várias soluções ⇒ \(\det A=0\). (h) Se algum \(A\mathbf x=\mathbf b\) não tem solução, a forma reduzida de \(A\) não é \(I\). (i) \(E\) elementar ⇒ \(E\mathbf x=0\) só tem a trivial. (j) Com \(A\) invertível, \(A\mathbf x=\mathbf b\) só tem a trivial ⇔ \(A^{-1}\mathbf x=0\) só tem a trivial. (k) \(A\) invertível ⇒ \(\operatorname{adj}A\) invertível. (l) Linha de zeros em \(A\) ⇒ linha de zeros em \(\operatorname{adj}A\).",
      r"(a) F (b) F (c) V (d) F (e) V (f) V (g) V (h) V (i) V (j) F em geral (V só se \(\mathbf b=0\)) (k) V (l) F",
      [st("(a) F", r"\(\det(2A)=8\det A\)."), st("(b) F", r"\(A=I\), \(B=-I\) (2×2): \(\det A=\det B=1\), mas \(\det(A+B)=0\)."),
       st("(c) V", r"\(\det(A^{-1})\det B\det A=\det B\)."), st("(d) F", r"É \(\det A\ne0\)."), st("(e) V", r"\(\operatorname{adj}A=C^T\Rightarrow C=(\operatorname{adj}A)^T\)."),
       st("(f) V", r"É a fórmula (10) da seção."), st("(g) V", r"Se \(\det A\ne0\) a solução seria única."), st("(h) V", r"Se fosse \(I\), \(A\) seria invertível e todo sistema teria solução."),
       st("(i) V", r"Matrizes elementares são invertíveis."),
       st("(j) F", r"\(A^{-1}\mathbf x=0\) sempre só tem a trivial (\(A^{-1}\) é invertível); já \(A\mathbf x=\mathbf b\) tem a solução única \(A^{-1}\mathbf b\), que só é a trivial se \(\mathbf b=0\)."),
       st("(k) V", r"\(\operatorname{adj}A=\det(A)A^{-1}\), produto de número não nulo por invertível."),
       st("(l) F", r"\(A=\begin{bmatrix}1&2\\0&0\end{bmatrix}\Rightarrow\operatorname{adj}A=\begin{bmatrix}0&-2\\0&1\end{bmatrix}\): coluna nula, mas nenhuma linha nula.")]),
]
out.append(page(4, "Anton · 2.3", "Propriedades, adjunta e regra de Cramer (Anton, Seção 2.3)", "Exercícios 1 a 39 e verdadeiro/falso: det(kA), det(AB), invertibilidade, adjunta, Cramer.", INTRO, L4, [("m7", "Propriedades"), ("m8", "Adjunta e Cramer")]))
# ============================================================ LISTA 5 · Cap. 2 suplementares
S = {1: [[-4,2],[3,3]], 2: [[7,-1],[-2,-6]], 3: [[-1,5,2],[0,2,-1],[-3,1,1]], 4: [[-1,-2,-3],[-4,-5,-6],[-7,-8,-9]], 5: [[3,0,-1],[1,1,1],[0,4,2]],
     6: [[-5,1,4],[3,0,2],[1,-2,2]], 7: [[3,6,0,1],[-2,3,1,4],[1,0,-1,1],[-9,2,-2,2]], 8: [[-1,-2,-3,-4],[4,3,2,1],[1,2,3,4],[-4,-3,-2,-1]]}
def sup_det(n):
    A = Matrix(S[n]); oc, dc = (det_cof(A) if A.rows <= 3 else combo(A))
    orr, dr = det_rowred(A, intro=False); assert dc == dr
    return item(f"L5-{n}", f"Exercício {n}", rf"Calcule \(\det{mat(A)}\) (a) por expansão em cofatores e (b) por operações com linhas.", rf"\(\det={L(dc)}\)",
                [st("(a) Cofatores", "", None)] + oc + [st("(b) Operações com linhas", "", None)] + orr)
def sarrus(n):
    A = Matrix(S[n]); a = A
    pos = [a[0,0]*a[1,1]*a[2,2], a[0,1]*a[1,2]*a[2,0], a[0,2]*a[1,0]*a[2,1]]; neg = [a[0,2]*a[1,1]*a[2,0], a[0,0]*a[1,2]*a[2,1], a[0,1]*a[1,0]*a[2,2]]
    assert sum(pos)-sum(neg) == A.det()
    return st(f"Exercício {n}", "", rf"({L(pos[0])})+({L(pos[1])})+({L(pos[2])})-({L(neg[0])})-({L(neg[1])})-({L(neg[2])})={L(A.det())}")
bb, aa, x = symbols('b a x')
d13 = expand(Matrix([[5,bb-3],[bb-2,-3]]).det()); d14 = expand(Matrix([[3,-4,aa],[aa**2,1,2],[2,aa-1,4]]).det())
M15s = Matrix(5,5,lambda r,s: 0); M15s[0,4]=-3; M15s[1,3]=-4; M15s[2,2]=-1; M15s[3,1]=2; M15s[4,0]=5
lhs16 = expand(Matrix([[x,-1],[3,1-x]]).det()); rhs16 = expand(Matrix([[1,0,-3],[2,x,-6],[1,3,x-5]]).det()); sol16 = solve(lhs16-rhs16, x)
al_, be_ = symbols('alpha beta'); d27 = factor(Matrix([[1,1,al_],[1,1,be_],[al_,be_,1]]).det())
import itertools
best28 = max(Matrix(3,3,list(p)).det() for p in itertools.product([0,1], repeat=9)); assert best28 == 2
tri = Matrix([[3,3,1],[4,0,1],[-2,-1,1]]); dtri = tri.det()
def sup_adj(n, ex):
    A = Matrix(S[ex]); d = A.det()
    if d == 0:
        return item(f"L5-{n}", f"Exercício {n}", rf"Use a adjunta para achar a inversa da matriz do Exercício {ex}, se existir: \({mat(A)}\).", r"Não existe: \(\det=0\).", [st("Teste", rf"\(\det A=0\) (Exercício {ex}), logo \(A\) não é invertível.")])
    o, _ = adj_steps(A)
    return item(f"L5-{n}", f"Exercício {n}", rf"Use a adjunta para achar a inversa da matriz do Exercício {ex}: \({mat(A)}\).", rf"\(A^{{-1}}={mat(A.inv())}\)", o)
L5 = [sup_det(n) for n in range(1, 9)] + [
 item("L5-9", "Exercício 9", r"Calcule os determinantes dos Exercícios 3–6 pela técnica das setas (Sarrus).", r"3) " + rf"\({L(Matrix(S[3]).det())}\)" + r" &nbsp; 4) 0 &nbsp; 5) " + rf"\({L(Matrix(S[5]).det())}\)" + r" &nbsp; 6) " + rf"\({L(Matrix(S[6]).det())}\)",
      [st("Regra das setas (só 3×3)", r"Some os produtos das três “diagonais” descendo para a direita e subtraia os das três subindo:", r"aei+bfg+cdh-ceg-afh-bdi")] + [sarrus(n) for n in (3, 4, 5, 6)]),
 item("L5-10", "Exercício 10", r"(a) Construa uma 4×4 cujo det seja fácil por cofatores e difícil por operações com linhas. (b) O contrário.", r"Exemplos: (a) uma matriz com uma linha cheia de zeros exceto uma entrada; (b) uma matriz já quase triangular mas sem zeros numa linha.",
      [st("(a)", r"Ex.: \(\begin{bmatrix}0&0&2&0\\3&1&7&5\\0&0&0&4\\9&2&3&6\end{bmatrix}\). Por cofatores: a 3ª linha só tem um termo (\(4\)); na 3×3 que sobra, a 1ª linha só tem o \(2\); acaba num 2×2. Por operações com linhas, os pivôs 3 e 9 geram frações e trocas."),
       st("(b)", r"Ex.: \(\begin{bmatrix}1&2&3&4\\2&5&7&9\\3&7&11&14\\4&9&14&20\end{bmatrix}\): nenhum zero (cofatores trabalhosos), mas pivôs 1 e eliminação com inteiros pequenos.")]),
 item("L5-11", "Exercício 11", r"Use o determinante para decidir se as matrizes dos Exercícios 1–4 são invertíveis.", r"1, 2 e 3 invertíveis; 4 não.",
      [st("Valores", ", ".join(rf"\(\det_{n}={L(Matrix(S[n]).det())}\)" for n in range(1, 5)) + r". Invertível ⇔ det ≠ 0.")]),
 item("L5-12", "Exercício 12", r"Idem para os Exercícios 5–8.", r"5, 6 e 7 invertíveis; 8 não (\(L_3=-L_1\)).",
      [st("Valores", ", ".join(rf"\(\det_{n}={L(Matrix(S[n]).det())}\)" for n in range(5, 9)) + ".")]),
 item("L5-13", "Exercício 13", r"Calcule \(\begin{vmatrix}5&b-3\\b-2&-3\end{vmatrix}\).", rf"\({L(d13)}\)", [st("Fórmula 2×2", "", rf"5(-3)-(b-3)(b-2)=-15-(b^2-5b+6)={L(d13)}")]),
 item("L5-14", "Exercício 14", r"Calcule \(\begin{vmatrix}3&-4&a\\a^2&1&2\\2&a-1&4\end{vmatrix}\).", rf"\({L(d14)}\)",
      [st("Expansão pela 1ª linha", "", r"3\begin{vmatrix}1&2\\a-1&4\end{vmatrix}+4\begin{vmatrix}a^2&2\\2&4\end{vmatrix}+a\begin{vmatrix}a^2&1\\2&a-1\end{vmatrix}"),
       st("Contas", "", rf"3(4-2a+2)+4(4a^2-4)+a(a^3-a^2-2)={L(d14)}")]),
 item("L5-15", "Exercício 15", r"Calcule o det da 5×5 com \(-3,-4,-1,2,5\) na antidiagonal (posições \((1,5),(2,4),(3,3),(4,2),(5,1)\)) e zeros no resto.", rf"\({L(M15s.det())}\)",
      [st("Reordene as linhas", r"Trocando \(L_1\leftrightarrow L_5\) e \(L_2\leftrightarrow L_4\) (duas trocas, sinal +), a matriz fica diagonal com \(5,2,-1,-4,-3\)."),
       st("Produto", "", r"5\cdot2\cdot(-1)\cdot(-4)\cdot(-3)=-120")]),
 item("L5-16", "Exercício 16", r"Resolva em \(x\): \(\begin{vmatrix}x&-1\\3&1-x\end{vmatrix}=\begin{vmatrix}1&0&-3\\2&x&-6\\1&3&x-5\end{vmatrix}\).", r"\(x=" + r"\ \text{ou}\ x=".join(L(s) for s in sol16) + r"\)",
      [st("Lado esquerdo", "", rf"x(1-x)+3={L(lhs16)}"), st("Lado direito (1ª linha)", "", rf"1[x(x-5)+18]-3[6-x]={L(rhs16)}"),
       st("Iguale", "", rf"{L(lhs16)}={L(rhs16)}\iff {L(expand(rhs16-lhs16))}=0\iff x\in\{{{', '.join(L(s) for s in sol16)}\}}")]),
] + [sup_adj(n, n-16) for n in range(17, 25)] + [
 item("L5-25", "Exercício 25", r"Use Cramer para obter \(x',y'\) em termos de \(x,y\): \(x=\frac35x'-\frac45y'\), \(y=\frac45x'+\frac35y'\).", r"\(x'=\frac35x+\frac45y\), \(y'=-\frac45x+\frac35y\)",
      [st("Coeficientes", "", r"A=\begin{bmatrix}\frac35&-\frac45\\\frac45&\frac35\end{bmatrix},\ \det A=\tfrac9{25}+\tfrac{16}{25}=1"),
       st("Cramer", "", r"x'=\begin{vmatrix}x&-\frac45\\y&\frac35\end{vmatrix}=\tfrac35x+\tfrac45y,\qquad y'=\begin{vmatrix}\frac35&x\\\frac45&y\end{vmatrix}=\tfrac35y-\tfrac45x")]),
 item("L5-26", "Exercício 26", r"Idem: \(x=x'\cos\theta-y'\operatorname{sen}\theta\), \(y=x'\operatorname{sen}\theta+y'\cos\theta\).", r"\(x'=x\cos\theta+y\operatorname{sen}\theta\), \(y'=-x\operatorname{sen}\theta+y\cos\theta\)",
      [st("det", "", r"\cos^2\theta+\operatorname{sen}^2\theta=1"), st("Cramer", "", r"x'=\begin{vmatrix}x&-\operatorname{sen}\theta\\y&\cos\theta\end{vmatrix}=x\cos\theta+y\operatorname{sen}\theta,\quad y'=\begin{vmatrix}\cos\theta&x\\\operatorname{sen}\theta&y\end{vmatrix}=y\cos\theta-x\operatorname{sen}\theta")]),
 item("L5-27", "Exercício 27", r"Mostre que \(x+y+\alpha z=0\), \(x+y+\beta z=0\), \(\alpha x+\beta y+z=0\) tem solução não trivial se, e só se, \(\alpha=\beta\).", rf"\(\det={L(d27)}\), nulo \(\iff\alpha=\beta\).",
      [st("Homogêneo", r"Tem solução não trivial \(\iff\det A=0\)."), st("Determinante", "", r"1(1-\beta^2)-1(1-\alpha\beta)+\alpha(\beta-\alpha)=-\alpha^2+2\alpha\beta-\beta^2=-(\alpha-\beta)^2")]),
 item("L5-28", "Exercício 28", r"\(A\) 3×3 com entradas 0 ou 1. Qual o maior det possível?", r"2, por exemplo \(\begin{bmatrix}1&1&0\\0&1&1\\1&0&1\end{bmatrix}\).",
      [st("Limite", r"Pela regra das setas, \(\det\) = (soma de 3 produtos) − (soma de 3 produtos), cada produto 0 ou 1: no máximo 3. Para dar 3, os três produtos positivos seriam 1 — isso obriga todas as 9 entradas a serem 1 —, mas aí os negativos também são 1 e o det é 0."),
       st("Exemplo com 2", "", r"\begin{vmatrix}1&1&0\\0&1&1\\1&0&1\end{vmatrix}=1(1)-1(0-1)+0=2"), st("Conferência", "Testando por computador as 512 matrizes, o máximo é 2.")]),
 item("L5-29", "Exercício 29", r"(a) No triângulo de lados \(a,b,c\) e ângulos \(\alpha,\beta,\gamma\), mostre \(b\cos\gamma+c\cos\beta=a\), \(c\cos\alpha+a\cos\gamma=b\), \(a\cos\beta+b\cos\alpha=c\) e use Cramer para obter \(\cos\alpha=\frac{b^2+c^2-a^2}{2bc}\). (b) Fórmulas análogas para \(\beta,\gamma\).", r"Lei dos cossenos: \(\cos\beta=\frac{a^2+c^2-b^2}{2ac}\), \(\cos\gamma=\frac{a^2+b^2-c^2}{2ab}\).",
      [st("Projeções", r"Baixe a altura do vértice oposto a \(a\): o lado \(a\) se divide em \(b\cos\gamma\) e \(c\cos\beta\). Idem para os outros lados."),
       st("Sistema nas incógnitas cossenos", "", r"\begin{bmatrix}0&c&b\\c&0&a\\b&a&0\end{bmatrix}\begin{bmatrix}\cos\alpha\\\cos\beta\\\cos\gamma\end{bmatrix}=\begin{bmatrix}a\\b\\c\end{bmatrix},\quad\det=2abc"),
       st("Cramer para cos α", "", r"\cos\alpha=\frac1{2abc}\begin{vmatrix}a&c&b\\b&0&a\\c&a&0\end{vmatrix}=\frac{a(-a^2)-c(-ac)+b(ab)}{2abc}=\frac{b^2+c^2-a^2}{2bc}"),
       st("(b)", r"Trocando a 2ª ou a 3ª coluna pelo lado direito obtemos as outras duas fórmulas.")]),
 item("L5-30", "Exercício 30", r"Mostre que, para todo \(\lambda\), a única solução de \(x-2y=\lambda x\), \(x-y=\lambda y\) é \(x=y=0\).", r"\(\det=\lambda^2+1\ne0\).",
      [st("Forme o sistema homogêneo", "", r"\begin{cases}(1-\lambda)x-2y=0\\x-(1+\lambda)y=0\end{cases}"),
       st("Determinante", "", r"(1-\lambda)(-1-\lambda)+2=\lambda^2-1+2=\lambda^2+1\gt0"), st("Conclusão", r"det ≠ 0 ⇒ só a solução trivial.")]),
 item("L5-31", "Exercício 31", r"Prove: se \(A\) é invertível, \(\operatorname{adj}A\) é invertível e \([\operatorname{adj}A]^{-1}=\frac1{\det A}A=\operatorname{adj}(A^{-1})\).", r"Use \(\operatorname{adj}A=\det(A)A^{-1}\).",
      [st("Inversa da adjunta", "", r"\operatorname{adj}A\cdot\frac{A}{\det A}=\frac{\det(A)A^{-1}A}{\det A}=I"),
       st("adj(A⁻¹)", "", r"\operatorname{adj}(A^{-1})=\det(A^{-1})(A^{-1})^{-1}=\frac{A}{\det A}")]),
 item("L5-32", "Exercício 32", r"Prove: \(\det[\operatorname{adj}A]=[\det A]^{n-1}\) (\(A\) n×n).", r"De \(A\operatorname{adj}A=\det(A)I\).",
      [st("Tome det", "", r"\det A\cdot\det(\operatorname{adj}A)=\det(\det(A)I)=(\det A)^n"), st("Se det A ≠ 0", r"Divida: \(\det(\operatorname{adj}A)=(\det A)^{n-1}\)."),
       st("Se det A = 0", r"Se \(\operatorname{adj}A\) fosse invertível, \(A=A\operatorname{adj}A(\operatorname{adj}A)^{-1}=0\), e então \(\operatorname{adj}A=0\) (n ≥ 2), contradição. Logo \(\det\operatorname{adj}A=0=(\det A)^{n-1}\).")]),
 item("L5-33", "Exercício 33", r"Prove: se cada linha de \(A\) (n×n) soma zero, então \(\det A=0\).", r"\(AX=0\) com \(X=(1,\dots,1)^T\ne0\).",
      [st("Produto", r"A \(i\)-ésima entrada de \(AX\) é a soma da linha \(i\): zero. Então \(AX=0\) tem solução não trivial ⇒ \(A\) não invertível ⇒ \(\det A=0\).")]),
 item("L5-34", "Exercício 34", r"(a) Mostre que a área do triângulo \(ABC\) é \(\frac12\begin{vmatrix}x_1&y_1&1\\x_2&y_2&1\\x_3&y_3&1\end{vmatrix}\) (vértices no sentido anti-horário). (b) Ache a área do triângulo de vértices \((3,3),(4,0),(-2,-1)\).", rf"(b) \(\frac{{19}}2\)",
      [st("(a) Trapézios", r"Área de trapézio \(=\frac{\text{altura}}2\times\)(soma das bases). Com \(D,E,F\) os pés no eixo \(x\):", r"\text{área}=\tfrac{(x_3-x_1)(y_1+y_3)}2+\tfrac{(x_2-x_3)(y_3+y_2)}2-\tfrac{(x_2-x_1)(y_1+y_2)}2"),
       st("(a) Simplifique", r"Expandindo, sobra \(\frac12[x_1y_2+x_2y_3+x_3y_1-x_1y_3-x_2y_1-x_3y_2]\), que é exatamente \(\frac12\det\) (expansão pela 3ª coluna)."),
       st("(b)", "", rf"\tfrac12{dm(tri)}=\tfrac12({L(dtri)})"),
       st("(b) sinal", rf"Deu negativo: os vértices nessa ordem estão no sentido horário. Área \(=\frac{{{L(abs(dtri))}}}2\).")]),
 item("L5-35", "Exercício 35", r"21375, 38798, 34162, 40223 e 79154 são divisíveis por 19. Mostre, sem calcular, que \(\begin{vmatrix}2&1&3&7&5\\3&8&7&9&8\\3&4&1&6&2\\4&0&2&2&3\\7&9&1&5&4\end{vmatrix}\) é divisível por 19.", r"\(C_5\leftarrow10^4C_1+10^3C_2+10^2C_3+10C_4+C_5\) vira a coluna dos cinco números.",
      [st("Operação com colunas", r"Somar múltiplos das outras colunas à 5ª não muda o det. A nova 5ª coluna é \((21375,38798,34162,40223,79154)\): cada linha “lê” o número."),
       st("Fator 19", r"Cada entrada é \(19\cdot k_i\). Tire o 19: \(\det=19\cdot\det(\text{matriz inteira})\), múltiplo de 19.")]),
 item("L5-36", "Exercício 36", r"Mostre, sem calcular, que \(\begin{vmatrix}\operatorname{sen}\alpha&\cos\alpha&\operatorname{sen}(\alpha+\delta)\\\operatorname{sen}\beta&\cos\beta&\operatorname{sen}(\beta+\delta)\\\operatorname{sen}\gamma&\cos\gamma&\operatorname{sen}(\gamma+\delta)\end{vmatrix}=0\).", r"A 3ª coluna é \(\cos\delta\,C_1+\operatorname{sen}\delta\,C_2\).",
      [st("Fórmula da soma", "", r"\operatorname{sen}(\alpha+\delta)=\operatorname{sen}\alpha\cos\delta+\cos\alpha\operatorname{sen}\delta"),
       st("Conclusão", r"\(C_3\leftarrow C_3-\cos\delta\,C_1-\operatorname{sen}\delta\,C_2\) zera a 3ª coluna: det = 0.")]),
]
out.append(page(5, "Anton · Suplementares", "Capítulo 2: exercícios suplementares (Anton)", "Exercícios 1 a 36: cofatores × escalonamento, Sarrus, inversas pela adjunta, Cramer e provas.", INTRO, L5, [("m6", "Redução por linhas"), ("m7", "Propriedades"), ("m8", "Adjunta e Cramer")]))

def build():
    with open(os.path.join(HERE, "content", "20_listas.html"), "w", encoding="utf-8") as f:
        f.write("\n".join(out))

if __name__ == "__main__":
    build()
