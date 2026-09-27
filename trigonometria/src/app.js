(function () {
  "use strict";
  var MACROS = { "\\sen": "\\operatorname{sen}", "\\tg": "\\operatorname{tg}", "\\cotg": "\\operatorname{cotg}" };
  var D2R = Math.PI / 180;
  var ORDER = ["home", "m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9"];
  var SVGNS = "http://www.w3.org/2000/svg";

  // ---------------------------------------------------------------- utilidades
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function fmt(x, d) {
    if (d == null) d = 2;
    if (!isFinite(x)) return "—";
    return x.toFixed(d).replace(".", ",");
  }
  function tfmt(x, d) { return fmt(x, d).replace(",", "{,}"); } // para dentro do LaTeX
  function tex(s, display) {
    try { return window.katex.renderToString(s, { displayMode: !!display, throwOnError: false, macros: MACROS }); }
    catch (e) { return s; }
  }
  function renderMath(root) {
    if (!window.renderMathInElement) return;
    window.renderMathInElement(root, {
      delimiters: [{ left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }],
      macros: MACROS, throwOnError: false
    });
  }
  var store = {
    get: function (k, dflt) { try { var v = localStorage.getItem("trigo:" + k); return v == null ? dflt : JSON.parse(v); } catch (e) { return dflt; } },
    set: function (k, v) { try { localStorage.setItem("trigo:" + k, JSON.stringify(v)); } catch (e) { } }
  };
  function slider(parent, label, min, max, step, val, unit) {
    var id = "s" + Math.random().toString(36).slice(2, 8);
    var c = el("div", { class: "ctrl" });
    c.innerHTML = '<label for="' + id + '"><span>' + label + '</span><output></output></label>' +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '">';
    parent.appendChild(c);
    var inp = $("input", c), out = $("output", c);
    var d = String(step).indexOf(".") >= 0 ? String(step).split(".")[1].length : 0;
    function sync() { out.textContent = fmt(+inp.value, d) + (unit || ""); }
    inp.addEventListener("input", sync); sync();
    return inp;
  }
  function ro(parent, key, big) {
    var r = el("div", { class: "ro" + (big ? " big" : "") }, '<div class="k">' + key + '</div><div class="v"></div>');
    parent.appendChild(r);
    return $(".v", r);
  }
  function svg(vb) {
    var s = document.createElementNS(SVGNS, "svg");
    s.setAttribute("viewBox", vb);
    return s;
  }
  function P(x, y) { return { x: x, y: y }; }
  function f1(v) { return Math.round(v * 10) / 10; }
  function line(a, b, style) { return '<line x1="' + f1(a.x) + '" y1="' + f1(a.y) + '" x2="' + f1(b.x) + '" y2="' + f1(b.y) + '" style="' + (style || "") + '"/>'; }
  function txt(x, y, s, style, anchor) { return '<text x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || "middle") + '" dominant-baseline="middle" style="' + (style || "") + '">' + s + '</text>'; }
  function unit(a, b) { var dx = b.x - a.x, dy = b.y - a.y, n = Math.hypot(dx, dy) || 1; return P(dx / n, dy / n); }
  function arcPath(v, p, q, r, style, label, lr, lstyle) {
    var u1 = unit(v, p), u2 = unit(v, q);
    var a = P(v.x + u1.x * r, v.y + u1.y * r), b = P(v.x + u2.x * r, v.y + u2.y * r);
    var cross = u1.x * u2.y - u1.y * u2.x;
    var s = '<path d="M' + f1(a.x) + ' ' + f1(a.y) + ' A' + r + ' ' + r + ' 0 0 ' + (cross > 0 ? 1 : 0) + ' ' + f1(b.x) + ' ' + f1(b.y) + '" style="fill:none;stroke-width:2;' + (style || "stroke:var(--ang)") + '"/>';
    if (label) {
      var bx = u1.x + u2.x, by = u1.y + u2.y, n = Math.hypot(bx, by) || 1, L = lr || r + 14;
      s += txt(v.x + bx / n * L, v.y + by / n * L, label, lstyle || "fill:var(--ang);font-weight:700;font-size:14px");
    }
    return s;
  }
  function rightMark(v, p, q, s) {
    s = s || 12;
    var u1 = unit(v, p), u2 = unit(v, q);
    var a = P(v.x + u1.x * s, v.y + u1.y * s), b = P(a.x + u2.x * s, a.y + u2.y * s), c = P(v.x + u2.x * s, v.y + u2.y * s);
    return '<path d="M' + f1(a.x) + ' ' + f1(a.y) + ' L' + f1(b.x) + ' ' + f1(b.y) + ' L' + f1(c.x) + ' ' + f1(c.y) + '" style="fill:none;stroke:var(--muted);stroke-width:1.3"/>';
  }
  function sideLabel(p, q, s, cen, style, d) {
    d = d || 15;
    var m = P((p.x + q.x) / 2, (p.y + q.y) / 2), u = unit(p, q), n = P(-u.y, u.x);
    if (Math.hypot(m.x + n.x - cen.x, m.y + n.y - cen.y) < Math.hypot(m.x - cen.x, m.y - cen.y)) n = P(-n.x, -n.y);
    return txt(m.x + n.x * d, m.y + n.y * d, s, style);
  }
  var ST = {
    op: "stroke:var(--op);stroke-width:3.5", adj: "stroke:var(--adj);stroke-width:3.5", hip: "stroke:var(--hip);stroke-width:3.5",
    ink: "stroke:var(--ink);stroke-width:2", thin: "stroke:var(--muted);stroke-width:1.3", dash: "stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 4",
    top: "fill:var(--op);font-weight:700;font-size:14px", tadj: "fill:var(--adj);font-weight:700;font-size:14px", thip: "fill:var(--hip);font-weight:700;font-size:14px",
    tink: "fill:var(--ink);font-weight:700;font-size:15px", tmut: "fill:var(--muted);font-size:12px"
  };

  // Animação genérica: play/pausa/reinício
  function Anim(host, dur, draw) {
    var t = 0, playing = false, last = 0, raf = 0;
    var bar = el("div", { class: "btns" });
    var bp = el("button", { class: "b main", type: "button" }, "▶ Iniciar");
    var br = el("button", { class: "b", type: "button" }, "↺ Reiniciar");
    var rng = el("input", { type: "range", min: 0, max: 1000, value: 0, "aria-label": "Posição da animação", style: "flex:1 1 160px" });
    bar.appendChild(bp); bar.appendChild(br); bar.appendChild(rng);
    host.appendChild(bar);
    function paint() { rng.value = Math.round(t * 1000); draw(t); }
    function loop(ts) {
      if (!playing) return;
      if (!last) last = ts;
      t = Math.min(1, t + (ts - last) / dur); last = ts;
      paint();
      if (t >= 1) { stop(); bp.textContent = "▶ Repetir"; return; }
      raf = requestAnimationFrame(loop);
    }
    function play() { if (t >= 1) t = 0; playing = true; last = 0; bp.textContent = "❚❚ Pausar"; raf = requestAnimationFrame(loop); }
    function stop() { playing = false; cancelAnimationFrame(raf); bp.textContent = "▶ Continuar"; }
    bp.addEventListener("click", function () { playing ? stop() : play(); });
    br.addEventListener("click", function () { stop(); t = 0; bp.textContent = "▶ Iniciar"; paint(); });
    rng.addEventListener("input", function () { if (playing) stop(); t = rng.value / 1000; paint(); });
    paint();
    return { set: function (v) { t = v; paint(); } };
  }
  function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
  function seg(t, a, b) { return ease((t - a) / (b - a)); }

  // ---------------------------------------------------------------- tema
  function initTheme() {
    var saved = store.get("theme", null);
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    $("#themeBtn").addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      if (!cur) cur = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      var nxt = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nxt);
      store.set("theme", nxt);
    });
  }

  // ---------------------------------------------------------------- progresso
  var prog = store.get("prog", {});
  function saveProg() { store.set("prog", prog); updateCards(); }
  function updateCards() {
    $$("[data-prog]").forEach(function (s) {
      var m = s.getAttribute("data-prog"), p = prog[m] || {};
      var nq = $$("#" + m + " .qz").length;
      var ok = (p.ok || []).length;
      var parts = [];
      if (p.seen) parts.push("✓ visitado");
      if (nq) parts.push(ok + "/" + nq + " verificações certas");
      s.textContent = parts.join(" · ") || (nq ? nq + " questões de verificação" : "");
      s.classList.toggle("ok", nq > 0 && ok === nq);
    });
  }

  // ---------------------------------------------------------------- navegação
  function show(id, anchor) {
    $$(".module").forEach(function (m) { m.classList.toggle("on", m.id === id); });
    var mod = $("#" + id);
    $("#tbTitle").textContent = mod ? mod.getAttribute("data-title") : "";
    $("#homeBtn").hidden = id === "home";
    if (id !== "home") { prog[id] = prog[id] || {}; prog[id].seen = 1; saveProg(); }
    if (anchor) {
      var a = document.getElementById(anchor);
      if (a) {
        a.scrollIntoView();
        // fontes/figuras do módulo recém-exibido podem mudar a altura do conteúdo: reposiciona algumas vezes
        var moved = false, stopper = function () { moved = true; };
        ["wheel", "touchstart", "keydown"].forEach(function (ev) { window.addEventListener(ev, stopper, { once: true, passive: true }); });
        [80, 250, 600, 1200].forEach(function (ms) { setTimeout(function () { if (!moved) a.scrollIntoView(); }, ms); });
        return;
      }
    }
    window.scrollTo(0, 0);
  }
  function route() {
    var h = decodeURIComponent(location.hash.slice(1)) || "home";
    var t = document.getElementById(h);
    if (!t) return show("home");
    var mod = t.classList.contains("module") ? t : t.closest(".module");
    if (!mod) return show("home");
    show(mod.id, mod === t ? null : h);
  }
  function addModuleNav() {
    ORDER.forEach(function (id, i) {
      if (id === "home") return;
      var m = $("#" + id); if (!m) return;
      var nav = el("nav", { class: "mnav" });
      var prev = ORDER[i - 1], next = ORDER[i + 1];
      var ph = prev === "home" ? "Sumário" : $("#" + prev).getAttribute("data-title");
      nav.appendChild(el("a", { class: "b", href: "#" + prev, style: "text-decoration:none;text-align:left" }, "← " + ph));
      if (next) nav.appendChild(el("a", { class: "b main", href: "#" + next, style: "text-decoration:none;text-align:right" }, $("#" + next).getAttribute("data-title") + " →"));
      m.appendChild(nav);
    });
  }

  // ---------------------------------------------------------------- passos revelados
  function initReveal() {
    $$(".reveal").forEach(function (r) {
      var items = $$(".st, .final", r);
      if (!items.length) return;
      var i = 0;
      var bar = el("div", { class: "btns" });
      var bn = el("button", { class: "b main", type: "button" });
      var ba = el("button", { class: "b", type: "button" }, "Mostrar tudo");
      var bz = el("button", { class: "b", type: "button" }, "Recomeçar");
      bar.appendChild(bn); bar.appendChild(ba); bar.appendChild(bz);
      r.appendChild(bar);
      function upd() {
        items.forEach(function (it, k) { it.classList.toggle("hid", k >= i); });
        var done = i >= items.length;
        bn.disabled = done;
        bn.textContent = i === 0 ? "Começar resolução (" + items.length + " etapas)" : done ? "Concluído" : "Próximo passo (" + (i + 1) + "/" + items.length + ")";
        bz.hidden = i === 0; ba.hidden = done;
      }
      bn.addEventListener("click", function () { i++; upd(); });
      ba.addEventListener("click", function () { i = items.length; upd(); });
      bz.addEventListener("click", function () { i = 0; upd(); });
      upd();
    });
  }

  // ---------------------------------------------------------------- quiz
  function initQuiz() {
    $$(".qz").forEach(function (q, idx) {
      var mod = q.closest(".module").id;
      var ans = q.getAttribute("data-ans");
      var fbs = $(".fbs", q); fbs.hidden = true;
      var box = el("div", { class: "fb", role: "status" }); box.hidden = true;
      q.appendChild(box);
      var again = el("button", { class: "b", type: "button" }, "Tentar de novo"); again.hidden = true;
      q.appendChild(again);
      var qi = $$(".qz", q.closest(".module")).indexOf(q);
      var alts = $$(".alt", q);
      alts.forEach(function (b) {
        b.type = "button";
        b.addEventListener("click", function () {
          var k = b.getAttribute("data-k"), right = k === ans;
          alts.forEach(function (x) { x.disabled = true; });
          b.classList.add(right ? "right" : "wrong");
          if (!right) alts.forEach(function (x) { if (x.getAttribute("data-k") === ans) x.classList.add("right"); });
          var f = $('[data-for="' + k + '"]', fbs) || $('[data-for="*"]', fbs);
          box.className = "fb " + (right ? "y" : "n");
          box.innerHTML = '<b class="t">' + (right ? "Certo!" : "Ainda não.") + "</b>" + (f ? f.innerHTML : "");
          box.hidden = false; again.hidden = right;
          if (right) {
            prog[mod] = prog[mod] || {}; var ok = prog[mod].ok || [];
            if (ok.indexOf(qi) < 0) ok.push(qi);
            prog[mod].ok = ok; saveProg();
          }
        });
      });
      again.addEventListener("click", function () {
        alts.forEach(function (x) { x.disabled = false; x.classList.remove("right", "wrong"); });
        box.hidden = true; again.hidden = true;
      });
    });
  }

  // ---------------------------------------------------------------- conferência numérica
  function initChecks() {
    $$(".chk").forEach(function (c) {
      var inp = $("input", c), btn = $("button", c), out = $(".out", c);
      var ans = parseFloat(c.getAttribute("data-ans")), tol = parseFloat(c.getAttribute("data-tol") || "0.01");
      btn.type = "button";
      function go() {
        var raw = inp.value.trim().replace(/\s/g, "").replace(",", ".");
        var v = parseFloat(raw);
        if (!raw || isNaN(v)) { out.className = "out fb n"; out.innerHTML = '<b class="t">Digite um número.</b>Use vírgula ou ponto para os decimais.'; return; }
        var ok = Math.abs(v - ans) <= tol * Math.max(1, Math.abs(ans));
        out.className = "out fb " + (ok ? "y" : "n");
        out.innerHTML = ok ? '<b class="t">Certo!</b>Confira a resolução completa abaixo para ver se o caminho também bate.'
          : '<b class="t">Ainda não.</b>Revise qual lado é oposto/adjacente ao ângulo e qual razão junta o dado ao pedido. Abra a resolução passo a passo se precisar.';
      }
      btn.addEventListener("click", go);
      inp.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
    });
  }

  // ================================================================ LABORATÓRIOS
  var LABS = {};

  // desenha triângulo retângulo em A com B à esquerda, C em cima
  function triRef(Bdeg, a, s, ox, oy, ref, showVals) {
    var t = Bdeg * D2R, b = a * Math.sin(t), c = a * Math.cos(t);
    var B = P(ox, oy), A = P(ox + c * s, oy), C = P(ox + c * s, oy - b * s);
    var cen = P((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3);
    var opB = ref === "B";
    var h = "";
    h += line(B, C, ST.hip) + line(A, C, opB ? ST.op : ST.adj) + line(B, A, opB ? ST.adj : ST.op);
    h += rightMark(A, B, C, 12);
    if (opB) h += arcPath(B, A, C, 34, "stroke:var(--ang)", "B̂", 50);
    else h += arcPath(C, A, B, 28, "stroke:var(--ang)", "Ĉ", 44);
    var vb = showVals ? " = " + fmt(b) : "", vc = showVals ? " = " + fmt(c) : "", va = showVals ? " = " + fmt(a) : "";
    h += sideLabel(B, C, "a" + va, cen, ST.thip, 16);
    h += sideLabel(A, C, "b" + vb, cen, opB ? ST.top : ST.tadj, 16);
    h += sideLabel(B, A, "c" + vc, cen, opB ? ST.tadj : ST.top, 16);
    h += txt(B.x - 12, B.y + 4, "B", ST.tink) + txt(A.x + 12, A.y + 8, "A", ST.tink) + txt(C.x + 12, C.y - 6, "C", ST.tink);
    return { svg: h, a: a, b: b, c: c };
  }

  LABS.razoes = function (host) {
    var scene = el("div", { class: "scene" }); host.appendChild(scene);
    var S = svg("0 0 440 280"); scene.appendChild(S);
    var ctr = el("div", { class: "ctrls" }); host.appendChild(ctr);
    var sB = slider(ctr, "Ângulo B̂", 5, 85, 1, 35, "°");
    var sA = slider(ctr, "Hipotenusa a", 2, 10, 0.1, 7);
    var segw = el("div", { class: "btns" }, '<span class="small"><b>Referência:</b></span><div class="seg"><button type="button" class="on" data-r="B">ângulo B̂</button><button type="button" data-r="C">ângulo Ĉ</button></div>');
    host.appendChild(segw);
    var ref = "B";
    $$("button", segw).forEach(function (b) { b.addEventListener("click", function () { ref = b.getAttribute("data-r"); $$("button", segw).forEach(function (x) { x.classList.toggle("on", x === b); }); draw(); }); });
    var rd = el("div", { class: "readout" }); host.appendChild(rd);
    var v1 = ro(rd, "seno"), v2 = ro(rd, "cosseno"), v3 = ro(rd, "tangente"), v4 = ro(rd, "cotangente");
    var legend = el("p", { class: "small" }); host.appendChild(legend);
    function draw() {
      var B = +sB.value, a = +sA.value;
      var r = triRef(B, a, 23, 40, 255, ref, true);
      S.innerHTML = r.svg;
      var L = ref === "B" ? "\\hat B" : "\\hat C";
      var op = ref === "B" ? "b" : "c", ad = ref === "B" ? "c" : "b";
      var vop = ref === "B" ? r.b : r.c, vad = ref === "B" ? r.c : r.b;
      v1.innerHTML = tex("\\sen" + L + "=\\frac{" + op + "}{a}=\\frac{" + tfmt(vop) + "}{" + tfmt(a) + "}=" + tfmt(vop / a, 3));
      v2.innerHTML = tex("\\cos" + L + "=\\frac{" + ad + "}{a}=\\frac{" + tfmt(vad) + "}{" + tfmt(a) + "}=" + tfmt(vad / a, 3));
      v3.innerHTML = tex("\\tg" + L + "=\\frac{" + op + "}{" + ad + "}=" + tfmt(vop / vad, 3));
      v4.innerHTML = tex("\\cotg" + L + "=\\frac{" + ad + "}{" + op + "}=" + tfmt(vad / vop, 3));
      legend.innerHTML = 'Em relação a ' + (ref === "B" ? "B̂ (" + B + "°)" : "Ĉ (" + (90 - B) + "°)") + ': <span class="cop">' + op + ' é o oposto</span>, <span class="cadj">' + ad + ' é o adjacente</span>, <span class="chip">a é a hipotenusa</span>.';
    }
    sB.addEventListener("input", draw); sA.addEventListener("input", draw); draw();
  };

  LABS.fund = function (host) {
    var scene = el("div", { class: "scene" }); host.appendChild(scene);
    var S = svg("0 0 440 250"); scene.appendChild(S);
    var ctr = el("div", { class: "ctrls" }); host.appendChild(ctr);
    var sB = slider(ctr, "Ângulo B̂", 1, 89, 1, 30, "°");
    var bar = el("div", { class: "stackbar", "aria-hidden": "true" }, '<div style="background:var(--op)"></div><div style="background:var(--adj)"></div>');
    host.appendChild(bar);
    var rd = el("div", { class: "readout" }); host.appendChild(rd);
    var v1 = ro(rd, "sen² B̂"), v2 = ro(rd, "cos² B̂"), v3 = ro(rd, "soma");
    function draw() {
      var B = +sB.value, t = B * D2R, sn = Math.sin(t), cs = Math.cos(t), k = 170;
      var Bp = P(40, 200), A = P(40 + cs * k, 200), C = P(40 + cs * k, 200 - sn * k);
      var h = "";
      // quadrados sobre os catetos (encolhidos para caber): áreas proporcionais
      h += '<rect x="' + f1(A.x) + '" y="' + f1(C.y) + '" width="' + f1(sn * k * 0.5) + '" height="' + f1(sn * k * 0.5) + '" style="fill:var(--op);opacity:.18"/>';
      h += '<rect x="' + f1(Bp.x) + '" y="200" width="' + f1(cs * k * 0.5) + '" height="' + f1(cs * k * 0.5) + '" style="fill:var(--adj);opacity:.18"/>';
      h += line(Bp, C, ST.hip) + line(A, C, ST.op) + line(Bp, A, ST.adj) + rightMark(A, Bp, C, 11);
      h += arcPath(Bp, A, C, 32, "stroke:var(--ang)", B + "°", 50);
      var cen = P((A.x + Bp.x + C.x) / 3, (A.y + Bp.y + C.y) / 3);
      h += sideLabel(Bp, C, "1", cen, ST.thip, 14);
      h += txt(A.x + 8, (A.y + C.y) / 2, "sen = " + fmt(sn, 3), ST.top, "start");
      h += txt((Bp.x + A.x) / 2, 212 + (cs * k * 0.5 > 30 ? cs * k * 0.25 - 6 : 16), "cos = " + fmt(cs, 3), ST.tadj);
      h += txt(430, 30, "hipotenusa = 1", ST.tmut, "end");
      S.innerHTML = h;
      bar.children[0].style.width = (sn * sn * 100) + "%"; bar.children[0].textContent = sn * sn > .12 ? "sen² " + fmt(sn * sn, 3) : "";
      bar.children[1].style.width = (cs * cs * 100) + "%"; bar.children[1].textContent = cs * cs > .12 ? "cos² " + fmt(cs * cs, 3) : "";
      v1.textContent = fmt(sn * sn, 4); v2.textContent = fmt(cs * cs, 4); v3.textContent = fmt(sn * sn + cs * cs, 4);
    }
    sB.addEventListener("input", draw); draw();
  };

  LABS.comp = function (host) {
    var scene = el("div", { class: "scene" }); host.appendChild(scene);
    var S = svg("0 0 440 250"); scene.appendChild(S);
    var ctr = el("div", { class: "ctrls" }); host.appendChild(ctr);
    var sB = slider(ctr, "Ângulo B̂", 5, 85, 1, 20, "°");
    var tb = el("div", { class: "tbl" }); host.appendChild(tb);
    function draw() {
      var B = +sB.value, C = 90 - B, t = B * D2R;
      var a = 8, b = a * Math.sin(t), c = a * Math.cos(t), s = Math.min(330 / c, 195 / b);
      var Bp = P(40, 225), A = P(40 + c * s, 225), Cp = P(40 + c * s, 225 - b * s);
      var h = line(Bp, Cp, ST.hip) + line(A, Cp, "stroke:var(--ink);stroke-width:2.5") + line(Bp, A, "stroke:var(--ink);stroke-width:2.5") + rightMark(A, Bp, Cp, 11);
      h += arcPath(Bp, A, Cp, 34, "stroke:var(--op)", "B̂ = " + B + "°", 66, "fill:var(--op);font-weight:700;font-size:13px");
      h += arcPath(Cp, A, Bp, 26, "stroke:var(--adj)", "Ĉ = " + C + "°", 58, "fill:var(--adj);font-weight:700;font-size:13px");
      h += txt(Bp.x - 12, Bp.y + 4, "B", ST.tink) + txt(A.x + 12, A.y + 6, "A", ST.tink) + txt(Cp.x + 12, Cp.y - 4, "C", ST.tink);
      S.innerHTML = h;
      var sn = Math.sin(t), cs = Math.cos(t);
      var rows = [["\\sen\\hat B", sn, "\\cos\\hat C"], ["\\cos\\hat B", cs, "\\sen\\hat C"], ["\\tg\\hat B", sn / cs, "\\cotg\\hat C"], ["\\cotg\\hat B", cs / sn, "\\tg\\hat C"]];
      var html = '<table><thead><tr><th>razão de B̂ = ' + B + '°</th><th>valor</th><th>razão de Ĉ = ' + C + '°</th><th>valor</th></tr></thead><tbody>';
      rows.forEach(function (r) { html += "<tr><td>" + tex(r[0]) + "</td><td>" + fmt(r[1], 4) + "</td><td>" + tex(r[2]) + "</td><td>" + fmt(r[1], 4) + "</td></tr>"; });
      tb.innerHTML = html + "</tbody></table>";
    }
    sB.addEventListener("input", draw); draw();
  };

  LABS.anim45 = function (host) {
    var scene = el("div", { class: "scene" }); host.appendChild(scene);
    var S = svg("0 0 440 230"); scene.appendChild(S);
    var cap = el("p", { class: "small", "aria-live": "polite" }); host.appendChild(cap);
    var k = 150, x0 = 60, y0 = 200;
    Anim(host, 6000, function (t) {
      var p1 = seg(t, 0.05, 0.3), p2 = seg(t, 0.35, 0.6), p3 = seg(t, 0.65, 0.9);
      var A = P(x0, y0), B = P(x0 + k, y0), C = P(x0, y0 - k), Q = P(x0 + k, y0 - k);
      var h = "";
      // metade de cima-esquerda (fica)
      var sk = p2 > 0 ? "stroke:var(--ink);stroke-width:2" : "stroke:none";
      h += '<path d="M' + A.x + ' ' + A.y + ' L' + B.x + ' ' + B.y + ' L' + C.x + ' ' + C.y + ' Z" style="fill:var(--pen-soft);' + sk + '"/>';
      // metade que se desloca
      var dx = p2 * 150;
      h += '<g transform="translate(' + f1(dx) + ' 0)"><path d="M' + B.x + ' ' + B.y + ' L' + Q.x + ' ' + Q.y + ' L' + C.x + ' ' + C.y + ' Z" style="fill:' + (p1 >= 1 ? "var(--amber-soft)" : "var(--pen-soft)") + ';' + sk + ';opacity:' + (1 - p2 * 0.35) + '"/></g>';
      if (p2 === 0) h += '<rect x="' + A.x + '" y="' + C.y + '" width="' + k + '" height="' + k + '" style="fill:none;stroke:var(--ink);stroke-width:2"/>';
      // diagonal
      var D = P(C.x + (B.x - C.x) * p1, C.y + (B.y - C.y) * p1);
      h += line(C, D, "stroke:var(--hip);stroke-width:3.5");
      h += rightMark(A, B, C, 12);
      if (p3 > 0) {
        h += '<g style="opacity:' + p3 + '">';
        h += txt(x0 - 16, y0 - k / 2, "1", ST.top) + txt(x0 + k / 2, y0 + 16, "1", ST.tadj);
        h += sideLabel(C, B, "√2", P(x0 + 30, y0 - 30), ST.thip, 16);
        h += arcPath(B, A, C, 30, "stroke:var(--ang)", "45°", 48) + arcPath(C, A, B, 30, "stroke:var(--ang)", "45°", 48);
        h += "</g>";
      }
      S.innerHTML = h;
      cap.textContent = t < 0.33 ? "1) Um quadrado de lado 1. Traçamos a diagonal." :
        t < 0.63 ? "2) A diagonal corta o quadrado em dois triângulos retângulos iguais." :
          "3) Cada um tem catetos 1 e 1, ângulos de 45° (a diagonal divide o ângulo reto ao meio) e hipotenusa √(1²+1²) = √2.";
    });
  };

  LABS.anim3060 = function (host) {
    var scene = el("div", { class: "scene" }); host.appendChild(scene);
    var S = svg("0 0 440 240"); scene.appendChild(S);
    var cap = el("p", { class: "small", "aria-live": "polite" }); host.appendChild(cap);
    var L = 190, H = L * Math.sqrt(3) / 2, x0 = 40, y0 = 215;
    Anim(host, 7000, function (t) {
      var p1 = seg(t, 0.05, 0.3), p2 = seg(t, 0.35, 0.6), p3 = seg(t, 0.65, 0.9);
      var B = P(x0, y0), C = P(x0 + L, y0), T = P(x0 + L / 2, y0 - H), M = P(x0 + L / 2, y0);
      var h = "";
      var sk = p2 > 0 ? "stroke:var(--ink);stroke-width:2" : "stroke:none";
      h += '<path d="M' + f1(B.x) + ' ' + f1(B.y) + ' L' + f1(M.x) + ' ' + f1(M.y) + ' L' + f1(T.x) + ' ' + f1(T.y) + ' Z" style="fill:var(--pen-soft);' + sk + '"/>';
      var dx = p2 * 150;
      h += '<g transform="translate(' + f1(dx) + ' 0)"><path d="M' + f1(M.x) + ' ' + f1(M.y) + ' L' + f1(C.x) + ' ' + f1(C.y) + ' L' + f1(T.x) + ' ' + f1(T.y) + ' Z" style="fill:' + (p1 >= 1 ? "var(--amber-soft)" : "var(--pen-soft)") + ';' + sk + ';opacity:' + (1 - p2 * 0.35) + '"/>';
      if (p2 > 0) h += arcPath(C, M, T, 28, "stroke:var(--ang)", "60°", 46) + rightMark(M, C, T, 11);
      if (p2 < 0.05) h += txt(x0 + L * 0.75 + 16, y0 - H / 2, "2", ST.thip);
      h += "</g>";
      if (p2 === 0) h += '<path d="M' + f1(B.x) + ' ' + f1(B.y) + ' L' + f1(C.x) + ' ' + f1(C.y) + ' L' + f1(T.x) + ' ' + f1(T.y) + ' Z" style="fill:none;stroke:var(--ink);stroke-width:2"/>';
      if (p1 < 1 || p2 < 0.05) {
        h += arcPath(B, C, T, 28, "stroke:var(--ang)", "60°", 46);
        if (p2 < 0.05) h += arcPath(C, B, T, 28, "stroke:var(--ang)", "60°", 46);
      }
      var D = P(T.x, T.y + (M.y - T.y) * p1);
      h += line(T, D, "stroke:var(--op);stroke-width:3.5");
      if (p1 >= 1) h += rightMark(M, B, T, 11);
      h += txt(x0 + L / 4 - 14, y0 - H / 2 - 8, "2", ST.thip);
      if (p3 > 0) {
        h += '<g style="opacity:' + p3 + '">';
        h += txt(x0 + L / 4, y0 + 16, "1", ST.tadj);
        h += txt(M.x + 10, y0 - H / 2, "√3", ST.top, "start");
        h += arcPath(T, B, M, 34, "stroke:var(--ang)", "30°", 52);
        h += arcPath(B, M, T, 28, "stroke:var(--ang)", "60°", 46);
        h += "</g>";
      }
      S.innerHTML = h;
      cap.textContent = t < 0.33 ? "1) Triângulo equilátero de lado 2: todos os ângulos medem 60°. Baixamos a altura." :
        t < 0.63 ? "2) A altura cai no meio da base e corta o triângulo em duas metades iguais, retângulas." :
          "3) Cada metade: hipotenusa 2, base 1, altura √(2² − 1²) = √3; ângulos de 60° embaixo e 30° em cima.";
    });
  };

  var EXACT = {
    30: { sen: "\\tfrac12", cos: "\\tfrac{\\sqrt3}{2}", tg: "\\tfrac{\\sqrt3}{3}", cotg: "\\sqrt3" },
    45: { sen: "\\tfrac{\\sqrt2}{2}", cos: "\\tfrac{\\sqrt2}{2}", tg: "1", cotg: "1" },
    60: { sen: "\\tfrac{\\sqrt3}{2}", cos: "\\tfrac12", tg: "\\sqrt3", cotg: "\\tfrac{\\sqrt3}{3}" }
  };
  LABS.calc = function (host) {
    var ctr = el("div", { class: "ctrls" }); host.appendChild(ctr);
    var sA = slider(ctr, "Ângulo θ", 1, 89, 1, 35, "°");
    var rd = el("div", { class: "readout" }); host.appendChild(rd);
    var v = { sen: ro(rd, "sen θ"), cos: ro(rd, "cos θ"), tg: ro(rd, "tg θ"), cotg: ro(rd, "cotg θ") };
    var note = el("p", { class: "small muted" }); host.appendChild(note);
    function draw() {
      var A = +sA.value, t = A * D2R, vals = { sen: Math.sin(t), cos: Math.cos(t), tg: Math.tan(t), cotg: 1 / Math.tan(t) };
      for (var k in v) {
        var ex = EXACT[A] ? tex(EXACT[A][k]) + " ≈ " : "";
        v[k].innerHTML = ex + fmt(vals[k], 4);
      }
      note.innerHTML = "Complementar: " + A + "° + " + (90 - A) + "° = 90°, então sen " + A + "° = cos " + (90 - A) + "° e tg " + A + "° = cotg " + (90 - A) + "°.";
    }
    sA.addEventListener("input", draw); draw();
  };

  LABS.qual = function (host) {
    var scene = el("div", { class: "scene" }); host.appendChild(scene);
    var S = svg("0 0 440 250"); scene.appendChild(S);
    var q = el("p", { class: "ex-q" }); host.appendChild(q);
    var opts = el("div", { class: "btns" }); host.appendChild(opts);
    ["sen", "cos", "tg"].forEach(function (f) { opts.appendChild(el("button", { class: "b", type: "button", "data-f": f }, f === "sen" ? "seno" : f === "cos" ? "cosseno" : "tangente")); });
    var fb = el("div", { class: "fb", role: "status" }); fb.hidden = true; host.appendChild(fb);
    var bar = el("div", { class: "btns" }); host.appendChild(bar);
    var nb = el("button", { class: "b main", type: "button" }, "Novo problema"); bar.appendChild(nb);
    var sc = el("span", { class: "small muted" }); bar.appendChild(sc);
    var hits = 0, tries = 0, cur, locked;
    var NAME = { op: "o cateto oposto", adj: "o cateto adjacente", hip: "a hipotenusa" };
    function gen() {
      var types = ["op", "adj", "hip"];
      var g = types[Math.floor(Math.random() * 3)], w;
      do { w = types[Math.floor(Math.random() * 3)]; } while (w === g);
      var angs = [30, 45, 60, 25, 35, 40, 50, 55, 20, 70];
      var th = angs[Math.floor(Math.random() * angs.length)];
      var ref = Math.random() < 0.5 ? "B" : "C";
      var val = [4, 5, 6, 8, 10, 12, 15][Math.floor(Math.random() * 7)];
      cur = { g: g, w: w, th: th, ref: ref, val: val };
      locked = false; fb.hidden = true;
      $$("button", opts).forEach(function (b) { b.disabled = false; b.className = "b"; });
      draw();
    }
    function correct(c) { var s = [c.g, c.w].sort().join(","); return s === "hip,op" ? "sen" : s === "adj,hip" ? "cos" : "tg"; }
    function draw() {
      var c = cur;
      var Bdeg = c.ref === "B" ? c.th : 90 - c.th;
      var t = Bdeg * D2R, a = 1, b = Math.sin(t), cc = Math.cos(t);
      var s = Math.min(330 / cc, 200 / b, 300);
      var B = P(50, 225), A = P(50 + cc * s, 225), C = P(50 + cc * s, 225 - b * s);
      var cen = P((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3);
      // papel de cada lado em relação ao ângulo de referência
      var role = { BC: "hip", AC: c.ref === "B" ? "op" : "adj", AB: c.ref === "B" ? "adj" : "op" };
      var sides = { BC: [B, C], AC: [A, C], AB: [B, A] };
      var h = "";
      for (var k in sides) {
        var r = role[k], st = r === c.g ? "stroke:var(--v);stroke-width:4" : r === c.w ? "stroke:var(--f);stroke-width:4;stroke-dasharray:8 5" : ST.ink;
        h += line(sides[k][0], sides[k][1], st);
        var lab = r === c.g ? String(c.val) : r === c.w ? "?" : "";
        if (lab) h += sideLabel(sides[k][0], sides[k][1], lab, cen, r === c.g ? "fill:var(--v);font-weight:800;font-size:17px" : "fill:var(--f);font-weight:800;font-size:19px", 16);
      }
      h += rightMark(A, B, C, 12);
      if (c.ref === "B") h += arcPath(B, A, C, 36, "stroke:var(--ang)", c.th + "°", 56);
      else h += arcPath(C, A, B, 30, "stroke:var(--ang)", c.th + "°", 50);
      h += txt(B.x - 12, B.y + 4, "B", ST.tink) + txt(A.x + 12, A.y + 8, "A", ST.tink) + txt(C.x + 12, C.y - 6, "C", ST.tink);
      S.innerHTML = h;
      q.innerHTML = "Conhecemos o ângulo de <b>" + c.th + "°</b> e o lado verde (<b>" + c.val + "</b>). Queremos o lado vermelho (?). Qual razão liga os dois?";
    }
    function answer(f) {
      if (locked) return; locked = true; tries++;
      var c = cur, right = correct(c), ok = f === right; if (ok) hits++;
      $$("button", opts).forEach(function (b) { b.disabled = true; var bf = b.getAttribute("data-f"); if (bf === right) b.className = "b on"; else if (bf === f) b.className = "b off"; });
      var th = "\\sen", fn = right === "sen" ? Math.sin : right === "cos" ? Math.cos : Math.tan;
      var R = right === "sen" ? "\\sen" : right === "cos" ? "\\cos" : "\\tg";
      var v = fn(c.th * D2R), res, eq;
      var top = right === "sen" ? "op" : right === "cos" ? "adj" : "op";
      if (c.w === top) { res = c.val * v; eq = "?=" + c.val + "\\cdot" + R + "\\," + c.th + "^\\circ\\approx" + tfmt(res); }
      else { res = c.val / v; eq = "?=\\dfrac{" + c.val + "}{" + R + "\\," + c.th + "^\\circ}\\approx" + tfmt(res); }
      fb.className = "fb " + (ok ? "y" : "n");
      fb.innerHTML = '<b class="t">' + (ok ? "Certo!" : "Não — a razão é " + (right === "sen" ? "seno" : right === "cos" ? "cosseno" : "tangente") + ".") + "</b>" +
        "Em relação ao ângulo de " + c.th + "°, o lado dado é <b>" + NAME[c.g] + "</b> e o pedido é <b>" + NAME[c.w] + "</b>. " + tex(eq);
      fb.hidden = false;
      sc.textContent = "Acertos: " + hits + "/" + tries;
    }
    $$("button", opts).forEach(function (b) { b.addEventListener("click", function () { answer(b.getAttribute("data-f")); }); });
    nb.addEventListener("click", gen);
    gen();
  };

  LABS.predio = function (host) {
    var scene = el("div", { class: "scene" }); host.appendChild(scene);
    var S = svg("0 0 440 330"); scene.appendChild(S);
    var rd = el("div", { class: "readout" });
    var H = 45 + 15 * Math.sqrt(3), d1 = H / Math.sqrt(3), d2 = d1 + 30, k = 3.9, G = 300, X = 370;
    var vd = ro(rd, "distância d"), va = ro(rd, "ângulo θ"), vt = ro(rd, "tg θ = H/d");
    var anim = Anim(host, 5000, function (t) { draw(d1 + 30 * ease(t)); });
    host.appendChild(rd);
    host.appendChild(el("p", { class: "small muted" }, "Altura fixa H = 45 + 15√3 ≈ 70,98 m (resposta da 5ª questão). O observador começa em P₁ (60°) e anda 30 m até P₂ (45°)."));
    function draw(d) {
      var th = Math.atan(H / d);
      var O = P(X - d * k, G), T = P(X, G - H * k);
      var h = line(P(0, G), P(440, G), "stroke:var(--muted);stroke-width:2");
      h += '<rect x="' + X + '" y="' + f1(G - H * k) + '" width="30" height="' + f1(H * k) + '" style="fill:var(--pen-soft);stroke:var(--ink);stroke-width:1.5"/>';
      [[d1, "P₁"], [d2, "P₂"]].forEach(function (p) { var x = X - p[0] * k; h += line(P(x, G - 6), P(x, G + 6), ST.thin) + txt(x, G + 18, p[1], ST.tmut); });
      h += line(O, T, "stroke:var(--op);stroke-width:2.2");
      h += line(O, P(X, G), "stroke:var(--adj);stroke-width:3");
      h += arcPath(O, P(X, G), T, 40, "stroke:var(--ang)", fmt(th / D2R, 1) + "°", 62);
      h += '<circle cx="' + f1(O.x) + '" cy="' + f1(O.y - 7) + '" r="6" style="fill:var(--ink)"/>';
      h += txt(X + 44, G - H * k / 2, "H", "fill:var(--hip);font-weight:800;font-size:17px");
      h += txt((O.x + X) / 2, G - 12, "d = " + fmt(d, 1) + " m", ST.tadj);
      S.innerHTML = h;
      vd.textContent = fmt(d, 2) + " m"; va.textContent = fmt(th / D2R, 1) + "°"; vt.textContent = fmt(H, 2) + " / " + fmt(d, 2) + " = " + fmt(H / d, 3);
    }
    draw(d1);
  };

  LABS.chamine = function (host) {
    var scene = el("div", { class: "scene" }); host.appendChild(scene);
    var S = svg("0 0 440 300"); scene.appendChild(S);
    var ctr = el("div", { class: "ctrls" }); host.appendChild(ctr);
    var sa = slider(ctr, "α (abaixo)", 5, 45, 1, 20, "°"), sb = slider(ctr, "β (acima)", 5, 70, 1, 45, "°"), sh = slider(ctr, "h = BC", 1, 10, 0.5, 4, " m");
    var rd = el("div", { class: "readout" }); host.appendChild(rd);
    var vAB = ro(rd, "AB = h ÷ tg α"), vBD = ro(rd, "BD = AB · tg β"), vH = ro(rd, "H = h + BD", false), vF = ro(rd, "fórmula", true);
    function draw() {
      var al = +sa.value * D2R, be = +sb.value * D2R, h = +sh.value;
      var AB = h / Math.tan(al), BD = AB * Math.tan(be), Ht = h + BD;
      var s = Math.min(300 / AB, 250 / Ht);
      var yB = 20 + BD * s, A = P(50, yB), B = P(50 + AB * s, yB), C = P(B.x, yB + h * s), D = P(B.x, yB - BD * s);
      var g = "";
      g += '<rect x="' + f1(B.x) + '" y="' + f1(D.y) + '" width="16" height="' + f1(C.y - D.y) + '" style="fill:var(--pen-soft);stroke:var(--ink);stroke-width:1.2"/>';
      g += line(A, D, ST.ink) + line(A, C, ST.ink) + line(A, B, "stroke:var(--adj);stroke-width:3");
      g += line(B, C, "stroke:var(--op);stroke-width:3.5") + line(B, D, "stroke:var(--hip);stroke-width:3.5");
      g += rightMark(B, A, D, 10);
      g += arcPath(A, B, D, 56, "stroke:var(--f)", "β", 70, "fill:var(--f);font-weight:700;font-size:15px");
      g += arcPath(A, B, C, 76, "stroke:var(--f)", "α", 90, "fill:var(--f);font-weight:700;font-size:15px");
      g += txt(A.x - 12, A.y, "A", ST.tink) + txt(B.x - 10, B.y - 12, "B", ST.tink) + txt(C.x, C.y + 14, "C", ST.tink) + txt(D.x, D.y - 10, "D", ST.tink);
      g += txt(B.x + 26, (B.y + C.y) / 2, "h", ST.top, "start") + txt(B.x + 26, (B.y + D.y) / 2, "BD", ST.thip, "start");
      S.innerHTML = g;
      vAB.textContent = fmt(AB) + " m"; vBD.textContent = fmt(BD) + " m"; vH.textContent = fmt(Ht) + " m";
      vF.innerHTML = tex("H=h\\left(1+\\frac{\\tg\\beta}{\\tg\\alpha}\\right)=" + tfmt(h, 1) + "\\left(1+\\frac{" + tfmt(Math.tan(be), 3) + "}{" + tfmt(Math.tan(al), 3) + "}\\right)\\approx" + tfmt(Ht));
    }
    [sa, sb, sh].forEach(function (x) { x.addEventListener("input", draw); }); draw();
  };

  LABS.altura = function (host) {
    var scene = el("div", { class: "scene" }); host.appendChild(scene);
    var S = svg("0 0 440 250"); scene.appendChild(S);
    var ctr = el("div", { class: "ctrls" }); host.appendChild(ctr);
    var sC = slider(ctr, "Ângulo Ĉ", 15, 75, 1, 30, "°");
    var rd = el("div", { class: "readout" }); host.appendChild(rd);
    var vx = ro(rd, "x = BH"), vy = ro(rd, "y = HC"), vh = ro(rd, "h = AH"), vr = ro(rd, "y / x"), vt = ro(rd, "tg² B̂");
    function draw() {
      var Cd = +sC.value, Bd = 90 - Cd, BC = 10, L = 360;
      var x = BC * Math.pow(Math.cos(Bd * D2R), 2), y = BC - x, hh = Math.sqrt(x * y);
      var s = L / BC, B = P(40, 225), C = P(40 + L, 225), Hh = P(40 + x * s, 225), A = P(Hh.x, 225 - hh * s);
      var g = '<path d="M' + f1(B.x) + ' ' + f1(B.y) + ' L' + f1(C.x) + ' ' + f1(C.y) + ' L' + f1(A.x) + ' ' + f1(A.y) + ' Z" style="fill:none;stroke:var(--ink);stroke-width:2"/>';
      g += line(A, Hh, "stroke:var(--f);stroke-width:2;stroke-dasharray:6 4") + rightMark(A, B, C, 10) + rightMark(Hh, C, A, 9);
      g += arcPath(B, C, A, 30, "stroke:var(--adj)", Bd + "°", 46, "fill:var(--adj);font-weight:700;font-size:13px");
      g += arcPath(C, B, A, 34, "stroke:var(--op)", Cd + "°", 52, "fill:var(--op);font-weight:700;font-size:13px");
      g += txt((B.x + Hh.x) / 2, 240, "x", "fill:var(--adj);font-weight:800;font-size:15px") + txt((Hh.x + C.x) / 2, 240, "y", "fill:var(--op);font-weight:800;font-size:15px");
      g += txt(A.x - 10, (A.y + Hh.y) / 2, "h", "fill:var(--f);font-weight:800;font-size:15px", "end");
      g += txt(A.x, A.y - 12, "A", ST.tink) + txt(B.x - 12, B.y, "B", ST.tink) + txt(C.x + 12, C.y, "C", ST.tink);
      S.innerHTML = g;
      vx.textContent = fmt(x); vy.textContent = fmt(y); vh.textContent = fmt(hh);
      vr.textContent = fmt(y / x, 3); vt.textContent = fmt(Math.pow(Math.tan(Bd * D2R), 2), 3);
    }
    sC.addEventListener("input", draw); draw();
    host.appendChild(el("p", { class: "small muted" }, "Hipotenusa BC fixada em 10 unidades."));
  };

  LABS.escada = function (host) {
    var scene = el("div", { class: "scene" }); host.appendChild(scene);
    var S = svg("0 0 440 290"); scene.appendChild(S);
    var ctr = el("div", { class: "ctrls" }); host.appendChild(ctr);
    var sT = slider(ctr, "Ângulo escada–parede θ", 0, 60, 1, 20, "°");
    var alert = el("div", { class: "alert-live", "aria-live": "polite" }); host.appendChild(alert);
    var rd = el("div", { class: "readout" }); host.appendChild(rd);
    var vv = ro(rd, "altura vencida v = 3 cos θ"), vs = ro(rd, "apoio s = 4 − v"), vh = ro(rd, "afastamento 3 sen θ");
    var k = 60, G = 270, W = 330;
    function draw() {
      var th = +sT.value * D2R, v = 3 * Math.cos(th), s = 4 - v, hz = 3 * Math.sin(th);
      var top = P(W, G - 4 * k), base = P(W - hz * k, top.y + v * k);
      var g = line(P(0, G), P(440, G), "stroke:var(--muted);stroke-width:2");
      g += '<rect x="' + W + '" y="' + f1(G - 4 * k) + '" width="20" height="' + (4 * k) + '" style="fill:var(--pen-soft);stroke:var(--ink);stroke-width:1.5"/>';
      g += '<path d="M' + (W - 20) + ' ' + f1(G - 4 * k) + ' L' + (W + 55) + ' ' + f1(G - 4 * k - 22) + ' L' + (W + 110) + ' ' + f1(G - 4 * k) + '" style="fill:none;stroke:var(--ink);stroke-width:2"/>';
      g += '<rect x="' + f1(base.x - 24) + '" y="' + f1(base.y) + '" width="40" height="' + f1(Math.max(0, G - base.y)) + '" style="fill:var(--amber-soft);stroke:var(--amber);stroke-width:1.5"/>';
      g += line(P(W, base.y), top, ST.dash) + line(base, P(W, base.y), ST.dash);
      g += line(base, top, "stroke:var(--hip);stroke-width:5;stroke-linecap:round");
      if (th > 0.02) g += arcPath(top, base, P(W, base.y), 36, "stroke:var(--ang)", sT.value + "°", 52);
      g += txt(W + 32, G - 2 * k, "4 m", ST.tink, "start");
      g += txt(W - 8, (top.y + base.y) / 2, "v", ST.tadj, "end");
      g += txt(base.x - 30, (base.y + G) / 2, "s", "fill:var(--amber);font-weight:800;font-size:15px", "end");
      S.innerHTML = g;
      vv.textContent = fmt(v) + " m"; vs.textContent = fmt(s) + " m"; vh.textContent = fmt(hz) + " m";
      if (+sT.value < 20) { alert.className = "alert-live bad"; alert.textContent = "θ < 20°: segundo o enunciado, a escada cai. Ângulo não permitido."; }
      else if (+sT.value === 20) { alert.className = "alert-live good"; alert.textContent = "θ = 20°: menor ângulo permitido ⇒ menor apoio possível, s ≈ " + fmt(s) + " m (resposta da 7ª questão)."; }
      else { alert.className = "alert-live good"; alert.textContent = "θ > 20°: seguro, mas v diminui e o apoio precisa ser mais alto (s ≈ " + fmt(s) + " m)."; }
    }
    sT.addEventListener("input", draw); draw();
  };

  // jogo da tabela de ângulos notáveis
  function initTableGame(host) {
    var vals = { "\\tfrac12": 0.5, "\\tfrac{\\sqrt2}{2}": Math.SQRT1_2, "\\tfrac{\\sqrt3}{2}": Math.sqrt(3) / 2, "\\tfrac{\\sqrt3}{3}": Math.sqrt(3) / 3, "1": 1, "\\sqrt3": Math.sqrt(3) };
    var keys = Object.keys(vals);
    var box = el("div", { class: "lab" }, '<div class="lh"><span class="lt">Treino rápido</span><h4>Qual é o valor?</h4></div>');
    host.appendChild(box);
    var q = el("p", { class: "ex-q" }); box.appendChild(q);
    var opts = el("div", { class: "btns" }); box.appendChild(opts);
    var fb = el("div", { class: "fb", role: "status" }); fb.hidden = true; box.appendChild(fb);
    var bar = el("div", { class: "btns" }); box.appendChild(bar);
    var nb = el("button", { class: "b main", type: "button" }, "Próxima"); bar.appendChild(nb);
    var sc = el("span", { class: "small muted" }); bar.appendChild(sc);
    var hits = 0, tries = 0, cur, locked;
    var WHY = {
      30: "Metade do equilátero: oposto 1, adjacente √3, hipotenusa 2.",
      45: "Metade do quadrado: catetos 1 e 1, hipotenusa √2.",
      60: "Metade do equilátero: oposto √3, adjacente 1, hipotenusa 2."
    };
    function gen() {
      var angs = [30, 45, 60], fns = ["sen", "cos", "tg"];
      cur = { a: angs[Math.floor(Math.random() * 3)], f: fns[Math.floor(Math.random() * 3)] };
      locked = false; fb.hidden = true;
      q.innerHTML = tex("\\" + (cur.f === "sen" ? "sen" : cur.f === "cos" ? "cos" : "tg") + "\\," + cur.a + "^\\circ=\\;?");
      opts.innerHTML = "";
      keys.forEach(function (k) {
        var b = el("button", { class: "b", type: "button" }, tex(k));
        b.addEventListener("click", function () { pick(k, b); });
        opts.appendChild(b);
      });
    }
    function pick(k, b) {
      if (locked) return; locked = true; tries++;
      var right = EXACT[cur.a][cur.f], ok = k === right; if (ok) hits++;
      $$("button", opts).forEach(function (x) { x.disabled = true; });
      b.className = "b " + (ok ? "on" : "off");
      if (!ok) $$("button", opts)[keys.indexOf(right)].className = "b on";
      fb.className = "fb " + (ok ? "y" : "n");
      fb.innerHTML = '<b class="t">' + (ok ? "Certo!" : "Não.") + "</b>" + WHY[cur.a] + " " + tex("\\" + cur.f + "\\," + cur.a + "^\\circ=" + right);
      fb.hidden = false; sc.textContent = "Acertos: " + hits + "/" + tries;
    }
    nb.addEventListener("click", gen);
    gen();
  }

  // ---------------------------------------------------------------- início
  function init() {
    document.documentElement.classList.add("js");
    try { document.fonts.forEach(function (f) { f.load(); }); } catch (e) { }
    renderMath(document.body);
    initTheme();
    addModuleNav();
    initReveal();
    initQuiz();
    initChecks();
    $$(".lab[data-lab]").forEach(function (h) {
      var f = LABS[h.getAttribute("data-lab")];
      try { if (f) f(h); } catch (e) { h.appendChild(el("p", { class: "small cf" }, "Não foi possível carregar este laboratório neste navegador.")); if (window.console) console.error(e); }
    });
    $$(".chkgame[data-game=tabela]").forEach(initTableGame);
    updateCards();
    window.addEventListener("hashchange", route);
    route();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
