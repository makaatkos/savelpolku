/* Sävelpolku – äänet (Web Audio, pianomainen syntetisaattori) */
const Sound = (() => {
  let ctx = null, master = null;
  let enabled = true;
  function init() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.55;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp); comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  const freq = m => 440 * Math.pow(2, (m - 69) / 12);
  // Soita-napin toisto kulkee omaa väyläänsä, jotta sen voi pysäyttää kesken
  let bus = null, timers = [];
  const dest = () => bus || master;
  function begin() { stop(); init(); bus = ctx.createGain(); bus.connect(master); }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function stop() {
    timers.forEach(clearTimeout); timers = [];
    if (bus) { const b = bus; bus = null; try { b.gain.setTargetAtTime(0, ctx.currentTime, 0.015); setTimeout(() => b.disconnect(), 120); } catch (e) { } }
  }
  // Toisto loppui itsestään: väylä vapautetaan (soivat äänet saavat hiipua loppuun)
  function end() { timers.forEach(clearTimeout); timers = []; bus = null; }

  function tone(m, when = 0, dur = 1.0, vel = 0.5) {
    if (!enabled) return;
    init();
    const t = ctx.currentTime + when;
    const f = freq(m);
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(vel, t + 0.008);
    out.gain.exponentialRampToValueAtTime(vel * 0.35, t + 0.25);
    out.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.6);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(Math.min(9000, f * 9), t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(400, f * 2), t + dur + 0.5);
    out.connect(lp); lp.connect(dest());
    [[1, 'triangle', 0.6], [2, 'sine', 0.25], [3, 'sine', 0.08], [1.003, 'sawtooth', 0.04]].forEach(([mul, type, g]) => {
      const o = ctx.createOscillator();
      const og = ctx.createGain();
      o.type = type; o.frequency.value = f * mul; og.gain.value = g;
      o.connect(og); og.connect(out);
      o.start(t); o.stop(t + dur + 0.7);
    });
  }
  function click(when = 0, accent = false) {
    if (!enabled) return;
    init();
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'square'; o.frequency.value = accent ? 1600 : 1100;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(accent ? 0.35 : 0.2, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.connect(g); g.connect(dest()); o.start(t); o.stop(t + 0.08);
  }
  function drum(when = 0, high = false) {
    if (!enabled) return;
    init();
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(high ? 520 : 330, t);
    o.frequency.exponentialRampToValueAtTime(high ? 260 : 120, t + 0.12);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.7, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g); g.connect(dest()); o.start(t); o.stop(t + 0.2);
  }
  const toMidi = n => typeof n === 'number' ? n : T.midi(n);
  // notes: lista säveliä. mode: 'seq' | 'chord' | 'both'
  function play(notes, mode = 'seq', gap = 0.45) {
    const ms = notes.map(toMidi);
    if (mode === 'chord') { ms.forEach(m => tone(m, 0, 1.6, 0.35)); return 1.8; }
    ms.forEach((m, i) => tone(m, i * gap, gap * 1.6, 0.5));
    let total = ms.length * gap;
    if (mode === 'both') { ms.forEach(m => tone(m, total + 0.25, 1.6, 0.33)); total += 2; }
    return total;
  }
  // Rytmi: lista kestoja neljäsosina, rest-lippu
  // bpm = neljäsosien tempo; unit = iskun pituus neljäsosina (x/8-tahdissa 0.5)
  // Rytmin nuotti: pianon ääni, joka soi tasan nuotin keston ja loppuu selvästi, jotta pitkä ja lyhyt nuotti erottuvat
  function rnote(when, dur, m = 72) {
    if (!enabled) return;
    init();
    const t = ctx.currentTime + when, f = freq(m);
    const end = t + Math.max(0.09, dur * 0.9);
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(0.75, t + 0.005);
    const dec = Math.min(0.12, (end - t) * 0.6);
    out.gain.exponentialRampToValueAtTime(0.4, t + dec);
    out.gain.setTargetAtTime(0.22, t + dec, Math.max(0.15, dur * 0.5));
    out.gain.setTargetAtTime(0.0001, end, 0.025);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(f * 10, t); lp.frequency.exponentialRampToValueAtTime(f * 3, end);
    out.connect(lp); lp.connect(dest());
    [[1, 'triangle', 0.65], [2, 'sine', 0.3], [3, 'sine', 0.1], [4, 'sine', 0.05]].forEach(([mul, type, g]) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type; o.frequency.value = f * mul; og.gain.value = g;
      o.connect(og); og.connect(out); o.start(t); o.stop(end + 0.2);
    });
  }
  // Puupalikka: pehmeä, selvä isku esilaskentaan ja hiljaiseksi sykkeeksi
  function wood(when, accent = false, vol = 1) {
    if (!enabled) return;
    init();
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator(), g = ctx.createGain(), bp = ctx.createBiquadFilter();
    o.type = 'sine'; o.frequency.setValueAtTime(accent ? 1250 : 900, t); o.frequency.exponentialRampToValueAtTime(accent ? 1000 : 720, t + 0.05);
    bp.type = 'bandpass'; bp.frequency.value = accent ? 1250 : 900; bp.Q.value = 3;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime((accent ? 0.9 : 0.6) * vol, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(bp); bp.connect(g); g.connect(dest()); o.start(t); o.stop(t + 0.12);
  }
  function rhythm(events, bpm = 80, beatsPerBar = 4, countIn = true, unit = 1) {
    const q = 60 / bpm, beat = q * unit;
    let t = 0.1;
    if (countIn) { for (let i = 0; i < beatsPerBar; i++) wood(t + i * beat, i === 0); t += beatsPerBar * beat; }
    const start = t;
    // Sidotut nuotit soivat yhtenä pitkänä äänenä
    const notes = [];
    events.forEach(ev => {
      const d = ev.q * q;
      if (ev.tie && notes.length && !ev.rest) notes[notes.length - 1].d += d;
      else if (!ev.rest) notes.push({ t, d });
      t += d;
    });
    notes.forEach(n => rnote(n.t, n.d));
    // Hiljainen syke koko rytmin ajan, jotta iskut kuuluvat
    for (let b = 0, x = start; x < t - 0.01; b++, x += beat) wood(x, b % beatsPerBar === 0, 0.28);
    return t;
  }
  return { init, tone, play, click, drum, rhythm, begin, stop, end, later, set enabled(v) { enabled = v; }, get enabled() { return enabled; } };
})();
