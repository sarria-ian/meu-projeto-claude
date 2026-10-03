"""Gera content/20_listas.html com as listas de exercícios (enunciado, resposta e resolução).
Executado pelo build.py antes de montar a página. As respostas são conferidas por check_listas.py."""
import os, itertools
from gen import st, S, srt, venn, venn_custom, venn_nums, wrap

HERE = os.path.dirname(os.path.abspath(__file__))

def _st_old(label, text, m=None):
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

def TS(xs):
    """conjunto em texto simples (quebra de linha no celular)"""
    xs = list(xs)
    return "∅" if not xs else "{" + ", ".join(str(x).replace("-", "−") for x in xs) + "}"

out = []
INTRO = "Exercícios na numeração original, com resolução própria e comentada. Resolva no caderno antes de abrir a resposta e depois marque se acertou."
# ============================================================ LISTA 1 · Aula 00 (EFOMM)
def ops(U, **sets):
    """avaliador simples: devolve dict com conjuntos"""
    return {k: set(v) for k, v in sets.items()} | {"U": set(U)}
A8, B8, C8, U8 = {1,2,3,4,5}, {1,3,5,7}, {2,5,6,7}, {1,2,3,4,5,6,7}
cB8, cA8, cC8 = U8-B8, U8-A8, U8-C8
r8 = dict(a=A8|C8, b=B8&A8, c=C8-B8, d=cB8, e=cA8-B8, f=cB8|C8, g=U8-(A8-C8), h=cC8&cA8, i=U8-(A8-cB8), j=U8-(A8&cA8))
assert r8["c"] == {2,6} and r8["e"] == {6} and r8["g"] == {2,5,6,7} and r8["h"] == set() and r8["i"] == {2,4,6,7} and r8["j"] == U8
U12, A12, B12, C12 = set("abcde"), set("cde"), set("abcd"), set("e")
r12 = dict(a=A12-B12, b=A12|B12, c=A12&B12, d=U12-A12, e=(U12-B12)-(U12-C12), f=(U12-C12)-A12, g=U12-(A12&(U12-B12)))
A13, B13 = set("abcefij"), set("cehlm"); d13 = A13 ^ B13
A14, B14, C14, U14 = set("abcef"), set("abdgh"), set("bcdkl"), set("abcdefghkl")
r14 = ((A14-B14)-C14) | (C14-(A14|B14)) | (B14&(U14-A14)); assert r14 == set("defghkl")
itap = {x*y for x in range(1,6) for y in range(-5,0)}; assert len(itap) == 14
# 18 e 19
x18 = 36-4-(18+16+18-9-10-7); assert x18 == 6
u19 = 20 + (14+16+12-5-3-7+2); assert u19 == 49
def tv(sym, v): return "V" if v else "F"
def cmp_row(L, txt): return st(L, txt)
L1 = [
 item("L1-ITA", "Exemplo (ITA/2017)", r"Sejam \(A=\{1,2,3,4,5\}\) e \(B=\{-1,-2,-3,-4,-5\}\). Se \(C=\{xy:\ x\in A\text{ e }y\in B\}\), quantos elementos tem \(C\)?", r"\(14\)",
      [st("Leitura da notação", r"“\(C\) é o conjunto dos produtos \(xy\) <b>tal que</b> \(x\in A\) e \(y\in B\)”. São \(5\times5=25\) produtos, mas os <b>repetidos contam uma vez só</b>."),
       st("Tire o sinal", r"Todo produto é negativo: \(xy=-(x\cdot|y|)\), com \(x,|y|\in\{1,\dots,5\}\). Basta contar os produtos distintos \(a\cdot b\) com \(a,b\in\{1,\dots,5\}\)."),
       st("Liste sem repetir", "", r"1,2,3,4,5,\ 6,8,10,\ 9,12,15,\ 16,20,\ 25"),
       st("Conte", r"São 14 valores, logo \(n(C)=14\). (Repetições como \(2\cdot3=3\cdot2=6\) ou \(1\cdot4=2\cdot2=4\) não geram elementos novos.)")]),
 item("L1-6", "Questão 6", r"Seja \(A=\{1,\{1\},2,\{3,5\}\}\). V ou F: a) \(1\in A\) b) \(\{1\}\notin A\) c) \(\{3\}\in A\) d) \(\{3,5\}\notin A\) e) \(\varnothing\subset A\) f) \(\varnothing\in A\) g) \(\{\{1\}\}\subset A\) h) \(\{\{2\}\}\subset A\)",
      r"a) V b) F c) F d) F e) V f) F g) V h) F",
      [st("Método", r"Liste os <b>elementos</b> de \(A\): são quatro — \(1\), \(\{1\}\), \(2\) e \(\{3,5\}\). Para “\(\in\)”, procure o objeto exatamente nessa lista. Para “\(\subset\)”, tire as chaves de fora e confira se <b>cada</b> coisa de dentro está na lista."),
       st("a), b), c), d)", r"\(1\) está na lista (V). \(\{1\}\) está na lista, então “\(\notin\)” é F. \(\{3\}\) não aparece (só \(\{3,5\}\)): F. \(\{3,5\}\) aparece, então “\(\notin\)” é F."),
       st("e), f)", r"\(\varnothing\) é subconjunto de qualquer conjunto (V). Mas \(\varnothing\) não está na lista de elementos (F)."),
       st("g), h)", r"\(\{\{1\}\}\subset A\) pergunta se \(\{1\}\in A\): sim (V). \(\{\{2\}\}\subset A\) pergunta se \(\{2\}\in A\): não; \(2\in A\), mas \(\{2\}\ne2\) (F).")]),
 item("L1-7", "Questão 7", r"Escreva o conjunto das partes de a) \(A=\{2,-2,1\}\); b) \(A=\{\varnothing,1\}\).", "a) 𝒫(A) = {∅, {2}, {−2}, {1}, {2, −2}, {2, 1}, {−2, 1}, {2, −2, 1}} (8 elementos) &nbsp; b) 𝒫(A) = {∅, {∅}, {1}, {∅, 1}} (4 elementos)",
      [st("Roteiro", r"Organize por tamanho: o vazio, os unitários, os de 2 elementos, …, o próprio \(A\). Confira o total com \(2^{n(A)}\)."),
       st("a) n(A) = 3 ⇒ 8 subconjuntos", r"Tamanho 0: \(\varnothing\). Tamanho 1: \(\{2\},\{-2\},\{1\}\). Tamanho 2: \(\{2,-2\},\{2,1\},\{-2,1\}\). Tamanho 3: \(A\). Total \(1+3+3+1=8=2^3\) ✓"),
       st("b) cuidado com ∅ como elemento", r"\(A\) tem 2 elementos: \(\varnothing\) e \(1\). Unitários: \(\{\varnothing\}\) e \(\{1\}\). O subconjunto vazio \(\varnothing\) é diferente do unitário \(\{\varnothing\}\) (uma “caixa vazia” × “uma caixa contendo uma caixa vazia”). Total \(4=2^2\) ✓")]),
 item("L1-8", "Questão 8", r"Com \(A=\{1,2,3,4,5\}\), \(B=\{1,3,5,7\}\), \(C=\{2,5,6,7\}\) e \(U=\{1,\dots,7\}\), determine: a) \(A\cup C\) b) \(B\cap A\) c) \(C-B\) d) \(\overline B\) e) \(\overline A-B\) f) \(\overline B\cup C\) g) \(\overline{A-C}\) h) \(\overline C\cap\overline A\) i) \(\overline{A-\overline B}\) j) \(\overline{A\cap\overline A}\)",
      " &nbsp; ".join(rf"{k}) \({S(srt(v))}\)" for k, v in r8.items()),
      [st("Primeiro os complementares (em relação a U)", "", rf"\overline A={S(srt(cA8))},\quad\overline B={S(srt(cB8))},\quad\overline C={S(srt(cC8))}"),
       st("a), b), c)", "", rf"A\cup C={S(srt(r8['a']))},\quad B\cap A={S(srt(r8['b']))},\quad C-B={S(srt(r8['c']))}"),
       st("d), e), f)", "", rf"\overline B={S(srt(cB8))},\quad \overline A-B={S(srt(cA8))}-{S(srt(B8))}={S(srt(r8['e']))},\quad \overline B\cup C={S(srt(r8['f']))}"),
       st("g) de dentro para fora", "", rf"A-C={S(srt(A8-C8))}\ \Rightarrow\ \overline{{A-C}}={S(srt(r8['g']))}"),
       st("h)", "", rf"\overline C\cap\overline A={S(srt(cC8))}\cap{S(srt(cA8))}=\varnothing"),
       st("i)", "", rf"A-\overline B={S(srt(A8-cB8))}\ \Rightarrow\ \overline{{A-\overline B}}={S(srt(r8['i']))}"),
       st("j)", r"\(A\cap\overline A=\varnothing\) sempre; e \(\overline\varnothing=U\).", rf"\overline{{A\cap\overline A}}=U={S(srt(U8))}")]),
 item("L1-9", "Questão 9 (IME/1987)", r"Com \(A\Delta B=(A-B)\cup(B-A)\), prove que \(X\cap(Y\Delta Z)=(X\cap Y)\Delta(X\cap Z)\).", r"Desenvolva o lado direito com \(A-B=A\cap\overline B\), De Morgan e distributiva até chegar ao esquerdo.",
      [st("Definição", "", r"(X\cap Y)\Delta(X\cap Z)=[(X\cap Y)-(X\cap Z)]\cup[(X\cap Z)-(X\cap Y)]"),
       st("Diferença vira interseção com complementar", "", r"=[(X\cap Y)\cap\overline{X\cap Z}]\cup[(X\cap Z)\cap\overline{X\cap Y}]"),
       st("De Morgan", "", r"=[(X\cap Y)\cap(\overline X\cup\overline Z)]\cup[(X\cap Z)\cap(\overline X\cup\overline Y)]"),
       st("Distributiva", r"Os pedaços com \(X\cap\overline X=\varnothing\) somem:", r"=[(X\cap Y\cap\overline X)\cup(X\cap Y\cap\overline Z)]\cup[(X\cap Z\cap\overline X)\cup(X\cap Z\cap\overline Y)]=(X\cap Y\cap\overline Z)\cup(X\cap Z\cap\overline Y)"),
       st("Coloque X em evidência", "", r"=X\cap[(Y\cap\overline Z)\cup(Z\cap\overline Y)]=X\cap[(Y-Z)\cup(Z-Y)]=X\cap(Y\Delta Z)\ \blacksquare"),
       st("Visualização", r"Os dois lados pintam a mesma região: a parte de \(X\) que está em <b>exatamente um</b> de \(Y\), \(Z\).", None),
       wrap(venn(lambda e: e["A"] and (e["B"] != e["C"]), ("A","B","C"), title="X ∩ (Y Δ Z)   (A = X, B = Y, C = Z)"))]),
 item("L1-10", "Questão 10", r"Sobre \(A=\{\varnothing,\{a\},a,b,\{a,c\}\}\), assinale a errada: a) \(\varnothing\in A\) b) \(\{a,\{a\}\}\in A\) c) \(\varnothing\subset A\) d) \(a\in A\) e) \(\{a,c\}\in A\)", r"b)",
      [st("Elementos de A", r"\(\varnothing\), \(\{a\}\), \(a\), \(b\), \(\{a,c\}\)."),
       st("Análise", r"a) \(\varnothing\) está na lista ✓. b) \(\{a,\{a\}\}\) <b>não</b> está na lista ✗ (ele é <i>subconjunto</i>, pois \(a\) e \(\{a\}\) são elementos). c) sempre ✓. d) ✓. e) ✓.")]),
 item("L1-11", "Questão 11", r"Com \(B=\{\varnothing,a,b,\{a\},\{\varnothing,b\}\}\), V ou F: a) \(\varnothing\notin B\) b) \(a\in B\) c) \(\{a\}\notin B\) d) \(\{\varnothing,a\}\subset B\) e) \(\{\{a,b\}\}\in B\) f) \(\{a\}\not\subset B\) g) \(\{\{a\}\}\subset B\) h) \(\{b,\{a\},\{\varnothing,b\}\}\subset B\) i) \(\varnothing\not\subset B\)", r"a) F b) V c) F d) V e) F f) F g) V h) V i) F",
      [st("Elementos de B", r"\(\varnothing,\ a,\ b,\ \{a\},\ \{\varnothing,b\}\)."),
       st("Pertinência (∈)", r"a) \(\varnothing\) é elemento ⇒ “\(\notin\)” F. b) V. c) \(\{a\}\) é elemento ⇒ F. e) \(\{\{a,b\}\}\) não está na lista ⇒ F."),
       st("Inclusão (⊂)", r"d) \(\varnothing\in B\) e \(a\in B\) ⇒ V. f) \(a\in B\) ⇒ \(\{a\}\subset B\), então “\(\not\subset\)” F. g) \(\{a\}\in B\) ⇒ V. h) os três são elementos ⇒ V. i) \(\varnothing\subset\) qualquer conjunto ⇒ F.")]),
 item("L1-12", "Questão 12", r"\(U=\{a,b,c,d,e\}\), \(A=\{c,d,e\}\), \(B=\{a,b,c,d\}\), \(C=\{e\}\). Determine a) \(A-B\) b) \(A\cup B\) c) \(A\cap B\) d) \(A^C\) e) \(B^C-C^C\) f) \(C^C-A\) g) \((A\cap B^C)^C\)",
      " &nbsp; ".join(rf"{k}) \({S(srt(v))}\)" for k, v in r12.items()),
      [st("Complementares", "", rf"A^C={S(srt(U12-A12))},\quad B^C={S(srt(U12-B12))},\quad C^C={S(srt(U12-C12))}"),
       st("a), b), c)", "", rf"A-B={S(srt(r12['a']))},\ A\cup B={S(srt(r12['b']))},\ A\cap B={S(srt(r12['c']))}"),
       st("d), e), f)", "", rf"A^C={S(srt(r12['d']))},\ B^C-C^C=\{{e\}}-\{{a,b,c,d\}}={S(srt(r12['e']))},\ C^C-A={S(srt(r12['f']))}"),
       st("g)", "", rf"A\cap B^C=\{{e\}}\Rightarrow(A\cap B^C)^C={S(srt(r12['g']))}")]),
 item("L1-13", "Questão 13", r"Com \(A=\{a,b,c,e,f,i,j\}\) e \(B=\{c,e,h,l,m\}\), calcule \(A\Delta B\).", rf"\({S(srt(d13))}\)",
      [st("Duas fórmulas equivalentes", "", r"A\Delta B=(A-B)\cup(B-A)=(A\cup B)-(A\cap B)"),
       st("Pelas diferenças", "", rf"A-B={S(srt(A13-B13))},\quad B-A={S(srt(B13-A13))}"),
       st("Junte", r"São os elementos que estão em <b>exatamente um</b> dos conjuntos (tira-se o \(c\) e o \(e\), comuns).", rf"A\Delta B={S(srt(d13))}")]),
 item("L1-14", "Questão 14", r"\(A=\{a,b,c,e,f\}\), \(B=\{a,b,d,g,h\}\), \(C=\{b,c,d,k,l\}\), \(U=\{a,b,c,d,e,f,g,h,k,l\}\). Calcule \([(A-B)-C]\cup[C-(A\cup B)]\cup(B\cap\overline A)\).", rf"\({S(srt(r14))}\)",
      [st("1º pedaço", "", rf"A-B={S(srt(A14-B14))}\ \Rightarrow\ (A-B)-C={S(srt((A14-B14)-C14))}"),
       st("2º pedaço", "", rf"A\cup B={S(srt(A14|B14))}\ \Rightarrow\ C-(A\cup B)={S(srt(C14-(A14|B14)))}"),
       st("3º pedaço", "", rf"\overline A={S(srt(U14-A14))}\ \Rightarrow\ B\cap\overline A={S(srt(B14&(U14-A14)))}"),
       st("União", "", rf"{S(srt(r14))}")]),
 item("L1-15", "Questão 15", r"\(A=\{a,b,\{a\}\}\), \(B=\{a,b,\{a,b\}\}\), \(C=\{a,\{a\},\{b\}\}\). Julgue: a) \(A\cap C=\{a,\{a\}\}\) b) \(A\cap B=\{a,b\}\) c) \(B\cap\mathcal P(B)=\{\{a,b\}\}\) d) \(A-C=\{b,\{a\}\}\) e) \(A\subset C\)", r"a) V b) V c) V d) F e) F",
      [st("a), b)", r"Elementos comuns: \(A\cap C=\{a,\{a\}\}\) ✓; \(A\cap B=\{a,b\}\) ✓ (\(\{a\}\ne\{a,b\}\))."),
       st("c) o pulo do gato", r"Os elementos de \(\mathcal P(B)\) são <b>subconjuntos</b> de \(B\). Quais elementos de \(B\) são também subconjuntos de \(B\)? \(a\) e \(b\) não são subconjuntos (são “letras”), mas \(\{a,b\}\) é: \(a\in B\) e \(b\in B\). Logo \(B\cap\mathcal P(B)=\{\{a,b\}\}\) ✓"),
       st("d)", r"\(A-C=\{b\}\), não \(\{b,\{a\}\}\) (pois \(\{a\}\in C\)). F."), st("e)", r"\(b\in A\) e \(b\notin C\) ⇒ \(A\not\subset C\). F.")]),
 item("L1-16", "Questão 16", r"Simplifique: a) \(\overline{(A\cap\overline B)\cup\overline{(A\cap B)}}\) b) \(\overline{(A-B)}\cup A\)", r"a) \(A\cap B\) &nbsp; b) \(U\)",
      [st("a) De Morgan no traço de fora", "", r"\overline{(A\cap\overline B)}\cap\overline{\overline{(A\cap B)}}=(\overline A\cup B)\cap(A\cap B)"),
       st("a) absorção", r"Reagrupe: \([(\overline A\cup B)\cap B]\cap A\). Como \(B\subset\overline A\cup B\), \((\overline A\cup B)\cap B=B\).", r"=B\cap A"),
       st("b)", r"\(A-B=A\cap\overline B\), então \(\overline{A-B}=\overline A\cup B\) (De Morgan).", r"(\overline A\cup B)\cup A=(\overline A\cup A)\cup B=U\cup B=U"),
       wrap(venn(lambda e: e["A"] and e["B"], title="a) A ∩ B"), venn(lambda e: True, title="b) U (tudo)"))]),
 item("L1-17", "Questão 17", r"Demonstre: a) \(A-B=A\cap B^C\) b) \(A-(A-B)=A\cap B\) c) \(A-B=(A\cup B)-B\) d) \(B-A^C=B\cap A\) e) \((A\cap B)\cup(A\cap B^C)=A\) f) \((A^C\cup B^C)^C=A\cap B\) g) \(A^C\Delta B^C=A\Delta B\) h) \((A-B)\cap C=(A\cap C)-(B\cap C)=(A\cap C)-B=(A-B)\cap(C-B)\)", r"Use \(X-Y=X\cap Y^C\), De Morgan, distributiva e \(X\cap X^C=\varnothing\).",
      [st("a)", r"\(x\in A-B\iff x\in A\) e \(x\notin B\iff x\in A\) e \(x\in B^C\iff x\in A\cap B^C\)."),
       st("b)", "", r"A-(A\cap B^C)=A\cap(A^C\cup B)=(A\cap A^C)\cup(A\cap B)=A\cap B"),
       st("c)", "", r"(A\cup B)\cap B^C=(A\cap B^C)\cup(B\cap B^C)=A\cap B^C=A-B"),
       st("d)", "", r"B-A^C=B\cap(A^C)^C=B\cap A"),
       st("e)", "", r"(A\cap B)\cup(A\cap B^C)=A\cap(B\cup B^C)=A\cap U=A"),
       st("f)", "", r"(A^C\cup B^C)^C=(A^C)^C\cap(B^C)^C=A\cap B"),
       st("g)", "", r"A^C\Delta B^C=(A^C\cap B)\cup(B^C\cap A)=(B-A)\cup(A-B)=A\Delta B"),
       st("h)", r"Todas viram \(A\cap B^C\cap C\):", r"(A\cap C)\cap(B\cap C)^C=A\cap C\cap(B^C\cup C^C)=A\cap C\cap B^C;\quad (A\cap C)\cap B^C;\quad (A\cap B^C)\cap(C\cap B^C)")]),
 item("L1-18", "Questão 18 (EN/2008, modificada)", r"36 alunos fizeram 3 questões: 18 acertaram a 1ª, 16 a 2ª, 18 a 3ª; 9 acertaram 1ª e 2ª, 10 a 1ª e 3ª, 7 a 2ª e 3ª; 4 erraram todas. Quantos acertaram as três? a) 6 b) 8 c) 26 d) 30 e) 32", r"a) 6",
      [st("Quem acertou alguma", r"\(n(A\cup B\cup C)=36-4=32\)."),
       st("Inclusão-exclusão", "", r"32=18+16+18-9-10-7+x\ \Rightarrow\ 32=26+x\ \Rightarrow\ x=6"),
       st("Diagrama (de dentro para fora)", r"Centro 6; só 1ª e 2ª: \(9-6=3\); só 1ª e 3ª: \(10-6=4\); só 2ª e 3ª: \(7-6=1\); só 1ª: \(18-6-3-4=5\); só 2ª: \(16-6-3-1=6\); só 3ª: \(18-6-4-1=7\). Soma: 32 ✓", None),
       wrap(venn_nums({"A": 5, "B": 6, "C": 7, "AB": 3, "AC": 4, "BC": 1, "ABC": 6}, ("1ª", "2ª", "3ª"), out_val=4))]),
 item("L1-19", "Questão 19 (Fuvest/2018)", r"20 candidatos atingiram nota mínima nas três provas; 14 não atingiram em matemática, 16 em português, 12 em inglês; 5 não atingiram em mat. e port., 3 em mat. e ingl., 7 em port. e ingl.; 2 em nenhuma das três. Quantos candidatos havia? a) 44 b) 46 c) 47 d) 48 e) 49", r"e) 49",
      [st("Os conjuntos certos", r"Trabalhe com os <b>reprovados</b>: \(M,P,I\) = não atingiram a nota em cada matéria. Os 20 aprovados em tudo estão <b>fora</b> de \(M\cup P\cup I\)."),
       st("Inclusão-exclusão", "", r"n(M\cup P\cup I)=14+16+12-5-3-7+2=29"),
       st("Total", "", r"n(U)=29+20=49"),
       wrap(venn_nums({"A": 8, "B": 6, "C": 4, "AB": 3, "AC": 1, "BC": 5, "ABC": 2}, ("M", "P", "I"), out_val=20))]),
]
out.append(page(1, "Aula 00 (EFOMM)", "Questões da Aula 00 – Teoria Elementar dos Conjuntos", "ITA/2017 e questões 6 a 19: pertinência, partes, operações, demonstrações e inclusão-exclusão.", INTRO, L1, [("m3", "Subconjuntos e partes"), ("m5", "Diferença e complementar"), ("m7", "Cardinalidade")]))
# ============================================================ LISTA 2 · Iezzi 11–22
div42 = sorted({d for d in range(-42, 43) if d != 0 and 42 % d == 0}); assert len(div42) == 16
parts4 = [c for k in range(5) for c in itertools.combinations("abcd", k)]; assert len(parts4) == 16
def PS(c): return r"\varnothing" if not c else r"\{" + ",".join(c) + r"\}"
nest = venn_custom([("A", 140, 105, 98), ("B", 140, 118, 74), ("C", 140, 130, 50), ("D", 140, 140, 26)], size=(280, 215))
L2 = [
 item("L2-11", "Exercício 11", r"Dê os elementos: A = {x | x é letra da palavra matemática}, B = {x | x é cor da bandeira brasileira}, C = {x | x é nome de estado brasileiro que começa com a letra a}.", "A = {m, a, t, e, i, c}; B = {branco, azul, amarelo, verde}; C = {Acre, Alagoas, Amapá, Amazonas}",
      [st("A: letras sem repetir", r"m-a-t-e-m-á-t-i-c-a: as letras distintas são \(m,a,t,e,i,c\) (repetir não muda o conjunto; o acento não cria letra nova).")]),
 item("L2-12", "Exercício 12", r"Descreva por uma propriedade: \(A=\{0,2,4,6,8,\dots\}\), \(B=\{0,1,2,\dots,9\}\), C = {Brasília, Rio de Janeiro, Salvador}.", r"A = {x | x é inteiro, par e não negativo}; B = {x | x é algarismo}; C = {x | x foi capital do Brasil}",
      [st("Dica", r"Procure o que <b>todos</b> têm em comum e que <b>só</b> eles têm. Para \(A\), “par” não basta (−2 é par): precisa de “não negativo”.")]),
 item("L2-13", "Exercício 13", r"Escreva com símbolos: a) múltiplos inteiros de 3 entre −10 e +10; b) divisores inteiros de 42; c) múltiplos inteiros de 0; d) frações com numerador e denominador compreendidos entre 0 e 3; e) nomes das capitais da região Centro-Oeste.",
      r"a) \(\{-9,-6,-3,0,3,6,9\}\) b) \(\{\pm1,\pm2,\pm3,\pm6,\pm7,\pm14,\pm21,\pm42\}\) c) \(\{0\}\) d) \(\left\{\frac11,\frac12,\frac21,\frac22\right\}\) e) {Brasília, Goiânia, Cuiabá, Campo Grande}",
      [st("a)", r"\(3k\) com \(-10\lt3k\lt10\Rightarrow k\in\{-3,\dots,3\}\). Por compreensão: \(\{x\mid x=3k,\ k\in\mathbb Z,\ -10\lt x\lt10\}\)."),
       st("b)", r"Divisores positivos de \(42=2\cdot3\cdot7\): \(1,2,3,6,7,14,21,42\); os negativos também dividem. 16 elementos."),
       st("c)", r"Múltiplo de 0 é \(0\cdot k=0\): conjunto unitário \(\{0\}\)."),
       st("d)", r"Inteiros estritamente entre 0 e 3: 1 e 2. Frações \(\frac pq\) com \(p,q\in\{1,2\}\): \(\frac11,\frac12,\frac21,\frac22\). (Como <i>números</i>, \(\frac11=\frac22\), e o conjunto seria \(\{\frac12,1,2\}\).)"),
       st("e)", r"Goiânia (GO), Cuiabá (MT), Campo Grande (MS) e Brasília (DF, capital federal, que fica no Centro-Oeste).")]),
 item("L2-14", "Exercício 14", r"Descreva por uma propriedade: \(A=\{\pm1,\pm2,\pm3,\pm6\}\), \(B=\{0,-10,-20,-30,\dots\}\), \(C=\{1,4,9,16,25,36,\dots\}\), \(D=\{\text{Lua}\}\).", r"\(A\): divisores inteiros de 6; \(B\): múltiplos de 10 não positivos; \(C\): quadrados perfeitos positivos; \(D\): satélites naturais da Terra.",
      [st("Por compreensão", "", r"A=\{x\in\mathbb Z\mid x\text{ divide }6\},\ B=\{x\mid x=10k,\ k\in\mathbb Z,\ k\le0\},\ C=\{n^2\mid n\in\mathbb N^*\},\ D=\{x\mid x\text{ é satélite natural da Terra}\}")]),
 item("L2-15", "Exercício 15", r"Quais são unitários? \(A=\{x\mid x\lt\frac94\text{ e }x\gt\frac65\}\), \(B=\{x\mid0\cdot x=2\}\), C = {x | x inteiro e x^2=3}, \(D=\{x\mid2x+1=7\}\).", r"Só \(D=\{3\}\) (em \(\mathbb R\)).",
      [st("A", r"\(1{,}2\lt x\lt2{,}25\): em \(\mathbb R\) há infinitos números. (Se o universo fosse \(\mathbb Z\), seria \(\{2\}\), unitário: o universo importa!)"),
       st("B", r"\(0\cdot x=0\ne2\) sempre: vazio."), st("C", r"\(x=\pm\sqrt3\), que não são inteiros: vazio."), st("D", r"\(2x=6\Rightarrow x=3\): \(\{3\}\), unitário.")]),
 item("L2-16", "Exercício 16", r"Quais são vazios? \(A=\{x\mid0\cdot x=0\}\), \(B=\{x\mid x\gt\frac94\text{ e }x\lt\frac65\}\), C = {x | x é divisor de zero}, D = {x | x é divisível por zero}.", r"\(B\) e \(D\).",
      [st("A", r"\(0\cdot x=0\) vale para todo \(x\): \(A\) é o próprio universo, não é vazio."),
       st("B", r"Um número não pode ser maior que 2,25 e menor que 1,2: vazio."),
       st("C", r"Todo inteiro não nulo \(d\) divide 0, pois \(0=d\cdot0\): \(C\) é infinito."),
       st("D", r"“\(x\) é divisível por zero” exigiria \(x\div0\), que não existe (divisão por zero não é definida): nenhum \(x\) serve, \(D=\varnothing\).")]),
 item("L2-17", "Exercício 17", r"Com \(A=\{1,2,3,4\}\) e \(B=\{2,4\}\), escreva em símbolos e classifique: 1ª) 3 é elemento de \(A\); 2ª) 1 não está em \(B\); 3ª) \(B\) é parte de \(A\); 4ª) \(B\) é igual a \(A\); 5ª) 4 pertence a \(B\).", r"\(3\in A\) (V); \(1\notin B\) (V); \(B\subset A\) (V); \(B=A\) (F); \(4\in B\) (V)",
      [st("Elemento × conjunto", r"Entre um <b>elemento</b> e um conjunto usamos \(\in\)/\(\notin\); entre dois <b>conjuntos</b>, \(\subset\)/\(=\). “Parte de” = subconjunto.")]),
 item("L2-18", "Exercício 18", r"Com \(A=\{1,2\}\), \(B=\{2,3\}\), \(C=\{1,3,4\}\), \(D=\{1,2,3,4\}\), classifique: a) \(A\subset D\) b) \(A\subset B\) c) \(B\subset C\) d) \(D\supset B\) e) \(C=D\) f) \(A\not\subset C\)", r"a) V b) F c) F d) V e) F f) V",
      [st("Justificativas", r"a) 1 e 2 estão em \(D\). b) \(1\in A\), \(1\notin B\). c) \(2\in B\), \(2\notin C\). d) 2 e 3 estão em \(D\). e) \(2\in D\), \(2\notin C\). f) \(2\in A\), \(2\notin C\).")]),
 item("L2-19", "Exercício 19", r"Quais são verdadeiras? a) \(\{a,a,a,b,b\}=\{a,b\}\) b) \(\{x\mid x^2=4\}=\{x\mid x\ne0\text{ e }x^3-4x=0\}\) c) \(\{x\mid2x+7=11\}=\{2\}\) d) \(\{x\mid x\lt0\text{ e }x\ge0\}=\varnothing\)", r"Todas.",
      [st("a)", r"Repetição não muda o conjunto."), st("b)", r"Esquerda: \(\{-2,2\}\). Direita: \(x(x^2-4)=0\) com \(x\ne0\Rightarrow x=\pm2\). Iguais."),
       st("c)", r"\(2x=4\Rightarrow x=2\)."), st("d)", r"Propriedade contraditória: vazio.")]),
 item("L2-20", "Exercício 20", r"V ou F: a) \(0\in\{0,1,2,3,4\}\) b) \(\{a\}\in\{a,b\}\) c) \(\varnothing\in\{0\}\) d) \(0\in\varnothing\) e) \(\{a\}\subset\varnothing\) f) \(a\in\{a,\{a\}\}\) g) \(\{a\}\subset\{a,\{a\}\}\) h) \(\varnothing\subset\{\varnothing,\{a\}\}\) i) \(\varnothing\in\{\varnothing,\{a\}\}\) j) \(\{a,b\}\in\{a,b,c,d\}\)", r"a) V b) F c) F d) F e) F f) V g) V h) V i) V j) F",
      [st("b), j)", r"\(\{a\}\) e \(\{a,b\}\) são <i>subconjuntos</i>, não elementos, desses conjuntos."), st("c), d)", r"\(\{0\}\) só tem o elemento 0 (que não é \(\varnothing\)); \(\varnothing\) não tem elementos."),
       st("e)", r"O único subconjunto de \(\varnothing\) é o próprio \(\varnothing\)."), st("f), g)", r"\(a\) é elemento; e como \(a\in\{a,\{a\}\}\), também \(\{a\}\subset\{a,\{a\}\}\) (e \(\{a\}\) ainda é elemento!)."),
       st("h), i)", r"\(\varnothing\subset\) qualquer conjunto; e aqui \(\varnothing\) também aparece na lista, então é elemento.")]),
 item("L2-21", "Exercício 21", r"Faça um diagrama de Venn para: \(A,B,C,D\) não vazios, \(D\subset C\subset B\subset A\).", r"Quatro regiões encaixadas, uma dentro da outra.",
      [st("Ideia", r"“\(\subset\)” = desenhar dentro. Como cada um é subconjunto do anterior, os círculos ficam encaixados como bonecas russas.", None), wrap(nest)]),
 item("L2-22", "Exercício 22", r"Construa o conjunto das partes de \(A=\{a,b,c,d\}\).", "𝒫(A) tem 2⁴ = 16 elementos: {" + ", ".join(("∅" if not c else "{" + ", ".join(c) + "}") for c in parts4) + "}",
      [st("Por tamanho", "", r"\begin{aligned}&0:\ \varnothing\\&1:\ \{a\},\{b\},\{c\},\{d\}\\&2:\ \{a,b\},\{a,c\},\{a,d\},\{b,c\},\{b,d\},\{c,d\}\\&3:\ \{a,b,c\},\{a,b,d\},\{a,c,d\},\{b,c,d\}\\&4:\ \{a,b,c,d\}\end{aligned}"),
       st("Conferência", r"\(1+4+6+4+1=16=2^4\). (Esses números são a linha 4 do Triângulo de Pascal: \(\binom4k\) subconjuntos com \(k\) elementos.)")]),
]
out.append(page(2, "Iezzi 11–22", "Descrição, igualdade, subconjuntos e partes (Iezzi, Cap. II)", "Exercícios 11 a 22: enumeração e propriedade, unitário e vazio, ∈ × ⊂, conjunto das partes.", INTRO, L2, [("m2", "Conjuntos e pertinência"), ("m3", "Subconjuntos e partes")]))
# ============================================================ LISTA 3 · Iezzi 23–37
A23, B23, C23 = set("abc"), set("cd"), set("ce")
A28, B28, C28 = set("abcd"), set("bcde"), set("cef")
# 33: força bruta
U33 = set("abcde")
sols33 = [set(c) for k in range(6) for c in itertools.combinations(sorted(U33), k) if set("abcd") | set(c) == set("abcde") and set("cd") | set(c) == set("acde") and set("bcd") & set(c) == {"c"}]
assert sols33 == [set("ace")]
# 34
U34 = set(range(1, 11))
AB34 = set(range(1, 9)); C34 = (U34 - AB34) | {2,7} | {2,5,6}; assert C34 == {2,5,6,7,9,10}
# 35
n35 = sum(1 for k in range(3) for c in itertools.combinations([3,4], k)); assert n35 == 4
circ = lambda: venn_custom([("", 140, 105, 34), ("", 140, 105, 68)], extra='<circle cx="140" cy="105" r="3" fill="var(--ink)"/><text x="148" y="100" font-size="12" fill="var(--ink)">O</text><circle cx="174" cy="105" r="34" fill="none" stroke="var(--pri)" stroke-width="1.6"/><circle cx="116" cy="81" r="34" fill="none" stroke="var(--pri)" stroke-width="1.6"/>', size=(280, 210))
L3 = [
 item("L3-23", "Exercício 23", r"\(A=\{a,b,c\}\), \(B=\{c,d\}\), \(C=\{c,e\}\): determine \(A\cup B\), \(A\cup C\), \(B\cup C\) e \(A\cup B\cup C\).", rf"\({S(srt(A23|B23))}\), \({S(srt(A23|C23))}\), \({S(srt(B23|C23))}\), \({S(srt(A23|B23|C23))}\)",
      [st("Reunião = juntar sem repetir", r"\(x\in A\cup B\iff x\in A\) <b>ou</b> \(x\in B\). O \(c\), comum, aparece uma vez só.")]),
 item("L3-24", "Exercício 24", r"Prove que \(A\subset(A\cup B)\), \(\forall A\).", r"\(x\in A\Rightarrow(x\in A\text{ ou }x\in B)\).",
      [st("Elemento genérico", r"Seja \(x\in A\). Então a frase “\(x\in A\) ou \(x\in B\)” é verdadeira (basta uma parte do “ou”). Logo \(x\in A\cup B\). Como \(x\) era qualquer, \(A\subset A\cup B\).")]),
 item("L3-25", "Exercício 25", r"V ou F (\(A,B,C\) quaisquer): a) \(\varnothing\subset(A\cup B)\) b) \((A\cup B)\subset A\) c) \(A\supset(A\cup B)\) d) \((A\cup B)\subset(A\cup B)\) e) \(B\subset(A\cup B)\) f) \((A\cup B)\subset(A\cup B\cup C)\)", r"a) V b) F c) F d) V e) V f) V",
      [st("b), c) F", r"Em geral \(A\cup B\) é maior que \(A\): \(A=\{1\}\), \(B=\{2\}\) dá \(A\cup B=\{1,2\}\not\subset A\). (Só vale se \(B\subset A\).)"), st("d)", r"Reflexiva."), st("e), f)", r"Como no Exercício 24.")]),
 item("L3-26", "Exercício 26", r"Determine a reunião dos círculos de raio \(r\), contidos num plano \(\alpha\), que têm um ponto comum \(O\in\alpha\).", r"O círculo (disco) de centro \(O\) e raio \(2r\).",
      [st("Cada círculo passa por O", r"Um círculo de raio \(r\) que contém \(O\) tem centro a distância \(\le r\) de \(O\); seus pontos estão a no máximo \(r+r=2r\) de \(O\) (desigualdade triangular)."),
       st("Todo ponto até 2r é alcançado", r"Dado \(P\) com \(OP\le2r\), o círculo de raio \(r\) com centro no ponto médio de \(OP\) contém \(O\) e \(P\)."),
       st("Esboço", r"Os círculos tracejados (raio \(r\)) “varrem” o disco grande (raio \(2r\)).", None), wrap(circ())]),
 item("L3-27", "Exercício 27", r"Determine a reunião das retas de um plano \(\alpha\) paralelas a uma reta \(r\) de \(\alpha\).", r"O próprio plano \(\alpha\).",
      [st("Por cada ponto passa uma", r"Por todo ponto \(P\in\alpha\) passa exatamente uma reta paralela a \(r\) (incluindo \(r\) se \(P\in r\)). Logo cada ponto do plano está em alguma delas, e elas cobrem \(\alpha\).")]),
 item("L3-28", "Exercício 28", r"\(A=\{a,b,c,d\}\), \(B=\{b,c,d,e\}\), \(C=\{c,e,f\}\): descreva \(A\cap B\), \(A\cap C\), \(B\cap C\), \(A\cap B\cap C\).", rf"\({S(srt(A28&B28))}\), \({S(srt(A28&C28))}\), \({S(srt(B28&C28))}\), \({S(srt(A28&B28&C28))}\)",
      [st("Interseção = o que é comum", r"\(x\in A\cap B\iff x\in A\) <b>e</b> \(x\in B\).")]),
 item("L3-29", "Exercício 29", r"Prove que \((A\cap B)\subset A\), \(\forall A\).", r"\(x\in A\cap B\Rightarrow x\in A\).",
      [st("Elemento genérico", r"Se \(x\in A\cap B\), então “\(x\in A\) e \(x\in B\)”; em particular \(x\in A\).")]),
 item("L3-30", "Exercício 30", r"V ou F: a) \(\varnothing\subset(A\cap B)\) b) \(A\subset(A\cap B)\) c) \(A\in(A\cap B)\) d) \((A\cap B)\subset(A\cap B)\) e) \((A\cap B)\subset B\) f) \((A\cap B)\supset(A\cap B\cap C)\)", r"a) V b) F c) F d) V e) V f) V",
      [st("b) F", r"\(A=\{1,2\}\), \(B=\{1\}\): \(A\not\subset\{1\}\)."), st("c) F", r"\(A\) é um conjunto, não (em geral) elemento de \(A\cap B\): confusão entre \(\in\) e \(\subset\)."), st("f) V", r"Intersectar com mais um conjunto só pode diminuir.")]),
 item("L3-31", "Exercício 31", r"\(K\) = quadriláteros; \(P\): lados 2 a 2 paralelos; \(L\): 4 lados congruentes; \(R\): 4 ângulos retos; \(Q\): 4 lados congruentes e 2 ângulos retos. Determine a) \(L\cap P\) b) \(R\cap P\) c) \(L\cap R\) d) \(Q\cap R\) e) \(L\cap Q\) f) \(P\cup Q\)", r"a) \(L\) b) \(R\) c) \(Q\) d) \(Q\) e) \(Q\) f) \(P\)",
      [st("Quem é quem", r"\(P\) = paralelogramos, \(L\) = losangos, \(R\) = retângulos, \(Q\) = quadrados (um losango com um ângulo reto tem todos retos)."),
       st("Inclusões", r"\(Q\subset L\subset P\) e \(Q\subset R\subset P\). Se \(X\subset Y\): \(X\cap Y=X\) e \(X\cup Y=Y\)."),
       st("Respostas", r"a) \(L\) b) \(R\) c) losango e retângulo ao mesmo tempo = quadrado: \(Q\) d) \(Q\) e) \(Q\) f) \(P\).")]),
 item("L3-32", "Exercício 32", r"\(A=\{1,2,3\}\), \(B=\{3,4\}\), \(C=\{1,2,4\}\): determine \(X\) com \(X\cup B=A\cup C\) e \(X\cap B=\varnothing\).", r"\(X=\{1,2\}\)",
      [st("Candidatos", r"\(X\cup B=\{1,2,3,4\}\Rightarrow X\subset\{1,2,3,4\}\), e 1, 2 (que não estão em \(B\)) precisam estar em \(X\)."), st("Excluídos", r"\(X\cap B=\varnothing\Rightarrow3,4\notin X\)."), st("Conclusão", r"\(X=\{1,2\}\).")]),
 item("L3-33", "Exercício 33", r"Determine \(X\) tal que \(\{a,b,c,d\}\cup X=\{a,b,c,d,e\}\), \(\{c,d\}\cup X=\{a,c,d,e\}\) e \(\{b,c,d\}\cap X=\{c\}\).", r"\(X=\{a,c,e\}\)",
      [st("1ª condição", r"\(e\in X\) e \(X\subset\{a,b,c,d,e\}\)."), st("2ª condição", r"\(a,e\in X\) e \(X\subset\{a,c,d,e\}\) (então \(b\notin X\))."),
       st("3ª condição", r"\(c\in X\), \(b\notin X\), \(d\notin X\)."), st("Conclusão", r"\(X=\{a,c,e\}\). Confira as três condições ✓")]),
 item("L3-34", "Exercício 34", r"\(A\cup B\cup C=\{n\in\mathbb N\mid1\le n\le10\}\), \(A\cap B=\{2,3,8\}\), \(A\cap C=\{2,7\}\), \(B\cap C=\{2,5,6\}\), \(A\cup B=\{n\in\mathbb N\mid1\le n\le8\}\). Determine \(C\).", r"\(C=\{2,5,6,7,9,10\}\)",
      [st("Fora de A ∪ B", r"9 e 10 estão na reunião total mas não em \(A\cup B\): estão em \(C\)."),
       st("Dentro de A ∪ B", r"Um \(x\in C\) que também está em \(A\cup B\) cai em \(A\cap C\) ou \(B\cap C\): só \(2,5,6,7\)."),
       st("Conclusão", r"\(C=\{2,5,6,7\}\cup\{9,10\}=\{2,5,6,7,9,10\}\).")]),
 item("L3-35", "Exercício 35", r"Quantos conjuntos \(X\) satisfazem \(\{1,2\}\subset X\subset\{1,2,3,4\}\)?", r"4",
      [st("Ideia", r"1 e 2 são obrigatórios; 3 e 4 são opcionais (entra ou não entra): \(2\times2=4\)."), st("Lista", "", r"\{1,2\},\ \{1,2,3\},\ \{1,2,4\},\ \{1,2,3,4\}")]),
 item("L3-36", "Exercício 36", r"Assinale no diagrama: a) \(A\cap B\cap C\) b) \(A\cap(B\cup C)\) c) \(A\cup(B\cap C)\) d) \(A\cup B\cup C\)", r"Veja os diagramas.",
      [st("Como pintar", r"Pense em cada região como “dentro/fora” de cada conjunto e teste a frase lógica: \(\cap\) = “e”, \(\cup\) = “ou”."),
       wrap(venn(lambda e: e["A"] and e["B"] and e["C"], ("A","B","C"), title="a) A ∩ B ∩ C"), venn(lambda e: e["A"] and (e["B"] or e["C"]), ("A","B","C"), title="b) A ∩ (B ∪ C)"),
            venn(lambda e: e["A"] or (e["B"] and e["C"]), ("A","B","C"), title="c) A ∪ (B ∩ C)"), venn(lambda e: e["A"] or e["B"] or e["C"], ("A","B","C"), title="d) A ∪ B ∪ C"))]),
 item("L3-37", "Exercício 37", r"\(A\) tem 2 elementos, \(B\) tem 3, \(C\) tem 4. Qual o número máximo de elementos de \((A\cap B)\cap C\)?", r"2",
      [st("Limite", r"\((A\cap B)\cap C\subset A\), então tem no máximo \(n(A)=2\) elementos."), st("Atinge", r"Ex.: \(A=\{1,2\}\), \(B=\{1,2,3\}\), \(C=\{1,2,3,4\}\) dá \(\{1,2\}\).")]),
]
out.append(page(3, "Iezzi 23–37", "Reunião e interseção (Iezzi, Cap. II)", "Exercícios 23 a 37: reunião, interseção, propriedades, problemas e diagramas.", INTRO, L3, [("m4", "União e interseção")]))
# ============================================================ LISTA 4 · Iezzi 38–47
A38, B38, C38 = set("abcd"), set("cdefg"), set("bdeg")
r38 = dict(a=A38-B38, b=B38-A38, c=C38-B38, d=(A38|C38)-B38, e=A38-(B38&C38), f=(A38|B38)-(A38&C38))
assert r38["d"] == set("ab") and r38["e"] == set("abc") and r38["f"] == set("acefg")
A41, B41, C41 = {1,2,3,4,5}, {1,2,4,6,8}, {2,4,5,7}; X41 = A41 - (B41 & C41); assert X41 == {1,3,5} and A41 - X41 == B41 & C41
E45 = set(range(1, 9)); F45 = {y for y in E45 if y + 1 <= 6}; assert E45 - F45 == {6,7,8}
L4 = [
 item("L4-38", "Exercício 38", r"\(A=\{a,b,c,d\}\), \(B=\{c,d,e,f,g\}\), \(C=\{b,d,e,g\}\). Determine a) \(A-B\) b) \(B-A\) c) \(C-B\) d) \((A\cup C)-B\) e) \(A-(B\cap C)\) f) \((A\cup B)-(A\cap C)\)",
      " &nbsp; ".join(rf"{k}) \({S(srt(v))}\)" for k, v in r38.items()),
      [st("Regra", r"\(X-Y\): os elementos de \(X\) que <b>não</b> estão em \(Y\). Resolva os parênteses primeiro."),
       st("a), b), c)", "", rf"A-B={S(srt(r38['a']))},\quad B-A={S(srt(r38['b']))},\quad C-B={S(srt(r38['c']))}"),
       st("d)", "", rf"A\cup C={S(srt(A38|C38))}\ \Rightarrow\ (A\cup C)-B={S(srt(r38['d']))}"),
       st("e)", "", rf"B\cap C={S(srt(B38&C38))}\ \Rightarrow\ A-(B\cap C)={S(srt(r38['e']))}"),
       st("f)", "", rf"A\cup B={S(srt(A38|B38))},\ A\cap C={S(srt(A38&C38))}\ \Rightarrow\ {S(srt(r38['f']))}"),
       st("Atenção", r"\(A-B\ne B-A\): a diferença <b>não</b> é comutativa.")]),
 item("L4-39", "Exercício 39", r"Prove que \((A-B)\subset A\), \(\forall A\).", r"\(x\in A-B\Rightarrow(x\in A\text{ e }x\notin B)\Rightarrow x\in A\).",
      [st("Elemento genérico", r"Todo elemento de \(A-B\) é, por definição, elemento de \(A\).")]),
 item("L4-40", "Exercício 40", r"V ou F: a) \((A-B)\supset\varnothing\) b) \((A-B)\cup(A\cap B)=A\) c) \((A-B)\subset B\) d) \((A-B)\subset(A\cup B)\)", r"a) V b) V c) F d) V",
      [st("b)", r"Os elementos de \(A\) se dividem em “fora de \(B\)” e “dentro de \(B\)”: juntando as duas partes, volta \(A\).", None),
       wrap(venn(lambda e: e["A"] and not e["B"], title="A − B"), venn(lambda e: e["A"] and e["B"], title="A ∩ B")),
       st("c) F", r"Nenhum elemento de \(A-B\) está em \(B\); só vale \(A-B\subset B\) se \(A-B=\varnothing\)."), st("d) V", r"\(A-B\subset A\subset A\cup B\).")]),
 item("L4-41", "Exercício 41", r"\(A=\{1,2,3,4,5\}\), \(B=\{1,2,4,6,8\}\), \(C=\{2,4,5,7\}\): obtenha \(X\subset A\) com \(A-X=B\cap C\).", r"\(X=\{1,3,5\}\)",
      [st("B ∩ C", "", r"B\cap C=\{2,4\}"), st("Ideia", r"\(A-X\) é o que sobra de \(A\) ao tirar \(X\). Para sobrar exatamente \(\{2,4\}\), \(X\) deve ser o resto de \(A\)."), st("Conclusão", r"\(X=A-\{2,4\}=\{1,3,5\}\); confira: \(A-X=\{2,4\}\) ✓")]),
 item("L4-42", "Exercício 42", r"Assinale no diagrama: a) \(\overline A-B\) b) \(\overline A-A\cup B\) c) \(\overline B\cup A\) d) \(\overline{A\cup B}\) e) \(\overline{A\cap B}\) f) \(\overline B\cap A\)", r"Veja os diagramas (b lido da esquerda para a direita: \((\overline A-A)\cup B=\overline A\cup B\)).",
      [st("Leitura", r"\(\overline X=U-X\): tudo que está fora de \(X\) (dentro do retângulo \(U\))."),
       wrap(venn(lambda e: not e["A"] and not e["B"], title="a) Ā − B"), venn(lambda e: (not e["A"]) or e["B"], title="b) (Ā − A) ∪ B = Ā ∪ B"), venn(lambda e: (not e["B"]) or e["A"], title="c) B̄ ∪ A"),
            venn(lambda e: not (e["A"] or e["B"]), title="d) complementar de A ∪ B"), venn(lambda e: not (e["A"] and e["B"]), title="e) complementar de A ∩ B"), venn(lambda e: e["A"] and not e["B"], title="f) B̄ ∩ A")),
       st("Observe", r"a) e d) dão a mesma região: \(\overline A-B=\overline A\cap\overline B=\overline{A\cup B}\) (De Morgan). E f) é \(A-B\).")]),
 item("L4-43", "Exercício 43", r"Prove que \(A-\overline B=A\cap B\).", r"\(x\in A-\overline B\iff x\in A\text{ e }x\notin\overline B\iff x\in A\text{ e }x\in B\).",
      [st("Cadeia de equivalências", r"\(x\notin\overline B\) significa “não é verdade que \(x\notin B\)”, isto é, \(x\in B\).")]),
 item("L4-44", "Exercício 44", r"V ou F (\(\complement X=U-X\)): a) \((A-B)\cup(B-A)=(A\cup B)-(A\cap B)\) b) \(A\subset B\Rightarrow\complement B\subset\complement A\) c) \((A-B)\subset\complement A\) d) \((A-B)\subset\complement B\)", r"a) V b) V c) F d) V",
      [st("a) V", r"Os dois lados são “os elementos que estão em exatamente um dos dois” (diferença simétrica).", None), wrap(venn(lambda e: e["A"] != e["B"], title="A Δ B")),
       st("b) V", r"Se \(x\notin B\) e \(A\subset B\), então \(x\notin A\) (se estivesse em \(A\), estaria em \(B\)). É a <b>contrapositiva</b>."),
       st("c) F", r"Elementos de \(A-B\) estão em \(A\), logo <b>não</b> estão em \(\complement A\) (a menos que \(A-B=\varnothing\))."), st("d) V", r"Elementos de \(A-B\) não estão em \(B\).")]),
 item("L4-45", "Exercício 45", r"\(E=\{1,\dots,8\}\), \(p(y):\ y+1\le6\) e \(F=\{y\in E\mid y\text{ satisfaz }p(y)\}\). Determine \(\overline F\).", r"\(\overline F=\{6,7,8\}\) (complementar em \(E\))",
      [st("F", r"\(y+1\le6\iff y\le5\Rightarrow F=\{1,2,3,4,5\}\)."), st("Complementar em E", r"\(\overline F=E-F=\{6,7,8\}\): são os \(y\) que satisfazem a negação \(y+1\gt6\).")]),
 item("L4-46", "Exercício 46", r"Descreva os elementos: \(A=\{x\mid x^2-5x-6=0\}\), B = {x | x é letra de exercício}, \(C=\{x\mid x^2-9=0\text{ ou }2x-1=9\}\), \(D=\{x\mid2x+1=0\text{ e }2x^2-x-1=0\}\), \(E=\{x\mid x\text{ é algarismo de }234\,543\}\).", r"\(A=\{-1,6\}\), \(B=\{e,x,r,c,i,o\}\), \(C=\{-3,3,5\}\), \(D=\{-\frac12\}\), \(E=\{2,3,4,5\}\)",
      [st("A", r"\((x-6)(x+1)=0\)."), st("C: “ou” junta", r"\(x^2=9\Rightarrow\pm3\); \(2x=10\Rightarrow5\): \(\{-3,3,5\}\)."),
       st("D: “e” exige as duas", r"\(2x+1=0\Rightarrow x=-\frac12\); testando na outra: \(2\cdot\frac14+\frac12-1=0\) ✓. (A 2ª tem raízes \(1\) e \(-\frac12\); só a comum fica.)"),
       st("B, E", r"Letras/algarismos distintos, sem repetir.")]),
 item("L4-47", "Exercício 47", r"Seja \(E=\{a,\{a\}\}\). Quais são verdadeiras? a) \(a\in E\) b) \(\{a\}\in E\) c) \(a\subset E\) d) \(\{a\}\subset E\) e) \(\varnothing\in E\) f) \(\varnothing\subset E\)", r"a), b), d), f)",
      [st("Elementos de E", r"\(a\) e \(\{a\}\)."), st("c) F", r"\(a\) é elemento, não conjunto de elementos de \(E\); “\(a\subset E\)” não faz sentido (o correto é \(\{a\}\subset E\))."),
       st("d) V", r"\(a\in E\Rightarrow\{a\}\subset E\). Note que \(\{a\}\) é ao mesmo tempo elemento <b>e</b> subconjunto de \(E\)."), st("e) F, f) V", r"\(\varnothing\) não está listado, mas é subconjunto de todo conjunto.")]),
]
out.append(page(4, "Iezzi 38–47", "Diferença e complementar (Iezzi, Cap. II)", "Exercícios 38 a 47: diferença, complementar, De Morgan e pertinência.", INTRO, L4, [("m5", "Diferença e complementar")]))
# ============================================================ LISTA 5 · Iezzi 48–61
div120 = [d for d in range(1, 121) if 120 % d == 0]; m3 = [d for d in div120 if d % 3 == 0]; assert len(m3) == 8
# 54: regiões (C ⊂ B)
r54 = {"A": 8, "AB": 3, "ABC": 1, "BC": 5, "B": 7}
nA = r54["A"]+r54["AB"]+r54["ABC"]; nB = r54["AB"]+r54["ABC"]+r54["BC"]+r54["B"]; nC = r54["ABC"]+r54["BC"]
assert nA+nB-(r54["AB"]+r54["ABC"]) == 24 and r54["AB"]+r54["ABC"] == 4 and nB == 16 and nA-r54["ABC"] == 11 and nB-nC == 10
# 56
tot56 = 109+203+162-25-41-28+5+115; soA = 109-25-28+5; nAC = 500-(109+162-28); duas = 25+41+28-2*5
assert (tot56, soA, nAC, duas) == (500, 61, 257, 84)
# 57: força bruta sobre as regiões
U57 = set("zxvutsrqp")
A57, B57, C57 = set("pqrst"), set("rsxz"), set("stuvx")
assert A57|B57|C57 == U57 and A57&B57 == set("rs") and B57&C57 == set("sx") and C57&A57 == set("st") and A57|C57 == set("pqrstuvx") and A57|B57 == set("pqrstxz")
v54 = venn_custom([("A", 102, 125, 62), ("B", 168, 100, 88), ("C", 150, 112, 34)], size=(280, 215))
L5 = [
 item("L5-48", "Exercício 48", r"Sejam \(A,B\) finitos. Prove que \(n_{A\cup B}=n_A+n_B-n_{A\cap B}\).", r"Divida \(A\cup B\) em três partes disjuntas: \(A-B\), \(A\cap B\), \(B-A\).",
      [st("Partes disjuntas", r"\(x=n(A-B)\), \(y=n(A\cap B)\), \(z=n(B-A)\). Então \(n(A)=x+y\), \(n(B)=y+z\), \(n(A\cup B)=x+y+z\).", None), wrap(venn(lambda e: e["A"] or e["B"], title="A ∪ B = (A−B) ∪ (A∩B) ∪ (B−A)")),
       st("Conta", "", r"n(A)+n(B)-n(A\cap B)=(x+y)+(y+z)-y=x+y+z=n(A\cup B)"),
       st("Leitura", r"Somando \(n(A)+n(B)\), os elementos comuns foram contados duas vezes; subtraímos uma vez (incluir e excluir).")]),
 item("L5-49", "Exercício 49", r"\(n(A)=4\), \(n(B)=5\), \(n(A\cap B)=3\). Quantos subconjuntos tem \(A\cup B\)?", r"\(2^6=64\)",
      [st("n(A ∪ B)", "", r"4+5-3=6"), st("Partes", r"Um conjunto com \(n\) elementos tem \(2^n\) subconjuntos:", r"2^6=64")]),
 item("L5-50", "Exercício 50", r"Estabeleça uma fórmula para \(n_{A\cup B\cup C}\).", r"\(n(A)+n(B)+n(C)-n(A\cap B)-n(A\cap C)-n(B\cap C)+n(A\cap B\cap C)\)",
      [st("Aplique a de dois conjuntos a (A ∪ B) e C", "", r"n((A\cup B)\cup C)=n(A\cup B)+n(C)-n((A\cup B)\cap C)"),
       st("Distributiva", r"\((A\cup B)\cap C=(A\cap C)\cup(B\cap C)\), cuja interseção é \(A\cap B\cap C\):", r"n((A\cup B)\cap C)=n(A\cap C)+n(B\cap C)-n(A\cap B\cap C)"),
       st("Junte", "", r"n(A\cup B\cup C)=n(A)+n(B)+n(C)-n(A\cap B)-n(A\cap C)-n(B\cap C)+n(A\cap B\cap C)"),
       st("Por que funciona", r"Um elemento do centro é contado \(3-3+1=1\) vez; um que está em exatamente dois, \(2-1=1\) vez; em exatamente um, 1 vez.")]),
 item("L5-51", "Exercício 51", r"\(A=\{3n\mid n\in\mathbb N\}\) e \(B=\{n\in\mathbb N\mid n\text{ divide }120\}\). Quantos elementos tem \(A\cap B\)?", r"8",
      [st("Divisores de 120 = 2³·3·5", TS(div120) + " (16 divisores)."), st("Os múltiplos de 3 entre eles", TS(m3) + ": 8 elementos."),
       st("Atalho", r"Divisores de 120 múltiplos de 3 são \(3\cdot d\) com \(d\mid40\); 40 tem \((3+1)(1+1)=8\) divisores.")]),
 item("L5-52", "Exercício 52", r"Escola com 415 alunos: 221 estudam inglês, 163 francês e 52 ambas. Quantos estudam inglês ou francês? Quantos não estudam nenhuma?", r"332 e 83",
      [st("Inglês ou francês", "", r"n(I\cup F)=221+163-52=332"), st("Nenhuma", "", r"415-332=83"),
       st("Por regiões", r"Só inglês: \(221-52=169\); só francês: \(163-52=111\); ambas: 52; nenhuma: 83. Soma 415 ✓")]),
 item("L5-53", "Exercício 53", r"Sendo \(X'\) o complementar de \(X\), determine \(P'\cup(P\cap Q)\), quaisquer que sejam \(P\) e \(Q\).", r"\(P'\cup Q\)",
      [st("Distributiva", "", r"P'\cup(P\cap Q)=(P'\cup P)\cap(P'\cup Q)=U\cap(P'\cup Q)=P'\cup Q"),
       wrap(venn(lambda e: (not e["A"]) or e["B"], title="P′ ∪ Q   (A = P, B = Q)")),
       st("Se o enunciado tiver o complementar de tudo", r"\([P'\cup(P\cap Q)]'=(P'\cup Q)'=P\cap Q'=P-Q\) (De Morgan).")]),
 item("L5-54", "Exercício 54", r"No diagrama (\(C\subset B\), \(C\) cortando \(A\)), \(n(A\cup B)=24\), \(n(A\cap B)=4\), \(n(B\cup C)=16\), \(n(A-C)=11\), \(n(B-C)=10\). Calcule a) \(n(A-B)\) b) \(n(A\cap B\cap C)\) c) \(n(B-(C\cup A))\) d) \(n((A\cap B)-C)\) e) \(n(B-(A\cap B))\)", r"a) 8 b) 1 c) 7 d) 3 e) 12",
      [st("Leia o desenho", r"\(C\subset B\), logo \(B\cup C=B\Rightarrow n(B)=16\), e \(n(C)=n(B)-n(B-C)=6\).", None), wrap(v54),
       st("n(A)", "", r"n(A)=n(A\cup B)-n(B)+n(A\cap B)=24-16+4=12"),
       st("n(A ∩ C)", "", r"n(A\cap C)=n(A)-n(A-C)=12-11=1"),
       st("Regiões", r"\(A\cap C\) (dentro de \(B\)): 1; \(C\) sem \(A\): 5; \((A\cap B)-C\): \(4-1=3\); \(B\) sem \(A\) e sem \(C\): \(16-1-5-3=7\); só \(A\): \(12-4=8\)."),
       st("Respostas", r"a) \(8\) b) \(1\) c) \(7\) d) \(3\) e) \(16-4=12\).")]),
 item("L5-55", "Exercício 55", r"\(A,B\subset U\), \(\overline A=\{e,f,g,h,i\}\), \(A\cap B=\{c,d\}\), \(A\cup B=\{a,b,c,d,e,f\}\). Quantos elementos têm \(A\) e \(B\)?", r"\(n(A)=4\) (\(A=\{a,b,c,d\}\)) e \(n(B)=4\) (\(B=\{c,d,e,f\}\))",
      [st("e, f", r"Estão em \(\overline A\) (fora de \(A\)) mas em \(A\cup B\): estão em \(B\) e não em \(A\)."),
       st("a, b", r"Não estão em \(\overline A\), logo estão em \(A\); não estão em \(A\cap B\), logo não estão em \(B\)."),
       st("c, d", r"Em ambos."), st("Conclusão", r"\(A=\{a,b,c,d\}\), \(B=\{c,d,e,f\}\).")]),
 item("L5-56", "Exercício 56", r"Sabão em pó: A 109, B 203, C 162, A e B 25, B e C 41, C e A 28, as três 5, nenhuma 115. Forneça a) pessoas consultadas; b) só A; c) não consomem A nem C; d) consomem ao menos duas marcas.", r"a) 500 b) 61 c) 257 d) 84",
      [st("Preencha de dentro para fora", r"Centro 5. Só A e B: \(25-5=20\); só B e C: \(41-5=36\); só C e A: \(28-5=23\). Só A: \(109-5-20-23=61\); só B: \(203-5-20-36=142\); só C: \(162-5-36-23=98\).", None),
       wrap(venn_nums({"A": 61, "B": 142, "C": 98, "AB": 20, "AC": 23, "BC": 36, "ABC": 5}, ("A", "B", "C"), out_val=115)),
       st("a)", "", r"61+142+98+20+23+36+5+115=500"), st("b)", r"Só A: 61."),
       st("c)", r"Fora de \(A\cup C\): só B (142) + nenhuma (115) = 257."), st("d)", r"\(20+23+36+5=84\).")]),
 item("L5-57", "Exercício 57", r"Determine \(A,B,C\) com: \(A\cup B\cup C=\{z,x,v,u,t,s,r,q,p\}\), \(A\cap B=\{r,s\}\), \(B\cap C=\{s,x\}\), \(C\cap A=\{s,t\}\), \(A\cup C=\{p,q,r,s,t,u,v,x\}\), \(A\cup B=\{p,q,r,s,t,x,z\}\).", rf"\(A={S(srt(A57))}\), \(B={S(srt(B57))}\), \(C={S(srt(C57))}\)",
      [st("Os das interseções", r"\(s\) está nas três; \(r\in A\cap B\) só; \(t\in A\cap C\) só; \(x\in B\cap C\) só."),
       st("z", r"Está em \(A\cup B\), não em \(A\cup C\): só em \(B\)."), st("u, v", r"Estão em \(A\cup C\), não em \(A\cup B\): só em \(C\)."),
       st("p, q", r"Estão em \(A\cup B\) e \(A\cup C\). Se não estivessem em \(A\), estariam em \(B\) e em \(C\), logo em \(B\cap C=\{s,x\}\): absurdo. Então estão em \(A\), e só em \(A\)."),
       st("Monte", "", rf"A={S(srt(A57))},\quad B={S(srt(B57))},\quad C={S(srt(C57))}")]),
 item("L5-58", "Exercício 58", r"Etnias branca, negra e amarela: 70 são brancos, 350 são não negros e 50% são amarelos. a) Quantos indivíduos? b) Quantos amarelos?", r"a) 560 b) 280",
      [st("Não negros = brancos + amarelos", r"\(350=70+\text{amarelos}\Rightarrow\) amarelos \(=280\)."), st("50% são amarelos", r"Total \(=2\cdot280=560\) (e negros \(=560-350=210\)).")]),
 item("L5-59", "Exercício 59", r"30% dos empregados optaram pelo plano. 45% trabalham na matriz (SP), 20% em Santos e o resto em Campinas. Optaram 20% dos da matriz e 35% dos de Santos. Qual a porcentagem dos de Campinas que optaram?", r"40%",
      [st("Suponha 100 empregados", r"Matriz 45, Santos 20, Campinas 35. Optantes: 30."),
       st("Optantes conhecidos", r"Matriz: \(0{,}20\cdot45=9\). Santos: \(0{,}35\cdot20=7\)."), st("Campinas", r"\(30-9-7=14\) de 35: \(\frac{14}{35}=40\%\).")]),
 item("L5-60", "Exercício 60", r"\(A\Delta B=(A-B)\cup(B-A)\). a) \(\{a,b,c,d\}\Delta\{c,d,e,f,g\}\) b) prove \(A\Delta\varnothing=A\) c) prove \(A\Delta A=\varnothing\) d) prove \(A\Delta B=B\Delta A\) e) assinale \(A\Delta B\) nos três diagramas.", r"a) \(\{a,b,e,f,g\}\)",
      [st("a)", "", r"\{a,b\}\cup\{e,f,g\}=\{a,b,e,f,g\}"),
       st("b)", "", r"A\Delta\varnothing=(A-\varnothing)\cup(\varnothing-A)=A\cup\varnothing=A"), st("c)", "", r"A\Delta A=(A-A)\cup(A-A)=\varnothing"),
       st("d)", r"A reunião é comutativa:", r"A\Delta B=(A-B)\cup(B-A)=(B-A)\cup(A-B)=B\Delta A"),
       st("e)", r"Em geral: as duas “luas”; se \(B\subset A\): o anel \(A-B\); se disjuntos: \(A\cup B\).", None),
       wrap(venn(lambda e: e["A"] != e["B"], title="sobrepostos"),
            '<svg viewBox="0 0 280 210" width="280" height="210" role="img" aria-label="B dentro de A"><rect x="4" y="4" width="272" height="202" rx="6" fill="none" stroke="var(--muted)"/><circle cx="140" cy="105" r="80" class="vreg"/><circle cx="150" cy="115" r="38" fill="var(--bg,#fff)"/><circle cx="140" cy="105" r="80" fill="none" stroke="var(--ink)" stroke-width="1.8"/><circle cx="150" cy="115" r="38" fill="none" stroke="var(--ink)" stroke-width="1.8"/><text x="98" y="70" font-size="14" font-weight="700" fill="var(--ink)">A</text><text x="150" y="120" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">B</text><text x="140" y="202" font-size="12.5" text-anchor="middle" fill="var(--ink)">B ⊂ A: A Δ B = A − B</text></svg>',
            venn(lambda e: e["A"] != e["B"], geo={"A": (78, 100, 56), "B": (202, 100, 56)}, title="disjuntos: A Δ B = A ∪ B"))]),
 item("L5-61", "Exercício 61", r"Desenhe um Venn com \(A,B,C,D\) não vazios tais que \(A\not\subset B\), \(B\not\subset A\), \(C\supset(A\cup B)\) e \(D\subset(A\cap B)\).", r"\(A\) e \(B\) se cruzando, \(D\) dentro da interseção, e \(C\) envolvendo os dois.",
      [st("Montagem", r"\(A\not\subset B\) e \(B\not\subset A\): círculos que se cruzam (cada um com parte fora do outro). \(D\subset A\cap B\): círculo pequeno na lente. \(C\supset A\cup B\): um conjunto grande em volta de tudo.", None),
       wrap(venn_custom([("C", 140, 108, 98), ("A", 112, 112, 50), ("B", 168, 112, 50), ("D", 140, 118, 14)], size=(280, 215)))]),
]
out.append(page(5, "Iezzi 48–61", "Cardinalidade e problemas (Iezzi, Cap. II)", "Exercícios 48 a 61: inclusão-exclusão, problemas com diagramas, diferença simétrica.", INTRO, L5, [("m7", "Cardinalidade"), ("m5", "Diferença simétrica")]))

def build():
    with open(os.path.join(HERE, "content", "20_listas.html"), "w", encoding="utf-8") as f:
        f.write("\n".join(out))

if __name__ == "__main__":
    build()
