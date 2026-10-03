/* Laboratórios, animações, figuras e jogos da apostila de Teoria dos Conjuntos. */
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



  // =================================================================== CONJUNTOS: núcleo
  var VG2 = { A: [105, 105, 62], B: [175, 105, 62] }, VG3 = { A: [140, 82, 56], B: [108, 136, 56], C: [172, 136, 56] };
  var VPOS2 = { "10": [75, 105], "11": [140, 105], "01": [205, 105], "00": [140, 192] };
  var VPOS3 = { "100": [140, 52], "110": [108, 98], "101": [172, 98], "111": [140, 118], "010": [86, 160], "001": [194, 160], "011": [140, 168], "000": [36, 30] };
  var vid = 0;
  function vennSVG(f, names, opt) {
    opt = opt || {}; vid++; var p = "vv" + vid, Wd = 280, Hh = 210, geo = names.length === 2 ? VG2 : VG3, defs = "", shapes = "";
    names.forEach(function (n) { var g = geo[n]; defs += '<clipPath id="' + p + "c" + n + '"><circle cx="' + g[0] + '" cy="' + g[1] + '" r="' + g[2] + '"/></clipPath>'; });
    var combos = names.length === 2 ? ["00", "01", "10", "11"] : ["000", "001", "010", "011", "100", "101", "110", "111"];
    combos.forEach(function (bits) {
      var env = {}; names.forEach(function (n, i) { env[n] = bits[i] === "1"; }); if (!f(env)) return;
      var mid = p + "m" + bits, m = '<mask id="' + mid + '"><rect x="0" y="0" width="' + Wd + '" height="' + Hh + '" fill="#fff"/>';
      names.forEach(function (n, i) { if (bits[i] === "0") { var g = geo[n]; m += '<circle cx="' + g[0] + '" cy="' + g[1] + '" r="' + g[2] + '" fill="#000"/>'; } });
      defs += m + "</mask>";
      var inner = '<rect class="vreg" x="4" y="4" width="' + (Wd - 8) + '" height="' + (Hh - 8) + '" mask="url(#' + mid + ')"/>';
      names.forEach(function (n, i) { if (bits[i] === "1") inner = '<g clip-path="url(#' + p + "c" + n + ')">' + inner + "</g>"; });
      shapes += inner;
    });
    var s = '<svg viewBox="0 0 ' + Wd + " " + Hh + '" role="img" aria-label="diagrama de Venn"><defs>' + defs + '</defs><rect x="4" y="4" width="' + (Wd - 8) + '" height="' + (Hh - 8) + '" rx="6" fill="none" stroke="var(--muted)" stroke-width="1.2"/>' + shapes;
    names.forEach(function (n) { var g = geo[n]; s += '<circle cx="' + g[0] + '" cy="' + g[1] + '" r="' + g[2] + '" fill="none" stroke="var(--ink)" stroke-width="1.8"/>'; });
    var lab = names.length === 2 ? { A: [60, 34], B: [220, 34] } : { A: [140, 16], B: [44, 196], C: [236, 196] };
    names.forEach(function (n) { s += '<text x="' + lab[n][0] + '" y="' + lab[n][1] + '" font-size="15" font-weight="700" text-anchor="middle" fill="var(--ink)">' + n + "</text>"; });
    s += '<text x="' + (Wd - 14) + '" y="22" font-size="13" font-weight="700" text-anchor="end" fill="var(--muted)">U</text>';
    if (opt.els) { var pos = names.length === 2 ? VPOS2 : VPOS3; Object.keys(opt.els).forEach(function (b) { var L0 = opt.els[b]; if (!L0.length) return; var xy = pos[b], txt = L0.join(", "); if (txt.length > 14) { var half = Math.ceil(L0.length / 2); txt = [L0.slice(0, half).join(", "), L0.slice(half).join(", ")]; } else txt = [txt]; txt.forEach(function (t, i) { s += '<text x="' + xy[0] + '" y="' + (xy[1] + i * 14 - (txt.length - 1) * 7) + '" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--ink)" style="paint-order:stroke;stroke:var(--card);stroke-width:3px">' + esc(t) + "</text>"; }); }); }
    if (opt.title) s += '<text x="' + Wd / 2 + '" y="' + (Hh - 8) + '" font-size="12.5" text-anchor="middle" fill="var(--ink)">' + esc(opt.title) + "</text>";
    return s + "</svg>";
  }
  W.vennSVG = vennSVG;
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function parseSet(t) { t = String(t).replace(/[{}]/g, "").trim(); if (!t || t === "∅") return []; var out = []; t.split(/[,;]+/).map(function (x) { return x.trim(); }).filter(Boolean).forEach(function (x) { if (out.indexOf(x) < 0) out.push(x); }); return out; }
  function sortEls(a) { return a.slice().sort(function (x, y) { var nx = +x, ny = +y; if (!isNaN(nx) && !isNaN(ny)) return nx - ny; return String(x).localeCompare(String(y)); }); }
  function setTex(a) { a = sortEls(a); return a.length ? "\\{" + a.map(function (x) { return String(x).replace(/-/g, "−"); }).join(",\\ ") + "\\}" : "\\varnothing"; }
  function sUni(a, b) { var r = a.slice(); b.forEach(function (x) { if (r.indexOf(x) < 0) r.push(x); }); return r; }
  function sInt(a, b) { return a.filter(function (x) { return b.indexOf(x) >= 0; }); }
  function sDif(a, b) { return a.filter(function (x) { return b.indexOf(x) < 0; }); }
  // ----- parser de expressões de conjuntos
  // gramática: expr := term ((∪|−|Δ) term)* ; term := fac (∩ fac)* ; fac := atom ('|ᶜ)* ; atom := A|B|C|U|∅|(expr)
  function parseExpr(src) {
    var s = String(src).replace(/\s+/g, "").replace(/[uU](?![A-Za-z])/g, function (m, i) { return m; });
    s = s.replace(/\\cup|∪|\+|\|/g, "∪").replace(/\\cap|∩|\*|\^|&/g, "∩").replace(/[−–-]/g, "−").replace(/Δ|\\Delta|Δ/g, "Δ").replace(/[’′ᶜ]/g, "'").replace(/\\varnothing|Ø|ø/g, "∅");
    var i = 0;
    function peek() { return s[i]; }
    function atom() {
      var c = s[i];
      if (c === "(") { i++; var e = expr(); if (s[i] !== ")") throw "falta “)”"; i++; return e; }
      if (/[ABCU∅]/.test(c)) { i++; return { t: "v", n: c }; }
      throw "símbolo inesperado: “" + (c || "fim") + "”";
    }
    function fac() { var a = atom(); while (s[i] === "'") { i++; a = { t: "c", a: a }; } return a; }
    function term() { var a = fac(); while (s[i] === "∩") { i++; a = { t: "∩", a: a, b: fac() }; } return a; }
    function expr() { var a = term(); while (s[i] === "∪" || s[i] === "−" || s[i] === "Δ") { var op = s[i++]; a = { t: op, a: a, b: term() }; } return a; }
    var e = expr(); if (i < s.length) throw "sobrou “" + s.slice(i) + "”"; return e;
  }
  function eTex(e, top) {
    if (e.t === "v") return e.n === "∅" ? "\\varnothing" : e.n;
    if (e.t === "c") { var inner = eTex(e.a, true); return e.a.t === "v" ? "\\overline{" + inner + "}" : "\\overline{" + inner + "}"; }
    var op = { "∪": "\\cup ", "∩": "\\cap ", "−": "-", "Δ": "\\,\\Delta\\," }[e.t], r = eTex(e.a) + op + eTex(e.b);
    return top ? r : "(" + r + ")";
  }
  function eBool(e, env) {
    if (e.t === "v") return e.n === "U" ? true : e.n === "∅" ? false : !!env[e.n];
    if (e.t === "c") return !eBool(e.a, env);
    var a = eBool(e.a, env), b = eBool(e.b, env);
    return e.t === "∪" ? a || b : e.t === "∩" ? a && b : e.t === "−" ? a && !b : a !== b;
  }
  function eUsed(e, acc) { acc = acc || {}; if (e.t === "v") { if ("ABC".indexOf(e.n) >= 0) acc[e.n] = 1; } else { eUsed(e.a, acc); if (e.b) eUsed(e.b, acc); } return acc; }
  function eSets(e, S0, steps) { // avaliação com passos
    if (e.t === "v") return e.n === "U" ? S0.U : e.n === "∅" ? [] : S0[e.n];
    if (e.t === "c") { var a = eSets(e.a, S0, steps), r = sDif(S0.U, a); steps.push([eTex(e, true), "U-" + setTex(a), r]); return r; }
    var x = eSets(e.a, S0, steps), y = eSets(e.b, S0, steps), res = e.t === "∪" ? sUni(x, y) : e.t === "∩" ? sInt(x, y) : e.t === "−" ? sDif(x, y) : sUni(sDif(x, y), sDif(y, x));
    steps.push([eTex(e, true), setTex(x) + { "∪": "\\cup ", "∩": "\\cap ", "−": "-", "Δ": "\\,\\Delta\\," }[e.t] + setTex(y), res]);
    return res;
  }
  W.parseExpr = parseExpr; W.eBool = eBool;

  // =================================================================== LAB: calculadora de Venn
  W.setLab = function (h, o) {
    o = o || {};
    var box = el("div", { class: "grid g2", style: "align-items:start" }); h.appendChild(box);
    var left = el("div", { style: "display:grid;gap:6px" }), right = el("div", { class: "venn" }); box.appendChild(left); box.appendChild(right);
    function field(lbl, val) { var w = el("label", { class: "small", style: "display:grid;grid-template-columns:34px 1fr;gap:6px;align-items:center;font-weight:700" }, lbl + ' <input class="inp setin" value="' + esc(val) + '">'); left.appendChild(w); return w.querySelector("input"); }
    var iU = field("U =", o.U || "1, 2, 3, 4, 5, 6, 7"), iA = field("A =", o.A || "1, 2, 3, 4, 5"), iB = field("B =", o.B || "1, 3, 5, 7"), iC = field("C =", o.C != null ? o.C : "2, 5, 6, 7");
    var ie = el("input", { class: "inp setin", value: o.e || "(A − B) ∪ C'", "aria-label": "Expressão", style: "width:100%" });
    left.appendChild(el("p", { class: "small muted", style: "margin:4px 0 0" }, "Expressão (use os botões ou digite: + para ∪, * para ∩, - para −, ' para complementar):")); left.appendChild(ie);
    var kb = el("div", { class: "btns" }); left.appendChild(kb);
    ["A", "B", "C", "U", "∅", "∪", "∩", "−", "Δ", "'", "(", ")", "⌫"].forEach(function (k) { var b = el("button", { class: "btn s", type: "button", style: "min-width:38px" }, k); b.onclick = function () { if (k === "⌫") ie.value = ie.value.replace(/\s*\S\s*$/, ""); else ie.value += (/[∪∩−Δ]/.test(k) ? " " + k + " " : k); go(); }; kb.appendChild(b); });
    var pres = el("div", { class: "btns" }); left.appendChild(pres);
    [["Questão 8 (g)", "1,2,3,4,5,6,7", "1,2,3,4,5", "1,3,5,7", "2,5,6,7", "(A − C)'"], ["De Morgan", "1,2,3,4,5,6,7,8", "1,2,3,4", "3,4,5,6", "", "(A ∪ B)'"], ["Diferença simétrica", "a,b,c,d,e,f,g,h,i,j,l,m", "a,b,c,e,f,i,j", "c,e,h,l,m", "", "A Δ B"], ["Questão 14", "a,b,c,d,e,f,g,h,k,l", "a,b,c,e,f", "a,b,d,g,h", "b,c,d,k,l", "((A − B) − C) ∪ (C − (A ∪ B)) ∪ (B ∩ A')"]].forEach(function (p) {
      var b = el("button", { class: "btn s", type: "button" }, p[0]); b.onclick = function () { iU.value = p[1]; iA.value = p[2]; iB.value = p[3]; iC.value = p[4]; ie.value = p[5]; go(); }; pres.appendChild(b); });
    var out = el("div", { class: "steps" }); h.appendChild(out);
    function go() {
      var U = parseSet(iU.value), S0 = { U: U, A: parseSet(iA.value), B: parseSet(iB.value), C: parseSet(iC.value) }, e;
      var bad = ["A", "B", "C"].filter(function (k) { return S0[k].some(function (x) { return U.indexOf(x) < 0; }); });
      if (bad.length) { out.innerHTML = '<div class="alert bad">' + bad.join(", ") + " tem elemento fora de U. Coloque todos os elementos no universo.</div>"; return; }
      try { e = parseExpr(ie.value); } catch (er) { out.innerHTML = '<div class="alert bad">Expressão inválida: ' + esc(er) + "</div>"; right.innerHTML = ""; return; }
      var used = eUsed(e), names = (S0.C.length || used.C) ? ["A", "B", "C"] : ["A", "B"];
      var els = {}; U.forEach(function (x) { var b = names.map(function (n) { return S0[n].indexOf(x) >= 0 ? "1" : "0"; }).join(""); (els[b] = els[b] || []).push(x); });
      right.innerHTML = vennSVG(function (env) { return eBool(e, env); }, names, { els: els });
      var steps = [], res = eSets(e, S0, steps);
      out.innerHTML = '<div class="st"><span class="pl">Expressão</span><div class="m">\\[' + eTex(e, true) + "\\]</div><p>Calculamos de dentro para fora (primeiro os parênteses e os complementares):</p></div>" +
        steps.map(function (s2, k) { return '<div class="st"><span class="pl">Passo ' + (k + 1) + '</span><div class="m">\\[' + s2[0] + "=" + s2[1] + "=" + setTex(s2[2]) + "\\]</div></div>"; }).join("") +
        '<div class="final"><b>Resultado:</b> ' + tex(setTex(res)) + " (" + res.length + " elemento" + (res.length === 1 ? "" : "s") + "). A região pintada no diagrama é a da expressão; os números mostram onde cada elemento mora.</div>";
      renderM(out);
    }
    [iU, iA, iB, iC, ie].forEach(function (x) { x.addEventListener("input", go); }); go();
  };

  // =================================================================== LAB: conjunto das partes
  W.partesLab = function (h) {
    var inp = el("input", { class: "inp setin", value: "a, b, c", "aria-label": "Elementos do conjunto" }); h.appendChild(el("div", { class: "small", style: "font-weight:700" }, "A = { … } (até 6 elementos, separados por vírgula; pode usar ∅ ou {1} como elemento):")); h.appendChild(inp);
    var out = el("div", {}); h.appendChild(out);
    function split(t) { var r = [], d = 0, cur = ""; String(t).split("").forEach(function (ch) { if (ch === "{") d++; if (ch === "}") d--; if (ch === "," && d === 0) { if (cur.trim()) r.push(cur.trim()); cur = ""; } else cur += ch; }); if (cur.trim()) r.push(cur.trim()); var u = []; r.forEach(function (x) { if (u.indexOf(x) < 0) u.push(x); }); return u; }
    function go() {
      var E = split(inp.value); if (E.length > 6) { out.innerHTML = '<div class="alert bad">Use no máximo 6 elementos (já são 64 subconjuntos!).</div>'; return; }
      var n = E.length, rows = [];
      for (var k = 0; k <= n; k++) rows.push([]);
      for (var m = 0; m < (1 << n); m++) { var sub = [], code = ""; for (var j = 0; j < n; j++) { var inq = (m >> (n - 1 - j)) & 1; code += inq; if (inq) sub.push(E[j]); } rows[sub.length].push([sub, code]); }
      var s = '<div class="rows">';
      rows.forEach(function (r, k) { s += '<div class="row"><b>' + k + " elem.</b><span>" + r.map(function (p) { return '<span class="chip" title="código ' + p[1] + '">' + (p[0].length ? "{" + esc(p[0].join(", ")) + "}" : "∅") + "</span>"; }).join(" ") + " <span class=\"muted small\">(" + r.length + ")</span></span></div>"; });
      s += "</div><p class=\"small\"><b>n(A) = " + n + " ⇒ n(𝒫(A)) = 2<sup>" + n + "</sup> = " + (1 << n) + ".</b> Por quê? Cada elemento tem 2 escolhas — entra ou não entra no subconjunto — e as escolhas são independentes: 2 × 2 × … × 2. Passe o mouse num subconjunto para ver o “código” de entra (1) / não entra (0).</p>";
      out.innerHTML = s;
    }
    inp.addEventListener("input", go); go();
  };

  // =================================================================== LAB: inclusão-exclusão (3 conjuntos)
  W.ieLab = function (h) {
    var F = [["a", "n(A)", 18], ["b", "n(B)", 16], ["c", "n(C)", 18], ["ab", "n(A∩B)", 9], ["ac", "n(A∩C)", 10], ["bc", "n(B∩C)", 7], ["abc", "n(A∩B∩C)", 6], ["u", "n(U) (opcional)", 36]];
    var g = el("div", { style: "display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px" }); h.appendChild(g); var I = {};
    F.forEach(function (f) { var w = el("label", { class: "small", style: "display:grid;gap:2px;font-weight:700" }, f[1] + ' <input class="inp" type="number" min="0" value="' + f[2] + '">'); g.appendChild(w); I[f[0]] = w.querySelector("input"); });
    var bb = el("div", { class: "btns" }); h.appendChild(bb);
    var bS = el("button", { class: "btn p s", type: "button" }, "▶ Preencher de dentro para fora"), bA = el("button", { class: "btn s", type: "button" }, "Mostrar tudo"); bb.appendChild(bS); bb.appendChild(bA);
    var pres = [["EN 2008", [18, 16, 18, 9, 10, 7, 6, 36]], ["Sabão em pó (Iezzi 56)", [109, 203, 162, 25, 28, 41, 5, 500]], ["Fuvest 2018 (reprovados)", [14, 16, 12, 5, 3, 7, 2, 49]]];
    pres.forEach(function (p) { var b = el("button", { class: "btn s", type: "button" }, p[0]); b.onclick = function () { F.forEach(function (f, i) { I[f[0]].value = p[1][i]; }); stage = 0; draw(); }; bb.appendChild(b); });
    var view = el("div", { class: "grid g2", style: "align-items:start" }); h.appendChild(view); var pic = el("div", { class: "venn" }), txt = el("div", { class: "steps" }); view.appendChild(pic); view.appendChild(txt);
    var stage = 0, timer = 0;
    var POS = { A: [140, 58], B: [72, 170], C: [208, 170], AB: [106, 108], AC: [174, 108], BC: [140, 182], ABC: [140, 132] };
    function draw() {
      var v = {}; F.forEach(function (f) { v[f[0]] = +I[f[0]].value || 0; });
      var R = { ABC: v.abc, AB: v.ab - v.abc, AC: v.ac - v.abc, BC: v.bc - v.abc };
      R.A = v.a - R.AB - R.AC - v.abc; R.B = v.b - R.AB - R.BC - v.abc; R.C = v.c - R.AC - R.BC - v.abc;
      var uni = v.a + v.b + v.c - v.ab - v.ac - v.bc + v.abc, fora = v.u ? v.u - uni : null;
      var order = [["ABC", "Centro: n(A∩B∩C) = " + v.abc], ["AB", "Só A e B: n(A∩B) − centro = " + v.ab + " − " + v.abc + " = " + R.AB], ["AC", "Só A e C: " + v.ac + " − " + v.abc + " = " + R.AC], ["BC", "Só B e C: " + v.bc + " − " + v.abc + " = " + R.BC],
        ["A", "Só A: " + v.a + " − " + R.AB + " − " + R.AC + " − " + v.abc + " = " + R.A], ["B", "Só B: " + v.b + " − " + R.AB + " − " + R.BC + " − " + v.abc + " = " + R.B], ["C", "Só C: " + v.c + " − " + R.AC + " − " + R.BC + " − " + v.abc + " = " + R.C]];
      var s = '<svg viewBox="0 0 280 230" role="img" aria-label="Venn com quantidades"><rect x="4" y="4" width="272" height="222" rx="6" fill="none" stroke="var(--muted)"/>';
      [[140, 88], [104, 146], [176, 146]].forEach(function (c) { s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="62" fill="var(--pri)" fill-opacity=".10" stroke="var(--ink)" stroke-width="1.8"/>'; });
      s += '<text x="140" y="20" font-size="14" font-weight="700" text-anchor="middle" fill="var(--ink)">A</text><text x="36" y="216" font-size="14" font-weight="700" fill="var(--ink)">B</text><text x="236" y="216" font-size="14" font-weight="700" fill="var(--ink)">C</text>';
      order.forEach(function (o2, k) { if (k < stage) { var p = POS[o2[0]], val = R[o2[0]]; s += '<text x="' + p[0] + '" y="' + p[1] + '" font-size="16" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="' + (val < 0 ? "var(--bad)" : "var(--pri)") + '">' + val + "</text>"; } });
      if (stage > order.length && fora != null) s += '<text x="12" y="22" font-size="13" font-weight="800" fill="var(--pri)">fora: ' + fora + "</text>";
      pic.innerHTML = s + "</svg>";
      var t = order.slice(0, stage).map(function (o2, k) { return '<div class="st"><span class="pl">' + (k + 1) + "º</span><p>" + o2[1] + (R[o2[0]] < 0 ? " ⚠ negativo: dados inconsistentes!" : "") + "</p></div>"; }).join("");
      if (stage > order.length) t += '<div class="st"><span class="pl">Inclusão-exclusão</span><p>n(A∪B∪C) = ' + v.a + " + " + v.b + " + " + v.c + " − " + v.ab + " − " + v.ac + " − " + v.bc + " + " + v.abc + " = <b>" + uni + "</b>" + (fora != null ? "; fora dos três: " + v.u + " − " + uni + " = <b>" + fora + "</b>" : "") + ".</p></div>";
      txt.innerHTML = t || '<p class="small muted">Aperte ▶ para preencher o diagrama região por região, começando pelo centro.</p>';
    }
    bS.onclick = function () { clearInterval(timer); stage = 0; draw(); timer = setInterval(function () { stage++; draw(); if (stage > 7) clearInterval(timer); }, 900); };
    bA.onclick = function () { clearInterval(timer); stage = 8; draw(); };
    F.forEach(function (f) { I[f[0]].addEventListener("input", function () { draw(); }); });
    draw();
  };

  // =================================================================== LAB: tabela-verdade
  W.truthLab = function (h) {
    var P = [["¬p", function (p) { return !p; }, 1], ["p ∧ q", function (p, q) { return p && q; }], ["p ∨ q", function (p, q) { return p || q; }], ["p → q", function (p, q) { return !p || q; }], ["p ↔ q", function (p, q) { return p === q; }],
      ["¬(p ∨ q) vs ¬p ∧ ¬q", function (p, q) { return !(p || q); }, 0, function (p, q) { return !p && !q; }], ["¬(p ∧ q) vs ¬p ∨ ¬q", function (p, q) { return !(p && q); }, 0, function (p, q) { return !p || !q; }],
      ["p → q vs ¬q → ¬p", function (p, q) { return !p || q; }, 0, function (p, q) { return q || !p; }], ["p → q vs q → p", function (p, q) { return !p || q; }, 0, function (p, q) { return !q || p; }]];
    var cur = 0, sel = el("div", { class: "btns" }); h.appendChild(sel); var out = el("div", {}); h.appendChild(out);
    P.forEach(function (x, i) { var b = el("button", { class: "btn s" + (i ? "" : " p"), type: "button" }, x[0]); b.onclick = function () { cur = i; [].forEach.call(sel.children, function (y, j) { y.classList.toggle("p", j === i); }); go(); }; sel.appendChild(b); });
    function vf(b) { return '<td class="' + (b ? "v" : "f") + '">' + (b ? "V" : "F") + "</td>"; }
    function go() {
      var x = P[cur], one = x[2] === 1, two = !!x[3], parts = x[0].split(" vs "), rows = one ? [[true], [false]] : [[true, true], [true, false], [false, true], [false, false]], eq = true;
      var s = '<table class="tt"><thead><tr><th>p</th>' + (one ? "" : "<th>q</th>") + "<th>" + parts[0] + "</th>" + (two ? "<th>" + parts[1] + "</th>" : "") + "</tr></thead><tbody>";
      rows.forEach(function (r) { var a = x[1](r[0], r[1]), b = two ? x[3](r[0], r[1]) : null; if (two && a !== b) eq = false; s += "<tr>" + vf(r[0]) + (one ? "" : vf(r[1])) + vf(a) + (two ? vf(b) : "") + "</tr>"; });
      s += "</tbody></table>";
      var NOTE = { "p ∧ q": "“e”: só é V quando as duas são V. Vira a interseção: x ∈ A ∩ B ⇔ (x ∈ A) ∧ (x ∈ B).", "p ∨ q": "“ou” inclusivo: basta uma ser V. Vira a união.", "¬p": "A negação troca V e F. Vira o complementar: x ∈ Ā ⇔ ¬(x ∈ A).", "p → q": "Só é F quando p é V e q é F. Com p falsa, a implicação é verdadeira (é por isso que ∅ ⊂ A).", "p ↔ q": "V quando p e q têm o mesmo valor. É a base de A = B ⇔ (x ∈ A ⇔ x ∈ B)." };
      s += '<p class="small">' + (two ? (eq ? "<b>Colunas iguais: as proposições são equivalentes.</b> " : "<b>Colunas diferentes: NÃO são equivalentes</b> (compare a linha em que diferem). ") : "") + (NOTE[x[0]] || (x[0].indexOf("¬(p ∨ q)") === 0 ? "É a lei de De Morgan, que vira (A ∪ B)‾ = Ā ∩ B̄." : x[0].indexOf("¬(p ∧ q)") === 0 ? "De Morgan: (A ∩ B)‾ = Ā ∪ B̄." : x[0].indexOf("¬q") > 0 ? "A contrapositiva é equivalente: A ⊂ B ⇔ B̄ ⊂ Ā." : "A recíproca NÃO é equivalente: A ⊂ B não implica B ⊂ A.")) + "</p>";
      out.innerHTML = s;
    }
    go();
  };

  // =================================================================== LAB: verificador de identidades
  W.idLab = function (h, o) {
    o = o || {};
    var l = el("input", { class: "inp setin", value: o.l || "(A ∪ B)'", "aria-label": "Lado esquerdo" }), r = el("input", { class: "inp setin", value: o.r || "A' ∩ B'", "aria-label": "Lado direito" });
    var g = el("div", { class: "grid g2" }); g.appendChild(el("label", { class: "small", style: "display:grid;gap:3px;font-weight:700" }, "Lado esquerdo")).appendChild(l); g.appendChild(el("label", { class: "small", style: "display:grid;gap:3px;font-weight:700" }, "Lado direito")).appendChild(r); h.appendChild(g);
    var pres = el("div", { class: "btns" }); h.appendChild(pres);
    [["De Morgan", "(A ∪ B)'", "A' ∩ B'"], ["Distributiva", "A ∩ (B ∪ C)", "(A ∩ B) ∪ (A ∩ C)"], ["A − B = A ∩ B'", "A − B", "A ∩ B'"], ["IME 1987", "A ∩ (B Δ C)", "(A ∩ B) Δ (A ∩ C)"], ["Falsa!", "A − (B − C)", "(A − B) − C"], ["Absorção", "A ∪ (A ∩ B)", "A"]].forEach(function (p) {
      var b = el("button", { class: "btn s", type: "button" }, p[0]); b.onclick = function () { l.value = p[1]; r.value = p[2]; go(); }; pres.appendChild(b); });
    var out = el("div", {}); h.appendChild(out);
    function go() {
      var a, b; try { a = parseExpr(l.value); b = parseExpr(r.value); } catch (er) { out.innerHTML = '<div class="alert bad">Expressão inválida: ' + esc(er) + "</div>"; return; }
      var used = eUsed(a); eUsed(b, used); var names = used.C ? ["A", "B", "C"] : ["A", "B"], ok = true, rows = "", bad = null;
      var combos = names.length === 2 ? ["11", "10", "01", "00"] : ["111", "110", "101", "100", "011", "010", "001", "000"];
      combos.forEach(function (bits) { var env = {}; names.forEach(function (n, i) { env[n] = bits[i] === "1"; }); var x = eBool(a, env), y = eBool(b, env); if (x !== y) { ok = false; if (!bad) bad = bits; }
        rows += "<tr" + (x !== y ? ' style="background:var(--bad-soft)"' : "") + ">" + names.map(function (n, i) { return "<td>" + bits[i] + "</td>"; }).join("") + '<td class="' + (x ? "v" : "f") + '">' + (x ? 1 : 0) + '</td><td class="' + (y ? "v" : "f") + '">' + (y ? 1 : 0) + "</td></tr>"; });
      out.innerHTML = '<div class="grid g2" style="align-items:start"><div class="venn">' + vennSVG(function (e) { return eBool(a, e); }, names, { title: "esquerdo" }) + '</div><div class="venn">' + vennSVG(function (e) { return eBool(b, e); }, names, { title: "direito" }) + "</div></div>" +
        '<p class="small"><b>Tabela de pertinência</b> (1 = o elemento está no conjunto). Cada linha é uma região do diagrama; a identidade vale se as duas últimas colunas forem iguais em <b>todas</b> as linhas.</p><table class="tt"><thead><tr>' + names.map(function (n) { return "<th>" + n + "</th>"; }).join("") + "<th>esq.</th><th>dir.</th></tr></thead><tbody>" + rows + "</tbody></table>" +
        (ok ? '<div class="alert ok">✓ Identidade verdadeira: os dois lados pintam a mesma região.</div>' : '<div class="alert bad">✗ Falsa. Contraexemplo: um elemento com pertinência ' + names.map(function (n, i) { return n + " = " + bad[i]; }).join(", ") + " está em um lado e não no outro.</div>");
    }
    l.addEventListener("input", go); r.addEventListener("input", go); go();
  };

  // =================================================================== JOGOS
  W.games = function (host) {
    if (!host) return;
    var T = window.T, S = T.S, g = "pert";
    seg(host, [["pert", "∈ ou ⊂?"], ["op", "Opere os conjuntos"], ["card", "Quantos elementos?"], ["reg", "Qual é a região?"]], g, function (v) { g = v; setup(); });
    var box = el("div", { class: "card game" }); host.appendChild(box);
    var timer = 0, left = 0, score = 0, running = false;
    var DESC = { pert: "A afirmação é verdadeira ou falsa?", op: "Calcule o conjunto pedido.", card: "Use n(A ∪ B) = n(A) + n(B) − n(A ∩ B).", reg: "Qual expressão corresponde à região pintada?" };
    function setup() {
      clearInterval(timer); running = false;
      box.innerHTML = '<div class="gstat"><span class="chip">' + T.icon("clock") + ' <b id="gT">45</b> s</span><span class="chip">' + T.icon("check") + ' <b id="gS">0</b> pontos</span><span class="chip">' + T.icon("trophy") + " recorde: <b>" + (S.games[g] || 0) + '</b></span></div><p class="small muted">' + DESC[g] + '</p><div id="gQ" class="gq"></div><div id="gA"></div><div class="btns" style="justify-content:center"><button class="btn p" id="gGo" type="button">' + T.icon("play") + " Começar</button></div>";
      box.querySelector("#gGo").onclick = start;
    }
    function start() { score = 0; left = 45; running = true; box.querySelector("#gGo").hidden = true; box.querySelector("#gS").textContent = 0; clearInterval(timer); timer = setInterval(function () { left--; box.querySelector("#gT").textContent = left; if (left <= 0) end(); }, 1000); next(); }
    function end() { clearInterval(timer); running = false; var best = S.games[g] || 0; if (score > best || S.games[g] == null) S.games[g] = Math.max(best, score); T.save(); box.querySelector("#gQ").innerHTML = "Fim! " + score + " ponto" + (score === 1 ? "" : "s"); box.querySelector("#gA").innerHTML = ""; var b = box.querySelector("#gGo"); b.hidden = false; b.innerHTML = T.icon("play") + " Jogar de novo"; T.addXP(Math.min(15, score), "jogo"); }
    function hit(ok) { if (!running) return; if (ok) { score++; T.beep("ok"); } else T.beep("bad"); box.querySelector("#gS").textContent = score; }
    function buttons(opts, right, cols) {
      var A = box.querySelector("#gA"); A.innerHTML = '<div class="grid" style="grid-template-columns:' + (cols || "1fr 1fr") + ';max-width:460px;margin:0 auto"></div>';
      opts.forEach(function (o) { var b = el("button", { class: "btn", type: "button", style: "font-size:1.05rem" }, o[0]); b.onclick = function () { var ok = o[1] === right; hit(ok); b.classList.add(ok ? "p" : "wrong"); [].forEach.call(A.firstChild.children, function (x) { x.disabled = true; }); setTimeout(next, ok ? 300 : 1100); }; A.firstChild.appendChild(b); });
      renderM(A);
    }
    var FAM = [["1", "{1}", "2", "{3,5}"], ["∅", "a", "b", "{a}", "{∅,b}"], ["a", "{a}"], ["1", "2", "{1,2}", "∅"], ["∅", "{a}", "a", "b", "{a,c}"]];
    var REG = [["A ∩ B", function (e) { return e.A && e.B; }], ["A ∪ B", function (e) { return e.A || e.B; }], ["A − B", function (e) { return e.A && !e.B; }], ["B − A", function (e) { return e.B && !e.A; }], ["A Δ B", function (e) { return e.A !== e.B; }], ["(A ∪ B)′", function (e) { return !e.A && !e.B; }], ["(A ∩ B)′", function (e) { return !(e.A && e.B); }], ["A′", function (e) { return !e.A; }], ["B′", function (e) { return !e.B; }], ["A′ ∪ B", function (e) { return !e.A || e.B; }]];
    var REG3 = [["A ∩ B ∩ C", function (e) { return e.A && e.B && e.C; }], ["A ∩ (B ∪ C)", function (e) { return e.A && (e.B || e.C); }], ["A ∪ (B ∩ C)", function (e) { return e.A || (e.B && e.C); }], ["(A ∩ B) − C", function (e) { return e.A && e.B && !e.C; }], ["A − (B ∪ C)", function (e) { return e.A && !e.B && !e.C; }], ["(A ∪ B) ∩ C", function (e) { return (e.A || e.B) && e.C; }], ["C − (A ∩ B)", function (e) { return e.C && !(e.A && e.B); }]];
    function sig(f, names) { var s = ""; (names.length === 2 ? ["00", "01", "10", "11"] : ["000", "001", "010", "011", "100", "101", "110", "111"]).forEach(function (b) { var env = {}; names.forEach(function (n, i) { env[n] = b[i] === "1"; }); s += f(env) ? 1 : 0; }); return s; }
    function next() {
      if (!running) return;
      var Q = box.querySelector("#gQ");
      if (g === "pert") {
        var F2 = rnd(FAM), list = F2, cand = [], atoms = []; F2.forEach(function (x) { if (x.indexOf("{") < 0 && x !== "∅") atoms.push(x); });
        var pool = F2.concat(atoms.map(function (a) { return "{" + a + "}"; })).concat(["∅", "{∅}", "3", "{2}", "{" + (atoms[0] || "a") + "," + (atoms[1] || "b") + "}"]);
        var x = rnd(pool), kind = rnd(["∈", "∉", "⊂"]), truth;
        function inL(y) { return list.indexOf(y) >= 0; }
        if (kind === "⊂") { if (x === "∅") truth = true; else if (x[0] === "{") { var inner = x.slice(1, -1), parts = []; var d = 0, c = ""; inner.split("").forEach(function (ch) { if (ch === "{") d++; if (ch === "}") d--; if (ch === "," && !d) { parts.push(c); c = ""; } else c += ch; }); parts.push(c); truth = parts.every(inL); } else { kind = "∈"; truth = inL(x); } }
        else truth = kind === "∈" ? inL(x) : !inL(x);
        Q.innerHTML = '<span style="font-size:1.05rem">A = {' + list.join(", ") + "}<br><b>" + x + " " + kind + " A</b></span>";
        buttons([["Verdadeiro", 1], ["Falso", 0]], truth ? 1 : 0);
      } else if (g === "op") {
        var U = [1, 2, 3, 4, 5, 6, 7, 8], A = U.filter(function () { return Math.random() < .5; }), B = U.filter(function () { return Math.random() < .5; });
        var OPS = [["A ∪ B", sUni(A, B)], ["A ∩ B", sInt(A, B)], ["A − B", sDif(A, B)], ["B − A", sDif(B, A)], ["A′", sDif(U, A)], ["A Δ B", sUni(sDif(A, B), sDif(B, A))]];
        var k = ri(0, OPS.length - 1), right = setStr(OPS[k][1]), seen = {}, opts = [[right, right]]; seen[right] = 1;
        shuffle(OPS.slice()).forEach(function (o2) { var s2 = setStr(o2[1]); if (!seen[s2] && opts.length < 4) { seen[s2] = 1; opts.push([s2, s2]); } });
        Q.innerHTML = '<span style="font-size:1rem">U = {1, …, 8}, A = ' + setStr(A) + ", B = " + setStr(B) + "<br><b>" + OPS[k][0] + " = ?</b></span>";
        buttons(shuffle(opts), right, "1fr");
      } else if (g === "card") {
        var a = ri(5, 30), b = ri(5, 30), i = ri(0, Math.min(a, b)), t = rnd([0, 1, 2]), q, ans;
        if (t === 0) { q = "n(A) = " + a + ", n(B) = " + b + ", n(A ∩ B) = " + i + "<br><b>n(A ∪ B) = ?</b>"; ans = a + b - i; }
        else if (t === 1) { q = "n(A) = " + a + ", n(B) = " + b + ", n(A ∪ B) = " + (a + b - i) + "<br><b>n(A ∩ B) = ?</b>"; ans = i; }
        else { q = "n(A) = " + a + ", n(A ∩ B) = " + i + "<br><b>n(A − B) = ?</b>"; ans = a - i; }
        var o3 = [ans]; [a + b, a + b + i, Math.abs(a - b), ans + 1, ans - 1, a - b + i].forEach(function (x2) { if (o3.length < 4 && x2 >= 0 && o3.indexOf(x2) < 0) o3.push(x2); });
        Q.innerHTML = '<span style="font-size:1.05rem">' + q + "</span>"; buttons(shuffle(o3).map(function (x2) { return [String(x2), x2]; }), ans);
      } else {
        var three = Math.random() < .4, bank = three ? REG3 : REG, names = three ? ["A", "B", "C"] : ["A", "B"], pick = rnd(bank), sp = sig(pick[1], names), opts2 = [[pick[0], "r"]], used = {}; used[sp] = 1;
        shuffle(bank.slice()).forEach(function (o4) { var s3 = sig(o4[1], names); if (!used[s3] && opts2.length < 4) { used[s3] = 1; opts2.push([o4[0], "x" + s3]); } });
        Q.innerHTML = '<div class="venn" style="max-width:300px;margin:0 auto">' + vennSVG(pick[1], names) + "</div>";
        buttons(shuffle(opts2), "r");
      }
    }
    function setStr(a) { a = sortEls(a); return a.length ? "{" + a.join(", ") + "}" : "∅"; }
    setup();
  };
})();
