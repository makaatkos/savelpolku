/* Sävelpolku – musiikkiteorian moottori.
   Sisäisesti sävelet kirjoitetaan kansainvälisesti: C D E F G A B (+ # / b) ja oktaavi, esim. "F#4", "Bb3".
   Näytössä käytetään suomalaisia nimiä: H = B-natural, B = Bb, Cis, Es, As ... */
const T = (() => {
  const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const PC = [0, 2, 4, 5, 7, 9, 11];
  const FI = ['C', 'D', 'E', 'F', 'G', 'A', 'H'];
  const INAMES = ['priimi', 'sekunti', 'terssi', 'kvartti', 'kvintti', 'seksti', 'septimi', 'oktaavi'];
  const PERF = { 1: 0, 4: 5, 5: 7, 8: 12 };
  const MAJ = { 2: 2, 3: 4, 6: 9, 7: 11 };

  function parse(s) {
    if (typeof s === 'object') return s;
    const m = /^([A-G])(#{1,3}|b{1,3})?(-?\d)?$/.exec(s);
    if (!m) throw new Error('Bad note ' + s);
    let acc = 0;
    if (m[2]) acc = m[2][0] === '#' ? m[2].length : -m[2].length;
    return { l: LET.indexOf(m[1]), acc, oct: m[3] !== undefined ? +m[3] : 4 };
  }
  const str = n => LET[n.l] + (n.acc > 0 ? '#'.repeat(n.acc) : 'b'.repeat(-n.acc)) + n.oct;
  const midi = n => { n = parse(n); return 12 * (n.oct + 1) + PC[n.l] + n.acc; };
  const dia = n => { n = parse(n); return n.oct * 7 + n.l; };

  function name(n) {
    n = parse(n);
    const base = FI[n.l];
    if (n.acc === 0) return base;
    if (n.acc > 0) return base + 'is'.repeat(n.acc);
    if (n.l === 6) return n.acc === -1 ? 'B' : 'Heses';
    if (n.l === 2 || n.l === 5) return base + 's' + 'es'.repeat(-n.acc - 1);
    return base + 'es'.repeat(-n.acc);
  }
  // Sointumerkeissä: angloamerikkalainen tapa, mutta B:n tilalla H → H, B♭, E♭, F♯ ...
  function chordRootName(n) {
    n = parse(n);
    if (n.l === 6 && n.acc < 0) return 'B' + '♭'.repeat(-n.acc);
    return FI[n.l] + (n.acc > 0 ? '♯'.repeat(n.acc) : '♭'.repeat(-n.acc));
  }
  const accGlyph = a => ({ 1: '♯', 2: '𝄪', '-1': '♭', '-2': '𝄫', 0: '♮' })[a];

  function semisFor(num, q) {
    const s = num > 8 ? semisFor(num - 7, q) + 12 : null;
    if (s !== null) return s;
    if (PERF[num] !== undefined) return PERF[num] + ({ puhdas: 0, ylinouseva: 1, 'vähennetty': -1 })[q];
    return MAJ[num] + ({ suuri: 0, pieni: -1, ylinouseva: 1, 'vähennetty': -2 })[q];
  }
  function up(n, num, q) {
    n = parse(n);
    const nl = n.l + num - 1;
    const r = { l: nl % 7, oct: n.oct + Math.floor(nl / 7), acc: 0 };
    r.acc = midi(n) + semisFor(num, q) - midi(r);
    return r;
  }
  function down(n, num, q) {
    n = parse(n);
    const nl = n.l - (num - 1);
    const r = { l: ((nl % 7) + 7) % 7, oct: n.oct + Math.floor(nl / 7), acc: 0 };
    r.acc = midi(n) - semisFor(num, q) - midi(r);
    return r;
  }
  function interval(a, b) {
    a = parse(a); b = parse(b);
    if (dia(b) < dia(a)) [a, b] = [b, a];
    let num = dia(b) - dia(a) + 1, semi = midi(b) - midi(a);
    while (num > 8) { num -= 7; semi -= 12; }
    let q;
    if (PERF[num] !== undefined) {
      const d = semi - PERF[num];
      q = d === 0 ? 'puhdas' : d === 1 ? 'ylinouseva' : d === -1 ? 'vähennetty' : d > 0 ? 'kaksoisylinouseva' : 'kaksoisvähennetty';
    } else {
      const d = semi - MAJ[num];
      q = d === 0 ? 'suuri' : d === -1 ? 'pieni' : d === 1 ? 'ylinouseva' : d === -2 ? 'vähennetty' : '?';
    }
    return { num, semi, q, name: q + ' ' + INAMES[num - 1] };
  }

  // Sävellajit
  const MAJOR = { 0: 'C', 1: 'G', 2: 'D', 3: 'A', 4: 'E', 5: 'B', 6: 'F#', 7: 'C#', '-1': 'F', '-2': 'Bb', '-3': 'Eb', '-4': 'Ab', '-5': 'Db', '-6': 'Gb', '-7': 'Cb' };
  const MINOR = { 0: 'A', 1: 'E', 2: 'B', 3: 'F#', 4: 'C#', 5: 'G#', 6: 'D#', 7: 'A#', '-1': 'D', '-2': 'G', '-3': 'C', '-4': 'F', '-5': 'Bb', '-6': 'Eb', '-7': 'Ab' };
  const SHARP_ORDER = [3, 0, 4, 1, 5, 2, 6];
  const FLAT_ORDER = [6, 2, 5, 1, 4, 0, 3];
  function keyAcc(count) {
    const a = [0, 0, 0, 0, 0, 0, 0];
    if (count > 0) SHARP_ORDER.slice(0, count).forEach(l => a[l] = 1);
    if (count < 0) FLAT_ORDER.slice(0, -count).forEach(l => a[l] = -1);
    return a;
  }
  const majorName = c => name(MAJOR[c]) + '-duuri';
  const minorName = c => name(MINOR[c]).toLowerCase() + '-molli';
  function keyCountOf(tonic, minor) {
    const nm = name(tonic);
    const tbl = minor ? MINOR : MAJOR;
    for (const k in tbl) if (name(tbl[k]) === nm) return +k;
    return null;
  }

  const SCALES = {
    duuri: [2, 2, 1, 2, 2, 2, 1],
    luonnollinen: [2, 1, 2, 2, 1, 2, 2],
    harmoninen: [2, 1, 2, 2, 1, 3, 1],
    melodinen: [2, 1, 2, 2, 2, 2, 1],
    'itämainen': [2, 1, 3, 1, 1, 3, 1],
  };
  // Kromaattinen asteikko: ylöspäin ylennykset, alaspäin alennukset (asteikon omat sävelet säilyvät)
  function chromatic(tonic, type = 'duuri') {
    const base = scale(tonic, type === 'duuri' ? 'duuri' : 'luonnollinen');
    const up_ = [], down_ = [];
    for (let i = 0; i < 7; i++) {
      const a = parse(base[i]), b = parse(base[i + 1]);
      up_.push(str(a));
      if (midi(b) - midi(a) === 2) up_.push(str({ ...a, acc: a.acc + 1 }));
    }
    up_.push(base[7]);
    for (let i = 7; i > 0; i--) {
      const a = parse(base[i]), b = parse(base[i - 1]);
      down_.push(str(a));
      if (midi(a) - midi(b) === 2) down_.push(str({ ...a, acc: a.acc - 1 }));
    }
    down_.push(base[0]);
    return { up: up_, down: down_ };
  }
  function scale(tonic, type) {
    let n = parse(tonic);
    const out = [n];
    for (const st of SCALES[type]) {
      const nl = n.l + 1;
      const r = { l: nl % 7, oct: n.oct + Math.floor(nl / 7), acc: 0 };
      r.acc = midi(n) + st - midi(r);
      out.push(r); n = r;
    }
    return out.map(str);
  }

  const CHORDS = {
    duuri: { iv: [[3, 'suuri'], [5, 'puhdas']], sym: '' },
    molli: { iv: [[3, 'pieni'], [5, 'puhdas']], sym: 'm' },
    'vähennetty': { iv: [[3, 'pieni'], [5, 'vähennetty']], sym: '°' },
    ylinouseva: { iv: [[3, 'suuri'], [5, 'ylinouseva']], sym: '+' },
    maj7: { iv: [[3, 'suuri'], [5, 'puhdas'], [7, 'suuri']], sym: 'maj7' },
    dom7: { iv: [[3, 'suuri'], [5, 'puhdas'], [7, 'pieni']], sym: '7' },
    m7: { iv: [[3, 'pieni'], [5, 'puhdas'], [7, 'pieni']], sym: 'm7' },
    m7b5: { iv: [[3, 'pieni'], [5, 'vähennetty'], [7, 'pieni']], sym: 'm7♭5' },
    mmaj7: { iv: [[3, 'pieni'], [5, 'puhdas'], [7, 'suuri']], sym: 'm(maj7)' },
    augmaj7: { iv: [[3, 'suuri'], [5, 'ylinouseva'], [7, 'suuri']], sym: '+maj7' },
    dim7: { iv: [[3, 'pieni'], [5, 'vähennetty'], [7, 'vähennetty']], sym: '°7' },
  };
  // Suomalaiset nimet
  const CHORD_FI = { duuri: 'duurikolmisointu', molli: 'mollikolmisointu', 'vähennetty': 'vähennetty kolmisointu', ylinouseva: 'ylinouseva kolmisointu',
    maj7: 'duurisuurseptimisointu', dom7: 'duuripieniseptimisointu', m7: 'mollipieniseptimisointu', m7b5: 'vähennetty pieniseptimisointu',
    mmaj7: 'mollisuurseptimisointu', augmaj7: 'ylinouseva suurseptimisointu', dim7: 'vähennetty septimisointu' };
  // Intervallilyhenteet: s3, pi3, pu5, y4, v5
  const Q_ABBR = { suuri: 's', pieni: 'pi', puhdas: 'pu', ylinouseva: 'y', 'vähennetty': 'v' };
  const Q_FROM = { s: 'suuri', pi: 'pieni', pu: 'puhdas', y: 'ylinouseva', v: 'vähennetty' };
  const ivAbbr = iv => (Q_ABBR[iv.q] || '?') + iv.num;
  const INAMES_LONG = ['priimi', 'sekunti', 'terssi', 'kvartti', 'kvintti', 'seksti', 'septimi', 'oktaavi', 'nooni', 'desimi'];
  // Intervalli myös yli oktaavin (nooni, desimi)
  function intervalFull(a, b) {
    a = parse(a); b = parse(b);
    if (dia(b) < dia(a)) [a, b] = [b, a];
    const num = dia(b) - dia(a) + 1;
    const base = interval(a, b);
    const n = num > 8 ? num : base.num;
    return { num: n, q: base.q, semi: midi(b) - midi(a), name: base.q + ' ' + (INAMES_LONG[n - 1] || n + '.'), abbr: (Q_ABBR[base.q] || '?') + n };
  }
  const ivFromAbbr = s => { const m = /^(pi|pu|s|y|v)(\d+)$/.exec(s); return { q: Q_FROM[m[1]], num: +m[2] }; };
  // Oktaavialat: tieteellinen 4 = yksiviivainen (c¹)
  const OCT_FI = { 0: 'subkontraoktaavi', 1: 'kontraoktaavi', 2: 'suuri oktaavi', 3: 'pieni oktaavi', 4: 'yksiviivainen oktaavi', 5: 'kaksiviivainen oktaavi', 6: 'kolmiviivainen oktaavi', 7: 'neliviivainen oktaavi' };
  const SUP = ['', '¹', '²', '³', '⁴'], SUB = ['₂', '₁'];
  function octName(n) {
    n = parse(n);
    const b = name(n);
    if (n.oct >= 3) return b.toLowerCase() + SUP[n.oct - 3];
    if (n.oct === 2) return b;
    return b + SUB[n.oct];
  }
  const chord = (root, type) => [str(parse(root)), ...CHORDS[type].iv.map(([n, q]) => str(up(root, n, q)))];
  const chordSymbol = (root, type) => chordRootName(root) + CHORDS[type].sym;
  function chordType(notes) {
    const r = notes[0];
    for (const t in CHORDS) {
      const c = chord(r, t);
      if (c.length === notes.length && c.every((x, i) => midi(x) === midi(notes[i]) && dia(x) === dia(notes[i]))) return t;
    }
    return null;
  }
  // Kolmisointu / septimisointu asteikon asteelle (0-6)
  function degreeChord(sc, i, size = 3) {
    const ext = sc.slice(0, 7).concat(sc.slice(0, 7).map(s => { const n = parse(s); n.oct++; return str(n); }));
    return [0, 2, 4, 6].slice(0, size).map(k => ext[i + k]);
  }
  const degreeTriad = (sc, i) => degreeChord(sc, i, 3);
  const triadQuality = tri => {
    const a = interval(tri[0], tri[1]).q, b = interval(tri[0], tri[2]).q;
    if (a === 'suuri' && b === 'puhdas') return 'duuri';
    if (a === 'pieni' && b === 'puhdas') return 'molli';
    if (a === 'pieni' && b === 'vähennetty') return 'vähennetty';
    if (a === 'suuri' && b === 'ylinouseva') return 'ylinouseva';
    return '?';
  };
  function invert(notes, times) {
    let out = notes.map(parse);
    for (let i = 0; i < times; i++) { const f = { ...out[0], oct: out[0].oct + 1 }; out = out.slice(1).concat([f]); }
    return out.map(str);
  }
  const transpose = (notes, num, q, dir = 'up') => notes.map(n => str(dir === 'up' ? up(n, num, q) : down(n, num, q)));

  const rand = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const NOTE_COLORS = ['#ff5a5f', '#ff9f43', '#ffd23f', '#3ddc84', '#2ec4b6', '#4d7fc4', '#c45a6a'];
  const color = n => NOTE_COLORS[parse(n).l];

  return { LET, FI, INAMES, parse, str, midi, dia, name, chordRootName, accGlyph, up, down, interval, semisFor,
    MAJOR, MINOR, SHARP_ORDER, FLAT_ORDER, keyAcc, majorName, minorName, keyCountOf, SCALES, scale,
    CHORDS, CHORD_FI, OCT_FI, octName, Q_ABBR, ivAbbr, intervalFull, ivFromAbbr, chromatic, chord, chordSymbol, chordType, degreeChord, degreeTriad, triadQuality, invert, transpose, rand, shuffle, NOTE_COLORS, color };
})();
