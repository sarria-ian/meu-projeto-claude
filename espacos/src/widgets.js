/* Laboratórios, animações, figuras e jogos da apostila de Espaços Vetoriais. */
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


  // =================================================================== ÁLGEBRA LINEAR EXATA
  function fneg(a) { return { n: -a.n, d: a.d }; }
  function fsub(a, b) { return fadd(a, fneg(b)); }
  function fdiv(a, b) { return fr(a.n * b.d, a.d * b.n); }
  function fz(a) { return a.n === 0n; }
  function feq(a, b) { return a.n === b.n && a.d === b.d; }
  function F0() { return fr(0); } function F1() { return fr(1); }
  function fparse(s) {
    s = String(s).trim().replace(/[−–]/g, "-");
    var m = s.match(/^([+-]?\d+)(?:\/([+-]?\d+))?$/); if (m) { if (m[2] && +m[2] === 0) return null; return fr(m[1], m[2] || 1); }
    m = s.match(/^([+-]?)(\d*)[.,](\d+)$/); if (m) return fr(BigInt(m[1] + (m[2] || "0") + m[3]), 10n ** BigInt(m[3].length));
    return null;
  }
  function ft(a) { return fTex(a).replace(/\\frac/g, "\\tfrac"); }
  function copy(M) { return M.map(function (r) { return r.slice(); }); }
  function parseMat(txt) {
    var rows = String(txt).trim().split(/\n+/).map(function (r) { return r.trim(); }).filter(Boolean).map(function (r) { return r.split(/[\s;]+/).filter(Boolean).map(fparse); });
    if (!rows.length) return null; var c = rows[0].length;
    if (!c || rows.some(function (r) { return r.length !== c || r.some(function (x) { return !x; }); })) return null;
    return rows;
  }
  function parseVecs(txt) { // "(1,2,3) (0,1,1)" ou uma por linha
    var s = String(txt).replace(/[−–]/g, "-"), groups = s.match(/\(([^)]*)\)/g);
    if (!groups) groups = s.split(/\n+/).filter(function (l) { return l.trim(); }).map(function (l) { return "(" + l + ")"; });
    var V = groups.map(function (g) { return g.replace(/[()]/g, "").split(/[,;\s]+/).filter(Boolean).map(fparse); });
    if (!V.length || V.some(function (v) { return !v.length || v.some(function (x) { return !x; }); })) return null;
    var n = V[0].length; if (V.some(function (v) { return v.length !== n; })) return null;
    return V;
  }
  function matTex(M, aug) {
    var c = M[0].length, spec = aug ? "r".repeat(c - 1) + "|r" : "r".repeat(c);
    return "\\left[\\begin{array}{" + spec + "}" + M.map(function (r) { return r.map(ft).join("&"); }).join("\\\\") + "\\end{array}\\right]";
  }
  function vecTex(v) { return "(" + v.map(ft).join(",\\,") + ")"; }
  function colTex(v) { return "\\begin{bmatrix}" + v.map(ft).join("\\\\") + "\\end{bmatrix}"; }
  function coefTex(f, first) { // f·(algo): "+2", "-", "+\tfrac12"…
    var neg = f.n < 0n, a = neg ? fneg(f) : f, body = feq(a, F1()) ? "" : ft(a);
    return (neg ? "-" : first ? "" : "+") + body;
  }
  function gauss(M0, aug, full) {
    var M = copy(M0), m = M.length, n = M[0].length, nc = aug ? n - 1 : n, steps = [], piv = [], row = 0;
    for (var col = 0; col < nc && row < m; col++) {
      var p = -1, i;
      for (i = row; i < m; i++) if (!fz(M[i][col])) { p = i; break; }
      if (p < 0) continue;
      for (i = row; i < m; i++) if (feq(M[i][col], F1()) || feq(M[i][col], fr(-1))) { p = i; break; }
      if (p !== row) { var t = M[p]; M[p] = M[row]; M[row] = t; steps.push({ op: "L_{" + (row + 1) + "}\\leftrightarrow L_{" + (p + 1) + "}", why: "troca de linhas para ter um pivô simples", M: copy(M) }); }
      for (i = row + 1; i < m; i++) {
        if (fz(M[i][col])) continue;
        var f = fdiv(M[i][col], M[row][col]);
        M[i] = M[i].map(function (x, j) { return fsub(x, fmul(f, M[row][j])); });
        steps.push({ op: "L_{" + (i + 1) + "}\\leftarrow L_{" + (i + 1) + "}" + coefTex(fneg(f)) + "L_{" + (row + 1) + "}", why: "zerar abaixo do pivô da coluna " + (col + 1), M: copy(M) });
      }
      piv.push(col); row++;
    }
    var ech = steps.length;
    if (full) {
      for (var k = piv.length - 1; k >= 0; k--) {
        var c = piv[k], pv = M[k][c];
        if (!feq(pv, F1())) { var inv = fdiv(F1(), pv); M[k] = M[k].map(function (x) { return fmul(x, inv); }); steps.push({ op: "L_{" + (k + 1) + "}\\leftarrow " + coefTex(inv, true) + "L_{" + (k + 1) + "}", why: "deixar o pivô igual a 1", M: copy(M) }); }
        for (var i2 = 0; i2 < k; i2++) {
          if (fz(M[i2][c])) continue;
          var f2 = M[i2][c];
          M[i2] = M[i2].map(function (x, j) { return fsub(x, fmul(f2, M[k][j])); });
          steps.push({ op: "L_{" + (i2 + 1) + "}\\leftarrow L_{" + (i2 + 1) + "}" + coefTex(fneg(f2)) + "L_{" + (k + 1) + "}", why: "zerar acima do pivô", M: copy(M) });
        }
      }
    }
    var incons = aug && M.some(function (r) { return r.slice(0, nc).every(fz) && !fz(r[nc]); });
    return { steps: steps, R: M, piv: piv, ech: ech, incons: incons, nc: nc };
  }
  function nullBasis(G) { // a partir da forma reduzida
    var R = G.R, nc = G.nc, piv = G.piv, free = [];
    for (var j = 0; j < nc; j++) if (piv.indexOf(j) < 0) free.push(j);
    return free.map(function (f) { var v = []; for (var j = 0; j < nc; j++) v.push(F0()); v[f] = F1(); piv.forEach(function (c, k) { v[c] = fneg(R[k][f]); }); return { free: f, v: v }; });
  }
  function intScale(v) { // multiplica por mmc dos denominadores
    var L = 1n; v.forEach(function (x) { L = L / bgcd(L, x.d) * x.d; });
    var w = v.map(function (x) { return x.n * (L / x.d); }), g = 0n; w.forEach(function (x) { g = bgcd(g, x < 0n ? -x : x); }); if (!g) g = 1n;
    var first = w.find(function (x) { return x !== 0n; }); var sgn = first < 0n ? -1n : 1n;
    return w.map(function (x) { return fr(x * sgn / g); });
  }
  function varName(j, n) { return n <= 4 ? "xyzw"[j] : "x_{" + (j + 1) + "}"; }
  function stepsHTML(G, aug, full) {
    var s = "", M0 = G.M0;
    s += '<div class="st"><span class="pl">Matriz inicial</span><div class="m">\\[' + matTex(M0, aug) + "\\]</div></div>";
    G.steps.forEach(function (x, i) {
      if (full && i === G.ech && G.ech > 0) s += '<div class="st"><span class="pl">Forma escalonada</span><p>Abaixo de cada pivô só há zeros. Agora, para a forma <b>reduzida</b>, deixamos os pivôs iguais a 1 e zeramos acima deles.</p></div>';
      s += '<div class="st"><span class="pl">Passo ' + (i + 1) + " · " + x.why + '</span><div class="m">\\[' + x.op + "\\qquad" + matTex(x.M, aug) + "\\]</div></div>";
    });
    if (!G.steps.length) s += '<div class="st"><span class="pl">Nada a fazer</span><p>A matriz já está escalonada.</p></div>';
    return s;
  }
  function solveHTML(G) { // classificação e solução de sistema (aug)
    var nc = G.nc, R = G.R, r = G.piv.length, s = "";
    if (G.incons) return '<div class="final"><b>Sistema impossível (SI):</b> apareceu uma linha do tipo \\(0=c\\), com \\(c\\ne0\\). Não há solução.</div>';
    var nb = nullBasis(G), names = []; for (var j = 0; j < nc; j++) names.push(varName(j, nc));
    var part = []; for (var j2 = 0; j2 < nc; j2++) part.push(F0()); G.piv.forEach(function (c, k) { part[c] = R[k][nc]; });
    if (!nb.length) return '<div class="final"><b>Sistema possível e determinado (SPD):</b> posto ' + r + " = número de incógnitas. Solução única: \\(" + names.map(function (nm, j) { return nm + "=" + ft(part[j]); }).join(",\\ ") + "\\).</div>";
    var params = ["t", "s", "u", "r", "p", "q"], expr = [];
    for (var j3 = 0; j3 < nc; j3++) {
      var terms = (fz(part[j3]) ? "" : ft(part[j3]));
      nb.forEach(function (b, i) { if (!fz(b.v[j3])) terms += (terms ? coefTex(b.v[j3]) : coefTex(b.v[j3], true)) + params[i]; });
      expr.push(terms || "0");
    }
    return '<div class="final"><b>Sistema possível e indeterminado (SPI):</b> posto ' + r + " &lt; " + nc + " incógnitas, então há " + nb.length + " variável(is) livre(s) (" + nb.map(function (b, i) { return "\\(" + names[b.free] + "=" + params[i] + "\\)"; }).join(", ") + ").<br>Solução geral: \\(" + vecTex([]).replace("()", "(") + expr.join(",\\ ") + ")\\), com " + nb.map(function (b, i) { return params[i]; }).join(", ") + " \\(\\in\\mathbb R\\).</div>";
  }
  W.gauss = gauss;

  // =================================================================== FIGURAS
  var F = W.fig;
  function iso(p) { return [200 + (p[0] - p[1]) * 0.87 * 34, 170 + (p[0] + p[1]) * 0.5 * 34 - p[2] * 34]; }
  function axes3(s) {
    [[[0, 0, 0], [4, 0, 0], "x"], [[0, 0, 0], [0, 4, 0], "y"], [[0, 0, 0], [0, 0, 4], "z"]].forEach(function (a) { var A = iso(a[0]), B = iso(a[1]); s.v += L(A, B, "stroke:var(--muted);stroke-width:1.5") + Tx(B[0] + (a[2] === "y" ? -10 : 10), B[1] + (a[2] === "z" ? -8 : 6), a[2], "fill:var(--muted);font-size:13px"); });
  }
  function arrow(A, B, col, w) { var dx = B[0] - A[0], dy = B[1] - A[1], d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d, h = 11; return L(A, [B[0] - ux * h * .6, B[1] - uy * h * .6], "stroke:" + col + ";stroke-width:" + (w || 3) + ";stroke-linecap:round") + Pg([B, [B[0] - ux * h - uy * h * .45, B[1] - uy * h + ux * h * .45], [B[0] - ux * h + uy * h * .45, B[1] - uy * h - ux * h * .45]], "fill:" + col); }
  F.plano3d = function () { // subespaço gerado por dois vetores em R3
    var s = { v: "" }; axes3(s);
    var u = [3, 0, 1], v = [0, 3, 1.5], O = [0, 0, 0];
    var P = [[-1.2, -1.2, -0.75], [3.2, -1.2, 0.35], [3.2, 3.2, 2.55], [-1.2, 3.2, 1.45]].map(iso);
    s.v = Pg(P, "fill:var(--pri);fill-opacity:.13;stroke:var(--pri);stroke-opacity:.5") + s.v;
    s.v += arrow(iso(O), iso(u), CA) + arrow(iso(O), iso(v), CB) + Tx(iso(u)[0] + 14, iso(u)[1], "u", "fill:" + CA) + Tx(iso(v)[0] - 12, iso(v)[1], "v", "fill:" + CB);
    s.v += Tx(345, 40, "[u, v] = plano que passa", "font-size:13px;fill:var(--pri)", "middle") + Tx(345, 58, "pela origem", "font-size:13px;fill:var(--pri)", "middle");
    return svg("40 20 400 280", s.v);
  };
  F.paralelogramo = function () {
    var O = [60, 230], k = 38, u = [4, 1], v = [1, 3], P = function (p) { return [O[0] + p[0] * k, O[1] - p[1] * k]; }, s = "";
    s += L(P(u), P([5, 4]), "stroke:" + CB + ";stroke-width:1.5;stroke-dasharray:5 4") + L(P(v), P([5, 4]), "stroke:" + CA + ";stroke-width:1.5;stroke-dasharray:5 4");
    s += arrow(P([0, 0]), P(u), CA) + arrow(P([0, 0]), P(v), CB) + arrow(P([0, 0]), P([5, 4]), "var(--pri)", 3.5);
    s += Tx(P(u)[0] + 10, P(u)[1] + 12, "u = (4, 1)", "fill:" + CA, "start") + Tx(P(v)[0] - 8, P(v)[1] - 10, "v = (1, 3)", "fill:" + CB, "end") + Tx(P([5, 4])[0] + 8, P([5, 4])[1] - 6, "u + v = (5, 4)", "fill:var(--pri)", "start");
    return svg("0 50 420 200", s);
  };

  // =================================================================== PLANO: utilitários de desenho
  function plane(S, k, ox, oy, range) { // grade cartesiana
    var s = "";
    for (var i = -range; i <= range; i++) { s += L([ox + i * k, oy - range * k], [ox + i * k, oy + range * k], "stroke:var(--line);stroke-width:1") + L([ox - range * k, oy + i * k], [ox + range * k, oy + i * k], "stroke:var(--line);stroke-width:1"); }
    s += L([ox - range * k, oy], [ox + range * k, oy], "stroke:var(--muted);stroke-width:1.5") + L([ox, oy - range * k], [ox, oy + range * k], "stroke:var(--muted);stroke-width:1.5");
    return s;
  }

  // =================================================================== M1 · VETORES
  W.vetorLab = function (h) {
    var c = ctrls(h), u1 = slider(c, "vu1", "u₁", -4, 4, 1, 3), u2 = slider(c, "vu2", "u₂", -4, 4, 1, 1), v1 = slider(c, "vv1", "v₁", -4, 4, 1, 1), v2 = slider(c, "vv2", "v₂", -4, 4, 1, 2), al = slider(c, "val", "α", -2, 2, 0.5, 2, function (x) { return fmt(x, 1); });
    var mode = "soma"; seg(h, [["soma", "Soma u + v"], ["esc", "Escalar α·u"], ["dif", "Diferença u − v"], ["comb", "α·u + v"]], mode, function (m) { mode = m; draw(); });
    var S = scene(h, "0 0 420 420"), out = rows(h, [["r", "Resultado"], ["g", "Geometria"]]);
    function draw() {
      var a = [+u1.value, +u2.value], b = [+v1.value, +v2.value], k = 24, O = [210, 210], P = function (p) { return [O[0] + p[0] * k, O[1] - p[1] * k]; }, s = plane(S, k, 210, 210, 8), A = +al.value, r, txt, g;
      if (mode === "soma") { r = [a[0] + b[0], a[1] + b[1]]; s += L(P(a), P(r), "stroke:" + CB + ";stroke-dasharray:5 4;stroke-width:1.6") + L(P(b), P(r), "stroke:" + CA + ";stroke-dasharray:5 4;stroke-width:1.6") + arrow(P([0, 0]), P(a), CA) + arrow(P([0, 0]), P(b), CB) + arrow(P([0, 0]), P(r), "var(--pri)", 3.5); txt = tex("u+v=(" + a[0] + "+" + b[0] + ",\\ " + a[1] + "+" + b[1] + ")=(" + r[0] + ",\\ " + r[1] + ")"); g = "Regra do paralelogramo: u + v é a diagonal do paralelogramo de lados u e v (ou: ande u e depois v)."; }
      else if (mode === "esc") { r = [A * a[0], A * a[1]]; s += arrow(P([0, 0]), P(a), CA, 5) + arrow(P([0, 0]), P(r), "var(--pri)", 2.6); txt = tex(tf(A, 1) + "\\cdot(" + a[0] + "," + a[1] + ")=(" + tf(r[0], 1) + ",\\ " + tf(r[1], 1) + ")"); g = A > 1 ? "Mesma direção e sentido, comprimento maior (estica)." : A > 0 && A < 1 ? "Mesma direção e sentido, comprimento menor (encolhe)." : A === 1 ? "Não muda nada (1·u = u)." : A === 0 ? "Vira o vetor nulo." : "Mesma direção, sentido oposto (α negativo inverte)."; }
      else if (mode === "dif") { r = [a[0] - b[0], a[1] - b[1]]; s += arrow(P([0, 0]), P(a), CA) + arrow(P([0, 0]), P(b), CB) + arrow(P(b), P(a), "var(--pri)", 3) + arrow(P([0, 0]), P(r), "var(--pri)", 1.6); txt = tex("u-v=(" + r[0] + ",\\ " + r[1] + ")"); g = "u − v é o vetor que vai da ponta de v até a ponta de u (e o mesmo vetor, desenhado a partir da origem)."; }
      else { r = [A * a[0] + b[0], A * a[1] + b[1]]; var Aa = [A * a[0], A * a[1]]; s += arrow(P([0, 0]), P(Aa), CA) + arrow(P(Aa), P(r), CB) + arrow(P([0, 0]), P(r), "var(--pri)", 3.5); txt = tex(tf(A, 1) + "u+v=(" + tf(r[0], 1) + ",\\ " + tf(r[1], 1) + ")"); g = "Isso é uma combinação linear de u e v (Módulo 5)."; }
      s += Tx(P(a)[0] + 8, P(a)[1] - 8, "u", "fill:" + CA, "start") + (mode !== "esc" ? Tx(P(b)[0] + 8, P(b)[1] - 8, "v", "fill:" + CB, "start") : "");
      S.innerHTML = s; out.r.innerHTML = txt; out.g.textContent = g;
    }
    [u1, u2, v1, v2, al].forEach(function (x) { x.addEventListener("input", draw); }); draw();
  };

  // =================================================================== M2 · ESCALONADOR
  W.escalonador = function (h, o) {
    var ta = el("textarea", { class: "inp", rows: 4, id: "esc" + (o.id || ""), spellcheck: "false", style: "width:100%;max-width:420px;font-family:var(--mono);font-size:15px" }); ta.value = o.m || "1 2 1 4\n2 5 3 11\n1 3 4 11"; h.appendChild(ta);
    h.appendChild(el("p", { class: "small muted" }, "Uma linha da matriz por linha do texto, números separados por espaço. Aceita frações (3/4) e decimais (0,5)."));
    var bx = el("div", { class: "btns", style: "align-items:center" }); h.appendChild(bx);
    var aug = o.aug !== false, full = !!o.full;
    var cA = el("label", { class: "small", style: "display:inline-flex;gap:6px;align-items:center;font-weight:700" }, '<input type="checkbox" ' + (aug ? "checked" : "") + "> É um sistema (última coluna = termos independentes)"); bx.appendChild(cA);
    var cF = el("label", { class: "small", style: "display:inline-flex;gap:6px;align-items:center;font-weight:700" }, '<input type="checkbox" ' + (full ? "checked" : "") + "> Ir até a forma reduzida"); bx.appendChild(cF);
    var ex = el("div", { class: "btns" }); h.appendChild(ex);
    [["SPD", "1 2 1 4\n2 5 3 11\n1 3 4 11", true], ["SPI", "1 1 2 3\n2 2 4 6\n1 -1 0 1", true], ["SI", "1 1 1 1\n2 2 2 3\n1 -1 1 0", true], ["Homogêneo", "1 2 -1 0\n2 4 -2 0\n1 0 1 0", true], ["Frações", "2 1 1\n3 2 4", true], ["Matriz 3×3", "1 2 3\n4 5 6\n7 8 9", false]].forEach(function (p) { var b = el("button", { class: "btn s", type: "button" }, p[0]); b.onclick = function () { ta.value = p[1]; cA.firstChild.checked = p[2]; go(); }; ex.appendChild(b); });
    var out = el("div", { class: "steps" }); h.appendChild(out);
    function go() {
      var M = parseMat(ta.value), A = cA.firstChild.checked, Fl = cF.firstChild.checked;
      if (!M) { out.innerHTML = '<div class="alert bad">Confira a matriz: todas as linhas precisam ter a mesma quantidade de números.</div>'; return; }
      if (M.length > 6 || M[0].length > 7) { out.innerHTML = '<div class="alert bad">Use no máximo 6 linhas e 7 colunas.</div>'; return; }
      if (A && M[0].length < 2) A = false;
      var G = gauss(M, A, Fl || A); G.M0 = M;
      var s = stepsHTML(G, A, Fl || A);
      s += '<div class="st"><span class="pl">Posto</span><p>Número de pivôs (linhas não nulas na forma escalonada): <b>' + G.piv.length + "</b>.</p></div>";
      if (A) s += solveHTML(G);
      out.innerHTML = s; renderM(out);
    }
    ta.addEventListener("input", go); cA.firstChild.addEventListener("change", go); cF.firstChild.addEventListener("change", go); go();
  };

  // =================================================================== M3 · AXIOMAS
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

  // =================================================================== M4 · SUBESPAÇOS EM R2
  W.subLab = function (h) {
    var SETS = [
      { n: "Reta y = 2x", t: function (p) { return Math.abs(p[1] - 2 * p[0]) < 1e-9; }, s: function () { var x = ri(-2, 2) || 1; return [x, 2 * x]; }, draw: "line", m: 2, b: 0, ans: true, why: "Passa pela origem e é fechada: (a, 2a) + (b, 2b) = (a + b, 2(a + b)) e α(a, 2a) = (αa, 2αa)." },
      { n: "Reta y = 2x + 1", t: function (p) { return Math.abs(p[1] - 2 * p[0] - 1) < 1e-9; }, s: function () { var x = ri(-2, 1); return [x, 2 * x + 1]; }, draw: "line", m: 2, b: 1, ans: false, why: "Não passa pela origem: (0, 0) não satisfaz y = 2x + 1. Isso já basta." },
      { n: "Parábola y = x²", t: function (p) { return Math.abs(p[1] - p[0] * p[0]) < 1e-9; }, s: function () { var x = rnd([-2, -1, 1, 2]); return [x, x * x]; }, draw: "par", ans: false, why: "Contém a origem, mas a soma sai da curva: (1, 1) + (2, 4) = (3, 5), e 5 ≠ 3²." },
      { n: "1º quadrante (x ≥ 0 e y ≥ 0)", t: function (p) { return p[0] >= 0 && p[1] >= 0; }, s: function () { return [ri(0, 3), ri(0, 3)]; }, draw: "quad", ans: false, why: "Fechado para a soma, mas não para escalares negativos: (−1)·(1, 2) = (−1, −2) sai do quadrante." },
      { n: "União dos eixos (xy = 0)", t: function (p) { return Math.abs(p[0] * p[1]) < 1e-9; }, s: function () { return Math.random() < .5 ? [ri(-3, 3) || 1, 0] : [0, ri(-3, 3) || 2]; }, draw: "eixos", ans: false, why: "Fechado para escalares, mas não para a soma: (1, 0) + (0, 1) = (1, 1), que não está em nenhum eixo." },
      { n: "Só a origem {(0, 0)}", t: function (p) { return p[0] === 0 && p[1] === 0; }, s: function () { return [0, 0]; }, draw: "orig", ans: true, why: "É o subespaço nulo: 0 + 0 = 0 e α·0 = 0." },
      { n: "O plano inteiro ℝ²", t: function () { return true; }, s: function () { return [ri(-3, 3), ri(-3, 3)]; }, draw: "all", ans: true, why: "Todo espaço é subespaço de si mesmo." }
    ];
    var cur = 0, sel = el("div", { class: "btns" }); h.appendChild(sel);
    SETS.forEach(function (c, i) { var b = el("button", { class: "btn s" + (i === 0 ? " p" : ""), type: "button" }, c.n); b.onclick = function () { cur = i; [].forEach.call(sel.children, function (x, j) { x.classList.toggle("p", j === i); }); go(); }; sel.appendChild(b); });
    var S = scene(h, "0 0 420 420"), out = rows(h, [["z", "1) Contém o vetor nulo?"], ["s", "2) u + v fica no conjunto?"], ["m", "3) αu fica no conjunto?"], ["v", "Veredito"]]);
    var bt = el("button", { class: "btn s", type: "button" }, "↻ Sortear outros u, v e α"); h.appendChild(bt); bt.onclick = go;
    function go() {
      var c = SETS[cur], k = 26, O = [210, 210], P = function (p) { return [O[0] + p[0] * k, O[1] - p[1] * k]; }, s = plane(S, k, 210, 210, 7);
      if (c.draw === "line") s += L(P([-8, -8 * c.m + c.b]), P([8, 8 * c.m + c.b]), "stroke:var(--pri);stroke-width:4;stroke-opacity:.45");
      if (c.draw === "par") { var pts = []; for (var x = -2.7; x <= 2.7; x += 0.05) pts.push(P([x, x * x])); s += '<path d="M' + pts.map(function (p) { return f1(p[0]) + " " + f1(p[1]); }).join(" L") + '" style="fill:none;stroke:var(--pri);stroke-width:4;stroke-opacity:.45"/>'; }
      if (c.draw === "quad") s += R(O[0], O[1] - 7 * k, 7 * k, 7 * k, "fill:var(--pri);fill-opacity:.15");
      if (c.draw === "eixos") s += L(P([-7, 0]), P([7, 0]), "stroke:var(--pri);stroke-width:4;stroke-opacity:.45") + L(P([0, -7]), P([0, 7]), "stroke:var(--pri);stroke-width:4;stroke-opacity:.45");
      if (c.draw === "all") s += R(O[0] - 7 * k, O[1] - 7 * k, 14 * k, 14 * k, "fill:var(--pri);fill-opacity:.12");
      s += Ci(O[0], O[1], 6, "fill:" + (c.t([0, 0]) ? "var(--ok)" : "var(--bad)"));
      var u = c.s(), v = c.s(), a = rnd([-2, -1, 2, 3]);
      if (c.draw === "par") { u = [1, 1]; v = [rnd([2, -2]), 4]; } if (c.draw === "eixos") { u = [ri(1, 3), 0]; v = [0, ri(1, 3)]; } if (c.draw === "quad") a = rnd([-1, -2]);
      var w = [u[0] + v[0], u[1] + v[1]], z = [a * u[0], a * u[1]], inW = c.t(w), inZ = c.t(z);
      var show = function (p) { return Math.abs(p[0]) <= 7 && Math.abs(p[1]) <= 7; };
      s += arrow(P([0, 0]), P(u), CA, 2.5) + arrow(P([0, 0]), P(v), CB, 2.5);
      if (show(w)) s += arrow(P([0, 0]), P(w), inW ? "var(--ok)" : "var(--bad)", 3);
      if (show(z)) s += arrow(P([0, 0]), P(z), inZ ? "var(--ok)" : "var(--bad)", 2) ;
      s += Tx(P(u)[0] + 8, P(u)[1] - 8, "u", "fill:" + CA, "start") + Tx(P(v)[0] + 8, P(v)[1] - 8, "v", "fill:" + CB, "start") + (show(w) ? Tx(P(w)[0] + 8, P(w)[1] - 8, "u+v", "fill:" + (inW ? "var(--ok)" : "var(--bad)"), "start") : "") + (show(z) ? Tx(P(z)[0] + 8, P(z)[1] + 12, a + "u", "fill:" + (inZ ? "var(--ok)" : "var(--bad)"), "start") : "");
      S.innerHTML = s;
      out.z.innerHTML = c.t([0, 0]) ? "✓ sim" : '<span style="color:var(--bad)">✗ não</span>';
      out.s.innerHTML = "u = (" + u + "), v = (" + v + ") → u + v = (" + w + ") " + (inW ? "✓ está" : '<span style="color:var(--bad)">✗ não está</span>');
      out.m.innerHTML = "α = " + a + " → αu = (" + z + ") " + (inZ ? "✓ está" : '<span style="color:var(--bad)">✗ não está</span>');
      out.v.innerHTML = (c.ans ? '<b style="color:var(--ok)">É subespaço.</b> ' : '<b style="color:var(--bad)">Não é subespaço.</b> ') + c.why + (c.ans ? ' <span class="small muted">(os testes com números ajudam a intuir; a prova vale para todos os vetores.)</span>' : "");
    }
    go();
  };

  // =================================================================== M5 · COMBINAÇÃO LINEAR
  W.combLab = function (h) { // visual em R2
    var c = ctrls(h), ia = slider(c, "cba", "a", -3, 3, 0.5, 1, function (x) { return fmt(x, 1); }), ib = slider(c, "cbb", "b", -3, 3, 0.5, 1, function (x) { return fmt(x, 1); });
    var pair = 0, PAIRS = [[[2, 1], [-1, 1], [1, 5]], [[1, 0], [1, 1], [-2, 3]], [[2, 1], [4, 2], [3, 3]]];
    seg(h, [["0", "u = (2,1), v = (−1,1)"], ["1", "u = (1,0), v = (1,1)"], ["2", "u = (2,1), v = (4,2) (paralelos)"]], "0", function (x) { pair = +x; draw(); });
    var S = scene(h, "0 0 420 420"), out = rows(h, [["c", "a·u + b·v"], ["t", "Alvo w"], ["g", "O que dá para alcançar"]]);
    function draw() {
      var P0 = PAIRS[pair], u = P0[0], v = P0[1], w = P0[2], a = +ia.value, b = +ib.value, k = 22, O = [210, 210], P = function (p) { return [O[0] + p[0] * k, O[1] - p[1] * k]; }, s = plane(S, k, 210, 210, 9);
      var r = [a * u[0] + b * v[0], a * u[1] + b * v[1]], hit = Math.abs(r[0] - w[0]) < 1e-9 && Math.abs(r[1] - w[1]) < 1e-9;
      if (pair === 2) s += L(P([-9, -4.5]), P([9, 4.5]), "stroke:var(--pri);stroke-width:6;stroke-opacity:.18");
      else s += R(O[0] - 9 * k, O[1] - 9 * k, 18 * k, 18 * k, "fill:var(--pri);fill-opacity:.06");
      s += Ci(P(w)[0], P(w)[1], 9, "fill:none;stroke:var(--gold);stroke-width:3") + Tx(P(w)[0] + 12, P(w)[1] - 10, "w", "fill:var(--gold)", "start");
      var au = [a * u[0], a * u[1]];
      s += arrow(P([0, 0]), P(au), CA) + arrow(P(au), P(r), CB) + arrow(P([0, 0]), P(r), hit ? "var(--ok)" : "var(--pri)", 3.5);
      S.innerHTML = s;
      out.c.innerHTML = tex(tf(a, 1) + "(" + u + ")" + (b < 0 ? "" : "+") + tf(b, 1) + "(" + v + ")=(" + tf(r[0], 1) + ",\\ " + tf(r[1], 1) + ")") + (hit ? ' <b style="color:var(--ok)">Acertou o alvo!</b>' : "");
      out.t.innerHTML = tex("w=(" + w + ")") + (pair === 2 ? ' <span class="small" style="color:var(--bad)">Impossível: w não está na reta gerada.</span>' : ' <span class="small muted">Mexa em a e b até a seta cair no círculo.</span>');
      out.g.textContent = pair === 2 ? "u e v são paralelos: todas as combinações caem numa reta. [u, v] é uma reta, não o plano." : "u e v não são paralelos: as combinações cobrem o plano inteiro. [u, v] = ℝ².";
    }
    [ia, ib].forEach(function (x) { x.addEventListener("input", draw); }); draw();
  };
  function spanEqHTML(V) { // equações de [V]: reduz [A | I]
    var n = V[0].length, k = V.length, M = [];
    for (var i = 0; i < n; i++) { var row = V.map(function (v) { return v[i]; }); for (var j = 0; j < n; j++) row.push(fr(i === j ? 1 : 0)); M.push(row); }
    // reduzir só nas k primeiras colunas
    var G = { R: copy(M) }, R = G.R, r = 0;
    for (var col = 0; col < k && r < n; col++) {
      var p = -1; for (var i2 = r; i2 < n; i2++) if (!fz(R[i2][col])) { p = i2; break; } if (p < 0) continue;
      var t = R[p]; R[p] = R[r]; R[r] = t;
      for (var i3 = 0; i3 < n; i3++) if (i3 !== r && !fz(R[i3][col])) { var f = fdiv(R[i3][col], R[r][col]); R[i3] = R[i3].map(function (x, j) { return fsub(x, fmul(f, R[r][j])); }); }
      r++;
    }
    var names = []; for (var j2 = 0; j2 < n; j2++) names.push(varName(j2, n));
    var eqs = [];
    for (var i4 = r; i4 < n; i4++) { var coefs = intScale(R[i4].slice(k)); var e = ""; coefs.forEach(function (cf, j) { if (!fz(cf)) e += coefTex(cf, !e) + names[j]; }); if (e) eqs.push(e + "=0"); }
    return { dim: r, eqs: eqs, names: names };
  }
  W.clLab = function (h) { // w é combinação de v1..vk?
    var bx = el("div", { style: "display:grid;gap:8px" }); h.appendChild(bx);
    var iv = inp(bx, "clV", "Vetores", "(1,2,1) (0,1,1)", 260), iw = inp(bx, "clW", "w =", "(2,5,3)", 140);
    var ex = el("div", { class: "btns" }); h.appendChild(ex);
    [["(1,2,1) (0,1,1)", "(2,5,3)"], ["(1,2,1) (0,1,1)", "(1,0,0)"], ["(1,1) (2,3)", "(4,7)"], ["(1,0,1) (1,1,0) (0,1,-1)", "(3,1,2)"], ["(1,-1,0,2) (0,1,1,1)", "(2,-1,1,5)"]].forEach(function (p) { var b = el("button", { class: "btn s", type: "button" }, p[0] + " → " + p[1]); b.onclick = function () { iv.value = p[0]; iw.value = p[1]; go(); }; ex.appendChild(b); });
    var out = el("div", { class: "steps" }); h.appendChild(out);
    function go() {
      var V = parseVecs(iv.value), Wv = parseVecs(iw.value);
      if (!V || !Wv || Wv[0].length !== V[0].length) { out.innerHTML = '<div class="alert bad">Escreva vetores entre parênteses, todos com a mesma quantidade de coordenadas: (1,2,1) (0,1,1).</div>'; return; }
      var w = Wv[0], n = w.length, k = V.length, cs = []; for (var i = 0; i < k; i++) cs.push("a_{" + (i + 1) + "}");
      var s = '<div class="st"><span class="pl">Montagem</span><p>Procuramos números ' + tex(cs.join(",")) + " tais que</p><div class=\"m\">\\[" + V.map(function (v, i) { return cs[i] + vecTex(v); }).join("+") + "=" + vecTex(w) + "\\]</div><p>Igualando coordenada por coordenada, sai um sistema. Cada vetor vira uma <b>coluna</b> da matriz:</p></div>";
      var M = []; for (var r = 0; r < n; r++) { M.push(V.map(function (v) { return v[r]; }).concat([w[r]])); }
      var G = gauss(M, true, true); G.M0 = M;
      s += stepsHTML(G, true, true);
      if (G.incons) s += '<div class="final"><b>Não é combinação linear:</b> o sistema é impossível. Então ' + tex(vecTex(w) + "\\notin[" + V.map(vecTex).join(",") + "]") + ".</div>";
      else {
        var sol = []; for (var j = 0; j < k; j++) sol.push(F0()); G.piv.forEach(function (c, i2) { sol[c] = G.R[i2][k]; });
        s += '<div class="final"><b>É combinação linear!</b> ' + (G.piv.length < k ? "(há infinitas maneiras; uma delas, com as livres iguais a 0:) " : "") + tex(vecTex(w) + "=" + V.map(function (v, i3) { return (i3 ? coefTex(sol[i3]) : coefTex(sol[i3], true)) + vecTex(v); }).join("").replace(/\+-/g, "-")) + "</div>";
      }
      var E = spanEqHTML(V);
      s += '<div class="st"><span class="pl">Extra · o subespaço gerado</span><p>' + (E.eqs.length ? tex("[" + V.map(vecTex).join(",") + "]=\\{(" + E.names.join(",") + ")\\in\\mathbb R^{" + n + "}:\\ " + E.eqs.join(",\\ ") + "\\}") + " (dimensão " + E.dim + ")." : "Esses vetores geram todo o " + tex("\\mathbb R^{" + n + "}") + ".") + "</p></div>";
      out.innerHTML = s; renderM(out);
    }
    [iv, iw].forEach(function (x) { x.addEventListener("input", go); }); go();
  };

  // =================================================================== M6 e M7 · LI/LD, BASE
  function analyze(V) {
    var n = V[0].length, k = V.length, M = [];
    for (var r = 0; r < n; r++) M.push(V.map(function (v) { return v[r]; }));
    var G = gauss(M, false, true); G.M0 = M; return G;
  }
  W.liLab = function (h, o) {
    var mode = o.mode || "li";
    var iv = inp(h, "li" + mode, "Vetores", o.v || "(1,2,3) (2,1,0) (3,3,3)", 300);
    var ex = el("div", { class: "btns" }); h.appendChild(ex);
    (mode === "li" ? ["(1,2) (3,6)", "(1,2) (3,5)", "(1,2,3) (2,1,0) (3,3,3)", "(1,0,0) (1,1,0) (1,1,1)", "(1,2) (0,1) (5,7)", "(1,0,2,1) (0,1,1,0) (1,1,3,2)"] : ["(1,2,3) (2,4,6) (0,1,1) (1,3,4)", "(1,1,0) (0,1,1)", "(1,0,1) (2,1,0) (3,1,1) (0,1,-2)", "(1,2) (2,4)"]).forEach(function (p) { var b = el("button", { class: "btn s", type: "button" }, p); b.onclick = function () { iv.value = p; go(); }; ex.appendChild(b); });
    var out = el("div", { class: "steps" }); h.appendChild(out);
    function go() {
      var V = parseVecs(iv.value);
      if (!V) { out.innerHTML = '<div class="alert bad">Escreva vetores entre parênteses, com o mesmo número de coordenadas: (1,2,3) (2,1,0).</div>'; return; }
      if (V.length > 6 || V[0].length > 6) { out.innerHTML = '<div class="alert bad">Use até 6 vetores com até 6 coordenadas.</div>'; return; }
      var n = V[0].length, k = V.length, G = analyze(V), r = G.piv.length, cs = []; for (var i = 0; i < k; i++) cs.push("a_{" + (i + 1) + "}");
      var s = "";
      if (mode === "li") s += '<div class="st"><span class="pl">Montagem</span><p>Os vetores são LI se a única solução de</p><div class="m">\\[' + V.map(function (v, i) { return cs[i] + vecTex(v); }).join("+") + "=" + vecTex(V[0].map(F0)) + "\\]</div><p>for " + tex(cs.join("=") + "=0") + ". Escalonamos a matriz com os vetores nas <b>colunas</b> (sistema homogêneo).</p></div>";
      else s += '<div class="st"><span class="pl">Montagem</span><p>Coloque os vetores como <b>colunas</b> e escalone. As colunas com pivô indicam quais vetores originais formam uma base de ' + tex("[S]") + ".</p></div>";
      s += stepsHTML(G, false, true);
      s += '<div class="st"><span class="pl">Pivôs</span><p>Colunas com pivô: ' + G.piv.map(function (c) { return c + 1; }).join(", ") + " → posto " + r + ".</p></div>";
      var nb = nullBasis(G);
      if (mode === "li") {
        if (r === k) s += '<div class="final"><b>LI (linearmente independentes):</b> há pivô em todas as ' + k + " colunas, então a única solução é a trivial." + (k === n ? " Como são " + n + " vetores LI em " + tex("\\mathbb R^{" + n + "}") + ", formam uma <b>base</b>." : "") + "</div>";
        else {
          var c0 = intScale(nb[0].v);
          s += '<div class="final"><b>LD (linearmente dependentes):</b> só ' + r + " pivôs para " + k + " vetores. " + (k > n ? "(Era previsível: mais de " + n + " vetores em " + tex("\\mathbb R^{" + n + "}") + " são sempre LD.) " : "") + "Uma combinação não trivial que dá o vetor nulo:<div class=\"m\">\\[" + V.map(function (v, i) { return fz(c0[i]) ? "" : coefTex(c0[i], false) + "v_{" + (i + 1) + "}"; }).join("").replace(/^\+/, "") + "=0\\]</div>";
          var j = nb[0].free, rel = G.piv.map(function (c, i2) { return fz(G.R[i2][j]) ? "" : coefTex(G.R[i2][j]) + "v_{" + (c + 1) + "}"; }).join("").replace(/^\+/, "");
          s += "Ou seja, " + tex("v_{" + (j + 1) + "}=" + (rel || "0")) + ": um dos vetores é combinação dos outros.</div>";
        }
      } else {
        s += '<div class="final"><b>Base de [S]:</b> ' + tex("\\{" + G.piv.map(function (c) { return vecTex(V[c]); }).join(",\\ ") + "\\}") + " &nbsp;·&nbsp; <b>dim [S] = " + r + "</b>." + (r < k ? " Os outros vetores são combinação destes e podem ser descartados." : "") + "</div>";
        if (r < n) {
          var Vx = G.piv.map(function (c) { return V[c]; }); for (var e = 0; e < n; e++) { var ev = []; for (var j2 = 0; j2 < n; j2++) ev.push(fr(j2 === e ? 1 : 0)); Vx.push(ev); }
          var G2 = analyze(Vx), add = G2.piv.filter(function (c) { return c >= r; }).map(function (c) { return Vx[c]; });
          s += '<div class="st"><span class="pl">Completar até uma base de ' + tex("\\mathbb R^{" + n + "}") + "</span><p>Junte os vetores canônicos " + tex("e_1,\\dots,e_{" + n + "}") + " no fim e escalone de novo; fique com as colunas de pivô. Basta acrescentar " + tex(add.map(vecTex).join(",\\ ")) + ".</p></div>";
        }
      }
      out.innerHTML = s; renderM(out);
    }
    iv.addEventListener("input", go); go();
  };
  W.baseLab = function (h, o) { o.mode = "base"; o.v = o.v || "(1,2,3) (2,4,6) (0,1,1) (1,3,4)"; W.liLab(h, o); };
  W.liTreino = function (h) {
    var box = el("div", { class: "card", style: "display:grid;gap:10px" }); h.appendChild(box); var okc = 0, tot = 0;
    function make() {
      var n = rnd([2, 3, 3]), k = n === 2 ? rnd([2, 2, 3]) : rnd([2, 3, 3]), V = [];
      for (var i = 0; i < k; i++) { var v = []; for (var j = 0; j < n; j++) v.push(ri(-3, 4)); V.push(v); }
      if (Math.random() < 0.45 && k >= 2) { var a = rnd([1, 2, -1, 3]), b = k > 2 ? rnd([0, 1, -1, 2]) : 0; V[k - 1] = V[0].map(function (x, j) { return a * x + b * V[1][j] * (k > 2 ? 1 : 0); }); if (k === 2) V[1] = V[0].map(function (x) { return a * x; }); }
      if (V.some(function (v) { return v.every(function (x) { return x === 0; }); })) return make();
      return V;
    }
    function show() {
      var V = make(), Vf = V.map(function (v) { return v.map(function (x) { return fr(x); }); }), G = analyze(Vf), li = G.piv.length === V.length;
      box.innerHTML = '<p style="font-weight:700">Estes vetores são LI ou LD?</p><p style="font-size:1.15rem">' + tex(V.map(function (v) { return "(" + v.join(",") + ")"; }).join(",\\ ")) + '</p><div class="btns"><button class="btn p" type="button" data-a="1">LI</button><button class="btn p" type="button" data-a="0">LD</button><button class="btn s" type="button" id="ltN">Outra</button><span class="small muted">Acertos: ' + okc + "/" + tot + '</span></div><div id="ltF"></div>';
      renderM(box);
      box.querySelector("#ltN").onclick = show;
      [].forEach.call(box.querySelectorAll("[data-a]"), function (b) {
        b.onclick = function () {
          var ok = (b.dataset.a === "1") === li; tot++; if (ok) { okc++; T_().addXP(2, "treino LI/LD"); T_().beep("ok"); } else T_().beep("bad");
          var why = V.length > V[0].length ? "São " + V.length + " vetores em ℝ" + (V[0].length === 2 ? "²" : "³") + ": mais vetores que a dimensão, sempre LD." : V.length === 2 ? (li ? "Um não é múltiplo do outro." : "Um é múltiplo do outro (são paralelos).") : "Escalonando (vetores nas colunas) há " + G.piv.length + " pivô(s) para " + V.length + " vetores.";
          box.querySelector("#ltF").innerHTML = '<div class="alert ' + (ok ? "ok" : "bad") + '">' + (ok ? "Certo! " : "Não. ") + "São <b>" + (li ? "LI" : "LD") + "</b>. " + why + "</div>";
          [].forEach.call(box.querySelectorAll("[data-a]"), function (x) { x.disabled = true; });
        };
      });
    }
    show();
  };

  // =================================================================== M8 · COORDENADAS
  W.coordLab = function (h) {
    var c = ctrls(h), a1 = slider(c, "cd1", "b₁ = (·, )", -3, 3, 1, 2), a2 = slider(c, "cd2", "b₁ = ( , ·)", -3, 3, 1, 1), b1 = slider(c, "cd3", "b₂ = (·, )", -3, 3, 1, -1), b2 = slider(c, "cd4", "b₂ = ( , ·)", -3, 3, 1, 1), x1 = slider(c, "cd5", "v = (·, )", -6, 6, 1, 1), x2 = slider(c, "cd6", "v = ( , ·)", -6, 6, 1, 4);
    var S = scene(h, "0 0 420 420"), out = rows(h, [["d", "B é base?"], ["c", "Coordenadas de v na base B"], ["k", "Conferência"]]);
    function draw() {
      var B1 = [+a1.value, +a2.value], B2 = [+b1.value, +b2.value], v = [+x1.value, +x2.value], k = 22, O = [210, 210], P = function (p) { return [O[0] + p[0] * k, O[1] - p[1] * k]; }, s = plane(S, k, 210, 210, 9);
      var det = B1[0] * B2[1] - B1[1] * B2[0];
      if (det !== 0) {
        for (var i = -8; i <= 8; i++) { s += L(P([i * B1[0] - 12 * B2[0], i * B1[1] - 12 * B2[1]]), P([i * B1[0] + 12 * B2[0], i * B1[1] + 12 * B2[1]]), "stroke:var(--pri);stroke-opacity:.25;stroke-width:1.2") + L(P([i * B2[0] - 12 * B1[0], i * B2[1] - 12 * B1[1]]), P([i * B2[0] + 12 * B1[0], i * B2[1] + 12 * B1[1]]), "stroke:var(--pri);stroke-opacity:.25;stroke-width:1.2"); }
        var ca = fr(v[0] * B2[1] - v[1] * B2[0], det), cb = fr(B1[0] * v[1] - B1[1] * v[0], det), A = fval(ca), Bv = fval(cb);
        var pA = [A * B1[0], A * B1[1]];
        s += arrow(P([0, 0]), P(pA), CA, 2) + arrow(P(pA), P(v), CB, 2);
        out.d.innerHTML = "Sim: " + tex("\\det=" + det + "\\ne0") + " (não são paralelos).";
        out.c.innerHTML = tex("[v]_B=\\left(" + ft(ca) + ",\\ " + ft(cb) + "\\right)");
        out.k.innerHTML = tex(ft(ca) + "\\cdot(" + B1 + ")" + coefTex(cb) + "(" + B2 + ")=(" + v + ")") + ' <span class="small muted">Na base canônica, v = (' + v + ").</span>";
      } else { out.d.innerHTML = '<span style="color:var(--bad)">Não: b₁ e b₂ são paralelos (ou um é nulo); não geram o plano.</span>'; out.c.textContent = "—"; out.k.textContent = "—"; }
      s += arrow(P([0, 0]), P(B1), CA, 4) + arrow(P([0, 0]), P(B2), CB, 4) + Ci(P(v)[0], P(v)[1], 6, "fill:var(--gold)") + Tx(P(B1)[0] + 6, P(B1)[1] - 10, "b₁", "fill:" + CA, "start") + Tx(P(B2)[0] + 6, P(B2)[1] - 10, "b₂", "fill:" + CB, "start") + Tx(P(v)[0] + 8, P(v)[1] - 10, "v", "fill:var(--gold)", "start");
      S.innerHTML = s; renderM(out.k);
    }
    [a1, a2, b1, b2, x1, x2].forEach(function (x) { x.addEventListener("input", draw); }); draw();
  };

  // =================================================================== M9 · TRANSFORMAÇÕES
  W.tlLab = function (h) {
    var c = ctrls(h), ia = slider(c, "tla", "a", -3, 3, 0.5, 1, function (x) { return fmt(x, 1); }), ib = slider(c, "tlb", "b", -3, 3, 0.5, 1, function (x) { return fmt(x, 1); }), ic = slider(c, "tlc", "c", -3, 3, 0.5, 0, function (x) { return fmt(x, 1); }), id = slider(c, "tld", "d", -3, 3, 0.5, 1, function (x) { return fmt(x, 1); });
    var ex = el("div", { class: "btns" }); h.appendChild(ex);
    [["Cisalhamento", [1, 1, 0, 1]], ["Rotação 90°", [0, -1, 1, 0]], ["Reflexão no eixo x", [1, 0, 0, -1]], ["Dilatação ×2", [2, 0, 0, 2]], ["Projeção no eixo x", [1, 0, 0, 0]], ["Achata numa reta", [1, 2, 0.5, 1]]].forEach(function (p) { var b = el("button", { class: "btn s", type: "button" }, p[0]); b.onclick = function () { [ia, ib, ic, id].forEach(function (x, i) { x.value = p[1][i]; x.dispatchEvent(new Event("input")); }); }; ex.appendChild(b); });
    var S = scene(h, "0 0 420 420"), out = rows(h, [["m", "Matriz"], ["d", "det (fator de área)"], ["n", "Núcleo e imagem"]]), tt = 1;
    Anim(h, 1500, function (t) { tt = ease(t); draw(); });
    function draw() {
      var a = +ia.value, b = +ib.value, cc = +ic.value, d = +id.value, k = 26, O = [210, 210], P = function (p) { return [O[0] + p[0] * k, O[1] - p[1] * k]; };
      var A = [1 + (a - 1) * tt, b * tt, cc * tt, 1 + (d - 1) * tt], T = function (p) { return [A[0] * p[0] + A[1] * p[1], A[2] * p[0] + A[3] * p[1]]; }, s = plane(S, k, 210, 210, 7);
      for (var i = -6; i <= 6; i++) { s += L(P(T([i, -6])), P(T([i, 6])), "stroke:var(--pri);stroke-opacity:.3;stroke-width:1.2") + L(P(T([-6, i])), P(T([6, i])), "stroke:var(--pri);stroke-opacity:.3;stroke-width:1.2"); }
      s += Pg([P(T([0, 0])), P(T([1, 0])), P(T([1, 1])), P(T([0, 1]))], "fill:var(--gold);fill-opacity:.35;stroke:var(--gold);stroke-width:2");
      s += arrow(P([0, 0]), P(T([1, 0])), CA, 3.5) + arrow(P([0, 0]), P(T([0, 1])), CB, 3.5) + Tx(P(T([1, 0]))[0] + 8, P(T([1, 0]))[1] + 12, "T(e₁)", "fill:" + CA, "start") + Tx(P(T([0, 1]))[0] + 8, P(T([0, 1]))[1] - 8, "T(e₂)", "fill:" + CB, "start");
      S.innerHTML = s;
      var det = a * d - b * cc;
      out.m.innerHTML = tex("A=\\begin{bmatrix}" + tf(a, 1) + "&" + tf(b, 1) + "\\\\" + tf(cc, 1) + "&" + tf(d, 1) + "\\end{bmatrix}") + ' <span class="small muted">colunas = T(e₁) e T(e₂)</span>';
      out.d.innerHTML = tex("\\det A=" + tf(det, 2)) + " → o quadrado de área 1 vira um paralelogramo de área " + fmt(Math.abs(det), 2) + (det < 0 ? " (com a orientação invertida)" : "") + ".";
      var allz = a === 0 && b === 0 && cc === 0 && d === 0;
      out.n.innerHTML = allz ? "T = 0: núcleo = ℝ² (dim 2), imagem = {0} (dim 0). 2 + 0 = 2." : det !== 0 ? "det ≠ 0: núcleo = {0} (dim 0), imagem = ℝ² (dim 2). dim N + dim Im = 0 + 2 = 2. T é injetora e sobrejetora (isomorfismo)." : "det = 0: o plano é achatado numa reta. Núcleo = reta (dim 1), imagem = reta (dim 1). 1 + 1 = 2.";
    }
    [ia, ib, ic, id].forEach(function (x) { x.addEventListener("input", function () { tt = 1; draw(); }); }); draw();
  };

  // =================================================================== M10 · PRODUTO INTERNO
  function dot(u, v) { var s = F0(); u.forEach(function (x, i) { s = fadd(s, fmul(x, v[i])); }); return s; }
  function sqrtTex(q) { // √q exato quando possível
    function isq(b) { if (b < 0n) return null; var x = BigInt(Math.round(Math.sqrt(Number(b)))); for (var d = -2n; d <= 2n; d++) { var y = x + d; if (y >= 0n && y * y === b) return y; } return null; }
    var a = isq(q.n), b = isq(q.d);
    if (a !== null && b !== null) return ft(fr(a, b));
    if (b !== null && q.d !== 1n) return "\\tfrac{\\sqrt{" + th(q.n) + "}}{" + th(b) + "}";
    return "\\sqrt{" + ft(q) + "}";
  }
  W.gramLab = function (h) {
    var iv = inp(h, "gsV", "Vetores", "(1,1,0) (1,0,1) (0,1,1)", 300);
    var ex = el("div", { class: "btns" }); h.appendChild(ex);
    ["(3,1) (2,2)", "(1,1,0) (1,0,1) (0,1,1)", "(1,1,1) (0,1,1) (0,0,1)", "(1,0,1,0) (1,1,1,1) (0,1,2,1)"].forEach(function (p) { var b = el("button", { class: "btn s", type: "button" }, p); b.onclick = function () { iv.value = p; go(); }; ex.appendChild(b); });
    var out = el("div", { class: "steps" }); h.appendChild(out);
    function go() {
      var V = parseVecs(iv.value);
      if (!V) { out.innerHTML = '<div class="alert bad">Escreva vetores entre parênteses: (1,1,0) (1,0,1).</div>'; return; }
      var Wt = [], s = "";
      for (var i = 0; i < V.length; i++) {
        var w = V[i].slice(), parts = [];
        for (var j = 0; j < Wt.length; j++) { var cf = fdiv(dot(V[i], Wt[j]), dot(Wt[j], Wt[j])); parts.push([cf, j]); w = w.map(function (x, t) { return fsub(x, fmul(cf, Wt[j][t])); }); }
        if (w.every(fz)) { s += '<div class="alert bad">' + tex("v_{" + (i + 1) + "}") + " é combinação dos anteriores (deu o vetor nulo). Os vetores são LD; Gram-Schmidt precisa de vetores LI. Remova esse vetor.</div>"; out.innerHTML = s; renderM(out); return; }
        var form = "w_{" + (i + 1) + "}=v_{" + (i + 1) + "}" + parts.map(function (p) { return "-\\frac{\\langle v_{" + (i + 1) + "},w_{" + (p[1] + 1) + "}\\rangle}{\\langle w_{" + (p[1] + 1) + "},w_{" + (p[1] + 1) + "}\\rangle}w_{" + (p[1] + 1) + "}"; }).join("");
        var num = vecTex(V[i]) + parts.map(function (p) { return coefTex(fneg(p[0])) + vecTex(Wt[p[1]]); }).join("");
        s += '<div class="st"><span class="pl">' + (i === 0 ? "Passo 1 · o primeiro fica como está" : "Passo " + (i + 1) + " · tire de v" + (i + 1) + " as projeções sobre os anteriores") + '</span><div class="m">\\[' + form + "\\]</div>" + (i ? '<div class="m">\\[w_{' + (i + 1) + "}=" + num + "=" + vecTex(w) + "\\]</div>" : '<div class="m">\\[w_1=' + vecTex(w) + "\\]</div>") + "</div>";
        Wt.push(w);
      }
      s += '<div class="st"><span class="pl">Conferência · produtos internos entre eles</span><p>' + Wt.map(function (a, i) { return Wt.slice(i + 1).map(function (b, j) { return tex("\\langle w_{" + (i + 1) + "},w_{" + (i + j + 2) + "}\\rangle=" + ft(dot(a, b))); }).join(" · "); }).filter(Boolean).join(" · ") + "</p></div>";
      s += '<div class="final"><b>Base ortogonal:</b> ' + tex(Wt.map(vecTex).join(",\\ ")) + "<br><b>Base ortonormal</b> (divida cada um pela norma): " + tex(Wt.map(function (w) { return "\\frac{1}{" + sqrtTex(dot(w, w)) + "}" + vecTex(w); }).join(",\\ ")) + "</div>";
      out.innerHTML = s; renderM(out);
    }
    iv.addEventListener("input", go); go();
  };
  W.projLab = function (h) {
    var c = ctrls(h), u1 = slider(c, "pj1", "u₁", -4, 4, 1, 4), u2 = slider(c, "pj2", "u₂", -4, 4, 1, 1), v1 = slider(c, "pj3", "v₁", -4, 4, 1, 2), v2 = slider(c, "pj4", "v₂", -4, 4, 1, 3);
    var S = scene(h, "0 0 420 420"), out = rows(h, [["p", "⟨u, v⟩ e normas"], ["a", "Ângulo"], ["q", "Projeção de v sobre u"]]);
    function draw() {
      var u = [+u1.value, +u2.value], v = [+v1.value, +v2.value], k = 24, O = [210, 210], P = function (p) { return [O[0] + p[0] * k, O[1] - p[1] * k]; }, s = plane(S, k, 210, 210, 8);
      var uu = u[0] * u[0] + u[1] * u[1], d = u[0] * v[0] + u[1] * v[1];
      if (uu === 0) { S.innerHTML = s; out.p.textContent = "u não pode ser o vetor nulo."; return; }
      var pr = [d / uu * u[0], d / uu * u[1]];
      s += L(P([-8 * u[0], -8 * u[1]]), P([8 * u[0], 8 * u[1]]), "stroke:" + CA + ";stroke-opacity:.25;stroke-width:1.5") + L(P(v), P(pr), "stroke:var(--muted);stroke-dasharray:5 4;stroke-width:1.6");
      s += arrow(P([0, 0]), P(u), CA, 3) + arrow(P([0, 0]), P(v), CB, 3) + arrow(P([0, 0]), P(pr), "var(--pri)", 4) + arrow(P(pr), P(v), "var(--gold)", 2.4);
      s += Tx(P(u)[0] + 8, P(u)[1] + 12, "u", "fill:" + CA, "start") + Tx(P(v)[0] + 8, P(v)[1] - 8, "v", "fill:" + CB, "start") + Tx(P(pr)[0] - 6, P(pr)[1] + 16, "proj", "fill:var(--pri)", "end");
      S.innerHTML = s;
      var nv = Math.hypot(v[0], v[1]), ang = nv ? Math.acos(Math.max(-1, Math.min(1, d / Math.sqrt(uu) / nv))) * 180 / Math.PI : 0;
      out.p.innerHTML = tex("\\langle u,v\\rangle=" + u[0] + "\\cdot" + (v[0] < 0 ? "(" + v[0] + ")" : v[0]) + "+" + u[1] + "\\cdot" + (v[1] < 0 ? "(" + v[1] + ")" : v[1]) + "=" + d + ",\\quad\\|u\\|=\\sqrt{" + uu + "}");
      out.a.innerHTML = d === 0 ? '<b style="color:var(--ok)">90°: u e v são ortogonais (⟨u, v⟩ = 0).</b>' : tex("\\cos\\theta=\\frac{\\langle u,v\\rangle}{\\|u\\|\\|v\\|}") + " → θ ≈ " + fmt(ang, 1) + "°";
      out.q.innerHTML = tex("\\text{proj}_u v=\\frac{\\langle v,u\\rangle}{\\langle u,u\\rangle}u=\\frac{" + d + "}{" + uu + "}(" + u + ")=" + vecTex([fr(d * u[0], uu), fr(d * u[1], uu)])) + ' <span class="small muted">(a seta dourada, v − proj, é ortogonal a u)</span>';
    }
    [u1, u2, v1, v2].forEach(function (x) { x.addEventListener("input", draw); }); draw();
  };

  // =================================================================== JOGOS
  var SUBQ = [
    ["{(x, y) ∈ ℝ² : y = 3x}", 1], ["{(x, y) ∈ ℝ² : y = 3x + 2}", 0], ["{(x, y, z) ∈ ℝ³ : x + y + z = 0}", 1], ["{(x, y, z) ∈ ℝ³ : x + y + z = 1}", 0], ["{(x, y) ∈ ℝ² : x ≥ 0}", 0],
    ["{(x, y) ∈ ℝ² : x·y = 0}", 0], ["{(x, y) ∈ ℝ² : y = x²}", 0], ["{(0, 0, 0)}", 1], ["{(x, y, z) : z = 0}", 1], ["{(x, y, z) : x = 2y e z = 0}", 1],
    ["Matrizes 2×2 simétricas", 1], ["Matrizes 2×2 com determinante 0", 0], ["Matrizes 2×2 com traço 0", 1], ["Matrizes 2×2 inversíveis", 0], ["Polinômios p de grau ≤ 3 com p(1) = 0", 1],
    ["Polinômios de grau exatamente 2", 0], ["Polinômios p com p(0) = 1", 0], ["Soluções de um sistema homogêneo AX = 0", 1], ["Soluções de AX = B com B ≠ 0", 0], ["{(x, y) : x e y inteiros}", 0],
    ["Funções f: ℝ → ℝ com f(0) = 0", 1], ["Funções f: ℝ → ℝ com f(0) = 2", 0], ["{(x, y) ∈ ℝ² : |x| = |y|}", 0], ["{(a, 2a, 3a) : a ∈ ℝ}", 1]
  ];
  var DIMQ = [
    ["ℝ⁴", 4], ["ℝ²", 2], ["M₂ₓ₂ (matrizes 2×2)", 4], ["M₂ₓ₃", 6], ["M₃ₓ₃", 9], ["P₂ (polinômios de grau ≤ 2)", 3], ["P₃", 4], ["P₅", 6], ["Plano x + y + z = 0 em ℝ³", 2], ["Reta y = 5x em ℝ²", 1],
    ["{(0, 0, 0)}", 0], ["Matrizes 2×2 simétricas", 3], ["Matrizes 2×2 diagonais", 2], ["Matrizes 3×3 simétricas", 6], ["Matrizes 2×2 com traço 0", 3], ["{(x, y, z, w) : x = y = z}", 2],
    ["Polinômios de P₃ com p(0) = 0", 3], ["Soluções de x + 2y − z + w = 0 em ℝ⁴", 3], ["ℂ visto como espaço real", 2], ["[(1, 2), (2, 4)]", 1], ["[(1, 0, 0), (0, 1, 0), (1, 1, 0)]", 2]
  ];
  W.games = function (host) {
    if (!host) return;
    var T = window.T, S = T.S, g = "li";
    seg(host, [["li", "LI ou LD?"], ["sub", "É subespaço?"], ["dim", "Qual a dimensão?"], ["comb", "Combinação certa"]], g, function (v) { g = v; setup(); });
    var box = el("div", { class: "card game" }); host.appendChild(box);
    var timer = 0, left = 0, score = 0, running = false;
    var DESC = { li: "Decida se os vetores são linearmente independentes (LI) ou dependentes (LD).", sub: "Decida se o conjunto (com as operações usuais) é um subespaço.", dim: "Escolha a dimensão do espaço ou subespaço.", comb: "Ache a e b tais que w = a·u + b·v." };
    function setup() {
      clearInterval(timer); running = false;
      box.innerHTML = '<div class="gstat"><span class="chip">' + T.icon("clock") + ' <b id="gT">45</b> s</span><span class="chip">' + T.icon("check") + ' <b id="gS">0</b> pontos</span><span class="chip">' + T.icon("trophy") + " recorde: <b>" + (S.games[g] || 0) + '</b></span></div><p class="small muted" style="text-align:center">' + DESC[g] + ' 45 segundos.</p><div class="gbig" id="gQ">Pronto?</div><div id="gA"></div><div class="btns" style="justify-content:center"><button class="btn p" id="gGo" type="button">' + T.icon("play") + " Começar</button></div>";
      box.querySelector("#gGo").onclick = start;
    }
    function start() { score = 0; left = 45; running = true; box.querySelector("#gGo").hidden = true; box.querySelector("#gS").textContent = 0; clearInterval(timer); timer = setInterval(function () { left--; box.querySelector("#gT").textContent = left; if (left <= 0) end(); }, 1000); next(); }
    function end() {
      clearInterval(timer); running = false;
      var best = S.games[g] || 0; if (score > best || S.games[g] == null) S.games[g] = Math.max(best, score); T.save();
      box.querySelector("#gQ").innerHTML = "Fim! " + score + " ponto" + (score === 1 ? "" : "s"); box.querySelector("#gA").innerHTML = "";
      var b = box.querySelector("#gGo"); b.hidden = false; b.innerHTML = T.icon("play") + " Jogar de novo";
      T.addXP(Math.min(15, score), "jogo");
    }
    function hit(ok) { if (!running) return; if (ok) { score++; T.beep("ok"); } else T.beep("bad"); box.querySelector("#gS").textContent = score; }
    function buttons(opts, right) {
      var A = box.querySelector("#gA"); A.innerHTML = '<div class="grid" style="grid-template-columns:1fr 1fr;max-width:420px;margin:0 auto"></div>';
      opts.forEach(function (o) { var b = el("button", { class: "btn", type: "button", style: "font-size:1.1rem" }, o[0]); b.onclick = function () { var ok = o[1] === right; hit(ok); b.classList.add(ok ? "p" : "wrong"); [].forEach.call(A.firstChild.children, function (x) { x.disabled = true; }); setTimeout(next, ok ? 300 : 900); }; A.firstChild.appendChild(b); });
    }
    function next() {
      if (!running) return;
      var Q = box.querySelector("#gQ");
      if (g === "li") {
        var n = rnd([2, 2, 3]), V = [], k = n === 2 ? 2 : rnd([2, 3]);
        for (var i = 0; i < k; i++) { var v = []; for (var j = 0; j < n; j++) v.push(ri(-3, 3)); V.push(v); }
        if (Math.random() < .5) { var a = rnd([2, -1, 3, -2]); V[k - 1] = k === 3 ? V[0].map(function (x, j2) { return x + a * V[1][j2]; }) : V[0].map(function (x) { return a * x; }); }
        if (V.some(function (v2) { return v2.every(function (x) { return !x; }); })) return next();
        var G = analyze(V.map(function (v3) { return v3.map(function (x) { return fr(x); }); })), li = G.piv.length === k;
        Q.innerHTML = tex(V.map(function (v4) { return "(" + v4.join(",") + ")"; }).join(",\\ "));
        buttons([["LI", 1], ["LD", 0]], li ? 1 : 0);
      } else if (g === "sub") {
        var q = rnd(SUBQ); Q.innerHTML = '<span style="font-size:1.05rem">' + q[0] + "</span>"; buttons([["Sim", 1], ["Não", 0]], q[1]);
      } else if (g === "dim") {
        var d = rnd(DIMQ), opts = [d[1]]; [d[1] + 1, d[1] - 1, d[1] + 2, d[1] * 2, d[1] + 3].forEach(function (x) { if (opts.length < 4 && x >= 0 && opts.indexOf(x) < 0) opts.push(x); });
        Q.innerHTML = '<span class="small muted">dim de</span><br><span style="font-size:1.1rem">' + d[0] + "</span>"; buttons(shuffle(opts).map(function (x) { return [String(x), x]; }), d[1]);
      } else {
        var u, v5; do { u = [ri(-2, 3), ri(-2, 3)]; v5 = [ri(-2, 3), ri(-2, 3)]; } while (u[0] * v5[1] - u[1] * v5[0] === 0);
        var A1 = ri(-3, 3), B1 = ri(-3, 3), w = [A1 * u[0] + B1 * v5[0], A1 * u[1] + B1 * v5[1]];
        Q.innerHTML = tex("u=(" + u + "),\\ v=(" + v5 + "),\\ w=(" + w + ")");
        var ops = [[A1, B1], [B1, A1], [A1, -B1], [-A1, B1], [A1 + 1, B1], [A1, B1 - 1]], seen = {}, list = [];
        ops.forEach(function (p) { var kk = p.join(); if (!seen[kk] && list.length < 4) { seen[kk] = 1; list.push(p); } });
        buttons(shuffle(list).map(function (p) { return ["a = " + p[0] + ", b = " + p[1], p.join()]; }), [A1, B1].join());
      }
    }
    setup();
  };
})();
