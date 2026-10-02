(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var FILES = "abcdefgh";
  var FILL = { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" };
  var LINE = { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" };
  var VS = "︎";
  var VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  function pt(san) { return san.replace(/[KQRNB]/g, function (c) { return { K: "R", Q: "D", R: "T", N: "C", B: "B" }[c]; }); }
  function glyph(p) { return '<span class="pc ' + p.color + '"' + (p.color === "w" ? ' data-o="' + LINE[p.type] + VS + '"' : "") + ">" + FILL[p.type] + VS + "</span>"; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }

  /* ---------- estado salvo ---------- */
  var KEY = "xadrez-treino-v1";
  var S = { xp: 0, streak: 0, last: "", solved: {}, tries: {}, mates: {}, games: {}, coordBest: 0, coordRuns: 0, sound: true, ach: {}, jl: 1, jc: "w" };
  try { var raw = localStorage.getItem(KEY); if (raw) { var o = JSON.parse(raw); for (var k in o) S[k] = o[k]; } } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  try { var th = localStorage.getItem("xadrez-tema"); if (th) document.documentElement.dataset.theme = th; } catch (e) {}

  /* ---------- som ---------- */
  var AC = null;
  function beep(kind) {
    if (!S.sound) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var seq = { move: [[520, .05]], cap: [[330, .07]], good: [[660, .09], [880, .12]], bad: [[200, .16]], win: [[523, .1], [659, .1], [784, .18]] }[kind] || [[440, .05]];
      var t = AC.currentTime;
      seq.forEach(function (n) { var o = AC.createOscillator(), g = AC.createGain(); o.type = kind === "bad" ? "square" : "triangle"; o.frequency.value = n[0]; g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + n[1]); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + n[1]); t += n[1] * .9; });
    } catch (e) {}
  }
  function toast(t) { var d = document.createElement("div"); d.className = "toast"; d.textContent = t; $("#toasts").appendChild(d); setTimeout(function () { d.remove(); }, 2600); }

  /* ---------- XP, nível, sequência ---------- */
  var TITLES = ["Iniciante", "Peão", "Cavalo", "Bispo", "Torre", "Dama", "Rei", "Mestre"];
  function lvl() { var n = Math.floor(S.xp / 100) + 1; return { n: n, title: TITLES[Math.min(n - 1, TITLES.length - 1)], pct: S.xp % 100 }; }
  function addXP(n, why) {
    if (n > 0) {
      var before = lvl().n; S.xp += n;
      var t = today();
      if (S.last !== t) { var y = new Date(); y.setDate(y.getDate() - 1); var ys = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate(); S.streak = S.last === ys ? S.streak + 1 : 1; S.last = t; }
      toast("+" + n + " XP" + (why ? " · " + why : ""));
      if (lvl().n > before) { toast("Subiu para o nível " + lvl().n + ": " + lvl().title + "!"); beep("win"); }
    }
    checkAch(); save(); header();
  }
  function header() {
    var L = lvl();
    $("#hLvl").textContent = "Nível " + L.n; $("#hTitle").textContent = L.title;
    $("#hBar").style.width = L.pct + "%";
    $("#hXp").textContent = S.xp + " XP";
    $("#hStreak").textContent = S.streak + (S.streak === 1 ? " dia" : " dias");
    $("#sWave").style.display = S.sound ? "" : "none";
  }

  /* ---------- tabuleiro ---------- */
  function Board(el) {
    var B = { g: null, orient: "w", side: null, sel: null, last: null, hint: [], lock: false, onMove: null, onSquare: null, targets: [] };
    var cells = [];
    for (var i = 0; i < 64; i++) { var c = document.createElement("div"); c.className = "sq"; el.appendChild(c); cells.push(c); }
    var promo = document.createElement("div"); promo.className = "promo"; promo.hidden = true; promo.innerHTML = "<div></div>"; el.appendChild(promo);
    function sqAt(i) { var row = i >> 3, col = i & 7; var f = B.orient === "w" ? col : 7 - col; var r = B.orient === "w" ? 8 - row : row + 1; return FILES[f] + r; }
    B.cell = function (sq) { for (var i = 0; i < 64; i++) if (cells[i].dataset.sq === sq) return cells[i]; return null; };
    B.render = function () {
      var chk = null;
      if (B.g && B.g.inCheck()) { var bd = B.g.board(); for (var r = 0; r < 8; r++) for (var f = 0; f < 8; f++) { var p = bd[r][f]; if (p && p.type === "k" && p.color === B.g.turn()) chk = FILES[f] + (8 - r); } }
      for (var i = 0; i < 64; i++) {
        var sq = sqAt(i), c = cells[i], fi = FILES.indexOf(sq[0]), rk = +sq[1];
        c.dataset.sq = sq;
        var cls = "sq " + ((fi + rk) % 2 === 1 ? "l" : "d");
        if (B.last && (B.last[0] === sq || B.last[1] === sq)) cls += " last";
        if (B.sel === sq) cls += " sel";
        if (chk === sq) cls += " chk";
        if (B.hint.indexOf(sq) >= 0) cls += " hint";
        c.className = cls;
        var p = B.g ? B.g.get(sq) : null, h = p ? glyph(p) : "";
        var t = B.targets.indexOf(sq) >= 0;
        if (t) h += '<span class="tg' + (p ? " cap" : "") + '"></span>';
        if ((i & 7) === 0) h += '<span class="co r">' + rk + "</span>";
        if (i >> 3 === 7) h += '<span class="co f">' + sq[0] + "</span>";
        c.innerHTML = h;
      }
    };
    B.flash = function (sq, ok) { var c = B.cell(sq); if (!c) return; c.classList.remove("ok", "no"); void c.offsetWidth; c.classList.add(ok ? "ok" : "no"); setTimeout(function () { c.classList.remove("ok", "no"); }, 750); };
    B.shake = function () { el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); };
    B.clearSel = function () { B.sel = null; B.targets = []; };
    function askPromo(color) {
      return new Promise(function (res) {
        var box = promo.firstChild; box.innerHTML = "";
        ["q", "r", "b", "n"].forEach(function (t) {
          var b = document.createElement("button"); b.innerHTML = glyph({ type: t, color: color }); b.setAttribute("aria-label", { q: "Dama", r: "Torre", b: "Bispo", n: "Cavalo" }[t]);
          b.onclick = function (e) { e.stopPropagation(); promo.hidden = true; res(t); }; box.appendChild(b);
        });
        promo.hidden = false;
      });
    }
    el.addEventListener("click", function (e) {
      var c = e.target.closest(".sq"); if (!c || B.lock) return;
      var sq = c.dataset.sq;
      if (B.onSquare) { B.onSquare(sq); return; }
      if (!B.g) return;
      var p = B.g.get(sq);
      if (B.sel && B.targets.indexOf(sq) >= 0) {
        var from = B.sel, mp = B.g.get(from), pr;
        B.clearSel();
        var needP = mp.type === "p" && (sq[1] === "8" || sq[1] === "1");
        (needP ? askPromo(mp.color) : Promise.resolve(undefined)).then(function (pr) { if (B.onMove) B.onMove(from, sq, pr); B.render(); });
        return;
      }
      if (p && p.color === B.g.turn() && (!B.side || p.color === B.side) && B.sel !== sq) {
        B.sel = sq; B.targets = B.g.moves({ square: sq, verbose: true }).map(function (m) { return m.to; });
      } else B.clearSel();
      B.render();
    });
    return B;
  }
  function applyUci(g, u) { return g.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] || "q" }); }
  function turnHTML(g) { var w = g.turn() === "w"; return '<i class="' + (w ? "w" : "b") + '"></i>' + (w ? "Brancas" : "Pretas") + " jogam"; }

  /* ---------- motor (Web Worker com fallback) ---------- */
  var worker = null, pend = {}, seq = 0;
  try {
    var wsrc = $("#chesslib").textContent + "\n" + $("#engine").textContent + "\nonmessage=function(e){var r=ENG.best(e.data.fen,e.data.lv);postMessage({id:e.data.id,r:r});};";
    worker = new Worker(URL.createObjectURL(new Blob([wsrc], { type: "text/javascript" })));
    worker.onmessage = function (e) { var p = pend[e.data.id]; if (p) { delete pend[e.data.id]; p.res(e.data.r); } };
    worker.onerror = function () { worker = null; Object.keys(pend).forEach(function (id) { var p = pend[id]; delete pend[id]; p.res(ENG.best(p.fen, p.lv)); }); };
  } catch (e) { worker = null; }
  function think(fen, lv) {
    return new Promise(function (res) {
      if (worker) { var id = ++seq; pend[id] = { res: res, fen: fen, lv: lv }; worker.postMessage({ id: id, fen: fen, lv: lv }); }
      else setTimeout(function () { res(ENG.best(fen, lv)); }, 30);
    });
  }

  /* ================= TÁTICAS ================= */
  var THEMES = {
    mate1: ["Mate em 1", "Procure um xeque que o rei não consiga evitar: sem fuga, sem bloqueio, sem captura."],
    corredor: ["Mate do corredor", "Rei preso atrás dos próprios peões: uma torre ou dama na última fileira dá mate."],
    pendurada: ["Peça sem defesa", "Antes de cada lance, olhe se alguma peça adversária ficou sem proteção."],
    garfo: ["Garfo", "Uma peça ataca duas ao mesmo tempo. O cavalo é o especialista."],
    cravada: ["Cravada", "A peça da frente não pode sair, senão expõe uma peça mais valiosa (ou o rei) atrás dela."],
    espeto: ["Espeto", "É a cravada ao contrário: a peça valiosa está na frente, sai, e você captura a de trás."],
    descoberto: ["Ataque descoberto", "Uma peça sai da frente e revela o ataque de outra. Com xeque, fica ainda mais forte."],
    armadilha: ["Armadilhas de abertura", "Posições de partidas reais nas primeiras jogadas. Conhecê-las evita perder cedo."],
    mate2: ["Mate em 2", "Primeiro um lance forçante (xeque ou sacrifício), depois o mate."]
  };
  var ORDER = ["mate1", "corredor", "pendurada", "garfo", "cravada", "espeto", "descoberto", "armadilha", "mate2"];
  PUZ.sort(function (a, b) { return ORDER.indexOf(a.t) - ORDER.indexOf(b.t) || a.lv - b.lv; });
  var T = { b: Board($("#bdT")), filter: "all", i: 0, p: null, g: null, phase: 0, miss: 0, hinted: false, seen: false, done: false };
  function tList() { return PUZ.filter(function (p) { return T.filter === "all" || p.t === T.filter; }); }
  function tFilters() {
    var h = "", tot = PUZ.length, sv = PUZ.filter(function (p) { return S.solved[p.id]; }).length;
    h += '<button class="fchip" data-f="all" aria-pressed="' + (T.filter === "all") + '">Todos <small>' + sv + "/" + tot + "</small></button>";
    ORDER.forEach(function (t) {
      var ps = PUZ.filter(function (p) { return p.t === t; }), s = ps.filter(function (p) { return S.solved[p.id]; }).length;
      h += '<button class="fchip" data-f="' + t + '" aria-pressed="' + (T.filter === t) + '">' + THEMES[t][0] + " <small>" + s + "/" + ps.length + "</small></button>";
    });
    $("#tFilters").innerHTML = h;
    $("#tThemeInfo").textContent = T.filter === "all" ? "Os exercícios vão do mais simples ao mais difícil. Toque num número para abrir." : THEMES[T.filter][1];
    var L = tList();
    $("#tList").innerHTML = L.map(function (p, i) { return '<button class="pdot' + (S.solved[p.id] ? " done" : "") + (T.p && T.p.id === p.id ? " cur" : "") + '" data-id="' + p.id + '" title="' + p.ti + '">' + (PUZ.indexOf(p) + 1) + "</button>"; }).join("");
  }
  $("#tFilters").addEventListener("click", function (e) { var b = e.target.closest(".fchip"); if (!b) return; T.filter = b.dataset.f; var L = tList(); var nx = L.filter(function (p) { return !S.solved[p.id]; })[0] || L[0]; tLoad(nx); });
  $("#tList").addEventListener("click", function (e) { var b = e.target.closest(".pdot"); if (!b) return; tLoad(PUZ.filter(function (p) { return p.id === b.dataset.id; })[0]); });
  function tMsg(t, cls) { var m = $("#tMsg"); m.hidden = !t; m.className = "msg " + (cls || ""); m.textContent = t || ""; }
  function tLoad(p) {
    T.p = p; T.g = new Chess(p.fen); T.phase = 0; T.miss = 0; T.hinted = false; T.seen = false; T.done = false;
    var b = T.b; b.g = T.g; b.orient = T.g.turn(); b.side = T.g.turn(); b.last = null; b.hint = []; b.lock = false; b.clearSel(); b.render();
    $("#tTheme").textContent = THEMES[p.t][0] + " · nº " + (PUZ.indexOf(p) + 1);
    $("#tTitle").textContent = p.ti;
    $("#tLv").innerHTML = [1, 2, 3].map(function (n) { return n <= p.lv ? "★" : '<span class="off">★</span>'; }).join("");
    $("#tLv").title = ["", "Fácil", "Médio", "Difícil"][p.lv];
    var side = T.g.turn() === "w" ? "Brancas" : "Pretas";
    $("#tPrompt").textContent = p.mate === 1 ? side + " jogam e dão mate em 1." : p.mate === 2 ? side + " jogam e dão mate em 2 lances." : side + " jogam e ganham material.";
    $("#tTurn").innerHTML = turnHTML(T.g);
    tMsg(S.solved[p.id] ? "Você já resolveu este. Pode treinar de novo (sem XP)." : "", "info");
    $("#tExp").hidden = true; $("#tSol").disabled = false; $("#tHint").disabled = false;
    tFilters();
  }
  function firstOk() { return Object.keys(T.p.ok)[0]; }
  function tSolved() {
    T.done = true; T.b.lock = true; T.b.hint = []; T.b.render();
    var first = !S.solved[T.p.id], xp = 0;
    if (first && !T.seen) xp = T.miss === 0 && !T.hinted ? 10 : 5;
    if (!T.seen) { S.solved[T.p.id] = 1; }
    tMsg(T.seen ? "Esta é a solução. Tente o próximo sozinho!" : T.miss === 0 && !T.hinted ? "Perfeito! Resolvido de primeira." : "Resolvido!", T.seen ? "info" : "good");
    if (!T.seen) beep("good");
    var hist = T.g.history();
    $("#tExp").innerHTML = "<p><b>Lances:</b> <span class=\"mono\">" + hist.map(pt).join("  ") + "</span></p><p>" + T.p.tx + "</p>";
    $("#tExp").hidden = false; $("#tSol").disabled = true; $("#tHint").disabled = true;
    if (xp) addXP(xp, "tática"); else { checkAch(); save(); }
    tFilters();
  }
  async function playLine(us) { // toca a resposta do adversário e o lance seguinte
    for (var i = 0; i < us.length; i++) { await sleep(i ? 650 : 450); var m = applyUci(T.g, us[i]); T.b.last = [m.from, m.to]; beep(m.captured ? "cap" : "move"); T.b.render(); }
  }
  T.b.onMove = async function (from, to, pr) {
    var u = from + to + (pr || ""), g = T.g, p = T.p;
    var m; try { m = g.move({ from: from, to: to, promotion: pr }); } catch (e) { return; }
    T.b.last = [from, to]; T.b.hint = []; T.b.render(); beep(m.captured ? "cap" : "move");
    var uKey = from + to + (m.promotion || "");
    var good = false, cont = [];
    if (T.phase === 0) {
      if (p.mate === 1) good = g.isCheckmate();
      else if (p.ok[uKey]) { good = true; cont = p.ok[uKey]; }
    } else good = g.isCheckmate();
    if (!good) {
      T.miss++; beep("bad"); T.b.flash(to, false); T.b.shake();
      tMsg(T.phase === 1 ? "Ainda não é mate. Procure o xeque que o rei não consegue evitar." : p.mate ? "Não é mate. Veja todas as casas de fuga do rei." : "Esse lance não ganha material. Pense em xeques, capturas e ameaças.", "bad");
      T.b.lock = true; await sleep(650); g.undo(); T.b.last = null; T.b.lock = false; T.b.render(); return;
    }
    T.b.flash(to, true);
    if (p.mate === 2 && T.phase === 0) {
      T.b.lock = true; tMsg("Boa! Agora o adversário responde…", "good");
      await playLine(cont); T.phase = 1; T.b.lock = false; $("#tTurn").innerHTML = turnHTML(g);
      tMsg("Agora dê o mate.", "info"); return;
    }
    if (cont.length) { T.b.lock = true; tMsg("Isso! Veja a continuação…", "good"); await playLine(cont); }
    tSolved();
  };
  $("#tHint").onclick = function () {
    if (T.done) return; T.hinted = true;
    var from;
    if (T.phase === 0) from = firstOk().slice(0, 2);
    else { var mm = T.g.moves({ verbose: true }); for (var i = 0; i < mm.length; i++) { T.g.move(mm[i]); var ok = T.g.isCheckmate(); T.g.undo(); if (ok) { from = mm[i].from; break; } } }
    T.b.hint = from ? [from] : []; T.b.render();
    tMsg("A peça destacada é a que deve se mover.", "info");
  };
  $("#tSol").onclick = async function () {
    if (T.done) return; T.seen = true; T.b.lock = true; tMsg("Mostrando a solução…", "info");
    var u = T.phase === 0 ? firstOk() : null;
    if (u) {
      var m = applyUci(T.g, u); T.b.last = [m.from, m.to]; T.b.render(); beep("move");
      await playLine(T.p.ok[u] || []);
      if (T.p.mate === 2) { await sleep(600); var mm = T.g.moves({ verbose: true }); for (var i = 0; i < mm.length; i++) { T.g.move(mm[i]); if (T.g.isCheckmate()) { T.b.last = [mm[i].from, mm[i].to]; break; } T.g.undo(); } T.b.render(); }
    } else {
      var mm2 = T.g.moves({ verbose: true }); for (var j = 0; j < mm2.length; j++) { T.g.move(mm2[j]); if (T.g.isCheckmate()) { T.b.last = [mm2[j].from, mm2[j].to]; break; } T.g.undo(); } T.b.render();
    }
    tSolved();
  };
  $("#tRetry").onclick = function () { tLoad(T.p); };
  $("#tNext").onclick = function () {
    var L = tList(), i = L.indexOf(T.p);
    var rest = L.slice(i + 1).concat(L.slice(0, i + 1));
    tLoad(rest.filter(function (p) { return !S.solved[p.id]; })[0] || L[(i + 1) % L.length]);
  };

  /* ================= MATES BÁSICOS ================= */
  var MATES = [
    { id: "tt", name: "Duas torres", pcs: "rr", fen: "8/8/8/4k3/8/8/8/R3K2R w - - 0 1", st: [7, 10],
      steps: ["As torres andam em <b>escada</b>: uma corta uma fileira, a outra dá xeque na fileira seguinte.", "A cada xeque o rei recua uma fileira. Repita até a borda.", "Se o rei encostar em uma torre, leve essa torre para o outro lado do tabuleiro (longe do rei) e continue a escada.", "O rei branco nem precisa ajudar."] },
    { id: "qk", name: "Dama e rei", pcs: "qk", fen: "8/8/8/4k3/8/8/8/3QK3 w - - 0 1", st: [10, 15],
      steps: ["Use a dama para fazer uma <b>caixa</b>: fique a um salto de cavalo do rei adversário e vá diminuindo o espaço dele.", "Quando o rei estiver preso na borda, <b>pare</b> de apertar com a dama.", "Traga o seu rei para perto (à frente do rei adversário, com uma casa entre eles).", "Dê o mate com a dama protegida pelo rei ou na borda.", "Cuidado com o <b>afogamento</b>: depois de cada lance, o rei preto precisa ter alguma casa ou estar em xeque."] },
    { id: "tk", name: "Torre e rei", pcs: "rk", fen: "8/8/8/4k3/8/8/8/R3K3 w - - 0 1", st: [16, 25],
      steps: ["A torre corta o rei, prendendo-o numa parte do tabuleiro.", "Traga o seu rei. O objetivo é a <b>oposição</b>: os dois reis frente a frente, com uma casa entre eles.", "Com os reis em oposição, a torre dá xeque na fileira (ou coluna) do rei adversário, empurrando-o para a borda.", "Se não houver oposição, faça um lance de espera com a torre (ao longo da fileira, longe do rei).", "Na borda, o mesmo xeque com os reis em oposição é mate."] }
  ];
  var M = { b: Board($("#bdM")), cur: MATES[0], g: null, n: 0, over: false };
  function mStars(id) { var s = S.mates[id] || 0; return [1, 2, 3].map(function (n) { return n <= s ? "★" : '<span class="off">★</span>'; }).join(""); }
  function mCards() {
    $("#mCards").innerHTML = MATES.map(function (m) {
      var pcs = m.pcs.split("").map(function (t) { return glyph({ type: t === "k" ? "q" : t, color: "w" }); });
      var ic = m.id === "qk" ? glyph({ type: "q", color: "w" }) + glyph({ type: "k", color: "w" }) : m.id === "tk" ? glyph({ type: "r", color: "w" }) + glyph({ type: "k", color: "w" }) : glyph({ type: "r", color: "w" }) + glyph({ type: "r", color: "w" });
      return '<button class="mcard" data-id="' + m.id + '" aria-pressed="' + (M.cur.id === m.id) + '"><span class="pcs">' + ic + "</span><span><b>" + m.name + '</b><span class="stars">' + mStars(m.id) + "</span></span></button>";
    }).join("");
  }
  $("#mCards").addEventListener("click", function (e) { var b = e.target.closest(".mcard"); if (!b) return; M.cur = MATES.filter(function (m) { return m.id === b.dataset.id; })[0]; mLoad(); });
  function mMsg(t, cls) { var m = $("#mMsg"); m.className = "msg " + cls; m.innerHTML = t; }
  function mLoad() {
    var m = M.cur; M.g = new Chess(m.fen); M.n = 0; M.over = false;
    var b = M.b; b.g = M.g; b.orient = "w"; b.side = "w"; b.last = null; b.hint = []; b.lock = false; b.clearSel(); b.render();
    $("#mTitle").textContent = m.name + " contra rei";
    $("#mSteps").innerHTML = m.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("");
    $("#mGoal").textContent = "3 estrelas: mate em até " + m.st[0] + " lances. 2 estrelas: até " + m.st[1] + ". 1 estrela: qualquer mate (limite de 50 lances).";
    mMsg("Você tem as brancas. O computador defende o rei preto.", "info");
    mCount(); mCards();
  }
  function mCount() { $("#mCount").textContent = "Lances: " + M.n; $("#mTurn").innerHTML = turnHTML(M.g); }
  function defend(g) { // rei preto foge para o centro e evita mate imediato
    var ms = g.moves({ verbose: true }), best = null, bs = -1e9;
    ms.forEach(function (m) {
      var s = 0;
      if (m.captured) s += 10000;
      var f = FILES.indexOf(m.to[0]), r = +m.to[1] - 1;
      s -= (Math.abs(f - 3.5) + Math.abs(r - 3.5)) * 10;
      g.move(m);
      var wm = g.moves({ verbose: true }), mate = false;
      for (var i = 0; i < wm.length && !mate; i++) { g.move(wm[i]); if (g.isCheckmate()) mate = true; g.undo(); }
      if (mate) s -= 5000;
      // mobilidade do rei depois do lance (se as brancas "passassem")
      g.undo();
      s += Math.random() * 4;
      if (s > bs) { bs = s; best = m; }
    });
    return best;
  }
  M.b.onMove = async function (from, to, pr) {
    if (M.over) return;
    var m; try { m = M.g.move({ from: from, to: to, promotion: pr }); } catch (e) { return; }
    M.n++; M.b.last = [from, to]; M.b.hint = []; M.b.render(); beep("move"); mCount();
    var g = M.g;
    if (g.isCheckmate()) {
      M.over = true; M.b.lock = true;
      var st = M.n <= M.cur.st[0] ? 3 : M.n <= M.cur.st[1] ? 2 : 1, old = S.mates[M.cur.id] || 0;
      mMsg("Xeque-mate em " + M.n + " lances! " + "★".repeat(st) + (st < 3 ? " Tente de novo para mais estrelas." : ""), "good"); beep("win");
      if (st > old) { S.mates[M.cur.id] = st; addXP((st - old) * 10, "mate básico"); } else { checkAch(); save(); }
      mCards(); return;
    }
    if (g.isStalemate()) { M.over = true; M.b.lock = true; mMsg("<b>Afogamento!</b> O rei preto não está em xeque e não tem nenhum lance: isso é empate. Deixe sempre uma casa livre para o rei até o lance do mate.", "bad"); beep("bad"); return; }
    if (M.n >= 50) { M.over = true; M.b.lock = true; mMsg("Chegou a 50 lances sem mate. Releia a técnica e tente de novo.", "bad"); beep("bad"); return; }
    M.b.lock = true; await sleep(350);
    var d = defend(g); var dm = g.move(d); M.b.last = [dm.from, dm.to]; M.b.lock = false; M.b.render(); beep(dm.captured ? "cap" : "move"); mCount();
    if (dm.captured) { M.over = true; M.b.lock = true; mMsg("O rei preto capturou uma peça que estava sem defesa. Sem material suficiente, é empate. Proteja suas peças com o rei!", "bad"); beep("bad"); return; }
    mMsg("Sua vez. " + (g.inCheck() ? "" : "Lembre: deixe o rei preto com alguma casa livre até o mate."), "info");
  };
  $("#mReset").onclick = mLoad;
  $("#mHint").onclick = async function () {
    if (M.over || M.g.turn() !== "w") return;
    mMsg('<span class="think"><i></i><i></i><i></i></span> Pensando numa dica…', "info");
    var r = await think(M.g.fen(), { depth: 4, q: false, ms: 2500 });
    if (r) { M.b.hint = [r.uci.slice(0, 2), r.uci.slice(2, 4)]; M.b.render(); mMsg("Sugestão: mova a peça destacada para a casa destacada.", "info"); }
  };

  /* ================= JOGAR ================= */
  var LV = [
    { n: "Iniciante", depth: 1, q: false, noise: 160, blunder: .22, ms: 800, xp: 15 },
    { n: "Fácil", depth: 2, q: true, noise: 70, blunder: .06, ms: 1500, xp: 25 },
    { n: "Médio", depth: 3, q: true, noise: 18, ms: 2500, xp: 40 },
    { n: "Difícil", depth: 4, q: true, noise: 0, ms: 5000, xp: 60 }
  ];
  var J = { b: Board($("#bdJ")), g: new Chess(), me: "w", over: false, busy: false, ply: 0 };
  $("#jLevel").innerHTML = LV.map(function (l, i) { return '<button data-l="' + i + '">' + l.n + "</button>"; }).join("");
  function jSeg() {
    $$("#jLevel button").forEach(function (b) { b.setAttribute("aria-pressed", +b.dataset.l === S.jl); });
    $$("#jColor button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.c === S.jc); });
  }
  $("#jLevel").onclick = function (e) { var b = e.target.closest("button"); if (!b) return; S.jl = +b.dataset.l; save(); jSeg(); jMsg("Nível " + LV[S.jl].n + (J.g.history().length ? " a partir do próximo lance do computador." : "."), ""); };
  $("#jColor").onclick = function (e) { var b = e.target.closest("button"); if (!b) return; S.jc = b.dataset.c; save(); jSeg(); jMsg("A cor vale para a próxima partida (Nova partida).", "info"); };
  function jMsg(t, cls) { var m = $("#jMsg"); m.className = "msg " + (cls || ""); m.innerHTML = t; }
  function jSave() { try { localStorage.setItem("xadrez-partida", JSON.stringify({ pgn: J.g.pgn(), me: J.me, over: J.over })); } catch (e) {} }
  function jMoves() {
    var h = J.g.history(), out = "";
    for (var i = 0; i < h.length; i += 2) out += '<span class="n">' + (i / 2 + 1) + ".</span><span" + (i === h.length - 1 ? ' class="cur"' : "") + ">" + pt(h[i]) + "</span><span" + (i + 1 === h.length - 1 ? ' class="cur"' : "") + ">" + (h[i + 1] ? pt(h[i + 1]) : "") + "</span>";
    var box = $("#jMoves"); box.innerHTML = out || '<span class="muted small" style="grid-column:1/-1">Nenhum lance ainda.</span>'; box.scrollTop = box.scrollHeight;
  }
  function jMat() {
    var cnt = { w: { p: 0, n: 0, b: 0, r: 0, q: 0 }, b: { p: 0, n: 0, b: 0, r: 0, q: 0 } }, sc = { w: 0, b: 0 };
    J.g.board().forEach(function (row) { row.forEach(function (p) { if (p && p.type !== "k") { cnt[p.color][p.type]++; sc[p.color] += VAL[p.type]; } }); });
    var start = { p: 8, n: 2, b: 2, r: 2, q: 1 };
    function lost(c) { var s = ""; ["q", "r", "b", "n", "p"].forEach(function (t) { for (var i = cnt[c][t]; i < start[t]; i++) s += glyph({ type: t, color: c }); }); return s; }
    var d = sc.w - sc.b;
    var top = J.b.orient === "w" ? "b" : "w", bot = top === "w" ? "b" : "w";
    // mostra perto de cada lado as peças que ELE capturou
    $("#jMatTop").innerHTML = lost(bot) + ((top === "w" ? d : -d) > 0 ? "<small>+" + Math.abs(d) + "</small>" : "");
    $("#jMatBot").innerHTML = lost(top) + ((bot === "w" ? d : -d) > 0 ? "<small>+" + Math.abs(d) + "</small>" : "");
  }
  function jRender() { J.b.render(); jMoves(); jMat(); }
  function jEnd() {
    var g = J.g; if (!g.isGameOver()) return false;
    J.over = true; J.b.lock = true;
    var res;
    if (g.isCheckmate()) {
      var iWon = g.turn() !== J.me;
      if (iWon) { res = "<b>Xeque-mate! Você venceu</b> o nível " + LV[S.jl].n + "."; beep("win"); var k = "w" + S.jl; S.games[k] = (S.games[k] || 0) + 1; addXP(LV[S.jl].xp, "vitória"); jMsg(res, "good"); }
      else { res = "<b>Xeque-mate.</b> O computador venceu. Use Desfazer para ver onde a partida virou."; beep("bad"); S.games.l = (S.games.l || 0) + 1; save(); jMsg(res, "bad"); }
    } else {
      var why = g.isStalemate() ? "afogamento" : g.isThreefoldRepetition() ? "repetição de posição" : g.isInsufficientMaterial() ? "material insuficiente" : "regra dos 50 lances";
      S.games.d = (S.games.d || 0) + 1; addXP(8, "empate"); jMsg("<b>Empate</b> por " + why + ".", "info");
    }
    jSave(); return true;
  }
  async function jComputer() {
    if (J.over || J.g.turn() === J.me) return;
    J.busy = true; J.b.lock = true;
    jMsg('<span class="think"><i></i><i></i><i></i></span> Computador pensando…', "");
    var t0 = Date.now(), fen = J.g.fen();
    var r = await think(fen, LV[S.jl]);
    var wait = 350 - (Date.now() - t0); if (wait > 0) await sleep(wait);
    if (J.g.fen() !== fen) { J.busy = false; return; } // partida mudou enquanto pensava
    var m = applyUci(J.g, r.uci); J.b.last = [m.from, m.to];
    beep(m.captured ? "cap" : "move"); J.busy = false; J.b.lock = false; jRender(); jSave();
    if (!jEnd()) jMsg(J.g.inCheck() ? "<b>Xeque!</b> Proteja o rei." : "Sua vez.", J.g.inCheck() ? "bad" : "");
  }
  J.b.onMove = function (from, to, pr) {
    if (J.over || J.busy) return;
    var m; try { m = J.g.move({ from: from, to: to, promotion: pr }); } catch (e) { return; }
    J.b.last = [from, to]; J.b.hint = []; beep(m.captured ? "cap" : "move"); jRender(); jSave();
    if (!jEnd()) jComputer();
  };
  function jNew() {
    J.g = new Chess(); J.over = false; J.busy = false;
    J.me = S.jc === "r" ? (Math.random() < .5 ? "w" : "b") : S.jc;
    var b = J.b; b.g = J.g; b.orient = J.me; b.side = J.me; b.last = null; b.hint = []; b.lock = false; b.clearSel();
    jRender(); jSave();
    jMsg("Nova partida. Você joga de " + (J.me === "w" ? "brancas" : "pretas") + ". " + (J.me === "w" ? "Sua vez." : ""), "");
    jComputer();
  }
  $("#jNew").onclick = function () { if (J.g.history().length && !J.over) { $("#jConfirm").hidden = false; } else jNew(); };
  $("#jYes").onclick = function () { $("#jConfirm").hidden = true; jNew(); };
  $("#jNo").onclick = function () { $("#jConfirm").hidden = true; };
  $("#jUndo").onclick = function () {
    if (J.busy) return;
    var h = J.g.history(); if (!h.length) return;
    J.g.undo(); if (J.g.turn() !== J.me && J.g.history().length) J.g.undo();
    if (J.g.turn() !== J.me) { /* desfez até o início com o computador de brancas */ }
    J.over = false; J.b.lock = false; J.b.hint = []; J.b.clearSel();
    var hv = J.g.history({ verbose: true }), l = hv[hv.length - 1]; J.b.last = l ? [l.from, l.to] : null;
    jRender(); jSave(); jMsg("Lance desfeito. Sua vez.", "info");
    if (J.g.turn() !== J.me) jComputer();
  };
  $("#jHint").onclick = async function () {
    if (J.over || J.busy || J.g.turn() !== J.me) return;
    J.busy = true; jMsg('<span class="think"><i></i><i></i><i></i></span> Procurando um bom lance…', "");
    var r = await think(J.g.fen(), { depth: 3, q: true, ms: 2500 }); J.busy = false;
    if (r) { J.b.hint = [r.uci.slice(0, 2), r.uci.slice(2, 4)]; J.b.render(); var tmp = new Chess(J.g.fen()); var mm = applyUci(tmp, r.uci); jMsg("Sugestão: <span class=\"mono\">" + pt(mm.san) + "</span> (casas destacadas).", "info"); }
  };
  $("#jFlip").onclick = function () { J.b.orient = J.b.orient === "w" ? "b" : "w"; jRender(); };
  function jRestore() {
    try {
      var s = JSON.parse(localStorage.getItem("xadrez-partida") || "null");
      if (s && s.pgn !== undefined) {
        J.g = new Chess(); if (s.pgn) J.g.loadPgn(s.pgn); J.me = s.me || "w"; J.over = !!s.over;
        var b = J.b; b.g = J.g; b.orient = J.me; b.side = J.me; b.lock = J.over;
        var hv = J.g.history({ verbose: true }), l = hv[hv.length - 1]; b.last = l ? [l.from, l.to] : null;
        jRender();
        if (J.over) jMsg("A última partida terminou. Toque em Nova partida.", "info");
        else if (J.g.turn() === J.me) jMsg(J.g.history().length ? "Partida retomada. Sua vez." : "Sua vez. Você joga de " + (J.me === "w" ? "brancas." : "pretas."), "");
        else jComputer();
        return;
      }
    } catch (e) {}
    jNew();
  }

  /* ================= COORDENADAS ================= */
  var C = { b: Board($("#bdC")), on: false, score: 0, target: "", end: 0, timer: null, side: "w", show: "0" };
  C.b.g = null; C.b.render();
  function cSeg() {
    $$("#cSide button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.c === C.side); });
    $$("#cShow button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.c === C.show); });
    C.b.orient = C.side; $("#bdC").classList.toggle("nocoord", C.show === "0"); C.b.render();
  }
  $("#cSide").onclick = function (e) { var b = e.target.closest("button"); if (!b || C.on) return; C.side = b.dataset.c; cSeg(); };
  $("#cShow").onclick = function (e) { var b = e.target.closest("button"); if (!b || C.on) return; C.show = b.dataset.c; cSeg(); };
  function cNew() { var t; do { t = FILES[Math.floor(Math.random() * 8)] + (1 + Math.floor(Math.random() * 8)); } while (t === C.target); C.target = t; $("#cTarget").textContent = t; }
  $("#cBest").textContent = S.coordBest;
  $("#cGo").onclick = function () {
    if (C.on) return;
    C.on = true; C.score = 0; $("#cScore").textContent = 0; $("#cMsg").hidden = true; $("#cGo").disabled = true;
    C.end = Date.now() + 30000; cNew();
    C.timer = setInterval(function () {
      var left = C.end - Date.now(); $("#cTime").style.width = Math.max(0, left / 300) + "%";
      if (left <= 0) {
        clearInterval(C.timer); C.on = false; $("#cGo").disabled = false; $("#cGo").textContent = "Jogar de novo"; $("#cTarget").textContent = "—";
        S.coordRuns++; var rec = C.score > S.coordBest; if (rec) S.coordBest = C.score; $("#cBest").textContent = S.coordBest;
        var m = $("#cMsg"); m.hidden = false; m.className = "msg " + (rec ? "good" : "info"); m.textContent = C.score + " acertos" + (rec ? ": novo recorde!" : ".") + " Ganhou " + Math.min(C.score, 20) + " XP.";
        beep(rec ? "win" : "good"); addXP(Math.min(C.score, 20), "coordenadas");
      }
    }, 100);
  };
  C.b.onSquare = function (sq) {
    if (!C.on) return;
    if (sq === C.target) { C.score++; $("#cScore").textContent = C.score; C.b.flash(sq, true); beep("move"); cNew(); }
    else { C.b.flash(sq, false); beep("bad"); C.end -= 1500; }
  };

  /* ================= CONQUISTAS / PROGRESSO ================= */
  function nSolved(t) { return PUZ.filter(function (p) { return (!t || p.t === t) && S.solved[p.id]; }).length; }
  var ACH = [
    ["primeira", "♟", "Primeiro passo", "Resolva a primeira tática", function () { return nSolved() >= 1; }],
    ["mates", "♚", "Caçador de reis", "Resolva todos os Mate em 1 e Corredor", function () { return nSolved("mate1") + nSolved("corredor") === PUZ.filter(function (p) { return p.t === "mate1" || p.t === "corredor"; }).length; }],
    ["garfo", "♞", "Garfo afiado", "Resolva todos os garfos", function () { return nSolved("garfo") === PUZ.filter(function (p) { return p.t === "garfo"; }).length; }],
    ["dez", "♝", "Dez táticas", "Resolva 10 táticas", function () { return nSolved() >= 10; }],
    ["todas", "♛", "Livro fechado", "Resolva todas as táticas", function () { return nSolved() === PUZ.length; }],
    ["escada", "♜", "Escada perfeita", "Mate com duas torres com 3 estrelas", function () { return (S.mates.tt || 0) >= 3; }],
    ["basicos", "♔", "Finais em dia", "Os três mates básicos com 3 estrelas", function () { return (S.mates.tt || 0) >= 3 && (S.mates.qk || 0) >= 3 && (S.mates.tk || 0) >= 3; }],
    ["vit1", "♙", "Primeira vitória", "Vença o computador em qualquer nível", function () { return [0, 1, 2, 3].some(function (i) { return S.games["w" + i]; }); }],
    ["vit3", "♖", "Subindo de nível", "Vença o nível Médio", function () { return !!S.games.w2; }],
    ["vit4", "♕", "Gigante", "Vença o nível Difícil", function () { return !!S.games.w3; }],
    ["coord", "♘", "Mapa na cabeça", "Faça 20 acertos em Coordenadas", function () { return S.coordBest >= 20; }],
    ["seq", "♗", "Constância", "Treine 3 dias seguidos", function () { return S.streak >= 3; }]
  ];
  function checkAch() { ACH.forEach(function (a) { if (!S.ach[a[0]] && a[4]()) { S.ach[a[0]] = 1; toast("Conquista: " + a[2]); } }); }
  function prog() {
    var wins = [0, 1, 2, 3].reduce(function (s, i) { return s + (S.games["w" + i] || 0); }, 0);
    var k = [[S.xp, "XP total"], [lvl().title, "Nível " + lvl().n], [nSolved() + "/" + PUZ.length, "Táticas resolvidas"], [wins, "Vitórias"], [S.coordBest, "Recorde de coordenadas"], [S.streak, "Dias seguidos"]];
    $("#pKpis").innerHTML = k.map(function (x) { return '<div class="kpi"><b>' + x[0] + "</b><span>" + x[1] + "</span></div>"; }).join("");
    $("#pThemes").innerHTML = ORDER.map(function (t) { var tot = PUZ.filter(function (p) { return p.t === t; }).length, s = nSolved(t); return '<div class="row"><span>' + THEMES[t][0] + '</span><span class="tr"><b style="width:' + (100 * s / tot) + '%"></b></span><span class="v">' + s + "/" + tot + "</span></div>"; }).join("");
    var o = MATES.map(function (m) { return '<div class="row"><span>' + m.name + '</span><span class="stars">' + mStars(m.id) + '</span><span></span></div>'; }).join("");
    o += LV.map(function (l, i) { return '<div class="row"><span>Vitórias · ' + l.n + '</span><span></span><span class="v">' + (S.games["w" + i] || 0) + "</span></div>"; }).join("");
    o += '<div class="row"><span>Empates</span><span></span><span class="v">' + (S.games.d || 0) + '</span></div><div class="row"><span>Derrotas</span><span></span><span class="v">' + (S.games.l || 0) + "</span></div>";
    $("#pOther").innerHTML = o;
    $("#pAch").innerHTML = ACH.map(function (a) { return '<div class="' + (S.ach[a[0]] ? "on" : "") + '"><i>' + a[1] + VS + "</i><span><b>" + a[2] + "</b><span>" + a[3] + "</span></span></div>"; }).join("");
  }
  $("#pReset").onclick = function () { $("#pResetAsk").hidden = false; };
  $("#pResetNo").onclick = function () { $("#pResetAsk").hidden = true; };
  $("#pResetYes").onclick = function () {
    S.xp = 0; S.streak = 0; S.last = ""; S.solved = {}; S.mates = {}; S.games = {}; S.coordBest = 0; S.coordRuns = 0; S.ach = {};
    save(); $("#pResetAsk").hidden = true; header(); prog(); tFilters(); mCards(); $("#cBest").textContent = 0; toast("Progresso apagado.");
  };

  /* ---------- abas, tema, som ---------- */
  function show(v) {
    $$(".tab").forEach(function (t) { t.setAttribute("aria-selected", t.dataset.v === v); });
    $$(".view").forEach(function (s) { s.hidden = s.id !== "v-" + v; });
    if (v === "prog") prog();
    try { localStorage.setItem("xadrez-aba", v); } catch (e) {}
  }
  $$(".tab").forEach(function (t) { t.onclick = function () { show(t.dataset.v); }; });
  $("#bTheme").onclick = function () {
    var dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("xadrez-tema", document.documentElement.dataset.theme); } catch (e) {}
  };
  $("#bSound").onclick = function () { S.sound = !S.sound; save(); header(); if (S.sound) beep("good"); };

  /* ---------- início ---------- */
  header(); jSeg(); cSeg();
  tLoad(PUZ.filter(function (p) { return !S.solved[p.id]; })[0] || PUZ[0]);
  mLoad(); jRestore();
  var start = location.hash.replace("#", "");
  try { start = start || localStorage.getItem("xadrez-aba") || "taticas"; } catch (e) { start = start || "taticas"; }
  show(["taticas", "mates", "jogar", "coord", "prog"].indexOf(start) >= 0 ? start : "taticas");
})();
