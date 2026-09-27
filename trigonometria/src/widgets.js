/* Figuras, laboratórios interativos, animações e jogos. */
(function () {
  "use strict";
  var PI = Math.PI, D = PI / 180;
  var W = window.W = {}; W.fig = {};
  function T_() { return window.T; }
  function tex(s, d) { return T_().tex(s, d); }
  function el(t, a, h) { return T_().el(t, a, h); }
  function f1(v) { return Math.round(v * 10) / 10; }
  function fmt(x, d) { if (d == null) d = 3; if (!isFinite(x)) return "não existe"; var s = (Math.abs(x) < 1e-10 ? 0 : x).toFixed(d); s = s.replace(/\.?0+$/, ""); if (s === "-0") s = "0"; return s.replace(".", ","); }
  function tf(x, d) { return fmt(x, d).replace(",", "{,}"); }
  // ---------- SVG helpers
  function L(a, b, st) { return '<line x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '" style="' + (st || "stroke:var(--ink);stroke-width:2") + '"/>'; }
  function Tx(x, y, s, st, anc) { return '<text x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anc || "middle") + '" dominant-baseline="middle" style="font-size:14px;font-weight:700;' + (st || "") + '">' + s + "</text>"; }
  function C(x, y, r, st) { return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + r + '" style="' + (st || "fill:var(--ink)") + '"/>'; }
  function P(pts, st) { return '<path d="M' + pts.map(function (p) { return f1(p[0]) + " " + f1(p[1]); }).join(" L") + '" style="' + (st || "fill:none;stroke:var(--ink);stroke-width:2") + '"/>'; }
  function unit(a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1; return [dx / n, dy / n]; }
  function arc(v, p, q, r, st, lab, lr, lst) {
    var u1 = unit(v, p), u2 = unit(v, q), a = [v[0] + u1[0] * r, v[1] + u1[1] * r], b = [v[0] + u2[0] * r, v[1] + u2[1] * r];
    var cr = u1[0] * u2[1] - u1[1] * u2[0];
    var s = '<path d="M' + f1(a[0]) + " " + f1(a[1]) + " A" + r + " " + r + " 0 0 " + (cr > 0 ? 1 : 0) + " " + f1(b[0]) + " " + f1(b[1]) + '" style="fill:none;stroke-width:2;' + (st || "stroke:var(--c-tg)") + '"/>';
    if (lab) { var bx = u1[0] + u2[0], by = u1[1] + u2[1], n = Math.hypot(bx, by) || 1, R = lr || r + 14; s += Tx(v[0] + bx / n * R, v[1] + by / n * R, lab, lst || "fill:var(--c-tg);font-size:13px"); }
    return s;
  }
  function rm(v, p, q, s) { s = s || 11; var u1 = unit(v, p), u2 = unit(v, q); var a = [v[0] + u1[0] * s, v[1] + u1[1] * s], b = [a[0] + u2[0] * s, a[1] + u2[1] * s], c = [v[0] + u2[0] * s, v[1] + u2[1] * s]; return P([a, b, c], "fill:none;stroke:var(--muted);stroke-width:1.3"); }
  function sideLab(p, q, s, cen, st, d) { d = d || 15; var m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], u = unit(p, q), n = [-u[1], u[0]]; if (Math.hypot(m[0] + n[0] - cen[0], m[1] + n[1] - cen[1]) < Math.hypot(m[0] - cen[0], m[1] - cen[1])) n = [-n[0], -n[1]]; return Tx(m[0] + n[0] * d, m[1] + n[1] * d, s, st); }
  function svg(vb, inner) { return '<svg viewBox="' + vb + '" role="img">' + inner + "</svg>"; }
  var ST = { sen: "stroke:var(--c-sen);stroke-width:3.5", cos: "stroke:var(--c-cos);stroke-width:3.5", tg: "stroke:var(--c-tg);stroke-width:3.5", hip: "stroke:var(--c-hip);stroke-width:3.5", aux: "stroke:var(--c-aux);stroke-width:3", dash: "stroke:var(--muted);stroke-width:1.4;stroke-dasharray:5 4", thin: "stroke:var(--muted);stroke-width:1.3", ink: "stroke:var(--ink);stroke-width:2" };
  var TS = { sen: "fill:var(--c-sen)", cos: "fill:var(--c-cos)", tg: "fill:var(--c-tg)", hip: "fill:var(--c-hip)", aux: "fill:var(--c-aux)", mut: "fill:var(--muted);font-weight:600;font-size:12px" };

  // exatos para ângulos notáveis (graus -> latex)
  var EX = {
    sen: { 0: "0", 30: "\\tfrac12", 45: "\\tfrac{\\sqrt2}2", 60: "\\tfrac{\\sqrt3}2", 90: "1" },
    cos: { 0: "1", 30: "\\tfrac{\\sqrt3}2", 45: "\\tfrac{\\sqrt2}2", 60: "\\tfrac12", 90: "0" },
    tg: { 0: "0", 30: "\\tfrac{\\sqrt3}3", 45: "1", 60: "\\sqrt3" }
  };
  function mod360(a) { return ((a % 360) + 360) % 360; }
  function refInfo(deg) { // quadrante e ângulo de referência
    var a = mod360(deg), q = a === 0 || a === 90 || a === 180 || a === 270 ? 0 : a < 90 ? 1 : a < 180 ? 2 : a < 270 ? 3 : 4;
    var r = q === 1 ? a : q === 2 ? 180 - a : q === 3 ? a - 180 : q === 4 ? 360 - a : a;
    return { a: a, q: q, r: r };
  }
  function exact(fn, deg) { // valor exato em LaTeX se notável
    var a = mod360(Math.round(deg)); if (Math.abs(deg - Math.round(deg)) > 1e-9) return null;
    var axis = { 0: [0, 1], 90: [1, 0], 180: [0, -1], 270: [-1, 0] };
    if (axis[a]) { var s = axis[a][0], c = axis[a][1]; var v = fn === "sen" ? s : fn === "cos" ? c : fn === "tg" ? (c === 0 ? null : s / c) : fn === "cotg" ? (s === 0 ? null : c / s) : fn === "sec" ? (c === 0 ? null : 1 / c) : (s === 0 ? null : 1 / s); return v === null ? "\\nexists" : String(v); }
    var ri = refInfo(a); if ([30, 45, 60].indexOf(ri.r) < 0) return null;
    var sgnS = ri.q <= 2 ? 1 : -1, sgnC = ri.q === 1 || ri.q === 4 ? 1 : -1;
    var base = { sen: EX.sen[ri.r], cos: EX.cos[ri.r], tg: EX.tg[ri.r], cotg: EX.tg[90 - ri.r], sec: { 30: "\\tfrac{2\\sqrt3}3", 45: "\\sqrt2", 60: "2" }[ri.r], cossec: { 30: "2", 45: "\\sqrt2", 60: "\\tfrac{2\\sqrt3}3" }[ri.r] }[fn];
    var sg = fn === "sen" || fn === "cossec" ? sgnS : fn === "cos" || fn === "sec" ? sgnC : sgnS * sgnC;
    return (sg < 0 ? "-" : "") + base;
  }
  W.exact = exact; W.refInfo = refInfo;
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function degToPiTex(deg) { // graus inteiros -> fração de pi em LaTeX
    var n = Math.round(deg * 1000), dd = 180000, g = gcd(n, dd); n /= g; dd /= g;
    if (n === 0) return "0";
    var s = n < 0 ? "-" : ""; n = Math.abs(n);
    var num = (n === 1 ? "" : n) + "\\pi";
    return dd === 1 ? s + num : s + "\\tfrac{" + num + "}{" + dd + "}";
  }
  W.degToPiTex = degToPiTex;

  // ---------- componentes de controle
  function slider(host, id, label, min, max, step, val, fmtf) {
    var c = el("div", { class: "ctrl" }, '<label for="' + id + '"><span>' + label + '</span><output></output></label><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '">');
    host.appendChild(c);
    var i = c.querySelector("input"), o = c.querySelector("output");
    var sync = function () { o.textContent = fmtf ? fmtf(+i.value) : i.value; }; i.addEventListener("input", sync); sync();
    return i;
  }
  function rows(host, keys) { var r = el("div", { class: "rows" }), out = {}; keys.forEach(function (k) { var row = el("div", { class: "row" }, "<b>" + k[1] + "</b><span></span>"); r.appendChild(row); out[k[0]] = row.lastChild; }); host.appendChild(r); return out; }
  function scene(host, vb) { var s = el("div", { class: "scene" }); s.innerHTML = '<svg viewBox="' + vb + '"></svg>'; host.appendChild(s); return s.firstChild; }
  function seg(host, opts, on, cb) { var s = el("div", { class: "seg", role: "group" }); opts.forEach(function (o) { var b = el("button", { type: "button", class: o[0] === on ? "on" : "" }, o[1]); b.onclick = function () { [].forEach.call(s.children, function (x) { x.classList.remove("on"); }); b.classList.add("on"); cb(o[0]); }; s.appendChild(b); }); host.appendChild(s); return s; }
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
  }
  function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
  function sg(t, a, b) { return ease((t - a) / (b - a)); }

  // ---------- ciclo: desenho base
  function cicloBase(cx, cy, R, opt) {
    opt = opt || {};
    var s = L([cx - R - 30, cy], [cx + R + 34, cy], ST.thin) + L([cx, cy + R + 30], [cx, cy - R - 30], ST.thin);
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" style="fill:none;stroke:var(--ink);stroke-width:2"/>';
    s += Tx(cx + R + 40, cy - 10, "x", TS.mut) + Tx(cx + 12, cy - R - 30, "y", TS.mut);
    if (opt.quad) { var d = R * 0.55; s += Tx(cx + d, cy - d, "1º Q", TS.mut) + Tx(cx - d, cy - d, "2º Q", TS.mut) + Tx(cx - d, cy + d, "3º Q", TS.mut) + Tx(cx + d, cy + d, "4º Q", TS.mut); }
    if (opt.axes) { s += Tx(cx + R + 16, cy + 14, opt.rad ? "0" : "0°", TS.mut) + Tx(cx + 16, cy - R - 12, opt.rad ? "π/2" : "90°", TS.mut, "start") + Tx(cx - R - 18, cy + 14, opt.rad ? "π" : "180°", TS.mut) + Tx(cx + 16, cy + R + 14, opt.rad ? "3π/2" : "270°", TS.mut, "start"); }
    return s;
  }
  function pt(cx, cy, R, deg) { return [cx + R * Math.cos(deg * D), cy - R * Math.sin(deg * D)]; }

  // =================================================================== FIGURAS
  var F = W.fig;
  F.angulo = function () {
    var O = [60, 150], A = [330, 190], B = [300, 40];
    return svg("0 20 380 200", L(O, A, ST.ink) + L(O, B, ST.ink) + C(A[0] - 50, A[1] - 7, 4) + C(B[0] - 44, B[1] + 20, 4) + arc(O, A, B, 46, "stroke:var(--pri)", "α", 64, "fill:var(--pri);font-size:16px") + Tx(O[0] - 16, O[1], "O") + Tx(A[0] - 50, A[1] - 16, "A") + Tx(B[0] - 44, B[1] + 2, "B"));
  };
  F.classes = function () {
    function one(x, deg, name) {
      var O = [x, 110], A = [x + 70, 110], Bp = [x + 70 * Math.cos(deg * D), 110 - 70 * Math.sin(deg * D)];
      var s = L(O, A, ST.ink) + L(O, Bp, ST.ink);
      if (deg === 90) s += rm(O, A, Bp, 14); else s += '<path d="M' + (x + 22) + " 110 A22 22 0 0 0 " + f1(x + 22 * Math.cos(deg * D)) + " " + f1(110 - 22 * Math.sin(deg * D)) + '" style="fill:none;stroke:var(--pri);stroke-width:2"/>';
      return s + Tx(x + 5, 140, name, "font-size:13px") + Tx(x + 5, 158, deg === 45 ? "0° < α < 90°" : deg === 90 ? "α = 90°" : deg === 130 ? "90° < α < 180°" : "α = 180°", TS.mut);
    }
    return svg("0 20 480 150", one(40, 45, "agudo") + one(160, 90, "reto") + one(300, 130, "obtuso") + one(400, 180, "raso"));
  };
  F.radiano = function () {
    var cx = 150, cy = 120, R = 85, a0 = 20, a1 = a0 + 180 / PI;
    var A = pt(cx, cy, R, a0), B = pt(cx, cy, R, a1);
    var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" style="fill:none;stroke:var(--ink);stroke-width:2"/>';
    s += '<path d="M' + f1(A[0]) + " " + f1(A[1]) + " A" + R + " " + R + " 0 0 0 " + f1(B[0]) + " " + f1(B[1]) + '" style="fill:none;stroke:var(--c-sen);stroke-width:5"/>';
    s += L([cx, cy], A, ST.hip) + L([cx, cy], B, ST.hip) + arc([cx, cy], A, B, 24, "stroke:var(--pri)", "1 rad", 44, "fill:var(--pri);font-size:12px");
    s += sideLab([cx, cy], A, "R", [cx, cy - 40], TS.hip, 12) + sideLab([cx, cy], B, "R", [cx + 40, cy], TS.hip, 12);
    var M = pt(cx, cy, R + 18, (a0 + a1) / 2); s += Tx(M[0], M[1], "arco = R", TS.sen + ";font-size:13px");
    s += Tx(A[0] + 10, A[1] + 6, "A", "", "start") + Tx(B[0] - 4, B[1] - 12, "B");
    s += Tx(300, 60, "comprimento do arco AB", TS.mut, "start") + Tx(300, 80, "= comprimento do raio", TS.mut, "start") + Tx(300, 110, "⇒ AÔB = 1 radiano", "font-size:14px", "start");
    return svg("0 20 470 200", s);
  };
  F.triPadrao = function () { // notação padrão do livro: reto em A, α em B, θ em C
    var B = [50, 200], A = [320, 200], Cc = [320, 50], cen = [230, 150];
    var s = L(B, Cc, ST.hip) + L(A, Cc, ST.sen) + L(B, A, ST.cos) + rm(A, B, Cc, 12);
    s += arc(B, A, Cc, 42, "stroke:var(--pri)", "α", 60, "fill:var(--pri);font-size:16px") + arc(Cc, A, B, 28, "stroke:var(--c-aux)", "θ", 44, "fill:var(--c-aux);font-size:16px");
    s += sideLab(B, Cc, "a (hipotenusa)", cen, TS.hip) + sideLab(A, Cc, "b", cen, TS.sen) + sideLab(B, A, "c", cen, TS.cos);
    s += Tx(B[0] - 14, B[1] + 6, "B") + Tx(A[0] + 14, A[1] + 8, "A") + Tx(Cc[0] + 14, Cc[1] - 4, "C");
    return svg("20 25 360 200", s);
  };
  F.triAula1 = F.triPadrao;
  F.metricas = function () { // Pitágoras por relações métricas (foto): reto em A em cima
    var B = [40, 200], Cc = [400, 200], a = 360, m = 120, H = [B[0] + m, 200], h = Math.sqrt(m * (a - m)), A = [H[0], 200 - h];
    var s = L(B, Cc, ST.ink) + L(A, B, ST.sen) + L(A, Cc, ST.cos) + L(A, H, "stroke:var(--c-aux);stroke-width:2;stroke-dasharray:6 4");
    s += rm(A, B, Cc, 11) + rm(H, Cc, A, 9) + arc(B, Cc, A, 26, "stroke:var(--pri)", "α", 40, "fill:var(--pri)") + arc(Cc, B, A, 34, "stroke:var(--c-aux)", "θ", 50, "fill:var(--c-aux)");
    s += sideLab(A, B, "c", [220, 200], TS.sen) + sideLab(A, Cc, "b", [220, 200], TS.cos) + Tx(A[0] + 10, (A[1] + 200) / 2, "h", TS.aux, "start");
    s += Tx((B[0] + H[0]) / 2, 214, "m", "") + Tx((H[0] + Cc[0]) / 2, 214, "n", "") + Tx(A[0], A[1] - 12, "A") + Tx(B[0] - 12, 204, "B") + Tx(Cc[0] + 12, 204, "C") + Tx(H[0] + 9, 190, "H", TS.mut);
    s += L([40, 232], [400, 232], ST.thin) + Tx(220, 246, "a = m + n", "");
    return svg("0 20 440 240", s);
  };
  F.n45 = function () {
    var a = 150, x0 = 60, y0 = 200, A = [x0, y0], B = [x0 + a, y0], Cc = [x0 + a, y0 - a], Dd = [x0, y0 - a];
    var s = '<rect x="' + x0 + '" y="' + (y0 - a) + '" width="' + a + '" height="' + a + '" style="fill:var(--pri-soft);stroke:var(--ink);stroke-width:2"/>' + L(A, Cc, ST.hip);
    s += rm(B, A, Cc, 12) + arc(A, B, Cc, 34, "stroke:var(--c-tg)", "45°", 52) + arc(Cc, B, A, 34, "stroke:var(--c-tg)", "45°", 52);
    s += Tx(x0 + a / 2, y0 + 16, "a", TS.cos) + Tx(x0 + a + 16, y0 - a / 2, "a", TS.sen) + Tx(x0 + a / 2 - 18, y0 - a / 2 - 12, "a√2", TS.hip);
    s += Tx(300, 90, "diagonal x:", TS.mut, "start") + Tx(300, 112, "x² = a² + a²", "", "start") + Tx(300, 134, "x = a√2", "", "start");
    return svg("20 30 420 200", s);
  };
  F.n3060 = function () {
    var x = 110, H = x * Math.sqrt(3), x0 = 40, y0 = 225, B = [x0, y0], Cc = [x0 + 2 * x, y0], T = [x0 + x, y0 - H], M = [x0 + x, y0];
    var s = P([B, Cc, T, B], "fill:var(--pri-soft);stroke:var(--ink);stroke-width:2") + L(T, M, "stroke:var(--c-sen);stroke-width:3;stroke-dasharray:6 4") + rm(M, Cc, T, 10);
    s += arc(B, Cc, T, 28, "stroke:var(--c-tg)", "60°", 46) + arc(Cc, B, T, 28, "stroke:var(--c-tg)", "60°", 46) + arc(T, B, M, 30, "stroke:var(--c-tg)", "30°", 48) + arc(T, Cc, M, 40, "stroke:var(--c-tg)", "30°", 58);
    s += Tx(x0 + x / 2, y0 + 16, "x", TS.cos) + Tx(x0 + 1.5 * x, y0 + 16, "x", TS.cos) + Tx(x0 + x / 2 - 22, y0 - H / 2, "2x", TS.hip) + Tx(x0 + 1.5 * x + 22, y0 - H / 2, "2x", TS.hip) + Tx(M[0] + 8, y0 - H / 2 + 26, "h = x√3", TS.sen, "start");
    return svg("0 20 300 240", s);
  };
  F.t345 = function () {
    var A = [60, 200], B = [60, 200 - 3 * 45], Cc = [60 + 4 * 45, 200], cen = [120, 170];
    var s = L(B, Cc, ST.hip) + L(A, B, ST.sen) + L(A, Cc, ST.cos) + rm(A, B, Cc, 12);
    s += arc(Cc, A, B, 40, "stroke:var(--c-tg)", "≈ 37°", 66) + arc(B, A, Cc, 26, "stroke:var(--c-tg)", "≈ 53°", 50);
    s += sideLab(A, B, "3", cen, TS.sen) + sideLab(A, Cc, "4", cen, TS.cos) + sideLab(B, Cc, "5", cen, TS.hip);
    return svg("20 40 330 190", s);
  };
  F.areaTri = function () {
    var A = [50, 200], Bp = [330, 200], al = 50, c = 180, Cc = [A[0] + c * Math.cos(al * D), 200 - c * Math.sin(al * D)], H = [Cc[0], 200];
    var s = P([A, Bp, Cc, A], "fill:var(--pri-soft);stroke:var(--ink);stroke-width:2") + L(Cc, H, "stroke:var(--c-sen);stroke-width:2.5;stroke-dasharray:6 4") + rm(H, Bp, Cc, 9);
    s += arc(A, Bp, Cc, 36, "stroke:var(--pri)", "α", 52, "fill:var(--pri);font-size:16px") + sideLab(A, Bp, "b", [190, 150], TS.cos) + sideLab(A, Cc, "c", [190, 190], TS.hip) + Tx(Cc[0] + 10, 150, "h = c·sen α", TS.sen, "start");
    return svg("20 50 380 180", s);
  };
  F.leiCos = function () { // triângulo qualquer: altura h de C sobre AB
    var A = [50, 200], Bp = [360, 200], Cc = [150, 60], H = [150, 200], cen = [187, 153];
    var s = P([A, Bp, Cc, A], "fill:var(--pri-soft);stroke:var(--ink);stroke-width:2") + L(Cc, H, "stroke:var(--c-sen);stroke-width:2.5;stroke-dasharray:6 4") + rm(H, Bp, Cc, 9);
    s += arc(A, Bp, Cc, 30, "stroke:var(--pri)", "Â", 46, "fill:var(--pri)") + sideLab(Bp, Cc, "a", cen, TS.hip) + sideLab(A, Cc, "b", cen, TS.cos) + sideLab(A, Bp, "c", cen, "") ;
    s += Tx(H[0] + 8, 130, "h", TS.sen, "start") + Tx((A[0] + H[0]) / 2, 214, "b·cos Â", "font-size:12px;fill:var(--c-cos)") + Tx((H[0] + Bp[0]) / 2, 228, "c − b·cos Â", "font-size:12px") + Tx(A[0] - 12, 204, "A") + Tx(Bp[0] + 12, 204, "B") + Tx(Cc[0], Cc[1] - 12, "C") + Tx(H[0] - 8, 188, "H", TS.mut, "end");
    return svg("20 30 380 210", s);
  };
  F.poligono = function (o) {
    var n = (o && o.n) || 6, cx = 140, cy = 120, R = 95, pts = [];
    for (var i = 0; i <= n; i++) pts.push(pt(cx, cy, R, 90 + 360 * i / n));
    var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" style="fill:none;stroke:var(--line);stroke-width:1.5"/>' + P(pts, "fill:var(--pri-soft);stroke:var(--pri);stroke-width:2");
    s += P([[cx, cy], pts[0], pts[1], [cx, cy]], "fill:var(--gold-soft);stroke:var(--c-aux);stroke-width:2") + arc([cx, cy], pts[0], pts[1], 22, "stroke:var(--c-aux)", "2π/n", 42, "fill:var(--c-aux);font-size:12px");
    s += sideLab([cx, cy], pts[0], "R", [cx - 60, cy], TS.hip, 10) + sideLab([cx, cy], pts[1], "R", [cx + 60, cy], TS.hip, 10) + C(cx, cy, 3);
    s += Tx(270, 90, "n triângulos iguais", TS.mut, "start") + Tx(270, 112, "de lados R, R", TS.mut, "start") + Tx(270, 134, "e ângulo 2π/n", TS.mut, "start");
    return svg("20 10 420 220", s);
  };
  F.cicloBase = function () {
    var cx = 180, cy = 150, R = 105, s = cicloBase(cx, cy, R, { quad: 1, axes: 1 });
    s += C(cx + R, cy, 5, "fill:var(--pri)") + Tx(cx + R + 12, cy - 14, "A(1, 0)", "fill:var(--pri);font-size:12px", "start");
    s += '<path d="M' + (cx + R * .72) + " " + (cy - R * .9) + " A" + R * 1.12 + " " + R * 1.12 + " 0 0 0 " + (cx - R * .1) + " " + (cy - R * 1.12) + '" style="fill:none;stroke:var(--ok);stroke-width:2" marker-end="url(#ah)"/>';
    s += Tx(cx + R * 0.95, cy - R * 1.02, "+ anti-horário", "fill:var(--ok);font-size:12px", "start");
    s += Tx(cx + R * 0.7, cy + R + 22, "− horário", "fill:var(--bad);font-size:12px", "start");
    return svg("0 10 400 290", '<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ok)"/></marker></defs>' + s);
  };
  F.sinais = function () {
    function one(x, name, sgn, col) {
      var cx = x, cy = 90, R = 50, s = cicloBase(cx, cy, R);
      var pos = [[1, -1], [-1, -1], [-1, 1], [1, 1]];
      pos.forEach(function (p, i) { s += Tx(cx + p[0] * 22, cy + p[1] * 22, sgn[i], "font-size:20px;fill:" + (sgn[i] === "+" ? "var(--ok)" : "var(--bad)")); });
      return s + Tx(cx, 175, name, "font-size:15px;fill:" + col);
    }
    return svg("0 0 480 190", one(85, "seno (eixo y)", ["+", "+", "−", "−"], "var(--c-sen)") + one(240, "cosseno (eixo x)", ["+", "−", "−", "+"], "var(--c-cos)") + one(395, "tangente", ["+", "−", "+", "−"], "var(--c-tg)"));
  };
  F.cicloRazoes = function () { // resumo das 6 razões (1º quadrante)
    var cx = 150, cy = 190, R = 110, a = 50, Pp = pt(cx, cy, R, a), c = Math.cos(a * D), s0 = Math.sin(a * D);
    var s = cicloBase(cx, cy, R);
    var tgP = [cx + R, cy - R * Math.tan(a * D)], secP = [cx + R / c, cy], cotgP = [cx + R / Math.tan(a * D), cy - R], cscP = [cx, cy - R / s0];
    s += L([cx + R, cy - R - 40], [cx + R, cy + 40], ST.thin) + L([cx - 40, cy - R], [cx + R + 60, cy - R], ST.thin);
    s += L([cx, cy], secP, "stroke:var(--c-aux);stroke-width:1.2");
    s += L(cscP, secP, "stroke:var(--muted);stroke-width:1.3");
    s += L([cx, cy], tgP, "stroke:var(--muted);stroke-width:1.3;stroke-dasharray:4 3");
    s += L([Pp[0], cy], Pp, ST.sen) + L([cx, cy], [Pp[0], cy], ST.cos) + L([cx + R, cy], tgP, ST.tg) + L([cx, cy - R], cotgP, "stroke:#0ea5b7;stroke-width:3.5");
    s += L([cx, cy + 14], [secP[0], cy + 14], ST.aux) + L([cx - 14, cy], [cx - 14, cscP[1]], "stroke:#d97706;stroke-width:3;stroke-dasharray:1 0");
    s += C(Pp[0], Pp[1], 4.5, "fill:var(--pri)") + arc([cx, cy], [cx + R, cy], Pp, 24, "stroke:var(--pri)", "α", 38, "fill:var(--pri)");
    s += Tx(Pp[0] + 8, (Pp[1] + cy) / 2, "sen", TS.sen + ";font-size:12px", "start") + Tx((cx + Pp[0]) / 2, cy - 10, "cos", TS.cos + ";font-size:12px") + Tx(cx + R + 8, (cy + tgP[1]) / 2, "tg", TS.tg + ";font-size:12px", "start");
    s += Tx((cx + cotgP[0]) / 2 + 10, cy - R - 12, "cotg", "fill:#0ea5b7;font-size:12px") + Tx((cx + secP[0]) / 2, cy + 28, "sec", TS.aux + ";font-size:12px") + Tx(cx - 20, (cy + cscP[1]) / 2, "cossec", "fill:#d97706;font-size:12px", "end");
    return svg("-40 30 480 290", s);
  };
  F.simetria = function (o) {
    var cx = 190, cy = 140, R = 100, a = 30, rad = o && o.rad;
    var s = cicloBase(cx, cy, R, { axes: 1, rad: rad });
    var ang = [[a, rad ? "α = π/6" : "α"], [180 - a, rad ? "π − α = 5π/6" : "π − α"], [180 + a, rad ? "π + α = 7π/6" : "π + α"], [360 - a, rad ? "2π − α = 11π/6" : "2π − α"]];
    var P0 = pt(cx, cy, R, a), P1 = pt(cx, cy, R, 180 - a), P2 = pt(cx, cy, R, 180 + a), P3 = pt(cx, cy, R, 360 - a);
    s += L(P1, P0, ST.dash) + L(P2, P3, ST.dash) + L(P0, P3, ST.dash) + L(P1, P2, ST.dash) + L(P0, P2, "stroke:var(--line);stroke-width:1.2") + L(P1, P3, "stroke:var(--line);stroke-width:1.2");
    ang.forEach(function (x, i) { var p = pt(cx, cy, R, x[0]), q = pt(cx, cy, R + 20, x[0]); s += C(p[0], p[1], 5, "fill:var(--pri)") + Tx(q[0], q[1], x[1], "font-size:12px;fill:var(--pri)", p[0] > cx ? "start" : "end"); });
    return svg("0 10 400 270", s);
  };
  F.eixoTg = function () {
    var cx = 150, cy = 150, R = 95, a = 40, Pp = pt(cx, cy, R, a), T = [cx + R, cy - R * Math.tan(a * D)];
    var s = cicloBase(cx, cy, R) + L([cx + R, cy - R - 50], [cx + R, cy + R + 30], "stroke:var(--c-tg);stroke-width:1.5");
    s += L([cx, cy], T, "stroke:var(--muted);stroke-width:1.4;stroke-dasharray:5 4") + L([cx + R, cy], T, ST.tg) + C(Pp[0], Pp[1], 5, "fill:var(--pri)") + C(T[0], T[1], 5, "fill:var(--c-tg)");
    s += arc([cx, cy], [cx + R, cy], Pp, 26, "stroke:var(--pri)", "α", 40, "fill:var(--pri)") + Tx(T[0] + 10, (T[1] + cy) / 2, "tg α", TS.tg, "start") + Tx(cx + R + 8, cy - R - 42, "eixo das tangentes", TS.mut + ";fill:var(--c-tg)", "start") + Tx(cx + R + 8, cy + 14, "A", "", "start");
    return svg("0 30 380 260", s);
  };

  // figuras pequenas para os desafios
  F.angQ = function (o) { var d = o.d, O = [40, 110], A = [200, 110], B = pt(40, 110, 150, d); var s = L(O, A, ST.ink) + L(O, B, ST.ink); s += d === 90 ? rm(O, A, B, 14) : '<path d="M72 110 A32 32 0 ' + (d > 180 ? 1 : 0) + ' 0 ' + f1(40 + 32 * Math.cos(d * D)) + " " + f1(110 - 32 * Math.sin(d * D)) + '" style="fill:none;stroke:var(--pri);stroke-width:2.5"/>'; return svg((d > 90 ? "-120" : "0") + " " + (d > 180 ? "0" : "-50") + " " + (d > 90 ? "340" : "230") + " " + (d > 180 ? "280" : "180"), s + (o.lab ? Tx(80, 90, o.lab, "fill:var(--pri)") : "")); };
  F.cicloPt = function (o) { var cx = 150, cy = 130, R = 95, s = cicloBase(cx, cy, R, { quad: o.quad }); (o.d || []).forEach(function (d, i) { var p = pt(cx, cy, R, d), q = pt(cx, cy, R + 20, d); s += L([cx, cy], p, "stroke:var(--line);stroke-width:1.5") + C(p[0], p[1], 6, "fill:var(--pri)") + (o.lab ? Tx(q[0], q[1], o.lab[i], "font-size:13px;fill:var(--pri)", p[0] >= cx ? "start" : "end") : ""); }); return svg("0 0 300 260", s); };
  F.triQ = function (o) { // α em B (esquerda), reto em A, C em cima
    var B = [60, 200], A = [320, 200], Cc = [320, 60], cen = [233, 153];
    var s = L(B, Cc, ST.hip) + L(A, Cc, ST.sen) + L(B, A, ST.cos) + rm(A, B, Cc, 12) + arc(B, A, Cc, 42, "stroke:var(--pri)", o.ang || "α", 62, "fill:var(--pri)");
    if (o.hip) s += sideLab(B, Cc, o.hip, cen, TS.hip); if (o.op) s += sideLab(A, Cc, o.op, cen, TS.sen); if (o.adj) s += sideLab(B, A, o.adj, cen, TS.cos);
    return svg("20 40 360 190", s);
  };
  F.grafQ = function (o) { var W0 = 360, H0 = 170, ox = 30, oy = 85, kx = 300 / (2 * PI), ky = o.ky || 22, s = L([ox, oy], [W0 - 10, oy], ST.thin) + L([ox, 10], [ox, H0 - 10], ST.thin); for (var y = -(o.ym || 3); y <= (o.ym || 3); y++) if (y) s += Tx(ox - 6, oy - y * ky, y, TS.mut, "end"); [[PI, "π"], [2 * PI, "2π"], [PI / 2, "π/2"], [3 * PI / 2, "3π/2"]].forEach(function (m) { s += L([ox + m[0] * kx, oy - 3], [ox + m[0] * kx, oy + 3], ST.thin) + Tx(ox + m[0] * kx, oy + 14, m[1], TS.mut); }); var pts = []; for (var i = 0; i <= 300; i++) { var x = 2 * PI * i / 300, v = o.a + o.b * (o.f === "cos" ? Math.cos(o.c * x) : Math.sin(o.c * x)); pts.push([ox + x * kx, oy - v * ky]); } s += P(pts, "fill:none;stroke:var(--c-sen);stroke-width:3"); return svg("0 0 " + W0 + " " + H0, s); };

  // =================================================================== LABORATÓRIOS
  // --- Módulo 1: ângulo e classificação
  W.anguloLab = function (h) {
    var S = scene(h, "0 0 420 250"), c = el("div", { class: "ctrls" }); h.appendChild(c);
    var a = slider(c, "angA", "Medida do ângulo", 0, 360, 1, 50, function (v) { return v + "°"; });
    var r = rows(h, [["cls", "Classificação"], ["dms", "Graus, min, s"], ["rad", "Em radianos"], ["comp", "Complemento"], ["sup", "Suplemento"], ["rep", "Replemento"]]);
    function draw() {
      var v = +a.value, O = [210, 150], A = [370, 150], B = pt(210, 150, 150, v);
      var s = L(O, A, ST.ink) + L(O, B, ST.hip);
      if (v === 90) s += rm(O, A, B, 16);
      else if (v > 0) { var e = pt(210, 150, 40, v); s += '<path d="M250 150 A40 40 0 ' + (v > 180 ? 1 : 0) + ' 0 ' + f1(e[0]) + " " + f1(e[1]) + '" style="fill:none;stroke:var(--pri);stroke-width:2.5"/>'; }
      s += C(210, 150, 4) + Tx(196, 166, "O") + Tx(375, 136, "A") + Tx(B[0] + (B[0] >= 210 ? 10 : -10), B[1] - 10, "B", "", B[0] >= 210 ? "start" : "end");
      s += Tx(210, 232, "AÔB = " + v + "°", "font-size:16px;fill:var(--pri)");
      S.innerHTML = s;
      r.cls.textContent = v === 0 ? "nulo (lados coincidem)" : v < 90 ? "agudo (menor que 90°)" : v === 90 ? "reto (90°)" : v < 180 ? "obtuso (entre 90° e 180°)" : v === 180 ? "raso (180°: lados opostos)" : v < 360 ? "maior que o raso (côncavo)" : "volta completa (360°)";
      r.dms.textContent = v + "° 0′ 0″ = " + (v * 60) + " minutos";
      r.rad.innerHTML = tex(v + "^\\circ=" + v + "\\cdot\\frac{\\pi}{180}=" + degToPiTex(v) + "\\text{ rad}");
      r.comp.textContent = v <= 90 ? (90 - v) + "° (soma 90°)" : "não tem (passa de 90°)";
      r.sup.textContent = v <= 180 ? (180 - v) + "° (soma 180°)" : "não tem (passa de 180°)";
      r.rep.textContent = (360 - v) + "° (soma 360°)";
    }
    a.oninput = draw; draw();
  };
  W.dmsLab = function (h) {
    var c = el("div", { class: "btns" }, '<label>Graus <input id="dg" class="inp" style="width:5em" value="31" inputmode="numeric"></label><label>Minutos <input id="dm" class="inp" style="width:5em" value="15" inputmode="numeric"></label><label>Segundos <input id="ds" class="inp" style="width:5em" value="45" inputmode="numeric"></label>');
    h.appendChild(c); var out = el("div", { class: "rows" }); h.appendChild(out);
    function go() {
      var g = +c.querySelector("#dg").value || 0, m = +c.querySelector("#dm").value || 0, s = +c.querySelector("#ds").value || 0;
      var dec = g + m / 60 + s / 3600;
      out.innerHTML = '<div class="row"><b>Em graus decimais</b><span>' + tex(g + "^\\circ+\\frac{" + m + "}{60}^\\circ+\\frac{" + s + "}{3600}^\\circ\\approx" + tf(dec, 4) + "^\\circ") + '</span></div><div class="row"><b>Em radianos</b><span>' + tex(tf(dec, 4) + "\\cdot\\frac{\\pi}{180}\\approx" + tf(dec / 180, 5) + "\\pi\\approx" + tf(dec * D, 4) + "\\text{ rad}") + "</span></div>";
    }
    c.addEventListener("input", go); go();
  };
  // ---------- graus, minutos e segundos: motor de passos
  function dmsStr(g, m, s) { return g + "°" + (m || s ? " " + m + "′" : "") + (s ? " " + s + "″" : ""); }
  function dmsTex(g, m, s) { return g + "^\\circ" + (m || s ? "\\," + m + "'" : "") + (s ? "\\," + s + "''" : ""); }
  function normSteps(g, m, s, st) { // normaliza com "vai um"
    if (s >= 60) { var c = Math.floor(s / 60); st.push("Os segundos passaram de 60: " + s + "″ = " + c + "′ " + (s - 60 * c) + "″. Sobe " + c + "′ para os minutos (“vai " + c + "”)."); m += c; s -= 60 * c; st.push("Fica " + tex(dmsTex(g, m, s)) + "."); }
    if (m >= 60) { var c2 = Math.floor(m / 60); st.push("Os minutos passaram de 60: " + m + "′ = " + c2 + "° " + (m - 60 * c2) + "′. Sobe " + c2 + "° para os graus."); g += c2; m -= 60 * c2; st.push("Fica " + tex(dmsTex(g, m, s)) + "."); }
    return [g, m, s];
  }
  function sexOp(op, a, b, k) { // a,b = [g,m,s]; devolve {res:[g,m,s]|number, steps:[]}
    var st = [], g, m, s;
    if (op === "soma") {
      g = a[0] + b[0]; m = a[1] + b[1]; s = a[2] + b[2];
      st.push("Some cada unidade separadamente (graus com graus, minutos com minutos, segundos com segundos): " + tex(dmsTex(a[0], a[1], a[2]) + "+" + dmsTex(b[0], b[1], b[2]) + "=" + g + "^\\circ\\," + m + "'\\," + s + "''") + ".");
      var r = normSteps(g, m, s, st); if (st.length === 1) st.push("Nada passou de 60: o resultado já está pronto."); return { res: r, steps: st };
    }
    if (op === "sub") {
      if (a[0] * 3600 + a[1] * 60 + a[2] < b[0] * 3600 + b[1] * 60 + b[2]) return { res: null, steps: ["O primeiro ângulo é menor que o segundo: a diferença seria negativa. Troque a ordem."] };
      g = a[0]; m = a[1]; s = a[2];
      st.push("Escreva um embaixo do outro: " + tex(dmsTex(g, m, s) + "-" + dmsTex(b[0], b[1], b[2])) + ".");
      if (s < b[2]) { st.push("Não dá para tirar " + b[2] + "″ de " + s + "″: empreste 1′ dos minutos (1′ = 60″). " + tex(m + "'\\," + s + "''\\to" + (m - 1) + "'\\," + (s + 60) + "''") + "."); m -= 1; s += 60; }
      if (m < b[1]) { st.push("Não dá para tirar " + b[1] + "′ de " + m + "′: empreste 1° dos graus (1° = 60′). " + tex(g + "^\\circ\\," + m + "'\\to" + (g - 1) + "^\\circ\\," + (m + 60) + "'") + "."); g -= 1; m += 60; }
      st.push("Agora subtraia unidade por unidade: " + tex((g - b[0]) + "^\\circ\\ \\ " + (m - b[1]) + "'\\ \\ " + (s - b[2]) + "''") + ".");
      return { res: [g - b[0], m - b[1], s - b[2]], steps: st };
    }
    if (op === "mul") {
      g = a[0] * k; m = a[1] * k; s = a[2] * k;
      st.push("Multiplique cada unidade por " + k + ": " + tex(k + "\\times(" + dmsTex(a[0], a[1], a[2]) + ")=" + g + "^\\circ\\," + m + "'\\," + s + "''") + ".");
      return { res: normSteps(g, m, s, st), steps: st };
    }
    if (op === "div") {
      var q1 = Math.floor(a[0] / k), r1 = a[0] - k * q1;
      st.push("Graus: " + a[0] + " ÷ " + k + " = " + q1 + "°, resto " + r1 + "°." + (r1 ? " O resto vira minutos: " + r1 + "° = " + (60 * r1) + "′." : ""));
      var mt = a[1] + 60 * r1, q2 = Math.floor(mt / k), r2 = mt - k * q2;
      st.push("Minutos: " + (r1 ? 60 * r1 + "′ + " : "") + a[1] + "′ = " + mt + "′; " + mt + " ÷ " + k + " = " + q2 + "′, resto " + r2 + "′." + (r2 ? " O resto vira segundos: " + r2 + "′ = " + (60 * r2) + "″." : ""));
      var stt = a[2] + 60 * r2, q3 = stt / k;
      st.push("Segundos: " + (r2 ? 60 * r2 + "″ + " : "") + a[2] + "″ = " + stt + "″; " + stt + " ÷ " + k + " = " + fmt(q3, 2) + "″.");
      return { res: [q1, q2, Math.round(q3 * 100) / 100], steps: st };
    }
    if (op === "min") {
      var tm = a[0] * 60 + a[1];
      st.push("Cada grau tem 60′: " + tex(a[0] + "\\cdot60=" + (a[0] * 60) + "'") + ".");
      st.push("Some os minutos que já existiam: " + tex((a[0] * 60) + "+" + a[1] + "=" + tm + "'") + (a[2] ? " e os " + a[2] + "″ valem " + fmt(a[2] / 60, 3) + "′" : "") + ".");
      return { res: tm + a[2] / 60, steps: st, unit: "′" };
    }
    if (op === "seg") {
      var ts = a[0] * 3600 + a[1] * 60 + a[2];
      st.push("Cada grau tem 3600″ (60 × 60): " + tex(a[0] + "\\cdot3600=" + (a[0] * 3600) + "''") + ".");
      st.push("Cada minuto tem 60″: " + tex(a[1] + "\\cdot60=" + (a[1] * 60) + "''") + ".");
      st.push("Some tudo: " + tex((a[0] * 3600) + "+" + (a[1] * 60) + "+" + a[2] + "=" + ts + "''") + ".");
      return { res: ts, steps: st, unit: "″" };
    }
    if (op === "dec") {
      var d = a[0] + a[1] / 60 + a[2] / 3600;
      st.push("Minutos viram fração de grau dividindo por 60; segundos, dividindo por 3600.");
      st.push(tex(a[0] + "+\\frac{" + a[1] + "}{60}+\\frac{" + a[2] + "}{3600}\\approx" + tf(d, 4)) + " graus.");
      return { res: d, steps: st, unit: "°" };
    }
    if (op === "rad") {
      var tsec = a[0] * 3600 + a[1] * 60 + a[2], num = tsec, den = 648000, gg = gcd(num, den); num /= gg; den /= gg;
      st.push("Escreva tudo em segundos: " + tsec + "″. Meia volta (180°) tem 180 · 3600 = 648000″ e vale π rad.");
      st.push("Regra de três: " + tex("\\frac{" + tsec + "}{648000}\\pi=" + (num === 1 ? "" : num) + (den === 1 ? "\\pi" : "\\frac{\\pi}{" + den + "}") + (den === 1 ? "" : "") + "\\approx" + tf(tsec / 648000 * PI, 4) + "\\ \\text{rad}") + ".");
      return { res: tsec / 648000 * PI, steps: st, unit: " rad" };
    }
    if (op === "desec") { // k segundos -> g m s
      var mm = Math.floor(k / 60), ss = k - 60 * mm, gg2 = Math.floor(mm / 60), m2 = mm - 60 * gg2;
      st.push("Divida os segundos por 60: " + k + " ÷ 60 = " + mm + " (minutos), resto " + ss + "″.");
      st.push("Divida os minutos por 60: " + mm + " ÷ 60 = " + gg2 + " (graus), resto " + m2 + "′.");
      st.push("Leia de baixo para cima: " + tex(dmsTex(gg2, m2, ss)) + ".");
      return { res: [gg2, m2, ss], steps: st };
    }
    if (op === "demin") {
      var g3 = Math.floor(k / 60), m3 = k - 60 * g3;
      st.push("Divida os minutos por 60: " + k + " ÷ 60 = " + g3 + " (graus), resto " + m3 + "′.");
      return { res: [g3, m3, 0], steps: st };
    }
  }
  W.sexOp = sexOp;
  function resStr(r) { if (r.res === null) return "—"; if (Array.isArray(r.res)) return dmsStr(r.res[0], r.res[1], r.res[2]); return fmt(r.res, 4) + (r.unit || ""); }
  W.sexCalc = function (h) {
    var ops = [["soma", "somar (A + B)"], ["sub", "subtrair (A − B)"], ["mul", "multiplicar A por k"], ["div", "dividir A por k"], ["min", "A em minutos"], ["seg", "A em segundos"], ["dec", "A em graus decimais"], ["rad", "A em radianos"], ["desec", "k segundos → ° ′ ″"], ["demin", "k minutos → ° ′"]];
    var box = el("div", { class: "grid", style: "gap:10px" });
    box.innerHTML = '<div class="btns"><b style="min-width:2em">A</b><input id="scG1" class="inp" style="width:5em" value="25" inputmode="numeric" aria-label="Graus de A"><span>°</span><input id="scM1" class="inp" style="width:5em" value="48" inputmode="numeric" aria-label="Minutos de A"><span>′</span><input id="scS1" class="inp" style="width:5em" value="50" inputmode="numeric" aria-label="Segundos de A"><span>″</span></div>' +
      '<div class="btns"><label for="scOp"><b>Operação</b></label><select id="scOp" class="inp" style="width:auto">' + ops.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + "</option>"; }).join("") + '</select><label for="scK" class="small">k =</label><input id="scK" class="inp" style="width:6em" value="3" inputmode="numeric"></div>' +
      '<div class="btns" id="scBrow"><b style="min-width:2em">B</b><input id="scG2" class="inp" style="width:5em" value="12" inputmode="numeric" aria-label="Graus de B"><span>°</span><input id="scM2" class="inp" style="width:5em" value="30" inputmode="numeric" aria-label="Minutos de B"><span>′</span><input id="scS2" class="inp" style="width:5em" value="20" inputmode="numeric" aria-label="Segundos de B"><span>″</span></div>';
    h.appendChild(box); var out = el("div", { class: "steps" }); h.appendChild(out);
    function v(id) { var x = parseInt(box.querySelector(id).value, 10); return isNaN(x) || x < 0 ? 0 : x; }
    function go() {
      var op = box.querySelector("#scOp").value, a = [v("#scG1"), v("#scM1"), v("#scS1")], b = [v("#scG2"), v("#scM2"), v("#scS2")], k = Math.max(1, v("#scK"));
      box.querySelector("#scBrow").hidden = !(op === "soma" || op === "sub");
      box.querySelector("#scK").parentNode.querySelectorAll("#scK,label[for=scK]").forEach(function (x) { x.hidden = !(op === "mul" || op === "div" || op === "desec" || op === "demin"); });
      var r = sexOp(op, a, b, k);
      out.innerHTML = r.steps.map(function (s, i) { return '<div class="st"><span class="pl">Passo ' + (i + 1) + "</span><p>" + s + "</p></div>"; }).join("") + '<div class="final"><b>Resultado:</b> ' + resStr(r) + "</div>";
    }
    box.addEventListener("input", go); box.addEventListener("change", go); go();
  };
  function parseAns(s) { var n = (s.replace(/,/g, ".").match(/-?\d+(\.\d+)?/g) || []).map(Number); return n; }
  W.sexTreino = function (h) {
    var q = el("p", { class: "ex-q" }), inp = el("input", { class: "inp", id: "stIn", style: "width:12em", "aria-label": "Sua resposta" }), bt = el("button", { class: "btn p", type: "button" }, "Conferir"), nx = el("button", { class: "btn", type: "button" }, "Nova questão");
    var hint = el("p", { class: "small muted" }), fb = el("div"), sc = el("span", { class: "small muted" });
    var row = el("div", { class: "btns" }); row.appendChild(inp); row.appendChild(bt); row.appendChild(nx); row.appendChild(sc);
    h.appendChild(q); h.appendChild(hint); h.appendChild(row); h.appendChild(fb);
    var cur, hits = 0, tries = 0, done;
    function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function gen() {
      var t = ri(1, 8), A = [ri(5, 80), ri(1, 59), ri(1, 59)], B = [ri(3, 40), ri(1, 59), ri(1, 59)];
      done = false; fb.innerHTML = ""; inp.value = "";
      if (t === 1) cur = { op: "min", a: [A[0], A[1], 0], txt: "Quantos minutos tem um arco de " + dmsStr(A[0], A[1], 0) + "?", kind: "num", fmt: "um número, ex.: 1518" };
      if (t === 2) cur = { op: "seg", a: A, txt: "Quantos segundos tem um arco de " + dmsStr(A[0], A[1], A[2]) + "?", kind: "num", fmt: "um número, ex.: 7123" };
      if (t === 3) { var mm = [6, 12, 15, 18, 24, 30, 36, 42, 45, 48, 54][ri(0, 10)]; cur = { op: "dec", a: [A[0], mm, 0], txt: "Escreva " + dmsStr(A[0], mm, 0) + " em graus decimais.", kind: "num", fmt: "decimal, ex.: 22,5" }; }
      if (t === 4) cur = { op: "soma", a: A, b: B, txt: "Calcule " + dmsStr(A[0], A[1], A[2]) + " + " + dmsStr(B[0], B[1], B[2]) + ".", kind: "dms", fmt: "graus minutos segundos, ex.: 38 19 10" };
      if (t === 5) { if (A[1] >= B[1]) B[1] = Math.min(59, A[1] + ri(1, 10)); if (A[0] <= B[0]) A[0] = B[0] + ri(2, 30); cur = { op: "sub", a: A, b: B, txt: "Calcule " + dmsStr(A[0], A[1], A[2]) + " − " + dmsStr(B[0], B[1], B[2]) + ".", kind: "dms", fmt: "graus minutos segundos, ex.: 51 10 33" }; }
      if (t === 6) { var tot = ri(3000, 20000); cur = { op: "desec", k: tot, txt: "Escreva " + tot + "″ em graus, minutos e segundos.", kind: "dms", fmt: "graus minutos segundos" }; }
      if (t === 7) { var C = [ri(10, 80), ri(1, 59), ri(0, 59)]; cur = { op: "sub", a: [90, 0, 0], b: C, txt: "Qual é o complemento de " + dmsStr(C[0], C[1], C[2]) + "?", kind: "dms", fmt: "graus minutos segundos (lembre: 90° = 89° 59′ 60″)" }; }
      if (t === 8) { var k = ri(2, 3), Q = [ri(5, 40), ri(0, 59), ri(0, 59)], P0 = [Q[0] * k, Q[1] * k, Q[2] * k]; var n = normSteps(P0[0], P0[1], P0[2], []); cur = { op: "div", a: n, k: k, txt: "Divida " + dmsStr(n[0], n[1], n[2]) + " por " + k + ".", kind: "dms", fmt: "graus minutos segundos" }; }
      cur.r = sexOp(cur.op, cur.a, cur.b, cur.k);
      q.innerHTML = cur.txt; hint.textContent = "Responda como " + cur.fmt + ".";
    }
    function check() {
      if (done) return; var n = parseAns(inp.value); if (!n.length) { fb.innerHTML = '<div class="alert bad">Digite sua resposta.</div>'; return; }
      var ok;
      if (cur.kind === "num") ok = Math.abs(n[0] - cur.r.res) < 0.011;
      else { var u = (n[0] || 0) * 3600 + (n[1] || 0) * 60 + (n[2] || 0), w = cur.r.res[0] * 3600 + cur.r.res[1] * 60 + cur.r.res[2]; ok = Math.abs(u - w) < 0.6 && (n[1] || 0) < 60 && (n[2] || 0) < 60; if (!ok && Math.abs(u - w) < 0.6) cur.note = "O valor total está certo, mas minutos e segundos devem ficar abaixo de 60 (faça o “vai um”)."; }
      tries++; if (ok) { hits++; T_().beep("ok"); T_().addXP(2, "treino"); } else T_().beep("bad");
      done = true; sc.textContent = "Acertos: " + hits + "/" + tries;
      fb.innerHTML = '<div class="fb ' + (ok ? "y" : "n") + '"><b class="t">' + (ok ? "Certo!" : "Ainda não. Resposta: " + resStr(cur.r)) + "</b>" + (cur.note && !ok ? cur.note : "") + '</div><div class="steps" style="margin-top:8px">' + cur.r.steps.map(function (s, i) { return '<div class="st"><span class="pl">Passo ' + (i + 1) + "</span><p>" + s + "</p></div>"; }).join("") + "</div>";
      cur.note = "";
    }
    bt.onclick = check; inp.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); }); nx.onclick = gen; gen();
  };
  // ---------- arcos côngruos: motor com todas as técnicas
  function fracPi(n, d) { // n·π/d em LaTeX, simplificado
    if (n === 0) return "0"; var g = gcd(n, d); n /= g; d /= g; var sg = n < 0 ? "-" : ""; n = Math.abs(n);
    var num = (n === 1 ? "" : n) + "\\pi"; return d === 1 ? sg + num : sg + "\\frac{" + num + "}{" + d + "}";
  }
  function quadOf(deg) { var r = refInfo(deg); return r.q ? r.q + "º quadrante" : "sobre um eixo (" + mod360(deg) + "°), não pertence a quadrante"; }
  function congSteps(raw) {
    var s = raw.trim().replace(/−/g, "-").replace(/\s+/g, "").replace(/pi/gi, "π").replace(",", ".");
    var T = [], out = { ok: true };
    var mR = s.match(/^(-?\d*)π(?:\/(\d+))?$/), mReal = s.match(/^(-?\d+(?:\.\d+)?)rad$/), mD = s.match(/^(-?\d+(?:\.\d+)?)°?$/);
    if (mR) {
      var a = mR[1] === "" ? 1 : mR[1] === "-" ? -1 : +mR[1], b = mR[2] ? +mR[2] : 1, g0 = gcd(a, b); a /= g0; b /= g0;
      var two = 2 * b, q = Math.floor(a / two), r = a - two * q, deg = a * 180 / b;
      out.deg = mod360(deg); out.tex = fracPi(r, b); out.q = quadOf(deg); out.k = q; out.inTex = fracPi(a, b);
      T.push(["Técnica 1 · dividir o numerador por 2b", "Uma volta é \\(2\\pi" + (b > 1 ? "=\\tfrac{" + two + "\\pi}{" + b + "}" : "") + "\\). Divida o numerador " + a + " por " + two + " (o dobro do denominador) e guarde o resto (entre 0 e " + (two - 1) + ").",
        a + "=" + two + "\\cdot(" + q + ")+" + r + "\\ \\Rightarrow\\ " + fracPi(a, b) + "=" + q + "\\cdot2\\pi+" + fracPi(r, b)]);
      T.push(["Técnica 2 · trocar π por 180° e dividir por 360", "Converta para graus e divida por 360°; o resto é a 1ª determinação.",
        fracPi(a, b) + "=" + fmt(deg, 2).replace(",", "{,}") + "^\\circ=360^\\circ\\cdot(" + Math.floor(deg / 360) + ")+" + fmt(mod360(deg), 2).replace(",", "{,}") + "^\\circ"]);
      var near = 2 * Math.round(a / b / 2), rest = a - near * b;
      T.push(["Técnica 3 · tirar o múltiplo par de π mais próximo", "\\(\\frac ab\\approx" + tf(a / b, 2) + "\\); o número par mais próximo é " + near + ". Tire " + near + "π (" + (near / 2) + " voltas)" + (rest < 0 ? " e, como sobrou negativo, some \\(2\\pi\\)." : "."),
        fracPi(a, b) + "-" + near + "\\pi=" + fracPi(rest, b) + (rest < 0 ? "\\ \\equiv\\ " + fracPi(rest, b) + "+2\\pi=" + fracPi(rest + two, b) : "")]);
    } else if (mReal) {
      var x = +mReal[1], tw = 2 * PI, q2 = Math.floor(x / tw), r2 = x - tw * q2;
      out.deg = r2 / D; out.tex = tf(r2, 4) + "\\text{ rad}"; out.q = quadOf(r2 / D); out.k = q2; out.inTex = tf(x, 4) + "\\text{ rad}";
      T.push(["Técnica 4 · número real (sem π)", "Use \\(2\\pi\\approx6{,}2832\\). Divida por \\(2\\pi\\): o quociente inteiro é o número de voltas.",
        tf(x, 4) + "=6{,}2832\\cdot(" + q2 + ")+" + tf(r2, 4)]);
      T.push(["Localizar", "Compare com \\(\\frac\\pi2\\approx1{,}571\\), \\(\\pi\\approx3{,}142\\) e \\(\\frac{3\\pi}2\\approx4{,}712\\).", tf(r2, 4) + "\\ \\text{rad}\\approx" + tf(r2 / D, 1) + "^\\circ"]);
    } else if (mD) {
      var dg = +mD[1], q3 = Math.floor(dg / 360), r3 = Math.round((dg - 360 * q3) * 1000) / 1000;
      out.deg = r3; out.tex = fmt(r3, 3).replace(",", "{,}") + "^\\circ"; out.q = quadOf(r3); out.k = q3; out.inTex = fmt(dg, 3).replace(",", "{,}") + "^\\circ";
      T.push(["Técnica 1 · dividir por 360°", dg >= 0 ? "Faça a divisão inteira por 360: o quociente é o número de voltas completas e o <b>resto</b> é a 1ª determinação." : "Para arco negativo, use a divisão “com resto positivo”: o quociente é o inteiro logo abaixo.",
        fmt(dg, 3).replace(",", "{,}") + "=360\\cdot(" + q3 + ")+" + fmt(r3, 3).replace(",", "{,}")]);
      if (dg < 0) {
        var steps = [], v = dg; while (v < 0 && steps.length < 8) { steps.push(fmt(v, 3).replace(",", "{,}") + "^\\circ"); v += 360; } steps.push(fmt(v, 3).replace(",", "{,}") + "^\\circ");
        var ad = Math.abs(dg), qq = Math.floor(ad / 360), rr = Math.round((ad - 360 * qq) * 1000) / 1000;
        T.push(["Técnica 2 · somar 360° até ficar positivo", "Cada soma de 360° é uma volta a mais, então o ponto final não muda.", steps.join("\\to") + (steps.length >= 9 ? "\\cdots" : "")]);
        T.push(["Técnica 3 · usar o valor positivo e “voltar”", "Divida o módulo: " + ad + " = 360·" + qq + " + " + rr + ". Andar −" + rr + "° (horário) é o mesmo que andar 360° − " + rr + "° no sentido positivo.", rr === 0 ? "0^\\circ" : "360^\\circ-" + fmt(rr, 3).replace(",", "{,}") + "^\\circ=" + fmt(360 - rr, 3).replace(",", "{,}") + "^\\circ"]);
      }
    } else { out.ok = false; return out; }
    out.T = T; return out;
  }
  W.congSteps = congSteps;
  function congHTML(c) {
    var h = "";
    c.T.forEach(function (t) { h += '<div class="st"><span class="pl">' + t[0] + "</span><p>" + t[1] + '</p><div class="m">' + tex(t[2], true) + "</div></div>"; });
    var fam = /π|pi/.test(c.inTex) || /\\pi/.test(c.tex) ? c.tex + "+2k\\pi" : c.tex + "+k\\cdot360^\\circ";
    h += '<div class="final"><b>1ª determinação:</b> ' + tex(c.inTex + "\\equiv" + c.tex) + " · " + c.q + " · " + Math.abs(c.k) + (Math.abs(c.k) === 1 ? " volta" : " voltas") + (c.k < 0 ? " no sentido negativo" : "") + '.<br><span class="small">Todos os arcos côngruos a ele: ' + tex(fam + ",\\ k\\in\\mathbb Z") + "</span></div>";
    return h;
  }
  W.congHTML = congHTML;
  W.congLab = function (h) {
    var bx = el("div", { class: "btns" }, '<label for="cgIn" class="small"><b>Arco</b></label><input id="cgIn" class="inp" value="41π/3" aria-label="Arco: em graus (2100), negativo (−1000), em radianos (41π/3) ou real (10 rad)"><span class="small muted">graus: 2100 · negativo: −1000 · radianos: 41π/3 ou −17π/4 · real: 10 rad</span>');
    h.appendChild(bx); var S = scene(h, "0 0 400 250"), out = el("div", { class: "steps" }); h.appendChild(out);
    var ex = el("div", { class: "btns" }); h.appendChild(ex);
    ["2100", "1270", "-1000", "81π/4", "41π/3", "31π/6", "-17π/4", "-π/2", "10 rad"].forEach(function (x) { var b = el("button", { class: "btn s", type: "button" }, x); b.onclick = function () { bx.querySelector("input").value = x; go(); }; ex.appendChild(b); });
    function go() {
      var c = congSteps(bx.querySelector("input").value);
      if (!c.ok) { out.innerHTML = '<div class="alert bad">Não entendi. Escreva em graus (2100 ou −1000), em radianos com π (41π/3) ou um número com “rad” (10 rad).</div>'; return; }
      out.innerHTML = congHTML(c); T_().renderMath(out);
      var cx = 200, cy = 125, R = 90, s = cicloBase(cx, cy, R, { quad: 1 }), turns = c.k + c.deg / 360, pts = [], n = Math.max(2, Math.ceil(Math.abs(turns * 360) / 3));
      for (var i = 0; i <= n; i++) { var u = turns * 360 * i / n; pts.push(pt(cx, cy, 18 + 62 * i / n, u)); }
      s += P(pts, "fill:none;stroke:" + (turns >= 0 ? "var(--ok)" : "var(--bad)") + ";stroke-width:2");
      var Pp = pt(cx, cy, R, c.deg); s += L([cx, cy], Pp, ST.hip) + C(Pp[0], Pp[1], 6, "fill:var(--pri)");
      S.innerHTML = s;
    }
    bx.querySelector("input").addEventListener("input", go); go();
  };
  W.congTreino = function (h) {
    var q = el("div", { class: "gbig" }), opts = el("div", { class: "grid", style: "grid-template-columns:repeat(auto-fit,minmax(110px,1fr));max-width:560px" }), qd = el("div", { class: "btns" }), fb = el("div"), bar = el("div", { class: "btns" });
    var nx = el("button", { class: "btn p", type: "button" }, "Novo arco"), sc = el("span", { class: "small muted" }); bar.appendChild(nx); bar.appendChild(sc);
    h.appendChild(el("p", { class: "small" }, "<b>Etapa 1:</b> escolha a 1ª determinação. <b>Etapa 2:</b> diga o quadrante.")); h.appendChild(q); h.appendChild(opts); h.appendChild(qd); h.appendChild(fb); h.appendChild(bar);
    var hits = 0, tries = 0, cur;
    function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function gen() {
      var t = ri(1, 4), raw, c, choices = [];
      if (t === 1) { raw = String(ri(2, 9) * 360 + ri(1, 359)); }
      if (t === 2) { raw = String(-(ri(0, 4) * 360 + ri(1, 359))); }
      if (t === 3 || t === 4) { var b = [2, 3, 4, 6][ri(0, 3)], a; do { a = ri(2 * b + 1, 14 * b); } while (gcd(a, b) !== 1); if (t === 4) a = -a; raw = a + "π/" + b; if (b === 1) raw = a + "π"; }
      c = congSteps(raw); cur = { raw: raw, c: c, step: 1 };
      var isRad = /π/.test(raw), right = isRad ? c.tex : c.tex;
      var cand = [c.deg, 360 - c.deg, (c.deg + 180) % 360, (c.deg + 90) % 360, Math.abs(Number(raw)) % 360];
      cand.forEach(function (d) { if (isNaN(d)) return; d = Math.round((((d % 360) + 360) % 360) * 1000) / 1000; if (choices.every(function (x) { return x !== d; }) && choices.length < 4 && !(d === 0 && c.deg !== 0)) choices.push(d); });
      while (choices.length < 4) { var d2 = ri(1, 23) * 15; if (choices.indexOf(d2) < 0) choices.push(d2); }
      choices.sort(function () { return Math.random() - 0.5; });
      q.innerHTML = isRad ? tex(c.inTex) : c.inTex.replace("^\\circ", "°").replace("{,}", ",");
      if (isRad) q.innerHTML = tex(c.inTex);
      opts.innerHTML = ""; qd.innerHTML = ""; fb.innerHTML = "";
      choices.forEach(function (d) {
        var lab = isRad ? tex(degToPiTex(d)) : fmt(d, 3) + "°";
        var b2 = el("button", { class: "btn", type: "button", style: "font-size:1.05rem" }, lab);
        b2.onclick = function () { if (cur.step !== 1) return; var ok = Math.abs(d - c.deg) < 1e-6; b2.classList.add(ok ? "p" : "wrong"); [].forEach.call(opts.children, function (x) { x.disabled = true; }); tries++; if (ok) { hits++; T_().beep("ok"); T_().addXP(2, "côngruos"); } else T_().beep("bad"); cur.step = 2; cur.ok1 = ok; askQ(); };
        opts.appendChild(b2);
      });
      sc.textContent = "Acertos: " + hits + "/" + tries;
    }
    function askQ() {
      qd.innerHTML = '<span class="small"><b>Quadrante:</b></span>';
      var ri2 = refInfo(cur.c.deg), right = ri2.q;
      [[1, "1º"], [2, "2º"], [3, "3º"], [4, "4º"], [0, "eixo"]].forEach(function (o) {
        var b = el("button", { class: "btn s", type: "button" }, o[1]);
        b.onclick = function () { if (cur.step !== 2) return; var ok = o[0] === right; b.classList.add(ok ? "p" : "wrong"); cur.step = 3; tries++; if (ok) { hits++; T_().beep("ok"); T_().addXP(2, "quadrante"); } else T_().beep("bad"); sc.textContent = "Acertos: " + hits + "/" + tries; fb.innerHTML = '<div class="fb ' + (ok && cur.ok1 ? "y" : "n") + '"><b class="t">' + (ok && cur.ok1 ? "Certo nas duas etapas!" : "Veja a resolução completa:") + '</b></div><div class="steps" style="margin-top:8px">' + congHTML(cur.c) + "</div>"; T_().renderMath(fb); };
        qd.appendChild(b);
      });
    }
    nx.onclick = gen; gen();
  };
  // --- Módulo 2: radiano e comprimento de arco
  W.radLab = function (h) {
    var S = scene(h, "0 0 420 290"), c = el("div", { class: "ctrls" }); h.appendChild(c);
    var sa = slider(c, "radA", "Ângulo central α", 0, 6.28, 0.01, 2, function (v) { return fmt(v, 2) + " rad"; });
    var sr = slider(c, "radR", "Raio R", 1, 5, 0.1, 3, function (v) { return fmt(v, 1); });
    var r = rows(h, [["l", "Comprimento ℓ"], ["g", "Em graus"], ["q", "Quantos raios"]]);
    function draw() {
      var al = +sa.value, R = +sr.value, cx = 200, cy = 145, Rp = 22 * R + 10, s = "";
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + Rp + '" style="fill:none;stroke:var(--line);stroke-width:2"/>';
      var A = [cx + Rp, cy], B = pt(cx, cy, Rp, al / D);
      if (al > 0.005) s += '<path d="M' + f1(A[0]) + " " + cy + " A" + Rp + " " + Rp + " 0 " + (al > PI ? 1 : 0) + " 0 " + f1(B[0]) + " " + f1(B[1]) + '" style="fill:none;stroke:var(--c-sen);stroke-width:5"/>';
      for (var k = 1; k <= Math.floor(al); k++) { var q = pt(cx, cy, Rp, k / D), q2 = pt(cx, cy, Rp + 10, k / D); s += L(q, q2, "stroke:var(--c-sen);stroke-width:2") + Tx(pt(cx, cy, Rp + 22, k / D)[0], pt(cx, cy, Rp + 22, k / D)[1], k, "font-size:11px;fill:var(--c-sen)"); }
      s += L([cx, cy], A, ST.hip) + L([cx, cy], B, ST.hip) + C(cx, cy, 3) + Tx(cx + Rp / 2, cy + 14, "R", TS.hip);
      if (al > 0.2) s += arc([cx, cy], A, B, 18, "stroke:var(--pri)", "α", 32, "fill:var(--pri)");
      S.innerHTML = s;
      r.l.innerHTML = tex("\\ell=\\alpha\\cdot R=" + tf(al, 2) + "\\cdot" + tf(R, 1) + "\\approx" + tf(al * R, 2));
      r.g.innerHTML = tex(tf(al, 2) + "\\cdot\\frac{180^\\circ}{\\pi}\\approx" + tf(al / D, 1) + "^\\circ");
      r.q.textContent = "O arco vermelho tem " + fmt(al, 2) + " vezes o comprimento do raio (marcas 1, 2, 3… = um raio cada).";
    }
    sa.oninput = draw; sr.oninput = draw; draw();
  };
  W.convLab = function (h) {
    var box = el("div", { class: "two" });
    box.innerHTML = '<div class="box obs"><div class="bl">Graus → radianos</div><div class="btns"><input id="cg" class="inp" value="210" inputmode="decimal" aria-label="Ângulo em graus"><span>°</span></div><div id="cgo"></div></div><div class="box obs"><div class="bl">Radianos → graus</div><div class="btns"><input id="cr" class="inp" value="5π/6" aria-label="Ângulo em radianos, como 5π/6"><span class="small muted">use π ou pi</span></div><div id="cro"></div></div>';
    h.appendChild(box);
    function go() {
      var g = parseFloat(box.querySelector("#cg").value.replace(",", "."));
      box.querySelector("#cgo").innerHTML = isNaN(g) ? "Digite um número." : tex(g + "^\\circ\\cdot\\frac{\\pi}{180^\\circ}=" + degToPiTex(g) + "\\approx" + tf(g * D, 4) + "\\text{ rad}");
      var v = parseRad(box.querySelector("#cr").value);
      box.querySelector("#cro").innerHTML = v === null ? "Escreva como 5π/6, 3pi/4, 2 ou 1,5." : tex(v.tex + "\\cdot\\frac{180^\\circ}{\\pi}=" + tf(v.val / D, 3) + "^\\circ");
    }
    box.addEventListener("input", go); go();
  };
  function parseRad(s) { // "5π/6", "pi/3", "2", "1,5", "-3pi/4"
    s = s.replace(/\s/g, "").replace(/pi/gi, "π").replace(",", ".");
    var m = s.match(/^(-?\d*\.?\d*)π(?:\/(\d+\.?\d*))?$/);
    if (m) { var n = m[1] === "" ? 1 : m[1] === "-" ? -1 : parseFloat(m[1]), d = m[2] ? parseFloat(m[2]) : 1; return { val: n * PI / d, tex: (d === 1 ? (n === 1 ? "" : n === -1 ? "-" : n) + "\\pi" : "\\frac{" + (n === 1 ? "" : n === -1 ? "-" : n) + "\\pi}{" + d + "}") }; }
    var x = parseFloat(s); if (!isNaN(x) && /^-?\d*\.?\d+$/.test(s)) return { val: x, tex: String(x).replace(".", "{,}") };
    return null;
  }
  W.parseRad = parseRad;
  // --- Módulo 3: triângulo retângulo com as 6 razões (notação padrão: α em B)
  W.triLab = function (h) {
    var S = scene(h, "0 0 440 270"), c = el("div", { class: "ctrls" }); h.appendChild(c);
    var sa = slider(c, "trA", "Ângulo α (em B)", 5, 85, 1, 35, function (v) { return v + "°"; });
    var sh = slider(c, "trH", "Hipotenusa a", 3, 10, 0.1, 8, function (v) { return fmt(v, 1); });
    var tb = el("div", { class: "tbl" }); h.appendChild(tb);
    function draw() {
      var al = +sa.value, a = +sh.value, th = 90 - al, b = a * Math.sin(al * D), cc = a * Math.cos(al * D);
      var sc = Math.min(330 / cc, 215 / b), B = [50, 245], A = [50 + cc * sc, 245], Cc = [A[0], 245 - b * sc];
      var cen = [(A[0] + B[0] + Cc[0]) / 3, (A[1] + B[1] + Cc[1]) / 3];
      var s = L(B, Cc, ST.hip) + L(A, Cc, ST.sen) + L(B, A, ST.cos) + rm(A, B, Cc, 12) + arc(B, A, Cc, 38, "stroke:var(--pri)", "α", 54, "fill:var(--pri)") + arc(Cc, A, B, 26, "stroke:var(--c-aux)", "θ", 42, "fill:var(--c-aux)");
      s += sideLab(B, Cc, "a = " + fmt(a, 1), cen, TS.hip) + sideLab(A, Cc, "b = " + fmt(b, 2), cen, TS.sen) + sideLab(B, A, "c = " + fmt(cc, 2), cen, TS.cos);
      s += Tx(B[0] - 12, B[1] + 4, "B") + Tx(A[0] + 12, A[1] + 4, "A") + Tx(Cc[0] + 12, Cc[1] - 4, "C");
      S.innerHTML = s;
      var sn = b / a, cs = cc / a;
      var R = [["\\sen", "\\frac ba", sn, "\\cossec", "\\frac ab", 1 / sn], ["\\cos", "\\frac ca", cs, "\\sec", "\\frac ac", 1 / cs], ["\\tg", "\\frac bc", sn / cs, "\\cotg", "\\frac cb", cs / sn]];
      var html = "<table><thead><tr><th>razão de α = " + al + "°</th><th>valor</th><th>inversa</th><th>valor</th><th>igual para θ = " + th + "°</th></tr></thead><tbody>";
      var twin = ["\\cos\\theta", "\\sen\\theta", "\\cotg\\theta"];
      R.forEach(function (x, i) { html += "<tr><td>" + tex(x[0] + "\\,\\alpha=" + x[1]) + "</td><td>" + fmt(x[2]) + "</td><td>" + tex(x[3] + "\\,\\alpha=" + x[4]) + "</td><td>" + fmt(x[5]) + "</td><td>" + tex("=" + twin[i]) + "</td></tr>"; });
      tb.innerHTML = html + "</tbody></table>";
    }
    sa.oninput = draw; sh.oninput = draw; draw();
  };
  // --- Módulo 4: relações métricas
  W.metricLab = function (h) {
    var S = scene(h, "0 0 440 250"), c = el("div", { class: "ctrls" }); h.appendChild(c);
    var sa = slider(c, "mtA", "Ângulo α (em B)", 15, 75, 1, 35, function (v) { return v + "°"; });
    var r = rows(h, [["m", "Projeções"], ["b", "b² = n·a"], ["c", "c² = m·a"], ["p", "Somando"]]);
    function draw() {
      var al = +sa.value * D, a = 10, c = a * Math.cos(al), b = a * Math.sin(al), m = c * Math.cos(al), n = a - m, hh = Math.sqrt(m * n), k = 36;
      var B = [40, 215], Cc = [40 + a * k, 215], Hh = [40 + m * k, 215], A = [Hh[0], 215 - hh * k];
      var s = L(B, Cc, ST.ink) + L(A, B, ST.sen) + L(A, Cc, ST.cos) + L(A, Hh, "stroke:var(--c-aux);stroke-width:2;stroke-dasharray:6 4") + rm(A, B, Cc, 10) + rm(Hh, Cc, A, 8);
      s += Tx((B[0] + Hh[0]) / 2, 232, "m = " + fmt(m, 2)) + Tx((Hh[0] + Cc[0]) / 2, 232, "n = " + fmt(n, 2)) + sideLab(A, B, "c", [220, 215], TS.sen) + sideLab(A, Cc, "b", [220, 215], TS.cos) + Tx(A[0], A[1] - 12, "A") + Tx(B[0] - 10, 219, "B") + Tx(Cc[0] + 10, 219, "C");
      S.innerHTML = s;
      r.m.textContent = "a = 10; m = " + fmt(m, 2) + " e n = " + fmt(n, 2) + " (m + n = " + fmt(m + n, 2) + ")";
      r.b.innerHTML = tex("b^2=" + tf(b * b, 2) + "\\quad n\\cdot a=" + tf(n, 2) + "\\cdot10=" + tf(n * a, 2));
      r.c.innerHTML = tex("c^2=" + tf(c * c, 2) + "\\quad m\\cdot a=" + tf(m, 2) + "\\cdot10=" + tf(m * a, 2));
      r.p.innerHTML = tex("b^2+c^2=" + tf(b * b + c * c, 2) + "=a^2");
    }
    sa.oninput = draw; draw();
  };
  // animações 45° e 30°/60°
  W.anim45 = function (h) {
    var S = scene(h, "0 0 440 230"), cap = el("p", { class: "small", "aria-live": "polite" }); h.appendChild(cap);
    var k = 150, x0 = 60, y0 = 205;
    Anim(h, 6000, function (t) {
      var p1 = sg(t, .05, .3), p2 = sg(t, .35, .6), p3 = sg(t, .65, .9), A = [x0, y0], B = [x0 + k, y0], Cc = [x0 + k, y0 - k], Dd = [x0, y0 - k];
      var sk = p2 > 0 ? "stroke:var(--ink);stroke-width:2" : "stroke:none";
      var s = P([A, B, Cc, A], "fill:var(--pri-soft);" + sk) + '<g transform="translate(' + f1(p2 * 150) + ' 0)">' + P([A, Cc, Dd, A], "fill:" + (p1 >= 1 ? "var(--gold-soft)" : "var(--pri-soft)") + ";" + sk) + "</g>";
      if (p2 === 0) s += '<rect x="' + x0 + '" y="' + (y0 - k) + '" width="' + k + '" height="' + k + '" style="fill:none;stroke:var(--ink);stroke-width:2"/>';
      var E = [A[0] + (Cc[0] - A[0]) * p1, A[1] + (Cc[1] - A[1]) * p1]; s += L(A, E, ST.hip) + rm(B, A, Cc, 12);
      if (p3 > 0) s += '<g style="opacity:' + p3 + '">' + Tx(x0 + k / 2, y0 + 16, "a", TS.cos) + Tx(x0 + k + 14, y0 - k / 2, "a", TS.sen) + Tx(x0 + k / 2 - 20, y0 - k / 2 - 12, "a√2", TS.hip) + arc(A, B, Cc, 32, "stroke:var(--c-tg)", "45°", 50) + arc(Cc, B, A, 32, "stroke:var(--c-tg)", "45°", 50) + "</g>";
      S.innerHTML = s;
      cap.textContent = t < .33 ? "1) Um quadrado de lado a. Traçamos a diagonal." : t < .63 ? "2) A diagonal divide o quadrado em dois triângulos retângulos isósceles." : "3) Cada um tem catetos a e a, ângulos de 45° e hipotenusa a√2 (Pitágoras).";
    });
  };
  W.anim3060 = function (h) {
    var S = scene(h, "0 0 440 240"), cap = el("p", { class: "small", "aria-live": "polite" }); h.appendChild(cap);
    var Lx = 190, H = Lx * Math.sqrt(3) / 2, x0 = 40, y0 = 220;
    Anim(h, 7000, function (t) {
      var p1 = sg(t, .05, .3), p2 = sg(t, .35, .6), p3 = sg(t, .65, .9), B = [x0, y0], Cc = [x0 + Lx, y0], T = [x0 + Lx / 2, y0 - H], M = [x0 + Lx / 2, y0];
      var sk = p2 > 0 ? "stroke:var(--ink);stroke-width:2" : "stroke:none";
      var s = P([B, M, T, B], "fill:var(--pri-soft);" + sk) + '<g transform="translate(' + f1(p2 * 150) + ' 0)">' + P([M, Cc, T, M], "fill:" + (p1 >= 1 ? "var(--gold-soft)" : "var(--pri-soft)") + ";" + sk) + (p2 > 0 ? arc(Cc, M, T, 28, "stroke:var(--c-tg)", "60°", 46) + rm(M, Cc, T, 10) : "") + "</g>";
      if (p2 === 0) s += P([B, Cc, T, B], "fill:none;stroke:var(--ink);stroke-width:2") + arc(Cc, B, T, 28, "stroke:var(--c-tg)", "60°", 46);
      s += arc(B, Cc, T, 28, "stroke:var(--c-tg)", "60°", 46) + L(T, [T[0], T[1] + (M[1] - T[1]) * p1], ST.sen) + Tx(x0 + Lx / 4 - 16, y0 - H / 2 - 8, "2x", TS.hip);
      if (p1 >= 1) s += rm(M, B, T, 10);
      if (p3 > 0) s += '<g style="opacity:' + p3 + '">' + Tx(x0 + Lx / 4, y0 + 16, "x", TS.cos) + Tx(M[0] + 8, y0 - H / 2, "x√3", TS.sen, "start") + arc(T, B, M, 34, "stroke:var(--c-tg)", "30°", 52) + "</g>";
      S.innerHTML = s;
      cap.textContent = t < .33 ? "1) Triângulo equilátero de lado 2x: três ângulos de 60°. Baixamos a altura." : t < .63 ? "2) A altura cai no meio da base e corta o triângulo em duas metades retângulas." : "3) Cada metade: hipotenusa 2x, base x, altura √((2x)² − x²) = x√3; ângulos de 60° e 30°.";
    });
  };
  // --- Módulo 5: área de triângulo e polígono regular
  W.areaLab = function (h) {
    var S = scene(h, "0 0 440 240"), c = el("div", { class: "ctrls" }); h.appendChild(c);
    var sb = slider(c, "arB", "Lado b", 2, 10, 0.5, 8), sc = slider(c, "arC", "Lado c", 2, 10, 0.5, 6), sa = slider(c, "arA", "Ângulo α entre eles", 5, 175, 1, 50, function (v) { return v + "°"; });
    var r = rows(h, [["h", "Altura h"], ["A", "Área"]]);
    function draw() {
      var b = +sb.value, cc = +sc.value, al = +sa.value * D, k = Math.min(300 / (b + Math.max(0, -cc * Math.cos(al))), 180 / (cc * Math.sin(al) || 1), 30);
      var ox = 60 + Math.max(0, -cc * Math.cos(al)) * k, A = [ox, 215], Bp = [ox + b * k, 215], Cc = [ox + cc * k * Math.cos(al), 215 - cc * k * Math.sin(al)], H = [Cc[0], 215];
      var s = P([A, Bp, Cc, A], "fill:var(--pri-soft);stroke:var(--ink);stroke-width:2") + L(Cc, H, "stroke:var(--c-sen);stroke-width:2.5;stroke-dasharray:6 4") + L([Math.min(A[0], H[0]), 215], [Math.max(Bp[0], H[0]), 215], ST.thin);
      s += arc(A, Bp, Cc, 30, "stroke:var(--pri)", "α", 46, "fill:var(--pri)") + sideLab(A, Bp, "b", [A[0] + 60, 150], TS.cos) + sideLab(A, Cc, "c", [(A[0] + Bp[0]) / 2, 215], TS.hip) + Tx(Cc[0] + 8, (Cc[1] + 215) / 2, "h", TS.sen, "start");
      S.innerHTML = s;
      r.h.innerHTML = tex("h=c\\,\\sen\\alpha=" + tf(cc, 1) + "\\cdot" + tf(Math.sin(al), 3) + "\\approx" + tf(cc * Math.sin(al), 2));
      r.A.innerHTML = tex("[ABC]=\\frac{b\\,c\\,\\sen\\alpha}{2}\\approx" + tf(b * cc * Math.sin(al) / 2, 2));
    }
    [sb, sc, sa].forEach(function (x) { x.oninput = draw; }); draw();
  };
  W.polyLab = function (h) {
    var S = scene(h, "0 0 420 260"), c = el("div", { class: "ctrls" }); h.appendChild(c);
    var sn = slider(c, "pgN", "Número de lados n", 3, 30, 1, 6), sr = slider(c, "pgR", "Raio R", 1, 5, 0.5, 2);
    var r = rows(h, [["A", "Área do polígono"], ["c", "Área do círculo"], ["p", "Razão"]]);
    function draw() {
      var n = +sn.value, R = +sr.value, cx = 210, cy = 130, Rp = 110, pts = [];
      for (var i = 0; i <= n; i++) pts.push(pt(cx, cy, Rp, 90 + 360 * i / n));
      var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + Rp + '" style="fill:none;stroke:var(--line);stroke-width:2"/>' + P(pts, "fill:var(--pri-soft);stroke:var(--pri);stroke-width:2") + P([[cx, cy], pts[0], pts[1], [cx, cy]], "fill:var(--gold-soft);stroke:var(--c-aux);stroke-width:2") + C(cx, cy, 3);
      S.innerHTML = s;
      var A = n * R * R * Math.sin(2 * PI / n) / 2;
      r.A.innerHTML = tex("A=\\frac{n\\,R^2\\,\\sen(2\\pi/n)}{2}=\\frac{" + n + "\\cdot" + tf(R * R, 2) + "\\cdot\\sen(2\\pi/" + n + ")}{2}\\approx" + tf(A, 3));
      r.c.innerHTML = tex("\\pi R^2\\approx" + tf(PI * R * R, 3));
      r.p.textContent = "O polígono cobre " + fmt(100 * A / (PI * R * R), 1) + "% do círculo. Aumente n para ver a área se aproximar de πR².";
    }
    sn.oninput = draw; sr.oninput = draw; draw();
  };
  // --- Módulo 6/7: o ciclo trigonométrico (principal)
  W.cicloLab = function (h, o) {
    o = o || {};
    var S = scene(h, "0 0 460 360"), c = el("div", { class: "ctrls" }); h.appendChild(c);
    var st = slider(c, "cyT_" + (o.id || "a"), "Arco t (em graus)", -720, 720, 1, o.t || 40, function (v) { return v + "°"; });
    var show = o.show || ["sen", "cos"];
    var tg = el("div", { class: "btns" }); h.appendChild(tg);
    var names = { sen: "seno", cos: "cosseno", tg: "tangente", cotg: "cotangente", sec: "secante", cossec: "cossecante" };
    var on = {}; (o.toggles || []).forEach(function (k) { on[k] = show.indexOf(k) >= 0; var b = el("button", { class: "btn s", type: "button", "aria-pressed": on[k] }, names[k]); b.onclick = function () { on[k] = !on[k]; b.setAttribute("aria-pressed", on[k]); b.classList.toggle("p", on[k]); draw(); }; b.classList.toggle("p", on[k]); tg.appendChild(b); });
    show.forEach(function (k) { if (on[k] === undefined) on[k] = true; });
    var snap = el("div", { class: "btns" }); h.appendChild(snap);
    [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].forEach(function (d) { var b = el("button", { class: "btn s", type: "button" }, tex(degToPiTex(d))); b.onclick = function () { st.value = d; st.dispatchEvent(new Event("input")); }; snap.appendChild(b); });
    var r = rows(h, [["p", "Ponto P"], ["q", "Quadrante"], ["v", "1ª determinação"], ["vals", "Valores"]]);
    var cx = 220, cy = 180, R = 120;
    function draw() {
      var t = +st.value, a = mod360(t), Pp = pt(cx, cy, R, t), cs = Math.cos(t * D), sn = Math.sin(t * D);
      var s = cicloBase(cx, cy, R, { quad: 1, axes: 1 });
      // trajetória do arco (espiral para mais de uma volta)
      var pts = [], n = Math.max(2, Math.ceil(Math.abs(t) / 3));
      for (var i = 0; i <= n; i++) { var u = t * i / n, rr = 26 + 6 * Math.abs(u) / 360; pts.push(pt(cx, cy, rr, u)); }
      s += P(pts, "fill:none;stroke:" + (t >= 0 ? "var(--ok)" : "var(--bad)") + ";stroke-width:2");
      if (on.tg && Math.abs(cs) > 1e-6) { var T = [cx + R, cy - R * sn / cs]; if (Math.abs(T[1] - cy) < 260) s += L([cx + R, cy - 175], [cx + R, cy + 175], "stroke:var(--c-tg);stroke-width:1") + L([cx, cy], T, ST.dash) + L([cx + R, cy], T, ST.tg) + C(T[0], T[1], 4, "fill:var(--c-tg)"); }
      if (on.cotg && Math.abs(sn) > 1e-6) { var K = [cx + R * cs / sn, cy - R]; if (Math.abs(K[0] - cx) < 230) s += L([cx - 220, cy - R], [cx + 220, cy - R], "stroke:#0ea5b7;stroke-width:1") + L([cx, cy], K, ST.dash) + L([cx, cy - R], K, "stroke:#0ea5b7;stroke-width:3.5"); }
      if (on.sec && Math.abs(cs) > 1e-6) { var X = cx + R / cs; if (Math.abs(X - cx) < 230) s += L([cx, cy + 16], [X, cy + 16], ST.aux) + L(Pp, [X, cy], "stroke:var(--muted);stroke-width:1.2"); }
      if (on.cossec && Math.abs(sn) > 1e-6) { var Y = cy - R / sn; if (Math.abs(Y - cy) < 175) s += L([cx - 16, cy], [cx - 16, Y], "stroke:#d97706;stroke-width:3") + L(Pp, [cx, Y], "stroke:var(--muted);stroke-width:1.2"); }
      s += L([cx, cy], Pp, ST.hip);
      if (on.cos) s += L([cx, cy], [Pp[0], cy], ST.cos) + L(Pp, [Pp[0], cy], ST.dash) + C(Pp[0], cy, 4, "fill:var(--c-cos)");
      if (on.sen) s += L([cx, cy], [cx, Pp[1]], ST.sen) + L(Pp, [cx, Pp[1]], ST.dash) + C(cx, Pp[1], 4, "fill:var(--c-sen)");
      s += C(Pp[0], Pp[1], 7, "fill:var(--pri);stroke:var(--card);stroke-width:2");
      s += Tx(Pp[0] + (cs >= 0 ? 12 : -12), Pp[1] + (sn >= 0 ? -12 : 14), "P", "fill:var(--pri)", cs >= 0 ? "start" : "end");
      S.innerHTML = s;
      var ri = refInfo(t), k = Math.floor(t / 360);
      r.p.innerHTML = tex("P=(\\cos t,\\ \\sen t)\\approx(" + tf(cs) + ";\\ " + tf(sn) + ")");
      r.q.textContent = ri.q === 0 ? "sobre um eixo (" + a + "°): não pertence a quadrante" : ri.q + "º quadrante";
      r.v.innerHTML = tex(t + "^\\circ=" + a + "^\\circ" + (k === 0 ? "" : (k > 0 ? "+" : "") + k + "\\cdot360^\\circ") + "\\ \\Rightarrow\\ " + a + "^\\circ=" + degToPiTex(a)) + (k ? ' <span class="small muted">(' + (Math.abs(k)) + (Math.abs(k) === 1 ? " volta " : " voltas ") + (k > 0 ? "no sentido positivo" : "no sentido negativo") + ")</span>" : "");
      var fs = Object.keys(on).filter(function (x) { return on[x]; }), txt = [];
      ["sen", "cos", "tg", "cotg", "sec", "cossec"].forEach(function (f) {
        if (fs.indexOf(f) < 0) return;
        var ex = exact(f, t), v = f === "sen" ? sn : f === "cos" ? cs : f === "tg" ? sn / cs : f === "cotg" ? cs / sn : f === "sec" ? 1 / cs : 1 / sn;
        var nd = (f === "tg" || f === "sec") && Math.abs(cs) < 1e-9 || (f === "cotg" || f === "cossec") && Math.abs(sn) < 1e-9;
        txt.push(tex("\\" + f + "\\,t" + (nd ? "\\ \\nexists" : (ex && ex !== "\\nexists" ? "=" + ex + (/\\/.test(ex) ? "\\approx" + tf(v) : "") : "\\approx" + tf(v)))));
      });
      r.vals.innerHTML = txt.join(" &nbsp; ");
    }
    st.oninput = draw;
    // arrastar o ponto
    var drag = false;
    function fromEvt(e) { var b = S.getBoundingClientRect(), vb = S.viewBox.baseVal, x = (e.clientX - b.left) * vb.width / b.width, y = (e.clientY - b.top) * vb.height / b.height; var ang = Math.round(Math.atan2(cy - y, x - cx) / D); if (ang < 0) ang += 360; var base = +st.value, turns = Math.floor(base / 360); st.value = Math.max(-720, Math.min(720, turns * 360 + ang)); draw(); st.dispatchEvent(new Event("input")); }
    S.addEventListener("pointerdown", function (e) { drag = true; S.setPointerCapture(e.pointerId); fromEvt(e); });
    S.addEventListener("pointermove", function (e) { if (drag) fromEvt(e); });
    S.addEventListener("pointerup", function () { drag = false; });
    draw();
  };
  // simetria no ciclo
  W.simLab = function (h) {
    var S = scene(h, "0 0 440 300"), c = el("div", { class: "ctrls" }); h.appendChild(c);
    var sa = slider(c, "smA", "α (1º quadrante)", 1, 89, 1, 30, function (v) { return v + "°"; });
    var f = "sen"; seg(h, [["sen", "seno"], ["cos", "cosseno"], ["tg", "tangente"]], "sen", function (v) { f = v; draw(); });
    var tb = el("div", { class: "tbl" }); h.appendChild(tb);
    function draw() {
      var a = +sa.value, cx = 220, cy = 150, R = 105, s = cicloBase(cx, cy, R);
      var angs = [[a, "α", 1], [180 - a, "π − α", 2], [180 + a, "π + α", 3], [360 - a, "2π − α", 4]];
      var P0 = pt(cx, cy, R, a), P1 = pt(cx, cy, R, 180 - a), P2 = pt(cx, cy, R, 180 + a), P3 = pt(cx, cy, R, 360 - a);
      s += L(P1, P0, ST.dash) + L(P2, P3, ST.dash) + L(P0, P3, ST.dash) + L(P1, P2, ST.dash);
      angs.forEach(function (x) { var p = pt(cx, cy, R, x[0]), q = pt(cx, cy, R + 22, x[0]); s += L([cx, cy], p, "stroke:var(--line);stroke-width:1.5") + C(p[0], p[1], 5.5, "fill:var(--pri)") + Tx(q[0], q[1], x[1] + " = " + x[0] + "°", "font-size:12px;fill:var(--pri)", p[0] > cx ? "start" : "end"); });
      S.innerHTML = s;
      var fn = f === "sen" ? Math.sin : f === "cos" ? Math.cos : Math.tan, html = "<table><thead><tr><th>arco</th><th>quadrante</th><th>valor</th><th>relação com α</th></tr></thead><tbody>";
      var rel = { sen: ["=\\sen\\alpha", "=\\sen\\alpha", "=-\\sen\\alpha", "=-\\sen\\alpha"], cos: ["=\\cos\\alpha", "=-\\cos\\alpha", "=-\\cos\\alpha", "=\\cos\\alpha"], tg: ["=\\tg\\alpha", "=-\\tg\\alpha", "=\\tg\\alpha", "=-\\tg\\alpha"] }[f];
      angs.forEach(function (x, i) { html += "<tr><td>" + tex(x[1].replace("π", "\\pi").replace("α", "\\alpha").replace("−", "-")) + " = " + x[0] + "°</td><td>" + x[2] + "º</td><td>" + fmt(fn(x[0] * D), 4) + "</td><td>" + tex("\\" + f + "(" + x[1].replace("π", "\\pi").replace("α", "\\alpha").replace("−", "-") + ")" + rel[i]) + "</td></tr>"; });
      tb.innerHTML = html + "</tbody></table>";
    }
    sa.oninput = draw; draw();
  };
  // redução ao 1º quadrante
  W.reduLab = function (h) {
    var c = el("div", { class: "ctrls" }); h.appendChild(c);
    var sa = slider(c, "rdA", "Ângulo", 0, 360, 1, 251, function (v) { return v + "°"; });
    var f = "sen"; seg(h, [["sen", "sen"], ["cos", "cos"], ["tg", "tg"], ["cotg", "cotg"], ["sec", "sec"], ["cossec", "cossec"]], "sen", function (v) { f = v; draw(); });
    var S = scene(h, "0 0 400 260"), r = rows(h, [["q", "Quadrante"], ["r", "Ângulo de referência"], ["s", "Sinal"], ["res", "Redução"]]);
    function draw() {
      var a = +sa.value, ri = refInfo(a), cx = 200, cy = 130, R = 95, s = cicloBase(cx, cy, R, { quad: 1 });
      var Pp = pt(cx, cy, R, a), Rf = pt(cx, cy, R, ri.r);
      s += L([cx, cy], Pp, ST.hip) + C(Pp[0], Pp[1], 6, "fill:var(--pri)") + L([cx, cy], Rf, "stroke:var(--c-aux);stroke-width:2;stroke-dasharray:5 4") + C(Rf[0], Rf[1], 5, "fill:var(--c-aux)") + L(Pp, Rf, "stroke:var(--line);stroke-width:1.2");
      s += Tx(Rf[0] + 10, Rf[1] - 10, ri.r + "°", "fill:var(--c-aux);font-size:12px", "start") + Tx(Pp[0] + (Pp[0] >= cx ? 10 : -10), Pp[1] + (Pp[1] <= cy ? -10 : 14), a + "°", "fill:var(--pri);font-size:12px", Pp[0] >= cx ? "start" : "end");
      S.innerHTML = s;
      if (!ri.q) { r.q.textContent = "sobre um eixo"; r.r.textContent = "—"; r.s.textContent = "—"; var ex = exact(f, a); r.res.innerHTML = tex("\\" + f + "\\," + a + "^\\circ=" + (ex || "")); return; }
      r.q.textContent = ri.q + "º quadrante";
      var how = ri.q === 2 ? "180° − " + a + "°" : ri.q === 3 ? a + "° − 180°" : ri.q === 4 ? "360° − " + a + "°" : a + "° (já está no 1º)";
      r.r.textContent = how + " = " + ri.r + "°";
      var sS = ri.q <= 2 ? 1 : -1, sC = ri.q === 1 || ri.q === 4 ? 1 : -1, sgn = f === "sen" || f === "cossec" ? sS : f === "cos" || f === "sec" ? sC : sS * sC;
      r.s.textContent = (sgn > 0 ? "positivo" : "negativo") + " (" + { sen: "seno", cossec: "cossecante", cos: "cosseno", sec: "secante", tg: "tangente", cotg: "cotangente" }[f] + " no " + ri.q + "º quadrante)";
      var ex2 = exact(f, a);
      r.res.innerHTML = tex("\\" + f + "\\," + a + "^\\circ=" + (sgn < 0 ? "-" : "") + "\\" + f + "\\," + ri.r + "^\\circ" + (ex2 ? "=" + ex2 : ""));
    }
    sa.oninput = draw; draw();
  };
  // relações fundamentais: dada uma razão e o quadrante, achar todas
  W.relLab = function (h) {
    var box = el("div", { class: "btns" }, '<select id="rlF" class="inp" style="width:auto" aria-label="Razão conhecida"><option value="sen">sen x</option><option value="cos">cos x</option><option value="tg">tg x</option><option value="cotg">cotg x</option><option value="sec">sec x</option><option value="cossec">cossec x</option></select><span>=</span><input id="rlV" class="inp" style="width:7em" value="4/5" aria-label="Valor, como 4/5 ou -0,6"><select id="rlQ" class="inp" style="width:auto" aria-label="Quadrante"><option value="1">1º quadrante</option><option value="2" selected>2º quadrante</option><option value="3">3º quadrante</option><option value="4">4º quadrante</option></select>');
    h.appendChild(box); var out = el("div", { class: "tbl" }); h.appendChild(out); var msg = el("div"); h.appendChild(msg);
    function num(s) { s = s.replace(",", ".").replace("−", "-").trim(); var m = s.match(/^(-?\d*\.?\d+)\/(\d*\.?\d+)$/); if (m) return +m[1] / +m[2]; var x = parseFloat(s); return isNaN(x) ? null : x; }
    function go() {
      var f = box.querySelector("#rlF").value, v = num(box.querySelector("#rlV").value), q = +box.querySelector("#rlQ").value;
      msg.innerHTML = ""; out.innerHTML = "";
      if (v === null) { msg.innerHTML = '<div class="alert bad">Digite um número, como 4/5 ou -0,6.</div>'; return; }
      var sS = q <= 2 ? 1 : -1, sC = q === 1 || q === 4 ? 1 : -1, sn, cs;
      if (f === "sen" || f === "cossec") { sn = f === "sen" ? v : 1 / v; if (Math.abs(sn) > 1) return bad("|sen x| não pode passar de 1."); if (Math.sign(sn) !== sS && sn !== 0) return bad("No " + q + "º quadrante o seno é " + (sS > 0 ? "positivo" : "negativo") + "."); cs = sC * Math.sqrt(1 - sn * sn); }
      else if (f === "cos" || f === "sec") { cs = f === "cos" ? v : 1 / v; if (Math.abs(cs) > 1) return bad("|cos x| não pode passar de 1."); if (Math.sign(cs) !== sC && cs !== 0) return bad("No " + q + "º quadrante o cosseno é " + (sC > 0 ? "positivo" : "negativo") + "."); sn = sS * Math.sqrt(1 - cs * cs); }
      else { var t = f === "tg" ? v : 1 / v; if (Math.sign(t) !== sS * sC) return bad("No " + q + "º quadrante a tangente é " + (sS * sC > 0 ? "positiva" : "negativa") + "."); cs = sC / Math.sqrt(1 + t * t); sn = t * cs; }
      var R = [["sen x", sn], ["cos x", cs], ["tg x", sn / cs], ["cotg x", cs / sn], ["sec x", 1 / cs], ["cossec x", 1 / sn]];
      out.innerHTML = "<table><thead><tr><th>razão</th><th>valor (decimal)</th></tr></thead><tbody>" + R.map(function (x) { return "<tr><td>" + x[0] + "</td><td>" + fmt(x[1], 4) + "</td></tr>"; }).join("") + "</tbody></table>";
      msg.innerHTML = '<p class="small muted">Conferência: sen² + cos² = ' + fmt(sn * sn + cs * cs, 4) + "</p>";
    }
    function bad(t) { msg.innerHTML = '<div class="alert bad">' + t + "</div>"; }
    box.addEventListener("input", go); box.addEventListener("change", go); go();
  };
  // --- Módulo 10: desenrolar o ciclo
  W.unwrap = function (h, o) {
    var fnm = (o && o.f) || "sen", S = scene(h, "0 0 640 260"), cap = el("p", { class: "small" }); h.appendChild(cap);
    var cx = 90, cy = 130, R = 70, gx = 190, gw = 430, k = gw / (2 * PI);
    Anim(h, 8000, function (t) {
      var th = 2 * PI * t, s = cicloBase(cx, cy, R);
      s += L([gx, cy], [gx + gw + 10, cy], ST.thin) + L([gx, cy - R - 20], [gx, cy + R + 20], ST.thin);
      [[PI / 2, "π/2"], [PI, "π"], [3 * PI / 2, "3π/2"], [2 * PI, "2π"]].forEach(function (x) { s += L([gx + x[0] * k, cy - 4], [gx + x[0] * k, cy + 4], ST.thin) + Tx(gx + x[0] * k, cy + 16, x[1], TS.mut); });
      s += Tx(gx - 8, cy - R, "1", TS.mut, "end") + Tx(gx - 8, cy + R, "−1", TS.mut, "end");
      var pts = [], n = Math.max(2, Math.round(120 * t));
      for (var i = 0; i <= n; i++) { var u = th * i / n; pts.push([gx + u * k, cy - R * (fnm === "sen" ? Math.sin(u) : Math.cos(u))]); }
      s += P(pts, "fill:none;stroke:" + (fnm === "sen" ? "var(--c-sen)" : "var(--c-cos)") + ";stroke-width:3");
      var Pp = [cx + R * Math.cos(th), cy - R * Math.sin(th)], v = fnm === "sen" ? Math.sin(th) : Math.cos(th), G = [gx + th * k, cy - R * v];
      if (fnm === "sen") s += L([Pp[0], cy], Pp, ST.sen) + L(Pp, G, ST.dash);
      else { s += L([cx, cy], [Pp[0], cy], ST.cos); var Q = [cx, cy - R * Math.cos(th)]; s += L(Pp, [Pp[0], cy], ST.dash); }
      s += L([cx, cy], Pp, ST.hip) + C(Pp[0], Pp[1], 5, "fill:var(--pri)") + C(G[0], G[1], 5, "fill:" + (fnm === "sen" ? "var(--c-sen)" : "var(--c-cos)"));
      S.innerHTML = s;
      cap.innerHTML = "x = " + fmt(th, 2) + " rad ≈ " + Math.round(th / D) + "° → " + fnm + " x ≈ " + fmt(v, 3) + ". Cada volta completa (2π) repete os mesmos valores: por isso o período é 2π.";
    });
  };
  // --- Módulos 10 e 11: plotador de f(x) = a + b·F(cx + d)
  W.plot = function (h, o) {
    o = o || {};
    var S = scene(h, "0 0 640 330"), c = el("div", { class: "ctrls" });
    var fsel = seg(h, [["sen", "seno"], ["cos", "cosseno"], ["tg", "tangente"]], o.f || "sen", function (v) { F = v; abs = false; draw(); });
    h.appendChild(c);
    var F = o.f || "sen", abs = false;
    var sa = slider(c, "plA_" + (o.id || ""), "a (sobe/desce)", -6, 6, 0.5, 0, function (v) { return fmt(v, 1); });
    var sb = slider(c, "plB_" + (o.id || ""), "b (amplitude)", -3, 3, "any", 1, function (v) { return fmt(v, 2); });
    var sc = slider(c, "plC_" + (o.id || ""), "c (frequência)", 0.1, 5, "any", 1, function (v) { return fmt(v, 2); });
    var sd = slider(c, "plD_" + (o.id || ""), "d (desloca na horizontal)", -3.15, 3.15, "any", 0, function (v) { return fmt(v, 2); });
    var r = rows(h, [["f", "Lei"], ["P", "Período"], ["D", "Domínio"], ["I", "Imagem"], ["As", "Assíntotas"]]);
    if (o.presets) {
      var pb = el("div", { class: "btns" }, '<span class="small"><b>Funções da Lista 6:</b></span>'); h.appendChild(pb);
      o.presets.forEach(function (p) { var b = el("button", { class: "btn s", type: "button" }, tex(p.t)); b.onclick = function () { set(sa, p.a); set(sb, p.b); set(sc, p.c); set(sd, p.d); F = p.f; abs = !!p.abs; [].forEach.call(fsel.children, function (x, i) { x.classList.toggle("on", ["sen", "cos", "tg"][i] === F); }); draw(p); }; pb.appendChild(b); });
    }
    function set(i, v) { i.value = v; i.dispatchEvent(new Event("input")); }
    var custom = null;
    function draw(p) {
      custom = p && p.t ? p : null;
      var a = +sa.value, b = +sb.value, cc = +sc.value, d = +sd.value;
      var x0 = -2 * PI, x1 = 2 * PI, W0 = 640, H0 = 330, ox = 320, kx = (W0 - 40) / (x1 - x0), ymax = 6, ky = 150 / ymax, oy = 165;
      var s = "";
      for (var m = -4; m <= 4; m++) { var X = ox + m * PI / 2 * kx; s += L([X, 10], [X, H0 - 10], "stroke:var(--line);stroke-width:1") + (m ? Tx(X, oy + 14, ["−2π", "−3π/2", "−π", "−π/2", "", "π/2", "π", "3π/2", "2π"][m + 4], TS.mut) : ""); }
      for (var yy = -ymax; yy <= ymax; yy += 2) { if (yy) s += L([20, oy - yy * ky], [W0 - 20, oy - yy * ky], "stroke:var(--line);stroke-width:1") + Tx(ox - 6, oy - yy * ky, yy, TS.mut, "end"); }
      s += L([20, oy], [W0 - 20, oy], ST.thin) + L([ox, 8], [ox, H0 - 8], ST.thin);
      var fnv = function (x) { var u = cc * x + d, v = F === "sen" ? Math.sin(u) : F === "cos" ? Math.cos(u) : Math.tan(u); if (abs) return Math.abs(1 + 2 * Math.cos(x)) - 2; return a + b * v; };
      var segs = [], curS = [];
      for (var i = 0; i <= 1600; i++) {
        var x = x0 + (x1 - x0) * i / 1600, y = fnv(x);
        var brk = F === "tg" && !abs && Math.abs(Math.cos(cc * x + d)) < 0.02;
        if (!isFinite(y) || Math.abs(y) > ymax + 2 || brk) { if (curS.length > 1) segs.push(curS); curS = []; continue; }
        curS.push([ox + x * kx, oy - y * ky]);
      }
      if (curS.length > 1) segs.push(curS);
      var col = F === "sen" ? "var(--c-sen)" : F === "cos" ? "var(--c-cos)" : "var(--c-tg)";
      if (F === "tg" && !abs) { for (var kk = -12; kk <= 12; kk++) { var xa = (PI / 2 + kk * PI - d) / cc; if (xa > x0 && xa < x1) s += L([ox + xa * kx, 10], [ox + xa * kx, H0 - 10], "stroke:var(--bad);stroke-width:1.5;stroke-dasharray:6 5"); } }
      segs.forEach(function (sgm) { s += P(sgm, "fill:none;stroke:" + col + ";stroke-width:3"); });
      S.innerHTML = '<rect x="0" y="0" width="640" height="330" style="fill:var(--card2)"/>' + s;
      var Fn = F === "sen" ? "\\sen" : F === "cos" ? "\\cos" : "\\tg";
      var inner = (cc === 1 ? "" : tf(cc, 2)) + "x" + (d ? (d > 0 ? "+" : "-") + tf(Math.abs(d), 2) : "");
      r.f.innerHTML = custom ? tex("f(x)=" + custom.t.replace(/^f\(x\)=/, "")) + (custom.note ? ' <span class="small muted">' + custom.note + "</span>" : "") : tex("f(x)=" + (a ? tf(a, 1) + (b >= 0 ? "+" : "") : "") + (b === 1 ? "" : b === -1 ? "-" : tf(b, 1)) + Fn + "(" + inner + ")");
      if (abs) { r.P.innerHTML = tex("2\\pi"); r.D.innerHTML = tex("\\mathbb R"); r.I.innerHTML = tex("[-2,\\ 1]"); r.As.textContent = "não tem"; return; }
      if (b === 0) { r.P.textContent = "função constante (não há período mínimo)"; r.D.innerHTML = tex("\\mathbb R"); r.I.innerHTML = tex("\\{" + tf(a, 1) + "\\}"); r.As.textContent = "não tem"; return; }
      if (F === "tg") {
        r.P.innerHTML = tex("P=\\frac{\\pi}{|c|}=\\frac{\\pi}{" + tf(cc, 2) + "}\\approx" + tf(PI / cc, 3));
        r.D.innerHTML = tex("cx+d\\neq\\frac\\pi2+k\\pi\\ \\Rightarrow\\ x\\neq\\frac{\\pi/2-d+k\\pi}{c}");
        r.I.innerHTML = tex("\\mathbb R");
        r.As.innerHTML = tex("x=\\frac{\\pi/2-d+k\\pi}{c}\\approx" + tf((PI / 2 - d) / cc, 3) + "+k\\cdot" + tf(PI / cc, 3)) + ' <span class="small muted">(linhas vermelhas)</span>';
      } else {
        r.P.innerHTML = tex("P=\\frac{2\\pi}{|c|}=\\frac{2\\pi}{" + tf(cc, 2) + "}\\approx" + tf(2 * PI / cc, 3));
        r.D.innerHTML = tex("\\mathbb R");
        r.I.innerHTML = tex("[a-|b|,\\ a+|b|]=[" + tf(a - Math.abs(b), 1) + ",\\ " + tf(a + Math.abs(b), 1) + "]");
        r.As.textContent = "não tem";
      }
    }
    [sa, sb, sc, sd].forEach(function (x) { x.addEventListener("input", function () { abs = false; draw(); }); });
    draw();
  };
  // --- Módulo 11: tangente no ciclo ligada ao gráfico
  W.tgLab = function (h) {
    var S = scene(h, "0 0 640 300"), c = el("div", { class: "ctrls" }); h.appendChild(c);
    var sx = slider(c, "tgX", "x (graus)", -85, 265, 1, 50, function (v) { return v + "°"; });
    var r = rows(h, [["v", "tg x"]]);
    function draw() {
      var x = +sx.value, cx = 110, cy = 150, R = 70, s = cicloBase(cx, cy, R), cs = Math.cos(x * D), sn = Math.sin(x * D), Pp = pt(cx, cy, R, x);
      s += L([cx + R, 10], [cx + R, 290], "stroke:var(--c-tg);stroke-width:1");
      var tv = sn / cs, T = [cx + R, cy - R * tv];
      if (Math.abs(cs) > 0.02 && Math.abs(T[1] - cy) < 140) s += L([cx - R * cs * 1.5, cy + R * sn * 1.5], T, ST.dash) + L([cx + R, cy], T, ST.tg) + C(T[0], T[1], 4.5, "fill:var(--c-tg)");
      s += L([cx, cy], Pp, ST.hip) + C(Pp[0], Pp[1], 5, "fill:var(--pri)");
      var gx = 250, kx = 360 / 360, ky = 70;
      s += L([gx, cy], [630, cy], ST.thin) + L([gx + 90 * kx, 10], [gx + 90 * kx, 290], "stroke:var(--bad);stroke-dasharray:6 5;stroke-width:1.4") + L([gx + 270 * kx, 10], [gx + 270 * kx, 290], "stroke:var(--bad);stroke-dasharray:6 5;stroke-width:1.4");
      [[-90, "−π/2"], [0, "0"], [90, "π/2"], [180, "π"], [270, "3π/2"]].forEach(function (m) { s += Tx(gx + (m[0] + 90) * kx, cy + 14, m[1], TS.mut); });
      var pts = [], all = [];
      for (var u = -89; u <= 269; u += 1) { if (Math.abs(((u - 90) % 180 + 180) % 180) < 1.5) { if (pts.length > 1) all.push(pts); pts = []; continue; } var y = Math.tan(u * D); if (Math.abs(y) > 2) { if (pts.length > 1) all.push(pts); pts = []; continue; } pts.push([gx + (u + 90) * kx, cy - y * ky]); }
      if (pts.length > 1) all.push(pts);
      all.forEach(function (p) { s += P(p, "fill:none;stroke:var(--c-tg);stroke-width:2.5"); });
      if (Math.abs(tv) <= 2) s += C(gx + (x + 90) * kx, cy - tv * ky, 5, "fill:var(--c-tg)");
      S.innerHTML = s;
      r.v.innerHTML = Math.abs(cs) < 1e-9 ? "não existe (cos x = 0: a reta OP fica paralela ao eixo das tangentes)" : tex("\\tg\\," + x + "^\\circ\\approx" + tf(tv));
    }
    sx.oninput = draw; draw();
  };

  // =================================================================== JOGOS
  W.games = function (host) {
    if (!host) return;
    var T = window.T, S = T.S, g = "ciclo", tabs = seg(host, [["ciclo", "Ciclo Relâmpago"], ["sinal", "Sinal Certo"], ["conv", "Conversor Turbo"], ["cong", "Côngruos"], ["sex", "Minutos e segundos"]], "ciclo", function (v) { g = v; setup(); });
    var box = el("div", { class: "card game" }); host.appendChild(box);
    var timer = 0, left = 0, score = 0, running = false;
    var DESC = { ciclo: "Aparece um arco. Toque no ponto do ciclo onde ele termina (tolerância de 12°). 45 segundos.", sinal: "Aparece uma razão, como sen 251°. Decida se o valor é positivo ou negativo pelo quadrante. 45 segundos.", conv: "Converta entre graus e radianos escolhendo a alternativa certa. 45 segundos.", cong: "Aparece um arco grande ou negativo. Escolha a 1ª determinação (entre 0 e 360° ou 0 e 2π). 45 segundos.", sex: "Conversões e contas com graus, minutos e segundos. 45 segundos." };
    function setup() {
      clearInterval(timer); running = false;
      box.innerHTML = '<div class="gstat"><span class="chip">' + T.icon("clock") + ' <b id="gT">45</b> s</span><span class="chip">' + T.icon("check") + ' <b id="gS">0</b> pontos</span><span class="chip">' + T.icon("trophy") + " recorde: <b>" + (S.games[g] || 0) + '</b></span></div><p class="small muted" style="text-align:center">' + DESC[g] + '</p><div class="gbig" id="gQ">Pronto?</div><div id="gA"></div><div class="btns" style="justify-content:center"><button class="btn p" id="gGo" type="button">' + T.icon("play") + " Começar</button></div>";
      box.querySelector("#gGo").onclick = start;
    }
    function start() {
      score = 0; left = 45; running = true; box.querySelector("#gGo").hidden = true; box.querySelector("#gS").textContent = 0;
      clearInterval(timer); timer = setInterval(function () { left--; box.querySelector("#gT").textContent = left; if (left <= 0) end(); }, 1000);
      next();
    }
    function end() {
      clearInterval(timer); running = false;
      var best = S.games[g] || 0; if (score > best || S.games[g] == null) S.games[g] = Math.max(best, score); T.save();
      box.querySelector("#gQ").innerHTML = "Fim! " + score + " ponto" + (score === 1 ? "" : "s");
      box.querySelector("#gA").innerHTML = "";
      var b = box.querySelector("#gGo"); b.hidden = false; b.innerHTML = T.icon("play") + " Jogar de novo";
      T.addXP(Math.min(15, score), "jogo");
    }
    function hit(ok) { if (!running) return; if (ok) { score++; T.beep("ok"); } else T.beep("bad"); box.querySelector("#gS").textContent = score; }
    var ANG = [30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];
    function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
    function next() {
      if (!running) return;
      var Q = box.querySelector("#gQ"), A = box.querySelector("#gA");
      if (g === "ciclo") {
        var d = rnd(ANG.concat([-30, -90, -135, 390, 405, 480])), showRad = Math.random() < 0.6;
        Q.innerHTML = showRad ? tex(degToPiTex(d), false) : d + "°";
        A.innerHTML = '<div class="scene" style="max-width:340px;margin:0 auto"><svg viewBox="0 0 300 300">' + cicloBase(150, 150, 110) + "</svg></div>";
        var sv = A.querySelector("svg");
        sv.onclick = function (e) {
          var b = sv.getBoundingClientRect(), x = (e.clientX - b.left) * 300 / b.width, y = (e.clientY - b.top) * 300 / b.height, ang = Math.atan2(150 - y, x - 150) / D; if (ang < 0) ang += 360;
          var diff = Math.abs(((ang - mod360(d)) + 540) % 360 - 180), ok = diff <= 12, pp = pt(150, 150, 110, d);
          sv.insertAdjacentHTML("beforeend", C(pp[0], pp[1], 8, "fill:var(--ok)") + C(x, y, 6, "fill:" + (ok ? "var(--ok)" : "var(--bad)")));
          hit(ok); sv.onclick = null; setTimeout(next, ok ? 350 : 900);
        };
      } else if (g === "sinal") {
        var f = rnd(["sen", "cos", "tg"]), a;
        do { a = Math.floor(Math.random() * 360); } while (a % 90 === 0);
        var v = f === "sen" ? Math.sin(a * D) : f === "cos" ? Math.cos(a * D) : Math.tan(a * D);
        Q.innerHTML = tex("\\" + f + "\\ " + a + "^\\circ");
        A.innerHTML = '<div class="btns" style="justify-content:center"><button class="btn p" type="button" data-s="1" style="font-size:1.4rem;min-width:90px">+</button><button class="btn p" type="button" data-s="-1" style="font-size:1.4rem;min-width:90px">−</button></div><p class="small muted" style="text-align:center" id="gH"></p>';
        [].forEach.call(A.querySelectorAll("button"), function (b) { b.onclick = function () { var ok = Math.sign(v) === +b.dataset.s; hit(ok); A.querySelector("#gH").textContent = a + "° está no " + refInfo(a).q + "º quadrante: " + f + " é " + (v > 0 ? "positivo" : "negativo") + "."; [].forEach.call(A.querySelectorAll("button"), function (x) { x.disabled = true; }); setTimeout(next, ok ? 450 : 1300); }; });
      } else if (g === "cong") {
        var raw, isR = Math.random() < 0.5;
        if (isR) { var bb = rnd([2, 3, 4, 6]), aa; do { aa = 2 * bb + 1 + Math.floor(Math.random() * 10 * bb); } while (gcd(aa, bb) !== 1); if (Math.random() < 0.3) aa = -aa; raw = aa + "π/" + bb; }
        else raw = String((Math.random() < 0.3 ? -1 : 1) * (360 * (1 + Math.floor(Math.random() * 6)) + 15 * (1 + Math.floor(Math.random() * 23))));
        var cc = congSteps(raw), right = Math.round(cc.deg * 1000) / 1000, op = [right];
        [360 - right, (right + 180) % 360, (right + 90) % 360, (right + 270) % 360].forEach(function (d) { d = Math.round(d * 1000) / 1000; if (op.length < 4 && op.indexOf(d) < 0 && d !== 360) op.push(d); });
        op.sort(function () { return Math.random() - 0.5; });
        Q.innerHTML = tex(cc.inTex) + ' <span class="small muted">≡ ?</span>';
        A.innerHTML = '<div class="grid" style="grid-template-columns:1fr 1fr;max-width:420px;margin:0 auto"></div><p class="small muted" style="text-align:center" id="gH"></p>';
        op.forEach(function (d) { var b = el("button", { class: "btn", type: "button", style: "font-size:1.1rem" }, isR ? tex(degToPiTex(d)) : fmt(d, 1) + "°"); b.onclick = function () { var ok = d === right; hit(ok); b.classList.add(ok ? "p" : "wrong"); A.querySelector("#gH").innerHTML = "Resposta: " + tex(cc.inTex + "\\equiv" + cc.tex) + " (" + cc.q + ")"; [].forEach.call(A.firstChild.children, function (x) { x.disabled = true; }); setTimeout(next, ok ? 500 : 1500); }; A.firstChild.appendChild(b); });
      } else if (g === "sex") {
        var t = Math.floor(Math.random() * 4), gg = 2 + Math.floor(Math.random() * 60), mm = 1 + Math.floor(Math.random() * 59), ss = 1 + Math.floor(Math.random() * 59), qtxt, ans, alts;
        if (t === 0) { qtxt = gg + "° " + mm + "′ = ? minutos"; ans = gg * 60 + mm; alts = [ans, gg * 100 + mm, gg * 60 - mm, (gg + 1) * 60 + mm]; }
        else if (t === 1) { qtxt = gg + "° " + mm + "′ " + ss + "″ = ? segundos"; ans = gg * 3600 + mm * 60 + ss; alts = [ans, gg * 3600 + mm * 100 + ss, gg * 360 + mm * 60 + ss, gg * 3600 + mm + ss]; }
        else if (t === 2) { var m6 = [6, 12, 15, 18, 24, 30, 36, 45, 48, 54][Math.floor(Math.random() * 10)]; qtxt = gg + "° " + m6 + "′ = ? graus"; ans = gg + m6 / 60; alts = [ans, gg + m6 / 100, gg + m6 / 36, gg + 60 / m6 / 10]; }
        else { var tot = 3600 + Math.floor(Math.random() * 20000); qtxt = tot + "″ = ?"; var mt = Math.floor(tot / 60), g2 = Math.floor(mt / 60); ans = [g2, mt - 60 * g2, tot - 60 * mt]; alts = [ans, [g2, mt - 60 * g2 + 1, tot - 60 * mt], [Math.floor(tot / 100) % 100, 0, tot % 60], [g2 + 1, mt - 60 * g2, tot - 60 * mt]]; }
        var shown = alts.map(function (x) { return Array.isArray(x) ? x[0] + "° " + x[1] + "′ " + x[2] + "″" : fmt(x, 3); }), key = shown[0];
        shown = shown.filter(function (x, i) { return shown.indexOf(x) === i; }).sort(function () { return Math.random() - 0.5; });
        Q.textContent = qtxt;
        A.innerHTML = '<div class="grid" style="grid-template-columns:1fr 1fr;max-width:420px;margin:0 auto"></div>';
        shown.forEach(function (x) { var b = el("button", { class: "btn", type: "button", style: "font-size:1.05rem" }, x); b.onclick = function () { var ok = x === key; hit(ok); b.classList.add(ok ? "p" : "wrong"); [].forEach.call(A.firstChild.children, function (y) { y.disabled = true; if (y.textContent === key) y.classList.add("p"); }); setTimeout(next, ok ? 450 : 1300); }; A.firstChild.appendChild(b); });
      } else {
        var dd = rnd([30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 36, 72, 15, 20, 18, 22.5]), toRad = Math.random() < 0.5;
        var opts = [dd]; while (opts.length < 4) { var w = rnd([30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 36, 72, 15, 20, 18, 22.5]); if (opts.indexOf(w) < 0) opts.push(w); }
        opts.sort(function () { return Math.random() - 0.5; });
        Q.innerHTML = toRad ? dd + "° = ?" : tex(degToPiTex(dd)) + " = ?";
        A.innerHTML = '<div class="grid" style="grid-template-columns:1fr 1fr;max-width:420px;margin:0 auto"></div>';
        var gd = A.firstChild;
        opts.forEach(function (o2) { var b = el("button", { class: "btn", type: "button", style: "font-size:1.1rem" }, toRad ? tex(degToPiTex(o2)) : fmt(o2, 1) + "°"); b.onclick = function () { var ok = o2 === dd; hit(ok); b.classList.add(ok ? "p" : ""); [].forEach.call(gd.children, function (x) { x.disabled = true; }); setTimeout(next, ok ? 350 : 900); }; gd.appendChild(b); });
      }
    }
    setup();
  };
})();
