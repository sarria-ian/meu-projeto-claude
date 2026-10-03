/* Laboratórios, animações, figuras e jogos da apostila de Binômio de Newton. */
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

  // ---------- monômios: { c: fração, e: {x: 2, y: -1} }
  function parseProd(t) {
    if (t === "") return null;
    var m = t.match(/^(\d+)?((?:[a-z](?:\^\(?-?\d+\)?)?)*)$/);
    if (!m || (!m[1] && !m[2])) return null;
    var e = {}, re = /([a-z])(?:\^\(?(-?\d+)\)?)?/g, x;
    while ((x = re.exec(m[2] || ""))) e[x[1]] = (e[x[1]] || 0) + (x[2] ? +x[2] : 1);
    return { c: fr(m[1] ? m[1] : 1), e: e };
  }
  function parseMono(s) {
    s = String(s).toLowerCase().replace(/\s+/g, "").replace(/[−–]/g, "-").replace(/[·*]/g, "").replace(/²/g, "^2").replace(/³/g, "^3");
    var sign = 1; while (s[0] === "+" || s[0] === "-") { if (s[0] === "-") sign = -sign; s = s.slice(1); }
    var parts = s.split("/"); if (parts.length > 2) return null;
    var a = parseProd(parts[0]), b = parts.length === 2 ? parseProd(parts[1]) : { c: fr(1), e: {} };
    if (!a || !b || b.c.n === 0n) return null;
    var e = {}; Object.keys(a.e).forEach(function (k) { e[k] = (e[k] || 0) + a.e[k]; }); Object.keys(b.e).forEach(function (k) { e[k] = (e[k] || 0) - b.e[k]; });
    Object.keys(e).forEach(function (k) { if (!e[k]) delete e[k]; });
    return { c: fr(a.c.n * BigInt(sign) * b.c.d, a.c.d * b.c.n), e: e };
  }
  function mmul(a, b) { var e = {}; [a.e, b.e].forEach(function (E) { Object.keys(E).forEach(function (k) { e[k] = (e[k] || 0) + E[k]; }); }); Object.keys(e).forEach(function (k) { if (!e[k]) delete e[k]; }); return { c: fmul(a.c, b.c), e: e }; }
  function mpow(a, p) { var e = {}; Object.keys(a.e).forEach(function (k) { if (p) e[k] = a.e[k] * p; }); return { c: fpow(a.c, p), e: e }; }
  function varsTex(e, neg) { return Object.keys(e).sort().filter(function (k) { return neg ? e[k] < 0 : e[k] > 0; }).map(function (k) { var p = Math.abs(e[k]); return k + (p === 1 ? "" : "^{" + p + "}"); }).join(""); }
  function mTex(m) { // monômio em LaTeX (com sinal "-" quando negativo)
    var neg = m.c.n < 0n, n = neg ? -m.c.n : m.c.n, d = m.c.d, pv = varsTex(m.e), nv = varsTex(m.e, true), s;
    if (n === 0n) return "0";
    if (d === 1n && !nv) s = (n === 1n && pv ? "" : th(n)) + pv;
    else s = "\\frac{" + (n === 1n && pv ? "" : th(n)) + pv + "}{" + (d === 1n && nv ? "" : th(d)) + nv + "}";
    return (neg ? "-" : "") + s;
  }
  function isAtom(m) { return m.c.n === 1n && m.c.d === 1n && Object.keys(m.e).length === 1 && m.e[Object.keys(m.e)[0]] === 1; }
  function powTex(m, p) { return (isAtom(m) ? mTex(m) : "\\left(" + mTex(m) + "\\right)") + "^{" + p + "}"; }
  function polyTex(terms) { // soma de monômios com sinais
    var s = ""; terms.forEach(function (t, i) { var x = mTex(t); if (x === "0") return; if (i && x[0] !== "-") s += "+"; s += x; }); return s || "0";
  }
  function key(e) { return Object.keys(e).sort().map(function (k) { return k + e[k]; }).join(","); }
  W.parseMono = parseMono; W.mTex = mTex;

  function expand(a, b, n) { // termos T_{k+1}
    var out = [];
    for (var k = 0; k <= n; k++) { var t = mmul(mmul({ c: fr(bbinom(n, k)), e: {} }, mpow(a, n - k)), mpow(b, k)); out.push({ k: k, t: t }); }
    return out;
  }
  function collect(list) { var map = {}, order = []; list.forEach(function (t) { var k = key(t.e); if (!map[k]) { map[k] = { c: fr(0), e: t.e }; order.push(k); } map[k].c = fadd(map[k].c, t.c); }); return order.map(function (k) { return map[k]; }).filter(function (t) { return t.c.n !== 0n; }); }

  // =================================================================== FIGURAS
  var F = W.fig;
  F.arvore3 = function () { // as 8 escolhas de (a+b)^3
    var s = "", x0 = 30, lv = [[60], [], [], []];
    var Y = [130], cols = [30, 150, 270, 390];
    function node(x, y, t, c) { return Ci(x, y, 15, "fill:" + c + ";opacity:.16") + Tx(x, y, t, "fill:" + c + ";font-size:15px"); }
    var leaves = [];
    function rec(d, y, h, word) {
      var x = cols[d];
      if (d === 3) { leaves.push([x, y, word]); return; }
      ["a", "b"].forEach(function (c, i) {
        var ny = y + (i ? 1 : -1) * h / 2, nx = cols[d + 1];
        s += L([x + 15, y], [nx - 15, ny], "stroke:var(--line);stroke-width:2");
        s += node(nx, ny, c, c === "a" ? CA : CB);
        rec(d + 1, ny, h / 2, word + c);
      });
    }
    s += Tx(cols[0], 130, "início", "fill:var(--muted);font-size:12px");
    rec(0, 130, 240, "");
    leaves.forEach(function (l) {
      var nb = l[2].split("b").length - 1;
      s += Tx(l[0] + 34, l[1], l[2].split("").join("·"), "font-size:14px", "start") + Tx(l[0] + 110, l[1], "→ " + (nb === 0 ? "a³" : nb === 1 ? "a²b" : nb === 2 ? "ab²" : "b³"), "fill:" + [CA, CM, CG, CB][nb] + ";font-size:14px", "start");
    });
    s += Tx(cols[1], 6, "1º fator", "fill:var(--muted);font-size:12px") + Tx(cols[2], 6, "2º fator", "fill:var(--muted);font-size:12px") + Tx(cols[3], 6, "3º fator", "fill:var(--muted);font-size:12px");
    return svg("0 -8 560 270", s);
  };
  F.quadrado = function () { // (a+b)^2 estático
    var a = 150, b = 80, x = 20, y = 20, s = "";
    s += R(x, y, a, a, "fill:" + CA + ";opacity:.25;stroke:" + CA + ";stroke-width:2") + R(x + a, y, b, a, "fill:" + CM + ";opacity:.25;stroke:" + CM + ";stroke-width:2") + R(x, y + a, a, b, "fill:" + CM + ";opacity:.25;stroke:" + CM + ";stroke-width:2") + R(x + a, y + a, b, b, "fill:" + CB + ";opacity:.25;stroke:" + CB + ";stroke-width:2");
    s += Tx(x + a / 2, y + a / 2, "a²", "font-size:22px") + Tx(x + a + b / 2, y + a / 2, "ab", "font-size:18px") + Tx(x + a / 2, y + a + b / 2, "ab", "font-size:18px") + Tx(x + a + b / 2, y + a + b / 2, "b²", "font-size:18px");
    s += Tx(x + a / 2, y - 10, "a", "fill:" + CA) + Tx(x + a + b / 2, y - 10, "b", "fill:" + CB) + Tx(x - 10, y + a / 2, "a", "fill:" + CA) + Tx(x - 10, y + a + b / 2, "b", "fill:" + CB);
    s += Tx(300, 110, "(a + b)² = a² + 2ab + b²", "font-size:17px", "start");
    return svg("0 0 520 260", s);
  };
  F.sigma = function () {
    var s = Tx(60, 70, "Σ", "font-size:76px;fill:var(--pri)") + Tx(60, 18, "n", "font-size:15px") + Tx(60, 122, "k = 0", "font-size:15px") + Tx(108, 70, "(termo que depende de k)", "font-size:15px", "start");
    s += Tx(108, 112, "↑ some os termos para k = 0, 1, 2, …, n", "fill:var(--muted);font-size:13px", "start");
    return svg("0 0 460 140", s);
  };

  // =================================================================== MÓDULO 1
  W.areaLab = function (h) { // (a+b)^2 por área, com animação de separar
    var c = ctrls(h), ia = slider(c, "arA", "a", 1, 9, 1, 5), ib = slider(c, "arB", "b", 1, 9, 1, 3);
    var S = scene(h, "0 0 520 300"), out = rows(h, [["e", "Área total"], ["s", "Soma das peças"]]), gap = 0;
    Anim(h, 1600, function (t) { gap = 26 * ease(t); draw(); });
    function draw() {
      var a = +ia.value, b = +ib.value, u = 230 / (a + b), A = a * u, B = b * u, x = 40, y = 30, g = gap, s = "";
      s += R(x, y, A, A, "fill:" + CA + ";fill-opacity:.25;stroke:" + CA + ";stroke-width:2", 4) + Tx(x + A / 2, y + A / 2, "a²", "font-size:20px");
      s += R(x + A + g, y, B, A, "fill:" + CM + ";fill-opacity:.25;stroke:" + CM + ";stroke-width:2", 4) + Tx(x + A + g + B / 2, y + A / 2, "ab", "font-size:" + (B > 40 ? 17 : 13) + "px");
      s += R(x, y + A + g, A, B, "fill:" + CM + ";fill-opacity:.25;stroke:" + CM + ";stroke-width:2", 4) + Tx(x + A / 2, y + A + g + B / 2, "ab", "font-size:17px");
      s += R(x + A + g, y + A + g, B, B, "fill:" + CB + ";fill-opacity:.25;stroke:" + CB + ";stroke-width:2", 4) + Tx(x + A + g + B / 2, y + A + g + B / 2, "b²", "font-size:" + (B > 40 ? 17 : 13) + "px");
      s += Tx(x + A / 2, y - 14, "a = " + a, "fill:" + CA) + Tx(x + A + g + B / 2, y - 14, "b = " + b, "fill:" + CB) + Tx(x - 18, y + A / 2, "a", "fill:" + CA) + Tx(x - 18, y + A + g + B / 2, "b", "fill:" + CB);
      s += Tx(330, 70, "(a + b)²", "font-size:18px", "start") + Tx(330, 100, "= a² + ab + ab + b²", "font-size:16px", "start") + Tx(330, 130, "= a² + 2ab + b²", "font-size:16px;fill:var(--pri)", "start");
      s += Tx(330, 180, "Peças:", "fill:var(--muted);font-size:13px", "start") + Tx(330, 202, "1 quadrado a × a", "fill:" + CA + ";font-size:13px", "start") + Tx(330, 222, "2 retângulos a × b", "fill:" + CM + ";font-size:13px", "start") + Tx(330, 242, "1 quadrado b × b", "fill:" + CB + ";font-size:13px", "start");
      S.innerHTML = s;
      out.e.innerHTML = tex("(" + a + "+" + b + ")^2=" + (a + b) + "^2=" + (a + b) * (a + b));
      out.s.innerHTML = tex(a + "^2+2\\cdot" + a + "\\cdot" + b + "+" + b + "^2=" + a * a + "+" + 2 * a * b + "+" + b * b + "=" + (a * a + 2 * a * b + b * b));
    }
    ia.addEventListener("input", draw); ib.addEventListener("input", draw); draw();
  };
  W.cuboLab = function (h) { // (a+b)^3 em 8 blocos, perspectiva isométrica, explodindo
    var c = ctrls(h), ia = slider(c, "cbA", "a", 2, 6, 1, 4), ib = slider(c, "cbB", "b", 1, 4, 1, 2);
    var S = scene(h, "0 0 520 332"), out = rows(h, [["l", "Blocos"], ["v", "Volume"]]), ex = 0;
    Anim(h, 1800, function (t) { ex = ease(t); draw(); });
    function iso(x, y, z, k, ox, oy) { return [ox + (x - y) * 0.866 * k, oy + (x + y) * 0.5 * k - z * k]; }
    function box(x, y, z, dx, dy, dz, col, k, ox, oy) {
      var p = function (a, b, c2) { return iso(a, b, c2, k, ox, oy); };
      var top = [p(x, y, z + dz), p(x + dx, y, z + dz), p(x + dx, y + dy, z + dz), p(x, y + dy, z + dz)];
      var right = [p(x + dx, y, z), p(x + dx, y + dy, z), p(x + dx, y + dy, z + dz), p(x + dx, y, z + dz)];
      var left = [p(x, y + dy, z), p(x + dx, y + dy, z), p(x + dx, y + dy, z + dz), p(x, y + dy, z + dz)];
      var st = "stroke:var(--ink);stroke-width:1.2;stroke-linejoin:round;fill:" + col + ";";
      return Pg(left, st) + Pg(left, "fill:#000;fill-opacity:.18") + Pg(right, st) + Pg(right, "fill:#000;fill-opacity:.32") + Pg(top, st);
    }
    function draw() {
      var a = +ia.value, b = +ib.value, k = 150 / (a + b) * 0.9, g = ex * 1.4, s = "";
      var parts = [];
      [0, 1].forEach(function (i) { [0, 1].forEach(function (j) { [0, 1].forEach(function (l) {
        var nb = i + j + l, col = [CA, CM, CG, CB][nb];
        parts.push({ x: i ? a + g : 0, y: j ? a + g : 0, z: l ? a + g : 0, dx: i ? b : a, dy: j ? b : a, dz: l ? b : a, col: col, d: (i ? 1 : 0) + (j ? 1 : 0) - (l ? 1 : 0) * 0.01 + l * 2 });
      }); }); });
      parts.sort(function (p, q) { return (p.x + p.y + p.z) - (q.x + q.y + q.z); });
      parts.forEach(function (p) { s += box(p.x, p.y, p.z, p.dx, p.dy, p.dz, p.col, k, 200, 150 + (a + b) * k * 0.15); });
      var lg = [["a³ (1 bloco)", CA], ["a²b (3 blocos)", CM], ["ab² (3 blocos)", CG], ["b³ (1 bloco)", CB]];
      lg.forEach(function (x, i) { s += R(388, 70 + i * 34, 16, 16, "fill:" + x[1] + ";stroke:var(--ink)", 3) + Tx(412, 78 + i * 34, x[0], "font-size:13px", "start"); });
      s += Tx(300, 318, "(a+b)³ = a³ + 3a²b + 3ab² + b³", "font-size:13px;fill:var(--pri)");
      S.innerHTML = s;
      out.l.textContent = "1 + 3 + 3 + 1 = 8 blocos (afaste-os com a animação)";
      out.v.innerHTML = tex("(" + a + "+" + b + ")^3=" + Math.pow(a + b, 3) + "\\quad\\text{e}\\quad" + a * a * a + "+3\\cdot" + a * a * b + "+3\\cdot" + a * b * b + "+" + b * b * b + "=" + (a * a * a + 3 * a * a * b + 3 * a * b * b + b * b * b));
    }
    ia.addEventListener("input", draw); ib.addEventListener("input", draw); draw();
  };
  W.multLab = function (h) { // (a+b)^n por multiplicações sucessivas
    var c = ctrls(h), iN = slider(c, "mlN", "n", 1, 7, 1, 3), out = el("div", { class: "steps" }); h.appendChild(out);
    function row(n) { var r = [1]; for (var i = 1; i <= n; i++) { var nr = [1]; for (var j = 1; j < i; j++) nr.push(r[j - 1] + r[j]); nr.push(1); r = nr; } return r; }
    function poly(co) { var n = co.length - 1; return co.map(function (cc, k) { var ap = n - k, bp = k; return (cc === 1 && (ap || bp) ? "" : cc) + (ap ? "a" + (ap > 1 ? "^{" + ap + "}" : "") : "") + (bp ? "b" + (bp > 1 ? "^{" + bp + "}" : "") : ""); }).join("+"); }
    function draw() {
      var n = +iN.value, s = "";
      s += '<div class="st"><span class="pl">n = 1</span><div class="m">\\[(a+b)^1=a+b\\]</div></div>';
      for (var m = 2; m <= n; m++) {
        var p = row(m - 1), q = row(m), n1 = m - 1;
        var ta = p.map(function (cc, k) { return { c: cc, ap: n1 - k + 1, bp: k }; }), tb = p.map(function (cc, k) { return { c: cc, ap: n1 - k, bp: k + 1 }; });
        var mt = function (o) { return (o.c === 1 ? "" : o.c) + (o.ap ? "a" + (o.ap > 1 ? "^{" + o.ap + "}" : "") : "") + (o.bp ? "b" + (o.bp > 1 ? "^{" + o.bp + "}" : "") : ""); };
        s += '<div class="st"><span class="pl">n = ' + m + " · multiplique o resultado anterior por (a + b)</span>";
        s += '<div class="m">\\[(a+b)^{' + m + "}=(" + poly(p) + ")(a+b)\\]</div>";
        s += '<p class="small">Cada termo vezes <b style="color:var(--c-cos)">a</b>, depois cada termo vezes <b style="color:var(--c-sen)">b</b>:</p>';
        s += '<div class="m">\\[=\\color{var(--c-cos)}{' + ta.map(mt).join("+") + "}+\\color{var(--c-sen)}{" + tb.map(mt).join("+") + "}\\]</div>";
        s += '<p class="small">Juntando os termos semelhantes (mesmos expoentes):</p><div class="m">\\[=' + poly(q) + "\\]</div>";
        s += '<p class="small muted">Coeficientes: ' + q.join(", ") + (m >= 3 ? " — cada um é a soma de dois vizinhos da linha anterior (" + p.join(", ") + ")." : "") + "</p></div>";
      }
      out.innerHTML = s.replace(/var\(--c-cos\)/g, "#2b7de9").replace(/var\(--c-sen\)/g, "#e0487a");
      renderM(out);
    }
    iN.addEventListener("input", draw); draw();
  };

  // =================================================================== MÓDULO 2 · FATORIAL
  W.fatLab = function (h) {
    var c = ctrls(h), iN = slider(c, "ftN", "n", 0, 20, 1, 5), out = rows(h, [["p", "Produto"], ["v", "Valor"], ["r", "Recursão"]]), S = scene(h, "0 0 520 190");
    function draw() {
      var n = +iN.value, f = fact(n);
      if (n === 0) out.p.innerHTML = tex("0!=1") + ' <span class="small muted">(por definição; veja o porquê abaixo)</span>';
      else { var fs = []; for (var i = n; i >= 1; i--) fs.push(i); out.p.innerHTML = tex(n + "!=" + (n > 8 ? fs.slice(0, 4).join("\\cdot") + "\\cdots" + fs.slice(-2).join("\\cdot") : fs.join("\\cdot"))); }
      out.v.innerHTML = tex(n + "!=" + th(f.toString())) + ' <span class="small muted">(' + f.toString().length + " algarismo" + (f.toString().length > 1 ? "s" : "") + ")</span>";
      out.r.innerHTML = n ? tex(n + "!=" + n + "\\cdot" + (n - 1) + "!=" + n + "\\cdot" + th(fact(n - 1).toString())) : tex("1!=1\\cdot0!\\Rightarrow0!=1");
      var s = "", X = 40, Y = 160, maxL = Math.log10(Number(fact(20)));
      for (var k = 0; k <= 20; k++) {
        var vf = Math.log10(Number(fact(k)) || 1), v2 = Math.log10(Math.pow(2, k)), x = X + k * 22, hf = 140 * vf / maxL, h2 = 140 * v2 / maxL;
        s += R(x, Y - hf, 9, hf, "fill:" + (k === n ? "var(--pri)" : CB) + ";fill-opacity:" + (k === n ? 1 : .55), 2) + R(x + 10, Y - h2, 9, h2, "fill:" + CA + ";fill-opacity:.55", 2);
        if (k % 5 === 0) s += Tx(x + 10, Y + 12, k, "font-size:11px;fill:var(--muted)");
      }
      s += L([X - 4, Y], [X + 21 * 22, Y], "stroke:var(--line)") + R(330, 10, 12, 12, "fill:" + CB + ";fill-opacity:.55") + Tx(348, 16, "n!", "font-size:12px", "start") + R(390, 10, 12, 12, "fill:" + CA + ";fill-opacity:.55") + Tx(408, 16, "2ⁿ", "font-size:12px", "start");
      s += Tx(40, 16, "altura = número de algarismos", "font-size:11px;fill:var(--muted)", "start");
      S.innerHTML = s;
    }
    iN.addEventListener("input", draw); draw();
  };
  function parseFE(s) { // "10" ou "n+2" ou "n-1" ou "n"
    s = String(s).replace(/\s/g, "").replace(/[−–]/g, "-").replace(/!$/, "").replace(/^\((.*)\)$/, "$1");
    if (/^\d+$/.test(s)) return { v: true, c: +s };
    var m = s.match(/^n([+-]\d+)?$/); if (m) return { v: false, c: m[1] ? +m[1] : 0 };
    return null;
  }
  function feTex(e) { return e.v ? String(e.c) : "n" + (e.c > 0 ? "+" + e.c : e.c < 0 ? String(e.c) : ""); }
  function fePar(e) { return e.v || e.c === 0 ? feTex(e) : "(" + feTex(e) + ")"; }
  function fatSteps(a, b) { // a!/b!
    var A = parseFE(a), B = parseFE(b);
    if (!A || !B || A.v !== B.v) return '<div class="alert bad">Use dois números (ex.: 10 e 7) ou duas expressões em n (ex.: n+2 e n).</div>';
    var s = "", num = A.v ? A.c : A.c, den = B.c;
    if (A.v && (A.c > 60 || B.c > 60)) return '<div class="alert bad">Use números até 60.</div>';
    var big = num >= den, hi = big ? A : B, lo = big ? B : A, d = Math.abs(num - den);
    var fs = []; for (var i = 0; i < d; i++) fs.push(hi.v ? String(hi.c - i) : fePar({ v: false, c: hi.c - i }));
    var expHi = (d ? fs.join("\\cdot") + "\\cdot " : "") + fePar(lo) + "!";
    s += '<div class="st"><span class="pl">Passo 1 · escreva o fatorial maior “descendo” até o menor</span><div class="m">\\[' + feTex(hi) + "!=" + expHi + "\\]</div></div>";
    var frac = big ? "\\frac{" + feTex(A) + "!}{" + feTex(B) + "!}=\\frac{" + expHi.replace(fePar(lo) + "!", "\\cancel{" + fePar(lo) + "!}") + "}{\\cancel{" + fePar(lo) + "!}}" : "\\frac{" + feTex(A) + "!}{" + feTex(B) + "!}=\\frac{\\cancel{" + fePar(lo) + "!}}{" + expHi.replace(fePar(lo) + "!", "\\cancel{" + fePar(lo) + "!}") + "}";
    s += '<div class="st"><span class="pl">Passo 2 · corte o fatorial que aparece em cima e embaixo</span><div class="m">\\[' + frac + "\\]</div></div>";
    var res = d ? fs.join("\\cdot") : "1";
    if (hi.v) { var p = 1n; for (var j = 0; j < d; j++) p *= BigInt(hi.c - j); res += d > 1 ? "=" + th(p.toString()) : ""; if (!big) res = "\\frac{1}{" + (d ? th(p.toString()) : "1") + "}"; }
    else if (!big) res = "\\frac{1}{" + (d ? fs.join("") : "1") + "}";
    s += '<div class="st"><span class="pl">Resultado</span><div class="m">\\[\\frac{' + feTex(A) + "!}{" + feTex(B) + "!}=" + res + "\\]</div>" + (!hi.v && d === 2 ? '<p class="small muted">Se quiser, desenvolva: ' + tex("(" + feTex({ v: false, c: hi.c }) + ")(" + feTex({ v: false, c: hi.c - 1 }) + ")") + " é um polinômio do 2º grau em n.</p>" : "") + "</div>";
    return s;
  }
  W.fatSteps = fatSteps;
  W.fatSimp = function (h) {
    var bx = el("div", { class: "btns" }); h.appendChild(bx);
    var ia = inp(bx, "fsA", "Numerador", "10", 80), ib = inp(bx, "fsB", "! ÷ Denominador", "7", 80);
    bx.appendChild(el("span", { class: "small muted" }, "!"));
    var out = el("div", { class: "steps" }); h.appendChild(out);
    var ex = el("div", { class: "btns" }); h.appendChild(ex);
    [["10", "7"], ["8", "6"], ["100", "98"], ["n+2", "n"], ["n+1", "n-1"], ["n", "n-3"], ["5", "7"]].forEach(function (p) { var b = el("button", { class: "btn s", type: "button" }, p[0] + "! / " + p[1] + "!"); b.onclick = function () { ia.value = p[0]; ib.value = p[1]; go(); }; ex.appendChild(b); });
    function go() { out.innerHTML = fatSteps(ia.value, ib.value); renderM(out); }
    ia.addEventListener("input", go); ib.addEventListener("input", go); go();
  };

  // =================================================================== MÓDULO 3 · CONTAGEM
  W.arvoreLab = function (h) { // princípio multiplicativo
    var c = ctrls(h), i1 = slider(c, "avA", "camisetas", 1, 4, 1, 3), i2 = slider(c, "avB", "bermudas", 1, 3, 1, 2), i3 = slider(c, "avC", "tênis", 1, 3, 1, 2);
    var S = scene(h, "0 0 560 300"), out = rows(h, [["t", "Total de looks"]]);
    var CC = ["#e0487a", "#2b7de9", "#0f9d77", "#e0900f"];
    function draw() {
      var a = +i1.value, b = +i2.value, cc = +i3.value, n = a * b * cc, s = "", H = 280, leafH = H / n, idx = 0;
      for (var i = 0; i < a; i++) {
        var y1 = 10 + (i + 0.5) * H / a;
        s += L([30, 150], [150, y1], "stroke:var(--line);stroke-width:2") + R(138, y1 - 9, 24, 18, "fill:" + CC[i], 4);
        for (var j = 0; j < b; j++) {
          var y2 = 10 + (i * b + j + 0.5) * H / (a * b);
          s += L([162, y1], [290, y2], "stroke:var(--line);stroke-width:1.6") + R(280, y2 - 7, 20, 14, "fill:var(--muted);opacity:" + (0.4 + 0.3 * j), 3);
          for (var k = 0; k < cc; k++) {
            var y3 = 10 + (idx + 0.5) * leafH; idx++;
            s += L([300, y2], [420, y3], "stroke:var(--line);stroke-width:1.2") + Ci(428, y3, Math.min(6, leafH / 2.5), "fill:var(--ink);opacity:" + (0.35 + 0.3 * k));
            if (leafH > 11) s += Tx(442, y3, "look " + idx, "font-size:" + Math.min(12, leafH * 0.8) + "px;font-weight:600", "start");
          }
        }
      }
      s += Ci(30, 150, 7, "fill:var(--pri)") + Tx(150, 4, "camiseta", "font-size:11px;fill:var(--muted)") + Tx(290, 4, "bermuda", "font-size:11px;fill:var(--muted)") + Tx(428, 4, "tênis", "font-size:11px;fill:var(--muted)");
      S.innerHTML = s;
      out.t.innerHTML = tex(a + "\\times" + b + "\\times" + cc + "=" + n) + ' <span class="small muted">— conte as folhas da árvore</span>';
    }
    [i1, i2, i3].forEach(function (x) { x.addEventListener("input", draw); }); draw();
  };
  W.comboLab = function (h) { // listar todas as combinações
    var c = ctrls(h), iN = slider(c, "cmN", "n (pessoas)", 2, 7, 1, 5), iK = slider(c, "cmK", "k (escolhidas)", 0, 7, 1, 2);
    var out = rows(h, [["a", "Arranjos (ordem importa)"], ["c", "Combinações (ordem não importa)"]]), box = el("div", { class: "chips" }); h.appendChild(box);
    var NM = ["Ana", "Bia", "Caio", "Davi", "Eva", "Fábio", "Gil"];
    function combs(n, k) { var r = []; (function rec(st, cur) { if (cur.length === k) { r.push(cur.slice()); return; } for (var i = st; i < n; i++) { cur.push(i); rec(i + 1, cur); cur.pop(); } })(0, []); return r; }
    function draw() {
      var n = +iN.value; clampTo(iK, n); var k = +iK.value;
      var A = 1; for (var i = 0; i < k; i++) A *= n - i; var Cn = binom(n, k), kf = Number(fact(k));
      out.a.innerHTML = tex("A_{" + n + "," + k + "}=" + (k ? Array.from({ length: k }, function (_, i) { return n - i; }).join("\\cdot") : "1") + "=" + A);
      out.c.innerHTML = tex("\\binom{" + n + "}{" + k + "}=\\frac{A_{" + n + "," + k + "}}{" + k + "!}=\\frac{" + A + "}{" + kf + "}=" + Cn);
      var L2 = combs(n, k);
      box.innerHTML = '<p class="small muted" style="width:100%">Todos os ' + Cn + " grupos de " + k + " pessoas escolhidas entre " + NM.slice(0, n).join(", ") + ":</p>" + (L2.length > 60 ? "" : L2.map(function (g) { return '<span class="cb">' + (g.length ? g.map(function (i) { return NM[i]; }).join(" + ") : "ninguém") + "</span>"; }).join(""));
    }
    iN.addEventListener("input", draw); iK.addEventListener("input", draw); draw();
  };
  W.binomCalc = function (h) {
    var c = ctrls(h), iN = slider(c, "bcN", "n", 0, 30, 1, 10), iK = slider(c, "bcK", "k", 0, 30, 1, 3), out = el("div", { class: "steps" }); h.appendChild(out);
    function draw() {
      var n = +iN.value; clampTo(iK, n);
      var k = +iK.value, kk = Math.min(k, n - k), s = "";
      s += '<div class="st"><span class="pl">Fórmula</span><div class="m">\\[\\binom{' + n + "}{" + k + "}=\\frac{" + n + "!}{" + k + "!\\,(" + n + "-" + k + ")!}=\\frac{" + n + "!}{" + k + "!\\," + (n - k) + "!}\\]</div></div>";
      if (kk !== k) s += '<div class="st"><span class="pl">Atalho · use o complementar</span><p>Escolher ' + k + " para entrar é o mesmo que escolher " + (n - k) + " para ficar de fora:</p><div class=\"m\">\\[\\binom{" + n + "}{" + k + "}=\\binom{" + n + "}{" + (n - k) + "}\\]</div></div>";
      var top = []; for (var i = 0; i < kk; i++) top.push(n - i);
      s += '<div class="st"><span class="pl">Conta rápida · ' + kk + " fatores em cima, " + kk + "! embaixo</span><div class=\"m\">\\[\\binom{" + n + "}{" + kk + "}=\\frac{" + (kk ? top.join("\\cdot") : "1") + "}{" + (kk ? Array.from({ length: kk }, function (_, i) { return kk - i; }).join("\\cdot") : "1") + "}=\\frac{" + th(top.reduce(function (a, b) { return a * b; }, 1)) + "}{" + th(Number(fact(kk))) + "}=" + th(bbinom(n, kk).toString()) + "\\]</div></div>";
      out.innerHTML = s; renderM(out);
    }
    iN.addEventListener("input", draw); iK.addEventListener("input", draw); draw();
  };

  // =================================================================== MÓDULO 4 · PASCAL
  W.pascalLab = function (h) {
    var mode = "stifel", N = 8, sel = null;
    var tabs = seg(h, [["build", "Construir"], ["stifel", "Stifel"], ["linha", "Soma da linha"], ["hockey", "Taco de hóquei"], ["sym", "Simetria"], ["fibo", "Fibonacci"], ["par", "Pares e ímpares"]], mode, function (v) { mode = v; sel = null; if (v === "par") { iN.value = 31; } else if (+iN.value > 12) iN.value = 8; iN.dispatchEvent(new Event("input")); });
    var c = ctrls(h), iN = slider(c, "psN", "linhas (0 até n)", 2, 31, 1, N);
    var S = scene(h, "0 0 600 330"), info = el("div", { class: "alert", style: "margin-top:4px" }); h.appendChild(info);
    var bt = 0, anim = null;
    var bb = el("div", { class: "btns" }); var bPlay = el("button", { class: "btn p s", type: "button" }, "▶ Construir linha por linha"); bb.appendChild(bPlay); h.appendChild(bb);
    bPlay.onclick = function () { mode = "build"; [].forEach.call(tabs.children, function (x, i) { x.classList.toggle("on", i === 0); }); bt = 0; clearInterval(anim); anim = setInterval(function () { bt += 1; if (bt > (+iN.value + 1) * 3) clearInterval(anim); draw(); }, 260); };
    function pos(n, k, n0) { var sz = Math.min(560 / (n0 + 1), 300 / (n0 + 1)), cx = 300 + (k - n / 2) * sz, cy = 18 + n * sz * 0.92; return [cx, cy, sz]; }
    function draw() {
      N = +iN.value; var s = "", sz0 = pos(0, 0, N)[2], showNum = N <= 14, hl = {}, txt = "";
      function H(n, k, col) { hl[n + "," + k] = col; }
      if (mode === "stifel") {
        var t = sel || [Math.min(5, N), 2]; if (t[0] < 1 || t[1] < 1 || t[1] >= t[0]) t = [Math.min(5, N), Math.min(2, N - 1)];
        H(t[0] - 1, t[1] - 1, CA); H(t[0] - 1, t[1], CA); H(t[0], t[1], CB);
        txt = "Relação de Stifel: " + tex("\\binom{" + (t[0] - 1) + "}{" + (t[1] - 1) + "}+\\binom{" + (t[0] - 1) + "}{" + t[1] + "}=\\binom{" + t[0] + "}{" + t[1] + "}") + " → " + binom(t[0] - 1, t[1] - 1) + " + " + binom(t[0] - 1, t[1]) + " = " + binom(t[0], t[1]) + ". <b>Toque em outro número</b> (que não seja borda).";
      } else if (mode === "linha") {
        var r = sel ? sel[0] : Math.min(4, N); for (var k = 0; k <= r; k++) H(r, k, CB);
        var vals = []; for (var k2 = 0; k2 <= r; k2++) vals.push(binom(r, k2));
        txt = "Linha " + r + ": " + vals.join(" + ") + " = " + Math.pow(2, r) + " = " + tex("2^{" + r + "}") + ". <b>Toque em uma linha.</b>";
      } else if (mode === "hockey") {
        var t2 = sel || [Math.min(6, N), 2], col = t2[1]; if (t2[0] < 1 || col < 1) t2 = [Math.min(6, N), 2], col = 2;
        var sum = 0, terms = []; for (var i = col - 1; i <= t2[0] - 1; i++) { H(i, col - 1, CA); sum += binom(i, col - 1); terms.push(binom(i, col - 1)); }
        H(t2[0], col, CB);
        txt = "Taco de hóquei: descendo a diagonal a partir da borda, " + terms.join(" + ") + " = " + sum + ", o número logo abaixo e ao lado. " + tex("\\sum_{i=" + (col - 1) + "}^{" + (t2[0] - 1) + "}\\binom{i}{" + (col - 1) + "}=\\binom{" + t2[0] + "}{" + col + "}") + ". <b>Toque em outro número.</b>";
      } else if (mode === "sym") {
        var r3 = sel ? sel[0] : Math.min(6, N), k3 = sel ? sel[1] : 1; H(r3, k3, CA); H(r3, r3 - k3, CB);
        txt = "Simetria: " + tex("\\binom{" + r3 + "}{" + k3 + "}=\\binom{" + r3 + "}{" + (r3 - k3) + "}=" + binom(r3, k3)) + " — escolher " + k3 + " para entrar é escolher " + (r3 - k3) + " para ficar de fora. <b>Toque em um número.</b>";
      } else if (mode === "fibo") {
        var d = sel ? sel[0] + sel[1] : 6, fsum = 0, ts = [];
        for (var k4 = 0; k4 <= d; k4++) { var n4 = d - k4; if (k4 <= n4 && n4 <= N) { H(n4, k4, k4 % 2 ? CA : CB); fsum += binom(n4, k4); ts.push(binom(n4, k4)); } }
        txt = "Diagonal “rasa” " + d + ": " + ts.join(" + ") + " = <b>" + fsum + "</b>. As somas das diagonais formam a sequência de Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21… <b>Toque em um número.</b>";
      } else if (mode === "par") {
        txt = "Os números <b>ímpares</b> estão pintados. Com muitas linhas aparece o <b>Triângulo de Sierpinski</b>, um fractal escondido no Triângulo de Pascal.";
      } else {
        txt = "Cada linha começa e termina com 1. Cada número de dentro é a <b>soma dos dois de cima</b>.";
      }
      for (var n = 0; n <= N; n++) for (var k5 = 0; k5 <= n; k5++) {
        var p = pos(n, k5, N), v = binom(n, k5), key = n + "," + k5;
        if (mode === "build" && n * 3 + 1 > bt) continue;
        var fill = hl[key] ? hl[key] : mode === "par" ? (v % 2 ? "var(--pri)" : "var(--card2)") : "var(--card2)";
        var op = hl[key] || (mode === "par" && v % 2) ? 1 : 1;
        s += '<g data-n="' + n + '" data-k="' + k5 + '" style="cursor:pointer">' + Ci(p[0], p[1], p[2] * 0.46, "fill:" + fill + ";fill-opacity:" + (hl[key] ? .28 : mode === "par" && v % 2 ? .85 : 1) + ";stroke:" + (hl[key] || "var(--line)") + ";stroke-width:" + (hl[key] ? 2.5 : 1));
        if (showNum) s += Tx(p[0], p[1], v, "font-size:" + Math.min(15, p[2] * (v > 999 ? 0.3 : v > 99 ? 0.38 : 0.46)) + "px");
        if (mode === "build" && n >= 2 && k5 > 0 && k5 < n && Math.floor(bt / 3) === n) { var q1 = pos(n - 1, k5 - 1, N), q2 = pos(n - 1, k5, N); s += L([q1[0], q1[1] + p[2] * .46], [p[0], p[1] - p[2] * .46], "stroke:var(--c-aux);stroke-width:1.5") + L([q2[0], q2[1] + p[2] * .46], [p[0], p[1] - p[2] * .46], "stroke:var(--c-aux);stroke-width:1.5"); }
        s += "</g>";
      }
      if (N <= 14) for (var n6 = 0; n6 <= N; n6++) s += Tx(14, pos(n6, 0, N)[1], "n=" + n6, "font-size:" + Math.min(12, sz0 * .4) + "px;fill:var(--muted);font-weight:600", "start");
      var hh = pos(N, 0, N)[1] + sz0 * 0.6; S.setAttribute("viewBox", "0 0 600 " + Math.max(120, hh));
      S.innerHTML = s; info.innerHTML = txt; renderM(info);
    }
    S.addEventListener("click", function (e) { var g = e.target.closest("g[data-n]"); if (!g) return; sel = [+g.dataset.n, +g.dataset.k]; if (mode === "build") { mode = "stifel"; [].forEach.call(tabs.children, function (x, i) { x.classList.toggle("on", i === 1); }); } draw(); });
    iN.addEventListener("input", function () { sel = null; bt = 999; draw(); }); bt = 999; draw();
  };
  W.galton = function (h) { // tábua de Galton
    var c = ctrls(h), iN = slider(c, "glN", "fileiras de pinos (n)", 3, 12, 1, 8);
    var S = scene(h, "0 0 520 380"), out = rows(h, [["t", "Bolinhas"], ["e", "Por quê"]]);
    var bb = el("div", { class: "btns" }); h.appendChild(bb);
    var b1 = el("button", { class: "btn p s", type: "button" }, "Soltar 1"), b2 = el("button", { class: "btn s", type: "button" }, "Soltar 50"), b3 = el("button", { class: "btn s", type: "button" }, "Soltar 500 (rápido)"), b4 = el("button", { class: "btn s", type: "button" }, "↺ Zerar");
    [b1, b2, b3, b4].forEach(function (b) { bb.appendChild(b); });
    var cnt = [], total = 0, balls = [], raf = 0, queue = 0;
    function reset() { var n = +iN.value; cnt = []; for (var i = 0; i <= n; i++) cnt.push(0); total = 0; balls = []; queue = 0; draw(); }
    function geo() { var n = +iN.value, dx = 380 / (n + 1), top = 30, dy = 200 / n; return { n: n, dx: dx, top: top, dy: dy }; }
    function pinXY(r, i, G) { return [260 + (i - r / 2) * G.dx, G.top + r * G.dy]; }
    function draw() {
      var G = geo(), n = G.n, s = "", maxC = Math.max.apply(null, cnt.concat([1]));
      for (var r = 0; r < n; r++) for (var i = 0; i <= r; i++) { var p = pinXY(r, i, G); s += Ci(p[0], p[1], 3.2, "fill:var(--muted)"); }
      var baseY = G.top + n * G.dy + 10;
      for (var k = 0; k <= n; k++) {
        var x = 260 + (k - n / 2) * G.dx, hgt = 110 * cnt[k] / maxC, exp = total * binom(n, k) / Math.pow(2, n);
        s += R(x - G.dx * 0.4, baseY + 120 - hgt, G.dx * 0.8, hgt, "fill:var(--pri);fill-opacity:.55", 2);
        if (total) { var he = 110 * exp / maxC; s += L([x - G.dx * 0.45, baseY + 120 - he], [x + G.dx * 0.45, baseY + 120 - he], "stroke:" + CB + ";stroke-width:2.5"); }
        s += Tx(x, baseY + 132, binom(n, k), "font-size:" + Math.min(12, G.dx * 0.35) + "px;fill:var(--muted)");
      }
      s += L([60, baseY + 120], [460, baseY + 120], "stroke:var(--line)");
      balls.forEach(function (b) { s += Ci(b.x, b.y, 5, "fill:" + CG); });
      s += Tx(470, 20, "barra = bolinhas", "font-size:11px;fill:var(--muted)", "end") + Tx(470, 36, "traço = previsto pelo binômio", "font-size:11px;fill:" + CB, "end");
      S.innerHTML = s;
      out.t.textContent = total + " caíram · números embaixo = linha " + n + " de Pascal";
      out.e.innerHTML = "Cada pino desvia a bolinha para a esquerda ou para a direita (meio a meio). Chegar ao compartimento <i>k</i> = escolher <i>k</i> desvios para a direita entre <i>n</i>: " + tex("\\binom{n}{k}") + " caminhos de " + tex("2^n") + ".";
      renderM(out.e);
    }
    function spawn() { balls.push({ r: -1, i: 0, ni: 0, x: 260, y: 8, t: 0 }); }
    function step() {
      var G = geo(), n = G.n, speed = queue > 100 ? 0.5 : 0.14;
      if (queue > 0 && balls.length < (queue > 100 ? 40 : 12)) { spawn(); queue--; }
      balls.forEach(function (b) {
        b.t += speed;
        if (b.t >= 1) { b.t = 0; b.r++; b.i = b.ni; if (b.r >= n) { b.done = true; cnt[b.i]++; total++; return; } b.ni = b.i + (Math.random() < 0.5 ? 1 : 0); }
        var A = b.r < 0 ? [260, 8] : pinXY(b.r, b.i, G), B = b.r + 1 < n ? pinXY(b.r + 1, b.ni, G) : [260 + (b.ni - n / 2) * G.dx, G.top + n * G.dy + 40];
        b.x = A[0] + (B[0] - A[0]) * b.t; b.y = A[1] + (B[1] - A[1]) * b.t - 6 * Math.sin(Math.PI * b.t);
      });
      balls = balls.filter(function (b) { return !b.done; });
      draw();
      if (balls.length || queue > 0) raf = requestAnimationFrame(step); else raf = 0;
    }
    function go(k) { queue += k; if (!raf) raf = requestAnimationFrame(step); }
    b1.onclick = function () { go(1); }; b2.onclick = function () { go(50); };
    b3.onclick = function () { var n = +iN.value; for (var j = 0; j < 500; j++) { var kk = 0; for (var r = 0; r < n; r++) if (Math.random() < 0.5) kk++; cnt[kk]++; total++; } draw(); };
    b4.onclick = function () { cancelAnimationFrame(raf); raf = 0; reset(); };
    iN.addEventListener("input", function () { cancelAnimationFrame(raf); raf = 0; reset(); });
    reset();
  };

  // =================================================================== MÓDULO 5 · DESENVOLVIMENTO
  W.escolhaLab = function (h) { // cada termo = uma escolha de a ou b em cada fator
    var c = ctrls(h), iN = slider(c, "esN", "n (número de fatores)", 1, 5, 1, 3);
    var out = el("div", {}); h.appendChild(out);
    function draw() {
      var n = +iN.value, words = [];
      for (var m = 0; m < (1 << n); m++) { var w = ""; for (var i = n - 1; i >= 0; i--) w += (m >> i) & 1 ? "b" : "a"; words.push(w); }
      var fac = ""; for (var i2 = 0; i2 < n; i2++) fac += "(a+b)";
      var s = '<p class="small">' + tex("(a+b)^{" + n + "}=" + fac) + ": de cada parêntese você pega <b style=\"color:var(--c-cos)\">a</b> ou <b style=\"color:var(--c-sen)\">b</b>. São " + tex("2^{" + n + "}=" + (1 << n)) + " escolhas no total. Agrupando pelo número de <b>b</b>:</p>";
      s += '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:8px">';
      for (var k = 0; k <= n; k++) {
        var ws = words.filter(function (w) { return (w.split("b").length - 1) === k; });
        s += '<div class="card" style="padding:10px;display:grid;gap:6px"><b class="small">' + k + " vez" + (k === 1 ? "" : "es") + " b</b><div>" + ws.map(function (w) { return '<span class="cb mono">' + w.split("").map(function (ch) { return '<span style="color:' + (ch === "a" ? "var(--c-cos)" : "var(--c-sen)") + '">' + ch + "</span>"; }).join("") + "</span>"; }).join(" ") + '</div><div class="small">' + ws.length + " palavra" + (ws.length > 1 ? "s" : "") + " = " + tex("\\binom{" + n + "}{" + k + "}") + "</div><div>" + tex((ws.length > 1 ? ws.length : "") + (n - k ? "a" + (n - k > 1 ? "^{" + (n - k) + "}" : "") : "") + (k ? "b" + (k > 1 ? "^{" + k + "}" : "") : "")) + "</div></div>";
      }
      s += "</div>";
      var terms = []; for (var k2 = 0; k2 <= n; k2++) { var cf = binom(n, k2); terms.push((cf > 1 ? cf : "") + (n - k2 ? "a" + (n - k2 > 1 ? "^{" + (n - k2) + "}" : "") : "") + (k2 ? "b" + (k2 > 1 ? "^{" + k2 + "}" : "") : "")); }
      s += '<div class="final" style="margin-top:10px"><b>Resultado:</b> ' + tex("(a+b)^{" + n + "}=" + terms.join("+")) + "</div>";
      out.innerHTML = s; renderM(out);
    }
    iN.addEventListener("input", draw); draw();
  };
  function expanderHTML(sa, sb, n, opts) {
    opts = opts || {};
    var a = parseMono(sa), b = parseMono(sb);
    if (!a || !b) return '<div class="alert bad">Não entendi algum termo. Exemplos válidos: <b>x</b>, <b>2x</b>, <b>-3</b>, <b>x^2</b>, <b>1/x</b>, <b>3/x^2</b>, <b>x/2</b>, <b>2y</b>.</div>';
    if (!(n >= 0 && n <= 12)) return '<div class="alert bad">Use n entre 0 e 12.</div>';
    var A = mTex(a), B = mTex(b), Bs = (b.c.n < 0n ? "" : "+") + B, terms = expand(a, b, n), s = "";
    s += '<div class="st"><span class="pl">Montagem</span><p>' + tex("a=" + A) + ", " + tex("b=" + B) + ", " + tex("n=" + n) + ": são <b>" + (n + 1) + " termos</b>. Os expoentes de " + tex("a") + " descem de " + n + " a 0 e os de " + tex("b") + " sobem de 0 a " + n + ".</p></div>";
    terms.forEach(function (o) {
      var k = o.k, pa = mpow(a, n - k), pb = mpow(b, k);
      s += '<div class="st"><span class="pl">' + tex("T_{" + (k + 1) + "}") + " · k = " + k + "</span><div class=\"m\">\\[\\binom{" + n + "}{" + k + "}\\cdot" + powTex(a, n - k) + "\\cdot" + powTex(b, k) + "=" + th(bbinom(n, k).toString()) + "\\cdot" + (mTex(pa).indexOf("-") === 0 ? "\\left(" + mTex(pa) + "\\right)" : mTex(pa)) + "\\cdot" + (mTex(pb).indexOf("-") === 0 ? "\\left(" + mTex(pb) + "\\right)" : mTex(pb)) + "=" + mTex(o.t) + "\\]</div></div>";
    });
    var col = collect(terms.map(function (o) { return o.t; }));
    s += '<div class="final"><b>Resultado:</b> \\[\\left(' + A + Bs + "\\right)^{" + n + "}=" + polyTex(col) + "\\]" + (col.length < terms.length ? '<p class="small muted">Alguns termos tinham a mesma parte literal e foram somados.</p>' : "") + "</div>";
    return s;
  }
  W.expander = function (h, o) {
    var bx = el("div", { class: "btns", style: "align-items:center" }); h.appendChild(bx);
    bx.appendChild(el("span", { style: "font-size:1.3rem;font-weight:800" }, "("));
    var ia = inp(bx, "exA" + (o.id || ""), "", o.a || "x", 70); bx.appendChild(el("span", { style: "font-weight:800" }, "+"));
    var ib = inp(bx, "exB" + (o.id || ""), "", o.b || "2", 70); bx.appendChild(el("span", { style: "font-size:1.3rem;font-weight:800" }, ")"));
    var iN = inp(bx, "exN" + (o.id || ""), "expoente n =", o.n || "4", 50);
    var hint = el("p", { class: "small muted" }, "Para subtrair, escreva o segundo termo com sinal: <b>(x + -3)</b> é o mesmo que <b>(x − 3)</b>. Aceita frações e expoentes: 1/x, x^2, 3/x^2, x/2."); h.appendChild(hint);
    var ex = el("div", { class: "btns" }); h.appendChild(ex);
    [["x", "2", 4], ["2x", "3", 3], ["x", "-1", 5], ["a", "b", 6], ["x", "1/x", 4], ["x^2", "-2/x", 6], ["2x", "-y", 4]].forEach(function (p) { var b = el("button", { class: "btn s", type: "button" }, "(" + p[0] + (p[1][0] === "-" ? " − " + p[1].slice(1) : " + " + p[1]) + ")" + "<sup>" + p[2] + "</sup>"); b.onclick = function () { ia.value = p[0]; ib.value = p[1]; iN.value = p[2]; go(); }; ex.appendChild(b); });
    var out = el("div", { class: "steps" }); h.appendChild(out);
    function go() { out.innerHTML = expanderHTML(ia.value, ib.value, parseInt(iN.value, 10)); renderM(out); }
    [ia, ib, iN].forEach(function (x) { x.addEventListener("input", go); }); go();
  };
  W.expanderHTML = expanderHTML;

  // =================================================================== MÓDULO 6 · TERMO GERAL
  function termHTML(sa, sb, n, mode, val, v) {
    var a = parseMono(sa), b = parseMono(sb);
    if (!a || !b) return { html: '<div class="alert bad">Não entendi algum termo. Ex.: x, 2x, -3, x^2, 1/x, 3/x^2.</div>' };
    if (!(n >= 1 && n <= 40)) return { html: '<div class="alert bad">Use n entre 1 e 40.</div>' };
    var A = mTex(a), B = mTex(b), s = "", k = null;
    v = v || (Object.keys(a.e).concat(Object.keys(b.e)))[0] || "x";
    var ea = a.e[v] || 0, eb = b.e[v] || 0;
    s += '<div class="st"><span class="pl">Termo geral</span><div class="m">\\[T_{k+1}=\\binom{' + n + "}{k}\\cdot" + powTex(a, "" + n + "-k") + "\\cdot" + powTex(b, "k") + "\\]</div></div>";
    if (mode === "ordem") {
      var p = val; if (!(p >= 1 && p <= n + 1)) return { html: s.replace(/^/, "") + '<div class="alert bad">O desenvolvimento tem ' + (n + 1) + " termos: escolha uma posição de 1 a " + (n + 1) + ".</div>" };
      k = p - 1;
      s += '<div class="st"><span class="pl">Posição → k</span><p>O ' + p + "º termo é " + tex("T_{" + p + "}=T_{k+1}") + ", então " + tex("k=" + p + "-1=" + k) + ". (Atenção: k começa em 0.)</p></div>";
    } else if (mode === "medio") {
      if (n % 2 === 0) { k = n / 2; s += '<div class="st"><span class="pl">Termo médio</span><p>n = ' + n + " é par: há " + (n + 1) + " termos (ímpar), então existe <b>um</b> termo do meio, o " + tex("T_{\\frac{n}{2}+1}=T_{" + (k + 1) + "}") + ", com k = " + k + ".</p></div>"; }
      else { var k1 = (n - 1) / 2; s += '<div class="st"><span class="pl">Termos médios</span><p>n = ' + n + " é ímpar: há " + (n + 1) + " termos (par), então existem <b>dois</b> termos do meio: " + tex("T_{" + (k1 + 1) + "}") + " e " + tex("T_{" + (k1 + 2) + "}") + " (k = " + k1 + " e k = " + (k1 + 1) + ").</p></div>";
        var t1 = mmul(mmul({ c: fr(bbinom(n, k1)), e: {} }, mpow(a, n - k1)), mpow(b, k1)), t2 = mmul(mmul({ c: fr(bbinom(n, k1 + 1)), e: {} }, mpow(a, n - k1 - 1)), mpow(b, k1 + 1));
        s += '<div class="final"><b>Respostas:</b> ' + tex("T_{" + (k1 + 1) + "}=" + mTex(t1)) + " e " + tex("T_{" + (k1 + 2) + "}=" + mTex(t2)) + "</div>";
        return { html: s, ok: true };
      }
    } else { // expoente m de v (m = 0: termo independente)
      var m = mode === "indep" ? 0 : val;
      var kc = function (c, first) { return c === 0 ? "" : (c === 1 ? (first ? "" : "+") : c === -1 ? "-" : (c > 0 && !first ? "+" : "") + c) + "k"; };
      var t1 = ea === 0 ? "" : (ea === 1 ? "" : ea === -1 ? "-" : ea + "\\,") + "(" + n + "-k)", t2 = eb === 0 ? "" : kc(eb, !t1);
      var lin = (ea * n !== 0 ? String(ea * n) : "") + kc(eb - ea, ea * n === 0);
      s += '<div class="st"><span class="pl">Expoente de ' + v + " em cada termo</span><p>" + tex(v) + " aparece com expoente " + ea + " em " + tex("a=" + A) + " e " + eb + " em " + tex("b=" + B) + ". No termo geral:</p><div class=\"m\">\\[\\text{expoente de }" + v + "=" + (t1 + t2 || "0") + (eb - ea !== 0 ? "=" + lin : "") + "\\]</div></div>";
      if (eb - ea === 0) { s += '<div class="alert bad">O expoente de ' + v + " não depende de k (vale " + ea * n + " em todos os termos).</div>"; return { html: s }; }
      var kk = (m - ea * n) / (eb - ea), num = m - ea * n, den = eb - ea; if (den < 0) { num = -num; den = -den; }
      s += '<div class="st"><span class="pl">Iguale ao expoente pedido (' + m + ")" + (mode === "indep" ? " · termo independente = sem " + v : "") + '</span><div class="m">\\[' + lin + "=" + m + "\\ \\Rightarrow\\ k=" + (den === 1 ? num : "\\frac{" + num + "}{" + den + "}") + (den === 1 ? "" : "=" + (Number.isInteger(kk) ? kk : tf(kk, 3))) + "\\]</div></div>";
      if (!Number.isInteger(kk) || kk < 0 || kk > n) { s += '<div class="final"><b>Conclusão:</b> k precisa ser inteiro entre 0 e ' + n + ". Como não é, <b>não existe</b> esse termo no desenvolvimento (o coeficiente de " + tex(v + "^{" + m + "}") + " é 0).</div>"; return { html: s, ok: true, none: true }; }
      k = kk;
    }
    var t = mmul(mmul({ c: fr(bbinom(n, k)), e: {} }, mpow(a, n - k)), mpow(b, k));
    s += '<div class="st"><span class="pl">Substitua k = ' + k + '</span><div class="m">\\[T_{' + (k + 1) + "}=\\binom{" + n + "}{" + k + "}\\cdot" + powTex(a, n - k) + "\\cdot" + powTex(b, k) + "=" + th(bbinom(n, k).toString()) + "\\cdot" + "\\left(" + mTex(mpow(a, n - k)) + "\\right)\\cdot\\left(" + mTex(mpow(b, k)) + "\\right)\\]</div></div>";
    var co = { c: t.c, e: {} };
    s += '<div class="final"><b>Resposta:</b> ' + tex("T_{" + (k + 1) + "}=" + mTex(t)) + (Object.keys(t.e).length ? " &nbsp;·&nbsp; coeficiente: " + tex(fTex(t.c)) : "") + "</div>";
    return { html: s, ok: true, k: k, term: t };
  }
  W.termHTML = termHTML;
  W.termoLab = function (h) {
    var bx = el("div", { class: "btns", style: "align-items:center" }); h.appendChild(bx);
    bx.appendChild(el("span", { style: "font-size:1.3rem;font-weight:800" }, "("));
    var ia = inp(bx, "tlA", "", "x^2", 70); bx.appendChild(el("span", { style: "font-weight:800" }, "+"));
    var ib = inp(bx, "tlB", "", "1/x", 70); bx.appendChild(el("span", { style: "font-size:1.3rem;font-weight:800" }, ")"));
    var iN = inp(bx, "tlN", "n =", "9", 50);
    var mode = "indep", c2 = el("div", { class: "btns", style: "align-items:center" }); h.appendChild(c2);
    seg(c2, [["indep", "Termo independente"], ["exp", "Termo em xᵐ"], ["ordem", "p-ésimo termo"], ["medio", "Termo(s) médio(s)"]], mode, function (v) { mode = v; iV.parentNode.style.display = v === "exp" || v === "ordem" ? "" : "none"; iV.previousSibling && 0; go(); });
    var iV = inp(c2, "tlV", "m ou p =", "3", 50); iV.parentNode.style.display = "none";
    var ex = el("div", { class: "btns" }); h.appendChild(ex);
    [["x^2", "1/x", 9, "indep"], ["2x", "-1/x", 6, "indep"], ["x", "2", 10, "exp", 7], ["x", "-3", 8, "ordem", 4], ["x^3", "-1/x^2", 10, "indep"], ["a", "b", 7, "medio"], ["x", "1/x", 7, "indep"]].forEach(function (p) {
      var b = el("button", { class: "btn s", type: "button" }, "(" + p[0] + (p[1][0] === "-" ? " − " + p[1].slice(1) : " + " + p[1]) + ")<sup>" + p[2] + "</sup> · " + { indep: "independente", exp: "x^" + p[4], ordem: p[4] + "º termo", medio: "médio(s)" }[p[3]]);
      b.onclick = function () { ia.value = p[0]; ib.value = p[1]; iN.value = p[2]; mode = p[3]; if (p[4] != null) iV.value = p[4]; [].forEach.call(c2.querySelector(".seg").children, function (x, i) { x.classList.toggle("on", ["indep", "exp", "ordem", "medio"][i] === mode); }); iV.parentNode.style.display = mode === "exp" || mode === "ordem" ? "" : "none"; go(); };
      ex.appendChild(b);
    });
    var out = el("div", { class: "steps" }); h.appendChild(out);
    function go() { out.innerHTML = termHTML(ia.value, ib.value, parseInt(iN.value, 10), mode, parseInt(iV.value, 10)).html; renderM(out); }
    [ia, ib, iN, iV].forEach(function (x) { x.addEventListener("input", go); }); go();
  };
  W.termoTreino = function (h) { // treino infinito: coeficiente/termo independente
    var box = el("div", { class: "card", style: "display:grid;gap:10px" }); h.appendChild(box);
    var q, tries = 0, okc = 0, tot = 0;
    function make() {
      var t = ri(0, 2), n, a, b, mode, val;
      if (t === 0) { n = ri(4, 8); a = "x"; b = String(rnd([1, 2, 3, -1, -2])); mode = "exp"; val = ri(1, n - 1); }
      else if (t === 1) { var P = rnd([["x", "1/x", [4, 6, 8]], ["x", "-1/x", [4, 6, 8]], ["x", "2/x", [2, 4, 6]], ["2x", "-1/x", [4, 6]], ["x^2", "1/x", [3, 6, 9]], ["x^2", "-1/x", [3, 6]], ["x^2", "2/x", [3, 6]], ["x", "1/x^2", [3, 6]], ["2x", "1/x^2", [3, 6]], ["x^3", "-1/x^2", [5, 10]], ["x^2", "-1/x^3", [5]]]); a = P[0]; b = P[1]; n = rnd(P[2]); mode = "indep"; }
      else { n = ri(5, 9); a = rnd(["x", "2x"]); b = String(rnd([1, -1, 2, -2, 3])); mode = "ordem"; val = ri(2, n); }
      var r = termHTML(a, b, n, mode, val);
      if (!r.ok || r.none) return make();
      var ans = r.term.c, prompt = mode === "exp" ? "Qual é o coeficiente de " + tex("x^{" + val + "}") + " em " + tex("\\left(" + mTex(parseMono(a)) + (b[0] === "-" ? "" : "+") + mTex(parseMono(b)) + "\\right)^{" + n + "}") + "?" : mode === "indep" ? "Qual é o termo independente de " + tex("x") + " em " + tex("\\left(" + mTex(parseMono(a)) + (b[0] === "-" ? "" : "+") + mTex(parseMono(b)) + "\\right)^{" + n + "}") + "?" : "Qual é o <b>coeficiente</b> do " + val + "º termo de " + tex("\\left(" + mTex(parseMono(a)) + (b[0] === "-" ? "" : "+") + mTex(parseMono(b)) + "\\right)^{" + n + "}") + "?";
      return { prompt: prompt, ans: ans, html: r.html };
    }
    function show() {
      q = make(); tries = 0;
      box.innerHTML = '<p style="font-weight:700">' + q.prompt + '</p><div class="btns" style="align-items:center"><input class="inp" id="ttIn" placeholder="ex.: 84 ou -15/2" style="width:160px" autocomplete="off"><button class="btn p s" type="button" id="ttOk">Conferir</button><button class="btn s" type="button" id="ttNew">Nova questão</button><span class="small muted">Acertos: ' + okc + "/" + tot + '</span></div><div id="ttFb"></div>';
      renderM(box);
      box.querySelector("#ttOk").onclick = check; box.querySelector("#ttNew").onclick = show;
      box.querySelector("#ttIn").onkeydown = function (e) { if (e.key === "Enter") check(); };
    }
    function check() {
      var v = box.querySelector("#ttIn").value.replace(/\s/g, "").replace(/[−–]/g, "-").replace(/\./g, ""), m = v.match(/^(-?\d+)(?:\/(\d+))?$/), fb = box.querySelector("#ttFb");
      if (!m) { fb.innerHTML = '<div class="alert bad">Digite um número inteiro ou uma fração (ex.: -15/2).</div>'; return; }
      var u = fr(m[1], m[2] || 1), ok = u.n === q.ans.n && u.d === q.ans.d; tries++;
      if (ok) { if (tries === 1) { okc++; T_().addXP(2, "treino de termo geral"); } tot++; T_().beep("ok"); fb.innerHTML = '<div class="alert ok">Certo! ' + tex(fTex(q.ans)) + '. <button class="btn s" type="button" id="ttSol">Ver resolução</button></div>'; }
      else { T_().beep("bad"); if (tries === 1) tot++; fb.innerHTML = '<div class="alert bad">Ainda não. ' + (tries >= 2 ? "Veja a resolução:" : "Tente de novo (dica: escreva o termo geral e iguale o expoente).") + "</div>" + (tries >= 2 ? '<div class="steps">' + q.html + "</div>" : ""); }
      var bs = fb.querySelector("#ttSol"); if (bs) bs.onclick = function () { fb.insertAdjacentHTML("beforeend", '<div class="steps">' + q.html + "</div>"); bs.remove(); renderM(fb); };
      renderM(fb);
    }
    show();
  };

  // =================================================================== MÓDULO 7 · SOMAS E MÁXIMO
  W.somaLab = function (h) {
    var bx = el("div", { class: "btns", style: "align-items:center" }); h.appendChild(bx);
    bx.appendChild(el("span", { style: "font-size:1.3rem;font-weight:800" }, "("));
    var ia = inp(bx, "smA", "", "2x", 70); bx.appendChild(el("span", { style: "font-weight:800" }, "+"));
    var ib = inp(bx, "smB", "", "-1", 70); bx.appendChild(el("span", { style: "font-size:1.3rem;font-weight:800" }, ")"));
    var iN = inp(bx, "smN", "n =", "5", 50);
    var out = el("div", { class: "steps" }); h.appendChild(out);
    function go() {
      var a = parseMono(ia.value), b = parseMono(ib.value), n = parseInt(iN.value, 10);
      if (!a || !b || !(n >= 0 && n <= 12)) { out.innerHTML = '<div class="alert bad">Use termos como 2x, -1, x^2, 1/x e n de 0 a 12.</div>'; return; }
      var col = collect(expand(a, b, n).map(function (o) { return o.t; })), sum = fr(0), alt = fr(0);
      col.forEach(function (t) { sum = fadd(sum, t.c); var deg = Object.keys(t.e).reduce(function (s, k) { return s + t.e[k]; }, 0); alt = fadd(alt, fmul(t.c, fr(Math.abs(deg) % 2 ? -1 : 1))); });
      var a1 = a.c, b1 = b.c, s1 = fadd(a1, b1);
      var s = '<div class="st"><span class="pl">Desenvolvimento (para conferir)</span><div class="m">\\[' + polyTex(col) + "\\]</div></div>";
      s += '<div class="st"><span class="pl">Soma dos coeficientes, somando um por um</span><div class="m">\\[' + col.map(function (t) { return fTex(t.c, true); }).join("+").replace(/\+\(-/g, "+(-") + "=" + fTex(sum) + "\\]</div></div>";
      s += '<div class="st"><span class="pl">Atalho: troque cada letra por 1</span><div class="m">\\[\\left(' + fTex(a1) + (b1.n < 0n ? "" : "+") + fTex(b1) + "\\right)^{" + n + "}=\\left(" + fTex(s1) + "\\right)^{" + n + "}=" + fTex(fpow(s1, n)) + "\\]</div><p class=\"small muted\">Mesmo resultado, sem desenvolver nada.</p></div>";
      out.innerHTML = s; renderM(out);
    }
    [ia, ib, iN].forEach(function (x) { x.addEventListener("input", go); }); go();
  };
  W.maxLab = function (h) { // barras dos coeficientes de (p + q x)^n
    var c = ctrls(h), iN = slider(c, "mxN", "n", 1, 20, 1, 10), iP = slider(c, "mxP", "p (de p + q·x)", 1, 5, 1, 1), iQ = slider(c, "mxQ", "q", 1, 5, 1, 1);
    var S = scene(h, "0 0 560 250"), out = rows(h, [["m", "Maior coeficiente"], ["r", "Razão entre vizinhos"]]);
    function draw() {
      var n = +iN.value, p = +iP.value, q = +iQ.value, co = [], best = 0;
      for (var k = 0; k <= n; k++) { co.push(Number(bbinom(n, k)) * Math.pow(p, n - k) * Math.pow(q, k)); if (co[k] > co[best]) best = k; }
      var mx = co[best], s = "", W0 = 500 / (n + 1);
      co.forEach(function (v, k) { var hh = 190 * v / mx; s += R(40 + k * W0 + W0 * .12, 210 - hh, W0 * .76, hh, "fill:" + (k === best || co[k] === mx ? "var(--pri)" : CA) + ";fill-opacity:" + (co[k] === mx ? 1 : .45), 3) + Tx(40 + k * W0 + W0 / 2, 224, k, "font-size:" + Math.min(12, W0 * .5) + "px;fill:var(--muted)"); });
      s += Tx(40, 244, "k (o termo é T_{k+1}, com xᵏ)", "font-size:11px;fill:var(--muted)", "start");
      S.innerHTML = s;
      var ties = co.map(function (v, k) { return v === mx ? k : -1; }).filter(function (k) { return k >= 0; });
      out.m.innerHTML = ties.map(function (k) { return tex("T_{" + (k + 1) + "}") + " (k = " + k + ", coeficiente " + th(co[k]) + ")"; }).join(" e ");
      out.r.innerHTML = tex("\\frac{c_{k+1}}{c_k}=\\frac{" + n + "-k}{k+1}\\cdot\\frac{" + q + "}{" + p + "}") + ": os coeficientes crescem enquanto essa razão é maior que 1.";
      renderM(out.r);
    }
    [iN, iP, iQ].forEach(function (x) { x.addEventListener("input", draw); }); draw();
  };

  // =================================================================== MÓDULO 8 · APLICAÇÕES
  W.aproxLab = function (h) {
    var c = ctrls(h), iX = slider(c, "apX", "x", -0.3, 0.3, 0.01, 0.02, function (v) { return fmt(v, 2); }), iN = slider(c, "apN", "n", 2, 30, 1, 10);
    var out = rows(h, [["e", "Valor exato (calculadora)"], ["a1", "1 + nx (2 termos)"], ["a2", "+ C(n,2)x² (3 termos)"], ["a3", "+ C(n,3)x³ (4 termos)"]]);
    function draw() {
      var x = +iX.value, n = +iN.value, ex = Math.pow(1 + x, n), t1 = 1 + n * x, t2 = t1 + binom(n, 2) * x * x, t3 = t2 + binom(n, 3) * x * x * x;
      function er(v) { return ' <span class="small muted">(erro ' + fmt(Math.abs(v - ex), 6) + ")</span>"; }
      out.e.innerHTML = tex("(1" + (x < 0 ? "" : "+") + tf(x, 2) + ")^{" + n + "}=" + tf(ex, 6));
      out.a1.innerHTML = tex("1+" + n + "\\cdot" + (x < 0 ? "(" + tf(x, 2) + ")" : tf(x, 2)) + "=" + tf(t1, 6)) + er(t1);
      out.a2.innerHTML = tex(tf(t2, 6)) + er(t2); out.a3.innerHTML = tex(tf(t3, 6)) + er(t3);
    }
    iX.addEventListener("input", draw); iN.addEventListener("input", draw); draw();
  };
  W.restoLab = function (h) {
    var bx = el("div", { class: "btns", style: "align-items:center" }); h.appendChild(bx);
    var iA = inp(bx, "rsA", "Resto de", "11", 60), iN = inp(bx, "rsN", "elevado a", "40", 60), iM = inp(bx, "rsM", "dividido por", "10", 60);
    var ex = el("div", { class: "btns" }); h.appendChild(ex);
    [[11, 40, 10], [2, 100, 3], [9, 50, 8], [7, 20, 6], [3, 99, 4], [101, 10, 100]].forEach(function (p) { var b = el("button", { class: "btn s", type: "button" }, p[0] + "<sup>" + p[1] + "</sup> ÷ " + p[2]); b.onclick = function () { iA.value = p[0]; iN.value = p[1]; iM.value = p[2]; go(); }; ex.appendChild(b); });
    var out = el("div", { class: "steps" }); h.appendChild(out);
    function go() {
      var a = parseInt(iA.value, 10), n = parseInt(iN.value, 10), m = parseInt(iM.value, 10);
      if (!(a > 0 && n > 0 && m > 1 && a < 10000 && n <= 500 && m < 10000)) { out.innerHTML = '<div class="alert bad">Use números positivos (a até 9999, n até 500, divisor de 2 a 9999).</div>'; return; }
      var r = a % m, rr = r > m / 2 ? r - m : r, q = (a - rr) / m, s = "";
      s += '<div class="st"><span class="pl">Passo 1 · escreva a base perto de um múltiplo de ' + m + '</span><div class="m">\\[' + a + "=" + m + "\\cdot" + q + (rr < 0 ? "" : "+") + rr + "\\]</div></div>";
      s += '<div class="st"><span class="pl">Passo 2 · desenvolva pelo binômio</span><div class="m">\\[' + a + "^{" + n + "}=(" + m * q + (rr < 0 ? "" : "+") + rr + ")^{" + n + "}=\\underbrace{\\binom{" + n + "}{0}(" + m * q + ")^{" + n + "}+\\cdots+\\binom{" + n + "}{" + (n - 1) + "}(" + m * q + ")(" + rr + ")^{" + (n - 1) + "}}_{\\text{todos têm o fator }" + m + "}+(" + rr + ")^{" + n + "}\\]</div><p class=\"small\">Todos os termos, menos o último, têm " + tex(m * q === m ? m : m + "\\cdot" + q) + " como fator: são múltiplos de " + m + ".</p></div>";
      var big = BigInt(rr) ** BigInt(n), mod = ((big % BigInt(m)) + BigInt(m)) % BigInt(m);
      var last = Math.abs(rr) <= 1 ? (rr === 0 ? "0" : rr === 1 ? "1" : (n % 2 ? "-1" : "1")) : null;
      s += '<div class="st"><span class="pl">Passo 3 · sobra só o último termo</span><div class="m">\\[' + a + "^{" + n + "}=(\\text{múltiplo de }" + m + ")+(" + rr + ")^{" + n + "}" + (last ? "=(\\text{múltiplo de }" + m + ")" + (last[0] === "-" ? "" : "+") + last : "") + "\\]</div>" + (last === "-1" ? "<p class=\"small\">Resto não pode ser negativo: " + tex("-1=-" + m + "+" + (m - 1)) + ", então o resto é " + (m - 1) + ".</p>" : Math.abs(rr) > 1 ? "<p class=\"small\">Aqui o último termo ainda é grande; calcule o resto de " + tex("(" + rr + ")^{" + n + "}") + " por " + m + " (pode repetir o truque).</p>" : "") + "</div>";
      s += '<div class="final"><b>Resto:</b> ' + mod + '<span class="small muted"> (conferido pelo computador: ' + a + "<sup>" + n + "</sup> mod " + m + " = " + (BigInt(a) ** BigInt(n) % BigInt(m)) + ")</span></div>";
      out.innerHTML = s; renderM(out);
    }
    [iA, iN, iM].forEach(function (x) { x.addEventListener("input", go); }); go();
  };
  W.probLab = function (h) {
    var c = ctrls(h), iN = slider(c, "pbN", "n (tentativas)", 1, 20, 1, 10), iP = slider(c, "pbP", "p (chance de sucesso)", 0.05, 0.95, 0.05, 0.5, function (v) { return fmt(v, 2); }), iK = slider(c, "pbK", "k (sucessos)", 0, 20, 1, 5);
    var S = scene(h, "0 0 560 230"), out = rows(h, [["f", "Fórmula"], ["s", "Soma de tudo"]]);
    function draw() {
      var n = +iN.value, p = +iP.value, q = 1 - p; clampTo(iK, n); var k = +iK.value;
      var P = [], mx = 0; for (var j = 0; j <= n; j++) { P.push(binom(n, j) * Math.pow(p, j) * Math.pow(q, n - j)); mx = Math.max(mx, P[j]); }
      var s = "", W0 = 500 / (n + 1);
      P.forEach(function (v, j) { var hh = 180 * v / mx; s += R(40 + j * W0 + W0 * .12, 200 - hh, W0 * .76, hh, "fill:" + (j === k ? "var(--pri)" : CA) + ";fill-opacity:" + (j === k ? 1 : .45), 3) + Tx(40 + j * W0 + W0 / 2, 214, j, "font-size:" + Math.min(12, W0 * .5) + "px;fill:var(--muted)"); });
      s += Tx(40 + k * W0 + W0 / 2, 200 - 180 * P[k] / mx - 12, fmt(100 * P[k], 2) + "%", "font-size:12px;fill:var(--pri)");
      S.innerHTML = s;
      out.f.innerHTML = tex("P(X=" + k + ")=\\binom{" + n + "}{" + k + "}\\cdot" + tf(p, 2) + "^{" + k + "}\\cdot" + tf(q, 2) + "^{" + (n - k) + "}=" + binom(n, k) + "\\cdot" + tf(Math.pow(p, k), 5) + "\\cdot" + tf(Math.pow(q, n - k), 5) + "\\approx" + tf(P[k], 4));
      out.s.innerHTML = tex("\\sum_{k=0}^{" + n + "}P(X=k)=(p+q)^{" + n + "}=1^{" + n + "}=1") + ' <span class="small muted">— é o binômio de Newton!</span>';
    }
    [iN, iP, iK].forEach(function (x) { x.addEventListener("input", draw); }); draw();
  };

  // =================================================================== MÓDULO 9 · AVANÇADO
  W.multinomLab = function (h) {
    var c = ctrls(h), iN = slider(c, "mnN", "n", 1, 8, 1, 4), iI = slider(c, "mnI", "expoente de a (i)", 0, 8, 1, 2), iJ = slider(c, "mnJ", "expoente de b (j)", 0, 8, 1, 1);
    var out = el("div", { class: "steps" }); h.appendChild(out);
    function draw() {
      var n = +iN.value; clampTo(iI, n); var i = +iI.value; clampTo(iJ, n - i); var j = +iJ.value, l = n - i - j;
      var co = fact(n) / (fact(i) * fact(j) * fact(l)), s = "";
      s += '<div class="st"><span class="pl">Termo procurado</span><p>Em ' + tex("(a+b+c)^{" + n + "}") + ", o termo " + tex("a^{" + i + "}b^{" + j + "}c^{" + l + "}") + " (os expoentes somam " + n + ").</p></div>";
      s += '<div class="st"><span class="pl">Coeficiente multinomial</span><div class="m">\\[\\frac{' + n + "!}{" + i + "!\\," + j + "!\\," + l + "!}=\\frac{" + th(fact(n).toString()) + "}{" + fact(i) + "\\cdot" + fact(j) + "\\cdot" + fact(l) + "}=" + th(co.toString()) + "\\]</div></div>";
      s += '<div class="st"><span class="pl">Mesmo valor por binômios em sequência</span><div class="m">\\[\\binom{' + n + "}{" + i + "}\\binom{" + (n - i) + "}{" + j + "}=" + binom(n, i) + "\\cdot" + binom(n - i, j) + "=" + binom(n, i) * binom(n - i, j) + "\\]</div><p class=\"small muted\">Escolha quais " + i + " fatores dão a; dos " + (n - i) + " restantes, quais " + j + " dão b; o resto dá c.</p></div>";
      s += '<div class="final">' + tex("(a+b+c)^{" + n + "}") + " tem " + tex("\\binom{" + (n + 2) + "}{2}=" + binom(n + 2, 2)) + " termos diferentes e a soma dos coeficientes é " + tex("3^{" + n + "}=" + Math.pow(3, n)) + ".</div>";
      out.innerHTML = s; renderM(out);
    }
    [iN, iI, iJ].forEach(function (x) { x.addEventListener("input", draw); }); draw();
  };
  W.serieLab = function (h) { // binômio generalizado
    var c = ctrls(h), iA = slider(c, "srA", "expoente α", -3, 3, 0.5, 0.5, function (v) { return fmt(v, 1); }), iX = slider(c, "srX", "x", -0.9, 0.9, 0.05, 0.2, function (v) { return fmt(v, 2); }), iT = slider(c, "srT", "termos somados", 1, 12, 1, 4);
    var S = scene(h, "0 0 560 220"), out = rows(h, [["c", "Coeficientes"], ["v", "Comparação"]]);
    function gb(al, k) { var r = 1; for (var i = 0; i < k; i++) r = r * (al - i) / (i + 1); return r; }
    function draw() {
      var al = +iA.value, x = +iX.value, T = +iT.value, sum = 0, parts = [], ex = Math.pow(1 + x, al), s = "";
      for (var k = 0; k < T; k++) { sum += gb(al, k) * Math.pow(x, k); parts.push(sum); }
      var lo = Math.min.apply(null, parts.concat([ex])), hi = Math.max.apply(null, parts.concat([ex])), pad = (hi - lo) * 0.15 || 0.5; lo -= pad; hi += pad;
      function Y(v) { return 190 - 170 * (v - lo) / (hi - lo); }
      s += L([40, Y(ex)], [540, Y(ex)], "stroke:" + CB + ";stroke-width:2;stroke-dasharray:6 4") + Tx(540, Y(ex) - 10, "valor exato " + fmt(ex, 5), "font-size:12px;fill:" + CB, "end");
      var pts = parts.map(function (v, k) { return [60 + k * 470 / Math.max(1, 11), Y(v)]; });
      if (pts.length > 1) s += '<path d="M' + pts.map(function (p) { return f1(p[0]) + " " + f1(p[1]); }).join(" L") + '" style="fill:none;stroke:var(--pri);stroke-width:2"/>';
      pts.forEach(function (p, k) { s += Ci(p[0], p[1], 4.5, "fill:var(--pri)") + Tx(p[0], 208, k + 1, "font-size:11px;fill:var(--muted)"); });
      S.innerHTML = s;
      var co = []; for (var k2 = 0; k2 < Math.min(T, 6); k2++) co.push(tf(gb(al, k2), 4) + (k2 ? "x" + (k2 > 1 ? "^{" + k2 + "}" : "") : ""));
      out.c.innerHTML = tex("(1+x)^{" + tf(al, 1) + "}=" + co.join("+").replace(/\+-/g, "-") + (T > 6 || !Number.isInteger(al) || al < 0 ? "+\\cdots" : ""));
      out.v.innerHTML = "Soma com " + T + " termo" + (T > 1 ? "s" : "") + ": " + fmt(sum, 6) + " · exato: " + fmt(ex, 6) + (Number.isInteger(al) && al >= 0 ? ' <span class="small muted">(α natural: a série termina, é o binômio comum)</span>' : "");
    }
    [iA, iX, iT].forEach(function (x) { x.addEventListener("input", draw); }); draw();
  };

  // =================================================================== JOGOS
  W.games = function (host) {
    if (!host) return;
    var T = window.T, S = T.S, g = "pascal";
    seg(host, [["pascal", "Pascal Relâmpago"], ["fat", "Fatorial Turbo"], ["comb", "Combinação Rápida"], ["coef", "Coeficiente Certo"]], g, function (v) { g = v; setup(); });
    var box = el("div", { class: "card game" }); host.appendChild(box);
    var timer = 0, left = 0, score = 0, running = false;
    var DESC = { pascal: "Aparece uma linha do Triângulo de Pascal com um buraco. Escolha o número que falta.", fat: "Simplifique frações com fatorial, como 9!/7!.", comb: "Calcule números binomiais, como C(6,2).", coef: "Ache o coeficiente pedido no desenvolvimento do binômio." };
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
    function options(right, wrongs, render) {
      var op = [right]; wrongs.forEach(function (w) { if (op.length < 4 && op.indexOf(w) < 0 && w > 0) op.push(w); });
      var guard = 1; while (op.length < 4) { var w2 = right + guard * (guard % 2 ? 1 : -1) * Math.max(1, Math.round(right * 0.1)); if (op.indexOf(w2) < 0 && w2 > 0) op.push(w2); guard++; }
      shuffle(op);
      var A = box.querySelector("#gA"); A.innerHTML = '<div class="grid" style="grid-template-columns:1fr 1fr;max-width:420px;margin:0 auto"></div>';
      op.forEach(function (o) { var b = el("button", { class: "btn", type: "button", style: "font-size:1.15rem" }, render ? render(o) : th(o)); b.onclick = function () { var ok = o === right; hit(ok); b.classList.add(ok ? "p" : "wrong"); [].forEach.call(A.firstChild.children, function (x) { x.disabled = true; }); setTimeout(next, ok ? 300 : 900); }; A.firstChild.appendChild(b); });
    }
    function next() {
      if (!running) return;
      var Q = box.querySelector("#gQ");
      if (g === "pascal") {
        var n = ri(3, 10), k = ri(1, n - 1), row = []; for (var i = 0; i <= n; i++) row.push(i === k ? '<b style="color:var(--pri)">?</b>' : binom(n, i));
        Q.innerHTML = '<span class="small muted">linha ' + n + "</span><br>" + row.join(" &nbsp; ");
        var r = binom(n, k); options(r, [binom(n - 1, k), binom(n + 1, k), r + n, Math.max(1, r - n), binom(n, k - 1) === r ? r + 1 : binom(n, k - 1)]);
      } else if (g === "fat") {
        var a = ri(4, 12), d = ri(1, 3), b = a - d, v = 1; for (var j = 0; j < d; j++) v *= a - j;
        Q.innerHTML = tex("\\dfrac{" + a + "!}{" + b + "!}");
        options(v, [a * d, v * b, Number(fact(d)) * a, v / a * (a + 1), a + b]);
      } else if (g === "comb") {
        var n2 = ri(4, 12), k2 = ri(1, Math.min(4, n2 - 1)), r2 = binom(n2, k2);
        Q.innerHTML = tex("\\dbinom{" + n2 + "}{" + k2 + "}");
        var arr = 1; for (var j2 = 0; j2 < k2; j2++) arr *= n2 - j2;
        options(r2, [arr, n2 * k2, binom(n2, k2 + 1), binom(n2 - 1, k2), r2 * 2]);
      } else {
        var n3 = ri(3, 7), c3 = rnd([1, 2, 3, -1, -2]), k3 = ri(1, n3 - 1), co = binom(n3, k3) * Math.pow(c3, n3 - k3);
        Q.innerHTML = '<span class="small muted">coeficiente de ' + tex("x^{" + k3 + "}") + " em</span><br>" + tex("(x" + (c3 < 0 ? "" : "+") + c3 + ")^{" + n3 + "}");
        var right = co, wr = [binom(n3, k3) * Math.pow(c3, k3), binom(n3, k3), -co, binom(n3, k3) * c3, binom(n3, k3 - 1) * Math.pow(c3, n3 - k3 + 1)];
        var op = [right]; wr.forEach(function (w) { if (op.length < 4 && op.indexOf(w) < 0) op.push(w); }); var gi = 1; while (op.length < 4) { if (op.indexOf(right + gi) < 0) op.push(right + gi); gi++; }
        shuffle(op);
        var A = box.querySelector("#gA"); A.innerHTML = '<div class="grid" style="grid-template-columns:1fr 1fr;max-width:420px;margin:0 auto"></div>';
        op.forEach(function (o) { var bt = el("button", { class: "btn", type: "button", style: "font-size:1.15rem" }, (o < 0 ? "−" : "") + th(Math.abs(o))); bt.onclick = function () { var ok = o === right; hit(ok); bt.classList.add(ok ? "p" : "wrong"); [].forEach.call(A.firstChild.children, function (x) { x.disabled = true; }); setTimeout(next, ok ? 300 : 900); }; A.firstChild.appendChild(bt); });
      }
    }
    setup();
  };
})();
