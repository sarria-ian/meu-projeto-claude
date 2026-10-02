/* Motor simples: alfa-beta + quiescência sobre os métodos internos do chess.js */
var ENG = (function () {
  var V = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
  var T = {
    p: [0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
    n: [-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
    b: [-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
    r: [0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
    q: [-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
    k: [-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20],
    e: [-50,-40,-30,-20,-20,-30,-40,-50,-30,-20,-10,0,0,-10,-20,-30,-30,-10,20,30,30,20,-10,-30,-30,-10,30,40,40,30,-10,-30,-30,-10,30,40,40,30,-10,-30,-30,-10,20,30,30,20,-10,-30,-30,-30,0,0,0,0,-30,-30,-50,-30,-30,-30,-30,-30,-30,-50]
  };
  var MATE = 100000, nodes = 0, stopAt = 0, aborted = false;
  function sq(s) { return "abcdefgh"[s & 7] + (8 - (s >> 4)); }
  function evalW(g) { // pontos do ponto de vista das brancas
    var b = g._board, s, p, i, mat = 0, sc = 0, heavy = 0;
    for (s = 0; s < 120; s++) { if (s & 0x88) { s += 7; continue; } p = b[s]; if (p && p.type !== "p" && p.type !== "k") heavy += V[p.type]; }
    var end = heavy <= 1300;
    for (s = 0; s < 120; s++) {
      if (s & 0x88) { s += 7; continue; }
      p = b[s]; if (!p) continue;
      i = p.color === "w" ? (s >> 4) * 8 + (s & 7) : (7 - (s >> 4)) * 8 + (s & 7);
      var t = p.type === "k" && end ? T.e : T[p.type];
      var v = V[p.type] + t[i];
      sc += p.color === "w" ? v : -v;
    }
    return sc;
  }
  function order(ms) {
    for (var i = 0; i < ms.length; i++) { var m = ms[i]; m._o = (m.captured ? 10 * V[m.captured] - V[m.piece] + 1000 : 0) + (m.promotion ? 800 : 0); }
    ms.sort(function (a, b) { return b._o - a._o; });
    return ms;
  }
  function quiesce(g, a, b, qd) {
    nodes++;
    var stand = (g._turn === "w" ? 1 : -1) * evalW(g);
    if (stand >= b) return b; if (stand > a) a = stand;
    if (qd <= 0) return a;
    var ms = order(g._moves({ legal: true }).filter(function (m) { return m.captured || m.promotion; }));
    for (var i = 0; i < ms.length; i++) {
      g._makeMove(ms[i]); var v = -quiesce(g, -b, -a, qd - 1); g._undoMove();
      if (v >= b) return b; if (v > a) a = v;
    }
    return a;
  }
  function search(g, d, a, b, ply, q) {
    if ((++nodes & 1023) === 0 && Date.now() > stopAt) aborted = true;
    if (aborted) return 0;
    var ms = g._moves({ legal: true });
    if (!ms.length) return g._isKingAttacked(g._turn) ? -MATE + ply : 0;
    if (g._halfMoves >= 100) return 0;
    if (d <= 0) return q ? quiesce(g, a, b, 6) : (g._turn === "w" ? 1 : -1) * evalW(g);
    order(ms);
    for (var i = 0; i < ms.length; i++) {
      g._makeMove(ms[i]); var v = -search(g, d - 1, -b, -a, ply + 1, q); g._undoMove();
      if (aborted) return 0;
      if (v >= b) return b; if (v > a) a = v;
    }
    return a;
  }
  // nível: {depth, q, noise, ms}
  function best(fen, lv) {
    var g = new Chess(fen); nodes = 0; aborted = false; stopAt = Date.now() + (lv.ms || 2500);
    var ms = g._moves({ legal: true }); if (!ms.length) return null;
    order(ms);
    var scored = ms.map(function (m) { return { m: m, v: 0 }; }), done = scored;
    for (var d = 1; d <= lv.depth; d++) {
      var res = [];
      for (var i = 0; i < scored.length; i++) {
        g._makeMove(scored[i].m); var v = -search(g, d - 1, -MATE - 1, MATE + 1, 1, lv.q); g._undoMove();
        if (aborted) break;
        res.push({ m: scored[i].m, v: v });
      }
      if (aborted && d > 1) break;
      if (res.length === scored.length) { res.sort(function (x, y) { return y.v - x.v; }); done = scored = res; }
      if (aborted) break;
      if (done[0].v > MATE - 100) break;
    }
    var pick = done.map(function (x) { return { m: x.m, v: x.v + (lv.noise ? (Math.random() * 2 - 1) * lv.noise : 0) }; });
    pick.sort(function (x, y) { return y.v - x.v; });
    var c = pick[0].m;
    if (lv.blunder && Math.random() < lv.blunder) c = ms[Math.floor(Math.random() * ms.length)];
    return { uci: sq(c.from) + sq(c.to) + (c.promotion || ""), score: done[0].v, nodes: nodes };
  }
  return { best: best, evalW: evalW };
})();
