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

# ============================================================ LISTA 1 · FATORIAL E CONTAGEM
L1 = [
 item("L1-1", "Questão 1", r"Calcule: a) \(6!\) &nbsp; b) \(\dfrac{8!}{6!}\) &nbsp; c) \(\dfrac{12!}{10!\,2!}\) &nbsp; d) \(\dfrac{5!+4!}{3!}\)",
      r"a) 720 &nbsp; b) 56 &nbsp; c) 66 &nbsp; d) 24",
      [st("a)", "", r"6!=6\cdot5\cdot4\cdot3\cdot2\cdot1=720"),
       st("b)", "", r"\frac{8\cdot7\cdot6!}{6!}=56"),
       st("c)", "", r"\frac{12\cdot11\cdot10!}{10!\cdot2}=\frac{132}{2}=66"),
       st("d) · escreva tudo com 3!", "", r"\frac{20\cdot3!+4\cdot3!}{3!}=\frac{3!\,(20+4)}{3!}=24")]),
 item("L1-2", "Questão 2", r"Simplifique: a) \(\dfrac{(n+1)!}{(n-1)!}\) &nbsp; b) \(\dfrac{(n-1)!}{(n+1)!}\) &nbsp; c) \(\dfrac{(n+2)!-(n+1)!}{n!}\)",
      r"a) \(n(n+1)\) &nbsp; b) \(\dfrac{1}{n(n+1)}\) &nbsp; c) \((n+1)^2\)",
      [st("a)", "", r"\frac{(n+1)\,n\,(n-1)!}{(n-1)!}=n(n+1)"),
       st("b) · o maior está embaixo", "", r"\frac{(n-1)!}{(n+1)\,n\,(n-1)!}=\frac{1}{n(n+1)}"),
       st("c) · coloque n! em evidência", r"\((n+2)!=(n+2)(n+1)n!\) e \((n+1)!=(n+1)n!\).", r"\frac{n!\,[(n+2)(n+1)-(n+1)]}{n!}=(n+1)(n+2-1)=(n+1)^2")]),
 item("L1-3", "Questão 3", r"Resolva: a) \(\dfrac{(n+2)!}{n!}=20\) &nbsp; b) \(\dfrac{n!}{(n-2)!}=42\) &nbsp; c) \((n+1)!=6\,(n-1)!\)",
      r"a) \(n=3\) &nbsp; b) \(n=7\) &nbsp; c) \(n=2\)",
      [st("a)", r"\((n+2)(n+1)=20=5\cdot4\Rightarrow n+2=5\Rightarrow n=3\). (A outra raiz de \(n^2+3n-18=0\) é \(-6\), descartada.)"),
       st("b)", r"\(n(n-1)=42=7\cdot6\Rightarrow n=7\)."),
       st("c)", r"\((n+1)\,n\,(n-1)!=6\,(n-1)!\Rightarrow n(n+1)=6=2\cdot3\Rightarrow n=2\).")]),
 item("L1-4", "Questão 4", r"Com as letras da palavra LIVRO: a) quantos anagramas existem? b) quantos começam com L? c) quantos começam e terminam com vogal?",
      r"a) 120 &nbsp; b) 24 &nbsp; c) 12",
      [st("a)", r"5 letras distintas em fila: \(5!=120\)."),
       st("b)", r"L fixo no início; as outras 4 em fila: \(4!=24\)."),
       st("c)", r"Vogais: I e O. Extremos: \(2\cdot1=2\) jeitos (I…O ou O…I). Meio: \(3!=6\). Total \(2\cdot6=12\).")]),
 item("L1-5", "Questão 5", r"Uma placa de carro tem 3 letras (26 possíveis) seguidas de 4 algarismos. a) Quantas placas existem? b) E se não puder repetir letra nem algarismo?",
      r"a) 175 760 000 &nbsp; b) 78 624 000",
      [st("a) · princípio multiplicativo", "", r"26^3\cdot10^4=17\,576\cdot10\,000=175\,760\,000"),
       st("b)", "", r"26\cdot25\cdot24\cdot10\cdot9\cdot8\cdot7=15\,600\cdot5\,040=78\,624\,000")]),
 item("L1-6", "Questão 6", r"De quantos modos 5 amigos podem se sentar em 5 cadeiras em fila se dois deles (Rui e Téo) não podem sentar juntos?",
      r"72",
      [st("Passo 1 · total", r"\(5!=120\)."),
       st("Passo 2 · com Rui e Téo juntos", r"Bloco + 3 pessoas = 4 objetos: \(4!\cdot2!=48\)."),
       st("Passo 3 · complementar", r"\(120-48=72\).")]),
]
out.append(page(1, "Fatorial e contagem", "Fatorial e princípio da contagem", "Simplificação, equações com fatorial, anagramas e princípio multiplicativo.", INTRO, L1, [("m2", "Fatorial"), ("m3", "Contagem")]))

# ============================================================ LISTA 2 · COMBINAÇÕES E PASCAL
L2 = [
 item("L2-1", "Questão 1", r"Calcule: a) \(\binom73\) &nbsp; b) \(\binom{10}{8}\) &nbsp; c) \(\binom{20}{1}\) &nbsp; d) \(\binom90+\binom99\)",
      r"a) 35 &nbsp; b) 45 &nbsp; c) 20 &nbsp; d) 2",
      [st("a)", "", r"\frac{7\cdot6\cdot5}{3\cdot2\cdot1}=35"), st("b) · complementar", "", r"\binom{10}{8}=\binom{10}{2}=\frac{10\cdot9}{2}=45"),
       st("c)", r"\(\binom n1=n=20\)."), st("d)", r"\(1+1=2\).")]),
 item("L2-2", "Questão 2", r"Resolva \(\binom n2=45\).", r"\(n=10\)",
      [st("Passo 1", "", r"\frac{n(n-1)}{2}=45\Rightarrow n(n-1)=90=10\cdot9\Rightarrow n=10")]),
 item("L2-3", "Questão 3", r"Resolva \(\binom{14}{x}=\binom{14}{3x-2}\).", r"\(x=1\) ou \(x=4\)",
      [st("Caso 1 · iguais", r"\(x=3x-2\Rightarrow x=1\) (\(\binom{14}1=\binom{14}1\) ✓)."),
       st("Caso 2 · complementares", r"\(x+3x-2=14\Rightarrow x=4\) (\(\binom{14}4=\binom{14}{10}\) ✓).")]),
 item("L2-4", "Questão 4", r"Numa turma de 12 alunos, quantas comissões de 4 alunos podem ser formadas? Em quantas a Ana está?",
      r"495 comissões; a Ana está em 165.",
      [st("Total", "", r"\binom{12}{4}=\frac{12\cdot11\cdot10\cdot9}{24}=495"),
       st("Com a Ana", r"Ela já está; faltam 3 entre os outros 11:", r"\binom{11}{3}=165")]),
 item("L2-5", "Questão 5", r"Marcam-se 6 pontos distintos numa circunferência. Quantos triângulos e quantos quadriláteros têm vértices nesses pontos?",
      r"20 triângulos e 15 quadriláteros.",
      [st("Triângulos", r"Pontos de uma circunferência nunca têm 3 alinhados: \(\binom63=20\)."), st("Quadriláteros", "", r"\binom64=\binom62=15")]),
 item("L2-6", "Questão 6", r"De um grupo de 6 homens e 5 mulheres, quantas comissões de 4 pessoas têm pelo menos uma mulher?",
      r"315",
      [st("Passo 1 · total", "", r"\binom{11}{4}=330"), st("Passo 2 · sem nenhuma mulher", "", r"\binom64=15"), st("Passo 3", r"\(330-15=315\). (“Pelo menos um”: total menos o caso “nenhum”.)")]),
 item("L2-7", "Questão 7", r"Calcule \(\binom{15}{9}+\binom{15}{10}\) usando a relação de Stifel.", r"\(\binom{16}{10}=8\,008\)",
      [st("Passo 1", "", r"\binom{15}{9}+\binom{15}{10}=\binom{16}{10}=\binom{16}{6}=\frac{16\cdot15\cdot14\cdot13\cdot12\cdot11}{720}=8\,008")]),
 item("L2-8", "Questão 8", r"Calcule a) \(\binom{10}0+\binom{10}1+\cdots+\binom{10}{10}\) e b) \(\binom{10}1+\binom{10}2+\cdots+\binom{10}9\).", r"a) 1024 &nbsp; b) 1022",
      [st("a)", r"Soma da linha 10: \(2^{10}=1024\)."), st("b)", r"Tire as pontas (1 e 1): \(1024-2=1022\).")]),
 item("L2-9", "Questão 9", r"Calcule \(\binom33+\binom43+\binom53+\cdots+\binom93\).", r"\(\binom{10}{4}=210\)",
      [st("Taco de hóquei (coluna 3, linhas 3 a 9)", "", r"\sum_{i=3}^{9}\binom i3=\binom{10}{4}=210"), st("Conferência", r"\(1+4+10+20+35+56+84=210\) ✓.")]),
 item("L2-10", "Questão 10", r"Escreva a linha 8 do Triângulo de Pascal e confira a soma.", r"1 8 28 56 70 56 28 8 1 (soma 256)",
      [st("Linha 7", "1 7 21 35 35 21 7 1"), st("Somando vizinhos", r"1, 8, 28, 56, 70, 56, 28, 8, 1. Soma \(=256=2^8\) ✓.")]),
]
out.append(page(2, "Combinações e Pascal", "Combinações e Triângulo de Pascal", "Números binomiais, equações binomiais, comissões, Stifel e somas no Triângulo.", INTRO, L2, [("m3", "Combinações"), ("m4", "Pascal")]))

# ============================================================ LISTA 3 · DESENVOLVIMENTO
L3 = [
 item("L3-1", "Questão 1", r"Desenvolva \((x+1)^5\).", r"\(x^5+5x^4+10x^3+10x^2+5x+1\)",
      [st("Linha 5: 1 5 10 10 5 1", r"Com \(b=1\), todas as potências de \(b\) valem 1.")]),
 item("L3-2", "Questão 2", r"Desenvolva \((2x-1)^4\).", r"\(16x^4-32x^3+24x^2-8x+1\)",
      [st("Passo 1 · a = 2x, b = −1, linha 4", "", r"(2x)^4-4(2x)^3+6(2x)^2-4(2x)+1"), st("Passo 2", "", r"=16x^4-32x^3+24x^2-8x+1")]),
 item("L3-3", "Questão 3", r"Desenvolva \((x+3)^4\).", r"\(x^4+12x^3+54x^2+108x+81\)",
      [st("Passo 1", "", r"x^4+4x^3\cdot3+6x^2\cdot9+4x\cdot27+81")]),
 item("L3-4", "Questão 4", r"Desenvolva \((a-2b)^3\).", r"\(a^3-6a^2b+12ab^2-8b^3\)",
      [st("Passo 1 · b → −2b", "", r"a^3+3a^2(-2b)+3a(-2b)^2+(-2b)^3=a^3-6a^2b+12ab^2-8b^3")]),
 item("L3-5", "Questão 5", r"Desenvolva \(\left(x+\dfrac1x\right)^3\).", r"\(x^3+3x+\dfrac3x+\dfrac1{x^3}\)",
      [st("Passo 1", "", r"x^3+3x^2\cdot\frac1x+3x\cdot\frac1{x^2}+\frac1{x^3}")]),
 item("L3-6", "Questão 6", r"Desenvolva \((x^2-2)^3\).", r"\(x^6-6x^4+12x^2-8\)",
      [st("Passo 1", "", r"(x^2)^3-3(x^2)^2\cdot2+3x^2\cdot4-8")]),
 item("L3-7", "Questão 7", r"Calcule \((1+\sqrt2)^4\) na forma \(a+b\sqrt2\).", r"\(17+12\sqrt2\)",
      [st("Passo 1 · linha 4", "", r"1+4\sqrt2+6(\sqrt2)^2+4(\sqrt2)^3+(\sqrt2)^4"),
       st("Passo 2 · potências de √2", r"\((\sqrt2)^2=2\), \((\sqrt2)^3=2\sqrt2\), \((\sqrt2)^4=4\).", r"1+4\sqrt2+12+8\sqrt2+4=17+12\sqrt2")]),
 item("L3-8", "Questão 8", r"Calcule \((\sqrt3+1)^3+(\sqrt3-1)^3\).", r"\(12\sqrt3\)",
      [st("Passo 1 · os termos com sinal oposto se cancelam", "", r"(a+b)^3+(a-b)^3=2a^3+6ab^2"),
       st("Passo 2 · a = √3, b = 1", "", r"2\cdot3\sqrt3+6\sqrt3=12\sqrt3")]),
]
out.append(page(3, "Desenvolvimento", "Desenvolvendo binômios", "Desenvolva binômios com coeficientes, sinais negativos, frações e radicais.", INTRO, L3, [("m5", "O desenvolvimento")]))

# ============================================================ LISTA 4 · TERMO GERAL
L4 = [
 item("L4-1", "Questão 1", r"Ache o 5º termo de \((x+2)^7\).", r"\(560x^3\)",
      [st("Passo 1 · 5º termo → k = 4", "", r"T_5=\binom74x^{3}\,2^4=35\cdot16\,x^3=560x^3")]),
 item("L4-2", "Questão 2", r"Ache o 3º termo de \((2x-1)^6\).", r"\(240x^4\)",
      [st("Passo 1 · k = 2", "", r"T_3=\binom62(2x)^4(-1)^2=15\cdot16x^4=240x^4")]),
 item("L4-3", "Questão 3", r"Qual é o coeficiente de \(x^5\) em \((x-2)^8\)?", r"\(-448\)",
      [st("Passo 1 · expoente", r"\(8-k=5\Rightarrow k=3\)."), st("Passo 2", "", r"\binom83(-2)^3=56\cdot(-8)=-448")]),
 item("L4-4", "Questão 4", r"Ache o termo independente de \(\left(x+\dfrac2x\right)^6\).", r"160",
      [st("Passo 1", "", r"T_{k+1}=\binom6kx^{6-k}\,2^kx^{-k}=\binom6k2^kx^{6-2k}"), st("Passo 2", r"\(6-2k=0\Rightarrow k=3\): \(\binom63\cdot8=160\).")]),
 item("L4-5", "Questão 5", r"Ache o termo independente de \(\left(x^2-\dfrac1x\right)^6\).", r"15",
      [st("Passo 1 · expoente", r"\(2(6-k)-k=12-3k=0\Rightarrow k=4\)."), st("Passo 2", "", r"\binom64(-1)^4=15")]),
 item("L4-6", "Questão 6", r"Qual é o coeficiente de \(x^4\) em \(\left(3x^2+\dfrac1x\right)^5\)?", r"270",
      [st("Passo 1 · expoente", r"\(2(5-k)-k=10-3k=4\Rightarrow k=2\)."), st("Passo 2", "", r"\binom52\cdot3^{3}=10\cdot27=270")]),
 item("L4-7", "Questão 7", r"Existe termo em \(x^3\) no desenvolvimento de \(\left(x+\dfrac1x\right)^8\)?", r"Não.",
      [st("Passo 1", r"Expoente: \(8-2k=3\Rightarrow k=2{,}5\), não natural. (Todos os expoentes são pares: 8, 6, …, −8.)")]),
 item("L4-8", "Questão 8", r"Ache o termo médio de \(\left(x-\dfrac1x\right)^{10}\).", r"\(-252\)",
      [st("Passo 1 · n = 10 par: o 6º termo, k = 5", "", r"T_6=\binom{10}5x^5\left(-\frac1x\right)^5=252\cdot(-1)=-252")]),
 item("L4-9", "Questão 9", r"Ache os termos médios de \((a+2)^5\).", r"\(T_3=40a^3\) e \(T_4=80a^2\)",
      [st("Passo 1 · n = 5 ímpar: 3º e 4º termos", "", r"T_3=\binom52a^3\cdot2^2=40a^3\qquad T_4=\binom53a^2\cdot2^3=80a^2")]),
 item("L4-10", "Questão 10", r"Em \((x+m)^6\), com \(m>0\), o coeficiente de \(x^4\) é 135. Ache \(m\).", r"\(m=3\)",
      [st("Passo 1 · k = 2", "", r"\binom62m^2=15m^2=135\Rightarrow m^2=9\Rightarrow m=3")]),
 item("L4-11", "Questão 11", r"O 3º termo de \((x+1)^n\) tem coeficiente 28. Ache \(n\).", r"\(n=8\)",
      [st("Passo 1 · 3º termo → k = 2", "", r"\binom n2=28\Rightarrow n(n-1)=56=8\cdot7\Rightarrow n=8")]),
]
out.append(page(4, "Termo geral", "Termo geral", "p-ésimo termo, termo em xᵐ, termo independente, termos médios e problemas inversos.", INTRO, L4, [("m6", "Termo geral")]))

# ============================================================ LISTA 5 · SOMAS
L5 = [
 item("L5-1", "Questão 1", r"Qual é a soma dos coeficientes de \((3x-1)^5\)?", r"32", [st("x = 1", "", r"(3-1)^5=32")]),
 item("L5-2", "Questão 2", r"Qual é a soma dos coeficientes de \((x^2-3y)^4\)?", r"16", [st("x = y = 1", "", r"(1-3)^4=16")]),
 item("L5-3", "Questão 3", r"A soma dos coeficientes de \((2x+y)^n\) é 729. Quantos termos tem o desenvolvimento?", r"7 termos (\(n=6\))",
      [st("Passo 1", "", r"3^n=729=3^6\Rightarrow n=6"), st("Passo 2", r"\(n+1=7\) termos.")]),
 item("L5-4", "Questão 4", r"Calcule a) \(\sum_{k=0}^{9}\binom9k\) e b) \(\sum_{k=0}^{9}(-1)^k\binom9k\).", r"a) 512 &nbsp; b) 0",
      [st("a)", r"\((1+1)^9=512\)."), st("b)", r"\((1-1)^9=0\).")]),
 item("L5-5", "Questão 5", r"Calcule \(\binom{11}1+\binom{11}3+\binom{11}5+\cdots+\binom{11}{11}\).", r"1024",
      [st("Classes ímpares", r"\(2^{11-1}=2^{10}=1024\).")]),
 item("L5-6", "Questão 6", r"Qual é a soma dos coeficientes dos termos que têm \(x\) no desenvolvimento de \((x+3)^4\)?", r"175",
      [st("Passo 1", r"\(P(1)=4^4=256\) (todos) e \(P(0)=3^4=81\) (termo independente)."), st("Passo 2", r"\(256-81=175\).")]),
 item("L5-7", "Questão 7", r"Qual é o maior coeficiente do desenvolvimento de \((a+b)^{12}\)?", r"\(\binom{12}6=924\)",
      [st("Passo 1", r"\(n=12\) par: o central é \(\binom{12}{6}=924\).")]),
 item("L5-8", "Questão 8", r"Qual é o maior coeficiente de \((1+3x)^8\) e em qual potência de \(x\) ele aparece?", r"20 412, no termo com \(x^6\)",
      [st("Passo 1 · razão entre vizinhos", "", r"\frac{c_{k+1}}{c_k}=\frac{8-k}{k+1}\cdot3>1\iff24-3k>k+1\iff k<5{,}75"),
       st("Passo 2", r"Cresce até \(c_6\) e depois cai.", r"c_6=\binom86\cdot3^6=28\cdot729=20\,412"),
       st("Conferência", r"\(c_5=56\cdot243=13\,608\) e \(c_7=8\cdot2\,187=17\,496\), ambos menores.")]),
]
out.append(page(5, "Somas e maior coeficiente", "Somas de coeficientes e maior coeficiente", "Trocar letras por 1, somas alternadas, pares e ímpares, descobrir n e o coeficiente máximo.", INTRO, L5, [("m7", "Somas")]))

# ============================================================ LISTA 6 · APLICAÇÕES E AVANÇADO
L6 = [
 item("L6-1", "Questão 1", r"Aproxime \(1{,}03^6\) usando os três primeiros termos do binômio.", r"\(\approx1{,}1935\) (exato: 1,194052…)",
      [st("x = 0,03, n = 6", "", r"1+6(0{,}03)+15(0{,}03)^2=1+0{,}18+0{,}0135=1{,}1935")]),
 item("L6-2", "Questão 2", r"Qual é o resto da divisão de \(13^{25}\) por 12?", r"1",
      [st("Passo 1", r"\(13=12+1\Rightarrow13^{25}=\text{múltiplo de }12+1^{25}\).")]),
 item("L6-3", "Questão 3", r"Qual é o resto da divisão de \(3^{50}\) por 4?", r"1",
      [st("Passo 1", r"\(3=4-1\). Último termo: \((-1)^{50}=1\).")]),
 item("L6-4", "Questão 4", r"Qual é o resto da divisão de \(6^{25}\) por 7?", r"6",
      [st("Passo 1", r"\(6=7-1\). Último termo: \((-1)^{25}=-1\)."), st("Passo 2", r"Resto não negativo: \(-1+7=6\).")]),
 item("L6-5", "Questão 5", r"Prove que \(10^n-1\) é divisível por 9 para todo natural \(n\ge1\).", r"Ver resolução.",
      [st("Passo 1", "", r"10^n=(9+1)^n=9^n+\binom n19^{n-1}+\cdots+\binom n{n-1}9+1"),
       st("Passo 2", r"\(10^n-1=9\left(9^{n-1}+\cdots+\binom n{n-1}\right)\), múltiplo de 9. ∎ (Por isso 9, 99, 999… são múltiplos de 9.)")]),
 item("L6-6", "Questão 6", r"Uma moeda honesta é lançada 8 vezes. Qual é a probabilidade de sair exatamente 3 caras?", r"\(\dfrac{7}{32}\approx21{,}9\%\)",
      [st("Passo 1", "", r"\binom83\left(\frac12\right)^8=\frac{56}{256}=\frac{7}{32}")]),
 item("L6-7", "Questão 7", r"Um dado é lançado 4 vezes. Qual é a probabilidade de o 6 sair exatamente 2 vezes?", r"\(\dfrac{25}{216}\approx11{,}6\%\)",
      [st("Passo 1", "", r"\binom42\left(\frac16\right)^2\left(\frac56\right)^2=6\cdot\frac1{36}\cdot\frac{25}{36}=\frac{150}{1296}=\frac{25}{216}")]),
 item("L6-8", "Questão 8", r"Qual é o coeficiente de \(x^3\) em \((1+x)^4(1-x)^2\)?", r"\(-4\)",
      [st("Passo 1 · coeficientes", r"\((1+x)^4\): 1, 4, 6, 4, 1. \((1-x)^2\): 1, −2, 1."),
       st("Passo 2 · pares com expoentes somando 3", "", r"4\cdot1+6\cdot(-2)+4\cdot1=4-12+4=-4")]),
 item("L6-9", "Questão 9", r"Qual é o coeficiente de \(a^2bc\) em \((a+b+c)^4\)?", r"12",
      [st("Multinomial", "", r"\frac{4!}{2!\,1!\,1!}=\frac{24}{2}=12")]),
 item("L6-10", "Questão 10", r"Calcule \(\displaystyle\sum_{k=0}^{7}k\binom7k\).", r"448",
      [st("Identidade", "", r"\sum k\binom nk=n\,2^{n-1}=7\cdot64=448")]),
 item("L6-11", "Questão 11", r"Use \((1+x)^{1/2}\approx1+\frac x2-\frac{x^2}8\) para aproximar \(\sqrt{0{,}98}\).", r"\(\approx0{,}98995\) (exato: 0,989949…)",
      [st("x = −0,02", "", r"1-0{,}01-\frac{0{,}0004}{8}=1-0{,}01-0{,}00005=0{,}98995")]),
]
out.append(page(6, "Aplicações e avançado", "Aplicações e tópicos avançados", "Aproximações, restos, probabilidade binomial, produtos, multinômio e identidades.", INTRO, L6, [("m8", "Aplicações"), ("m9", "Avançado")]))

# ============================================================ LISTA 7 · REVISÃO GERAL
L7 = [
 item("L7-1", "Questão 1", r"Ache o termo independente de \(\left(2x+\dfrac{1}{x^2}\right)^6\).", r"240",
      [st("Expoente", r"\((6-k)-2k=6-3k=0\Rightarrow k=2\)."), st("Termo", "", r"\binom62\,2^{4}=15\cdot16=240")]),
 item("L7-2", "Questão 2", r"A soma dos coeficientes de \((a+b)^m\) é 256. Ache o termo médio de \((a+b)^m\).", r"\(70a^4b^4\)",
      [st("Passo 1", r"\(2^m=256\Rightarrow m=8\)."), st("Passo 2 · 5º termo, k = 4", "", r"\binom84a^4b^4=70a^4b^4")]),
 item("L7-3", "Questão 3", r"Calcule \(99^3\) usando o binômio.", r"970 299",
      [st("Passo 1", "", r"(100-1)^3=100^3-3\cdot100^2+3\cdot100-1=1\,000\,000-30\,000+300-1=970\,299")]),
 item("L7-4", "Questão 4", r"Sabendo que \(\binom n3=\binom n5\), calcule \(\binom n4\).", r"70",
      [st("Passo 1", r"Complementares: \(3+5=n\Rightarrow n=8\)."), st("Passo 2", "", r"\binom84=70")]),
 item("L7-5", "Questão 5", r"Qual é o coeficiente de \(x^2\) em \((1+x+x^2)^3\)?", r"6",
      [st("Passo 1 · de cada parêntese escolha 1, x ou x²", r"Para obter \(x^2\): dois parênteses dão \(x\) e um dá 1 (\(\binom32=3\) jeitos), ou um dá \(x^2\) e dois dão 1 (\(\binom31=3\) jeitos)."),
       st("Passo 2", r"\(3+3=6\).")]),
 item("L7-6", "Questão 6", r"Calcule exatamente \(1{,}1^5\) pelo binômio.", r"1,61051",
      [st("Passo 1", "", r"1+5(0{,}1)+10(0{,}01)+10(0{,}001)+5(0{,}0001)+0{,}00001"), st("Passo 2", "", r"=1+0{,}5+0{,}1+0{,}01+0{,}0005+0{,}00001=1{,}61051")]),
 item("L7-7", "Questão 7", r"Mostre que \(\binom n0+2\binom n1+4\binom n2+\cdots+2^n\binom nn=3^n\).", r"Ver resolução.",
      [st("Passo 1", r"O lado esquerdo é \(\sum\binom nk1^{n-k}2^k\)."), st("Passo 2", "", r"\sum_{k=0}^n\binom nk1^{n-k}2^k=(1+2)^n=3^n\ \ ∎")]),
 item("L7-8", "Questão 8", r"Um atleta converte 80% dos pênaltis. Em 5 cobranças independentes, qual é a probabilidade de converter pelo menos 4?", r"\(\approx73{,}7\%\) (0,73728)",
      [st("k = 4", "", r"\binom54(0{,}8)^4(0{,}2)=5\cdot0{,}4096\cdot0{,}2=0{,}4096"),
       st("k = 5", "", r"(0{,}8)^5=0{,}32768"), st("Soma", r"\(0{,}4096+0{,}32768=0{,}73728\).")]),
]
out.append(page(7, "Revisão geral", "Revisão geral", "Questões que misturam todos os módulos, no estilo de prova.", INTRO, L7, [("m5", "Binômio"), ("m6", "Termo geral"), ("m7", "Somas"), ("m8", "Aplicações")], kicker="Revisão"))

def build():
    with open(os.path.join(HERE, "content", "20_listas.html"), "w", encoding="utf-8") as f:
        f.write("\n".join(out))

if __name__ == "__main__":
    build()
