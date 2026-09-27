"""Gera content/20_listas.html com as listas de exercícios (enunciado, resposta e resolução).
Executado pelo build.py antes de montar a página."""
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

def page(n, short, title, desc, intro, items, mods):
    links = " · ".join(f'<a href="#{m}">{t}</a>' for m, t in mods)
    return (f'<section class="page lista" id="lista{n}" data-num="{n}" data-short="{short}" data-desc="{desc}">'
            f'<div class="mhead"><span class="mi"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></svg></span>'
            f'<div style="flex:1;min-width:0"><div class="eyebrow">Lista de Exercícios {n}</div><h1>{title}</h1><p class="muted small">Teoria: {links}</p></div></div>'
            f'<div class="book"><div class="btns lprog" style="gap:12px"></div><p class="small muted">{intro}</p><div class="qs">' + "".join(items) +
            '</div><div class="mnav"><a class="btn" href="#listas">Todas as listas</a></div></div></section>')

P = r"\pi"
out = []

# ============================================================ LISTA 1
L1 = [
 item("L1-1", "1ª questão", r'Na figura ao lado, a hipotenusa mede \(2\sqrt{17}\) e \(\cos\hat B=\dfrac{2\sqrt{51}}{17}\). Calcule os catetos.<figure class="fig sm">{{FIG:q1}}</figure>',
      r"\(\overline{AB}=4\sqrt3\approx6{,}93\) e \(\overline{AC}=2\sqrt5\approx4{,}47\).",
      [st("Passo 1 · adjacente a B̂", r"\(\overline{AB}\) encosta em \(B\): \(\overline{AB}=a\cos\hat B\).", r"2\sqrt{17}\cdot\frac{2\sqrt{51}}{17}=\frac{4\sqrt{867}}{17}=\frac{4\cdot17\sqrt3}{17}=4\sqrt3"),
       st("Passo 2 · Pitágoras", "", r"\overline{AC}^2=(2\sqrt{17})^2-(4\sqrt3)^2=68-48=20\Rightarrow\overline{AC}=2\sqrt5"),
       st("Observação", r"No caderno os valores estão certos, mas as letras \(b\) e \(c\) ficaram trocadas: pela convenção, \(\overline{AB}=c\) (oposto a \(C\)) e \(\overline{AC}=b\).")]),
 item("L1-2", "2ª questão", r"Seja \(ABC\) um triângulo retângulo em \(A\). São dados \(\tg\hat B=\dfrac{\sqrt5}{2}\) e hipotenusa \(a=6\). Calcule os catetos \(b\) e \(c\).",
      r"\(b=2\sqrt5\) e \(c=4\).",
      [st("Passo 1 · proporção", r"\(\frac bc=\frac{\sqrt5}2\Rightarrow b=\sqrt5k,\ c=2k\)."),
       st("Passo 2 · Pitágoras", "", r"a^2=5k^2+4k^2=9k^2\Rightarrow a=3k=6\Rightarrow k=2"),
       st("Passo 3", r"\(b=2\sqrt5\approx4{,}47\), \(c=4\). Conferência: \(\frac{2\sqrt5}{4}=\frac{\sqrt5}{2}\) ✓.")]),
 item("L1-3", "3ª questão", r'No \(\triangle ABC\) retângulo em \(A\), \(\hat B=35^\circ\) e \(c=4\) cm. Quais são os valores de \(a\) e \(b\)?<figure class="fig sm">{{FIG:q3}}</figure>',
      r"\(a=\frac{4}{\cos35^\circ}\approx4{,}88\) cm e \(b=4\tg35^\circ\approx2{,}80\) cm.",
      [st("Passo 1", r"\(c\) é adjacente a 35°: cosseno para a hipotenusa.", r"a=\frac{4}{\cos35^\circ}\approx\frac{4}{0{,}8192}\approx4{,}88"),
       st("Passo 2", r"Oposto e adjacente: tangente.", r"b=4\tg35^\circ\approx4\cdot0{,}7002\approx2{,}80"),
       st("Observação", "A lista não traz os valores de 35°; use calculadora em graus.")]),
 item("L1-4", "4ª questão", r'Considerando o \(\triangle ABC\) retângulo em \(A\), conforme figura, qual é a relação entre \(x\) e \(y\)?<figure class="fig sm">{{FIG:q4}}</figure>',
      r"\(y=3x\).",
      [st("Passo 1", r"\(\hat B=90^\circ-30^\circ=60^\circ\)."),
       st("Passo 2", r"No triângulo com \(x\): \(\tg60^\circ=\frac hx\Rightarrow h=x\sqrt3\). No triângulo com \(y\): \(\tg30^\circ=\frac hy\Rightarrow h=\frac{\sqrt3}{3}y\)."),
       st("Passo 3", "", r"x\sqrt3=\frac{\sqrt3}3y\Rightarrow y=3x")]),
 item("L1-5", "5ª questão", r'Um observador vê um prédio, construído em terreno plano, sob um ângulo de 60°. Afastando-se do edifício mais 30 m, passa a ver o edifício sob ângulo de 45°. Qual é a altura do prédio?<figure class="fig sm">{{FIG:q5}}</figure>',
      r"\(H=15(3+\sqrt3)\approx70{,}98\) m.",
      [st("Passo 1", "", r"\tg60^\circ=\frac Hd\Rightarrow H=d\sqrt3\qquad\tg45^\circ=\frac{H}{d+30}\Rightarrow H=d+30"),
       st("Passo 2", "", r"d\sqrt3=d+30\Rightarrow d=\frac{30}{\sqrt3-1}=\frac{30(\sqrt3+1)}{2}=15(\sqrt3+1)"),
       st("Passo 3", "", r"H=d+30=45+15\sqrt3\approx70{,}98\ \text{m}")]),
 item("L1-6", "6ª questão", r'Para obter a altura \(H\) de uma chaminé, um engenheiro estabeleceu a horizontal \(\overline{AB}\) e mediu os ângulos \(\alpha\) e \(\beta\), tendo a seguir medido \(BC=h\). Determine a altura da chaminé.<figure class="fig sm">{{FIG:q6}}</figure>',
      r"\(H=h\left(1+\dfrac{\tg\beta}{\tg\alpha}\right)=\dfrac{h(\tg\alpha+\tg\beta)}{\tg\alpha}\).",
      [st("Passo 1", r"Triângulo de baixo: \(\tg\alpha=\frac{h}{AB}\Rightarrow AB=\frac{h}{\tg\alpha}\)."),
       st("Passo 2", r"Triângulo de cima: \(BD=AB\cdot\tg\beta=\frac{h\tg\beta}{\tg\alpha}\)."),
       st("Passo 3", r"\(H=h+BD\). Teste: se \(\alpha=\beta\), \(H=2h\) ✓.")]),
 item("L1-7", "7ª questão", r'Um pedreiro dispõe de uma escada de 3 m e precisa acessar o telhado de uma casa. O telhado se apoia sobre uma parede de 4 m de altura e o menor ângulo entre a escada e a parede para a escada não cair é 20°. A que altura do chão ele deve apoiar a escada?<figure class="fig sm">{{FIG:q7}}</figure>',
      r"\(s=4-3\cos20^\circ\approx1{,}18\) m (o pé da escada fica sobre um apoio).",
      [st("Passo 1", r"O ângulo de 20° é com a parede: a altura vencida é adjacente a ele.", r"v=3\cos20^\circ\approx2{,}82\ \text{m}"),
       st("Passo 2", r"Faltam \(4-2{,}82\approx1{,}18\) m: essa é a altura do apoio. Ângulos maiores que 20° exigiriam apoio mais alto."),
       st("Interpretação", "A escada de 3 m não alcança 4 m nem na vertical; por isso o pé precisa ficar acima do chão. Confira com o professor se ele pretendia outra leitura.")]),
]
out.append(page(1, "Trigonometria no Triângulo Retângulo", "Trigonometria no Triângulo Retângulo", "Catetos a partir de uma razão, ângulo não notável, altura relativa à hipotenusa, prédio, chaminé e escada.",
    "As questões não têm número impresso no PDF; a numeração segue a ordem de aparição. Figuras redesenhadas; a 5ª e a 7ª não têm figura no PDF (esquemas feitos aqui).", L1, [("m3", "Mód. 3"), ("m4", "Mód. 4"), ("m5", "Mód. 5")]))

# ============================================================ LISTA 2
def rad_item(i, let, deg, piTex):
    return item(f"L2-1{let}", f"1 {let})", f"Exprima \\({deg}^\\circ\\) em radianos.", f"\\({piTex}\\)",
                [st("Passo 1", "", f"{deg}\\cdot\\frac{{\\pi}}{{180}}={piTex}")])
def deg_item(let, piTex, deg):
    sub = piTex.replace(chr(92) + "pi", "180^" + chr(92) + "circ")
    return item(f"L2-2{let}", f"2 {let})", f"Exprima \\({piTex}\\) rad em graus.", f"\\({deg}^\\circ\\)",
                [st("Passo 1", "Troque \\(\\pi\\) por 180°.", sub + "=" + str(deg) + "^" + chr(92) + "circ")])
L2 = [rad_item(0, "a", 210, r"\frac{7\pi}{6}"), rad_item(0, "b", 240, r"\frac{4\pi}{3}"), rad_item(0, "c", 270, r"\frac{3\pi}{2}"),
      rad_item(0, "d", 300, r"\frac{5\pi}{3}"), rad_item(0, "e", 315, r"\frac{7\pi}{4}"), rad_item(0, "f", 330, r"\frac{11\pi}{6}"),
      deg_item("a", r"\frac{\pi}{6}", 30), deg_item("b", r"\frac{\pi}{4}", 45), deg_item("c", r"\frac{\pi}{3}", 60),
      deg_item("d", r"\frac{2\pi}{3}", 120), deg_item("e", r"\frac{3\pi}{4}", 135),
      item("L2-2f", "2 f)", r"Exprima \(\frac{5\pi}{6}\) rad em graus.", r"\(150^\circ\)", [st("Passo 1", "", r"\frac{5\cdot180^\circ}{6}=150^\circ"), st("Atenção", "Na folha resolvida aparece 160°; a conta correta dá 150°.")]),
      item("L2-3a", "3 a)", r"Um grau se divide em 60′ e um minuto em 60″. Converta em radianos: \(22^\circ30'\).", r"\(\frac{\pi}{8}\) rad",
           [st("Passo 1", "", r"30'=0{,}5^\circ\Rightarrow22^\circ30'=22{,}5^\circ"), st("Passo 2", "", r"22{,}5\cdot\frac{\pi}{180}=\frac{\pi}{8}\approx0{,}3927\ \text{rad}")]),
      item("L2-3b", "3 b)", r"Converta em radianos: \(31^\circ15'45''\).", r"\(\frac{2501\pi}{14400}\approx0{,}1737\pi\approx0{,}5456\) rad",
           [st("Passo 1", "", r"31+\frac{15}{60}+\frac{45}{3600}=31{,}2625^\circ=\frac{2501}{80}^\circ"),
            st("Passo 2", "", r"\frac{2501}{80}\cdot\frac{\pi}{180}=\frac{2501\pi}{14400}\approx0{,}1737\pi"),
            st("Atenção", "Na folha resolvida aparece 31,27° (≈ 0,1741π); o valor exato é 31,2625°.")]),
      item("L2-4", "4", r"Calcule a medida do ângulo central \(a\hat Ob\) que determina, numa circunferência de raio \(r\), um arco de comprimento \(\frac{2\pi r}{3}\).", r"\(\frac{2\pi}{3}\) rad (120°)",
           [st("Passo 1", "", r"\alpha=\frac{\ell}{r}=\frac{2\pi r/3}{r}=\frac{2\pi}{3}")]),
      item("L2-5", "5", r"Calcule o comprimento \(\ell\) do arco \(\overset{\frown}{AB}\) definido numa circunferência de raio 7 cm por um ângulo central de 4,5 rad.", r"\(\ell=31{,}5\) cm",
           [st("Passo 1", "", r"\ell=\alpha R=4{,}5\cdot7=31{,}5\ \text{cm}\ \left(=\tfrac{63}{2}\right)")]),
     ]
for let, piTex, deg, q, where in [("a", r"\frac{3\pi}{4}", 135, "2º quadrante", ""), ("b", r"\frac{5\pi}{4}", 225, "3º quadrante", ""), ("c", r"\frac{5\pi}{6}", 150, "2º quadrante", ""),
                                  ("d", r"\frac{\pi}{8}", 22.5, "1º quadrante", ""), ("e", r"\frac{12\pi}{8}=\frac{3\pi}{2}", 270, "sobre o eixo y, no ponto (0, −1)", ""), ("f", r"\frac{15\pi}{8}", 337.5, "4º quadrante", "")]:
    L2.append(item(f"L2-6{let}", f"6 {let})", f"Desenhe e indique no ciclo trigonométrico a imagem de \\({piTex.split('=')[0]}\\).",
                   f"\\({piTex}\\) = {str(deg).replace('.', ',')}°, {q}.",
                   [st("Passo 1", f"Converta: \\({piTex}\\) → {str(deg).replace('.', ',')}° (fração da volta: {str(round(deg/360,4)).replace('.', ',')})."),
                    f'<figure class="fig sm" data-f="cicloPt" data-o=\'{{"d":[{deg}],"quad":1}}\'></figure>']))
out.append(page(2, "Arcos, ângulos e o ciclo trigonométrico", "Arcos, ângulos e o ciclo trigonométrico", "Graus ↔ radianos, graus-minutos-segundos, ângulo central, comprimento de arco e pontos no ciclo.",
    "Na folha, as questões não são numeradas; aqui seguem a ordem de aparição (1 a 6).", L2, [("m1", "Mód. 1"), ("m2", "Mód. 2"), ("m6", "Mód. 6")]))

# ============================================================ LISTA 3
L3 = [
 item("L3-1", "1", r"Utilizando simetria e sabendo que \(\sen\frac\pi6=\frac12\), dê o valor do seno de \(\frac{5\pi}6\), \(\frac{7\pi}6\) e \(\frac{11\pi}6\).",
      r"\(\sen\frac{5\pi}6=\frac12\), \(\sen\frac{7\pi}6=-\frac12\), \(\sen\frac{11\pi}6=-\frac12\).",
      [st("Passo 1", r"\(\frac{5\pi}6=\pi-\frac\pi6\) (2º Q, seno +), \(\frac{7\pi}6=\pi+\frac\pi6\) (3º Q, −), \(\frac{11\pi}6=2\pi-\frac\pi6\) (4º Q, −).")]),
 item("L3-2", "2", r"Sabendo que \(\cos\frac\pi3=\frac12\), qual é o valor de \(\cos\frac{2\pi}3\), \(\cos\frac{4\pi}3\) e \(\cos\frac{5\pi}3\)?",
      r"\(-\frac12\), \(-\frac12\) e \(\frac12\).",
      [st("Passo 1", r"\(\frac{2\pi}3=\pi-\frac\pi3\) (2º Q, cos −); \(\frac{4\pi}3=\pi+\frac\pi3\) (3º Q, −); \(\frac{5\pi}3=2\pi-\frac\pi3\) (4º Q, +).")]),
 item("L3-3", "3", r"Determine o sinal da expressão \(y=\sen107^\circ+\cos107^\circ\).", r"Positivo (\(y\approx0{,}664\)).",
      [st("Passo 1", r"107° está no 2º Q: \(\sen107^\circ=\sen73^\circ\gt0\) e \(\cos107^\circ=-\cos73^\circ\lt0\)."),
       st("Passo 2", r"Como 73° > 45°, \(\sen73^\circ\gt\cos73^\circ\): a parte positiva vence.", r"y\approx0{,}956-0{,}292\gt0")]),
]
for let, expr, ans, why in [("a", r"\sen45^\circ+\cos45^\circ", "positivo", r"\(\frac{\sqrt2}2+\frac{\sqrt2}2=\sqrt2\gt0\)"),
                            ("b", r"\sen225^\circ+\cos225^\circ", "negativo", r"3º Q: \(-\frac{\sqrt2}2-\frac{\sqrt2}2=-\sqrt2\lt0\)"),
                            ("c", r"\sen\frac{7\pi}4+\cos\frac{7\pi}4", "nulo (zero)", r"4º Q: \(-\frac{\sqrt2}2+\frac{\sqrt2}2=0\)"),
                            ("d", r"\sen300^\circ+\cos300^\circ", "negativo", r"4º Q: \(-\frac{\sqrt3}2+\frac12=\frac{1-\sqrt3}{2}\lt0\)")]:
    L3.append(item(f"L3-4{let}", f"4 {let})", f"Qual é o sinal de \\(y={expr}\\)?", ans.capitalize() + ".", [st("Passo 1", why)]))
L3 += [
 item("L3-5a", "5 a)", r"Qual é o sinal de \(y_1=\tg269^\circ+\sen178^\circ\)?", "Positivo.",
      [st("Passo 1", r"269° está no 3º Q: tangente positiva (e grande: \(\tg269^\circ=\tg89^\circ\approx57{,}3\)). 178° está no 2º Q: seno positivo. Soma de positivos.")]),
 item("L3-5b", "5 b)", r"Qual é o sinal de \(y_2=\tg\frac{12\pi}7\cdot\left(\sen\frac{5\pi}{11}+\cos\frac{23\pi}{12}\right)\)?", "Negativo.",
      [st("Passo 1", r"\(\frac{12\pi}7\approx308{,}6^\circ\) (4º Q): tangente negativa."),
       st("Passo 2", r"\(\frac{5\pi}{11}\approx81{,}8^\circ\) (1º Q): seno +. \(\frac{23\pi}{12}=345^\circ\) (4º Q): cosseno +. O parêntese é positivo."),
       st("Passo 3", "Negativo × positivo = negativo.")]),
]
calc = [("6a", r"\sen\frac\pi3+\sen\frac\pi4-\sen2\pi", r"\frac{\sqrt3+\sqrt2}{2}\approx1{,}573", r"\frac{\sqrt3}2+\frac{\sqrt2}2-0"),
        ("6b", r"2\sen\frac\pi6+\frac12\sen\frac{7\pi}4", r"1-\frac{\sqrt2}4=\frac{4-\sqrt2}{4}\approx0{,}646", r"2\cdot\frac12+\frac12\cdot\left(-\frac{\sqrt2}2\right)"),
        ("6c", r"3\sen\frac\pi2-2\sen\frac{5\pi}4+\frac12\sen\pi", r"3+\sqrt2\approx4{,}414", r"3\cdot1-2\cdot\left(-\frac{\sqrt2}2\right)+\frac12\cdot0"),
        ("6d", r"-\frac23\sen\frac{3\pi}2+\frac35\sen\frac{5\pi}3-\frac67\sen\frac{7\pi}6", r"\frac{23}{21}-\frac{3\sqrt3}{10}\approx0{,}576", r"-\frac23(-1)+\frac35\left(-\frac{\sqrt3}2\right)-\frac67\left(-\frac12\right)=\frac23+\frac37-\frac{3\sqrt3}{10}"),
        ("7a", r"\cos\frac\pi3+\cos\frac\pi4-\cos2\pi", r"\frac{\sqrt2-1}{2}\approx0{,}207", r"\frac12+\frac{\sqrt2}2-1"),
        ("7b", r"2\cos\frac\pi6+\frac12\cos\frac{7\pi}4", r"\sqrt3+\frac{\sqrt2}4\approx2{,}086", r"2\cdot\frac{\sqrt3}2+\frac12\cdot\frac{\sqrt2}2"),
        ("7c", r"-2\tg\frac{5\pi}4+\frac12\tg\pi-\frac13\tg\frac{5\pi}6", r"-2+\frac{\sqrt3}9\approx-1{,}808", r"-2\cdot1+\frac12\cdot0-\frac13\cdot\left(-\frac{\sqrt3}3\right)"),
        ("7d", r"\frac35\tg\frac{5\pi}3-\frac67\tg\frac{7\pi}6-\frac23\cos\frac{3\pi}2", r"-\frac{31\sqrt3}{35}\approx-1{,}534", r"\frac35(-\sqrt3)-\frac67\cdot\frac{\sqrt3}3-\frac23\cdot0=-\frac{3\sqrt3}5-\frac{2\sqrt3}7"),
        ("8a", r"\cotg\frac\pi3+\cotg\frac\pi4+\cotg\frac\pi6", r"1+\frac{4\sqrt3}3\approx3{,}309", r"\frac{\sqrt3}3+1+\sqrt3"),
        ("8b", r"2\cotg\frac{2\pi}3-\frac12\cotg\frac{5\pi}6", r"-\frac{\sqrt3}6\approx-0{,}289", r"2\left(-\frac{\sqrt3}3\right)-\frac12(-\sqrt3)=-\frac{2\sqrt3}3+\frac{\sqrt3}2"),
        ("8c", r"\sen\frac\pi3+\cos\frac\pi4-\tg\frac{2\pi}3+\cotg\frac{7\pi}6", r"\frac{5\sqrt3+\sqrt2}{2}\approx5{,}037", r"\frac{\sqrt3}2+\frac{\sqrt2}2-(-\sqrt3)+\sqrt3"),
        ("8d", r"\frac35\cotg\frac{5\pi}3-\frac67\cotg\frac{7\pi}6-\frac23\sen\frac{3\pi}2+\frac45\cos\frac{5\pi}4", r"\frac23-\frac{37\sqrt3}{35}-\frac{2\sqrt2}{5}\approx-1{,}730", r"\frac35\left(-\frac{\sqrt3}3\right)-\frac67\sqrt3-\frac23(-1)+\frac45\left(-\frac{\sqrt2}2\right)")]
for cid, expr, ans, sub in calc:
    L3.append(item(f"L3-{cid}", f"{cid[0]} {cid[1]})", f"Calcule \\({expr}\\).", f"\\({ans}\\)",
                   [st("Passo 1 · valores (reduza cada arco ao 1º quadrante com o sinal)", "", sub), st("Passo 2 · resultado", "", ans)]))
L3.append(item("L3-9", "9", r"Qual é o valor de \(\left(\cossec\frac\pi6+\sen\frac\pi6\right)\left(\sen\frac\pi4-\sec\frac\pi3\right)\)?", r"\(\frac{5\sqrt2-20}{4}\approx-3{,}23\)",
               [st("Passo 1", "", r"\left(2+\tfrac12\right)\left(\tfrac{\sqrt2}2-2\right)=\tfrac52\cdot\tfrac{\sqrt2-4}2=\tfrac{5\sqrt2-20}4")]))
out.append(page(3, "Razões na circunferência", "Razões trigonométricas na circunferência", "Simetria, sinais por quadrante e cálculo de expressões com arcos notáveis.",
    "Na folha as questões não são numeradas; aqui seguem a ordem de aparição (1 a 9).", L3, [("m7", "Mód. 7"), ("m8", "Mód. 8")]))

# ============================================================ LISTA 4
L4 = [
 item("L4-1", "1", r"Sabendo que \(\sen x=\frac45\) e \(\frac\pi2\lt x\lt\pi\), obtenha as demais razões trigonométricas de \(x\).",
      r"\(\cos x=-\frac35\), \(\tg x=-\frac43\), \(\cotg x=-\frac34\), \(\sec x=-\frac53\), \(\cossec x=\frac54\).",
      [st("Passo 1", r"2º Q: cosseno negativo.", r"\cos^2x=1-\tfrac{16}{25}=\tfrac9{25}\Rightarrow\cos x=-\tfrac35"),
       st("Passo 2", "", r"\tg x=\frac{4/5}{-3/5}=-\frac43")]),
 item("L4-2", "2", r"Sabendo que \(\cossec x=-\frac{25}{24}\) e \(\pi\lt x\lt\frac{3\pi}2\), obtenha as demais razões.",
      r"\(\sen x=-\frac{24}{25}\), \(\cos x=-\frac7{25}\), \(\tg x=\frac{24}7\), \(\cotg x=\frac7{24}\), \(\sec x=-\frac{25}7\).",
      [st("Passo 1", "", r"\sen x=\frac1{\cossec x}=-\frac{24}{25}"),
       st("Passo 2", "3º Q: cosseno negativo.", r"\cos^2x=1-\tfrac{576}{625}=\tfrac{49}{625}\Rightarrow\cos x=-\tfrac7{25}")]),
 item("L4-3", "3", r"Sabendo que \(\tg x=\frac{12}5\) e \(\pi\lt x\lt\frac{3\pi}2\), obtenha as demais razões.",
      r"\(\sec x=-\frac{13}5\), \(\cos x=-\frac5{13}\), \(\sen x=-\frac{12}{13}\), \(\cotg x=\frac5{12}\), \(\cossec x=-\frac{13}{12}\).",
      [st("Passo 1", "", r"\sec^2x=1+\tg^2x=1+\tfrac{144}{25}=\tfrac{169}{25}"),
       st("Passo 2", "3º Q: secante (sinal do cosseno) negativa.", r"\sec x=-\tfrac{13}5\Rightarrow\cos x=-\tfrac5{13},\ \sen x=\tg x\cos x=-\tfrac{12}{13}")]),
 item("L4-4", "4", r"Calcule \(\cos x\), sabendo que \(\cotg x=\frac{2\sqrt m}{m-1}\), com \(m\gt1\).",
      r"\(\cos x=\pm\frac{2\sqrt m}{m+1}\) (positivo se \(x\) estiver no 1º quadrante).",
      [st("Passo 1", "", r"\cossec^2x=1+\frac{4m}{(m-1)^2}=\frac{m^2-2m+1+4m}{(m-1)^2}=\frac{(m+1)^2}{(m-1)^2}"),
       st("Passo 2", "", r"\sen^2x=\frac{(m-1)^2}{(m+1)^2}\Rightarrow\cos^2x=1-\sen^2x=\frac{4m}{(m+1)^2}"),
       st("Passo 3 · sinal", r"A cotangente é positiva, então \(x\) está no 1º ou no 3º quadrante. O enunciado não diz qual; no 1º, \(\cos x=\frac{2\sqrt m}{m+1}\).")]),
 item("L4-5", "5", r"Calcule \(\sec x\), sabendo que \(\sen x=\frac{2ab}{a^2+b^2}\), com \(a\gt b\gt0\).",
      r"\(\sec x=\pm\frac{a^2+b^2}{a^2-b^2}\) (positivo no 1º quadrante).",
      [st("Passo 1", "", r"\cos^2x=1-\frac{4a^2b^2}{(a^2+b^2)^2}=\frac{(a^2+b^2)^2-4a^2b^2}{(a^2+b^2)^2}=\frac{(a^2-b^2)^2}{(a^2+b^2)^2}"),
       st("Passo 2", r"\(\cos x=\pm\frac{a^2-b^2}{a^2+b^2}\) (como \(a\gt b\), \(a^2-b^2\gt0\)). Seno positivo: 1º ou 2º quadrante; o enunciado não especifica.", r"\sec x=\pm\frac{a^2+b^2}{a^2-b^2}")]),
 item("L4-6", "6", r"Sabendo que \(\sec x=3\), calcule \(y=\sen^2x+2\tg^2x\).", r"\(y=\frac{152}{9}\)",
      [st("Passo 1", "", r"\cos x=\tfrac13\Rightarrow\sen^2x=1-\tfrac19=\tfrac89\qquad\tg^2x=\sec^2x-1=8"),
       st("Passo 2", "", r"y=\tfrac89+2\cdot8=\tfrac{8+144}{9}=\tfrac{152}9")]),
 item("L4-7", "7", r"Sendo \(\sen x=\frac13\) e \(0\lt x\lt\frac\pi2\), calcule \(y=\dfrac{1}{\cossec x+\cotg x}+\dfrac{1}{\cossec x-\cotg x}\).", r"\(y=6\)",
      [st("Passo 1 · somar as frações", "", r"y=\frac{(\cossec x-\cotg x)+(\cossec x+\cotg x)}{\cossec^2x-\cotg^2x}=\frac{2\cossec x}{1}"),
       st("Passo 2", r"\(\cossec^2x-\cotg^2x=1\) (relação 2). Com \(\cossec x=3\):", r"y=2\cdot3=6")]),
 item("L4-8", "8", r"Sabendo que \(\cotg x=\frac{24}7\) e \(\pi\lt x\lt\frac{3\pi}2\), calcule \(y=\dfrac{\tg x\cdot\cos x}{(1+\cos x)(1-\cos x)}\).", r"\(y=-\frac{25}7\)",
      [st("Passo 1 · simplificar", "", r"y=\frac{\sen x}{\sen^2x}=\frac1{\sen x}=\cossec x"),
       st("Passo 2", "3º Q: cossecante negativa.", r"\cossec^2x=1+\tfrac{576}{49}=\tfrac{625}{49}\Rightarrow y=-\tfrac{25}7")]),
 item("L4-9", "9", r"Dado que \(\cos x=\frac25\) e \(\frac{3\pi}2\lt x\lt2\pi\), obtenha \(y=(1+\tg^2x)^2+(1-\tg^2x)^2\).", r"\(y=\frac{457}{8}\)",
      [st("Passo 1 · expandir", "", r"y=2+2\tg^4x"),
       st("Passo 2", "", r"\tg^2x=\sec^2x-1=\tfrac{25}4-1=\tfrac{21}4\Rightarrow\tg^4x=\tfrac{441}{16}"),
       st("Passo 3", "", r"y=2+\tfrac{441}{8}=\tfrac{457}8")]),
]
out.append(page(4, "Relações fundamentais", "Relações Fundamentais", "Obter todas as razões a partir de uma, com o sinal do quadrante, e simplificar expressões.",
    "Numeração igual à da folha (1 a 9).", L4, [("m9", "Mód. 9"), ("m7", "Mód. 7")]))

# ============================================================ LISTA 5
red = [("a", r"\cos178^\circ", r"-\cos2^\circ", "2º Q: \\(r=180^\\circ-178^\\circ=2^\\circ\\); cosseno negativo."),
       ("b", r"\cotg\frac{7\pi}6", r"\cotg\frac\pi6=\sqrt3", "3º Q: \\(r=\\frac{7\\pi}6-\\pi=\\frac\\pi6\\); cotangente positiva."),
       ("c", r"\sen\frac{7\pi}6", r"-\sen\frac\pi6=-\frac12", "3º Q; seno negativo."),
       ("d", r"\sen\frac{5\pi}4", r"-\sen\frac\pi4=-\frac{\sqrt2}2", "3º Q; seno negativo."),
       ("e", r"\sen251^\circ", r"-\sen71^\circ", "3º Q: \\(r=251^\\circ-180^\\circ=71^\\circ\\); seno negativo."),
       ("f", r"\sec124^\circ", r"-\sec56^\circ", "2º Q: \\(r=180^\\circ-124^\\circ=56^\\circ\\); secante (sinal do cosseno) negativa."),
       ("g", r"\cos\frac{5\pi}3", r"\cos\frac\pi3=\frac12", "4º Q: \\(r=2\\pi-\\frac{5\\pi}3=\\frac\\pi3\\); cosseno positivo."),
       ("h", r"\cos\frac{7\pi}6", r"-\cos\frac\pi6=-\frac{\sqrt3}2", "3º Q; cosseno negativo."),
       ("i", r"\tg290^\circ", r"-\tg70^\circ", "4º Q: \\(r=360^\\circ-290^\\circ=70^\\circ\\); tangente negativa."),
       ("j", r"\cossec\frac{11\pi}6", r"-\cossec\frac\pi6=-2", "4º Q; cossecante (sinal do seno) negativa."),
       ("k", r"\tg\frac{3\pi}4", r"-\tg\frac\pi4=-1", "2º Q; tangente negativa."),
       ("l", r"\tg\frac{5\pi}3", r"-\tg\frac\pi3=-\sqrt3", "4º Q; tangente negativa.")]
L5 = [item(f"L5-{l}", f"1 {l})", f"Reduza ao primeiro quadrante: \\({e}\\).", f"\\({e}={a}\\)", [st("Passo 1", w)]) for l, e, a, w in red]
out.append(page(5, "Redução ao 1º quadrante", "Redução ao Primeiro Quadrante", "Doze razões para reduzir: quadrante, ângulo de referência e sinal.",
    "Questão 1, itens a) a l), como na folha.", L5, [("m8", "Mód. 8")]))

# ============================================================ LISTA 6
fun = [("1a", r"f(x)=2+\sen\left(x-\frac\pi2\right)", r"\(P=2\pi\), \(D=\mathbb R\), \(Im=[1,\ 3]\).", r"\(a=2,\ b=1,\ c=1\): \(P=\frac{2\pi}1\), \(Im=[2-1,\ 2+1]\)."),
       ("1b", r"f(x)=-3\sen(\pi-5x)", r"\(P=\frac{2\pi}5\), \(D=\mathbb R\), \(Im=[-3,\ 3]\).", r"\(\sen(\pi-5x)=\sen5x\), então \(f(x)=-3\sen5x\): \(|c|=5\), \(|b|=3\)."),
       ("1c", r"f(x)=2-3\sen\left(\frac\pi2\right)", r"Função constante \(f(x)=-1\): \(D=\mathbb R\), \(Im=\{-1\}\); não tem período mínimo (qualquer \(P\gt0\) serve).", r"Não há \(x\) dentro do seno: \(\sen\frac\pi2=1\) e \(f(x)=2-3=-1\). Se o professor quis \(2-3\sen\frac x2\), seria \(P=4\pi\) e \(Im=[-1,\ 5]\)."),
       ("1d", r"f(x)=\cos\left(\frac{2x}3\right)-4", r"\(P=3\pi\), \(D=\mathbb R\), \(Im=[-5,\ -3]\).", r"\(c=\frac23\): \(P=\frac{2\pi}{2/3}=3\pi\); \(a=-4,\ |b|=1\)."),
       ("1e", r"f(x)=3\cos\left(\frac{7\pi}6-2x\right)", r"\(P=\pi\), \(D=\mathbb R\), \(Im=[-3,\ 3]\).", r"\(|c|=2\): \(P=\frac{2\pi}2\); \(|b|=3\)."),
       ("1f", r"f(x)=-5-\cos\left(x+\frac{2\pi}3\right)", r"\(P=2\pi\), \(D=\mathbb R\), \(Im=[-6,\ -4]\).", r"\(a=-5,\ |b|=1\).")]
L6 = [item(f"L6-{i}", f"{i[0]} ({i[1]})", f"Determine período, domínio e imagem de \\({e}\\).", a, [st("Passo 1", w)]) for i, e, a, w in fun]
L6 += [
 item("L6-2g", "2 (g)", r"Determine período, domínio, imagem e assíntotas de \(f(x)=\tg\left(2x+\frac\pi2\right)\).",
      r"\(P=\frac\pi2\); \(D=\{x\in\mathbb R\mid x\ne\frac{k\pi}2\}\); \(Im=\mathbb R\); assíntotas \(x=\frac{k\pi}2,\ k\in\mathbb Z\).",
      [st("Passo 1", "", r"2x+\frac\pi2\ne\frac\pi2+k\pi\Rightarrow x\ne\frac{k\pi}2")]),
 item("L6-2h", "2 (h)", r"Determine período, domínio, imagem e assíntotas de \(f(x)=3\tg\left(\frac x5-\frac\pi4\right)\).",
      r"\(P=5\pi\); \(D=\{x\in\mathbb R\mid x\ne\frac{15\pi}4+5k\pi\}\); \(Im=\mathbb R\); assíntotas \(x=\frac{15\pi}4+5k\pi\).",
      [st("Passo 1", "", r"P=\frac{\pi}{1/5}=5\pi"), st("Passo 2", "", r"\frac x5-\frac\pi4\ne\frac\pi2+k\pi\Rightarrow\frac x5\ne\frac{3\pi}4+k\pi\Rightarrow x\ne\frac{15\pi}4+5k\pi")]),
]
esb = [("3a", r"f(x)=1+\sen2x", r"Período \(\pi\), imagem \([0,\ 2]\). Pontos: \((0,1),\ (\frac\pi4,2),\ (\frac\pi2,1),\ (\frac{3\pi}4,0),\ (\pi,1)\)."),
       ("3b", r"f(x)=2\sen\left(\frac\pi4-\frac x2\right)", r"\(=-2\sen\left(\frac x2-\frac\pi4\right)\). Período \(4\pi\), imagem \([-2,\ 2]\). Zeros em \(x=\frac\pi2+2k\pi\); começa em \(f(0)=\sqrt2\)."),
       ("3c", r"f(x)=|1+2\cos x|-2", r"Período \(2\pi\), imagem \([-2,\ 1]\). \(f(0)=1\); \(f=-2\) quando \(\cos x=-\frac12\) (\(x=\frac{2\pi}3,\frac{4\pi}3\)); \(f(\pi)=-1\) (o módulo “rebate” a parte negativa)."),
       ("3d", r"f(x)=-2\cos\left(\frac{3x}2-2\right)", r"Período \(\frac{4\pi}3\), imagem \([-2,\ 2]\); mínimo \(-2\) em \(\frac{3x}2-2=0\Rightarrow x=\frac43\)."),
       ("3e", r"f(x)=1+\tg\frac x2", r"Período \(2\pi\), imagem \(\mathbb R\), assíntotas \(x=\pi+2k\pi\); passa por \((0,1)\)."),
       ("3f", r"f(x)=\frac13\tg2x", r"Período \(\frac\pi2\), imagem \(\mathbb R\), assíntotas \(x=\frac\pi4+\frac{k\pi}2\); passa pela origem.")]
for i, e, a in esb:
    L6.append(item(f"L6-{i}", f"3 ({i[1]})", f"Esboce o gráfico de \\({e}\\).", a + ' Veja o gráfico pronto no <a href="#' + ("m11" if "tg" in e else "m10") + '">laboratório do módulo</a> (botões da Lista 6).',
                   [st("Roteiro", "1) período e imagem; 2) divida um período em 4 partes iguais; 3) calcule \\(f\\) nesses pontos; 4) ligue com a forma de onda (ou ramos da tangente entre assíntotas).")]))
out.append(page(6, "Funções trigonométricas", "Funções Trigonométricas (seno, cosseno e tangente)", "Período, domínio, imagem, assíntotas e esboço de gráficos.",
    "Numeração igual à da folha (1 a 3). Os gráficos da questão 3 podem ser vistos nos laboratórios dos módulos 10 e 11.", L6, [("m10", "Mód. 10"), ("m11", "Mód. 11")]))

def build():
    with open(os.path.join(HERE, "content", "20_listas.html"), "w", encoding="utf-8") as f:
        f.write("\n".join(out))

if __name__ == "__main__":
    build()
