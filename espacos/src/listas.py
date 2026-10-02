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
 item("L1-1", "Questão 1", r"Sejam \(u=(2,-1,3)\) e \(v=(1,0,-2)\). Calcule a) \(u+v\) &nbsp; b) \(3u-2v\) &nbsp; c) \(\|u\|\).", r"a) \((3,-1,1)\) &nbsp; b) \((4,-3,13)\) &nbsp; c) \(\sqrt{14}\)",
      [st("a)", "", r"(2+1,\ -1+0,\ 3-2)=(3,-1,1)"), st("b)", "", r"(6,-3,9)-(2,0,-4)=(4,-3,13)"), st("c)", "", r"\sqrt{4+1+9}=\sqrt{14}")]),
 item("L1-2", "Questão 2", r"Ache \(x\) e \(y\) tais que \((x+y,\ x-y)=(5,1)\).", r"\(x=3,\ y=2\)",
      [st("Iguale coordenadas", r"\(x+y=5\) e \(x-y=1\). Somando: \(2x=6\Rightarrow x=3\); logo \(y=2\).")]),
 item("L1-3", "Questão 3", r"Para que valores de \(k\) os vetores \((k,4)\) e \((1,k)\) são paralelos?", r"\(k=2\) ou \(k=-2\)",
      [st("Proporcionalidade", "", r"\frac k1=\frac4k\Rightarrow k^2=4\Rightarrow k=\pm2")]),
 item("L1-4", "Questão 4", r"Resolva \(\begin{cases}x+y+z=6\\2x-y+z=3\\x+2y-z=2\end{cases}\).", r"\((x,y,z)=(1,2,3)\) (SPD)",
      [st("Escalone", "", r"\left[\begin{array}{rrr|r}1&1&1&6\\2&-1&1&3\\1&2&-1&2\end{array}\right]\to\left[\begin{array}{rrr|r}1&1&1&6\\0&-3&-1&-9\\0&1&-2&-4\end{array}\right]\to\left[\begin{array}{rrr|r}1&1&1&6\\0&1&-2&-4\\0&0&-7&-21\end{array}\right]"),
       st("Substitua de baixo para cima", r"\(z=3\), \(y=-4+2z=2\), \(x=6-y-z=1\).")]),
 item("L1-5", "Questão 5", r"Classifique e resolva \(\begin{cases}x+2y-z=1\\2x+4y-2z=2\\x-y+z=3\end{cases}\).", r"SPI: \(\left(\frac{7-t}{3},\ \frac{2t-2}{3},\ t\right)\), \(t\in\mathbb R\)",
      [st("Passo 1", r"A 2ª equação é o dobro da 1ª: posto 2 &lt; 3 incógnitas, SPI."),
       st("Passo 2", r"Subtraindo a 1ª da 3ª: \(-3y+2z=2\Rightarrow y=\frac{2z-2}{3}\). Com \(z=t\): \(x=1-2y+z=\frac{7-t}{3}\).")]),
 item("L1-6", "Questão 6", r"Para que \(k\) o sistema \(\begin{cases}x+y=1\\2x+ky=3\end{cases}\) é impossível?", r"\(k=2\) (para \(k\ne2\) é SPD)",
      [st("Escalone", "", r"L_2\leftarrow L_2-2L_1:\ (k-2)y=1"), st("Análise", r"Se \(k=2\): \(0=1\), impossível. Se \(k\ne2\): \(y=\frac1{k-2}\), solução única.")]),
 item("L1-7", "Questão 7", r"Resolva o sistema homogêneo \(\begin{cases}x+y-z=0\\2x-y+z=0\end{cases}\).", r"\(t(0,1,1)\), \(t\in\mathbb R\) (uma reta pela origem)",
      [st("Passo 1", r"Somando: \(3x=0\Rightarrow x=0\). Então \(y=z\)."), st("Solução", "", r"(0,t,t)=t(0,1,1)")]),
]
out.append(page(1, "Vetores e sistemas", "Vetores e sistemas lineares", "Operações com vetores, paralelismo e escalonamento.", INTRO, L1, [("m1", "Vetores"), ("m2", "Sistemas")]))

# ============================================================ LISTA 2
L2 = [
 item("L2-1", "Questão 1", r"\(\mathbb R^2\) com a soma usual e \(\alpha(a,b)=(\alpha a,0)\) é espaço vetorial?", r"Não: falha M4 (\(1\cdot u=u\)).",
      [st("Contraexemplo", r"\(1\cdot(2,3)=(2,0)\ne(2,3)\).")]),
 item("L2-2", "Questão 2", r"\(W=\{(x,y,z)\in\mathbb R^3:\ x=y\}\) é subespaço?", r"Sim.",
      [st("Teste", r"\((0,0,0)\in W\); \((a,a,c)+(b,b,d)=(a+b,a+b,c+d)\in W\); \(\alpha(a,a,c)=(\alpha a,\alpha a,\alpha c)\in W\).")]),
 item("L2-3", "Questão 3", r"\(W=\{(x,y,z):\ x=y+1\}\) é subespaço?", r"Não.", [st("Nulo", r"\(0=0+1\) é falso: \((0,0,0)\notin W\).")]),
 item("L2-4", "Questão 4", r"\(W=\{(x,y)\in\mathbb R^2:\ y\ge0\}\) é subespaço?", r"Não.", [st("Escalar", r"\((0,1)\in W\), mas \(-1\cdot(0,1)=(0,-1)\notin W\).")]),
 item("L2-5", "Questão 5", r"As matrizes \(2\times2\) diagonais formam subespaço de \(M_{2\times2}\)?", r"Sim.",
      [st("Teste", r"A nula é diagonal; soma de diagonais é diagonal; múltiplo de diagonal é diagonal.")]),
 item("L2-6", "Questão 6", r"\(W=\{p\in P_2:\ p(0)=1\}\) é subespaço de \(P_2\)?", r"Não.", [st("Nulo", r"O polinômio nulo tem \(p(0)=0\ne1\).")]),
 item("L2-7", "Questão 7", r"O cone \(W=\{(x,y,z):\ x^2+y^2=z^2\}\) é subespaço de \(\mathbb R^3\)?", r"Não.",
      [st("Soma", r"\((1,0,1)\) e \((0,1,1)\) estão em \(W\), mas a soma \((1,1,2)\) não: \(1+1=2\ne4\).")]),
 item("L2-8", "Questão 8", r"Em \(\mathbb R^3\), sejam \(U=\{z=0\}\) e \(W=\{y=0\}\). Ache \(U\cap W\) e \(U+W\). A soma é direta?", r"\(U\cap W\) = eixo \(x\); \(U+W=\mathbb R^3\); não é direta.",
      [st("Interseção", r"\(z=0\) e \(y=0\): \(\{(x,0,0)\}\)."), st("Soma", r"\((x,y,z)=(x,y,0)+(0,0,z)\), com \((0,0,z)\in W\). Como \(U\cap W\ne\{0\}\), não é soma direta.")]),
]
out.append(page(2, "Espaços e subespaços", "Espaços vetoriais e subespaços", "Axiomas, contraexemplos, teste dos três itens, interseção e soma.", INTRO, L2, [("m3", "Espaços"), ("m4", "Subespaços")]))

# ============================================================ LISTA 3
L3 = [
 item("L3-1", "Questão 1", r"Escreva \((1,7)\) como combinação linear de \((1,2)\) e \((-1,1)\).", r"\(\frac83(1,2)+\frac53(-1,1)\)",
      [st("Sistema", r"\(a-b=1\), \(2a+b=7\). Somando: \(3a=8\Rightarrow a=\frac83\), \(b=\frac53\).")]),
 item("L3-2", "Questão 2", r"\((4,3,2)\) é combinação de \((1,1,1)\) e \((1,0,-1)\)?", r"Sim: \(3(1,1,1)+1(1,0,-1)\).",
      [st("Sistema", r"\(a+b=4\), \(a=3\), \(a-b=2\). Com \(a=3\): \(b=1\), e \(3-1=2\) ✓.")]),
 item("L3-3", "Questão 3", r"\((1,2,4)\) é combinação de \((1,0,1)\) e \((0,1,1)\)?", r"Não.",
      [st("Sistema", r"\(a=1\), \(b=2\), mas \(a+b=3\ne4\). Impossível.")]),
 item("L3-4", "Questão 4", r"Descreva por uma equação o subespaço \([(1,1,0),(0,1,1)]\).", r"\(x-y+z=0\)",
      [st("Passo 1", r"\(a(1,1,0)+b(0,1,1)=(a,\ a+b,\ b)\): \(x=a\), \(z=b\), \(y=x+z\)."), st("Equação", r"\(x-y+z=0\).")]),
 item("L3-5", "Questão 5", r"Para que \(k\) o vetor \((2,k,-1)\) pertence a \([(1,1,0),(0,1,1)]\)?", r"\(k=1\)", [st("Use a equação", r"\(2-k+(-1)=0\Rightarrow k=1\).")]),
 item("L3-6", "Questão 6", r"Os vetores \((1,1,0)\), \((0,1,1)\), \((1,0,1)\) geram \(\mathbb R^3\)?", r"Sim.",
      [st("Determinante (vetores nas colunas)", "", r"\det\begin{bmatrix}1&0&1\\1&1&0\\0&1&1\end{bmatrix}=1(1-0)-0+1(1-0)=2\ne0")]),
 item("L3-7", "Questão 7", r"Escreva \(p=1+2t+3t^2\) como combinação de \(1\), \(1+t\) e \(1+t+t^2\).", r"\(p=-1\cdot1-1\cdot(1+t)+3(1+t+t^2)\)",
      [st("Coeficientes", r"\(a+b(1+t)+c(1+t+t^2)\): \(t^2\): \(c=3\); \(t\): \(b+c=2\Rightarrow b=-1\); constante: \(a+b+c=1\Rightarrow a=-1\).")]),
 item("L3-8", "Questão 8", r"Ache um conjunto gerador de \(W=\{(x,y,z):\ x+2y-z=0\}\).", r"\(\{(-2,1,0),(1,0,1)\}\)",
      [st("Isole", r"\(x=-2y+z\): \((-2y+z,\ y,\ z)=y(-2,1,0)+z(1,0,1)\).")]),
]
out.append(page(3, "Combinação e geradores", "Combinação linear e subespaço gerado", "Decidir se é combinação, achar coeficientes, equações de [S] e conjuntos geradores.", INTRO, L3, [("m5", "Combinação linear")]))

# ============================================================ LISTA 4
L4 = [
 item("L4-1", "Questão 1", r"\(\{(1,3),(2,6)\}\) é LI ou LD?", r"LD", [st("Paralelos", r"\((2,6)=2(1,3)\).")]),
 item("L4-2", "Questão 2", r"\(\{(1,2,0),(0,1,1),(1,0,1)\}\) é LI ou LD?", r"LI",
      [st("Determinante", "", r"\det\begin{bmatrix}1&0&1\\2&1&0\\0&1&1\end{bmatrix}=1(1-0)-0+1(2-0)=3\ne0")]),
 item("L4-3", "Questão 3", r"\(\{(1,1,1),(1,2,3),(2,3,4)\}\) é LI ou LD? Se LD, dê a relação.", r"LD: \((2,3,4)=(1,1,1)+(1,2,3)\)",
      [st("Observe", r"A soma dos dois primeiros dá o terceiro.")]),
 item("L4-4", "Questão 4", r"\(\{(1,0,0),(1,1,0),(0,0,0)\}\) é LI?", r"Não, é LD (contém o nulo).", [st("Atalho", r"\(0(1,0,0)+0(1,1,0)+1(0,0,0)=0\).")]),
 item("L4-5", "Questão 5", r"Para que \(k\) o conjunto \(\{(1,k),(k,4)\}\) é LD?", r"\(k=\pm2\)", [st("Determinante", "", r"4-k^2=0\Rightarrow k=\pm2")]),
 item("L4-6", "Questão 6", r"Em \(P_2\), \(\{1+t,\ 1-t,\ t^2\}\) é LI?", r"Sim.",
      [st("Coeficientes como vetores", r"\((1,1,0)\), \((1,-1,0)\), \((0,0,1)\)."), st("Determinante", "", r"\det\begin{bmatrix}1&1&0\\1&-1&0\\0&0&1\end{bmatrix}=-2\ne0")]),
 item("L4-7", "Questão 7", r"Em \(M_{2\times2}\), \(\left\{\begin{bmatrix}1&0\\0&1\end{bmatrix},\begin{bmatrix}0&1\\1&0\end{bmatrix},\begin{bmatrix}1&1\\1&1\end{bmatrix}\right\}\) é LI?", r"Não, LD.",
      [st("Observe", r"A terceira é a soma das duas primeiras.")]),
 item("L4-8", "Questão 8", r"Prove: se \(\{u,v\}\) é LI, então \(\{u+v,\ u-v\}\) também é LI.", r"Ver resolução.",
      [st("Passo 1", r"Suponha \(a(u+v)+b(u-v)=0\). Então \((a+b)u+(a-b)v=0\)."),
       st("Passo 2", r"Como \(\{u,v\}\) é LI: \(a+b=0\) e \(a-b=0\Rightarrow a=b=0\). ∎")]),
]
out.append(page(4, "LI e LD", "Dependência e independência linear", "Testes por escalonamento e determinante, parâmetros e provas.", INTRO, L4, [("m6", "LI e LD")]))

# ============================================================ LISTA 5
L5 = [
 item("L5-1", "Questão 1", r"\(\{(1,2),(3,4)\}\) é base de \(\mathbb R^2\)?", r"Sim.", [st("2 vetores em dimensão 2: basta LI", "", r"\det\begin{bmatrix}1&3\\2&4\end{bmatrix}=-2\ne0")]),
 item("L5-2", "Questão 2", r"Ache base e dimensão de \(W=\{(x,y,z):\ x-y+2z=0\}\).", r"Base \(\{(1,1,0),(-2,0,1)\}\); \(\dim W=2\)",
      [st("Isole", r"\(x=y-2z\): \(y(1,1,0)+z(-2,0,1)\).")]),
 item("L5-3", "Questão 3", r"Ache base e dimensão de \(W=\{(x,y,z,w):\ x+y=0,\ z-w=0\}\).", r"Base \(\{(-1,1,0,0),(0,0,1,1)\}\); \(\dim W=2\)",
      [st("Isole", r"\(x=-y\), \(z=w\): \(y(-1,1,0,0)+w(0,0,1,1)\).")]),
 item("L5-4", "Questão 4", r"Ache base e dimensão de \([(1,1,2),(2,2,4),(1,0,1),(0,1,1)]\).", r"Base \(\{(1,1,2),(1,0,1)\}\); dimensão 2",
      [st("Relações", r"\((2,2,4)=2(1,1,2)\) e \((0,1,1)=(1,1,2)-(1,0,1)\). Sobram dois LI.")]),
 item("L5-5", "Questão 5", r"Complete \(\{(1,1,0),(0,1,1)\}\) até uma base de \(\mathbb R^3\).", r"Acrescente \((1,0,0)\), por exemplo.",
      [st("Teste", "", r"\det\begin{bmatrix}1&0&1\\1&1&0\\0&1&0\end{bmatrix}=1\ne0")]),
 item("L5-6", "Questão 6", r"Qual a dimensão das matrizes \(3\times3\) simétricas? E das antissimétricas (\(A^T=-A\))?", r"6 e 3",
      [st("Simétricas", r"Escolha livre da diagonal (3) e de cima da diagonal (3): 6."), st("Antissimétricas", r"Diagonal nula; só as 3 entradas de cima são livres: 3.")]),
 item("L5-7", "Questão 7", r"Ache base e dimensão de \(W=\{p\in P_3:\ p(1)=0\text{ e }p(-1)=0\}\).", r"Base \(\{t^2-1,\ t^3-t\}\); \(\dim W=2\)",
      [st("Condições", r"\(p=a+bt+ct^2+dt^3\): \(a+b+c+d=0\) e \(a-b+c-d=0\). Daí \(a=-c\) e \(b=-d\)."),
       st("Base", r"\(p=c(t^2-1)+d(t^3-t)\).")]),
 item("L5-8", "Questão 8", r"Dois planos distintos \(U\) e \(W\) pela origem em \(\mathbb R^3\): qual a dimensão de \(U\cap W\)?", r"1 (uma reta)",
      [st("Fórmula", r"Distintos ⇒ \(U+W=\mathbb R^3\). \(3=2+2-\dim(U\cap W)\Rightarrow\dim(U\cap W)=1\).")]),
]
out.append(page(5, "Base e dimensão", "Base e dimensão", "Testar bases, bases de subespaços, extrair, completar e a fórmula da soma.", INTRO, L5, [("m7", "Base e dimensão")]))

# ============================================================ LISTA 6
L6 = [
 item("L6-1", "Questão 1", r"Coordenadas de \(v=(5,1)\) na base \(B=\{(1,1),(1,-1)\}\).", r"\([v]_B=(3,2)\)", [st("Sistema", r"\(a+b=5\), \(a-b=1\Rightarrow a=3,\ b=2\).")]),
 item("L6-2", "Questão 2", r"Coordenadas de \((1,2,3)\) na base \(\{(1,0,0),(1,1,0),(1,1,1)\}\).", r"\((-1,-1,3)\)",
      [st("De baixo para cima", r"\((a+b+c,\ b+c,\ c)=(1,2,3)\): \(c=3\), \(b=-1\), \(a=-1\).")]),
 item("L6-3", "Questão 3", r"Coordenadas de \(p=4-t+2t^2\) na base \(\{1,\ t-1,\ (t-1)^2\}\).", r"\((5,3,2)\)",
      [st("Dica", r"Coeficientes de Taylor em \(t=1\): \(p(1)=5\), \(p'(1)=-1+4=3\), \(\frac{p''(1)}{2}=2\)."),
       st("Conferência", "", r"5+3(t-1)+2(t-1)^2=4-t+2t^2")]),
 item("L6-4", "Questão 4", r"Se \([v]_B=(2,-3)\) com \(B=\{(1,2),(0,1)\}\), quem é \(v\)?", r"\(v=(2,1)\)", [st("Combine", "", r"2(1,2)-3(0,1)=(2,1)")]),
 item("L6-5", "Questão 5", r"Para \(B=\{(2,1),(1,1)\}\), ache a matriz de \(B\) para a canônica e a da canônica para \(B\).", r"\(M=\begin{bmatrix}2&1\\1&1\end{bmatrix}\), \(M^{-1}=\begin{bmatrix}1&-1\\-1&2\end{bmatrix}\)",
      [st("Inversa 2×2", r"\(\det M=1\); troque a diagonal e o sinal dos outros.")]),
 item("L6-6", "Questão 6", r"Com \(B=\{(1,0),(1,1)\}\) e \(C=\{(0,1),(1,1)\}\), ache \(M_{B\to C}\).", r"\(\begin{bmatrix}-1&0\\1&1\end{bmatrix}\)",
      [st("[b₁]_C", r"\((1,0)=a(0,1)+b(1,1)\Rightarrow b=1,\ a=-1\)."), st("[b₂]_C", r"\((1,1)=0(0,1)+1(1,1)\)."), st("Colunas", r"\((-1,1)\) e \((0,1)\).")]),
]
out.append(page(6, "Coordenadas", "Coordenadas e mudança de base", "Coordenadas em ℝⁿ e em polinômios, matrizes de mudança de base.", INTRO, L6, [("m8", "Coordenadas")]))

# ============================================================ LISTA 7
L7 = [
 item("L7-1", "Questão 1", r"\(T(x,y)=(x-y,\ 2x,\ x+y)\) é linear? Qual a matriz?", r"Sim; \(\begin{bmatrix}1&-1\\2&0\\1&1\end{bmatrix}\)",
      [st("Matriz", r"Colunas \(T(1,0)=(1,2,1)\) e \(T(0,1)=(-1,0,1)\).")]),
 item("L7-2", "Questão 2", r"\(T(x,y)=(x+y,\ 1)\) é linear?", r"Não.", [st("Nulo", r"\(T(0,0)=(0,1)\ne(0,0)\).")]),
 item("L7-3", "Questão 3", r"Ache núcleo e imagem de \(T(x,y,z)=(x+2y-z,\ 2x+4y-2z)\).", r"\(N(T)=[(-2,1,0),(1,0,1)]\) (dim 2); \(\text{Im}(T)=[(1,2)]\) (dim 1)",
      [st("Núcleo", r"As duas coordenadas são proporcionais: basta \(x+2y-z=0\)."), st("Imagem", r"\(T=(x+2y-z)(1,2)\). \(2+1=3\) ✓.")]),
 item("L7-4", "Questão 4", r"\(T\) é linear com \(T(1,0)=(3,1)\) e \(T(0,1)=(-1,2)\). Calcule \(T(2,5)\).", r"\((1,12)\)", [st("Linearidade", "", r"2(3,1)+5(-1,2)=(1,12)")]),
 item("L7-5", "Questão 5", r"Com \(u=(1,1,0)\) e \(v=(1,0,1)\), ache \(\langle u,v\rangle\), as normas e o ângulo.", r"\(1\); \(\sqrt2\) e \(\sqrt2\); \(60^\circ\)",
      [st("Cosseno", "", r"\cos\theta=\frac{1}{\sqrt2\sqrt2}=\frac12\Rightarrow\theta=60^\circ")]),
 item("L7-6", "Questão 6", r"Projeção de \(v=(1,2,3)\) sobre \(u=(1,1,1)\).", r"\((2,2,2)\)", [st("Fórmula", "", r"\frac{1+2+3}{3}(1,1,1)=(2,2,2)")]),
 item("L7-7", "Questão 7", r"Aplique Gram-Schmidt a \(\{(1,1,1),(1,1,0),(1,0,0)\}\).", r"\(\frac{1}{\sqrt3}(1,1,1)\), \(\frac{1}{\sqrt6}(1,1,-2)\), \(\frac{1}{\sqrt2}(1,-1,0)\)",
      [st("w₂", "", r"(1,1,0)-\tfrac23(1,1,1)=\left(\tfrac13,\tfrac13,-\tfrac23\right)"),
       st("w₃", "", r"(1,0,0)-\tfrac13(1,1,1)-\tfrac12\left(\tfrac13,\tfrac13,-\tfrac23\right)=\left(\tfrac12,-\tfrac12,0\right)"),
       st("Normalize", r"Múltiplos convenientes: \((1,1,1)\), \((1,1,-2)\), \((1,-1,0)\), com normas \(\sqrt3,\sqrt6,\sqrt2\).")]),
 item("L7-8", "Questão 8", r"Ache a reta de mínimos quadrados \(y=a+bx\) para os pontos \((0,0)\), \((1,1)\), \((2,3)\).", r"\(y=-\frac16+\frac32x\)",
      [st("Equações normais", "", r"\begin{cases}3a+3b=4\\3a+5b=7\end{cases}\Rightarrow b=\tfrac32,\ a=-\tfrac16")]),
]
out.append(page(7, "Transformações e produto interno", "Transformações lineares e produto interno", "Linearidade, matriz, núcleo e imagem, ângulos, projeções, Gram-Schmidt e mínimos quadrados.", INTRO, L7, [("m9", "Transformações"), ("m10", "Produto interno")]))

def build():
    with open(os.path.join(HERE, "content", "20_listas.html"), "w", encoding="utf-8") as f:
        f.write("\n".join(out))

if __name__ == "__main__":
    build()
