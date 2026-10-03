/* Laboratórios, pausas dialógicas, provas interativas, figuras e jogos da apostila Axler 1B. */
(function () {
  "use strict";
  var W = window.W = {}; W.fig = {};
  function T_() { return window.T; }
  function tex(s, d) { return T_().tex(s, d); }
  function el(t, a, h) { return T_().el(t, a, h); }
  function f1(v) { return Math.round(v * 10) / 10; }
  function fmt(x, d) { if (d == null) d = 4; if (!isFinite(x)) return "—"; var s = (Math.abs(x) < 1e-12 ? 0 : x).toFixed(d); if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, ""); if (s === "-0") s = "0"; return s.replace(".", ","); }
  function tf(x, d) { return fmt(x, d).replace(",", "{,}"); }
  function th(s) { return String(s).replace(/\B(?=(\d{3})+(?!\d))/g, "."); } // milhar com ponto
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // ---------- SVG
  function L(a, b, st) { return '<line x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '" style="' + (st || "stroke:var(--ink);stroke-width:2") + '"/>'; }
  function Tx(x, y, s, st, anc) { return '<text x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anc || "middle") + '" dominant-baseline="central" style="font-size:14px;font-weight:700;fill:var(--ink);' + (st || "") + '">' + s + "</text>"; }
  function Ci(x, y, r, st) { return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + r + '" style="' + (st || "fill:var(--ink)") + '"/>'; }
  function R(x, y, w, h, st, rx) { return '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + f1(Math.max(0, w)) + '" height="' + f1(Math.max(0, h)) + '" rx="' + (rx || 0) + '" style="' + st + '"/>'; }
  function Pg(pts, st) { return '<polygon points="' + pts.map(function (p) { return f1(p[0]) + "," + f1(p[1]); }).join(" ") + '" style="' + st + '"/>'; }
  function svg(vb, inner) { return '<svg viewBox="' + vb + '" role="img">' + inner + "</svg>"; }
  var CA = "var(--c-cos)", CB = "var(--c-sen)", CM = "var(--c-tg)", CG = "var(--c-aux)";

  // ---------- controles
  function slider(host, id, label, min, max, step, val, fmtf) {
    var c = el("div", { class: "ctrl" }, '<label for="' + id + '"><span>' + label + '</span><output></output></label><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '">');
    host.appendChild(c);
    var i = c.querySelector("input"), o = c.querySelector("output");
    var sync = function () { o.textContent = fmtf ? fmtf(+i.value) : i.value; }; i.addEventListener("input", sync); sync();
    return i;
  }
  function clampTo(i, max) { i.max = max; if (+i.value > max) i.value = max; var o = i.parentNode.querySelector("output"); if (o) o.textContent = i.value; }
  function ctrls(h) { var c = el("div", { class: "ctrls" }); h.appendChild(c); return c; }
  function rows(host, keys) { var r = el("div", { class: "rows" }), out = {}; keys.forEach(function (k) { var row = el("div", { class: "row" }, "<b>" + k[1] + "</b><span></span>"); r.appendChild(row); out[k[0]] = row.lastChild; }); host.appendChild(r); return out; }
  function scene(host, vb) { var s = el("div", { class: "scene" }); s.innerHTML = '<svg viewBox="' + vb + '"></svg>'; host.appendChild(s); return s.firstChild; }
  function seg(host, opts, on, cb) { var s = el("div", { class: "seg", role: "group" }); opts.forEach(function (o) { var b = el("button", { type: "button", class: o[0] === on ? "on" : "" }, o[1]); b.onclick = function () { [].forEach.call(s.children, function (x) { x.classList.remove("on"); }); b.classList.add("on"); cb(o[0]); }; s.appendChild(b); }); host.appendChild(s); return s; }
  function inp(host, id, label, val, w) { var c = el("label", { class: "small", for: id, style: "display:inline-flex;gap:6px;align-items:center;font-weight:700" }, label + ' <input id="' + id + '" class="inp" value="' + val + '" style="width:' + (w || 90) + 'px" autocomplete="off" spellcheck="false">'); host.appendChild(c); return c.querySelector("input"); }
  function Anim(host, dur, draw) {
    var t = 0, play = false, last = 0, raf = 0, bar = el("div", { class: "btns" });
    var bp = el("button", { class: "btn p s", type: "button" }, "▶ Iniciar"), br = el("button", { class: "btn s", type: "button" }, "↺ Reiniciar");
    var rg = el("input", { type: "range", min: 0, max: 1000, value: 0, "aria-label": "Posição da animação", style: "flex:1 1 150px" });
    bar.appendChild(bp); bar.appendChild(br); bar.appendChild(rg); host.appendChild(bar);
    function paint() { rg.value = Math.round(t * 1000); draw(t); }
    function loop(ts) { if (!play) return; if (!last) last = ts; t = Math.min(1, t + (ts - last) / dur); last = ts; paint(); if (t >= 1) { stop(); bp.textContent = "▶ Repetir"; return; } raf = requestAnimationFrame(loop); }
    function stop() { play = false; cancelAnimationFrame(raf); bp.textContent = "▶ Continuar"; }
    bp.onclick = function () { if (play) return stop(); if (t >= 1) t = 0; play = true; last = 0; bp.textContent = "❚❚ Pausar"; raf = requestAnimationFrame(loop); };
    br.onclick = function () { stop(); t = 0; bp.textContent = "▶ Iniciar"; paint(); };
    rg.oninput = function () { if (play) stop(); t = rg.value / 1000; paint(); };
    paint();
    return { set: function (v) { t = v; paint(); } };
  }
  function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
  function sg(t, a, b) { return ease((t - a) / (b - a)); }
  function renderM(n) { T_().renderMath(n); }

  // ---------- matemática exata (BigInt)
  function bgcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { var t = b; b = a % b; a = t; } return a || 1n; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function fr(n, d) { n = BigInt(n); d = d == null ? 1n : BigInt(d); if (d < 0n) { n = -n; d = -d; } var g = bgcd(n, d); return { n: n / g, d: d / g }; }
  function fmul(a, b) { return fr(a.n * b.n, a.d * b.d); }
  function fadd(a, b) { return fr(a.n * b.d + b.n * a.d, a.d * b.d); }
  function fpow(a, e) { var r = fr(1); for (var i = 0; i < e; i++) r = fmul(r, a); return r; }
  function fval(a) { return Number(a.n) / Number(a.d); }
  function fTex(a, paren) { // fração em LaTeX
    var neg = a.n < 0n, n = neg ? -a.n : a.n, s = a.d === 1n ? th(n) : "\\frac{" + th(n) + "}{" + th(a.d) + "}";
    s = (neg ? "-" : "") + s; return paren && neg ? "(" + s + ")" : s;
  }
  function fact(n) { var r = 1n; for (var i = 2n; i <= BigInt(n); i++) r *= i; return r; }
  function binom(n, k) { if (k < 0 || k > n) return 0; var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); }
  function bbinom(n, k) { if (k < 0 || k > n) return 0n; var r = 1n; for (var i = 1; i <= k; i++) r = r * BigInt(n - k + i) / BigInt(i); return r; }
  W.binom = binom; W.fact = fact;



  var F = W.fig;
  function arrow(A, B, col, w) { var dx = B[0] - A[0], dy = B[1] - A[1], d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d, h = 11; return L(A, [B[0] - ux * h * .6, B[1] - uy * h * .6], "stroke:" + col + ";stroke-width:" + (w || 3) + ";stroke-linecap:round") + Pg([B, [B[0] - ux * h - uy * h * .45, B[1] - uy * h + ux * h * .45], [B[0] - ux * h + uy * h * .45, B[1] - uy * h - ux * h * .45]], "fill:" + col); }
  function plane(S, k, ox, oy, range) { // grade cartesiana
    var s = "";
    for (var i = -range; i <= range; i++) { s += L([ox + i * k, oy - range * k], [ox + i * k, oy + range * k], "stroke:var(--line);stroke-width:1") + L([ox - range * k, oy + i * k], [ox + range * k, oy + i * k], "stroke:var(--line);stroke-width:1"); }
    s += L([ox - range * k, oy], [ox + range * k, oy], "stroke:var(--muted);stroke-width:1.5") + L([ox, oy - range * k], [ox, oy + range * k], "stroke:var(--muted);stroke-width:1.5");
    return s;
  }


  W.axiomaLab = function (h) {
    function Z(a, b) { return Math.abs(a - b) < 1e-9 * (1 + Math.abs(a) + Math.abs(b)); }
    function R2(sum, mul, name, zero, neg, inSet, sample, desc) { return { name: name, add: sum, mul: mul, zero: zero, neg: neg, inSet: inSet || function () { return true; }, sample: sample || function () { return [ri(-5, 5), ri(-5, 5)]; }, eq: function (u, v) { return Z(u[0], v[0]) && Z(u[1], v[1]); }, show: function (v) { return "(" + v.map(function (x) { return fmt(x, 2); }).join(", ") + ")"; }, desc: desc }; }
    var std = function (u, v) { return [u[0] + v[0], u[1] + v[1]]; }, smul = function (a, u) { return [a * u[0], a * u[1]]; };
    var C = [
      R2(std, smul, "ℝ² com as operações usuais", [0, 0], function (u) { return [-u[0], -u[1]]; }, null, null, "(a, b) + (c, d) = (a + c, b + d) e α(a, b) = (αa, αb)."),
      R2(std, function (a, u) { return [a * u[0], u[1]]; }, "ℝ² com α(a, b) = (αa, b)", [0, 0], function (u) { return [-u[0], -u[1]]; }, null, null, "Soma usual, mas o escalar só multiplica a 1ª coordenada."),
      R2(function (u, v) { return [u[0] + v[0], 0]; }, smul, "ℝ² com (a, b) + (c, d) = (a + c, 0)", [0, 0], function (u) { return [-u[0], -u[1]]; }, null, null, "A soma “apaga” a 2ª coordenada."),
      R2(std, function () { return [0, 0]; }, "ℝ² com α(a, b) = (0, 0)", [0, 0], function (u) { return [-u[0], -u[1]]; }, null, null, "Todo produto por escalar dá o vetor nulo."),
      R2(std, smul, "Vetores da forma (x, 1), operações usuais", [0, 1], function (u) { return [-u[0], 1]; }, function (v) { return Z(v[1], 1); }, function () { return [ri(-5, 5), 1]; }, "O conjunto {(x, 1)} com as operações de ℝ²."),
      { name: "ℝ₊ (números positivos) com x ⊕ y = x·y e α ⊙ x = x^α", add: function (u, v) { return [u[0] * v[0]]; }, mul: function (a, u) { return [Math.pow(u[0], a)]; }, zero: [1], neg: function (u) { return [1 / u[0]]; }, inSet: function (v) { return v[0] > 0; }, sample: function () { return [rnd([0.5, 2, 3, 4, 5, 0.25, 10])]; }, eq: function (u, v) { return Z(u[0], v[0]); }, show: function (v) { return fmt(v[0], 4); }, desc: "A “soma” é o produto e o “produto por escalar” é a potência. O vetor nulo é o número 1!" }
    ];
    var cur = 0, sel = el("div", { class: "btns" }); h.appendChild(sel);
    C.forEach(function (c, i) { var b = el("button", { class: "btn s" + (i === 0 ? " p" : ""), type: "button" }, c.name); b.onclick = function () { cur = i; [].forEach.call(sel.children, function (x, j) { x.classList.toggle("p", j === i); }); go(); }; sel.appendChild(b); });
    var out = el("div", {}); h.appendChild(out);
    var bt = el("button", { class: "btn s", type: "button" }, "↻ Testar com outros números"); h.appendChild(bt); bt.onclick = go;
    function go() {
      var c = C[cur], res = [], al = [-2, -1, 0.5, 2, 3], A = function () { return rnd(al); };
      function test(name, f) { for (var t = 0; t < 40; t++) { var r = f(); if (r !== true) return res.push([name, false, r]); } res.push([name, true]); }
      test("Fechamento da soma: u + v está no conjunto", function () { var u = c.sample(), v = c.sample(), w = c.add(u, v); return c.inSet(w) || "u = " + c.show(u) + ", v = " + c.show(v) + " → u + v = " + c.show(w) + " não está no conjunto"; });
      test("Fechamento do produto: αu está no conjunto", function () { var u = c.sample(), a = A(), w = c.mul(a, u); return c.inSet(w) || "α = " + fmt(a, 2) + ", u = " + c.show(u) + " → αu = " + c.show(w) + " não está no conjunto"; });
      test("A1 · comutativa: u + v = v + u", function () { var u = c.sample(), v = c.sample(); return c.eq(c.add(u, v), c.add(v, u)) || "u = " + c.show(u) + ", v = " + c.show(v); });
      test("A2 · associativa: (u + v) + w = u + (v + w)", function () { var u = c.sample(), v = c.sample(), w = c.sample(); return c.eq(c.add(c.add(u, v), w), c.add(u, c.add(v, w))) || "u, v, w = " + [u, v, w].map(c.show).join(", "); });
      test("A3 · existe vetor nulo 0 com u + 0 = u (testado com 0 = " + c.show(c.zero) + ")", function () { var u = c.sample(); return c.eq(c.add(u, c.zero), u) || "u = " + c.show(u) + ": u + 0 = " + c.show(c.add(u, c.zero)) + " ≠ u (e nenhum outro vetor funciona para todo u)"; });
      test("A4 · todo u tem oposto: u + (−u) = 0", function () { var u = c.sample(), n = c.neg(u); return c.eq(c.add(u, n), c.zero) || "u = " + c.show(u) + ": não existe vetor que somado dê o nulo"; });
      test("M1 · α(βu) = (αβ)u", function () { var u = c.sample(), a = A(), b = A(); return c.eq(c.mul(a, c.mul(b, u)), c.mul(a * b, u)) || "α = " + a + ", β = " + b + ", u = " + c.show(u); });
      test("M2 · (α + β)u = αu + βu", function () { var u = c.sample(), a = A(), b = A(); return c.eq(c.mul(a + b, u), c.add(c.mul(a, u), c.mul(b, u))) || "α = " + fmt(a, 2) + ", β = " + fmt(b, 2) + ", u = " + c.show(u) + ": " + c.show(c.mul(a + b, u)) + " ≠ " + c.show(c.add(c.mul(a, u), c.mul(b, u))); });
      test("M3 · α(u + v) = αu + αv", function () { var u = c.sample(), v = c.sample(), a = A(); return c.eq(c.mul(a, c.add(u, v)), c.add(c.mul(a, u), c.mul(a, v))) || "α = " + fmt(a, 2) + ", u = " + c.show(u) + ", v = " + c.show(v); });
      test("M4 · 1·u = u", function () { var u = c.sample(); return c.eq(c.mul(1, u), u) || "u = " + c.show(u) + ": 1·u = " + c.show(c.mul(1, u)); });
      var okAll = res.every(function (r) { return r[1]; });
      out.innerHTML = '<p class="small" style="margin:8px 0">' + c.desc + '</p><div class="rows">' + res.map(function (r) { return '<div class="row"><b style="color:' + (r[1] ? "var(--ok)" : "var(--bad)") + '">' + (r[1] ? "✓" : "✗") + "</b><span>" + r[0] + (r[1] ? "" : '<br><span class="small" style="color:var(--bad)">Contraexemplo: ' + r[2] + "</span>") + "</span></div>"; }).join("") + '</div><div class="' + (okAll ? "final" : "alert bad") + '" style="margin-top:8px"><b>' + (okAll ? "É um espaço vetorial" : "Não é um espaço vetorial") + ".</b> " + (okAll ? "Todas as propriedades valeram nos testes (e é possível prová-las em geral)." : "Basta uma propriedade falhar uma vez.") + "</div>";
    }
    go();
  };

  // =================================================================== FIGURAS (esquemas visuais)
  function box(x, y, w, h, fill, stroke, rx) { return R(x, y, w, h, "fill:" + fill + ";stroke:" + (stroke || "none") + ";stroke-width:1.6", rx == null ? 12 : rx); }
  F.operacoes = function () {
    var s = "";
    // soma
    s += Tx(140, 18, "Adição  ( V × V → V )", "fill:var(--pri);font-size:15px");
    s += box(20, 40, 70, 34, "var(--card2)", CA) + Tx(55, 57, "u ∈ V", "fill:" + CA) + box(20, 92, 70, 34, "var(--card2)", CA) + Tx(55, 109, "v ∈ V", "fill:" + CA);
    s += arrow([92, 57], [128, 76], "var(--muted)", 2) + arrow([92, 109], [128, 90], "var(--muted)", 2);
    s += box(130, 58, 56, 50, "var(--pri)", null, 14) + Tx(158, 83, "+", "fill:var(--pri-ink);font-size:26px");
    s += arrow([188, 83], [222, 83], "var(--muted)", 2) + box(224, 66, 86, 34, "var(--pri-soft)", "var(--pri)") + Tx(267, 83, "u+v ∈ V", "fill:var(--pri)");
    // escalar
    s += Tx(500, 18, "Multiplicação por escalar  ( F × V → V )", "fill:var(--pri);font-size:15px");
    s += box(370, 40, 70, 34, "var(--card2)", CG) + Tx(405, 57, "λ ∈ F", "fill:" + CG) + box(370, 92, 70, 34, "var(--card2)", CA) + Tx(405, 109, "v ∈ V", "fill:" + CA);
    s += arrow([442, 57], [478, 76], "var(--muted)", 2) + arrow([442, 109], [478, 90], "var(--muted)", 2);
    s += box(480, 58, 56, 50, "var(--pri)", null, 14) + Tx(508, 83, "·", "fill:var(--pri-ink);font-size:30px");
    s += arrow([538, 83], [572, 83], "var(--muted)", 2) + box(574, 66, 76, 34, "var(--pri-soft)", "var(--pri)") + Tx(612, 83, "λv ∈ V", "fill:var(--pri)");
    s += Tx(335, 150, "As setas de saída SEMPRE caem dentro de V: o “fechamento” já está embutido na palavra função.", "fill:var(--muted);font-size:13px");
    return svg("0 0 670 165", s);
  };
  F.mapaAxiomas = function () {
    var s = "";
    function grp(x, w, title, col, items) { var h = 40 + items.length * 30; s += box(x, 30, w, h, "var(--card2)", col) + Tx(x + w / 2, 50, title, "fill:" + col + ";font-size:14px"); items.forEach(function (it, i) { s += Tx(x + 14, 82 + i * 30, it, "font-size:13px;font-weight:600", "start"); }); }
    grp(10, 225, "Só a ADIÇÃO", CA, ["comutatividade: u+v = v+u", "associatividade: (u+v)+w = u+(v+w)", "identidade: existe 0 com v+0 = v", "inverso: para cada v, existe w, v+w = 0"]);
    grp(250, 190, "Só o ESCALAR", CG, ["associatividade: (ab)v = a(bv)", "identidade: 1v = v"]);
    grp(455, 205, "PONTE (liga os dois)", CB, ["a(u+v) = au + av", "(a+b)v = av + bv"]);
    s += Tx(335, 12, "Os 8 requisitos da definição 1.20, agrupados pelo que eles “conversam”", "fill:var(--muted);font-size:13px");
    s += Tx(557, 175, "Só as distributivas misturam + e ·.", "fill:" + CB + ";font-size:12px") + Tx(557, 192, "Toda prova que mistura os dois", "fill:" + CB + ";font-size:12px") + Tx(557, 209, "(como 0v = 0) precisa delas.", "fill:" + CB + ";font-size:12px");
    return svg("0 0 670 225", s);
  };
  F.quantificadores = function () {
    var s = "";
    s += Tx(160, 16, "∃ 0  ∀ v :  v + 0 = v", "fill:" + CA + ";font-size:15px") + Tx(160, 36, "UM único zero serve para TODOS", "fill:var(--muted);font-size:12px");
    s += Ci(60, 120, 22, "fill:var(--pri)") + Tx(60, 120, "0", "fill:var(--pri-ink);font-size:16px");
    ["v₁", "v₂", "v₃", "v₄"].forEach(function (t, i) { var y = 60 + i * 40; s += L([82, 120], [230, y], "stroke:" + CA + ";stroke-width:2") + box(232, y - 14, 60, 28, "var(--card2)", CA, 8) + Tx(262, y, t, "fill:" + CA); });
    s += Tx(500, 16, "∀ v  ∃ w :  v + w = 0", "fill:" + CB + ";font-size:15px") + Tx(500, 36, "CADA v tem o SEU w (depende de v)", "fill:var(--muted);font-size:12px");
    ["v₁", "v₂", "v₃", "v₄"].forEach(function (t, i) { var y = 60 + i * 40; s += box(400, y - 14, 60, 28, "var(--card2)", CB, 8) + Tx(430, y, t, "fill:" + CB) + arrow([462, y], [538, y], CB, 2) + box(540, y - 14, 70, 28, "var(--pri-soft)", "var(--pri)", 8) + Tx(575, y, "−" + t, "fill:var(--pri)"); });
    s += Tx(335, 228, "Trocar a ordem dos quantificadores muda o significado: é a diferença entre “existe um zero universal” e “cada vetor tem um oposto”.", "fill:var(--muted);font-size:12px");
    return svg("0 0 670 240", s);
  };
  F.dependencias = function () {
    var s = "", N = {
      ax: [335, 30, "Definição 1.20 (axiomas)"], u0: [110, 105, "1.26  zero é único"], ui: [335, 105, "1.27  inverso é único"], nt: [335, 175, "1.28  notação −v, w − v"],
      z1: [560, 105, "1.30  0v = 0"], z2: [560, 175, "1.31  a0 = 0"], m1: [450, 245, "1.32  (−1)v = −v"], e1: [130, 245, "Ex.1  −(−v) = v"], e2: [130, 315, "Ex.2  av = 0 ⇒ a = 0 ou v = 0"], e5: [450, 315, "Ex.5  inverso ⟺ 0v = 0"]
    };
    function edge(a, b) { var A = N[a], B = N[b]; s += arrow([A[0], A[1] + 16], [B[0], B[1] - 16], "var(--muted)", 1.6); }
    [["ax", "u0"], ["ax", "ui"], ["ui", "nt"], ["ax", "z1"], ["ax", "z2"], ["z1", "m1"], ["nt", "m1"], ["ui", "e1"], ["z2", "e2"], ["z1", "e5"], ["m1", "e5"]].forEach(function (e) { edge(e[0], e[1]); });
    Object.keys(N).forEach(function (k) { var n = N[k], w = n[2].length * 7.2 + 24; s += box(n[0] - w / 2, n[1] - 16, w, 32, k[0] === "e" ? "var(--gold-soft)" : k === "ax" ? "var(--pri)" : "var(--card2)", k[0] === "e" ? "var(--gold)" : "var(--pri)", 10) + Tx(n[0], n[1], n[2], "font-size:13px;" + (k === "ax" ? "fill:var(--pri-ink)" : "")); });
    return svg("0 0 670 340", s);
  };
  F.cplano = function () {
    var k = 34, O = [170, 150], P = function (p) { return [O[0] + p[0] * k, O[1] - p[1] * k]; }, s = plane(null, k, 170, 150, 4);
    s += arrow(P([0, 0]), P([3, 2]), "var(--pri)", 3) + L(P([3, 0]), P([3, 2]), "stroke:var(--muted);stroke-dasharray:4 4") + L(P([0, 2]), P([3, 2]), "stroke:var(--muted);stroke-dasharray:4 4");
    s += arrow(P([0, 0]), P([3, -2]), CB, 2) + Tx(P([3, 2])[0] + 8, P([3, 2])[1] - 8, "z = 3 + 2i", "fill:var(--pri)", "start") + Tx(P([3, -2])[0] + 8, P([3, -2])[1] + 10, "z̄ = 3 − 2i", "fill:" + CB, "start");
    s += Tx(P([4.2, 0])[0], P([4.2, 0])[1] - 10, "Re", "fill:var(--muted);font-size:12px") + Tx(P([0, 4])[0] + 14, P([0, 4])[1] + 8, "Im", "fill:var(--muted);font-size:12px");
    s += Tx(P([1.2, 1.3])[0], P([1.2, 1.3])[1], "|z| = √13", "fill:var(--pri);font-size:12px");
    s += Tx(330, 40, "a + bi  ⟷  ponto (a, b)", "font-size:14px", "start") + Tx(330, 66, "soma = soma de setas", "font-size:13px;fill:var(--muted)", "start") + Tx(330, 88, "conjugado = reflexão no eixo real", "font-size:13px;fill:var(--muted)", "start") + Tx(330, 110, "|z| = comprimento da seta", "font-size:13px;fill:var(--muted)", "start") + Tx(330, 132, "×i = girar 90° (veja o laboratório)", "font-size:13px;fill:var(--muted)", "start");
    return svg("0 10 560 280", s);
  };
  F.fnDiscreta = function () {
    var v = [3, -1, 2, 4], s = "", X = 60, Y = 130, k = 22;
    s += L([X - 20, Y], [X + 300, Y], "stroke:var(--muted)");
    v.forEach(function (y, i) { var x = X + 30 + i * 70; s += L([x, Y], [x, Y - y * k], "stroke:var(--pri);stroke-width:3") + Ci(x, Y - y * k, 6, "fill:var(--pri)") + Tx(x, Y + 16, i + 1, "fill:var(--muted)") + Tx(x + 16, Y - y * k, "x(" + (i + 1) + ") = " + y, "font-size:12px", "start"); });
    s += Tx(400, 50, "(3, −1, 2, 4) ∈ F⁴", "font-size:15px", "start") + Tx(400, 76, "é a mesma informação que a função", "font-size:13px;fill:var(--muted)", "start") + Tx(400, 96, "x : {1, 2, 3, 4} → F", "font-size:14px;fill:var(--pri)", "start") + Tx(400, 118, "com x(k) = k-ésima coordenada.", "font-size:13px;fill:var(--muted)", "start");
    return svg("0 0 660 160", s);
  };

  // =================================================================== LAB · COMPLEXOS
  W.complexLab = function (h) {
    var c = ctrls(h), a = slider(c, "cxa", "Re z = a", -3, 3, 0.5, 2, function (x) { return fmt(x, 1); }), b = slider(c, "cxb", "Im z = b", -3, 3, 0.5, 1, function (x) { return fmt(x, 1); }), cc = slider(c, "cxc", "Re w = c", -3, 3, 0.5, 1, function (x) { return fmt(x, 1); }), d = slider(c, "cxd", "Im w = d", -3, 3, 0.5, 1, function (x) { return fmt(x, 1); });
    var mode = "soma"; seg(h, [["soma", "z + w"], ["prod", "z · w"], ["rot", "i · z (girar)"], ["conj", "conjugado z̄"], ["inv", "inverso 1/z"]], mode, function (m) { mode = m; draw(); });
    var S = scene(h, "0 0 420 420"), out = rows(h, [["c", "Conta passo a passo"], ["g", "O que acontece no plano"]]);
    function pol(x, y) { return "r = " + fmt(Math.hypot(x, y), 3) + ", θ ≈ " + fmt(Math.atan2(y, x) * 180 / Math.PI, 1) + "°"; }
    function cs(x, y) { return tf(x, 2) + (y < 0 ? "-" : "+") + tf(Math.abs(y), 2) + "i"; }
    function draw() {
      var A = +a.value, B = +b.value, C = +cc.value, D = +d.value, k = 24, O = [210, 210], P = function (p) { return [O[0] + p[0] * k, O[1] - p[1] * k]; }, s = plane(S, k, 210, 210, 8), r, txt, g;
      var z = [A, B], w = [C, D];
      s += Tx(P([8, 0])[0] - 6, P([8, 0])[1] - 10, "Re", "fill:var(--muted);font-size:12px", "end") + Tx(P([0, 8])[0] + 10, P([0, 8])[1] + 10, "Im", "fill:var(--muted);font-size:12px", "start");
      if (mode === "soma") { r = [A + C, B + D]; s += arrow(P([0, 0]), P(z), CA) + arrow(P([0, 0]), P(w), CB) + L(P(z), P(r), "stroke:" + CB + ";stroke-dasharray:5 4") + L(P(w), P(r), "stroke:" + CA + ";stroke-dasharray:5 4") + arrow(P([0, 0]), P(r), "var(--pri)", 3.5); txt = tex("(" + cs(A, B) + ")+(" + cs(C, D) + ")=(" + tf(A, 2) + "+" + tf(C, 2) + ")+(" + tf(B, 2) + "+" + tf(D, 2) + ")i=" + cs(r[0], r[1])); g = "Somar complexos é somar setas (regra do paralelogramo): exatamente como em ℝ². Por isso ℂ “é” ℝ² quando só somamos."; }
      else if (mode === "prod") { r = [A * C - B * D, A * D + B * C]; s += arrow(P([0, 0]), P(z), CA) + arrow(P([0, 0]), P(w), CB) + arrow(P([0, 0]), P(r), "var(--pri)", 3.5); txt = tex("(" + cs(A, B) + ")(" + cs(C, D) + ")=" + tf(A * C, 2) + "+" + tf(A * D, 2) + "i+" + tf(B * C, 2) + "i+" + tf(B * D, 2) + "i^2") + "<br>" + tex("=(" + tf(A * C, 2) + "-" + tf(B * D, 2) + ")+(" + tf(A * D, 2) + "+" + tf(B * C, 2) + ")i=" + cs(r[0], r[1])) + ' <span class="small muted">(usou i² = −1)</span>'; g = "Na forma polar: z: " + pol(A, B) + "; w: " + pol(C, D) + "; z·w: " + pol(r[0], r[1]) + ". Os comprimentos se MULTIPLICAM e os ângulos se SOMAM."; }
      else if (mode === "rot") { r = [-B, A]; s += arrow(P([0, 0]), P(z), CA) + arrow(P([0, 0]), P(r), "var(--pri)", 3.5) + '<path d="M' + P([A * .35, B * .35]).join(" ") + " A" + (Math.hypot(A, B) * k * .35) + " " + (Math.hypot(A, B) * k * .35) + " 0 0 0 " + P([-B * .35, A * .35]).join(" ") + '" style="fill:none;stroke:var(--gold);stroke-width:2"/>'; txt = tex("i(" + cs(A, B) + ")=" + tf(A, 2) + "i+" + tf(B, 2) + "i^2=" + cs(-B, A)); g = "Multiplicar por i gira a seta 90° no sentido anti-horário, sem mudar o comprimento. Por isso i² = −1: girar 90° duas vezes é virar para o lado oposto."; }
      else if (mode === "conj") { r = [A, -B]; s += arrow(P([0, 0]), P(z), CA) + arrow(P([0, 0]), P(r), "var(--pri)", 3) + L(P(z), P(r), "stroke:var(--muted);stroke-dasharray:4 4"); txt = tex("\\overline{" + cs(A, B) + "}=" + cs(A, -B) + ",\\quad z\\bar z=" + tf(A, 2) + "^2+" + tf(B, 2) + "^2=" + tf(A * A + B * B, 2)); g = "O conjugado reflete no eixo real. z·z̄ = a² + b² = |z|² é sempre real e ≥ 0: é o truque para dividir complexos."; }
      else { var m2 = A * A + B * B; if (!m2) { S.innerHTML = s; out.c.innerHTML = "z = 0 não tem inverso (como em ℝ)."; out.g.textContent = "Todo complexo NÃO NULO tem inverso multiplicativo; o 0 não."; return; } r = [A / m2, -B / m2]; s += arrow(P([0, 0]), P(z), CA) + arrow(P([0, 0]), P(r), "var(--pri)", 3); txt = tex("\\frac{1}{" + cs(A, B) + "}=\\frac{" + cs(A, -B) + "}{(" + cs(A, B) + ")(" + cs(A, -B) + ")}=\\frac{" + cs(A, -B) + "}{" + tf(m2, 2) + "}=" + cs(r[0], r[1])); g = "Multiplique em cima e embaixo pelo conjugado: o denominador vira |z|², um número real. Comprimento 1/|z| e ângulo oposto."; }
      s += Tx(P(z)[0] + 8, P(z)[1] - 8, "z", "fill:" + CA, "start") + (mode === "soma" || mode === "prod" ? Tx(P(w)[0] + 8, P(w)[1] - 8, "w", "fill:" + CB, "start") : "");
      S.innerHTML = s; out.c.innerHTML = txt; out.g.textContent = g;
    }
    [a, b, cc, d].forEach(function (x) { x.addEventListener("input", draw); }); draw();
  };

  // =================================================================== LAB · F^S (funções)
  var FN = { "x": function (x) { return x; }, "x²": function (x) { return x * x; }, "1 − x": function (x) { return 1 - x; }, "sen(2πx)": function (x) { return Math.sin(2 * Math.PI * x); }, "1/2": function () { return 0.5; }, "2x − 1": function (x) { return 2 * x - 1; } };
  W.funcLab = function (h) {
    var f = "x²", g = "sen(2πx)", mode = "soma", bx = el("div", { style: "display:grid;gap:8px" }); h.appendChild(bx);
    var sf = el("div", { class: "btns", style: "align-items:center" }, '<b class="small" style="color:var(--c-cos)">f =</b>'), sg2 = el("div", { class: "btns", style: "align-items:center" }, '<b class="small" style="color:var(--c-sen)">g =</b>'); bx.appendChild(sf); bx.appendChild(sg2);
    Object.keys(FN).forEach(function (k) { [[sf, "f"], [sg2, "g"]].forEach(function (p) { var b = el("button", { class: "btn s" + ((p[1] === "f" ? f : g) === k ? " p" : ""), type: "button" }, k); b.onclick = function () { if (p[1] === "f") f = k; else g = k; [].forEach.call(p[0].querySelectorAll("button"), function (x) { x.classList.toggle("p", x === b); }); draw(); }; p[0].appendChild(b); }); });
    seg(h, [["soma", "f + g"], ["esc", "λ f"], ["inv", "f + (−f) = 0"]], mode, function (m) { mode = m; draw(); });
    var c = ctrls(h), il = slider(c, "fnl", "λ", -2, 2, 0.5, 2, function (x) { return fmt(x, 1); }), ix = slider(c, "fnx", "ponto x₀ (para ver o valor)", 0, 1, 0.01, 0.3, function (x) { return fmt(x, 2); });
    var S = scene(h, "0 0 560 300"), out = rows(h, [["v", "No ponto x₀"], ["e", "Ideia"]]);
    function draw() {
      var F1 = FN[f], G1 = FN[g], lam = +il.value, x0 = +ix.value, res = mode === "soma" ? function (x) { return F1(x) + G1(x); } : mode === "esc" ? function (x) { return lam * F1(x); } : function () { return 0; };
      var X0 = 50, W0 = 480, Yc = 150, ky = 50, X = function (x) { return X0 + x * W0; }, Y = function (y) { return Yc - y * ky; }, s = "";
      for (var gy = -2; gy <= 2; gy++) s += L([X0, Y(gy)], [X0 + W0, Y(gy)], "stroke:var(--line)") + Tx(X0 - 8, Y(gy), gy, "fill:var(--muted);font-size:11px", "end");
      s += L([X0, Y(0)], [X0 + W0, Y(0)], "stroke:var(--muted);stroke-width:1.5") + Tx(X(0), Y(-2.6), "0", "fill:var(--muted);font-size:11px") + Tx(X(1), Y(-2.6), "1", "fill:var(--muted);font-size:11px");
      function curve(fn, col, w, dash) { var pts = []; for (var i = 0; i <= 100; i++) { var x = i / 100, y = Math.max(-2.8, Math.min(2.8, fn(x))); pts.push(f1(X(x)) + " " + f1(Y(y))); } return '<path d="M' + pts.join(" L") + '" style="fill:none;stroke:' + col + ";stroke-width:" + w + (dash ? ";stroke-dasharray:6 4" : "") + '"/>'; }
      s += curve(F1, CA, 2.5, mode !== "esc" ? false : true);
      if (mode === "soma") s += curve(G1, CB, 2.5, true);
      if (mode === "inv") s += curve(function (x) { return -F1(x); }, CB, 2.5, true);
      s += curve(res, "var(--pri)", 3.5);
      var fx = F1(x0), gx = mode === "soma" ? G1(x0) : mode === "inv" ? -F1(x0) : 0, rx = res(x0);
      s += L([X(x0), Y(-2.8)], [X(x0), Y(2.8)], "stroke:var(--gold);stroke-width:1.5;stroke-dasharray:3 3");
      var bxp = X(x0) + 8; s += R(bxp, Math.min(Y(0), Y(fx)), 8, Math.abs(Y(fx) - Y(0)), "fill:" + CA) ;
      if (mode !== "esc") s += R(bxp + 10, Math.min(Y(fx), Y(fx + gx)), 8, Math.abs(Y(fx + gx) - Y(fx)), "fill:" + CB);
      s += Ci(X(x0), Y(rx), 5, "fill:var(--pri)");
      S.innerHTML = s;
      out.v.innerHTML = mode === "soma" ? tex("(f+g)(" + tf(x0, 2) + ")=f(" + tf(x0, 2) + ")+g(" + tf(x0, 2) + ")=" + tf(fx, 3) + (gx < 0 ? "" : "+") + tf(gx, 3) + "=" + tf(rx, 3)) : mode === "esc" ? tex("(\\lambda f)(" + tf(x0, 2) + ")=\\lambda\\,f(" + tf(x0, 2) + ")=" + tf(lam, 1) + "\\cdot" + tf(fx, 3) + "=" + tf(rx, 3)) : tex("(f+(-f))(x_0)=f(x_0)+(-f)(x_0)=" + tf(fx, 3) + (-fx < 0 ? "" : "+") + tf(-fx, 3) + "=0");
      out.e.textContent = mode === "soma" ? "A soma de funções é feita PONTO A PONTO: em cada x somamos os dois números (barras empilhadas). O resultado é outra função de [0,1] em ℝ: um novo “vetor” de ℝ^[0,1]." : mode === "esc" ? "λf multiplica cada valor por λ: estica/encolhe o gráfico verticalmente e, se λ < 0, reflete no eixo x." : "−f é o reflexo de f no eixo x; somadas, dão a função identicamente nula 0(x) = 0, o vetor zero de ℝ^[0,1].";
    }
    [il, ix].forEach(function (x) { x.addEventListener("input", draw); }); draw();
  };
  W.seqLab = function (h) {
    var SQ = { "1/k": function (k) { return 1 / k; }, "(−1)ᵏ": function (k) { return k % 2 ? -1 : 1; }, "k/4": function (k) { return k / 4; }, "2⁻ᵏ·3": function (k) { return 3 * Math.pow(2, -k); }, "0": function () { return 0; } };
    var x = "1/k", y = "(−1)ᵏ", mode = "soma";
    var sx = el("div", { class: "btns", style: "align-items:center" }, '<b class="small" style="color:var(--c-cos)">x =</b>'), sy = el("div", { class: "btns", style: "align-items:center" }, '<b class="small" style="color:var(--c-sen)">y =</b>'); h.appendChild(sx); h.appendChild(sy);
    Object.keys(SQ).forEach(function (k) { [[sx, "x"], [sy, "y"]].forEach(function (p) { var b = el("button", { class: "btn s" + ((p[1] === "x" ? x : y) === k ? " p" : ""), type: "button" }, k); b.onclick = function () { if (p[1] === "x") x = k; else y = k; [].forEach.call(p[0].querySelectorAll("button"), function (q) { q.classList.toggle("p", q === b); }); draw(); }; p[0].appendChild(b); }); });
    seg(h, [["soma", "x + y"], ["esc", "λ x"]], mode, function (m) { mode = m; draw(); });
    var c = ctrls(h), il = slider(c, "sql", "λ", -2, 2, 0.5, 2, function (v) { return fmt(v, 1); });
    var S = scene(h, "0 0 560 260"), out = rows(h, [["t", "Primeiros termos"]]);
    function draw() {
      var X1 = SQ[x], Y1 = SQ[y], lam = +il.value, R1 = function (k) { return mode === "soma" ? X1(k) + Y1(k) : lam * X1(k); }, s = "", Yc = 130, ky = 40;
      s += L([30, Yc], [540, Yc], "stroke:var(--muted)");
      for (var k = 1; k <= 12; k++) {
        var px = 20 + k * 40;
        [[X1(k), CA, -9], [mode === "soma" ? Y1(k) : null, CB, 0], [R1(k), "var(--pri)", 9]].forEach(function (q) { if (q[0] === null) return; var yy = Math.max(-3, Math.min(3, q[0])); s += L([px + q[2], Yc], [px + q[2], Yc - yy * ky], "stroke:" + q[1] + ";stroke-width:2.5") + Ci(px + q[2], Yc - yy * ky, 4, "fill:" + q[1]); });
        s += Tx(px, Yc + 118, k, "fill:var(--muted);font-size:11px");
      }
      s += Tx(540, 14, "azul: x · rosa: y · roxo: resultado", "fill:var(--muted);font-size:11px", "end");
      S.innerHTML = s;
      var lst = function (fn) { var a = []; for (var k = 1; k <= 5; k++) a.push(fmt(fn(k), 3)); return "(" + a.join(", ") + ", …)"; };
      out.t.innerHTML = (mode === "soma" ? "x + y = " : "λx = ") + lst(R1) + '<br><span class="small muted">Operação termo a termo: a sequência é um “vetor com infinitas coordenadas”.</span>';
    }
    il.addEventListener("input", draw); draw();
  };

  // =================================================================== LAB · ℝ ∪ {∞, −∞} (exercício 6)
  W.infLab = function (h) {
    var I = "∞", NI = "−∞";
    function add(p, q) { if (p === I && q === NI || p === NI && q === I) return 0; if (p === I || q === I) return I; if (p === NI || q === NI) return NI; return p + q; }
    function mul(t, p) { if (p === I) return t < 0 ? NI : t === 0 ? 0 : I; if (p === NI) return t < 0 ? I : t === 0 ? 0 : NI; return t * p; }
    function sh(p) { return typeof p === "number" ? (p < 0 ? "(" + p + ")" : String(p)).replace("-", "−") : p === NI ? "(−∞)" : p; }
    var V = [-2, -1, 0, 1, 2, I, NI], S2 = [-2, -1, 0, 1, 2, 3];
    var st = { u: I, v: I, w: NI, a: 2, b: -1 };
    function pick(name, list) { var r = el("div", { class: "btns", style: "align-items:center" }, '<b class="small" style="min-width:24px">' + name + " =</b>"); list.forEach(function (x) { var b = el("button", { class: "btn s" + (st[name] === x ? " p" : ""), type: "button" }, typeof x === "number" ? String(x).replace("-", "−") : x); b.onclick = function () { st[name] = x; [].forEach.call(r.querySelectorAll("button"), function (q) { q.classList.toggle("p", q === b); }); draw(); }; r.appendChild(b); }); h.appendChild(r); }
    pick("u", V); pick("v", V); pick("w", V); pick("a", S2); pick("b", S2);
    var out = el("div", { class: "rows" }); h.appendChild(out);
    function draw() {
      var u = st.u, v = st.v, w = st.w, a = st.a, b = st.b, T = [];
      function row(name, lhsT, lhs, rhsT, rhs) { var ok = lhs === rhs; T.push('<div class="row" style="grid-template-columns:24px 1fr"><b style="color:' + (ok ? "var(--ok)" : "var(--bad)") + '">' + (ok ? "✓" : "✗") + "</b><span><b>" + name + ":</b> " + lhsT + " = <b>" + sh(lhs) + "</b> &nbsp;vs&nbsp; " + rhsT + " = <b>" + sh(rhs) + "</b></span></div>"); }
      row("comutatividade", "u + v = " + sh(u) + " + " + sh(v), add(u, v), "v + u", add(v, u));
      row("associatividade (+)", "(u + v) + w = " + sh(add(u, v)) + " + " + sh(w), add(add(u, v), w), "u + (v + w) = " + sh(u) + " + " + sh(add(v, w)), add(u, add(v, w)));
      row("associatividade (·)", "(ab)v = " + sh(a * b) + "·" + sh(v), mul(a * b, v), "a(bv) = " + sh(a) + "·" + sh(mul(b, v)), mul(a, mul(b, v)));
      row("distributiva (a+b)v", "(" + sh(a) + "+" + sh(b) + ")·" + sh(v), mul(a + b, v), "av + bv = " + sh(mul(a, v)) + " + " + sh(mul(b, v)), add(mul(a, v), mul(b, v)));
      row("distributiva a(u+v)", sh(a) + "·(" + sh(u) + " + " + sh(v) + ")", mul(a, add(u, v)), "au + av = " + sh(mul(a, u)) + " + " + sh(mul(a, v)), add(mul(a, u), mul(a, v)));
      row("identidade 0", "u + 0", add(u, 0), "u", u);
      row("1·u = u", "1·" + sh(u), mul(1, u), "u", u);
      out.innerHTML = T.join("") + '<p class="small muted" style="margin-top:6px">Procure uma escolha que dê ✗: um único contraexemplo derruba a estrutura.</p>';
    }
    draw();
  };

  // =================================================================== PAUSA DIALÓGICA (com feedback por IA quando disponível)
  function texText(node) { // texto com o LaTeX original de volta
    var c = node.cloneNode(true);
    [].forEach.call(c.querySelectorAll(".katex-display"), function (k) { var a = k.querySelector("annotation"); k.replaceWith("\\[" + (a ? a.textContent : "") + "\\]"); });
    [].forEach.call(c.querySelectorAll(".katex"), function (k) { var a = k.querySelector("annotation"); k.replaceWith("\\(" + (a ? a.textContent : "") + "\\)"); });
    [].forEach.call(c.querySelectorAll("button,textarea,.ptag"), function (k) { k.remove(); });
    return c.textContent.replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();
  }
  function mdLite(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/^#+\s*(.+)$/gm, "<b>$1</b>"); }
  var SAMPLE = null, sampleReady = (window.claude && window.claude.use ? window.claude.use("sample").then(function (s) { SAMPLE = s; return s; }).catch(function () { return null; }) : Promise.resolve(null));
  W.pausa = function (h, o) {
    var id = o.id || ("p" + Math.random()), q = h.querySelector(".pq"), sol = h.querySelector(".psol"), T = T_();
    if (sol) sol.hidden = true;
    h.insertAdjacentHTML("afterbegin", '<div class="ptag">⏸ Pausa interativa · ' + (o.tipo || "pense antes de avançar") + "</div>");
    var note = el("p", { class: "small", style: "margin:0;font-weight:700" }, "[PAUSA: tente resolver antes de avançar. Escreva sua tentativa abaixo e, quando estiver pronto, peça o feedback ou a resposta comentada.]");
    h.appendChild(note);
    var ta = el("textarea", { id: "pa-" + id, placeholder: "Sua tentativa (pode usar texto livre; para fórmulas, escreva como no caderno: 0v = (0+0)v = …)" });
    try { ta.value = localStorage.getItem("ax1b-pausa-" + id) || ""; } catch (e) {}
    ta.addEventListener("input", function () { try { localStorage.setItem("ax1b-pausa-" + id, ta.value); } catch (e) {} });
    h.appendChild(ta);
    var bb = el("div", { class: "btns" }), bF = el("button", { class: "btn p s", type: "button", hidden: "" }, "💬 Pedir feedback da minha tentativa"), bS = el("button", { class: "btn s", type: "button" }, "👁 Ver resposta comentada"), bStop = el("button", { class: "btn s", type: "button", hidden: "" }, "Parar");
    bb.appendChild(bF); bb.appendChild(bStop); bb.appendChild(bS); h.appendChild(bb);
    var fb = el("div", { class: "fbk", hidden: "" }); h.appendChild(fb);
    if (sol) h.appendChild(sol);
    var warned = false;
    function mark(xp) { var P = T.S.pausas || (T.S.pausas = {}); if (!P[id]) { P[id] = 1; T.addXP(xp, "pausa interativa"); } else T.save(); }
    bS.onclick = function () {
      if (!ta.value.trim() && !warned) { warned = true; note.innerHTML = "Ainda não há tentativa escrita. Vale muito mais tentar primeiro, mesmo que seja só a ideia. <b>Se quiser ver mesmo assim, clique de novo.</b>"; return; }
      if (sol) { sol.hidden = false; bS.hidden = true; mark(ta.value.trim() ? 5 : 2); }
    };
    sampleReady.then(function (s) { if (s) bF.hidden = false; });
    var ctl = null;
    bStop.onclick = function () { if (ctl) ctl.abort(); };
    bF.onclick = function () {
      if (!SAMPLE) return;
      if (ta.value.trim().length < 10) { fb.hidden = false; fb.textContent = "Escreva sua tentativa (mesmo incompleta) para receber um feedback sobre ela."; return; }
      var prompt = "Você é professor adjunto de Álgebra Linear (curso superior de Matemática), corrigindo com rigor e gentileza a tentativa de um aluno, em português do Brasil.\n\n" +
        "CONTEXTO: seção 1B de Linear Algebra Done Right (Axler): definição de espaço vetorial (comutatividade; associatividade da soma e (ab)v = a(bv); identidade aditiva; inverso aditivo; 1v = v; distributivas), unicidade do zero e do inverso, 0v = 0, a0 = 0, (−1)v = −v. F denota R ou C.\n\n" +
        "QUESTÃO:\n" + texText(q) + "\n\n" + (sol ? "RESOLUÇÃO DE REFERÊNCIA (não copie inteira; use para avaliar):\n" + texText(sol).slice(0, 6000) + "\n\n" : "") +
        "TENTATIVA DO ALUNO:\n" + ta.value.slice(0, 6000) + "\n\n" +
        "RESPONDA em até ~250 palavras, nesta ordem: 1) Veredito curto (correta / parcialmente correta / incorreta). 2) O que está certo. 3) Lacunas de rigor: cada passo deve citar qual axioma ou resultado justifica a igualdade; aponte os que faltaram. 4) Uma dica para o próximo passo (sem entregar a solução inteira, a menos que a tentativa esteja muito longe). Use \\( \\) para fórmulas. Não use tabelas.";
      ctl = new AbortController(); fb.hidden = false; fb.textContent = "Pensando…"; bF.disabled = true; bStop.hidden = false;
      SAMPLE(prompt, { signal: ctl.signal, cache: false, onText: function (u) { fb.textContent = u.text; } }).then(function (r) {
        fb.innerHTML = mdLite(r.text); T.renderMath(fb); mark(5);
      }).catch(function (e) {
        var keep = e && e.text ? mdLite(e.text) + "<br>" : "";
        var msg = { not_granted: "O feedback por IA não foi autorizado nesta visualização. Use a resposta comentada.", rate_limited: "Muitos pedidos agora; tente de novo em alguns minutos.", cancelled: "" }[e && e.code] ;
        fb.innerHTML = keep + (msg === undefined ? "Não foi possível obter o feedback agora. Tente de novo ou abra a resposta comentada." : msg);
        if (e && (e.code === "not_granted" || e.code === "sampling_disabled")) bF.hidden = true;
        T.renderMath(fb);
      }).then(function () { bF.disabled = false; bStop.hidden = true; });
    };
  };

  // =================================================================== PROVA INTERATIVA (justifique cada igualdade)
  W.proofLab = function (h, o) {
    var T = T_(), box2 = el("div", { class: "proof" }); h.appendChild(box2);
    o.linhas.forEach(function (ln, i) {
      var r = el("div", { class: "pr" }), sel = '<select aria-label="Justificativa do passo ' + (i + 1) + '"><option value="">— por quê? escolha —</option>' + o.opcoes.map(function (op) { return '<option value="' + op[0] + '">' + op[1] + "</option>"; }).join("") + "</select>";
      r.innerHTML = "<div>" + tex(ln.tex) + "</div><div>" + sel + '</div><div class="why" hidden>' + ln.why + "</div>";
      box2.appendChild(r);
    });
    var bb = el("div", { class: "btns" }), bc = el("button", { class: "btn p s", type: "button" }, "Conferir justificativas"), br = el("button", { class: "btn s", type: "button" }, "Mostrar todas"), msg = el("div", {}); bb.appendChild(bc); bb.appendChild(br); h.appendChild(bb); h.appendChild(msg);
    function check(force) {
      var rowsEl = box2.querySelectorAll(".pr"), okN = 0;
      o.linhas.forEach(function (ln, i) { var r = rowsEl[i], s = r.querySelector("select"); if (force) s.value = ln.ans; var ok = s.value === ln.ans; if (ok) okN++; r.classList.toggle("ok", ok); r.classList.toggle("no", !ok && !!s.value); r.querySelector(".why").hidden = !(ok || force || s.value); });
      T.renderMath(box2);
      if (okN === o.linhas.length) { msg.innerHTML = '<div class="final"><b>Prova completa.</b> ' + (o.fim || "") + "</div>"; T.renderMath(msg); if (!force) { var P = T.S.pausas || (T.S.pausas = {}); if (!P["prova-" + o.id]) { P["prova-" + o.id] = 1; T.addXP(8, "prova justificada"); } } T.beep(force ? "ok" : "lvl"); }
      else msg.innerHTML = '<div class="alert bad">' + okN + " de " + o.linhas.length + " certas. Releia o passo marcado: qual axioma transforma o lado esquerdo no direito?</div>";
    }
    bc.onclick = function () { check(false); }; br.onclick = function () { check(true); };
  };

  // =================================================================== JOGOS
  var AXQ = [["u + v = v + u", "com"], ["(u + v) + w = u + (v + w)", "ass"], ["(2·3)v = 2(3v)", "asse"], ["v + 0 = v", "id"], ["v + (−v) = 0", "inv"], ["1·v = v", "um"], ["5(u + w) = 5u + 5w", "dis"], ["(2 + 7)v = 2v + 7v", "dis"], ["x² + 0 = x²   (em ℝ^ℝ)", "id"], ["f + g = g + f   (funções)", "com"], ["(ab)f = a(bf)", "asse"], ["(1 + (−1))v = 1v + (−1)v", "dis"], ["0v + (−0v) = 0", "inv"], ["(−1)v + v = v + (−1)v", "com"], ["3(0 + 0) = 3·0 + 3·0", "dis"], ["(w + v) + w′ = w + (v + w′)", "ass"]];
  var AXN = { com: "Comutatividade", ass: "Associatividade da soma", asse: "Associatividade do escalar", id: "Identidade aditiva", inv: "Inverso aditivo", um: "Identidade multiplicativa (1v = v)", dis: "Distributiva" };
  var EVQ = [["𝐅ⁿ com as operações usuais", 1], ["𝐅^∞ (sequências), termo a termo", 1], ["ℝ^[0,1] (funções de [0,1] em ℝ)", 1], ["{0} (só o vetor nulo)", 1], ["O conjunto vazio ∅", 0], ["ℝ² com α(a, b) = (αa, b)", 0], ["ℂ sobre ℝ (escalares reais)", 1], ["ℂ sobre ℂ", 1], ["ℝ sobre ℂ (escalares complexos)", 0], ["ℤ² com as operações de ℝ², escalares reais", 0], ["ℝ ∪ {∞, −∞} do exercício 6", 0], ["ℝ₊ com x⊕y = xy e λ⊙x = x^λ", 1], ["Sequências que convergem a 0", 1], ["Sequências que convergem a 1", 0], ["Funções f: ℝ → ℝ com f(0) = 0", 1], ["Funções f: ℝ → ℝ com f(0) = 5", 0], ["V^S (funções de S em V)", 1], ["Polinômios com coeficientes reais", 1], ["Polinômios de grau exatamente 3", 0], ["ℝ² com (a,b)+(c,d) = (a+c, 0)", 0]];
  W.games = function (host) {
    if (!host) return;
    var T = window.T, S = T.S, g = "axioma";
    seg(host, [["axioma", "Qual axioma?"], ["ev", "É espaço vetorial?"], ["cx", "Complexo rápido"]], g, function (v) { g = v; setup(); });
    var gbox = el("div", { class: "card game" }); host.appendChild(gbox);
    var timer = 0, left = 0, score = 0, running = false;
    var DESC = { axioma: "Aparece uma igualdade. Escolha a propriedade da definição que a justifica.", ev: "Decida se a estrutura é um espaço vetorial (com as operações indicadas).", cx: "Faça a conta com números complexos." };
    function setup() {
      clearInterval(timer); running = false;
      gbox.innerHTML = '<div class="gstat"><span class="chip">' + T.icon("clock") + ' <b id="gT">45</b> s</span><span class="chip">' + T.icon("check") + ' <b id="gS">0</b> pontos</span><span class="chip">' + T.icon("trophy") + " recorde: <b>" + (S.games[g] || 0) + '</b></span></div><p class="small muted" style="text-align:center">' + DESC[g] + ' 45 segundos.</p><div class="gbig" id="gQ">Pronto?</div><div id="gA"></div><div class="btns" style="justify-content:center"><button class="btn p" id="gGo" type="button">' + T.icon("play") + " Começar</button></div>";
      gbox.querySelector("#gGo").onclick = start;
    }
    function start() { score = 0; left = 45; running = true; gbox.querySelector("#gGo").hidden = true; gbox.querySelector("#gS").textContent = 0; clearInterval(timer); timer = setInterval(function () { left--; gbox.querySelector("#gT").textContent = left; if (left <= 0) end(); }, 1000); next(); }
    function end() { clearInterval(timer); running = false; var best = S.games[g] || 0; if (score > best || S.games[g] == null) S.games[g] = Math.max(best, score); T.save(); gbox.querySelector("#gQ").innerHTML = "Fim! " + score + " ponto" + (score === 1 ? "" : "s"); gbox.querySelector("#gA").innerHTML = ""; var b = gbox.querySelector("#gGo"); b.hidden = false; b.innerHTML = T.icon("play") + " Jogar de novo"; T.addXP(Math.min(15, score), "jogo"); }
    function hit(ok) { if (!running) return; if (ok) { score++; T.beep("ok"); } else T.beep("bad"); gbox.querySelector("#gS").textContent = score; }
    function buttons(opts, right, cols) {
      var A = gbox.querySelector("#gA"); A.innerHTML = '<div class="grid" style="grid-template-columns:repeat(' + (cols || 2) + ',1fr);max-width:520px;margin:0 auto"></div>';
      opts.forEach(function (o) { var b = el("button", { class: "btn", type: "button", style: "font-size:1rem" }, o[0]); b.onclick = function () { var ok = o[1] === right; hit(ok); b.classList.add(ok ? "p" : "wrong"); [].forEach.call(A.firstChild.children, function (x) { x.disabled = true; }); setTimeout(next, ok ? 300 : 1000); }; A.firstChild.appendChild(b); });
    }
    function sup(t) { return t.replace(/\^(\[[^\]]*\]|[^\s)]+)/g, "<sup>$1</sup>"); }
    function next() {
      if (!running) return;
      var Q = gbox.querySelector("#gQ");
      if (g === "axioma") {
        var q = rnd(AXQ), keys = shuffle(Object.keys(AXN).filter(function (k) { return k !== q[1]; })).slice(0, 3).concat([q[1]]);
        Q.innerHTML = '<span style="font-size:1.25rem">' + sup(q[0]) + "</span>"; buttons(shuffle(keys).map(function (k) { return [AXN[k], k]; }), q[1]);
      } else if (g === "ev") {
        var e = rnd(EVQ); Q.innerHTML = '<span style="font-size:1.05rem">' + sup(e[0]) + "</span>"; buttons([["Sim", 1], ["Não", 0]], e[1]);
      } else {
        var t = ri(0, 3), a = ri(-3, 4), b = ri(-3, 4), c = ri(-3, 4), d = ri(-3, 4), right, wrong = [], txt;
        function cs(x, y) { var re = x < 0 ? "−" + (-x) : String(x), m = Math.abs(y) === 1 ? "" : String(Math.abs(y)); if (y === 0) return re; if (x === 0) return (y < 0 ? "−" : "") + m + "i"; return re + (y < 0 ? " − " : " + ") + m + "i"; }
        if (t === 0) { txt = "(" + cs(a, b) + ") + (" + cs(c, d) + ")"; right = cs(a + c, b + d); wrong = [cs(a + c, b - d), cs(a * c, b * d), cs(a - c, b + d)]; }
        else if (t === 1) { txt = "(" + cs(a, b) + ")(" + cs(c, d) + ")"; right = cs(a * c - b * d, a * d + b * c); wrong = [cs(a * c + b * d, a * d + b * c), cs(a * c, b * d), cs(a * c - b * d, a * d - b * c)]; }
        else if (t === 2) { var n = ri(2, 11), vals = ["1", "i", "−1", "−i"]; txt = "i<sup>" + n + "</sup>"; right = vals[n % 4]; wrong = vals.filter(function (x) { return x !== right; }); }
        else { var p = rnd([[3, 4, 5], [6, 8, 10], [5, 12, 13], [1, 1, "√2"], [0, 7, 7]]); txt = "|" + cs(p[0], p[1]) + "|"; right = String(p[2]); wrong = [String(p[0] + p[1]), String(p[0] * p[0] + p[1] * p[1]), "√" + (p[0] + p[1])]; }
        var opts = [right]; wrong.forEach(function (w2) { if (opts.indexOf(w2) < 0 && opts.length < 4) opts.push(w2); });
        Q.innerHTML = '<span style="font-size:1.25rem">' + txt.replace(/\^(\d+)/, "<sup>$1</sup>") + "</span>"; buttons(shuffle(opts).map(function (o) { return [o, o]; }), right);
      }
    }
    setup();
  };
})();
