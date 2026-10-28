/* Sävelpolku – loputtomat harjoitustehtävät. Jokainen generaattori palauttaa { q, v, o, a, e, play } */
const P = (() => {
  const { rand, shuffle } = T;
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const DEG = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const SUPS = { 0: '', 1: '⁶', 2: '⁶₄' };

  function opts(correct, cands, n = 4) {
    const set = [correct];
    for (const c of shuffle(cands)) { if (set.length >= n) break; if (c && !set.includes(c)) set.push(c); }
    const o = shuffle(set);
    return { o, a: o.indexOf(correct) };
  }
  const keyRange = lv => lv >= 3 ? 7 : 4;
  const accOK = (n, lv) => Math.abs(T.parse(n).acc) <= (lv >= 3 ? 2 : 1);
  function randAcc(lv) {
    const r = Math.random();
    if (lv >= 3 && r < 0.12) return rand([2, -2]);
    if (r < 0.55) return 0;
    return rand([1, -1]);
  }
  const ivSet = lv => {
    const base = ['pu1', 'pi2', 's2', 'pi3', 's3', 'pu4', 'pu5', 'pi6', 's6', 'pi7', 's7', 'pu8', 'y4', 'v5', 'y5', 'y2', 'v4', 'y6', 'v8', 'y3', 'v7'];
    return lv >= 3 ? base.concat(['s9', 'pi9', 's10', 'pi10', 'y9', 'v6', 'y8']) : base;
  };

  // ---------- 1. Nuotin nimi ja oktaaviala ----------
  function nimiOkt(lv) {
    const clef = Math.random() < 0.6 ? 'g' : 'f';
    const lo = clef === 'g' ? T.dia('A3') : T.dia('C2'), hi = clef === 'g' ? T.dia('D6') : T.dia('E4');
    const d = ri(lo, hi);
    const n = T.str({ l: d % 7, oct: Math.floor(d / 7), acc: randAcc(lv) });
    const ans = T.octName(n);
    const p = T.parse(n);
    const c = [
      T.octName({ ...p, oct: p.oct + 1 }), T.octName({ ...p, oct: p.oct - 1 }),
      T.octName({ ...p, acc: p.acc === 0 ? 1 : 0 }), T.octName({ ...p, acc: -p.acc || -1 }),
      T.octName({ l: (p.l + 1) % 7, oct: p.oct + (p.l === 6 ? 1 : 0), acc: p.acc }), T.octName({ l: (p.l + 6) % 7, oct: p.oct - (p.l === 0 ? 1 : 0), acc: p.acc }),
    ];
    return { q: 'Merkitse nuotin nimi ja oktaaviala.', v: { staff: { clef, notes: [n], forceAcc: true } }, ...opts(ans, c), e: `Oikea vastaus: <b>${ans}</b> (${T.OCT_FI[p.oct]}).`, play: { notes: [n] } };
  }

  // ---------- 2. Piirrä pyydetty nuotti ----------
  function piirra(lv) {
    const clef = Math.random() < 0.6 ? 'g' : 'f';
    const lo = clef === 'g' ? T.dia('B3') : T.dia('D2'), hi = clef === 'g' ? T.dia('B5') : T.dia('C4');
    const d = ri(lo, hi);
    const p = { l: d % 7, oct: Math.floor(d / 7), acc: randAcc(lv) };
    const n = T.str(p);
    const variants = [n, T.str({ ...p, oct: p.oct + (d + 7 <= hi + 4 ? 1 : -1) }), T.str({ l: (p.l + 1) % 7, oct: p.oct + (p.l === 6 ? 1 : 0), acc: p.acc }), T.str({ ...p, acc: p.acc === 0 ? rand([1, -1]) : 0 }), T.str({ l: (p.l + 6) % 7, oct: p.oct - (p.l === 0 ? 1 : 0), acc: p.acc })];
    const uniq = [...new Set(variants)].slice(0, 4);
    const o = shuffle(uniq);
    return { q: `Mikä viivasto näyttää sävelen <b>${T.octName(n)}</b>?`, o: o.map(x => R.staff({ clef, notes: [x], forceAcc: true, scale: 1.1 })), a: o.indexOf(n), e: `${T.octName(n)} on merkitty oikein vaihtoehdossa, joka nyt näkyy vihreänä.`, optClass: 'opt-staff' };
  }

  // ---------- 3. Sävellaji etumerkinnästä ----------
  function savellaji(lv) {
    const R_ = keyRange(lv);
    const k = ri(-R_, R_);
    const ans = `${T.name(T.MAJOR[k])} – ${T.name(T.MINOR[k]).toLowerCase()}`;
    const c = [];
    for (let j = -R_; j <= R_; j++) if (j !== k && Math.abs(j - k) <= 3) c.push(`${T.name(T.MAJOR[j])} – ${T.name(T.MINOR[j]).toLowerCase()}`);
    c.push(`${T.name(T.MINOR[k])} – ${T.name(T.MAJOR[k]).toLowerCase()}`);
    const clef = rand(['g', 'f']);
    return { q: 'Merkitse sävellajit (duuri – molli).', v: { staff: { clef, key: k, notes: [] } }, ...opts(ans, c), e: `${Math.abs(k)} ${k >= 0 ? 'korotusta' : 'alennusta'} = <b>${T.majorName(k)}</b> ja <b>${T.minorName(k)}</b>.` };
  }

  // ---------- 4. Etumerkit sävellajissa ----------
  function etumerkit(lv) {
    const R_ = keyRange(lv);
    const k = ri(-R_, R_);
    const list = cnt => cnt === 0 ? 'ei etumerkkejä' : (cnt > 0 ? T.SHARP_ORDER.slice(0, cnt).map(l => T.name({ l, acc: 1, oct: 4 }).toLowerCase()) : T.FLAT_ORDER.slice(0, -cnt).map(l => T.name({ l, acc: -1, oct: 4 }).toLowerCase())).join(' ');
    const minor = Math.random() < 0.4;
    const name = minor ? T.minorName(k) : T.majorName(k);
    const c = [list(k + 1), list(k - 1), list(-k), list(k + 2), list(k - 2)].filter((x, i) => Math.abs([k + 1, k - 1, -k, k + 2, k - 2][i]) <= 7);
    return { q: `Mitkä etumerkit on <b>${name}</b>ssa?`, ...opts(list(k), c), e: `${name}: ${list(k)}.`, ev: { staff: { clef: 'g', key: k, notes: [] } } };
  }

  // ---------- 5. Asteikko ----------
  function asteikko(lv) {
    const types = lv >= 3 ? ['duuri', 'luonnollinen', 'harmoninen', 'melodinen', 'itämainen'] : ['duuri', 'luonnollinen', 'harmoninen', 'melodinen'];
    const type = rand(types);
    const R_ = Math.min(keyRange(lv), 5);
    let k = ri(-R_, R_);
    const tonicS = (type === 'duuri' ? T.MAJOR : T.MINOR)[k];
    const p = T.parse(tonicS); p.oct = p.l >= 5 ? 3 : 4;
    const notes = T.scale(T.str(p), type);
    const nm = t => t === 'duuri' ? T.name(tonicS) + '-duuriasteikko' : `${t} ${T.name(tonicS).toLowerCase()}-molliasteikko`;
    const ans = nm(type);
    const c = types.filter(t => t !== type).map(nm);
    const clef = p.oct === 3 && Math.random() < 0.5 ? 'f' : 'g';
    const n2 = clef === 'f' ? notes.map(x => { const q = T.parse(x); q.oct -= 1; return T.str(q); }) : notes;
    return { q: 'Mikä asteikko?', v: { staff: { clef, notes: n2, forceAcc: true, colW: 32 } }, ...opts(ans, c), e: `Sävelet: ${notes.map(T.name).join(' ')} → <b>${ans}</b>.`, play: { notes } };
  }

  // ---------- 6. Tunnista intervalli ----------
  function makeIv(lv, maxNum = 99) {
    for (let t = 0; t < 50; t++) {
      const ab = rand(ivSet(lv)); const { q, num } = T.ivFromAbbr(ab);
      if (num > maxNum) continue;
      const lo = { l: ri(0, 6), oct: 4, acc: Math.random() < 0.65 ? 0 : rand([1, -1]) };
      if (num >= 8) lo.oct = 3;
      const up = T.up(lo, num, q);
      if (!accOK(T.str(up), lv) || !accOK(T.str(lo), lv)) continue;
      return { lo: T.str(lo), hi: T.str(up), ab, q, num };
    }
    return { lo: 'C4', hi: 'E4', ab: 's3', q: 'suuri', num: 3 };
  }
  function intervalli(lv) {
    const iv = makeIv(lv);
    const clef = T.dia(iv.lo) < T.dia('A3') ? 'f' : 'g';
    const sameNum = ['pu', 's', 'pi', 'y', 'v'].map(x => x + iv.num);
    const c = sameNum.concat([iv.ab.replace(/\d+/, iv.num + 1), iv.ab.replace(/\d+/, Math.max(1, iv.num - 1))]).filter(x => { try { const { q, num } = T.ivFromAbbr(x); return [1, 4, 5, 8].includes(((num - 1) % 7) + 1) ? ['puhdas', 'ylinouseva', 'vähennetty'].includes(q) : q !== 'puhdas'; } catch (e) { return false; } });
    const lowerMaj = T.scale(T.str({ ...T.parse(iv.lo) }), 'duuri').map(T.name);
    return { q: 'Tunnista intervalli.', v: { staff: { clef, notes: [[iv.lo, iv.hi]], forceAcc: true } }, ...opts(iv.ab, c), e: `<b>${iv.ab}</b> = ${iv.q} ${T.INAMES[((iv.num - 1) % 7)] || ''}${iv.num > 8 ? ' (yli oktaavin: ' + (iv.num === 9 ? 'nooni' : 'desimi') + ')' : ''}. ${T.name(iv.lo)}-duuriasteikko: ${lowerMaj.slice(0, 7).join(' ')}.`, play: { notes: [iv.lo, iv.hi], mode: 'both' } };
  }

  // ---------- 7. Muodosta intervalli ----------
  function rakenna(lv) {
    const iv = makeIv(lv, lv >= 3 ? 10 : 8);
    const down = lv >= 2 && Math.random() < 0.3 && iv.num <= 8;
    const from = down ? iv.hi : iv.lo, ans = down ? iv.lo : iv.hi;
    const p = T.parse(ans);
    const c = [T.octName({ ...p, acc: p.acc + 1 }), T.octName({ ...p, acc: p.acc - 1 }), T.octName({ l: (p.l + 1) % 7, oct: p.oct + (p.l === 6 ? 1 : 0), acc: p.acc }), T.octName({ l: (p.l + 6) % 7, oct: p.oct - (p.l === 0 ? 1 : 0), acc: p.acc }), T.octName({ ...p, oct: p.oct + 1 })];
    return { q: `Muodosta <b>${iv.ab} ${down ? '↓ alaspäin' : '↑ ylöspäin'}</b> sävelestä <b>${T.octName(from)}</b>.`, v: { staff: { clef: T.dia(from) < T.dia('A3') ? 'f' : 'g', notes: [from], forceAcc: true } }, ...opts(T.octName(ans), c), e: `${T.octName(from)} ${down ? '↓' : '↑'} ${iv.ab} = <b>${T.octName(ans)}</b>.`, play: { notes: down ? [from, ans] : [from, ans] } };
  }

  // ---------- 8. Käännösintervalli ----------
  const INV_Q = { suuri: 'pieni', pieni: 'suuri', puhdas: 'puhdas', ylinouseva: 'vähennetty', 'vähennetty': 'ylinouseva' };
  function kaanteis() {
    const ab = rand(['pu1', 'pi2', 's2', 'pi3', 's3', 'pu4', 'y4', 'v5', 'pu5', 'pi6', 's6', 'pi7', 's7', 'pu8', 'y5', 'v4', 'y2', 'v7']);
    const { q, num } = T.ivFromAbbr(ab);
    const ans = T.Q_ABBR[INV_Q[q]] + (9 - num);
    const c = [T.Q_ABBR[q] + (9 - num), T.Q_ABBR[INV_Q[q]] + (10 - num), T.Q_ABBR[INV_Q[q]] + (8 - num), (q === 'puhdas' ? 'y' : T.Q_ABBR[q]) + (9 - num)];
    return { q: `Mikä on <b>${ab}</b>:n käännösintervalli?`, ...opts(ans, c), e: `${num} + ${9 - num} = 9 ja ${q} → ${INV_Q[q]}: <b>${ans}</b>.` };
  }

  // ---------- 9. Tunnista kolmisointu ----------
  const TRIADS = ['duuri', 'molli', 'ylinouseva', 'vähennetty'];
  function randRoot(lv) { for (;;) { const p = { l: ri(0, 6), oct: 4, acc: Math.random() < 0.6 ? 0 : rand([1, -1]) }; const ch = T.chord(T.str(p), 'duuri'); if (ch.every(x => accOK(x, lv)) && T.chord(T.str(p), 'ylinouseva').every(x => accOK(x, lv)) && T.chord(T.str(p), 'vähennetty').every(x => accOK(x, lv))) return T.str(p); } }
  function sointu(lv) {
    const root = randRoot(lv), type = rand(TRIADS);
    const notes = T.chord(root, type);
    const ans = T.chordSymbol(root, type);
    return { q: 'Tunnista soinnun laatu ja nimeä se sointumerkein.', v: { staff: { clef: 'g', notes: [notes], forceAcc: true } }, ...opts(ans, TRIADS.map(t => T.chordSymbol(root, t))), e: `${notes.map(T.name).join(' ')} = ${T.CHORD_FI[type]} → <b>${ans}</b>.`, play: { notes, mode: 'both' } };
  }

  // ---------- 10. Muodosta sointu merkistä ----------
  function muodosta(lv) {
    const root = randRoot(lv), type = rand(TRIADS);
    const nm = t => T.chord(root, t).map(x => T.name(x).toLowerCase()).join(' ');
    return { q: `Muodosta sointu <b>${T.chordSymbol(root, type)}</b>. Mitkä sävelet?`, ...opts(nm(type), TRIADS.map(nm)), e: `${T.chordSymbol(root, type)} = ${T.CHORD_FI[type]}: <b>${nm(type)}</b>.`, play: { notes: T.chord(root, type), mode: 'both' } };
  }

  // ---------- 11. Sointusysteemi ----------
  function systeemi(lv) {
    const root = randRoot(lv);
    const rules = [
      ['duuri', 'Alenna', 'keskimmäinen', 'molli'], ['molli', 'Korota', 'keskimmäinen', 'duuri'],
      ['duuri', 'Korota', 'ylin', 'ylinouseva'], ['molli', 'Alenna', 'ylin', 'vähennetty']];
    const [from, verb, which, to] = rand(rules);
    const s = T.chordSymbol(root, from);
    return { q: `Sointu <b>${s}</b> (${T.chord(root, from).map(x => T.name(x).toLowerCase()).join(' ')}): ${verb.toLowerCase()} <b>${which}</b> sävel. Mikä sointu syntyy?`, ...opts(T.chordSymbol(root, to), TRIADS.map(t => T.chordSymbol(root, t))), e: `${verb} ${which === 'ylin' ? 'ylin' : 'keskimmäinen'} sävel: ${from} → <b>${to}</b> (${T.chord(root, to).map(x => T.name(x).toLowerCase()).join(' ')}).` };
  }

  // ---------- 12. Sointuasteet ----------
  function keyTonic(k, minor) { const p = T.parse((minor ? T.MINOR : T.MAJOR)[k]); p.oct = p.l >= 4 ? 3 : 4; return T.str(p); }
  const keyLabel = (k, minor) => minor ? T.name(T.MINOR[k]).toLowerCase() : T.name(T.MAJOR[k]);
  function degreeInfo(k, minor, i, size = 3) {
    const sc = T.scale(keyTonic(k, minor), minor ? 'harmoninen' : 'duuri');
    const ch = T.degreeChord(sc, i, size);
    const type = T.chordType(ch);
    return { ch, type, sym: T.chordSymbol(ch[0], type) };
  }
  function aste(lv) {
    const R_ = keyRange(lv);
    const k = ri(-R_, R_), minor = Math.random() < 0.4, i = ri(0, 6);
    const d = degreeInfo(k, minor, i);
    if (!d.ch.every(x => accOK(x, 3))) return aste(lv);
    if (Math.random() < 0.55) {
      const c = TRIADS.map(t => T.chordSymbol(d.ch[0], t)).concat([degreeInfo(k, minor, (i + 1) % 7).sym, degreeInfo(k, minor, (i + 6) % 7).sym]);
      return { q: `Muodosta kolmisointu: <b>${keyLabel(k, minor)}:${DEG[i]}</b>. Mikä sointu?`, ...opts(d.sym, c), e: `${minor ? T.minorName(k) + ' (harmoninen)' : T.majorName(k)}: ${DEG[i]} aste = ${d.ch.map(x => T.name(x).toLowerCase()).join(' ')} = <b>${d.sym}</b>.`, play: { notes: d.ch, mode: 'both' }, v: { staff: { clef: 'g', key: k, notes: [] } } };
    }
    return { q: `Tunnista soinnun aste sävellajissa <b>${minor ? T.minorName(k) : T.majorName(k)}</b>.`, v: { staff: { clef: 'g', key: k, notes: [d.ch] } }, ...opts(DEG[i], DEG), e: `${d.ch.map(x => T.name(x).toLowerCase()).join(' ')} = ${d.sym} = <b>${DEG[i]} aste</b>.`, play: { notes: d.ch, mode: 'chord' } };
  }

  // ---------- 13. Käännökset (3) ----------
  function kaannos(lv) {
    const R_ = keyRange(lv);
    const k = ri(-R_, R_), minor = Math.random() < 0.3, i = ri(0, 6), inv = ri(0, 2);
    const d = degreeInfo(k, minor, i);
    const notes = T.invert(d.ch, inv);
    const key = keyLabel(k, minor);
    if (Math.random() < 0.5) {
      const names = ['perusmuoto (terssikvinttisointu)', 'sekstisointu', 'kvarttisekstisointu'];
      return { q: `Mikä käännös? (${key}:)`, v: { staff: { clef: 'g', key: k, notes: [notes] } }, ...opts(names[inv], names), e: `Sointu ${d.sym}; alimpana ${['pohjasävel', 'terssi', 'kvintti'][inv]} → <b>${names[inv]}</b> = ${key}:${DEG[i]}${SUPS[inv]}.`, play: { notes, mode: 'chord' } };
    }
    const ans = `${key}:${DEG[i]}${SUPS[inv]}`;
    const c = [0, 1, 2].map(x => `${key}:${DEG[i]}${SUPS[x]}`).concat([`${key}:${DEG[(i + 2) % 7]}${SUPS[inv]}`, `${key}:${DEG[(i + 5) % 7]}${SUPS[inv]}`]);
    return { q: 'Merkitse sointuaste ja käännös.', v: { staff: { clef: 'g', key: k, notes: [notes] } }, ...opts(ans, c), e: `${d.sym}, alimpana ${['pohjasävel', 'terssi', 'kvintti'][inv]} → <b>${ans}</b>.`, play: { notes, mode: 'chord' } };
  }

  // ---------- 14. Septimisoinnut (3) ----------
  const SEPT = ['maj7', 'dom7', 'm7', 'm7b5'];
  function septimi(lv) {
    const r = Math.random();
    if (r < 0.4) {
      const root = randRoot(3), type = rand(SEPT);
      const ch = T.chord(root, type);
      if (!ch.every(x => accOK(x, 3))) return septimi(lv);
      return { q: 'Nimeä septimisointu sointumerkein.', v: { staff: { clef: 'g', notes: [ch], forceAcc: true } }, ...opts(T.chordSymbol(root, type), SEPT.map(t => T.chordSymbol(root, t))), e: `${ch.map(x => T.name(x).toLowerCase()).join(' ')} = ${T.CHORD_FI[type]} → <b>${T.chordSymbol(root, type)}</b>.`, play: { notes: ch, mode: 'chord' } };
    }
    if (r < 0.7) {
      const type = rand(SEPT);
      const st = { maj7: 's3 + pi3 + s3', dom7: 's3 + pi3 + pi3', m7: 'pi3 + s3 + pi3', m7b5: 'pi3 + pi3 + s3' };
      return { q: `Mikä on <b>${T.CHORD_FI[type]}</b>in intervallirakenne?`, ...opts(st[type], Object.values(st)), e: `${T.CHORD_FI[type]} = <b>${st[type]}</b>.` };
    }
    const k = ri(-6, 6), i = ri(0, 6);
    const d = degreeInfo(k, false, i, 4);
    return { q: `Muodosta nelisointu <b>${T.name(T.MAJOR[k])}:${DEG[i]}⁷</b>. Mikä sointumerkki?`, ...opts(d.sym, SEPT.map(t => T.chordSymbol(d.ch[0], t))), e: `${T.majorName(k)}: ${DEG[i]}⁷ = ${d.ch.map(x => T.name(x).toLowerCase()).join(' ')} = <b>${d.sym}</b>.`, play: { notes: d.ch, mode: 'chord' } };
  }

  // ---------- 15. Transponointi ----------
  function transpo(lv) {
    for (let t = 0; t < 40; t++) {
      const minor = Math.random() < 0.4;
      const k = ri(-4, 4);
      const ab = rand(['s2', 'pi3', 's3', 'pu4', 'pu5', 'pi2', 's6', 'pi6']);
      const { q, num } = T.ivFromAbbr(ab);
      const dir = rand(['up', 'down']);
      const tonic = (minor ? T.MINOR : T.MAJOR)[k];
      const nt = dir === 'up' ? T.up(tonic, num, q) : T.down(tonic, num, q);
      const nk = T.keyCountOf(T.str(nt), minor);
      if (nk === null || Math.abs(nk) > keyRange(lv)) continue;
      const lab = c => minor ? T.minorName(c) : T.majorName(c);
      const cand = [nk + 1, nk - 1, nk + 2, -nk, nk + 5, nk - 5].filter(x => Math.abs(x) <= 7 && x !== nk).map(lab);
      return { q: `<b>${lab(k)}</b>n melodia transponoidaan <b>${ab} ${dir === 'up' ? 'ylöspäin ↑' : 'alaspäin ↓'}</b>. Mikä on uusi sävellaji?`, ...opts(lab(nk), cand), e: `${T.name(tonic)} ${dir === 'up' ? '↑' : '↓'} ${ab} = ${T.name(nt)} → <b>${lab(nk)}</b> (${Math.abs(nk)}${nk >= 0 ? '♯' : '♭'}).` };
    }
    return transpo(lv);
  }

  // ---------- 16. Nuottiarvot ----------
  const VALS = [['w', 'kokonuotti', 4], ['h', 'puolinuotti', 2], ['q', 'neljäsosanuotti', 1], ['e', 'kahdeksasosanuotti', .5], ['s', 'kuudestoistaosanuotti', .25], ['t', '32-osanuotti', .125]];
  const RESTS = [['rw', 'kokotauko'], ['rh', 'puolitauko'], ['rq', 'neljäsosatauko'], ['re', 'kahdeksasosatauko'], ['rs', 'kuudestoistaosatauko'], ['rt', '32-osatauko']];
  function arvot(lv) {
    const r = Math.random();
    if (r < 0.35) { const x = rand(VALS); return { q: 'Mikä nuotti?', v: { rhythm: x[0] }, ...opts(x[1], VALS.map(v => v[1])), e: `<b>${x[1]}</b>.` }; }
    if (r < 0.6) { const x = rand(RESTS); return { q: 'Mikä tauko?', v: { rhythm: x[0] }, ...opts(x[1], RESTS.map(v => v[1])), e: `<b>${x[1]}</b>.` }; }
    if (r < 0.8) {
      const [a, b] = shuffle(VALS.slice(0, 5)).slice(0, 2).sort((x, y) => y[2] - x[2]);
      const ans = String(a[2] / b[2]);
      return { q: `Montako <b>${b[1]}a</b> mahtuu yhteen <b>${a[1]}iin</b>?`, ...opts(ans, ['1', '2', '3', '4', '6', '8', '16'].filter(x => x !== ans)), e: `${a[1]} = ${ans} × ${b[1]}.` };
    }
    const x = rand([['h.', 3], ['q.', 1.5], ['e.', .75], ['w.', 6]]);
    const lab = R.fmtBeats(x[1]);
    return { q: 'Montako neljäsosaiskua kestää tämä nuotti?', v: { rhythm: x[0] }, ...opts(lab, ['1', '1½', '2', '3', '¾', '4', '6'].filter(y => y !== lab)), e: `Piste lisää puolet: <b>${lab}</b> iskua.` };
  }

  // ---------- 17. Tahtiviivat ----------
  const CHUNKS = {
    4: [['h', 2], ['q', 1], ['[e e]', 1], ['h.', 3], ['q. e', 2], ['[s s s s]', 1], ['rq', 1], ['[e s s]', 1], ['3[e e e]', 1]],
    8: [['q.', 3], ['[e e e]', 3], ['q e', 3], ['h.', 6], ['[e. s e]', 3], ['re [e e]', 3]],
  };
  function tahtiviiva(lv) {
    const ts = rand(lv >= 3 ? ['2/4', '3/4', '4/4', '6/8', '3/8', '5/8'] : ['2/4', '3/4', '4/4', '6/8', '3/8']);
    const [top, bot] = ts.split('/').map(Number);
    const unit = bot === 8 ? 0.5 : 1;
    const barLen = top * unit;
    const pool = CHUNKS[bot === 8 ? 8 : 4].filter(c => lv >= 3 || !c[0].includes('3['));
    const bars = [];
    for (let b = 0; b < 2; b++) {
      let left = bot === 8 ? top : top, toks = [];
      let guard = 0;
      while (left > 0 && guard++ < 50) {
        const fits = pool.filter(c => c[1] <= left);
        if (!fits.length) { toks.push(bot === 8 ? 'e' : 'q'); left -= 1; continue; }
        const c = rand(fits); toks.push(c[0]); left -= c[1];
      }
      bars.push(toks.join(' '));
    }
    const src = bars.join(' ');
    const evs = R.parseRhythm(bars[0]).filter(e => !e.bar).length;
    const total = R.parseRhythm(src).filter(e => !e.bar).length;
    if (total < 5 || evs < 2) return tahtiviiva(lv);
    const cand = [evs - 1, evs + 1, evs + 2, evs - 2].filter(x => x >= 1 && x < total);
    const o_ = opts(String(evs), cand.map(String), 3);
    return { q: `Tahtiosoitus <b>${ts}</b>. Monennenko nuotin/tauon jälkeen tulee ensimmäinen tahtiviiva?`, v: { rhythm: src, time: ts, nums: true }, ...o_, e: `Yhteen tahtiin mahtuu ${top} × ${bot === 8 ? 'kahdeksasosa' : 'neljäsosa'}. Ensimmäinen tahti: ${R.rhythm(bars[0])}`, play: { rhythm: src, bpm: bot === 8 ? 72 : 90, beats: top, unit: bot === 8 ? 0.5 : 1 } };
  }

  // ---------- 18. Säveltäjät (3) ----------
  function saveltaja() {
    const c = rand(COMPOSERS.filter(x => x.e !== 'The Beatles' || Math.random() < 0.3));
    const r = Math.random();
    if (r < 0.45) return { q: `Mihin aikakauteen kuuluu <b>${c.n}</b>?`, ...opts(c.e, ERAS.map(e => e.n)), e: `${c.n} (${c.y}) → <b>${c.e}</b>.` };
    if (r < 0.8) return { q: `Kuka säveltäjä eli <b>${c.y}</b>?`, ...opts(c.s, COMPOSERS.filter(x => x.s !== c.s).map(x => x.s)), e: `<b>${c.n}</b> ${c.y} (${c.e}).` };
    const e = rand(ERAS.slice(0, 7));
    return { q: `Mitkä vuodet ovat aikakauden <b>${e.n}</b> vuodet aikajanalla?`, ...opts(e.y, ERAS.map(x => x.y)), e: `${e.n}: <b>${e.y}</b>.` };
  }

  // ---------- 19. Kvinttiympyrä ----------
  function kvintti(lv) {
    const R_ = keyRange(lv);
    const k = ri(-R_, R_);
    const r = Math.random();
    if (r < 0.4) return { q: `Mikä on <b>${T.majorName(k)}</b>n rinnakkaissävellaji?`, ...opts(T.minorName(k), [-1, 1, 3, -3, 2].map(d => T.MINOR[k + d] && T.minorName(k + d)).filter(Boolean).concat([T.name(T.MAJOR[k]).toLowerCase() + '-molli'])), e: `${T.name(T.MAJOR[k])} − pi3 = ${T.name(T.MINOR[k]).toLowerCase()} → <b>${T.minorName(k)}</b>.` };
    const minor = Math.random() < 0.4;
    const nm = minor ? T.minorName(k) : T.majorName(k);
    const lab = c => c === 0 ? '0' : Math.abs(c) + (c > 0 ? '♯' : '♭');
    return { q: `Montako etumerkkiä on <b>${nm}</b>ssa?`, ...opts(lab(k), [k + 1, k - 1, -k, k + 2].filter(x => Math.abs(x) <= 7).map(lab)), e: `${nm} = <b>${lab(k)}</b>.`, ev: { circle: (k + 12) % 12 } };
  }

  // ---------- 20. Kuuntelu (bonus) ----------
  function kuulo(lv) {
    if (Math.random() < 0.5) {
      const root = rand(['C4', 'D4', 'E4', 'F4', 'G4', 'A3', 'Bb3']);
      const type = rand(lv >= 3 ? TRIADS : ['duuri', 'molli']);
      const set = lv >= 3 ? TRIADS : ['duuri', 'molli'];
      return { q: 'Kuuntele sointu. Mikä laatu?', ...opts(type, set), e: `Se oli <b>${type}</b> (${T.chordSymbol(root, type)}).`, play: { notes: T.chord(root, type), mode: 'both' }, autoplay: true };
    }
    const set = ['pi2', 's2', 'pi3', 's3', 'pu4', 'pu5', 'pu8'];
    const ab = rand(set); const { q, num } = T.ivFromAbbr(ab);
    const lo = rand(['C4', 'D4', 'E4', 'F4', 'G4']);
    const hi = T.str(T.up(lo, num, q));
    return { q: 'Kuuntele intervalli. Mikä se on?', ...opts(ab, set), e: `Se oli <b>${ab}</b>.`, play: { notes: [lo, hi], mode: 'both' }, autoplay: true };
  }

  const GENS = [
    { id: 'nimi', name: 'Nuotin nimi & oktaaviala', icon: 'c¹', f: nimiOkt, lv: 2 },
    { id: 'piirra', name: 'Piirrä pyydetty nuotti', icon: '✎', f: piirra, lv: 2 },
    { id: 'arvot', name: 'Nuotit ja tauot', icon: '♩♪', f: arvot, lv: 2 },
    { id: 'tahti', name: 'Tahtiviivat', icon: '3/4', f: tahtiviiva, lv: 2 },
    { id: 'savellaji', name: 'Sävellaji etumerkinnästä', icon: '♯', f: savellaji, lv: 2 },
    { id: 'etumerkit', name: 'Etumerkit sävellajissa', icon: '♭', f: etumerkit, lv: 2 },
    { id: 'kvintti', name: 'Kvinttiympyrä', icon: 'C–G', f: kvintti, lv: 2 },
    { id: 'asteikko', name: 'Asteikot', icon: 'KKP', f: asteikko, lv: 2 },
    { id: 'transpo', name: 'Transponointi', icon: '⇅', f: transpo, lv: 2 },
    { id: 'sointu', name: 'Tunnista kolmisointu', icon: 'C', f: sointu, lv: 2 },
    { id: 'muodosta', name: 'Muodosta sointu merkistä', icon: 'Cm', f: muodosta, lv: 2 },
    { id: 'systeemi', name: 'Sointusysteemi', icon: 'C°', f: systeemi, lv: 2 },
    { id: 'aste', name: 'Sointuasteet', icon: 'IV', f: aste, lv: 2 },
    { id: 'intervalli', name: 'Tunnista intervalli', icon: 's3', f: intervalli, lv: 2 },
    { id: 'rakenna', name: 'Muodosta intervalli', icon: 'pu5', f: rakenna, lv: 2 },
    { id: 'kaanteis', name: 'Käännösintervallit', icon: '3↔6', f: kaanteis, lv: 3 },
    { id: 'kaannos', name: 'Kolmisoinnun käännökset', icon: 'I⁶', f: kaannos, lv: 3 },
    { id: 'septimi', name: 'Septimisoinnut', icon: 'G7', f: septimi, lv: 3 },
    { id: 'saveltaja', name: 'Säveltäjät', icon: 'Bach', f: saveltaja, lv: 3 },
    { id: 'kuulo', name: 'Kuuntelu (bonus)', icon: '♫', f: kuulo, lv: 2 },
  ];
  // Taitotestien tehtävätyypit (perusasiat ja jatko)
  const EXAMS = {
    perus: ['nimi', 'nimi', 'piirra', 'asteikko', 'etumerkit', 'savellaji', 'intervalli', 'intervalli', 'rakenna', 'rakenna', 'tahti', 'sointu', 'muodosta', 'aste', 'aste', 'transpo', 'systeemi', 'kvintti', 'arvot', 'asteikko'],
    jatko: ['nimi', 'piirra', 'asteikko', 'asteikko', 'etumerkit', 'intervalli', 'intervalli', 'rakenna', 'rakenna', 'kaanteis', 'sointu', 'muodosta', 'septimi', 'septimi', 'aste', 'kaannos', 'kaannos', 'tahti', 'transpo', 'saveltaja'],
  };
  return { GENS, EXAMS, get: id => GENS.find(g => g.id === id) };
})();
