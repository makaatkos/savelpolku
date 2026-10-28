/* Sävelpolku – visuaalit: nuottiviivasto, piano, rytmit, kvinttiympyrä (SVG) */
const R = (() => {
  const SP = 10;            // viivaväli
  const TOP = 50;           // ylin viiva
  const BOT = TOP + 4 * SP; // alin viiva
  const REF = { g: T.dia('E4'), f: T.dia('G2') }; // alimman viivan sävel
  const SHARP_POS = { g: ['F5', 'C5', 'G5', 'D5', 'A4', 'E5', 'B4'], f: ['F3', 'C3', 'G3', 'D3', 'A2', 'E3', 'B2'] };
  const FLAT_POS = { g: ['B4', 'E5', 'A4', 'D5', 'G4', 'C5', 'F4'], f: ['B2', 'E3', 'A2', 'D3', 'G2', 'C3', 'F2'] };
  let colorize = false;
  // Etumerkin perusviivan siirto, jotta merkin keskikohta osuu viivalle tai välille (Noto Music, 19px)
  const ACC_DY = { '♯': 2.5, '♮': 2.6, '𝄪': 2.5, '♭': 2.3, '𝄫': 2.3 };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  const yOf = (n, clef) => BOT - (T.dia(n) - REF[clef]) * (SP / 2);

  function ledgers(n, clef, x, w = 11) {
    const d = T.dia(n) - REF[clef];
    let out = '';
    for (let k = -2; k >= d; k -= 2) { const y = BOT - k * SP / 2; out += `<line x1="${x - w}" x2="${x + w}" y1="${y}" y2="${y}" class="st-l"/>`; }
    for (let k = 10; k <= d; k += 2) { const y = BOT - k * SP / 2; out += `<line x1="${x - w}" x2="${x + w}" y1="${y}" y2="${y}" class="st-l"/>`; }
    return out;
  }
  function clefGlyph(clef, x) {
    if (clef === 'g') return `<text x="${x}" y="${BOT + 6}" class="mus clef" font-size="46">𝄞</text>`;
    return `<text x="${x}" y="${TOP + 35}" class="mus clef" font-size="40">𝄢</text>`;
  }
  function keySig(count, clef, x0) {
    let out = '';
    const pos = count > 0 ? SHARP_POS[clef] : FLAT_POS[clef];
    const g = count > 0 ? '♯' : '♭';
    for (let i = 0; i < Math.abs(count); i++) {
      const y = yOf(pos[i], clef);
      out += `<text x="${x0 + i * 10}" y="${y + ACC_DY[g]}" class="mus acc" font-size="19">${g}</text>`;
    }
    return out;
  }
  function timeSig(ts, x) {
    if (!ts) return '';
    if (ts === 'C' || ts === '¢') return `<text x="${x}" y="${TOP + (ts === 'C' ? 34 : 33)}" class="mus ts" font-size="28">${ts === 'C' ? '𝄴' : '𝄵'}</text>`;
    const [a, b] = ts.split('/');
    return `<text x="${x + 8}" y="${TOP + 20}" class="ts" font-size="27" text-anchor="middle">${a}</text><text x="${x + 8}" y="${TOP + 40}" class="ts" font-size="27" text-anchor="middle">${b}</text>`;
  }

  /* opts: {clef:'g'|'f', key:0, notes:[...], names:'fi'|'oct'|false, time, colW, forceAcc, small}
     note item: 'C4' | ['C4','E4'] | {n:'C4'|[...], lab, c, hl} | '|' */
  function staff(opts) {
    const clef = opts.clef || 'g';
    const key = opts.key || 0;
    const kacc = T.keyAcc(key);
    const items = opts.notes || [];
    const colW = opts.colW || 44;
    let x = 44;
    let body = clefGlyph(clef, 4);
    if (key) { body += keySig(key, clef, x - 2); x += Math.abs(key) * 10 + 4; }
    if (opts.time) { body += timeSig(opts.time, x); x += 26; }
    x += 14;
    let labels = '';
    let minY = TOP - 18, maxY = BOT + 20;
    items.forEach((it, idx) => {
      if (it === '|' || it === '||') {
        body += `<line x1="${x - colW / 2 + 6}" x2="${x - colW / 2 + 6}" y1="${TOP}" y2="${BOT}" class="st-b"/>`;
        if (it === '||') body += `<line x1="${x - colW / 2 + 10}" x2="${x - colW / 2 + 10}" y1="${TOP}" y2="${BOT}" class="st-b thick"/>`;
        x += 8; return;
      }
      const o = typeof it === 'object' && !Array.isArray(it) ? it : { n: it };
      const ns = (Array.isArray(o.n) ? o.n : [o.n]).slice().sort((a, b) => T.dia(a) - T.dia(b));
      let prevD = -99, shift = false, accCol = 0;
      const hollow = o.dur !== 'q';
      ns.forEach((n, i) => {
        const p = T.parse(n);
        const y = yOf(n, clef);
        minY = Math.min(minY, y - 8); maxY = Math.max(maxY, y + 8);
        const d = T.dia(n);
        // Sekunti- ja priimi-intervalleissa vierekkäiset nuotinpäät siirretään sivuun, jotta ne eivät mene päällekkäin
        shift = (d - prevD <= 1) ? !shift : false;
        prevD = d;
        const nx = x + (shift ? 13 : 0);
        body += ledgers(n, clef, x + (shift ? 6 : 0), shift ? 17 : 11);
        const showAcc = p.acc !== kacc[p.l] || (opts.forceAcc && p.acc !== 0);
        if (showAcc) {
          const gx = x - 19 - (accCol % 2) * 10;
          accCol++;
          body += `<text x="${gx}" y="${y + ACC_DY[T.accGlyph(p.acc)]}" class="mus acc" font-size="19" text-anchor="middle">${T.accGlyph(p.acc)}</text>`;
        }
        const col = o.c || (colorize ? T.color(n) : 'var(--ink)');
        if (o.hl) body += `<ellipse cx="${nx}" cy="${y}" rx="12" ry="9" class="hl-ring"/>`;
        body += `<g transform="translate(${nx},${y}) rotate(-20)">`
          + (hollow
            ? `<ellipse rx="6.8" ry="4.6" fill="${col}" stroke="var(--ink)" stroke-width="1.2"/><ellipse rx="3.6" ry="2.1" fill="var(--paper)" transform="rotate(-25)"/>`
            : `<ellipse rx="6.6" ry="4.6" fill="${col}" stroke="var(--ink)" stroke-width="1.2"/>`)
          + `</g>`;
        if (o.dur === 'q') {
          const up = T.dia(ns[0]) - REF[clef] < 4;
          body += up ? `<line x1="${nx + 6}" x2="${nx + 6}" y1="${y - 1}" y2="${y - 32}" class="stem"/>` : `<line x1="${nx - 6}" x2="${nx - 6}" y1="${y + 1}" y2="${y + 32}" class="stem"/>`;
        }
      });
      let lab = o.lab;
      // Sävelnimet pienellä kuten tehtävissä (iso alkukirjain tarkoittaisi suurta oktaavia)
      if (lab === undefined && opts.names) lab = ns.map(n => opts.names === 'oct' ? T.octName(n) : T.name(n).toLowerCase()).join(' ');
      if (opts.labels) lab = opts.labels[idx];
      if (lab) labels += `<text x="${x + 2}" y="LABY" class="st-lab" text-anchor="middle">${esc(lab)}</text>`;
      x += colW;
    });
    if (opts.end) body += `<line x1="${x - colW / 2 + 4}" x2="${x - colW / 2 + 4}" y1="${TOP}" y2="${BOT}" class="st-b"/><line x1="${x - colW / 2 + 9}" x2="${x - colW / 2 + 9}" y1="${TOP}" y2="${BOT}" class="st-b thick"/>`;
    const W = Math.max(x - colW / 2 + 16, opts.minW || 120);
    const labY = maxY + 16;
    labels = labels.replace(/LABY/g, labY);
    const H0 = Math.min(minY, TOP - 18) - 2;
    const H1 = (labels ? labY + 6 : maxY + 4);
    let lines = '';
    for (let i = 0; i < 5; i++) lines += `<line x1="0" x2="${W}" y1="${TOP + i * SP}" y2="${TOP + i * SP}" class="st-line"/>`;
    return `<svg class="staff" viewBox="0 ${H0} ${W} ${H1 - H0}" style="max-width:${Math.round(W * (opts.scale || 2.3))}px" role="img" aria-label="nuottiviivasto">${lines}${body}${labels}</svg>`;
  }

  /* Piano: {from:'C4', oct:2, marks:[{n,lab}] | ['C4'], labels:'all'|'none', bands, legend}
     Oktaavialat näkyvät palkkina koskettimien yläpuolella, valkoisissa koskettimissa on sävelnimi
     oktaavialan kirjoitustavalla (C, c, c¹, c²) ja keski-c (c¹) on merkitty. */
  const OCT_SHORT = { 1: 'kontraoktaavi', 2: 'suuri oktaavi', 3: 'pieni oktaavi', 4: 'yksiviivainen', 5: 'kaksiviivainen', 6: 'kolmiviivainen', 7: 'neliviivainen' };
  function piano(opts = {}) {
    // Koskettimisto alkaa aina c:stä, jotta valkoisten ja mustien koskettimien järjestys on oikea
    const from = { ...T.parse(opts.from || 'C4'), l: 0, acc: 0 };
    const oct = opts.oct || 2;
    const WW = 34, WH = 150, BW = 21, BH = 92;
    const bands = opts.bands !== false;
    const Y0 = bands ? 30 : 0;
    const startMidi = T.midi(from);
    const marks = {};
    (opts.marks || []).forEach(m => {
      const o = typeof m === 'string' ? { n: m } : m;
      marks[T.midi(o.n)] = { lab: o.lab !== undefined ? o.lab : T.name(o.n).toLowerCase() };
    });
    const showNames = opts.labels !== 'none';
    const nWhite = oct * 7 + 1;
    let whites = '', blacks = '', top = '', under = '';
    const WPC = [0, 2, 4, 5, 7, 9, 11];
    if (bands) for (let o = 0; o < oct; o++) {
      const x = o * 7 * WW;
      const on = from.oct + o;
      top += `<rect x="${x + 2}" y="2" width="${7 * WW - 4}" height="22" rx="6" class="pk-band b${o % 2}"/>`
        + `<text x="${x + 3.5 * WW}" y="17.5" class="pk-band-t">${OCT_SHORT[on] || ''} · ${T.octName({ l: 0, acc: 0, oct: on })}–${T.octName({ l: 6, acc: 0, oct: on })}</text>`;
    }
    for (let i = 0; i < nWhite; i++) {
      const o = Math.floor(i / 7), l = i % 7;
      const m = startMidi + o * 12 + WPC[l];
      const mk = marks[m];
      const x = i * WW;
      const full = T.octName({ l, acc: 0, oct: from.oct + o });
      const plain = l === 0 || opts.octAll ? full : full.replace(/[¹²³⁴₁₂]/g, '');
      whites += `<g class="pk" data-midi="${m}"><rect x="${x}" y="${Y0}" width="${WW}" height="${WH}" rx="5" class="wk${mk ? ' mk' : ''}"/>`;
      if (mk) { const w = Math.max(WW - 6, String(mk.lab).length * 7.6 + 10); whites += `<rect x="${x + WW / 2 - w / 2}" y="${Y0 + WH - 34}" width="${w}" height="24" rx="6" class="pk-pill"/><text x="${x + WW / 2}" y="${Y0 + WH - 17}" class="pk-lab on">${esc(mk.lab)}</text>`; }
      else if (showNames) whites += `<text x="${x + WW / 2}" y="${Y0 + WH - 16}" class="pk-lab${l === 0 ? ' c' : ''}">${plain}</text>`;
      whites += `</g>`;
      if (m === 60) under += `<path d="M${x + WW / 2 - 6} ${Y0 + WH + 12} l6 -8 l6 8z" class="pk-mid"/><text x="${x + WW / 2}" y="${Y0 + WH + 26}" class="pk-mid-t">c¹</text>`;
      if (i < nWhite - 1 && [0, 1, 3, 4, 5].includes(l)) {
        const bm = m + 1;
        const bk = marks[bm];
        const bx = x + WW - BW / 2;
        blacks += `<g class="pk" data-midi="${bm}"><rect x="${bx}" y="${Y0}" width="${BW}" height="${BH}" rx="3" class="bk${bk ? ' mk' : ''}"/>`;
        // Mustan koskettimen nimi näytetään sen alapuolella omassa lapussaan, koska kosketin on kapea
        if (bk) { const w = Math.max(BW + 4, String(bk.lab).length * 7.2 + 10); blacks += `<rect x="${bx + BW / 2 - w / 2}" y="${Y0 + BH + 4}" width="${w}" height="20" rx="6" class="pk-pill"/><text x="${bx + BW / 2}" y="${Y0 + BH + 18}" class="pk-lab on blk">${esc(bk.lab)}</text>`; }
        // Mustien koskettimien nimet (♯- tai ♭-nimet) pienellä koskettimen alaosassa
        else if (opts.blackNames) {
          const bo = from.oct + o, nm = opts.blackNames > 0 ? T.octName({ l, acc: 1, oct: bo }) : T.octName({ l: l + 1, acc: -1, oct: bo });
          blacks += `<text x="${bx + BW / 2}" y="${Y0 + BH - 9}" class="pk-blab">${nm}</text>`;
        }
        blacks += `</g>`;
      }
    }
    const W = nWhite * WW;
    const H = Y0 + WH + (under ? 32 : 4);
    const svg = `<svg class="piano" viewBox="-14 -2 ${W + 28} ${H + 2}" style="max-width:${Math.round(W * 1.5)}px" role="img" aria-label="piano">${top}${whites}${blacks}${under}</svg>`;
    if (opts.legend === false) return svg;
    // Ohje piilossa napin takana: kuvat koskettimista ja lyhyet selitykset
    const anyMark = Object.keys(marks).length > 0;
    const key = (cls, w = 16, h = 26) => `<svg class="hk" viewBox="0 0 ${w + 2} ${h + 2}" width="${w + 2}" height="${h + 2}" aria-hidden="true"><rect x="1" y="1" width="${w}" height="${h}" rx="3" class="${cls}"/></svg>`;
    const rows = [
      anyMark && [key('wk mk'), 'Korostettu kosketin', 'sävel, josta puhutaan'],
      [key('wk'), 'Valkoinen kosketin', 'perussävel: c d e f g a h'],
      [key('bk', 11, 18), 'Musta kosketin', 'korotettu ♯ tai alennettu ♭ sävel'],
      bands && ['<span class="hk-band">c¹–h¹</span>', 'Palkki koskettimien yllä', 'oktaavialan nimi'],
      under && ['<span class="hk-mid">▲<small>c¹</small></span>', 'Nuoli', 'keski-c eli yksiviivainen c'],
    ].filter(Boolean);
    return `<figure class="pianofig">${svg}<details class="pk-help"><summary><span class="q" aria-hidden="true">?</span>Mitä värit tarkoittavat?</summary>
      <div class="pk-help-body">${rows.map(([ic, t, d]) => `<div class="hrow"><span class="hic">${ic}</span><span><b>${t}</b><small>${d}</small></span></div>`).join('')}</div></details></figure>`;
  }

  /* Rytmi: tokenit välilyönnein: w h q e s (+ '.' pisteellinen), r-etuliite = tauko, [ ] = palkki,
     3[ ... ] = trioli, '|' tahtiviiva, '||' loppuviiva, '_' = sidekaari edelliseen. */
  const DUR = { w: 4, h: 2, q: 1, e: 0.5, s: 0.25, t: 0.125 };
  // Taukomerkkien perusviivan siirto: kokotauko roikkuu viivan alla, puolitauko istuu viivalla, muut keskellä
  const REST_DY = { w: 17.7, h: 8.2, q: 17, e: 16.8, s: 16.8, t: 16 };
  const REST_G = { w: '𝄻', h: '𝄼', q: '𝄽', e: '𝄾', s: '𝄿', t: '𝅀' };
  function parseRhythm(src) {
    const toks = src.trim().split(/\s+/);
    const ev = [];
    let group = null, trip = false;
    toks.forEach(tk => {
      if (tk === '|' || tk === '||') { ev.push({ bar: tk }); return; }
      let m;
      let open = false, close = false, triplet = false, tie = false;
      if (tk.startsWith('3[')) { open = true; triplet = true; tk = tk.slice(2); }
      else if (tk.startsWith('[')) { open = true; tk = tk.slice(1); }
      if (tk.endsWith(']')) { close = true; tk = tk.slice(0, -1); }
      if (tk.startsWith('_')) { tie = true; tk = tk.slice(1); }
      m = /^(r?)([whqest])(\.?)$/.exec(tk);
      if (!m) return;
      if (open) { group = []; trip = triplet; }
      const base = DUR[m[2]] * (m[3] ? 1.5 : 1);
      const e = { rest: !!m[1], v: m[2], dot: !!m[3], q: trip && group ? base * 2 / 3 : base, tie, trip: trip && !!group };
      ev.push(e);
      if (group) group.push(e);
      if (close && group) { group.forEach((g, i) => { g.beam = group; g.beamIdx = i; }); if (trip) group.trip = true; group = null; trip = false; }
    });
    return ev;
  }
  const SYL = { w: 'taa-a-a-a', h: 'taa-a', q: 'ta', e: 'ti', s: 'ri', 'h.': 'taa-a-a', 'q.': 'ta-a', 'e.': 'ti-i' };

  function rhythm(src, opts = {}) {
    const ev = parseRhythm(src);
    const Y = 70, STEM = 36;
    let x = 20;
    let body = '';
    // Yksiviivaisessa rytmissä yläluku viivan yläpuolelle ja alaluku alapuolelle
    if (opts.time) { body += timeSig(opts.time, 6).replace(/y="(\d+)"/g, (a, b) => `y="${+b - 1}"`); x += 34; }
    const pos = [];
    ev.forEach(e => {
      if (e.bar) {
        body += `<line x1="${x}" x2="${x}" y1="${Y - 26}" y2="${Y + 26}" class="st-b"/>`;
        if (e.bar === '||') body += `<line x1="${x + 5}" x2="${x + 5}" y1="${Y - 26}" y2="${Y + 26}" class="st-b thick"/>`;
        x += 18; return;
      }
      const w = 26 + Math.sqrt(e.q) * 26;
      e.x = x + 8;
      pos.push(e);
      x += w;
    });
    const W = x + 6;
    pos.forEach(e => {
      const cx = e.x;
      if (e.rest) {
        body += `<text x="${cx}" y="${Y + REST_DY[e.v]}" class="mus rest" font-size="34" text-anchor="middle">${REST_G[e.v]}</text>`;
        if (e.dot) body += `<circle cx="${cx + 12}" cy="${Y - 3}" r="2.4" class="dot"/>`;
      } else {
        const hollow = e.v === 'w' || e.v === 'h';
        body += `<g transform="translate(${cx},${Y}) rotate(-20)">` + (hollow
          ? `<ellipse rx="7.2" ry="5" class="nh"/><ellipse rx="3.8" ry="2.2" fill="var(--paper)" transform="rotate(-25)"/>`
          : `<ellipse rx="7" ry="5" class="nh"/>`) + `</g>`;
        if (e.dot) body += `<circle cx="${cx + 13}" cy="${Y - 3}" r="2.4" class="dot"/>`;
        if (e.v !== 'w') body += `<line x1="${cx + 6.3}" x2="${cx + 6.3}" y1="${Y - 2}" y2="${Y - STEM}" class="stem"/>`;
        if (!e.beam && ['e', 's', 't'].includes(e.v)) {
          const nFlags = { e: 1, s: 2, t: 3 }[e.v];
          for (let f = 0; f < nFlags; f++) body += `<path d="M${cx + 6.3} ${Y - STEM + f * 7} c 2 7, 12 9, 7 20 c 3 -9, -3 -13, -7 -15z" class="flag"/>`;
        }
        if (e.tie && e.prev) { }
      }
    });
    // ties
    let prev = null;
    pos.forEach(e => { if (e.tie && prev) body += `<path d="M${prev.x + 4} ${Y + 9} Q ${(prev.x + e.x) / 2} ${Y + 22} ${e.x - 4} ${Y + 9}" class="tie"/>`; prev = e; });
    // beams
    const seen = new Set();
    pos.forEach(e => {
      if (!e.beam || seen.has(e.beam)) return;
      seen.add(e.beam);
      // Palkki vain koukullisille arvoille: neljäsosa- ja puolinuottitriolissa on pelkkä 3-hakasulje
      const g = e.beam.filter(n => !n.rest && ['e', 's', 't'].includes(n.v));
      const a = e.beam[0], b = e.beam[e.beam.length - 1];
      if (g.length >= 2) {
        const x1 = g[0].x + 6.3, x2 = g[g.length - 1].x + 6.3;
        body += `<rect x="${x1 - 0.8}" y="${Y - STEM - 1}" width="${x2 - x1 + 1.6}" height="5" class="beam"/>`;
        // toissijaiset palkit (16-osat)
        for (let i = 0; i < g.length; i++) {
          const n = g[i];
          if (n.v !== 's' && n.v !== 't') continue;
          const nx = g[i + 1] && (g[i + 1].v === 's' || g[i + 1].v === 't') ? g[i + 1] : null;
          const px = g[i - 1] && (g[i - 1].v === 's' || g[i - 1].v === 't') ? g[i - 1] : null;
          if (nx) body += `<rect x="${n.x + 5.5}" y="${Y - STEM + 7}" width="${nx.x - n.x + 1.6}" height="5" class="beam"/>`;
          else if (!px) {
            const dir = i === g.length - 1 ? -9 : 9;
            body += `<rect x="${dir < 0 ? n.x + 6.3 + dir : n.x + 5.5}" y="${Y - STEM + 7}" width="${Math.abs(dir) + 1}" height="5" class="beam"/>`;
          }
        }
      } else if (g.length === 1) {
        body += `<path d="M${g[0].x + 6.3} ${Y - STEM} c 2 7, 12 9, 7 20 c 3 -9, -3 -13, -7 -15z" class="flag"/>`;
      }
      if (e.beam.trip) {
        const mx = (a.x + b.x) / 2 + 6;
        body += `<path d="M${a.x} ${Y - STEM - 8} v-5 H${mx - 7} M${mx + 7} ${Y - STEM - 13} H${b.x + 10} v5" class="tbr"/><text x="${mx}" y="${Y - STEM - 9}" class="trip" text-anchor="middle">3</text>`;
      }
    });
    if (opts.syl) pos.forEach(e => {
      const k = e.v + (e.dot ? '.' : '');
      const s = e.rest ? '(tauko)' : (SYL[k] || '');
      body += `<text x="${e.x + 3}" y="${Y + 34}" class="syl" text-anchor="middle">${s}</text>`;
    });
    if (opts.beats) pos.forEach(e => {
      body += `<text x="${e.x + 3}" y="${Y + (opts.syl ? 50 : 34)}" class="beatv" text-anchor="middle">${fmtBeats(e.q)}</text>`;
    });
    if (opts.nums) pos.forEach((e, i) => {
      body += `<circle cx="${e.x + 2}" cy="${Y + 30}" r="8" class="numc"/><text x="${e.x + 2}" y="${Y + 34}" class="numt" text-anchor="middle">${i + 1}</text>`;
    });
    const H = 30 + (opts.syl ? 20 : 0) + (opts.beats ? 18 : 0) + (opts.nums ? 14 : 0);
    return `<svg class="rhythm" viewBox="0 18 ${W} ${70 + H}" style="max-width:${Math.round(W * 2)}px" role="img" aria-label="rytmi"><line x1="0" x2="${W}" y1="${Y}" y2="${Y}" class="st-line"/>${body}</svg>`;
  }
  function fmtBeats(q) {
    const f = { 4: '4', 3: '3', 2: '2', 1.5: '1½', 1: '1', 0.75: '¾', 0.5: '½', 0.375: '⅜', 0.25: '¼', 0.125: '⅛' };
    if (f[q]) return f[q];
    if (Math.abs(q - 1 / 3) < 0.01) return '⅓';
    if (Math.abs(q - 2 / 3) < 0.01) return '⅔';
    if (Math.abs(q - 1 / 6) < 0.01) return '⅙';
    return String(+q.toFixed(2));
  }
  const rhythmEvents = src => parseRhythm(src).filter(e => !e.bar).map(e => ({ q: e.q, rest: e.rest, tie: e.tie }));

  /* Kvinttiympyrä: {hi: index 0-11, onPick} – 0 = C ylhäällä */
  const CIRCLE = [
    { M: 'C', m: 'a', k: 0 }, { M: 'G', m: 'e', k: 1 }, { M: 'D', m: 'h', k: 2 }, { M: 'A', m: 'fis', k: 3 },
    { M: 'E', m: 'cis', k: 4 }, { M: 'H', m: 'gis', k: 5 }, { M: 'Fis / Ges', m: 'dis / es', k: 6 },
    { M: 'Des', m: 'b', k: -5 }, { M: 'As', m: 'f', k: -4 }, { M: 'Es', m: 'c', k: -3 }, { M: 'B', m: 'g', k: -2 }, { M: 'F', m: 'd', k: -1 },
  ];
  function circle(opts = {}) {
    const cx = 170, cy = 170, R1 = 160, R2 = 112, R3 = 72;
    let out = '';
    CIRCLE.forEach((c, i) => {
      const a0 = (i - 0.5) / 12 * Math.PI * 2 - Math.PI / 2, a1 = (i + 0.5) / 12 * Math.PI * 2 - Math.PI / 2;
      const p = (r, a) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
      const on = opts.hi === i;
      out += `<g class="cf-seg${on ? ' on' : ''}" data-i="${i}">`
        + `<path d="M${p(R1, a0)} A${R1} ${R1} 0 0 1 ${p(R1, a1)} L${p(R2, a1)} A${R2} ${R2} 0 0 0 ${p(R2, a0)}Z" class="cf-out${on ? ' on' : i % 2 ? ' alt' : ''}"/>`
        + `<path d="M${p(R2, a0)} A${R2} ${R2} 0 0 1 ${p(R2, a1)} L${p(R3, a1)} A${R3} ${R3} 0 0 0 ${p(R3, a0)}Z" class="cf-in${on ? ' on' : i % 2 ? ' alt' : ''}"/>`;
      const am = i / 12 * Math.PI * 2 - Math.PI / 2;
      const t = (r, s, cls, fs) => `<text x="${(cx + r * Math.cos(am)).toFixed(1)}" y="${(cy + r * Math.sin(am) + fs / 3).toFixed(1)}" class="${cls}" font-size="${fs}" text-anchor="middle">${s}</text>`;
      out += t(136, c.M, 'cf-M', c.M.length > 3 ? 12 : 19);
      out += t(92, c.m, 'cf-m', c.m.length > 4 ? 10 : 14);
      const cnt = c.k === 0 ? '' : c.k === 6 ? '6♯/6♭' : Math.abs(c.k) + (c.k > 0 ? '♯' : '♭');
      out += t(R1 + 14, cnt, 'cf-n', 11);
      out += `</g>`;
    });
    const sel = opts.hi !== undefined ? CIRCLE[opts.hi] : null;
    out += `<circle cx="${cx}" cy="${cy}" r="${R3 - 4}" class="cf-core"/>`;
    out += sel
      ? `<text x="${cx}" y="${cy - 8}" class="cf-c1" text-anchor="middle">${sel.M}</text><text x="${cx}" y="${cy + 16}" class="cf-c2" text-anchor="middle">${sel.m}</text>`
      : `<text x="${cx}" y="${cy + 6}" class="cf-c2" text-anchor="middle">valitse</text>`;
    return `<svg class="circle" viewBox="-20 -20 380 380" role="img" aria-label="kvinttiympyrä">${out}</svg>`;
  }

  return { staff, piano, rhythm, rhythmEvents, parseRhythm, circle, CIRCLE, fmtBeats, set colorize(v) { colorize = v; }, get colorize() { return colorize; } };
})();
