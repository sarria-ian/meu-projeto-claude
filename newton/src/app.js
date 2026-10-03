/* Motor da apostila: navegação, gamificação (XP, níveis, estrelas, conquistas),
   verificações, desafios, listas, simulado e perfil. Tudo local (localStorage). */
(function () {
  "use strict";
  var MACROS = { "\\sen": "\\operatorname{sen}", "\\tg": "\\operatorname{tg}", "\\cotg": "\\operatorname{cotg}", "\\cossec": "\\operatorname{cossec}", "\\arcsen": "\\operatorname{arcsen}" };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, html) { var e = document.createElement(tag); if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }
  function tex(s, d) { try { return katex.renderToString(s, { displayMode: !!d, throwOnError: false, macros: MACROS }); } catch (e) { return s; } }
  function renderMath(root) {
    if (window.renderMathInElement) renderMathInElement(root, { delimiters: [{ left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }], macros: MACROS, throwOnError: false });
  }
  window.T = { tex: tex, el: el, $: $, $$: $$, MACROS: MACROS, renderMath: renderMath };

  // ------------------------------------------------------------ ícones
  var IC = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    book: '<path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M4 17a3 3 0 0 1 3-3h11"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-4 5-4 7-1-1-2-2-2-4-2 2-3 5-3 9 0 4 3 7 7 7z"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    medal: '<circle cx="12" cy="15" r="6"/><path d="M8 3l4 6 4-6"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    sound: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
    mute: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>',
    moon: '<path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z"/>',
    tri: '<path d="M4 20h16L4 6z"/><path d="M4 16h4v4"/>',
    circle: '<circle cx="12" cy="12" r="8"/><path d="M12 12l6-4"/><path d="M2 12h20M12 2v20"/>',
    angle: '<path d="M4 20h16"/><path d="M4 20L16 6"/><path d="M10 20a6 6 0 0 0-2-4.5"/>',
    ruler: '<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
    wave: '<path d="M2 12c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-4 5-3"/>',
    tan: '<path d="M4 21c2-2 4-5 4-9S6 5 4 3"/><path d="M14 21c2-2 4-5 4-9s-2-7-4-9"/><path d="M11 3v18"/>',
    mirror: '<path d="M12 3v18"/><path d="M4 7l5 5-5 5z"/><path d="M20 7l-5 5 5 5z"/>',
    link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
    area: '<path d="M4 20L12 4l8 16z"/><path d="M12 4v16"/>',
    check: '<path d="M4 12l5 5L20 6"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M16 5h3a3 3 0 0 1-3 4M8 5H5a3 3 0 0 0 3 4"/><path d="M12 13v4M8 21h8"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    arrowL: '<path d="M15 5l-7 7 7 7"/>', arrowR: '<path d="M9 5l7 7-7 7"/>',
    sigma: '<path d="M18 4H6l6 8-6 8h12"/>',
    pow: '<path d="M4 20l6-12 6 12"/><path d="M15 4h4l-4 5h4"/>',
    fact: '<path d="M12 3v12"/><circle cx="12" cy="20" r="1.4"/><path d="M6 8h3M15 8h3"/>',
    combo: '<circle cx="6" cy="7" r="2.5"/><circle cx="18" cy="7" r="2.5"/><circle cx="12" cy="17" r="2.5"/><path d="M8 8.5l2.5 6M16 8.5l-2.5 6"/>',
    expand: '<path d="M4 12h6M14 12h6M17 9l3 3-3 3M7 9l-3 3 3 3"/>',
    dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2"/><circle cx="15" cy="15" r="1.2"/><circle cx="15" cy="9" r="1.2"/><circle cx="9" cy="15" r="1.2"/>'
  };
  function icon(n, cls) { return '<svg class="ic ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + (IC[n] || IC.star) + "</svg>"; }
  T.icon = icon;

  // ------------------------------------------------------------ estado
  var KEY = "newton-cap2-v1";
  var S = { name: "", xp: 0, days: {}, streak: 0, lastDay: "", daily: {}, dailyBonus: {}, run: 0, bestRun: 0, firstTry: 0,
    qs: {}, theory: {}, des: {}, lists: {}, games: {}, ach: {}, sim: 0, sound: true };
  try { var raw = localStorage.getItem(KEY); if (raw) { var o = JSON.parse(raw); for (var k in o) S[k] = o[k]; } } catch (e) { }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  function today() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function yesterday() { var d = new Date(); d.setDate(d.getDate() - 1); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }

  // níveis: do nível n para n+1 são necessários 100 + 50(n−1) XP
  var TITLES = ["Calouro", "Aprendiz", "Contador", "Combinador", "Construtor de Pascal", "Expansor", "Caçador de Termos", "Mestre dos Coeficientes", "Combinatorista", "Lenda de Newton"];
  function levelInfo(xp) {
    var n = 1, base = 0, need = 100;
    while (xp >= base + need) { base += need; n++; need = 100 + 50 * (n - 1); }
    return { n: n, into: xp - base, need: need, title: TITLES[Math.min(n - 1, TITLES.length - 1)] };
  }
  var DAILY_GOAL = 60;

  // ------------------------------------------------------------ som
  var AC = null;
  function beep(kind) {
    if (!S.sound) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var seq = kind === "ok" ? [660, 880] : kind === "bad" ? [300, 220] : kind === "lvl" ? [523, 659, 784, 1046] : [700];
      seq.forEach(function (f, i) {
        var o = AC.createOscillator(), g = AC.createGain(), t0 = AC.currentTime + i * 0.09;
        o.frequency.value = f; o.type = kind === "bad" ? "sawtooth" : "sine";
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
        o.connect(g); g.connect(AC.destination); o.start(t0); o.stop(t0 + 0.18);
      });
    } catch (e) { }
  }
  T.beep = beep;

  // ------------------------------------------------------------ toasts
  function toast(msg, gold) {
    var box = $(".toasts"); var t = el("div", { class: "toast" + (gold ? " gold" : "") }, msg);
    box.appendChild(t); setTimeout(function () { t.remove(); }, 2600);
  }
  T.toast = toast;

  // ------------------------------------------------------------ XP
  function touchDay() {
    var d = today();
    if (S.lastDay !== d) {
      S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1;
      S.lastDay = d; S.days[d] = 1;
    }
  }
  function addXP(n, why) {
    if (!n) return;
    var before = levelInfo(S.xp).n;
    touchDay();
    S.xp += n; var d = today(); S.daily[d] = (S.daily[d] || 0) + n;
    toast(icon("bolt") + " +" + n + " XP" + (why ? ": " + why : ""));
    if (S.daily[d] >= DAILY_GOAL && !S.dailyBonus[d]) { S.dailyBonus[d] = 1; S.xp += 15; setTimeout(function () { toast(icon("target") + " Meta do dia cumprida! +15 XP", true); }, 500); }
    var after = levelInfo(S.xp).n;
    if (after > before) { setTimeout(function () { beep("lvl"); toast(icon("medal") + " Nível " + after + ": " + levelInfo(S.xp).title, true); }, 900); }
    save(); checkAch(); updateTop();
  }
  T.addXP = addXP; T.S = S; T.save = save;
  function streakHit(ok) {
    if (ok) { S.run++; if (S.run > S.bestRun) S.bestRun = S.run; } else S.run = 0;
  }

  // ------------------------------------------------------------ módulos e estrelas
  function mods() { return $$("section.mod"); }
  function modQs(m) { return $$(".verif .q", m); }
  function modStars(m) {
    var id = m.id, qs = modQs(m), ok = qs.filter(function (q) { return S.qs[q.dataset.id] && S.qs[q.dataset.id].ok; }).length;
    var s = 0;
    if (S.theory[id] && ok >= Math.min(3, qs.length)) s = 1;
    if (s === 1 && ok === qs.length) s = 2;
    var d = S.des[id];
    if (s === 2 && d && d.perfect) s = 3;
    return { stars: s, ok: ok, total: qs.length };
  }
  function starsHTML(n) { var h = '<span class="stars" aria-label="' + n + ' de 3 estrelas">'; for (var i = 0; i < 3; i++) h += '<span class="' + (i < n ? "on" : "") + '">' + icon("star") + "</span>"; return h + "</span>"; }
  function totalStars() { return mods().reduce(function (a, m) { return a + modStars(m).stars; }, 0); }

  // ------------------------------------------------------------ conquistas
  function listsDone(n) { var items = $$("#lista" + n + " .li"); var ok = items.filter(function (i) { return S.lists[i.dataset.id]; }).length; return { ok: ok, total: items.length }; }
  function modsWith3(ids) { return ids.every(function (id) { var m = document.getElementById(id); return m && modStars(m).stars === 3; }); }
  var ACH = [
    ["primeiro", "Primeiro Passo", "Ganhe seus primeiros XP", "spark", function () { return S.xp > 0; }],
    ["teoria3", "Leitor Atento", "Estude a teoria de 3 módulos", "book", function () { return Object.keys(S.theory).length >= 3; }],
    ["afiado", "Afiado", "5 acertos seguidos", "bolt", function () { return S.bestRun >= 5; }],
    ["maquina", "Máquina de Acertos", "15 acertos seguidos", "bolt", function () { return S.bestRun >= 15; }],
    ["cinco", "Cinco de Primeira", "5 verificações certas na 1ª tentativa", "target", function () { return S.firstTry >= 5; }],
    ["modulo", "Mestre de Módulo", "3 estrelas em um módulo", "star", function () { return mods().some(function (m) { return modStars(m).stars === 3; }); }],
    ["mbase", "Base Sólida", "3 estrelas nos módulos 1 a 3", "sigma", function () { return modsWith3(["m1", "m2", "m3"]); }],
    ["mpascal", "Arquiteto de Pascal", "3 estrelas no módulo 4", "tri", function () { return modsWith3(["m4"]); }],
    ["mnewton", "Discípulo de Newton", "3 estrelas nos módulos 5 a 7", "star", function () { return modsWith3(["m5", "m6", "m7"]); }],
    ["mavanc", "Nível Avançado", "3 estrelas nos módulos 8 e 9", "trophy", function () { return modsWith3(["m8", "m9"]); }],
    ["mlivro", "Leitor do Iezzi", "3 estrelas no módulo 10", "book", function () { return modsWith3(["m10"]); }],
    ["desafiante", "Desafiante", "Gabarite uma Hora do desafio", "trophy", function () { return Object.keys(S.des).some(function (k) { return S.des[k].perfect; }); }],
    ["lista1", "Lista 1 Completa", "Marque todas as questões da Lista 1", "list", function () { var d = listsDone(1); return d.total && d.ok === d.total; }],
    ["listas3", "Maratonista", "Complete 3 listas", "list", function () { var c = 0; $$("section.lista").forEach(function (l) { var d = listsDone(l.dataset.num); if (d.total && d.ok === d.total) c++; }); return c >= 3; }],
    ["listas6", "Todas as Listas", "Complete todas as listas e avaliações", "trophy", function () { return $$("section.lista").every(function (l) { var d = listsDone(l.dataset.num); return d.total && d.ok === d.total; }); }],
    ["meta", "Meta do Dia", "Faça 60 XP em um dia", "target", function () { return Object.keys(S.dailyBonus).length > 0; }],
    ["seq3", "Sequência 3 dias", "Estude 3 dias seguidos", "flame", function () { return S.streak >= 3; }],
    ["seq7", "Sequência 7 dias", "Estude 7 dias seguidos", "flame", function () { return S.streak >= 7; }],
    ["jogador", "Jogador", "Jogue os 4 jogos", "spark", function () { return ["pascal", "fat", "comb", "coef"].every(function (g) { return S.games[g] != null; }); }],
    ["relampago", "Relâmpago", "Faça 8 pontos ou mais em um jogo", "bolt", function () { for (var k in S.games) if (S.games[k] >= 8) return true; return false; }],
    ["simulado", "Aprovado", "Acerte 8 de 10 no simulado", "medal", function () { return S.sim >= 8; }],
    ["n5", "Nível 5", "Chegue ao nível 5", "medal", function () { return levelInfo(S.xp).n >= 5; }],
    ["n10", "Nível 10", "Chegue ao nível 10", "medal", function () { return levelInfo(S.xp).n >= 10; }]
  ];
  function checkAch() {
    ACH.forEach(function (a) {
      if (!S.ach[a[0]] && a[4]()) { S.ach[a[0]] = today(); save(); setTimeout(function () { beep("lvl"); toast(icon("trophy") + " Nova conquista: " + a[1], true); }, 1200); }
    });
  }

  // ------------------------------------------------------------ topo
  function updateTop() {
    var L = levelInfo(S.xp);
    $("#tLvl").textContent = "Nv. " + L.n;
    $("#tLvlBar").style.width = Math.round(100 * L.into / L.need) + "%";
    $("#tFire").lastChild.textContent = String(S.lastDay === today() || S.lastDay === yesterday() ? S.streak : 0);
    $("#tSound").innerHTML = icon(S.sound ? "sound" : "mute");
    $("#tSound").setAttribute("aria-label", S.sound ? "Desligar sons" : "Ligar sons");
  }

  // ------------------------------------------------------------ navegação
  var cur = "";
  function show(id, anchor) {
    var page = document.getElementById(id);
    if (!page || !page.classList.contains("page")) { id = "inicio"; page = $("#inicio"); }
    $$(".page").forEach(function (p) { p.classList.toggle("on", p === page); });
    var nav = page.classList.contains("mod") ? "modulos" : page.classList.contains("lista") ? "listas" : id;
    $$(".nav a").forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + nav); });
    if (id === "inicio") renderHome();
    if (id === "modulos") renderMods();
    if (id === "listas") renderListas();
    if (id === "perfil") renderPerfil();
    if (page.classList.contains("lista")) updListProg(page);
    cur = id;
    if (anchor) { var a = document.getElementById(anchor); if (a) { a.scrollIntoView(); setTimeout(function () { a.scrollIntoView(); }, 250); return; } }
    window.scrollTo(0, 0);
  }
  function route() {
    var h = decodeURIComponent(location.hash.slice(1)) || "inicio";
    var t = document.getElementById(h);
    if (!t) return show("inicio");
    var p = t.classList.contains("page") ? t : t.closest(".page");
    if (!p) return show("inicio");
    show(p.id, p === t ? null : h);
  }

  // ------------------------------------------------------------ página inicial
  function nextModule() {
    var ms = mods();
    for (var i = 0; i < ms.length; i++) if (modStars(ms[i]).stars < 3) return ms[i];
    return ms[0];
  }
  function statTile(ic, val, lbl, extra) { return '<div class="stat ' + (extra || "") + '"><span class="si">' + icon(ic) + "</span><div><b>" + val + "</b><span>" + lbl + "</span></div></div>"; }
  function renderHome() {
    var L = levelInfo(S.xp), nm = nextModule(), d = today();
    var totalQ = $$(".verif .q").length, okQ = $$(".verif .q").filter(function (q) { return S.qs[q.dataset.id] && S.qs[q.dataset.id].ok; }).length;
    var st = S.lastDay === d || S.lastDay === yesterday() ? S.streak : 0;
    var h = '<div class="hello"><div style="display:grid;gap:10px;align-content:start">' +
      '<div class="eyebrow">Binômio de Newton · Capítulo II com as listas 230–335 resolvidas</div><h1>Olá' + (S.name ? ", " + esc(S.name) : "") + "!</h1>" +
      '<div class="btns"><b>Nível ' + L.n + '</b><span class="tag" style="background:var(--pri-soft);color:var(--pri)">' + L.title + '</span><span class="muted">' + S.xp + " XP no total</span></div>" +
      '<div class="pbar"><b style="width:' + Math.round(100 * L.into / L.need) + '%"></b></div><span class="small muted">' + L.into + " / " + L.need + " XP para o nível " + (L.n + 1) + "</span>" +
      '<div class="btns"><a class="btn p" href="#' + nm.id + '">' + icon("play") + " Continuar: " + nm.dataset.short + "</a><a class=\"btn\" href=\"#modulos\">" + icon("book") + " Ver módulos</a><a class=\"btn\" href=\"#listas\">" + icon("list") + " Listas do livro (106 exercícios)</a><a class=\"btn\" href=\"#m10\">Mapa do capítulo</a></div></div>" +
      '<div class="stats">' + statTile("target", Math.min(S.daily[d] || 0, DAILY_GOAL) + "/" + DAILY_GOAL + " XP", "Meta do dia (+15 XP)", "wide") +
      statTile("flame", st + " dia(s)", "Sequência") + statTile("bolt", S.bestRun, "Recorde de acertos seguidos") +
      statTile("star", totalStars() + "/" + mods().length * 3, "Estrelas") + statTile("trophy", Object.keys(S.ach).length + "/" + ACH.length, "Conquistas") + "</div></div>";
    // capítulo
    h += '<div class="sechead"><span class="si">' + icon("book") + '</span><div><h2>Binômio de Newton</h2><p>' + mods().length + " módulos · " + okQ + "/" + totalQ + " verificações certas</p></div></div>";
    h += '<div class="grid g3">';
    PARTS().forEach(function (p) {
      var ms = mods().filter(function (m) { return m.dataset.part === p; });
      var sts = ms.reduce(function (a, m) { return a + modStars(m).stars; }, 0);
      h += '<div class="card mc"><div class="h"><span class="mi">' + icon(ms[0].dataset.icon) + '</span><span class="k">' + ms.length + (ms.length === 1 ? " módulo" : " módulos") + "</span>" + starsHTML(Math.round(3 * sts / (3 * ms.length))) + "</div><h3>" + p + "</h3><p>" + ms.map(function (m) { return m.dataset.short; }).join(" · ") + '</p><div class="pbar"><b style="width:' + Math.round(100 * sts / (3 * ms.length)) + '%"></b></div><div class="btns"><a class="btn p s" href="#' + ms[0].id + '">Estudar</a></div></div>';
    });
    h += "</div>";
    // jogar
    h += '<div class="sechead"><span class="si">' + icon("spark") + '</span><div><h2>Jogar</h2><p>Desafios, jogos rápidos e simulado</p></div></div><div class="grid g3">' +
      tile("#jogar", "tri", "Pascal Relâmpago", "Complete o número que falta no Triângulo de Pascal") +
      tile("#jogar", "bolt", "Fatorial Turbo", "Simplifique frações com fatorial contra o relógio") +
      tile("#jogar", "target", "Coeficiente Certo", "Ache o coeficiente de um termo do binômio") +
      tile("#simulado", "medal", "Simulado", "10 questões sorteadas de todos os módulos") + "</div>";
    // desafio do dia
    h += '<div class="sechead"><span class="si">' + icon("cal") + '</span><div><h2>Desafio do dia</h2><p>Uma questão nova por dia · 10 XP de primeira</p></div></div><div id="daily"></div>';
    // conquistas
    h += '<div class="sechead"><span class="si">' + icon("trophy") + "</span><div><h2>Conquistas</h2><p>" + Object.keys(S.ach).length + " de " + ACH.length + ' desbloqueadas</p></div></div><div class="ach">' + ACH.slice(0, 8).map(achHTML).join("") + '</div><p style="margin-top:10px"><a href="#perfil">Ver todas</a></p>';
    $("#homeBox").innerHTML = h;
    // desafio do dia
    var pool = $$(".verif .q"); if (pool.length) {
      var seed = 0; for (var i = 0; i < d.length; i++) seed = (seed * 31 + d.charCodeAt(i)) % 100003;
      var src = pool[seed % pool.length], q = cloneQ(src, "dia-" + d);
      var mod = src.closest(".mod");
      q.querySelector(".qn").textContent = mod.dataset.short + " · " + (src.querySelector(".qn") ? src.querySelector(".qn").textContent : "");
      $("#daily").appendChild(q); initVerifQ(q, { daily: true });
    }
  }
  function tile(href, ic, t, d) { return '<a class="card mc" href="' + href + '" style="text-decoration:none;color:inherit"><div class="h"><span class="mi">' + icon(ic) + "</span></div><h3>" + t + "</h3><p>" + d + "</p></a>"; }
  function achHTML(a) { return '<div class="ac ' + (S.ach[a[0]] ? "on" : "") + '"><span class="ai">' + icon(a[3]) + "</span><div><b>" + a[1] + "</b><span>" + a[2] + "</span></div></div>"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function PARTS() { var p = []; mods().forEach(function (m) { if (p.indexOf(m.dataset.part) < 0) p.push(m.dataset.part); }); return p; }

  // ------------------------------------------------------------ lista de módulos
  function renderMods() {
    var h = '<div class="btns small muted" style="gap:14px;margin-bottom:6px"><span>' + starsHTML(1) + " teoria estudada + 3 acertos</span><span>" + starsHTML(2) + " todas as verificações</span><span>" + starsHTML(3) + " Hora do desafio gabaritada</span></div>";
    PARTS().forEach(function (p) {
      h += '<div class="part-t">' + p + '</div><div class="grid g3">';
      mods().filter(function (m) { return m.dataset.part === p; }).forEach(function (m) {
        var s = modStars(m);
        h += '<div class="card mc"><div class="h"><span class="mi">' + icon(m.dataset.icon) + '</span><span class="k">Módulo ' + m.dataset.num + "</span>" + starsHTML(s.stars) + "</div><h3>" + m.dataset.short + "</h3><p>" + m.dataset.desc + '</p><div class="pbar"><b style="width:' + Math.round(100 * s.ok / Math.max(1, s.total)) + '%"></b></div><div class="btns"><a class="btn p s" href="#' + m.id + '">Estudar (' + s.ok + "/" + s.total + ")</a>" + (S.theory[m.id] ? '<span class="tag f">teoria ✓</span>' : "") + "</div></div>";
      });
      h += "</div>";
    });
    $("#modBox").innerHTML = h;
    renderMath($("#modBox"));
  }

  // ------------------------------------------------------------ listas
  function renderListas() {
    var h = '<div class="grid g3">';
    $$("section.lista").forEach(function (l) {
      var n = l.dataset.num, d = listsDone(n);
      h += '<div class="card mc"><div class="h"><span class="mi">' + icon("list") + '</span><span class="k">' + (l.dataset.kicker || "Lista " + n) + '</span><span class="tag">' + d.ok + "/" + d.total + "</span></div><h3>" + l.dataset.short + "</h3><p>" + l.dataset.desc + '</p><div class="pbar"><b style="width:' + Math.round(100 * d.ok / Math.max(1, d.total)) + '%"></b></div><div class="btns"><a class="btn p s" href="#' + l.id + '">Abrir lista</a></div></div>';
    });
    $("#listBox").innerHTML = h + "</div>";
  }
  function updListProg(page) {
    var n = page.dataset.num, d = listsDone(n), pb = $(".lprog", page);
    if (pb) pb.innerHTML = '<div class="pbar" style="flex:1;min-width:120px"><b style="width:' + Math.round(100 * d.ok / Math.max(1, d.total)) + '%"></b></div><b>' + d.ok + "/" + d.total + "</b>";
  }
  function initLists() {
    $$(".li").forEach(function (li) {
      var id = li.dataset.id, lh = $(".lh", li);
      var btns = el("div", { class: "btns" });
      var bA = el("button", { class: "btn s", type: "button" }, icon("eye") + " Ver resposta");
      var hasSol = !!$(".sol", li);
      var bS = el("button", { class: "btn s", type: "button" }, icon("list") + " Resolução passo a passo");
      var bOk = el("button", { class: "btn s", type: "button" }, icon("check") + " Acertei");
      var bNo = el("button", { class: "btn s", type: "button" }, "Errei, vou revisar");
      btns.appendChild(bA); if (hasSol) btns.appendChild(bS); btns.appendChild(bOk); btns.appendChild(bNo);
      var a = $(".li-a", li); li.insertBefore(btns, a);
      var stt = el("span", { class: "status" }); lh.appendChild(stt);
      function paint() {
        var v = S.lists[id];
        li.classList.toggle("done-ok", v === "ok"); li.classList.toggle("done-bad", v === "bad");
        stt.className = "status " + (v || ""); stt.textContent = v === "ok" ? "acertei" : v === "bad" ? "revisar" : "";
        stt.hidden = !v;
      }
      bA.onclick = function () { a.classList.toggle("show"); };
      bS.onclick = function () { $(".sol", li).classList.toggle("show"); a.classList.add("show"); };
      bOk.onclick = function () { var first = !S.lists[id]; if (S.lists[id] !== "ok") { S.lists[id] = "ok"; save(); if (first) addXP(5, "questão da lista"); else addXP(3, "questão revisada"); checkAch(); } paint(); updListProg(li.closest(".lista")); };
      bNo.onclick = function () { if (!S.lists[id]) { S.lists[id] = "bad"; save(); addXP(1, "tentativa registrada"); } else if (S.lists[id] !== "ok") { S.lists[id] = "bad"; save(); } paint(); a.classList.add("show"); updListProg(li.closest(".lista")); };
      paint();
    });
  }

  // ------------------------------------------------------------ questões
  var LET = "ABCDEFG";
  function buildOpts(q) {
    var ol = $("ol.opts", q); if (!ol || ol.dataset.built) return;
    ol.dataset.built = 1;
    $$("li", ol).forEach(function (li, i) {
      var b = el("button", { class: "opt", type: "button", "data-k": LET[i] }, '<span class="L">' + LET[i] + '</span><span class="v"></span>');
      while (li.firstChild) b.lastChild.appendChild(li.firstChild);
      li.appendChild(b);
    });
  }
  function cloneQ(src, newId) {
    var q = src.cloneNode(true); q.dataset.id = newId;
    $$(".fb,.qbtns,.xp", q).forEach(function (x) { x.remove(); });
    $$(".opt", q).forEach(function (b) { b.disabled = false; b.classList.remove("right", "wrong"); });
    var s = $(".sol", q); if (s) s.classList.remove("show");
    return q;
  }
  function initVerifQ(q, opt) {
    opt = opt || {};
    buildOpts(q);
    var id = q.dataset.id, ans = q.dataset.ans, sol = $(".sol", q);
    var st = S.qs[id] || { tries: 0, peek: 0, ok: 0 };
    var fb = el("div", { class: "fb", role: "status" }); fb.hidden = true;
    var bar = el("div", { class: "btns qbtns" });
    var bs = el("button", { class: "btn s", type: "button" }, icon("eye") + " Ver resolução passo a passo");
    bar.appendChild(bs);
    q.appendChild(fb); q.appendChild(bar);
    if (sol) q.appendChild(sol);
    var rev = $(".rev", q); if (rev) q.appendChild(rev);
    var opts = $$(".opt", q);
    function markDone() { opts.forEach(function (b) { b.disabled = true; if (b.dataset.k === ans) b.classList.add("right"); }); }
    if (st.ok) { markDone(); fb.hidden = false; fb.className = "fb y"; fb.innerHTML = '<b class="t">Resolvida ✓</b>Você já acertou esta questão.'; }
    bs.onclick = function () { if (sol) sol.classList.toggle("show"); if (!st.ok && !st.peek) { st.peek = 1; S.qs[id] = st; save(); } };
    opts.forEach(function (b) {
      b.onclick = function () {
        if (st.ok) return;
        st.tries++;
        if (b.dataset.k === ans) {
          st.ok = 1; b.classList.add("right"); markDone();
          var xp = st.peek ? 2 : st.tries === 1 ? 10 : st.tries === 2 ? 5 : 2;
          if (st.tries === 1 && !st.peek) S.firstTry++;
          streakHit(st.tries === 1);
          S.qs[id] = st; save(); beep("ok");
          fb.hidden = false; fb.className = "fb y"; fb.innerHTML = '<b class="t">Certo!</b>' + (st.tries === 1 ? "De primeira." : "Acertou na " + st.tries + "ª tentativa.") + " Confira a resolução para fixar o método.";
          addXP(xp, opt.daily ? "desafio do dia" : "verificação");
          if (opt.onDone) opt.onDone();
          refreshModHead(q);
        } else {
          b.classList.add("wrong"); b.disabled = true; streakHit(false); beep("bad");
          S.qs[id] = st; save();
          fb.hidden = false; fb.className = "fb n"; fb.innerHTML = '<b class="t">Ainda não.</b>Tente outra alternativa. A 2ª tentativa vale 5 XP. Se travar, abra a resolução.';
        }
      };
    });
  }
  function refreshModHead(q) { var m = q.closest(".mod"); if (m) paintModHead(m); }

  // desafio (uma questão por vez, uma tentativa)
  function initDesafio(box) {
    var m = box.closest(".mod"), id = m.id, qs = $$(".q", box);
    qs.forEach(buildOpts);
    var head = $(".dh", box), info = el("p", { class: "small muted" }), start = el("button", { class: "btn p", type: "button" }, icon("play") + " Começar desafio");
    var prog = el("div", { class: "dprog" }); qs.forEach(function () { prog.appendChild(el("i")); });
    head.appendChild(start);
    box.insertBefore(info, qs[0]); box.insertBefore(prog, qs[0]);
    var res = el("div", { class: "fb" }); res.hidden = true; box.appendChild(res);
    var i = -1, hits = 0;
    function paintInfo() {
      var d = S.des[id];
      info.textContent = qs.length + " perguntas rápidas e visuais. Uma tentativa por pergunta. Acertos valem 4 XP; completar vale 10 XP e gabaritar, mais 10 XP." + (d ? " Seu melhor: " + d.best + "/" + qs.length + "." : " Ainda não feito.");
    }
    function next() {
      qs.forEach(function (q, k) { q.classList.toggle("cur", k === i); });
      $$("i", prog).forEach(function (x, k) { if (k === i) x.className = "cur"; });
      if (i >= qs.length) finish();
    }
    function finish() {
      var d = S.des[id] || { best: 0, done: 0, perfect: 0 }, bonus = 0;
      if (!d.done) { bonus += 10; d.done = 1; }
      if (hits === qs.length && !d.perfect) { bonus += 10; d.perfect = 1; }
      d.best = Math.max(d.best, hits); S.des[id] = d; save();
      res.hidden = false; res.className = "fb " + (hits === qs.length ? "y" : "n");
      res.innerHTML = '<b class="t">' + hits + " de " + qs.length + "</b>" + (hits === qs.length ? "Desafio gabaritado!" : "Revise os pontos errados e tente de novo.");
      start.hidden = false; start.innerHTML = icon("play") + " Refazer desafio";
      if (bonus) addXP(bonus, "Hora do desafio"); paintInfo(); paintModHead(m); checkAch();
    }
    start.onclick = function () {
      i = 0; hits = 0; res.hidden = true; start.hidden = true;
      $$("i", prog).forEach(function (x) { x.className = ""; });
      qs.forEach(function (q) { $$(".opt", q).forEach(function (b) { b.disabled = false; b.classList.remove("right", "wrong"); }); var f = $(".fb", q); if (f) f.remove(); var nb = $(".nextb", q); if (nb) nb.remove(); });
      next();
    };
    qs.forEach(function (q, k) {
      $$(".opt", q).forEach(function (b) {
        b.onclick = function () {
          var ok = b.dataset.k === q.dataset.ans;
          $$(".opt", q).forEach(function (x) { x.disabled = true; if (x.dataset.k === q.dataset.ans) x.classList.add("right"); });
          if (!ok) b.classList.add("wrong");
          if (ok) { hits++; beep("ok"); var key = "des-" + q.dataset.id; if (!S.qs[key]) { S.qs[key] = { ok: 1 }; addXP(4, "desafio"); } } else beep("bad");
          streakHit(ok);
          $$("i", prog)[k].className = ok ? "ok" : "no";
          var ex = $(".why", q);
          var f = el("div", { class: "fb " + (ok ? "y" : "n") }, '<b class="t">' + (ok ? "Certo!" : "Não foi dessa vez.") + "</b>" + (ex ? ex.innerHTML : ""));
          q.appendChild(f);
          var nb = el("button", { class: "btn p s nextb", type: "button" }, k + 1 < qs.length ? "Próxima" : "Ver resultado");
          nb.onclick = function () { i++; next(); };
          q.appendChild(nb);
        };
      });
    });
    paintInfo();
  }

  // ------------------------------------------------------------ cabeçalho do módulo e teoria
  function paintModHead(m) {
    var s = modStars(m), box = $(".mstars", m);
    if (box) box.innerHTML = starsHTML(s.stars) + '<span class="small muted">' + s.ok + "/" + s.total + " verificações</span>";
  }
  function initModule(m, idx, all) {
    var head = el("div", { class: "mhead" }, '<span class="mi">' + icon(m.dataset.icon) + '</span><div style="flex:1;min-width:0"><div class="eyebrow">' + m.dataset.part + " · Módulo " + m.dataset.num + " de " + all.length + "</div><h1>" + m.dataset.title + '</h1><div class="btns mstars" style="margin-top:6px"></div></div>');
    m.insertBefore(head, m.firstChild);
    // sumário do módulo
    var toc = el("nav", { class: "toc", "aria-label": "Seções do módulo" });
    $$(".sec", m).forEach(function (s, i) {
      if (!s.id) s.id = m.id + "-s" + (i + 1);
      var c = s.cloneNode(true); $$(".katex-mathml,.n", c).forEach(function (x) { x.remove(); });
      toc.appendChild(el("a", { href: "#" + s.id }, s.dataset.toc || c.textContent.trim()));
    });
    var book = $(".book", m); book.insertBefore(toc, book.firstChild);
    // teoria estudada
    var td = $(".theory-done", m);
    if (td) {
      var b = el("button", { class: "btn p", type: "button" });
      td.innerHTML = '<span style="flex:1;min-width:200px"><b>Terminou a teoria?</b><br><span class="small muted">Marque para ganhar 5 XP e liberar a 1ª estrela (com 3 acertos na verificação).</span></span>';
      td.appendChild(b);
      var paint = function () { b.disabled = !!S.theory[m.id]; b.innerHTML = S.theory[m.id] ? icon("check") + " Teoria estudada" : icon("book") + " Marcar teoria como estudada"; };
      b.onclick = function () { if (!S.theory[m.id]) { S.theory[m.id] = 1; save(); addXP(5, "teoria estudada"); paint(); paintModHead(m); } };
      paint();
    }
    $$(".verif .q", m).forEach(function (q) { initVerifQ(q); });
    $$(".desafio", m).forEach(initDesafio);
    // navegação
    var nav = el("div", { class: "mnav" }), prev = all[idx - 1], next = all[idx + 1];
    nav.appendChild(prev ? el("a", { class: "btn", href: "#" + prev.id }, icon("arrowL") + " " + prev.dataset.short) : el("a", { class: "btn", href: "#modulos" }, icon("arrowL") + " Módulos"));
    nav.appendChild(next ? el("a", { class: "btn p", href: "#" + next.id }, next.dataset.short + " " + icon("arrowR")) : el("a", { class: "btn p", href: "#revisao" }, "Revisão final " + icon("arrowR")));
    m.appendChild(nav);
    paintModHead(m);
  }

  // ------------------------------------------------------------ simulado
  function initSimulado() {
    var box = $("#simBox"), btn = $("#simGo");
    btn.onclick = function () {
      var pool = $$("section.mod .verif .q").slice(), pick = [];
      // uma questão de cada módulo primeiro, depois completa até 10
      mods().forEach(function (m) { var qs = modQs(m); if (qs.length) pick.push(qs[Math.floor(Math.random() * qs.length)]); });
      pick = shuffle(pick).slice(0, 10);
      while (pick.length < 10) { var q = pool[Math.floor(Math.random() * pool.length)]; if (pick.indexOf(q) < 0) pick.push(q); }
      box.innerHTML = ""; var hits = 0, done = 0;
      var res = el("div", { class: "fb" }); res.hidden = true;
      pick.forEach(function (src, k) {
        var q = cloneQ(src, "sim-" + k); $(".qn", q).textContent = "Questão " + (k + 1) + " · " + src.closest(".mod").dataset.short;
        var s = $(".sol", q); if (s) s.remove(); var r = $(".rev", q);
        box.appendChild(q);
        $$(".opt", q).forEach(function (b) {
          b.onclick = function () {
            var ok = b.dataset.k === q.dataset.ans; done++; if (ok) hits++;
            $$(".opt", q).forEach(function (x) { x.disabled = true; if (x.dataset.k === q.dataset.ans) x.classList.add("right"); });
            if (!ok) b.classList.add("wrong");
            beep(ok ? "ok" : "bad"); streakHit(ok);
            if (!ok && r) r.hidden = false;
            if (done === pick.length) {
              res.hidden = false; res.className = "fb " + (hits >= 8 ? "y" : "n");
              res.innerHTML = '<b class="t">Resultado: ' + hits + "/10</b>" + (hits >= 8 ? "Excelente! Você domina o conteúdo." : "Use os links “Revise” das questões erradas para voltar à teoria.");
              if (hits > S.sim) S.sim = hits; save(); addXP(hits * 3, "simulado"); checkAch();
              res.scrollIntoView({ block: "center" });
            }
          };
        });
        if (r) r.hidden = true;
      });
      box.appendChild(res);
    };
  }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // ------------------------------------------------------------ perfil
  function renderPerfil() {
    var L = levelInfo(S.xp);
    var qsOk = Object.keys(S.qs).filter(function (k) { return S.qs[k].ok && k.indexOf("des-") < 0 && k.indexOf("dia-") < 0; }).length;
    var lOk = Object.keys(S.lists).filter(function (k) { return S.lists[k] === "ok"; }).length;
    var h = '<div class="card" style="display:grid;gap:12px"><label for="pName" style="font-weight:800">Seu nome (aparece na saudação)</label><div class="btns"><input id="pName" class="inp" style="width:16em" maxlength="30" value="' + esc(S.name) + '"><button class="btn p" id="pSave" type="button">Salvar</button></div></div>';
    h += '<div class="stats" style="margin-top:14px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">' + statTile("medal", "Nível " + L.n, L.title) + statTile("bolt", S.xp + " XP", "Total acumulado") + statTile("check", qsOk, "Verificações certas") + statTile("list", lOk, "Questões de lista certas") + statTile("star", totalStars(), "Estrelas") + statTile("flame", S.bestRun, "Recorde de acertos seguidos") + statTile("cal", Object.keys(S.days).length, "Dias de estudo") + statTile("trophy", S.sim + "/10", "Melhor simulado") + "</div>";
    h += '<div class="sechead"><span class="si">' + icon("trophy") + "</span><div><h2>Conquistas</h2><p>" + Object.keys(S.ach).length + " de " + ACH.length + '</p></div></div><div class="ach">' + ACH.map(achHTML).join("") + "</div>";
    h += '<div class="card" style="margin-top:18px;display:grid;gap:10px"><b>Recomeçar do zero</b><p class="small muted">Apaga XP, estrelas, conquistas e respostas salvas neste navegador.</p><div class="btns"><button class="btn" id="pReset" type="button">Apagar meu progresso</button><span id="pConf" hidden><b class="small" style="color:var(--bad)">Tem certeza?</b> <button class="btn s" id="pYes" type="button">Sim, apagar</button> <button class="btn s" id="pNo" type="button">Cancelar</button></span></div><p class="small muted">O progresso fica salvo só neste navegador e neste aparelho.</p></div>';
    $("#perfilBox").innerHTML = h;
    $("#pSave").onclick = function () { S.name = $("#pName").value.trim(); save(); toast(icon("check") + " Nome salvo"); };
    $("#pReset").onclick = function () { $("#pConf").hidden = false; };
    $("#pNo").onclick = function () { $("#pConf").hidden = true; };
    $("#pYes").onclick = function () { try { localStorage.removeItem(KEY); } catch (e) { } location.hash = "#inicio"; location.reload(); };
  }

  // ------------------------------------------------------------ início
  function init() {
    renderMath(document.body);
    var all = mods();
    all.forEach(function (m, i) { initModule(m, i, all); });
    initLists();
    initSimulado();
    // widgets e figuras
    if (window.W) {
      $$("[data-w]").forEach(function (h) { var f = W[h.dataset.w]; if (f) { try { f(h, h.dataset.o ? JSON.parse(h.dataset.o) : {}); } catch (e) { console.error(h.dataset.w, e); h.appendChild(el("p", { class: "small" }, "Não foi possível carregar este recurso interativo.")); } } });
      $$("[data-f]").forEach(function (h) { var f = W.fig[h.dataset.f]; if (f) { try { h.insertAdjacentHTML("afterbegin", f(h.dataset.o ? JSON.parse(h.dataset.o) : {})); } catch (e) { console.error(h.dataset.f, e); } } });
      if (W.games) W.games($("#gameBox"));
    }
    $("#tTheme").onclick = function () {
      var c = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var n = c === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", n); try { localStorage.setItem("newton-theme", n); } catch (e) { }
    };
    $("#tSound").onclick = function () { S.sound = !S.sound; save(); updateTop(); if (S.sound) beep("tick"); };
    updateTop(); checkAch();
    window.addEventListener("hashchange", route);
    route();
  }
  try { var th = localStorage.getItem("newton-theme"); if (th) document.documentElement.setAttribute("data-theme", th); } catch (e) { }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
