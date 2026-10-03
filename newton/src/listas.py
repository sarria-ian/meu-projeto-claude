"""Gera content/20_listas.html com as listas de exercícios (enunciado, resposta e resolução).
Executado pelo build.py antes de montar a página. As respostas são conferidas por check_listas.py."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))

def st(label, text, m=None):
    h = f'<div class="st"><span class="pl">{label}</span>'
    if text: h += f"<p>{text}</p>"
    if m: h += f'<div class="m">\\[{m}\\]</div>'
    return h + "</div>"

# módulo(s) de teoria de cada exercício (botões "Exercícios deste módulo")
def _r(a, b, mods): return {n: mods for n in range(a, b + 1)}
MODN = {}
for d in (_r(230, 232, "m5 m1"), _r(233, 234, "m5"), _r(235, 237, "m5 m6"), _r(238, 240, "m10 m5"), {241: "m10 m7", 242: "m10 m5", 243: "m10 m7", 244: "m10 m5", 245: "m10 m7"},
          _r(246, 264, "m6"), _r(265, 275, "m6"), _r(276, 278, "m6 m9"), _r(279, 280, "m6 m10"),
          _r(281, 283, "m8"), _r(284, 292, "m7"), {293: "m7 m2"},
          {294: "m4 m3", 295: "m7", 296: "m7", 297: "m3", 298: "m7", 299: "m7", 300: "m7", 301: "m7", 302: "m7", 303: "m7", 304: "m7 m3", 305: "m7 m3", 306: "m7", 307: "m7", 308: "m7 m8", 309: "m7",
           310: "m9 m10", 311: "m9 m10", 312: "m9", 313: "m9", 314: "m4 m3", 315: "m10", 316: "m10", 317: "m7", 318: "m7", 319: "m7 m10", 320: "m6", 321: "m10 m5"},
          _r(322, 328, "m10 m3"), {329: "m10 m4", 330: "m4"}, _r(331, 332, "m7"), _r(333, 335, "m9")):
    MODN.update(d)
MODNAME = {"m1": "Potências", "m2": "Fatorial", "m3": "Combinações", "m4": "Pascal", "m5": "Desenvolvimento", "m6": "Termo geral", "m7": "Somas e maior termo", "m8": "Aplicações", "m9": "Avançado", "m10": "Técnicas do capítulo"}

def item(iid, num, enun, ans, steps=None, extra=""):
    mods = MODN[int(iid.split("-")[1])]
    back = " · ".join(f'<a class="small" href="#{m}">Teoria: Mód. {m[1:]} – {MODNAME[m]}</a>' for m in mods.split())
    h = f'<div class="li" id="ex-{iid}" data-id="{iid}" data-mod="{mods}" data-num-label="{num}"><div class="lh"><span class="ln">{num}</span><span class="lmod">{back}</span></div><div class="enun">{enun}</div>{extra}'
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
INTRO = "Exercícios do Capítulo II (numeração do livro), com resolução própria e comentada. Resolva no caderno antes de abrir a resposta. Depois marque se acertou: isso alimenta o seu progresso."

# ============================================================ LISTA 1 (230-237)
L1 = [
 item("L1-230", "Exercício 230", r"Desenvolva, usando o teorema binomial: a) \((x+3b)^3\) &nbsp; b) \((1-x^2)^5\) &nbsp; c) \((\sqrt x-\sqrt y)^4\) &nbsp; d) \((\operatorname{sen}\theta+\cos\theta)^4\) &nbsp; e) \((3-y)^5\)",
      r"a) \(x^3+9x^2b+27xb^2+27b^3\); b) \(1-5x^2+10x^4-10x^6+5x^8-x^{10}\); c) \(x^2-4x\sqrt{xy}+6xy-4y\sqrt{xy}+y^2\); d) \(\operatorname{sen}^4\theta+4\operatorname{sen}^3\theta\cos\theta+6\operatorname{sen}^2\theta\cos^2\theta+4\operatorname{sen}\theta\cos^3\theta+\cos^4\theta\ (=1+2\operatorname{sen}2\theta+\operatorname{sen}^2 2\theta)\); e) \(243-405y+270y^2-90y^3+15y^4-y^5\)",
      [st("Receita", r"Para \((A+B)^n\): os coeficientes são a linha \(n\) do Triângulo de Pascal; o expoente de \(A\) desce de \(n\) até 0 e o de \(B\) sobe de 0 até \(n\). Para uma diferença, escreva \(A-B=A+(-B)\): os sinais alternam."),
       st("a) linha 3: 1 3 3 1", r"\(A=x\), \(B=3b\).", r"x^3+3x^2(3b)+3x(3b)^2+(3b)^3=x^3+9x^2b+27xb^2+27b^3"),
       st("b) linha 5: 1 5 10 10 5 1", r"\(A=1\), \(B=-x^2\). Potências pares de \(-x^2\) ficam positivas; ímpares, negativas.", r"1-5x^2+10x^4-10x^6+5x^8-x^{10}"),
       st("c) linha 4: 1 4 6 4 1", r"\(A=\sqrt x\), \(B=-\sqrt y\). Use \((\sqrt x)^2=x\), \((\sqrt x)^3=x\sqrt x\).", r"x^2-4x\sqrt x\sqrt y+6xy-4\sqrt x\,y\sqrt y+y^2=x^2-4x\sqrt{xy}+6xy-4y\sqrt{xy}+y^2"),
       st("d) linha 4", r"\(A=\operatorname{sen}\theta\), \(B=\cos\theta\): \(\operatorname{sen}^4\theta+4\operatorname{sen}^3\theta\cos\theta+6\operatorname{sen}^2\theta\cos^2\theta+4\operatorname{sen}\theta\cos^3\theta+\cos^4\theta\)."),
       st("d) bônus: simplificando", r"Antes de expandir: \((\operatorname{sen}\theta+\cos\theta)^2=1+2\operatorname{sen}\theta\cos\theta=1+\operatorname{sen}2\theta\). Logo a 4ª potência é \((1+\operatorname{sen}2\theta)^2\).", r"(1+\operatorname{sen}2\theta)^2=1+2\operatorname{sen}2\theta+\operatorname{sen}^2 2\theta"),
       st("e) linha 5", r"\(A=3\), \(B=-y\).", r"3^5-5\cdot3^4y+10\cdot3^3y^2-10\cdot3^2y^3+5\cdot3y^4-y^5=243-405y+270y^2-90y^3+15y^4-y^5")]),
 item("L1-231", "Exercício 231", r"Desenvolva, usando o teorema binomial, \(\left(m+\dfrac1m\right)^5-\left(m-\dfrac1m\right)^5\).", r"\(10m^3+\dfrac{20}{m}+\dfrac{2}{m^5}\)",
      [st("Ideia", r"Os dois desenvolvimentos têm os mesmos termos; só muda o sinal dos termos com potência <b>ímpar</b> de \(\frac1m\). Na subtração, os termos de potência par se cancelam e os de potência ímpar dobram."),
       st("Termos com potência ímpar de 1/m", "", r"\binom51m^4\tfrac1m=5m^3,\quad \binom53m^2\tfrac1{m^3}=\tfrac{10}{m},\quad \binom55\tfrac1{m^5}=\tfrac1{m^5}"),
       st("Resultado", "", r"2\left(5m^3+\tfrac{10}m+\tfrac1{m^5}\right)=10m^3+\tfrac{20}{m}+\tfrac{2}{m^5}")]),
 item("L1-232", "Exercício 232", r"Desenvolva \((x+a)^7\).", r"\(x^7+7x^6a+21x^5a^2+35x^4a^3+35x^3a^4+21x^2a^5+7xa^6+a^7\)",
      [st("Linha 7 de Pascal", r"Da linha 6 (1 6 15 20 15 6 1), somando vizinhos (Stifel): 1 7 21 35 35 21 7 1."),
       st("Monte", r"Expoente de \(x\) de 7 a 0, de \(a\) de 0 a 7; a soma dos expoentes é sempre 7.", r"x^7+7x^6a+21x^5a^2+35x^4a^3+35x^3a^4+21x^2a^5+7xa^6+a^7")]),
 item("L1-233", "Exercício 233", r"Calcule \(a\) e \(b\), sabendo que \((a+b)^3=64\) e que \(a^5-\binom51a^4b+\binom52a^3b^2-\binom53a^2b^3+\binom54ab^4-b^5=-32\).", r"\(a=1\), \(b=3\)",
      [st("Reconheça o binômio", r"Coeficientes da linha 5 com sinais alternados: é \((a-b)^5\).", r"(a-b)^5=-32=(-2)^5\Rightarrow a-b=-2"),
       st("Primeira equação", "", r"(a+b)^3=64=4^3\Rightarrow a+b=4"),
       st("Sistema", r"Somando: \(2a=2\Rightarrow a=1\); então \(b=3\). Conferindo: \(4^3=64\) e \((-2)^5=-32\) ✓")]),
 item("L1-234", "Exercício 234", r"Quantos termos tem o desenvolvimento de a) \((x+y)^7\)? b) \((x+y)^{10}\)? c) \((x+y)^n\)?", r"a) 8 &nbsp; b) 11 &nbsp; c) \(n+1\)",
      [st("Por quê", r"Os termos correspondem a \(p=0,1,2,\dots,n\) (o expoente de \(y\)). De 0 até \(n\) há \(n+1\) números. Logo: 8, 11 e \(n+1\).")]),
 item("L1-235", "Exercício 235", r"a) Quantos termos tem o desenvolvimento de \((x+a)^{50}\)? b) Escreva os 4 primeiros termos, sem os coeficientes, em potências de expoentes decrescentes de \(x\).", r"a) 51 &nbsp; b) \(x^{50},\ x^{49}a,\ x^{48}a^2,\ x^{47}a^3\)",
      [st("a)", r"\(n+1=51\)."), st("b)", r"O expoente de \(x\) começa em 50 e desce de 1 em 1; o de \(a\) sobe. Sempre somam 50.")]),
 item("L1-236", "Exercício 236", r"No desenvolvimento de \((x+y)^{1000}\), qual o centésimo termo, se o desenvolvimento for feito em potências de expoentes decrescentes de \(x\)?", r"\(T_{100}=\binom{1000}{99}x^{901}y^{99}\)",
      [st("Posição × p", r"O termo de posição \(k\) é \(T_k=T_{p+1}\) com \(p=k-1\). Para o 100º termo, \(p=99\)."),
       st("Termo geral", "", r"T_{p+1}=\binom{1000}{p}x^{1000-p}y^{p}\Rightarrow T_{100}=\binom{1000}{99}x^{901}y^{99}")]),
 item("L1-237", "Exercício 237", r"Quais os 3 primeiros termos do desenvolvimento de \((x+y)^{100}\) segundo as potências de expoentes decrescentes de \(x\)?", r"\(x^{100},\ 100x^{99}y,\ 4950x^{98}y^2\)",
      [st("p = 0, 1, 2", "", r"\binom{100}0=1,\quad\binom{100}1=100,\quad\binom{100}2=\frac{100\cdot99}{2}=4950")]),
]
out.append(page(1, "Desenvolvimento (230–237)", "Teorema binomial: desenvolvendo (x + a)ⁿ", "Exercícios 230 a 237: desenvolvimentos, número de termos e termos de uma posição.", INTRO, L1, [("m5", "Binômio de Newton"), ("m4", "Pascal")]))

# ============================================================ LISTA 2 (238-245)
L2 = [
 item("L2-238", "Exercício 238", r"Sabendo que \(a^5+\binom51a^4b+\binom52a^3b^2+\binom53a^2b^3+\binom54ab^4+b^5=1024\), calcule o valor de \((a+b)^2\).", r"\(16\)",
      [st("Reconheça", r"É exatamente o desenvolvimento de \((a+b)^5\)."), st("Resolva", "", r"(a+b)^5=1024=4^5\Rightarrow a+b=4\Rightarrow (a+b)^2=16")]),
 item("L2-239", "Exercício 239", r"Determine o valor de \(99^5+5\cdot99^4+10\cdot99^3+10\cdot99^2+5\cdot99+1\).", r"\(10^{10}=10\,000\,000\,000\)",
      [st("Coeficientes 1 5 10 10 5 1", r"São os da linha 5, com \(x=99\) descendo e o outro termo igual a 1 (e \(1^k=1\) “some”)."),
       st("Feche o binômio", "", r"(99+1)^5=100^5=10^{10}")]),
 item("L2-240", "Exercício 240", r"Calcule o valor numérico de \(x^4-4x^3y+6x^2y^2-4xy^3+y^4\) para \(x=\dfrac{1+\sqrt6}{\sqrt[4]5}\) e \(y=\dfrac{\sqrt6-1}{\sqrt[4]5}\).", r"\(\dfrac{16}{5}\)",
      [st("Reconheça", r"Linha 4 com sinais alternados: o polinômio é \((x-y)^4\)."),
       st("Calcule x − y primeiro", r"Os \(\sqrt6\) se cancelam.", r"x-y=\frac{(1+\sqrt6)-(\sqrt6-1)}{\sqrt[4]5}=\frac{2}{\sqrt[4]5}"),
       st("Eleve à 4ª", "", r"(x-y)^4=\frac{2^4}{(\sqrt[4]5)^4}=\frac{16}{5}")]),
 item("L2-241", "Exercício 241", r"Calcule \(S=\binom{20}0+\binom{20}1 2+\binom{20}2 2^2+\dots+\binom{20}{19}2^{19}+\binom{20}{20}2^{20}\).", r"\(3^{20}\)",
      [st("Compare com o teorema", r"\((1+2)^{20}=\sum\binom{20}{p}1^{20-p}2^p\): é exatamente \(S\)."), st("Resultado", "", r"S=(1+2)^{20}=3^{20}")]),
 item("L2-242", "Exercício 242", r"Calcule \((1-\sqrt5)^5-(1+\sqrt5)^5\).", r"\(-160\sqrt5\)",
      [st("Ideia", r"Na diferença, termos com potência par de \(\sqrt5\) se cancelam; os de potência ímpar aparecem dobrados e com sinal de menos."),
       st("Potências ímpares de √5 em (1+√5)⁵", "", r"\binom51\sqrt5+\binom53(\sqrt5)^3+\binom55(\sqrt5)^5=5\sqrt5+50\sqrt5+25\sqrt5=80\sqrt5"),
       st("Resultado", "", r"(1-\sqrt5)^5-(1+\sqrt5)^5=-2\cdot80\sqrt5=-160\sqrt5")]),
 item("L2-243", "Exercício 243", r"Calcule o valor de \(x^n+\binom n1x^{n-1}y+\binom n2x^{n-2}y^2+\dots+y^n\) para \(x=y=1\).", r"\(2^n\)",
      [st("Reconheça e substitua", "", r"(x+y)^n\big|_{x=y=1}=(1+1)^n=2^n")]),
 item("L2-244", "Exercício 244", r"Calcule \(S=(x^3-1)^4+4(x^3-1)^3+6(x^3-1)^2+4(x^3-1)+1\).", r"\(S=x^{12}\)",
      [st("Troca de variável", r"Chame \(t=x^3-1\). Então \(S=t^4+4t^3+6t^2+4t+1\), linha 4 de Pascal.", r"S=(t+1)^4=(x^3-1+1)^4=(x^3)^4=x^{12}")]),
 item("L2-245", "Exercício 245", r"Qual é o valor de \(\displaystyle\sum_{x=0}^{n}\binom nx 2^x3^{n-x}\)?", r"\(5^n\)",
      [st("Leitura do Σ", r"Cada parcela é \(\binom nx\,3^{n-x}2^x\): o termo geral de \((3+2)^n\) (aqui \(x\) é só o índice da soma)."), st("Resultado", "", r"(3+2)^n=5^n")]),
]
out.append(page(2, "Reconhecer binômios (238–245)", "Reconhecendo um binômio escondido", "Exercícios 238 a 245: “fechar” somas no formato do teorema binomial.", INTRO, L2, [("m5", "Binômio de Newton"), ("m7", "Somas")]))
# ============================================================ LISTA 3 (246-264)
TG = st("Ferramenta", r"Termo geral de \((A+B)^n\): \(\;T_{p+1}=\binom np A^{\,n-p}B^{\,p}\), \(p=0,1,\dots,n\). Roteiro: (1) escreva \(T_{p+1}\); (2) junte as potências de \(x\); (3) iguale o expoente ao pedido e ache \(p\); (4) substitua \(p\).")
L3 = [
 item("L3-246", "Exercício 246", r"Qual o coeficiente de \(x^2\) no desenvolvimento de \((1-2x)^6\)?", r"\(60\)",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom6p1^{6-p}(-2x)^p=\binom6p(-2)^px^p"), st("Impor x²", r"\(p=2\).", r"\binom62(-2)^2=15\cdot4=60")]),
 item("L3-247", "Exercício 247", r"Desenvolvendo \((x+3y)^9\), qual o termo que contém \(x^4\)?", r"\(30\,618\,x^4y^5\)",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom9px^{9-p}(3y)^p"), st("Impor x⁴", r"\(9-p=4\Rightarrow p=5\).", r"\binom95x^4(3y)^5=126\cdot243\,x^4y^5=30\,618\,x^4y^5")]),
 item("L3-248", "Exercício 248", r"No desenvolvimento de \((1-2x^2)^5\), qual o coeficiente de \(x^8\)?", r"\(80\)",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom5p(-2x^2)^p=\binom5p(-2)^px^{2p}"), st("Impor x⁸", r"\(2p=8\Rightarrow p=4\).", r"\binom54(-2)^4=5\cdot16=80")]),
 item("L3-249", "Exercício 249", r"Qual o coeficiente de \(x^6\) no desenvolvimento de \((x^2+x^{-3})^8\)?", r"\(28\)",
      [TG, st("Termo geral", r"Some os expoentes (propriedade \(x^ax^b=x^{a+b}\)).", r"T_{p+1}=\binom8p(x^2)^{8-p}(x^{-3})^p=\binom8px^{16-2p-3p}=\binom8px^{16-5p}"),
       st("Impor x⁶", r"\(16-5p=6\Rightarrow p=2\).", r"\binom82=28")]),
 item("L3-250", "Exercício 250", r"Qual o termo em \(x^3\) no desenvolvimento de \(\left(x-\dfrac{a^2}{x}\right)^{15}\)?", r"\(5005\,a^{12}x^3\)",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom{15}px^{15-p}\left(-\frac{a^2}{x}\right)^p=\binom{15}p(-1)^pa^{2p}x^{15-2p}"),
       st("Impor x³", r"\(15-2p=3\Rightarrow p=6\) (par, sinal +).", r"\binom{15}6a^{12}x^3=5005\,a^{12}x^3")]),
 item("L3-251", "Exercício 251", r"Qual o termo em \(x^3\) no desenvolvimento de \(\left(\sqrt x-\dfrac{a^2}{x}\right)^{15}\)?", r"\(-455\,a^6x^3\)",
      [TG, st("Termo geral", r"Use \(\sqrt x=x^{1/2}\).", r"T_{p+1}=\binom{15}p x^{\frac{15-p}2}(-1)^pa^{2p}x^{-p}=\binom{15}p(-1)^pa^{2p}x^{\frac{15-3p}{2}}"),
       st("Impor x³", r"\(\frac{15-3p}2=3\Rightarrow 15-3p=6\Rightarrow p=3\) (ímpar, sinal −).", r"-\binom{15}3a^6x^3=-455\,a^6x^3")]),
 item("L3-252", "Exercício 252", r"Determine o coeficiente numérico do termo de 4º grau do desenvolvimento de \((x-2)^7\).", r"\(-280\)",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom7px^{7-p}(-2)^p"), st("Grau 4", r"\(7-p=4\Rightarrow p=3\).", r"\binom73(-2)^3=35\cdot(-8)=-280")]),
 item("L3-253", "Exercício 253", r"Qual é o coeficiente do termo que contém o fator \(y^4\) no desenvolvimento de \(\left(\dfrac12x^2-y\right)^{10}\)?", r"\(\dfrac{105}{32}\) (o termo é \(\frac{105}{32}x^{12}y^4\))",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom{10}p\left(\tfrac12x^2\right)^{10-p}(-y)^p"), st("Impor y⁴", r"\(p=4\).", r"\binom{10}4\left(\tfrac12\right)^6x^{12}y^4=\frac{210}{64}x^{12}y^4=\frac{105}{32}x^{12}y^4")]),
 item("L3-254", "Exercício 254", r"Qual é o coeficiente numérico do termo de grau 1 em \(x\), no desenvolvimento de \(\left(x+\dfrac2x\right)^6\)?", r"Não existe tal termo (coeficiente 0).",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom6px^{6-p}\left(\frac2x\right)^p=\binom6p2^px^{6-2p}"),
       st("Impor grau 1", r"\(6-2p=1\Rightarrow p=\frac52\), que não é inteiro."), st("Conclusão", r"Os expoentes \(6-2p\) são todos pares (6, 4, 2, 0, −2, …). Não há termo em \(x^1\): o coeficiente é 0.")]),
 item("L3-255", "Exercício 255", r"Determine o coeficiente de \(x^5\) no desenvolvimento de \(\left(1-\dfrac23x\right)^6\).", r"\(-\dfrac{64}{81}\)",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom6p\left(-\tfrac23\right)^px^p"), st("p = 5", "", r"6\cdot\left(-\frac{32}{243}\right)=-\frac{192}{243}=-\frac{64}{81}")]),
 item("L3-256", "Exercício 256", r"Obtenha o coeficiente do termo em \(x^{-3}\) no desenvolvimento de \(\left[\sqrt x+\dfrac1x\right]^6\).", r"\(15\)",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom6px^{\frac{6-p}2}x^{-p}=\binom6px^{\frac{6-3p}2}"), st("Impor x⁻³", r"\(\frac{6-3p}2=-3\Rightarrow6-3p=-6\Rightarrow p=4\).", r"\binom64=15")]),
 item("L3-257", "Exercício 257", r"Qual é o coeficiente do termo em \(x^2\) de \(\left(\dfrac{2x}3-\dfrac3{2x}\right)^{12}\)?", r"\(-352\)",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom{12}p\left(\tfrac23\right)^{12-p}\left(-\tfrac32\right)^px^{12-2p}"),
       st("Impor x²", r"\(12-2p=2\Rightarrow p=5\).", r"\binom{12}5\left(\tfrac23\right)^7\left(-\tfrac32\right)^5=-792\cdot\frac{2^7}{3^7}\cdot\frac{3^5}{2^5}=-792\cdot\frac{2^2}{3^2}=-792\cdot\frac49=-352")]),
 item("L3-258", "Exercício 258", r"No desenvolvimento de \((x+a)^{100}\), qual o coeficiente do termo que contém \(x^{60}\)?", r"\(\binom{100}{40}\ \left(=\binom{100}{60}\right)\)",
      [TG, st("Impor x⁶⁰", r"\(100-p=60\Rightarrow p=40\). Coeficiente \(\binom{100}{40}\), igual a \(\binom{100}{60}\) (complementares).")]),
 item("L3-259", "Exercício 259", r"Qual é o coeficiente do termo médio de \((x^3+y^2)^{10}\)?", r"\(252\) (termo \(252x^{15}y^{10}\))",
      [st("Termo médio", r"São \(11\) termos (\(n+1\)); o do meio é o 6º, isto é, \(p=5\)."), st("Calcule", "", r"\binom{10}5(x^3)^5(y^2)^5=252x^{15}y^{10}")]),
 item("L3-260", "Exercício 260", r"Qual o termo independente de \(y\) no desenvolvimento de \(\left(y+\dfrac1y\right)^4\)?", r"\(6\)",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom4py^{4-2p}"), st("Expoente zero", r"\(4-2p=0\Rightarrow p=2\): \(\binom42=6\).")]),
 item("L3-261", "Exercício 261", r"Qual o termo independente de \(x\) no desenvolvimento de \(\left(x+\dfrac1x\right)^{2n}\)?", r"\(\binom{2n}{n}=\dfrac{(2n)!}{(n!)^2}\)",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom{2n}px^{2n-2p}"), st("Expoente zero", r"\(p=n\): \(\binom{2n}n=\frac{(2n)!}{n!\,n!}\).")]),
 item("L3-262", "Exercício 262", r"Qual o termo independente de \(x\) no desenvolvimento de \(\left(-x+\dfrac{\sqrt2}x\right)^8\)?", r"\(280\)",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom8p(-x)^{8-p}\left(\frac{\sqrt2}x\right)^p=\binom8p(-1)^{8-p}(\sqrt2)^px^{8-2p}"),
       st("Expoente zero", r"\(p=4\).", r"\binom84(-1)^4(\sqrt2)^4=70\cdot4=280")]),
 item("L3-263", "Exercício 263", r"Calcule o termo independente de \(x\) no desenvolvimento de \(\left(\dfrac1{x^2}-\sqrt[4]x\right)^{18}\).", r"\(153\)",
      [TG, st("Termo geral", r"\(\frac1{x^2}=x^{-2}\) e \(\sqrt[4]x=x^{1/4}\).", r"T_{p+1}=\binom{18}px^{-2(18-p)}(-1)^px^{p/4}=\binom{18}p(-1)^px^{-36+2p+\frac p4}"),
       st("Expoente zero", r"\(-36+\frac{9p}4=0\Rightarrow p=16\).", r"\binom{18}{16}(-1)^{16}=\binom{18}2=153")]),
 item("L3-264", "Exercício 264", r"Obtenha o termo independente de \(x\) no desenvolvimento de \(\left(x+\dfrac2{5x}\right)^8\).", r"\(\dfrac{224}{125}\)",
      [TG, st("Termo geral", "", r"T_{p+1}=\binom8p\left(\tfrac25\right)^px^{8-2p}"), st("p = 4", "", r"70\cdot\frac{16}{625}=\frac{1120}{625}=\frac{224}{125}")]),
]
out.append(page(3, "Termo geral I (246–264)", "Termo geral: coeficientes e termo independente", "Exercícios 246 a 264: o termo que contém xᵏ, termo médio e termo independente.", INTRO, L3, [("m6", "Termo geral")]))
# ============================================================ LISTA 4 (265-280)
L4 = [
 item("L4-265", "Exercício 265", r"Um dos termos no desenvolvimento de \((x+3a)^5\) é \(360x^3\). Sabendo que \(a\) não depende de \(x\), determine \(a\).", r"\(a=2\) ou \(a=-2\)",
      [TG, st("Termo com x³", r"\(5-p=3\Rightarrow p=2\).", r"\binom52x^3(3a)^2=10\cdot9a^2x^3=90a^2x^3"),
       st("Iguale", "", r"90a^2=360\Rightarrow a^2=4\Rightarrow a=\pm2")]),
 item("L4-266", "Exercício 266", r"Determine \(a\) de modo que um dos termos do desenvolvimento de \((x+a)^5\) seja \(270x^2\).", r"\(a=3\)",
      [st("Termo com x²", r"\(5-p=2\Rightarrow p=3\).", r"\binom53x^2a^3=10a^3x^2"), st("Iguale", r"\(10a^3=270\Rightarrow a^3=27\Rightarrow a=3\) (única raiz real).")]),
 item("L4-267", "Exercício 267", r"Qual é o termo independente de \(x\) no desenvolvimento de \(\left(x-\dfrac1x\right)^{517}\)?", r"Não existe (o termo independente é 0).",
      [st("Termo geral", "", r"T_{p+1}=\binom{517}p(-1)^px^{517-2p}"), st("Expoente zero", r"\(517-2p=0\Rightarrow p=258{,}5\), não inteiro. Como 517 é ímpar, \(517-2p\) é sempre ímpar e nunca zera.")]),
 item("L4-268", "Exercício 268", r"Que posição ocupa o termo independente de \(x\) no desenvolvimento de \((3+6x^2)^{11}\), se o desenvolvimento for em potências de expoentes decrescentes de \(x\)?", r"12ª posição (o último termo, \(3^{11}\))",
      [st("Ordene", r"Decrescente em \(x\) significa começar por \((6x^2)^{11}\). Escreva \((6x^2+3)^{11}\).", r"T_{p+1}=\binom{11}p(6x^2)^{11-p}3^p\quad(\text{expoente }22-2p)"),
       st("Expoente zero", r"\(22-2p=0\Rightarrow p=11\Rightarrow\) posição \(p+1=12\): é o último termo, \(3^{11}\).")]),
 item("L4-269", "Exercício 269", r"Qual a condição sobre \(n\) para que o desenvolvimento de \(\left(x+\dfrac1{x^2}\right)^n\) tenha termo independente de \(x\)?", r"\(n\) múltiplo de 3",
      [st("Termo geral", "", r"T_{p+1}=\binom npx^{n-p}x^{-2p}=\binom npx^{n-3p}"), st("Expoente zero", r"\(n-3p=0\Rightarrow p=\frac n3\). Precisamos de \(p\) inteiro entre 0 e \(n\): \(n\) deve ser múltiplo de 3.")]),
 item("L4-270", "Exercício 270", r"No desenvolvimento de \(\left(x+\dfrac1x\right)^{2n+1}\), \(n\in\mathbb N^*\), existe um termo que não depende de \(x\)?", r"Não.",
      [st("Termo geral", "", r"T_{p+1}=\binom{2n+1}px^{2n+1-2p}"), st("Paridade", r"\(2n+1-2p\) é ímpar para todo \(p\) inteiro, logo nunca é 0. Não existe termo independente.")]),
 item("L4-271", "Exercício 271", r"O quarto termo do desenvolvimento de \((2x-3y)^n\) é \(-1080x^2y^3\). Calcule o terceiro termo.", r"\(T_3=720x^3y^2\)",
      [st("4º termo: p = 3", "", r"T_4=\binom n3(2x)^{n-3}(-3y)^3=-27\binom n3 2^{n-3}x^{n-3}y^3"),
       st("Compare os expoentes de x", r"\(n-3=2\Rightarrow n=5\). Confira o número: \(-27\cdot10\cdot4=-1080\) ✓."),
       st("3º termo: p = 2", "", r"T_3=\binom52(2x)^3(-3y)^2=10\cdot8\cdot9\,x^3y^2=720x^3y^2")]),
 item("L4-272", "Exercício 272", r"Os três primeiros coeficientes do desenvolvimento de \(\left(x^2+\dfrac1{2x}\right)^n\) estão em PA. Determine \(n\).", r"\(n=8\)",
      [st("Três primeiros coeficientes", "", r"\binom n0=1,\qquad\binom n1\tfrac12=\tfrac n2,\qquad\binom n2\tfrac14=\tfrac{n(n-1)}8"),
       st("Condição de PA", r"O termo do meio é a média dos vizinhos: \(2b=a+c\).", r"2\cdot\frac n2=1+\frac{n(n-1)}8\iff 8n=8+n^2-n\iff n^2-9n+8=0"),
       st("Raízes", r"\(n=1\) ou \(n=8\). Com \(n=1\) só há 2 termos, então \(n=8\).")]),
 item("L4-273", "Exercício 273", r"Os coeficientes do 5º, 6º e 7º termos de \((1+x)^n\) estão em PA. Se \(n\le10\), calcule \(2n-1\).", r"\(13\) (\(n=7\))",
      [st("Coeficientes", r"\(T_5,T_6,T_7\) têm \(p=4,5,6\): \(\binom n4,\binom n5,\binom n6\)."),
       st("PA", r"Divida tudo por \(\binom n5\) usando \(\binom n4=\binom n5\frac5{n-4}\) e \(\binom n6=\binom n5\frac{n-5}6\):", r"2=\frac5{n-4}+\frac{n-5}6\iff 12(n-4)=30+(n-5)(n-4)\iff n^2-21n+98=0"),
       st("Raízes", r"\(n=7\) ou \(n=14\). Como \(n\le10\): \(n=7\) e \(2n-1=13\). Confira: 35, 21, 7 está em PA (razão −14) ✓.")]),
 item("L4-274", "Exercício 274", r"Em \((a+b)^{n+5}\), ordenado em potências decrescentes de \(a\), tem-se \(\dfrac{T_{n+3}}{T_{n+1}}=\dfrac{2b^2}{3a^2}\). Determine \(n\).", r"\(n=4\)",
      [st("Os dois termos", r"Com \(N=n+5\): \(T_{n+3}\) tem \(p=n+2\) e \(T_{n+1}\) tem \(p=n\).", r"\frac{T_{n+3}}{T_{n+1}}=\frac{\binom N{n+2}a^{N-n-2}b^{n+2}}{\binom Nna^{N-n}b^n}=\frac{\binom N{n+2}}{\binom Nn}\cdot\frac{b^2}{a^2}"),
       st("Razão dos binomiais", "", r"\frac{\binom N{n+2}}{\binom Nn}=\frac{(N-n)(N-n-1)}{(n+1)(n+2)}=\frac{5\cdot4}{(n+1)(n+2)}"),
       st("Iguale a 2/3", "", r"\frac{20}{(n+1)(n+2)}=\frac23\iff(n+1)(n+2)=30=5\cdot6\Rightarrow n=4")]),
 item("L4-275", "Exercício 275", r"Qual é o produto do terceiro pelo antepenúltimo termo do desenvolvimento de \(\left(x+\dfrac1x\right)^n\)?", r"\(\binom n2^2=\left[\dfrac{n(n-1)}2\right]^2\)",
      [st("Posições", r"São \(n+1\) termos. Terceiro: \(p=2\). Antepenúltimo = 3º de trás para frente: \(p=n-2\)."),
       st("Os termos", "", r"T_3=\binom n2x^{n-4},\qquad T_{n-1}=\binom n{n-2}x^{n-2(n-2)}=\binom n2x^{4-n}"),
       st("Produto", r"Os expoentes se anulam: \(\binom n2^2\).")]),
 item("L4-276", "Exercício 276", r"Qual o coeficiente de \(x^{n+1}\) no desenvolvimento de \((x+2)^n\cdot x^3\)?", r"\(4\binom n2=2n(n-1)\)",
      [st("Ideia", r"Multiplicar por \(x^3\) só soma 3 aos expoentes. Precisamos de \(x^{n-2}\) dentro de \((x+2)^n\)."),
       st("Termo geral", r"\(\binom npx^{n-p}2^p\) com \(n-p=n-2\Rightarrow p=2\).", r"\binom n2\cdot4=2n(n-1)")]),
 item("L4-277", "Exercício 277", r"Determine o coeficiente de \(a^{n+1-p}b^p\) no produto de \(a^k+\binom k1a^{k-1}b+\dots+\binom kpa^{k-p}b^p+\dots+b^k\) por \((a+b)\), para \(k=n\).", r"\(\binom{n+1}p\ \left(=\binom np+\binom n{p-1}\right)\)",
      [st("Reconheça", r"O primeiro fator é \((a+b)^n\). O produto é \((a+b)^{n+1}\)."),
       st("Coeficiente", r"Em \((a+b)^{n+1}\) o termo \(a^{n+1-p}b^p\) tem coeficiente \(\binom{n+1}p\). Pelo caminho direto, \(a^{n+1-p}b^p\) surge de \(\binom npa^{n-p}b^p\cdot a\) e de \(\binom n{p-1}a^{n-p+1}b^{p-1}\cdot b\): é a relação de Stifel.")]),
 item("L4-278", "Exercício 278", r"Qual o termo independente de \(x\) em \(\left(x+\dfrac1x\right)^6\cdot\left(x-\dfrac1x\right)^6\)?", r"\(-20\)",
      [st("Junte as bases", r"\(A^6B^6=(AB)^6\) e \(\left(x+\frac1x\right)\left(x-\frac1x\right)=x^2-\frac1{x^2}\).", r"\left(x^2-x^{-2}\right)^6"),
       st("Termo geral", "", r"\binom6p(x^2)^{6-p}(-1)^px^{-2p}=\binom6p(-1)^px^{12-4p}"),
       st("p = 3", "", r"\binom63(-1)^3=-20")]),
 item("L4-279", "Exercício 279", r"Quantos termos racionais tem o desenvolvimento de \(\left(\sqrt2+\sqrt[3]3\right)^{100}\)?", r"17",
      [st("Termo geral", "", r"T_{p+1}=\binom{100}p2^{\frac{100-p}2}3^{\frac p3}"),
       st("Quando é racional", r"Precisa \(\frac{100-p}2\) inteiro (\(p\) par) e \(\frac p3\) inteiro (\(p\) múltiplo de 3). Logo \(p\) múltiplo de 6."),
       st("Conte", r"\(p\in\{0,6,12,\dots,96\}\): \(\frac{96}6+1=17\) termos.")]),
 item("L4-280", "Exercício 280", r"Qual o número de termos racionais no desenvolvimento de \(\left(2\sqrt3+\sqrt5\right)^{10}\)?", r"6",
      [st("Termo geral", "", r"T_{p+1}=\binom{10}p2^{10-p}3^{\frac{10-p}2}5^{\frac p2}"),
       st("Condição", r"\(p\) par (então \(10-p\) também é par): \(p\in\{0,2,4,6,8,10\}\): 6 termos.")]),
]
out.append(page(4, "Termo geral II (265–280)", "Termo geral: parâmetros, posições e termos racionais", "Exercícios 265 a 280: descobrir a, n e posições; produtos de binômios; termos racionais.", INTRO, L4, [("m6", "Termo geral"), ("m10", "Técnicas do capítulo")]))
# ============================================================ LISTA 5 (281-293)
SC = st("Ferramenta", r"A soma dos coeficientes de um polinômio \(P(x,y)\) é \(P(1,1)\): basta trocar todas as letras por 1, sem desenvolver nada.")
L5 = [
 item("L5-281", "Exercício 281", r"Calcule aproximadamente \((1{,}002)^{20}\), usando o teorema binomial.", r"\(\approx1{,}04\) (valor exato \(\approx1{,}0408\))",
      [st("Aproximação", r"Para \(nx\) pequeno, a partir do 3º termo tudo é muito menor que \(nx\).", r"(1+x)^n=1+nx+\binom n2x^2+\dots\approx1+nx"),
       st("Aplique", "", r"(1+0{,}002)^{20}\approx1+20\cdot0{,}002=1{,}04"),
       st("Quanto erramos?", r"O 3º termo é \(\binom{20}2(0{,}002)^2=190\cdot0{,}000004=0{,}00076\). Com ele: \(1{,}04076\), bem perto de 1,0408.")]),
 item("L5-282", "Exercício 282", r"Calcule aproximadamente: a) \((1{,}002)^{10}\) &nbsp; b) \((0{,}997)^{20}\)", r"a) \(\approx1{,}02\) &nbsp; b) \(\approx0{,}94\)",
      [st("a)", "", r"1+10\cdot0{,}002=1{,}02"), st("b)", r"\(0{,}997=1+(-0{,}003)\).", r"1+20\cdot(-0{,}003)=1-0{,}06=0{,}94"),
       st("Conferência", r"Valores exatos: 1,0202 e 0,9417.")]),
 item("L5-283", "Exercício 283", r"Usando o binômio de Newton, determine a aproximação, a menos de um centésimo, de \((1{,}003)^{20}\).", r"\(\approx1{,}06\)",
      [st("Três termos", "", r"1+20(0{,}003)+190(0{,}003)^2=1+0{,}06+0{,}00171=1{,}06171"),
       st("Arredonde", r"Os termos seguintes são da ordem de \(10^{-5}\). Na casa dos centésimos: \(1{,}06\).")]),
 item("L5-284", "Exercício 284", r"Qual a soma dos coeficientes dos termos do desenvolvimento de \((2x+3y)^4\)?", r"\(625\)",
      [SC, st("x = y = 1", "", r"(2+3)^4=5^4=625")]),
 item("L5-285", "Exercício 285", r"Qual a soma dos coeficientes de a) \((3x+2y)^{10}\)? b) \((5x+y)^8\)?", r"a) \(5^{10}=9\,765\,625\) &nbsp; b) \(6^8=1\,679\,616\)",
      [SC, st("a)", "", r"(3+2)^{10}=5^{10}"), st("b)", "", r"(5+1)^8=6^8")]),
 item("L5-286", "Exercício 286", r"Indique a soma dos coeficientes de \((4x+3y)^4\) sem efetuar o desenvolvimento.", r"\(7^4=2401\)", [SC, st("Conta", "", r"(4+3)^4=7^4=2401")]),
 item("L5-287", "Exercício 287", r"Qual a soma dos coeficientes de a) \((x-y)^5\)? b) \((3x-y)^4\)?", r"a) \(0\) &nbsp; b) \(16\)",
      [SC, st("a)", r"\((1-1)^5=0\). Os coeficientes \(1,-5,10,-10,5,-1\) somam mesmo 0."), st("b)", "", r"(3-1)^4=2^4=16")]),
 item("L5-288", "Exercício 288", r"Ao desenvolver \((5x+2y)^5\), determine a soma dos coeficientes numéricos.", r"\(7^5=16\,807\)", [SC, st("Conta", "", r"(5+2)^5=7^5=16\,807")]),
 item("L5-289", "Exercício 289", r"Determine \(p\), sabendo que a soma dos coeficientes numéricos de \((x+a)^p\) é 512.", r"\(p=9\)",
      [SC, st("Equação", "", r"(1+1)^p=2^p=512=2^9\Rightarrow p=9")]),
 item("L5-290", "Exercício 290", r"\((2x-y)^4=a_1x^4+a_2x^3y+a_3x^2y^2+a_4xy^3+a_5y^4\). Calcule \(\sum_{i=1}^5a_i\).", r"\(1\)",
      [SC, st("x = y = 1", "", r"\sum a_i=(2-1)^4=1")]),
 item("L5-291", "Exercício 291", r"A soma dos coeficientes dos termos de ordem ímpar de \((x-y)^n\) é 256. Determine \(n\).", r"\(n=9\)",
      [st("Quem são", r"Termos de ordem ímpar (1º, 3º, 5º, …) têm \(p=0,2,4,\dots\): coeficientes \(\binom n0,\binom n2,\dots\), todos positivos (pois \((-1)^{\text{par}}=1\))."),
       st("Fato", r"Somas dos binomiais de índice par e de índice ímpar são iguais (a diferença é \((1-1)^n=0\)) e somam \(2^n\). Cada uma vale \(2^{n-1}\)."),
       st("Equação", "", r"2^{n-1}=256=2^8\Rightarrow n=9")]),
 item("L5-292", "Exercício 292", r"Sendo 1024 a soma dos coeficientes do desenvolvimento de \((3x+1)^m\), calcule \(m\).", r"\(m=5\)",
      [SC, st("Equação", "", r"(3+1)^m=4^m=1024=4^5\Rightarrow m=5")]),
 item("L5-293", "Exercício 293", r"A soma dos coeficientes de \((a+b)^m\) é 256. Calcule o número de permutações de \(\frac m2\) elementos.", r"\(24\)",
      [SC, st("Ache m", "", r"2^m=256\Rightarrow m=8"), st("Permutações", "", r"P_{4}=4!=24")]),
]
out.append(page(5, "Aproximações e somas (281–293)", "Aproximações e soma dos coeficientes", "Exercícios 281 a 293: (1+x)ⁿ ≈ 1+nx e o truque de trocar as letras por 1.", INTRO, L5, [("m8", "Aproximações"), ("m7", "Soma dos coeficientes")]))
# ============================================================ LISTA 6 (294-321)
L6 = [
 item("L6-294", "Exercício 294", r"V ou F: a) \(\binom00=0\) &nbsp; b) \(\binom88=1\) &nbsp; c) \(\binom40=\binom44\) &nbsp; d) \(\binom85+\binom84=\binom95\) &nbsp; e) \(\binom74=\binom73\) &nbsp; f) \(\binom80=\binom{15}0\)", r"a) F &nbsp; b) V &nbsp; c) V &nbsp; d) V &nbsp; e) V &nbsp; f) V",
      [st("a) F", r"\(\binom00=\frac{0!}{0!\,0!}=1\) (lembre: \(0!=1\))."), st("b), c), f) V", r"\(\binom nn=\binom n0=1\) para todo \(n\)."),
       st("d) V — Stifel", r"Vizinhos da linha 8 somam o elemento abaixo, na linha 9, na coluna da direita: \(\binom84+\binom85=\binom95\) (56 + 70 = 126)."),
       st("e) V — complementares", r"\(4+3=7\), logo \(\binom74=\binom73=35\).")]),
 item("L6-295", "Exercício 295", r"Demonstre que \(\binom n0+\binom n1+\dots+\binom nn=2^n\), \(\forall n\in\mathbb N\).", r"Desenvolva \((1+1)^n\).",
      [st("Prova algébrica", "", r"2^n=(1+1)^n=\sum_{i=0}^n\binom ni1^{n-i}1^i=\sum_{i=0}^n\binom ni"),
       st("Prova por contagem", r"\(\binom ni\) conta os subconjuntos com \(i\) elementos de um conjunto com \(n\) elementos; somando em \(i\), contamos todos os subconjuntos. E há \(2^n\) deles: cada elemento “entra ou não entra”.")]),
 item("L6-296", "Exercício 296", r"Calcule \(\binom40+\binom41+\binom42+\binom43+\binom44\).", r"\(16\)", [st("Use 295", r"\(2^4=16\) (de fato \(1+4+6+4+1=16\)).")]),
 item("L6-297", "Exercício 297", r"Calcule o determinante \(\begin{vmatrix}1&\binom n1&\binom{n+1}1\\1&\binom{n+1}1&\binom{n+2}1\\1&\binom{n+2}1&\binom{n+3}1\end{vmatrix}\).", r"\(0\)",
      [st("Simplifique", r"\(\binom k1=k\).", r"\begin{vmatrix}1&n&n+1\\1&n+1&n+2\\1&n+2&n+3\end{vmatrix}"),
       st("Escalone", r"\(L_2-L_1=(0,1,1)\) e \(L_3-L_1=(0,2,2)\): linhas proporcionais.", r"\Rightarrow\det=0")]),
 item("L6-298", "Exercício 298", r"Calcule a) \(\sum_{i=0}^{10}\binom{10}i\) &nbsp; b) \(\sum_{i=1}^{10}\binom{10}i\) &nbsp; c) \(\sum_{i=2}^{10}\binom{10}i\)", r"a) 1024 &nbsp; b) 1023 &nbsp; c) 1013",
      [st("a)", r"\(2^{10}=1024\)."), st("b) tire i = 0", r"\(1024-\binom{10}0=1023\)."), st("c) tire i = 0 e i = 1", r"\(1024-1-10=1013\).")]),
 item("L6-299", "Exercício 299", r"Calcule \(m\), sabendo que \(\sum_{i=1}^m\binom mi=1023\).", r"\(m=10\)",
      [st("Equação", "", r"2^m-\binom m0=1023\Rightarrow2^m=1024\Rightarrow m=10")]),
 item("L6-300", "Exercício 300", r"Calcule \(\sum_{p=1}^n\binom np\).", r"\(2^n-1\)", [st("Falta só p = 0", "", r"2^n-\binom n0=2^n-1")]),
 item("L6-301", "Exercício 301", r"Calcule \(\sum_{k=0}^{10}\binom{11}k\).", r"\(2047\)", [st("Falta só k = 11", "", r"2^{11}-\binom{11}{11}=2048-1=2047")]),
 item("L6-302", "Exercício 302", r"Sejam \(n\in\mathbb N^*\), \(p\in\mathbb N\). Calcule \(\sum_{p=0}^n(-1)^{p-n}(-1)^p(-1)^{n-p}\binom np\).", r"\(0\)",
      [st("Junte os sinais", r"Soma dos expoentes: \((p-n)+p+(n-p)=p\).", r"\sum_{p=0}^n(-1)^p\binom np=(1-1)^n=0\quad(n\ge1)")]),
 item("L6-303", "Exercício 303", r"Determine \(A_n=\sum_{p=0}^n\binom np(2^p3^{n-p}-4^p)\), para \(n\gt0\).", r"\(A_n=0\)",
      [st("Separe em duas somas", "", r"\sum\binom np2^p3^{n-p}=(3+2)^n=5^n,\qquad\sum\binom np4^p=(1+4)^n=5^n"), st("Resultado", r"\(A_n=5^n-5^n=0\).")]),
 item("L6-304", "Exercício 304", r"Prove que, se um conjunto \(A\) tem \(n\) elementos, então o número de subconjuntos de \(A\) é \(2^n\).", r"Some os subconjuntos por tamanho: \(\sum\binom nk=2^n\).",
      [st("Por tamanho", r"Subconjuntos com \(k\) elementos: \(\binom nk\) (escolhas sem ordem). \(k\) vai de 0 (o vazio) a \(n\) (o próprio \(A\))."),
       st("Some", "", r"\binom n0+\binom n1+\dots+\binom nn=2^n\ \ (\text{exercício 295})")]),
 item("L6-305", "Exercício 305", r"Quantos subconjuntos não vazios possui um conjunto com \(n\) elementos?", r"\(2^n-1\)", [st("Tire o vazio", r"\(2^n-1\).")]),
 item("L6-306", "Exercício 306", r"Calcule \(1+\left(\frac14\right)^n+\sum_{k=1}^n\binom nk\left(\frac14\right)^{n-k}\left(\frac34\right)^k\).", r"\(2\)",
      [st("Observe", r"O termo \(k=0\) da soma seria \(\binom n0\left(\frac14\right)^n=\left(\frac14\right)^n\), que aparece separado."),
       st("Feche o binômio", "", r"\left(\tfrac14\right)^n+\sum_{k=1}^n(\dots)=\sum_{k=0}^n\binom nk\left(\tfrac14\right)^{n-k}\left(\tfrac34\right)^k=\left(\tfrac14+\tfrac34\right)^n=1"),
       st("Resultado", r"\(1+1=2\).")]),
 item("L6-307", "Exercício 307", r"Demonstre que \(\forall n\in\mathbb N^*\): \(\binom n0-\binom n1+\binom n2-\dots+(-1)^n\binom nn=0\).", r"Desenvolva \((1-1)^n\).",
      [st("Prova", "", r"0=(1-1)^n=\sum_{i=0}^n\binom ni1^{n-i}(-1)^i=\binom n0-\binom n1+\binom n2-\dots+(-1)^n\binom nn"),
       st("Por que n ≥ 1", r"Para \(n=0\), \((1-1)^0=1\), não 0 (convenção \(0^0=1\)).")]),
 item("L6-308", "Exercício 308", r"Se \(p\gt0\), \(q\gt0\), \(p+q=1\) e \((p+q)^n=\sum\binom nip^iq^{n-i}\), \(n\gt0\), demonstre que \(\binom nip^iq^{n-i}\lt1\).", r"São \(n+1\ge2\) parcelas positivas com soma 1.",
      [st("Soma 1", r"\(\sum_{i=0}^n\binom nip^iq^{n-i}=(p+q)^n=1^n=1\)."),
       st("Todas positivas", r"Cada parcela é produto de números positivos. Como \(n\ge1\), há pelo menos 2 parcelas."),
       st("Conclusão", r"Se uma parcela fosse \(\ge1\), somada às outras (positivas) daria mais que 1. Absurdo. Logo cada parcela é \(\lt1\).")]),
 item("L6-309", "Exercício 309", r"Verifique que, quando \(n\) é ímpar, \(2^{n-1}=\binom n0+\binom n2+\binom n4+\dots+\binom n{n-1}\).", r"Pares = ímpares (por 307) e pares + ímpares = \(2^n\).",
      [st("Duas equações", r"Seja \(P\) a soma dos de índice par e \(I\) a dos de índice ímpar.", r"P+I=2^n\ (295),\qquad P-I=(1-1)^n=0\ (307)"),
       st("Resolva", r"\(P=I=2^{n-1}\). Com \(n\) ímpar, o último índice par é \(n-1\): é a soma pedida."),
       st("Alternativa (sugestão do livro)", r"Pela simetria \(\binom nk=\binom n{n-k}\) e \(n\) ímpar, cada par \(k\) corresponde a um ímpar \(n-k\): as duas metades são iguais e somam \(2^n\).")]),
 item("L6-310", "Exercício 310", r"Prove que \(\binom n1+2\binom n2+3\binom n3+\dots+n\binom nn=n\cdot2^{n-1}\).", r"Derive \((1+x)^n\) e faça \(x=1\).",
      [st("Comece pela identidade", "", r"(1+x)^n=\binom n0+\binom n1x+\binom n2x^2+\dots+\binom nnx^n"),
       st("Derive os dois lados", r"\((x^k)'=kx^{k-1}\) e \(((1+x)^n)'=n(1+x)^{n-1}\).", r"n(1+x)^{n-1}=\binom n1+2\binom n2x+\dots+n\binom nnx^{n-1}"),
       st("x = 1", "", r"n\,2^{n-1}=\binom n1+2\binom n2+\dots+n\binom nn"),
       st("Sem derivada", r"Use \(k\binom nk=n\binom{n-1}{k-1}\) e some: \(n\sum\binom{n-1}{k-1}=n2^{n-1}\).")]),
 item("L6-311", "Exercício 311", r"Prove que \(2\cdot1\binom n2+3\cdot2\binom n3+\dots+n(n-1)\binom nn=n(n-1)2^{n-2}\).", r"Derive duas vezes e faça \(x=1\).",
      [st("Derive de novo", r"Partindo de \(n(1+x)^{n-1}=\sum k\binom nkx^{k-1}\):", r"n(n-1)(1+x)^{n-2}=\sum_{k=2}^nk(k-1)\binom nkx^{k-2}"),
       st("x = 1", "", r"n(n-1)2^{n-2}=2\cdot1\binom n2+3\cdot2\binom n3+\dots+n(n-1)\binom nn"),
       st("Teste com n = 3", r"\(2\cdot3+6\cdot1=12\) e \(3\cdot2\cdot2=12\) ✓")]),
 item("L6-312", "Exercício 312", r"Demonstre a relação de Euler: \(\binom{m+n}p=\binom m0\binom np+\binom m1\binom n{p-1}+\dots+\binom mp\binom n0\).", r"Compare o coeficiente de \(x^p\) em \((1+x)^{m+n}=(1+x)^m(1+x)^n\).",
      [st("Lado esquerdo", r"Em \((1+x)^{m+n}\), o coeficiente de \(x^p\) é \(\binom{m+n}p\)."),
       st("Lado direito", r"Em \(\left(\sum_i\binom mix^i\right)\left(\sum_j\binom njx^j\right)\), \(x^p\) aparece quando \(i+j=p\): \(i=0,j=p\); \(i=1,j=p-1\); …; \(i=p,j=0\).", r"\sum_{i=0}^p\binom mi\binom n{p-i}"),
       st("Conclusão", r"Dois polinômios iguais têm coeficientes iguais. Leitura por contagem: escolher \(p\) pessoas num grupo de \(m\) homens e \(n\) mulheres = escolher \(i\) homens e \(p-i\) mulheres, para cada \(i\).")]),
 item("L6-313", "Exercício 313", r"Usando a relação de Euler, prove que \(\binom{2n}n=\binom n0^2+\binom n1^2+\dots+\binom nn^2\).", r"Euler com \(m=n=p\) e simetria.",
      [st("Euler com m = n, p = n", "", r"\binom{2n}n=\sum_{i=0}^n\binom ni\binom n{n-i}"),
       st("Simetria", r"\(\binom n{n-i}=\binom ni\), então cada parcela é \(\binom ni^2\). Exemplo: \(n=2\): \(1+4+1=6=\binom42\) ✓")]),
 item("L6-314", "Exercício 314", r"Demonstre a relação de Stifel: \(\binom np=\binom{n-1}{p-1}+\binom{n-1}p\).", r"Conte as combinações com e sem um elemento fixo (ou some as frações).",
      [st("Por contagem", r"Fixe um elemento \(a\) num conjunto de \(n\). Os grupos de \(p\) que <b>não</b> têm \(a\): \(\binom{n-1}p\). Os que <b>têm</b> \(a\): escolha os outros \(p-1\) entre \(n-1\): \(\binom{n-1}{p-1}\). Ao todo, \(\binom np\)."),
       st("Por álgebra", "", r"\frac{(n-1)!}{(p-1)!(n-p)!}+\frac{(n-1)!}{p!(n-1-p)!}=\frac{(n-1)!\,[\,p+(n-p)\,]}{p!\,(n-p)!}=\frac{n!}{p!\,(n-p)!}")]),
 item("L6-315", "Exercício 315", r"Demonstre que \(1^2+2^2+\dots+n^2=\dfrac{n(n+1)(2n+1)}6\), usando \((x+1)^3=x^3+3x^2+3x+1\) com \(x=1,2,\dots,n\).", r"Some as \(n\) identidades: os cubos se cancelam “em telescópio”.",
      [st("Escreva as n linhas", "", r"\begin{aligned}2^3&=1^3+3\cdot1^2+3\cdot1+1\\3^3&=2^3+3\cdot2^2+3\cdot2+1\\&\ \,\vdots\\ (n+1)^3&=n^3+3n^2+3n+1\end{aligned}"),
       st("Some tudo", r"Os cubos \(2^3,\dots,n^3\) aparecem dos dois lados e se cancelam. Com \(S=\sum k^2\) e \(\sum k=\frac{n(n+1)}2\):", r"(n+1)^3=1+3S+3\cdot\frac{n(n+1)}2+n"),
       st("Isole S", "", r"3S=(n+1)^3-(n+1)-\tfrac32n(n+1)=(n+1)\left[n^2+2n-\tfrac32n\right]=(n+1)\cdot\frac{n(2n+1)}{2}"),
       st("Resultado", "", r"S=\frac{n(n+1)(2n+1)}6")]),
 item("L6-316", "Exercício 316", r"Escreva \(n\) parcelas com o desenvolvimento de \((k+1)^3\) para \(k=1,\dots,n\), some, elimine os termos semelhantes e obtenha \(1^2+2^2+\dots+n^2\).", r"\(\dfrac{n(n+1)(2n+1)}6\) (mesmo método do 315)",
      [st("Método", r"É o mesmo cálculo do exercício 315: \((k+1)^3-k^3=3k^2+3k+1\). Somando de \(k=1\) a \(n\), a esquerda “telescopa” para \((n+1)^3-1\).", r"(n+1)^3-1=3S+\frac{3n(n+1)}2+n\Rightarrow S=\frac{n(n+1)(2n+1)}6"),
       st("Teste n = 3", r"\(1+4+9=14\) e \(\frac{3\cdot4\cdot7}6=14\) ✓")]),
 item("L6-317", "Exercício 317", r"Mostre que, se \(n\ge2\) é par, \(\binom np\) cresce, atinge o máximo em \(p=\frac n2\) e depois decresce.", r"Quociente \(\binom np/\binom n{p-1}=\frac{n-p+1}p\).",
      [st("Quociente de vizinhos", "", r"\frac{\binom np}{\binom n{p-1}}=\frac{n-p+1}{p}"),
       st("Cresce quando > 1", r"\(\frac{n-p+1}p\gt1\iff p\lt\frac{n+1}2\). Para \(n\) par, isso é \(p\le\frac n2\): cresce até \(p=\frac n2\)."),
       st("Decresce quando < 1", r"\(p\gt\frac{n+1}2\iff p\ge\frac n2+1\): decresce dali em diante. Máximo único em \(p=\frac n2\). Exemplo \(n=4\): 1, 4, <b>6</b>, 4, 1.")]),
 item("L6-318", "Exercício 318", r"Mostre que, se \(n\) é ímpar, \(\binom np\) cresce, atinge o máximo em \(p=\frac{n-1}2\) e \(p=\frac{n+1}2\) e depois decresce.", r"Mesmo quociente; agora há empate em \(p=\frac{n+1}2\).",
      [st("Quociente", "", r"\frac{\binom np}{\binom n{p-1}}=\frac{n-p+1}{p}"),
       st("Três casos", r"Cresce se \(p\lt\frac{n+1}2\); é <b>igual a 1</b> se \(p=\frac{n+1}2\) (inteiro, pois \(n\) é ímpar): \(\binom n{\frac{n+1}2}=\binom n{\frac{n-1}2}\); decresce se \(p\gt\frac{n+1}2\)."),
       st("Exemplo n = 5", r"1, 5, <b>10, 10</b>, 5, 1.")]),
 item("L6-319", "Exercício 319", r"Determine a condição para que \(\binom nk\) seja o dobro de \(\binom n{k-1}\).", r"\(n=3k-1\)",
      [st("Use o quociente", "", r"\frac{\binom nk}{\binom n{k-1}}=\frac{n-k+1}k=2\iff n-k+1=2k\iff n=3k-1"),
       st("Exemplo", r"\(k=2\Rightarrow n=5\): \(\binom52=10=2\binom51\) ✓")]),
 item("L6-320", "Exercício 320", r"Seja \(P(x)=a_0+a_1x+\dots+a_{100}x^{100}\), com \(a_{100}=1\), divisível por \((x+9)^{100}\). Calcule \(a_2\).", r"\(a_2=\binom{100}2 9^{98}=4950\cdot9^{98}\)",
      [st("Quem é P", r"\(P\) tem grau 100 e é divisível por \((x+9)^{100}\), também de grau 100: \(P=c(x+9)^{100}\). Como o coeficiente líder é 1, \(c=1\)."),
       st("Coeficiente de x²", "", r"(x+9)^{100}\ni\binom{100}{98}x^2\,9^{98}\Rightarrow a_2=\binom{100}2 9^{98}=4950\cdot9^{98}")]),
 item("L6-321", "Exercício 321", r"Resolva \(\operatorname{sen}^4x-4\operatorname{sen}^3x+6\operatorname{sen}^2x-4\operatorname{sen}x+1=0\) usando o binômio de Newton.", r"\(x=\frac\pi2+2k\pi,\ k\in\mathbb Z\)",
      [st("Reconheça", r"Coeficientes 1, −4, 6, −4, 1: é \((s-1)^4\) com \(s=\operatorname{sen}x\).", r"(\operatorname{sen}x-1)^4=0"),
       st("Resolva", r"\(\operatorname{sen}x=1\Rightarrow x=\frac\pi2+2k\pi\), \(k\in\mathbb Z\).")]),
]
out.append(page(6, "Pascal e somas (294–321)", "Triângulo de Pascal, somas e demonstrações", "Exercícios 294 a 321: propriedades, somas de binomiais, Euler, Stifel, derivadas e o máximo.", INTRO, L6, [("m4", "Pascal"), ("m7", "Somas"), ("m9", "Identidades"), ("m10", "Técnicas do capítulo")]))
# ============================================================ LISTA 7 (322-332)
EQ = st("Ferramenta", r"\(\binom nA=\binom nB\iff A=B\ \text{ ou }\ A+B=n\) (iguais ou complementares), com \(0\le A,B\le n\). Resolva os dois casos e <b>confira</b> se os números ficam entre 0 e \(n\).")
L7 = [
 item("L7-322", "Exercício 322", r"Calcule \(p\) na equação \(\binom{14}{3p}=\binom{14}{p+6}\).", r"\(p=3\) ou \(p=2\)",
      [EQ, st("Iguais", "", r"3p=p+6\Rightarrow p=3\ \ (\tbinom{14}9=\tbinom{14}9)"), st("Complementares", "", r"3p+p+6=14\Rightarrow p=2\ \ (\tbinom{14}6=\tbinom{14}8)")]),
 item("L7-323", "Exercício 323", r"Sendo \(\binom{10}{p-3}=\binom{10}{p+3}\), calcule \(p\).", r"\(p=5\)",
      [EQ, st("Iguais", r"\(p-3=p+3\) é impossível."), st("Complementares", "", r"(p-3)+(p+3)=10\Rightarrow p=5\ \ (\tbinom{10}2=\tbinom{10}8)")]),
 item("L7-324", "Exercício 324", r"Resolva \(\binom{14}x=\binom{14}{2x-1}\).", r"\(x=1\) ou \(x=5\)",
      [EQ, st("Iguais", r"\(x=2x-1\Rightarrow x=1\): \(\binom{14}1=\binom{14}1\) ✓"), st("Complementares", r"\(x+2x-1=14\Rightarrow x=5\): \(\binom{14}5=\binom{14}9\) ✓")]),
 item("L7-325", "Exercício 325", r"Resolva \(\binom{12}{p+3}=\binom{12}{p-1}\).", r"\(p=5\)",
      [EQ, st("Iguais", r"\(p+3=p-1\): impossível."), st("Complementares", r"\(2p+2=12\Rightarrow p=5\): \(\binom{12}8=\binom{12}4\) ✓")]),
 item("L7-326", "Exercício 326", r"Determine \(m\) para que \(\binom{11}{m-1}=\binom{11}{2m-3}\).", r"\(m=2\) ou \(m=5\)",
      [EQ, st("Iguais", r"\(m-1=2m-3\Rightarrow m=2\): \(\binom{11}1=\binom{11}1\) ✓"), st("Complementares", r"\(3m-4=11\Rightarrow m=5\): \(\binom{11}4=\binom{11}7\) ✓")]),
 item("L7-327", "Exercício 327", r"Com \(m\) objetos distintos, agrupando-os 3 a 3 ou 5 a 5 obtém-se o mesmo número de grupos (combinações). Determine \(\binom m3\).", r"\(56\)",
      [st("Equação", r"\(\binom m3=\binom m5\). Como \(3\ne5\), são complementares: \(3+5=m\Rightarrow m=8\)."), st("Calcule", "", r"\binom83=\frac{8\cdot7\cdot6}{6}=56")]),
 item("L7-328", "Exercício 328", r"Sendo \(m,p,q\) inteiros positivos, \(q\lt p\) e \(\binom m{p+q}=\binom m{p-q}\), determine a relação entre eles.", r"\(m=2p\)",
      [EQ, st("Iguais?", r"\(p+q=p-q\Rightarrow q=0\), mas \(q\gt0\). Não serve."), st("Complementares", r"\((p+q)+(p-q)=m\Rightarrow m=2p\).")]),
 item("L7-329", "Exercício 329", r"Sabendo que \(\binom{m-1}{p-1}=10\) e \(\binom m{m-p}=55\), calcule \(\binom{m-1}p\).", r"\(45\)",
      [st("Complementar", r"\(\binom m{m-p}=\binom mp=55\)."), st("Stifel", "", r"\binom mp=\binom{m-1}{p-1}+\binom{m-1}p\Rightarrow55=10+\binom{m-1}p\Rightarrow\binom{m-1}p=45"),
       st("Confirmação", r"\(m=11\), \(p=2\): \(\binom{10}1=10\), \(\binom{11}9=55\), \(\binom{10}2=45\) ✓")]),
 item("L7-330", "Exercício 330", r"Determine todos os \(n\in\mathbb N\), \(n\gt2\), para os quais \(\binom n3=\binom{n-1}3+\binom{n-1}2\).", r"Todos: \(\{n\in\mathbb N:\ n\ge3\}\)",
      [st("Reconheça", r"É a relação de Stifel com \(p=3\), que vale sempre. A igualdade é verdadeira para todo \(n\ge3\) (para \(n=3\): \(1=0+1\) ✓).")]),
 item("L7-331", "Exercício 331", r"Qual(is) o(s) maior(es) coeficiente(s) binomial(is) \(\binom np\) para a) \(n=12\)? b) \(n=15\)?", r"a) \(\binom{12}6=924\) &nbsp; b) \(\binom{15}7=\binom{15}8=6435\)",
      [st("Regra (317/318)", r"\(n\) par: o máximo é o do meio, \(p=\frac n2\). \(n\) ímpar: os dois do meio, \(p=\frac{n\pm1}2\)."),
       st("a)", "", r"\binom{12}6=\frac{12\cdot11\cdot10\cdot9\cdot8\cdot7}{720}=924"), st("b)", "", r"\binom{15}7=\binom{15}8=6435")]),
 item("L7-332", "Exercício 332", r"Qual o termo de maior coeficiente no desenvolvimento de \(\left(\sqrt x+y^2\right)^{10}\)?", r"\(T_6=252\,x^2\sqrt x\,y^{10}\)",
      [st("Coeficientes", r"Como os dois termos têm coeficiente 1, os coeficientes são só \(\binom{10}p\); o maior é \(\binom{10}5=252\)."),
       st("O termo", "", r"T_6=\binom{10}5(\sqrt x)^5(y^2)^5=252\,x^{5/2}y^{10}=252\,x^2\sqrt x\,y^{10}")]),
]
out.append(page(7, "Equações e máximo (322–332)", "Equações com binomiais e o maior coeficiente", "Exercícios 322 a 332: binomiais iguais ou complementares, Stifel e o termo de maior coeficiente.", INTRO, L7, [("m10", "Técnicas do capítulo"), ("m7", "Maior coeficiente")]))

# ============================================================ LISTA 8 (333-335)
L8 = [
 item("L8-333", "Exercício 333", r"Desenvolvendo \((x+y+z)^4\), qual o coeficiente do termo em \(x^2yz\)? E do termo \(xyz^2\)?", r"12 e 12",
      [st("Fórmula multinomial", "", r"\text{coef. de }x^iy^jz^k\text{ em }(x+y+z)^n=\frac{n!}{i!\,j!\,k!}\quad(i+j+k=n)"),
       st("x²yz", "", r"\frac{4!}{2!\,1!\,1!}=\frac{24}2=12"), st("xyz²", r"Mesmos expoentes em outra ordem: 12. São os anagramas de “xxyz”.")]),
 item("L8-334", "Exercício 334", r"Qual o coeficiente do termo em \(x^2y^3z^2\) no desenvolvimento de \((x+y+z)^7\)?", r"\(210\)",
      [st("Multinomial", "", r"\frac{7!}{2!\,3!\,2!}=\frac{5040}{2\cdot6\cdot2}=210")]),
 item("L8-335", "Exercício 335", r"Mostre que o coeficiente de \(x^3\) no desenvolvimento de \((1+3x+2x^2)^{10}\) é 3780.", r"\(3240+540=3780\)",
      [st("Termo genérico", r"Escolha \(i\) vezes o 1, \(j\) vezes \(3x\) e \(k\) vezes \(2x^2\), com \(i+j+k=10\).", r"\frac{10!}{i!\,j!\,k!}\,1^i(3x)^j(2x^2)^k=\frac{10!}{i!\,j!\,k!}3^j2^kx^{j+2k}"),
       st("Impor x³", r"\(j+2k=3\): ou \((j,k)=(3,0)\), \(i=7\); ou \((j,k)=(1,1)\), \(i=8\)."),
       st("Caso 1: i=7, j=3, k=0", "", r"\frac{10!}{7!\,3!}\cdot3^3=120\cdot27=3240"),
       st("Caso 2: i=8, j=1, k=1", "", r"\frac{10!}{8!\,1!\,1!}\cdot3\cdot2=90\cdot6=540"),
       st("Some", "", r"3240+540=3780\ \checkmark"),
       st("Atalho", r"\(1+3x+2x^2=(1+x)(1+2x)\), então o coeficiente é \(\sum_{a+b=3}\binom{10}a\binom{10}b2^b=120+45\cdot20+10\cdot180+960=3780\).")]),
]
out.append(page(8, "Multinomial (333–335)", "Expansão multinomial", "Exercícios 333 a 335: coeficientes de (x + y + z)ⁿ e de trinômios.", INTRO, L8, [("m9", "Multinômio")]))

def build():
    with open(os.path.join(HERE, "content", "20_listas.html"), "w", encoding="utf-8") as f:
        f.write("\n".join(out))

if __name__ == "__main__":
    build()
