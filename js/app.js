/* Sävelpolku – sovellus: reititys, tila, näkymät */
(() => {
  // Jos jokin sovelluksen osa puuttuu (esim. selain toi vanhan sivupohjan välimuistista), ladataan uusin versio kerran
  const parts = [typeof T, typeof Sound, typeof R, typeof Mascot, typeof PATHS, typeof P, typeof Sync, typeof THEME_SWATCH, typeof ICONS];
  if (parts.includes('undefined')) {
    try { if (!sessionStorage.getItem('sp-fix')) { sessionStorage.setItem('sp-fix', '1'); (window.SP_FRESH || (v => location.replace(location.pathname + '?v=' + v + '#/')))(Date.now()); } } catch (e) { }
    return;
  }
  const $ = s => document.querySelector(s);
  const app = $('#app');
  const KEY = 'savelpolku-v1';
  const DEF = {
    done: {}, best: {}, pos: {}, cur: null, trained: {}, xp: 0, day: {}, pday: {}, streak: { n: 0, last: '' }, stats: {}, badges: {}, combo: 0, maxCombo: 0, ear: 0, exams: {},
    set: { name: 'Kvintti', color: '#ffcf33', theme: 'auto', motion: 'on', colors: false, sound: true, tts: false, focus: false },
  };
  const LEGACY = {"k2-pyramidi": "pyramidi", "k2-nuotit-tauot": "nuotit-tauot", "k2-tahtiviivat": "tahtiviivat", "k2-oktaavialat": "oktaavialat", "k2-nimi-oktaavi": "nimi-oktaavi", "k2-asteikot-kertaus": "asteikot-kertaus", "k2-uudet-asteikot": "uudet-asteikot", "k2-molliasteikot": "molliasteikot", "k2-kvinttiympyra": "kvinttiympyra", "k2-transponointi": "transponointi", "k2-lisaa-transp": "lisaa-transp", "k2-kolmisointu": "kolmisointu", "k2-sointumerkit": "sointumerkit", "k2-sointuasteet-duuri": "sointuasteet-duuri", "k2-sointusysteemi": "sointusysteemi", "k2-sointuasteet-molli": "sointuasteet-molli", "k2-kolmisointu-rakenne": "kolmisointu-rakenne", "k2-iv-suuret-puhtaat": "iv-suuret-puhtaat", "k2-iv-suuret-pienet": "iv-suuret-pienet", "k2-iv-puhtaat-vahennetyt": "iv-puhtaat-vahennetyt", "k2-iv-ylinousevat": "iv-ylinousevat", "k3-nuottitalo": "nuottitalo", "k3-nuotit-tauot": "nuotit-tauot-jatko", "k3-oktaavialat": "oktaavialat-jatko", "k3-etumerkit": "etumerkit", "k3-molliasteikot": "molliasteikot-jatko", "k3-asteikot-kertaus": "asteikot-kertaus-jatko", "k3-uudet-asteikot": "uudet-asteikot-jatko", "k3-kromaattinen": "kromaattinen", "k3-kvinttiympyra": "kvinttiympyra-jatko", "k3-intervallit": "intervallit", "k3-kaannosintervallit": "kaannosintervallit", "k3-transponointi": "transponointi-jatko", "k3-lisaa-transp": "lisaa-transp-jatko", "k3-kolmisointu-rakenne": "kolmisointu-rakenne-jatko", "k3-sointuasteet": "sointuasteet", "k3-kaannokset": "kaannokset", "k3-sept-asteet": "sept-asteet", "k3-sept-rakenne": "sept-rakenne", "k3-sept-merkit": "sept-merkit", "k3-saveltajat": "saveltajat"};
  const EXAM_IDS = ['taitotesti', 'pikatesti'];
  function migrate(st) {
    if (!st || typeof st !== 'object') return st;
    const mv = (obj, pick) => { if (!obj) return; Object.keys(LEGACY).forEach(o => { if (o in obj) { const n = LEGACY[o]; obj[n] = n in obj ? pick(obj[n], obj[o]) : obj[o]; delete obj[o]; } }); };
    const max = (x, y) => Math.max(+x || 0, +y || 0);
    mv(st.done, (x, y) => x || y); mv(st.best, max); mv(st.pos, max);
    if (st.cur && LEGACY[st.cur]) st.cur = LEGACY[st.cur];
    Object.keys(st.pos || {}).forEach(k => { if (st.done && st.done[k]) delete st.pos[k]; });
    // Treenit: kaksi tasoa (tunnus@2, tunnus@3) yhdeksi
    if (st.trained) Object.keys(st.trained).forEach(k => {
      const m = /^(.+)@\d$/.exec(k); if (!m) return;
      const x = st.trained[m[1]], y = st.trained[k];
      const n = r => r ? (r.n || 1) : 0, b = r => r ? (r.best ?? r.r ?? 0) : 0;
      st.trained[m[1]] = { n: Math.max(n(x), n(y)), best: Math.max(b(x), b(y)), t: (x || y).t || 10, d: [x && x.d, y && y.d].filter(Boolean).sort().pop() };
      delete st.trained[k];
    });
    // Taitotestit: vanhat testit yhdeksi taitotestiksi
    if (st.exams) {
      const old = Object.keys(st.exams).filter(k => !EXAM_IDS.includes(k));
      if (old.length) {
        const t = st.exams.taitotesti || { best: 0, n: 0 };
        st.exams.taitotesti = { best: Math.max(t.best || 0, ...old.map(k => st.exams[k].best || 0)), n: Math.max(t.n || 0, old.reduce((s, k) => s + (st.exams[k].n || 1), 0)) };
        old.forEach(k => delete st.exams[k]);
      }
    }
    // Keskeneräiset vanhan muotoiset kierrokset poistetaan
    if (st.part) Object.keys(st.part).forEach(k => { if (/@\d$/.test(k) || (k.startsWith('e:') && !EXAM_IDS.includes(k.slice(2)))) delete st.part[k]; });
    if (st.set) { delete st.set.book; delete st.set.tfilter; }
    return st;
  }
  let S = load();
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s) {
        const st = { ...DEF, ...s, set: { ...DEF.set, ...s.set } };
        // v2: nuotit oletuksena mustina
        if (!st.v2) { st.set.colors = false; st.v2 = true; }
        return migrate(st);
      }
    } catch (e) { }
    return JSON.parse(JSON.stringify(DEF));
  }
  // Asetusten muutos huomataan tallennuksessa, ja muutoshetki (setAt) ratkaisee laitteiden välillä uusimman
  let lastSetJSON = null;
  function save() {
    const sj = JSON.stringify(S.set);
    if (lastSetJSON !== null && sj !== lastSetJSON) S.setAt = Date.now();
    lastSetJSON = sj;
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { }
    Sync.push(S);
  }
  const adopt = st => { S = migrate(st); lastSetJSON = JSON.stringify(S.set); };
  // Päivä paikallisen ajan mukaan (offset = päiviä tästä päivästä)
  const dayKey = (offset = 0) => { const d = new Date(); d.setDate(d.getDate() + offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const today = () => dayKey(0);
  // Putki on voimassa, jos on harjoiteltu tänään tai eilen
  const streakNow = () => S.streak.last === today() || S.streak.last === dayKey(-1) ? S.streak.n : 0;
  const GOAL = 100; // päivän tavoite pisteinä
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const GEAR = '<svg class="gear" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5A7.5 7.5 0 0 0 7 6.5l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 3l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7.5 7.5 0 0 0 2.6-1.5l2.4 1 2-3.4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
  function applySettings() {
    R.colorize = S.set.colors;
    Sound.enabled = S.set.sound;
    document.documentElement.dataset.theme = S.set.theme === 'auto' ? '' : S.set.theme;
    if (S.set.theme === 'auto') delete document.documentElement.dataset.theme;
    document.body.classList.toggle('focus', !!S.set.focus);
    document.body.classList.toggle('colornotes', !!S.set.colors);
    requestAnimationFrame(() => { const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(); if (bg) document.querySelectorAll('meta[name="theme-color"]').forEach(m => { m.setAttribute('content', bg); m.removeAttribute('media'); }); });
    // Animaatiot: 'on' = aina, 'auto' = laitteen asetuksen mukaan, 'off' = vähennetty
    const osReduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.toggle('reduce-motion', S.set.motion === 'off' || (S.set.motion === 'auto' && osReduce));
    $('#brandMascot').innerHTML = Mascot.svg('happy', S.set.color, 34);
    document.querySelectorAll('#tabbar a').forEach(a => { const sp = a.querySelector('span'); if (sp && ICONS.TAB[a.dataset.nav]) sp.innerHTML = ICONS.TAB[a.dataset.nav]; });
    // Yläpalkin rengas: suoritetut oppitunnit koko kurssista
    const nDone = ORDER.filter(id => S.done[id]).length, nAll = ORDER.length, rc = 2 * Math.PI * 9;
    $('#xp').textContent = nDone;
    const pp = $('#ptPill');
    if (pp) {
      pp.title = `Oppitunteja suoritettu ${nDone}/${nAll}`;
      pp.setAttribute('aria-label', pp.title);
      pp.querySelector('small').textContent = '/' + nAll;
      const fg = pp.querySelector('.pr-fg'); if (fg) fg.style.strokeDashoffset = rc * (1 - nDone / nAll);
    }
    const ap = $('#acctPill');
    if (ap) ap.innerHTML = `<span>${esc(Sync.user ? (Sync.user.displayName || 'Tili').split(' ')[0] : (Sync.enabled ? 'Kirjaudu' : 'Asetukset'))}</span>${GEAR}`;
    const tb = $('#tabbar'); document.documentElement.style.setProperty('--tabh', tb && getComputedStyle(tb).position === 'fixed' ? tb.offsetHeight + 'px' : '0px');
    $('#streak').textContent = streakNow();
  }

  // ---------- XP, putki, merkit ----------
  function touchStreak() {
    const t = today();
    if (S.streak.last === t) return;
    const y = dayKey(-1);
    S.streak.n = S.streak.last === y ? S.streak.n + 1 : 1;
    S.streak.last = t;
  }
  function addXP(n) {
    touchStreak();
    S.xp += n;
    S.day[today()] = (S.day[today()] || 0) + n;
    save(); applySettings(); checkBadges();
    const el = $('#xp'); el.parentElement.classList.remove('bump'); void el.offsetWidth; el.parentElement.classList.add('bump');
  }
  // Merkitsee päivän, jolloin on tehty vähintään yksi polun (oppitunnin) tehtävä
  // Ennen viikkonäkymää harjoitellut päivät haetaan kerran aiemmista tiedoista (suoritetut oppitunnit ja päivän pisteet)
  function seedPathDays() {
    if (S.pdaySeed) return;
    S.pday = S.pday || {};
    const old = dayKey(-60);
    Object.values(S.done).forEach(d => { if (typeof d === 'string' && d >= old) S.pday[d] = 1; });
    Object.keys(S.day).forEach(d => { if (S.day[d] > 0 && d >= old && d < today()) S.pday[d] = 1; });
    S.pdaySeed = true; save();
  }
  function markPathDay() {
    if (!S.pday) S.pday = {};
    if (S.pday[today()]) return;
    S.pday[today()] = 1;
    const old = dayKey(-60);
    Object.keys(S.pday).forEach(k => { if (k < old) delete S.pday[k]; });
    save();
  }
  function stat(cat, ok) {
    const s = S.stats[cat] || (S.stats[cat] = { r: 0, t: 0 });
    s.t++; if (ok) s.r++;
    if (ok) { S.combo++; S.maxCombo = Math.max(S.maxCombo, S.combo); } else S.combo = 0;
    if (cat === 'kuulo' && ok) S.ear++;
    save();
  }
  const ALL = ORDER.length;
  const doneCount = () => ORDER.filter(id => S.done[id]).length;
  const modDone = mid => COURSE.modules.find(m => m.id === mid).lessons.every(l => S.done[l.id]);
  const totalRight = () => Object.values(S.stats).reduce((a, s) => a + s.r, 0);
  const BADGES = [
    { id: 'eka', i: '1', c: '#ffcf33', n: 'Ensimmäinen sävel', d: 'Suorita ensimmäinen oppitunti', ok: () => doneCount() >= 1 },
    { id: 'viisi', i: '5', c: '#ffcf33', n: 'Melodia', d: 'Suorita 5 oppituntia', ok: () => doneCount() >= 5 },
    { id: 'kymppi', i: '10', c: '#ffcf33', n: 'Partituuri', d: 'Suorita 10 oppituntia', ok: () => doneCount() >= 10 },
    { id: 'puolet', i: '½', c: '#a8d5b5', n: 'Puolivälissä', d: 'Suorita puolet oppitunneista', ok: () => doneCount() >= ALL / 2 },
    { id: 'rytmit', i: '♩', c: '#e6bb4f', n: 'Rytmitaituri', d: 'Kaikki rytmin oppitunnit', ok: () => modDone('rytmi') },
    { id: 'soinnut', i: 'Dm', c: '#ff8a7e', n: 'Sointuseppä', d: 'Kaikki kolmisointujen ja septimisointujen oppitunnit', ok: () => modDone('kolmisoinnut') && modDone('septimit') },
    { id: 'kaikki', i: '41', c: '#d9b38c', n: 'Maestro', d: 'Kaikki oppitunnit suoritettu', ok: () => doneCount() >= ALL },
    { id: 'putki3', i: '3 pv', c: '#d98a2b', n: 'Lämpenee', d: '3 päivän putki', ok: () => S.streak.n >= 3 },
    { id: 'putki7', i: '7 pv', c: '#d98a2b', n: 'Viikon putki', d: '7 päivän putki', ok: () => S.streak.n >= 7 },
    { id: 'treeni50', i: '50', c: '#a8d5b5', n: 'Tarkka-ampuja', d: '50 oikeaa treenivastausta', ok: () => totalRight() >= 50 },
    { id: 'treeni200', i: '200', c: '#a8d5b5', n: 'Timanttikorva', d: '200 oikeaa treenivastausta', ok: () => totalRight() >= 200 },
    { id: 'combo10', i: '×10', c: '#a9c1d9', n: 'Kombo ×10', d: '10 oikein peräkkäin', ok: () => S.maxCombo >= 10 },
    { id: 'korva', i: '♫', c: '#e8a3a0', n: 'Kultakorva', d: '10 oikein kuuntelussa', ok: () => S.ear >= 10 },
    { id: 'koe', i: '✓', c: '#a9c1d9', n: 'Testattu', d: 'Tee yksi taitotesti', ok: () => Object.keys(S.exams).length > 0 },
    { id: 'koe90', i: '90%', c: '#d9b38c', n: 'Kymppi', d: 'Taitotestistä vähintään 90 %', ok: () => Object.values(S.exams).some(e => e.best >= 90) },
  ];
  function checkBadges() {
    BADGES.forEach(b => { if (!S.badges[b.id] && b.ok()) { S.badges[b.id] = today(); save(); toast(`Uusi merkki: <b>${b.n}</b>!`); confetti(); } });
  }

  // ---------- Pienet apurit ----------
  let toastT;
  function toast(html) { const t = $('#toast'); t.innerHTML = html; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }
  function speak(html) {
    if (!('speechSynthesis' in window)) return toast('Selaimesi ei tue ääneen lukemista.');
    speechSynthesis.cancel();
    const d = document.createElement('div'); d.innerHTML = html;
    let txt = d.textContent.replace(/♯/g, ' korotus ').replace(/♭/g, ' alennus ').replace(/[⭐🎵🎶🍕🎩🏠🪜⛄🔴🛗🕐🎨🏢👂🪄📏🔁🌈🕌⏳🇫🇮😈🔄🏷️]/gu, '');
    const u = new SpeechSynthesisUtterance(txt); u.lang = 'fi-FI'; u.rate = 0.95;
    const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.startsWith('fi')); if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  function vis(v) {
    if (!v) return '';
    if (Array.isArray(v)) return v.map(vis).join('');
    let h = '';
    if (v.staff) h = R.staff(v.staff);
    else if (v.piano) h = R.piano(v.piano);
    else if (v.rhythm !== undefined) h = R.rhythm(v.rhythm, v);
    else if (v.circle !== undefined) h = `<div class="circwrap" ${v.interactive ? 'data-circle="1"' : ''}>${R.circle({ hi: v.circle === true ? undefined : v.circle })}</div>`;
    else if (v.html) h = v.html;
    return `<div class="vis">${h}</div>`;
  }
  // Mitä tehtävän Soita-nappi soittaa: oma ääni, tai rytmikuvasta johdettu rytmi
  function playOf(st) {
    if (!st) return null;
    if (st.play) return st.play;
    const vs = [].concat(st.v || []);
    const rv = vs.find(v => v && typeof v.rhythm === 'string' && v.rhythm.trim());
    if (!rv) return null;
    const [top, bot] = String(rv.time || '4/4').split('/').map(Number);
    return { rhythm: rv.rhythm, bpm: bot === 8 ? 72 : 80, beats: top || 4, unit: bot === 8 ? 0.5 : 1 };
  }
  // Soittaa äänen ja palauttaa sen keston sekunteina
  function play(p) {
    if (!p) return 0;
    Sound.init();
    if (p.rhythm) return Sound.rhythm(R.rhythmEvents(p.rhythm), p.bpm || 80, p.beats || 4, true, p.unit || 1);
    if (p.seq) { p.seq.forEach((ch, i) => Sound.later(() => Sound.play(ch, 'chord'), i * 1100)); return (p.seq.length - 1) * 1.1 + 1.8; }
    return Sound.play(p.notes, p.mode || 'seq', p.gap || 0.45);
  }
  // Soita-nappi: toiston ajan nappi on Pysäytä, ja se palaa Soita-napiksi, kun toisto loppuu tai pysäytetään
  let playing = false, playT = null;
  function syncPlayBtns() {
    document.querySelectorAll('.playbtn').forEach(b => { b.innerHTML = playing ? '<span class="pi">■</span> Pysäytä' : '<span class="pi">▶</span> Soita'; b.classList.toggle('on', playing); b.setAttribute('aria-pressed', playing); });
  }
  function startPlay(p) {
    if (!p || !Sound.enabled) return;
    Sound.begin();
    const dur = play(p) || 1.5;
    playing = true; syncPlayBtns();
    clearTimeout(playT);
    playT = setTimeout(() => { playing = false; Sound.end(); syncPlayBtns(); }, dur * 1000 + 250);
  }
  function stopPlay() {
    clearTimeout(playT);
    if (playing) Sound.stop();
    playing = false; syncPlayBtns();
  }
  const togglePlay = p => playing ? stopPlay() : startPlay(p);
  const bubble = (mood, html, size = 84) => `<div class="speaker">${`<div class="mascot-wrap">${Mascot.svg(mood, S.set.color, size)}</div>`}<div class="bubble">${html}</div></div>`;
  const pct = (a, b) => b ? Math.round(100 * a / b) : 0;
  function ring(p, label, size = 64) {
    const r = 26, c = 2 * Math.PI * r;
    return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="${r}" class="ring-bg"/><circle cx="32" cy="32" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p / 100)}"/><text x="32" y="37" text-anchor="middle">${label}</text></svg>`;
  }

  // ---------- Konfetti ----------
  function confetti() {
    if (reduceMotion()) return;
    const cv = $('#confetti'), cx = cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    const cols = ['#e6bb4f', '#9b2f3b', '#d4b06a', '#f3ead6', '#17140f', '#d98a2b'];
    const ps = Array.from({ length: 70 }, () => ({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 14, vy: Math.random() * -12 - 3, r: Math.random() * 6 + 3, c: cols[Math.floor(Math.random() * 6)], s: Math.random() < .3 ? '♪' : '' }));
    let f = 0;
    (function tick() {
      cx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .35; p.vx *= .99; cx.fillStyle = p.c; if (p.s) { cx.font = `${p.r * 4}px serif`; cx.fillText(p.s, p.x, p.y); } else cx.fillRect(p.x, p.y, p.r, p.r * 1.6); });
      if (++f < 110) requestAnimationFrame(tick); else cx.clearRect(0, 0, cv.width, cv.height);
    })();
  }

  // ================= NÄKYMÄT =================
  const nextLesson = () => ORDER.find(id => !S.done[id]);
  const TIPS = [
    'Pieni annos joka päivä voittaa ison annoksen kerran viikossa. 5 minuuttia riittää!',
    'Kultainen sääntö: jos ylempi sävel kuuluu alemman duuriasteikkoon, intervalli on suuri tai puhdas.',
    'Duuriasteikko: 1 1 ½ 1 1 1 ½ sävelaskelta. Muista portaat!',
    'Kolmisointu on lumiukko: kaikki nuotit viivoilla tai kaikki väleissä.',
    'Alennettu h on b. Tämä kompastuttaa monia kokeessa!',
    'Käännösintervallit: numerot yhteensä 9, suuri ↔ pieni.',
    'Sointuasteet duurissa: duurit I IV V, mollit II III VI, vähennetty VII.',
    'Kokeile Työkaluista sointurakentajaa. Kuule ja näe samaan aikaan!',
  ];

  // ---------- Etusivun kortit: päivän tavoite, oppitunnit ja putki ----------
  const ART = {
    // Maalitaulu, johon on osunut nuottinuoli
    goal: hit => `<svg class="sart" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="30" cy="34" r="25" fill="#fffdf5" stroke="#17140f" stroke-width="2.5"/>
      <circle cx="30" cy="34" r="18" fill="#d9776b" stroke="#17140f" stroke-width="2.5"/>
      <circle cx="30" cy="34" r="11" fill="#fffdf5" stroke="#17140f" stroke-width="2.5"/>
      <circle cx="30" cy="34" r="5" fill="#e6bb4f" stroke="#17140f" stroke-width="2.5"/>
      <g class="dart${hit ? ' hit' : ''}"><path d="M31 33 L55 9" stroke="#17140f" stroke-width="3" stroke-linecap="round"/>
      <path d="M50 6 l6 -3 l1 7 l-5 1 z M54 12 l7 -1 l-2 6 l-5 -1 z" fill="#e6bb4f" stroke="#17140f" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="31" cy="34" rx="4" ry="3" transform="rotate(-30 31 34)" fill="#17140f"/></g>
    </svg>`,
    // Nuottilehdet pinossa
    books: () => `<svg class="sart" viewBox="0 0 64 64" aria-hidden="true">
      <g transform="rotate(-9 32 34)"><rect x="12" y="12" width="38" height="44" rx="3" fill="#e2d8c3" stroke="#17140f" stroke-width="2.5"/></g>
      <g transform="rotate(4 32 30)"><rect x="14" y="8" width="38" height="46" rx="3" fill="#fffdf5" stroke="#17140f" stroke-width="2.5"/>
      <path d="M19 18h28M19 22h28M19 26h28M19 30h28M19 34h28" stroke="#17140f" stroke-width="1.2" opacity=".55"/>
      <path d="M19 42h28M19 46h20" stroke="#17140f" stroke-width="1.6" opacity=".35" stroke-linecap="round"/>
      <ellipse cx="27" cy="31" rx="3.4" ry="2.6" transform="rotate(-20 27 31)" fill="#17140f"/><ellipse cx="38" cy="27" rx="3.4" ry="2.6" transform="rotate(-20 38 27)" fill="#17140f"/>
      <path d="M30.1 30.2V16.5L41.1 13v13.2" fill="none" stroke="#17140f" stroke-width="2"/><path d="M30.1 16.5L41.1 13v3L30.1 19.5z" fill="#17140f"/></g>
    </svg>`,
    // Liekki: palaa, kun on harjoiteltu tänään
    flame: lit => `<svg class="sart flame${lit ? ' lit' : ''}" viewBox="0 0 64 64" aria-hidden="true">
      <path class="fl-out" d="M32 5c3 10 16 16 16 33a16 16 0 0 1-32 0c0-8 4-13 7-16 0 6 3 9 5 9-1-11 1-19 4-26z" stroke="#17140f" stroke-width="2.5" stroke-linejoin="round"/>
      <path class="fl-in" d="M32 30c1 5 8 8 8 15a8 8 0 0 1-16 0c0-4 2-6 3.5-7.5 0 3 1.5 4.5 2.5 4.5-.5-5 .5-9 2-12z" stroke="#17140f" stroke-width="2" stroke-linejoin="round"/>
    </svg>`,
  };
  function statCards() {
    const pts = S.day[today()] || 0, hit = pts >= GOAL;
    const sn = streakNow(), lit = S.streak.last === today();
    // Kuluva viikko maanantaista sunnuntaihin
    const wd = (new Date().getDay() + 6) % 7;
    seedPathDays();
    const week = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'].map((n, k) => {
      const key = dayKey(k - wd);
      const on = !!(S.pday && S.pday[key]);
      return { n, on, miss: !on && k < wd, now: k === wd, future: k > wd };
    });
    const wdone = week.filter(w => w.on).length;
    return `<section class="stats-row">
      <div class="stat2 ${hit ? 'full' : ''}">
        <div class="st-head">${ART.goal(hit)}<div class="st-txt"><b>Päivän tavoite</b><span class="st-num">${Math.min(pts, 999)}<small>/ ${GOAL} p</small></span></div></div>
        <div class="hbar" role="progressbar" aria-label="Päivän tavoite" aria-valuemin="0" aria-valuemax="${GOAL}" aria-valuenow="${Math.min(pts, GOAL)}"><i style="width:${pct(Math.min(pts, GOAL), GOAL)}%"></i></div>
      </div>
      <div class="stat2">
        <div class="st-head">${ART.books()}<div class="st-txt"><b>Oppitunnit</b><span class="st-num">${doneCount()}<small>/ ${ALL}</small></span></div></div>
        <div class="hbar ltbar" role="progressbar" aria-label="Oppitunnit" aria-valuemin="0" aria-valuemax="${ALL}" aria-valuenow="${doneCount()}"><i style="width:${pct(doneCount(), ALL)}%"></i></div>
      </div>
      <div class="stat2">
        <div class="st-head">${ART.flame(lit)}<div class="st-txt"><b>Päivän putki</b><span class="st-num">${sn}<small>${sn === 1 ? 'päivä' : 'päivää'}</small></span></div></div>
        <div class="week" role="img" aria-label="Tällä viikolla polun tehtäviä ${wdone} päivänä, ${week.filter(w => w.miss).length} päivää väliin">${week.map(w => `<div class="wd ${w.on ? 'on' : ''} ${w.miss ? 'miss' : ''} ${w.now ? 'now' : ''} ${w.future ? 'fut' : ''}" title="${w.n}: ${w.on ? 'tehty' : w.miss ? 'ei tehty' : w.now ? 'tänään' : 'tulossa'}"><i>${w.on ? '<svg viewBox="0 0 12 12"><path d="M2.5 6.3l2.3 2.3 4.7-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : w.miss ? '<svg viewBox="0 0 12 12"><path d="M3.2 3.2l5.6 5.6M8.8 3.2l-5.6 5.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' : ''}</i><span>${w.n}</span></div>`).join('')}</div>
      </div>
    </section>`;
  }

  function viewHome() {
    const nx = nextLesson();
    const cur = S.cur && LESSONS[S.cur] && !S.done[S.cur] && (S.pos[S.cur] || 0) > 0 ? S.cur : null;
    const curInfo = cur ? `<span class="cta-sub">kohta ${Math.min(S.pos[cur] + 1, LESSONS[cur].steps.length)}/${LESSONS[cur].steps.length}</span>` : '';
    const hour = new Date().getHours();
    const hi = hour < 10 ? 'Huomenta' : hour < 17 ? 'Moikka' : 'Iltaa';
    return `
    <section class="hero">
      ${bubble(doneCount() ? 'happy' : 'wow', `<b>${hi}! Olen ${esc(S.set.name)}, teoriaopettajasi.</b><br>${doneCount() ? T.rand(TIPS) : 'Opitaan musiikin teoriaa yhdessä: pienin palasin, kuvin ja äänin. Ei pitkiä tekstejä!'}`, 120)}
      <div class="hero-cta">
        ${cur ? `<a class="btn big primary" href="#/oppitunti/${cur}">▶ Jatka: ${esc(LESSONS[cur].title)} ${curInfo}</a>`
          : nx ? `<a class="btn big primary" href="#/oppitunti/${nx}">▶ Aloita: ${esc(LESSONS[nx].title)}</a>` : `<a class="btn big primary" href="#/koe">Kaikki tehty! Tee taitotesti</a>`}
        <a class="btn big energy" href="#/treeni/sekoitus"><span class="bolt">${ICONS.pika}</span>5 min pikatreeni</a>
      </div>
    </section>
    ${loginBanner()}
    ${statCards()}
    <h2 class="sec">Aiheet</h2>
    <div class="modgrid">${COURSE.modules.map(m => {
      const d = m.lessons.filter(l => S.done[l.id]).length;
      return `<a class="modcard" href="#/polut#${m.id}"><span class="mi ico">${ICONS[m.id]}</span><b>${m.title}</b><small>${m.desc}</small><div class="foot"><div class="bar"><i style="width:${pct(d, m.lessons.length)}%"></i></div><span class="cnt">${d}/${m.lessons.length}</span></div></a>`;
    }).join('')}</div>`;
  }

  function viewPaths() {
    return `
    <h1>Sävelpolku</h1>
    <p class="lead">Kaikki oppitunnit aiheittain, sopivassa oppimisjärjestyksessä. Avaa aihe ja valitse oppitunti.</p>
    <div class="progress-line"><div class="bar"><i style="width:${pct(doneCount(), ALL)}%"></i></div><span>${doneCount()}/${ALL} valmiina</span></div>
    ${COURSE.modules.map((m, mi) => {
      const ls = m.lessons;
      const d = ls.filter(l => S.done[l.id]).length;
      return `<details class="module" id="${m.id}" ${location.hash.endsWith('#' + m.id) || (mi === 0 && !location.hash.includes('#', 2)) ? 'open' : ''}>
        <summary><span class="mi ico">${ICONS[m.id]}</span><div><b>${mi + 1}. ${m.title}</b><small>${m.desc}</small><div class="bar sm"><i style="width:${pct(d, ls.length)}%"></i></div></div><span class="cnt">${d}/${ls.length}</span></summary>
        <ol class="lessons">${ls.map(l => `<li class="${S.done[l.id] ? 'done' : ''}"><a href="#/oppitunti/${l.id}"><span class="chk">${S.done[l.id] ? '✓' : S.pos[l.id] ? '◐' : '○'}</span><span class="lt"><b>${l.title}</b><small>${l.sub || ''}</small></span><span class="len">${!S.done[l.id] && S.pos[l.id] ? `kesken ${S.pos[l.id] + 1}/${l.steps.length}` : `${l.steps.length} askelta`}</span></a></li>`).join('')}</ol>
      </details>`;
    }).join('')}`;
  }

  // ---------- Oppituntisoitin ----------
  let L = null;
  function viewLesson(id) {
    const les = LESSONS[id];
    if (!les) return `<p>Oppituntia ei löytynyt.</p>`;
    const resume = S.done[id] ? 0 : Math.min(S.pos[id] || 0, les.steps.length - 1);
    L = { id, les, i: resume, resumed: resume > 0, answered: false, right: 0, seen: new Set(), quizzes: les.steps.filter(s => s.q || s.pick).length };
    return `<div class="lesson" id="lesson"></div>`;
  }
  function renderStep() {
    const el = $('#lesson'); if (!el || !L) return;
    if (L.i < L.les.steps.length) { S.pos[L.id] = L.i; S.cur = L.id; save(); }
    const { les } = L;
    const st = les.steps[L.i];
    const idx = ORDER.indexOf(L.id);
    const crumb = COURSE.modules.find(m => m.ids.includes(L.id));
    const dots = les.steps.map((s, k) => `<i class="${k < L.i ? 'past' : k === L.i ? 'now' : ''} ${s.q || s.pick ? 'qd' : ''}"></i>`).join('');
    let body = '';
    if (L.i >= les.steps.length) {
      const score = L.quizzes ? pct(L.right, L.quizzes) : 100;
      const nx = ORDER[idx + 1];
      body = `<div class="card done-card">${bubble('party', `<b>Oppitunti suoritettu!</b><br>Oikein ensimmäisellä yrityksellä: <b>${L.right}/${L.quizzes}</b> (${score} %).<br>+20 pistettä`, 130)}
        <div class="actions">
          ${nx ? `<a class="btn primary big" href="#/oppitunti/${nx}">Seuraava: ${esc(LESSONS[nx].title)} →</a>` : ''}
          <a class="btn" href="#/treeni">Treenaa aihetta</a>
          <button class="btn" data-act="restart">↺ Uudestaan</button>
        </div>${Sync.enabled && !Sync.user ? `<p class="small muted" style="text-align:center;margin-top:14px">Edistyminen on nyt tallessa vain tässä selaimessa. <button class="linkbtn" data-act="login">Kirjaudu Googlella</button>, niin se ei katoa.</p>` : ''}</div>`;
    } else if (st.q) {
      body = `<div class="card">${bubble(L.answered ? (L.lastOk ? 'party' : 'oops') : 'think', `<span class="qlabel">Kysymys</span><b class="qtext">${st.q}</b>`)}
        ${vis(st.v)}
        <div class="opts ${st.o.some(o => String(o).startsWith('<svg')) ? 'opt-staff' : ''}">${st.o.map((o, k) => `<button class="opt ${L.answered ? (k === st.a ? 'right' : (k === L.pick ? 'wrong' : 'dim')) : ''}" data-opt="${k}" ${L.answered ? 'disabled' : ''}><span class="k">${k + 1}</span>${o}</button>`).join('')}</div>
        ${playOf(st) ? `<div class="playrow"><button class="btn ghost playbtn" data-act="play">▶ Soita</button></div>` : ''}
      </div>`;
    } else if (st.pick) {
      body = `<div class="card">${bubble(L.answered ? (L.lastOk ? 'party' : 'oops') : 'think', `<span class="qlabel">Tehtävä</span><b class="qtext">${st.pick}</b>`)}
        <div class="vis pick">${R.piano({ ...st.v.piano, marks: L.answered ? st.target : [] })}</div></div>`;
    } else {
      body = `<div class="card">${bubble(st.mood || 'happy', `${st.t ? `<h2>${st.t}</h2>` : ''}${st.x || ''}`)}
        ${vis(st.v)}
        ${playOf(st) ? `<div class="playrow"><button class="btn ghost playbtn" data-act="play">▶ Soita</button></div>` : ''}
      </div>`;
    }
    const canNext = L.i >= les.steps.length ? false : (!(st.q || st.pick) || L.answered);
    // Palaute näytetään alapalkissa, joten kysymys, kuva ja vaihtoehdot eivät liiku vastatessa
    if (L.answered && (st.q || st.pick) && (L.fbStep !== L.i || L.fbOk !== L.lastOk)) { L.fbStep = L.i; L.fbOk = L.lastOk; L.fbCheer = L.lastOk ? T.rand(Mascot.CHEER) : (st.pick ? 'Ei aivan. Oikea kosketin näkyy nyt korostettuna.' : T.rand(Mascot.OOPS)); }
    const fb = L.answered && (st.q || st.pick) ? `<div class="fb" role="status"><b>${L.fbCheer}</b>${st.e ? `<span>${st.e}</span>` : ''}</div>` : '';
    el.innerHTML = `
      <div class="lesson-top">
        <a href="#/polut#${crumb ? crumb.id : ''}" class="back" aria-label="Takaisin">← <span class="bt">${crumb ? crumb.title : 'Polut'}</span></a>
        <div class="lt-title"><b>${les.title}</b></div>
        <button class="btn ghost sm" data-act="tts" title="Lue ääneen">Lue ääneen</button>
      </div>
      <div class="dots">${dots}</div>
      ${L.resumed && L.i > 0 ? `<div class="resume">Jatkat kohdasta ${L.i + 1}/${les.steps.length}. <button class="linkbtn" data-act="restart">Aloita alusta</button></div>` : ''}
      ${body}
      ${L.i < les.steps.length ? `<div class="lfoot ${L.answered && (st.q || st.pick) ? (L.lastOk ? 'ok' : 'no') : ''}">${fb}<div class="navrow">
        <button class="btn" data-act="prev" ${L.i === 0 ? 'disabled' : ''}>← Takaisin</button>
        <button class="btn primary big" data-act="next" ${canNext ? '' : 'disabled'}>${L.i === les.steps.length - 1 ? 'Valmis ✓' : 'Seuraava →'}</button>
      </div></div>` : ''}`;
    if (S.set.tts && (st && (st.x || st.q || st.pick))) speak((st.t || '') + '. ' + (st.x || st.q || st.pick));
    if (st && st.q && st.autoplay && !L.answered) startPlay(st.play);
    syncPlayBtns();
    const cardEl = el.querySelector('.card'); if (cardEl && L.shown !== L.i) { cardEl.classList.add('enter'); if (L.back) cardEl.classList.add('back'); }
    L.shown = L.i;
    L.back = false;
  }
  function lessonAnswer(k) {
    const st = L.les.steps[L.i];
    if (L.answered) return;
    L.answered = true; L.pick = k; L.lastOk = k === st.a;
    markPathDay();
    if (!L.seen.has(L.i)) { L.seen.add(L.i); if (L.lastOk) { L.right++; addXP(5); } }
    stat('oppitunnit', L.lastOk);
    renderStep();
  }
  function lessonPick(midi) {
    const st = L.les.steps[L.i];
    if (!st || !st.pick || L.answered) return;
    L.answered = true;
    L.lastOk = st.target.some(t => T.midi(t) === midi);
    markPathDay();
    if (!L.seen.has(L.i)) { L.seen.add(L.i); if (L.lastOk) { L.right++; addXP(5); } }
    renderStep();
  }
  function lessonNext() {
    L.i++; L.answered = false; L.pick = null;
    if (L.i >= L.les.steps.length) {
      const first = !S.done[L.id];
      S.done[L.id] = today(); markPathDay();
      delete S.pos[L.id]; if (S.cur === L.id) S.cur = null;
      S.best[L.id] = Math.max(S.best[L.id] || 0, L.quizzes ? pct(L.right, L.quizzes) : 100);
      addXP(20); save(); confetti();
      if (first) checkBadges();
    }
    renderStep(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------- Treeni ----------
  // Molempien kirjojen treenit samalla sivulla. Jokaisella treenillä on oma edistyminen avaimella "tunnus@taso".
  // Tulos tallentuu vasta, kun kierros on tehty loppuun; kesken jätetty kierros ei jätä jälkeä.
  let Q = null;
  // Kaikki treenit ovat yhtä kokonaisuutta; tehtävät kattavat koko kurssin
  const LV = 3;
  const tKey = gid => gid;
  const TRAIN_N = 10;
  const doneBadge = txt => `<span class="donebadge"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>${txt}</span>`;
  // Vanhat merkinnät ({r, t}) muunnetaan muotoon {n, best, t}
  const trainRec = key => { const r = (S.trained || {})[key]; return r ? { n: r.n || 1, best: r.best ?? r.r ?? 0, t: r.t || TRAIN_N } : null; };
  // Palkki: punainen = ei aloitettu, oranssi = kesken, vihreä = tehty (+ erillinen lukumäärälappu)
  function progBar(part, doneN, total) {
    const st = part ? 'part' : doneN ? 'done' : 'none';
    const w = st === 'part' ? Math.max(4, Math.round(100 * part.i / total)) : 100;
    const label = st === 'part' ? `Kesken: ${part.i}/${total} tehtävää tehty` : st === 'done' ? `Tehty ${doneN} kertaa` : 'Ei aloitettu';
    return `<div class="prow" title="${label}"><div class="pbar ${st}" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${st === 'part' ? part.i : st === 'done' ? total : 0}"><i style="width:${w}%"></i></div>${doneN ? `<span class="pcount" aria-label="${label}">${doneN}</span>` : ''}</div>`;
  }
  function trainCard(gid, name, icon) {
    const key = tKey(gid), href = `#/treeni/${gid}`;
    const r = trainRec(key);
    return `<div class="gencard${r ? ' done' : ''}">
      <a class="cardlink" href="${href}" aria-label="${esc(name)}${r ? `, tehty ${r.n} kertaa, aloita uusi kierros` : ''}"></a>
      <span class="mi ico">${icon}</span><b>${name}</b>
      <div class="foot col">${partOf('t', key) ? `<small class="pmeta part">Kesken · ${partOf('t', key).i}/${TRAIN_N}</small>` : r ? `<small class="pmeta">Paras ${r.best}/${r.t}</small>` : ''}${progBar(partOf('t', key), r ? r.n : 0, TRAIN_N)}</div></div>`;
  }
  function viewPracticeHome() {
    return `<h1>Treeni</h1>
      <p class="lead">Jokainen kierros on ${TRAIN_N} uutta satunnaista tehtävää. Kortin palkki kertoo tilanteen: <span class="lg r">punainen</span> = ei aloitettu, <span class="lg o">oranssi</span> = kesken, <span class="lg g">vihreä</span> = tehty, ja numero kertoo tehtyjen kierrosten määrän.</p>
      ${(() => {
        const gens = P.GENS.filter(g => g.lv <= LV);
        const total = gens.length + 1;
        const done = ['sekoitus'].concat(gens.map(g => g.id)).filter(id => trainRec(tKey(id))).length;
        return `<section class="trainsec">
          <div class="sechead"><h2>Kaikki aiheet</h2><span class="muted">${done}/${total} tehty</span></div>
          <div class="gengrid">${trainCard('sekoitus', 'Pikatreeni: sekoitus', ICONS.pika)}${gens.map(g => trainCard(g.id, g.name, ICONS.gen(g.id))).join('')}</div>
        </section>`;
      })()}`;
  }
  // Keskeneräiset kierrokset: S.part['t:avain'] tai S.part['e:testi'] = { i, right, per, n, ids }
  const partOf = (kind, key) => (S.part || {})[kind + ':' + key] || null;
  function savePart() {
    if (!Q || Q.committed) return;
    S.part = S.part || {};
    const k = (Q.kind === 'exam' ? 'e:' + Q.examId : 't:' + Q.key);
    if (Q.i === 0 && !Q.answered) { delete S.part[k]; return; }
    S.part[k] = { i: Q.i + (Q.answered ? 1 : 0), right: Q.right, per: Q.per, n: Q.n, ids: Q.kind === 'exam' ? Q.ids : undefined };
    save();
  }
  function clearPart() { if (!Q || !S.part) return; delete S.part[(Q.kind === 'exam' ? 'e:' + Q.examId : 't:' + Q.key)]; }
  function startRun(kind, ids, n, title, lv, key) {
    Q = { kind, ids, n, lv, key, i: 0, right: 0, title, cur: null, answered: false, per: {}, streak: 0, committed: false };
    const part = kind === 'practice' ? partOf('t', key) : null;
    if (part && part.i < n) { Q.i = part.i; Q.right = part.right || 0; Q.per = part.per || {}; Q.resumed = part.i; }
    nextQ();
  }
  function nextQ() {
    const gid = Q.kind === 'exam' ? Q.ids[Q.i] : T.rand(Q.ids);
    const g = P.get(gid);
    let item;
    try { item = g.f(Q.lv); } catch (e) { console.error(e); item = P.get('intervalli').f(Q.lv); }
    Q.cur = { ...item, gid };
    Q.answered = false;
    renderRun();
    if (Q.cur.autoplay) setTimeout(() => startPlay(Q.cur.play), 250);
  }
  function viewRun() { return `<div class="lesson" id="run"></div>`; }
  function renderRun() {
    const el = $('#run'); if (!el) return;
    if (Q.i >= Q.n) return renderRunEnd(el);
    const c = Q.cur, g = P.get(c.gid);
    el.innerHTML = `
      <div class="lesson-top"><a href="#/${Q.kind === 'exam' ? 'koe' : 'treeni'}" class="back" aria-label="Takaisin">← <span class="bt">${Q.kind === 'exam' ? 'Taitotestit' : 'Treeni'}</span></a>
        <div class="lt-title"><b>${Q.title}</b><small>${g.name}</small></div>
        <span class="pill">${Q.streak >= 3 ? '×' + Q.streak + ' ' : ''}${Q.i + 1}/${Q.n}</span></div>
      <div class="bar run"><i style="width:${pct(Q.i, Q.n)}%"></i></div>
      ${Q.resumed && Q.i === Q.resumed && !Q.answered ? `<div class="resume">Jatkat kohdasta ${Q.i + 1}/${Q.n}. Aiemmat vastauksesi ovat tallessa.</div>` : ''}
      <div class="card ${Q.answered ? '' : 'enter'}">${bubble(Q.answered ? (Q.ok ? 'party' : 'oops') : 'think', `<b class="qtext">${c.q}</b>`)}
        ${vis(c.v)}
        <div class="opts ${c.optClass || ''}">${c.o.map((o, k) => `<button class="opt ${Q.answered ? (k === c.a ? 'right' : (k === Q.pick ? 'wrong' : 'dim')) : ''}" data-ropt="${k}" ${Q.answered ? 'disabled' : ''}><span class="k">${k + 1}</span>${o}</button>`).join('')}</div>
        ${playOf(c) ? `<div class="playrow"><button class="btn ghost playbtn" data-act="rplay">▶ Soita</button></div>` : ''}
      </div>
      <div class="lfoot ${Q.answered ? (Q.ok ? 'ok' : 'no') : ''}">${Q.answered ? `<div class="fb" role="status"><b>${Q.cheer}</b>${c.e ? `<span>${c.e}</span>` : ''}${c.ev ? vis(c.ev) : ''}</div>` : ''}
        <div class="navrow"><span></span><button class="btn primary big" data-act="rnext" ${Q.answered ? '' : 'disabled'}>${Q.i === Q.n - 1 ? 'Tulokset →' : 'Seuraava →'}</button></div></div>`;
  }
  function runAnswer(k) {
    if (Q.answered) return;
    const c = Q.cur;
    Q.answered = true; Q.pick = k; Q.ok = k === c.a; Q.cheer = Q.ok ? T.rand(Mascot.CHEER) : T.rand(Mascot.OOPS);
    const per = Q.per[c.gid] || (Q.per[c.gid] = { r: 0, t: 0 }); per.t++;
    if (Q.ok) { Q.right++; per.r++; Q.streak++; S.combo++; S.maxCombo = Math.max(S.maxCombo, S.combo); addXP(3 + Math.min(5, Math.floor(Q.streak / 3))); }
    else { Q.streak = 0; S.combo = 0; save(); }
    savePart();
    renderRun();
    if (!Q.ok && c.play) setTimeout(() => startPlay(c.play), 200);
  }
  // Kierroksen tulokset kirjataan vasta lopussa
  function commitRun() {
    if (Q.committed) return;
    clearPart();
    Q.committed = true;
    Object.entries(Q.per).forEach(([gid, p]) => {
      const st = S.stats[gid] || (S.stats[gid] = { r: 0, t: 0 });
      st.r += p.r; st.t += p.t;
      if (gid === 'kuulo') S.ear += p.r;
    });
    const p = pct(Q.right, Q.n);
    if (Q.kind === 'exam') {
      const e = S.exams[Q.examId] || (S.exams[Q.examId] = { best: 0, n: 0 });
      e.best = Math.max(e.best, p); e.n++;
      addXP(30);
    } else {
      S.trained = S.trained || {};
      const prev = trainRec(Q.key);
      S.trained[Q.key] = { n: (prev ? prev.n : 0) + 1, best: Math.max(prev ? prev.best : 0, Q.right), t: Q.n, d: today() };
      addXP(10);
    }
    save(); checkBadges();
  }
  const GEN_LESSON = { nimi: 'nimi-oktaavi', piirra: 'oktaavialat', arvot: 'nuotit-tauot', tahti: 'tahtiviivat', savellaji: 'uudet-asteikot', etumerkit: 'kvinttiympyra-jatko', kvintti: 'kvinttiympyra', asteikko: 'molliasteikot', transpo: 'transponointi', sointu: 'sointumerkit', muodosta: 'kolmisointu-rakenne', systeemi: 'sointusysteemi', aste: 'sointuasteet', intervalli: 'iv-suuret-puhtaat', rakenna: 'intervallit', kaanteis: 'kaannosintervallit', kaannos: 'kaannokset', septimi: 'sept-rakenne', saveltaja: 'saveltajat', kuulo: 'kolmisointu' };
  function renderRunEnd(el) {
    commitRun();
    const p = pct(Q.right, Q.n);
    const weak = Object.entries(Q.per).filter(([, s]) => s.r < s.t).map(([g]) => g);
    const grade = p >= 90 ? 'Erinomainen!' : p >= 75 ? 'Hyvä!' : p >= 50 ? 'Hyvä alku!' : 'Treenataan lisää yhdessä.';
    if (p >= 75) confetti();
    const isExam = Q.kind === 'exam';
    const again = isExam ? `#/koe/${Q.examId}` : `#/treeni/${Q.key.replace('@', '/')}`;
    el.innerHTML = `<div class="card done-card enter">${bubble(p >= 75 ? 'party' : p >= 50 ? 'happy' : 'think', `<b>${grade}</b><br>Oikein <b>${Q.right}/${Q.n}</b> (${p} %). ${isExam ?`Tämä oli ${S.exams[Q.examId]?.n || 1}. kertasi.` : `Tämä oli ${trainRec(Q.key)?.n || 1}. kierroksesi.`}`, 130)}
      ${isExam ? `<div class="restable">${Object.entries(Q.per).map(([g, s]) => `<div class="${s.r === s.t ? 'ok' : 'no'}"><span>${P.get(g).name}</span><b>${s.r}/${s.t}</b></div>`).join('')}</div>` : ''}
      ${weak.length ? `<p><b>Kertaa nämä:</b></p><div class="chips">${[...new Set(weak.map(g => GEN_LESSON[g]))].filter(Boolean).map(id => `<a class="chip" href="#/oppitunti/${id}">${LESSONS[id].title} →</a>`).join('')}</div>` : ''}
      <div class="actions"><button class="btn primary big" data-act="again" data-href="${again}">Uusi ${isExam ? 'testi' : 'kierros'} →</button><a class="btn" href="#/${isExam ? 'koe' : 'treeni'}">Takaisin</a></div></div>`;
  }

  // ---------- Taitotesti ----------
  const EXAM_LIST = [
    { id: 'taitotesti', t: 'Taitotesti', d: 'Kaikki aiheet sekaisin, kuin oikea koe (25 tehtävää)', n: 25 },
    { id: 'pikatesti', t: 'Pikatesti', d: 'Lyhyt tarkistus kaikista aiheista (10 tehtävää)', n: 10 },
  ];
  function viewExamHome() {
    return `<h1>Taitotesti</h1><p class="lead">Kokeen harjoitus: tehtäviä kaikista aiheista sekaisin. Palkki kertoo tilanteen: <span class="lg r">punainen</span> = ei aloitettu, <span class="lg o">oranssi</span> = kesken (jatkuu samasta kohdasta), <span class="lg g">vihreä</span> = tehty, ja numero kertoo, montako kertaa olet tehnyt testin.</p>
      <div class="examgrid">${EXAM_LIST.map(e => {
        const r = S.exams[e.id], href = `#/koe/${e.id}`;
        return `<div class="examcard${r ? ' done' : ''}">
          <a class="cardlink" href="${href}" aria-label="${e.t}${r ? `, tehty ${r.n} kertaa, aloita uusi testi` : ''}"></a>
          <span class="mi ico">${ICONS.koe}</span><b>${e.t}</b><small>${e.d}</small>
          <div class="foot col">${partOf('e', e.id) ? `<small class="pmeta part">Kesken · ${partOf('e', e.id).i}/${partOf('e', e.id).n}</small>` : r ? `<small class="pmeta">Paras ${r.best} %</small>` : ''}${progBar(partOf('e', e.id), r ? (r.n || 1) : 0, partOf('e', e.id)?.n || e.n)}</div></div>`;
      }).join('')}</div>`;
  }
  function startExam(id) {
    const ex = EXAM_LIST.find(e => e.id === id) || EXAM_LIST[0]; id = ex.id;
    const ids = T.shuffle(P.EXAMS.perus.concat(P.EXAMS.jatko)).slice(0, ex.n);
    Q = null;
    const title = ex.t;
    Q = { kind: 'exam', examId: id, ids, n: ids.length, lv: LV, key: id, i: 0, right: 0, title, cur: null, answered: false, per: {}, streak: 0, committed: false };
    const part = partOf('e', id);
    if (part && part.ids && part.i < part.ids.length) { Q.ids = part.ids; Q.n = part.ids.length; Q.i = part.i; Q.right = part.right || 0; Q.per = part.per || {}; Q.resumed = part.i; }
    nextQ();
  }

  // ---------- Vahvistusikkuna ----------
  function confirmBox(title, text, okLabel, onOk) {
    const prev = document.activeElement;
    const ov = document.createElement('div');
    ov.className = 'modal-ov';
    ov.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle"><h2 id="mTitle">${title}</h2><p>${text}</p>
      <div class="actions"><button class="btn" data-m="no">Peruuta</button><button class="btn primary" data-m="ok">${okLabel}</button></div></div>`;
    const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    const close = () => { ov.remove(); document.removeEventListener('keydown', onKey, true); if (prev && prev.focus) prev.focus(); };
    ov.addEventListener('click', e => {
      e.stopPropagation();
      const m = e.target.closest('[data-m]');
      if (e.target === ov || (m && m.dataset.m === 'no')) return close();
      if (m && m.dataset.m === 'ok') { close(); onOk(); }
    });
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(ov);
    ov.querySelector('[data-m="ok"]').focus();
  }


  // ---------- Työkalut ----------
  const TT = { root: 'C', acc: 0, type: 'duuri', inv: 0, scT: 'C', scA: 0, scType: 'duuri', ivLo: 'C4', ivAb: 's3', circ: 0, pianoNote: null, spell: 1 };
  function viewTools() {
    S.badges.tyokalu || (S.badges.tyokalu = today(), save());
    const L7 = T.LET.map((l, i) => `<option value="${l}">${T.FI[i]}</option>`).join('');
    const accSel = `<option value="0">♮</option><option value="1">♯</option><option value="-1">♭</option>`;
    return `<h1>Työkalut</h1><p class="lead">Kokeile vapaasti, kuuntele ja katso. Näillä voit myös tarkistaa kotitehtävät.</p>
    <div class="tools">
      <section class="tool"><h2>Piano ja viivasto</h2><p class="tool-help">Klikkaa kosketinta. Näet nuotin viivastolla ja sen nimen oktaavialan merkinnällä (esim. fis¹). Palkki koskettimien yläpuolella kertoo oktaavialan.</p>
        <div class="seg sm">${[['1', '♯-nimet'], ['-1', '♭-nimet']].map(([v, l]) => `<button data-spell="${v}" class="${String(TT.spell) === v ? 'on' : ''}">${l}</button>`).join('')}</div>
        <div id="tPianoOut" class="tool-out"><p class="tool-help">Ei vielä valittua säveltä.</p></div><div class="vis scrollx" data-tool="piano" id="tPiano">${R.piano({ from: 'C2', oct: 4 })}</div></section>
      <section class="tool"><h2>Sointurakentaja</h2><p class="tool-help">Valitse pohjasävel ja sointutyyppi. Näet soinnun viivastolla ja pianossa sekä sen rakenteen tersseinä alhaalta ylös.</p>
        <div class="formrow"><label>Pohjasävel <select id="cRoot">${L7}</select></label><label><select id="cAcc">${accSel}</select></label>
        <label>Tyyppi <select id="cType">${Object.keys(T.CHORDS).map(t => `<option value="${t}">${T.CHORD_FI[t]}</option>`).join('')}</select></label>
        <label>Muoto <select id="cInv"><option value="0">perusmuoto</option><option value="1">1. käännös (⁶)</option><option value="2">2. käännös (⁶₄)</option><option value="3">3. käännös</option></select></label></div>
        <div id="cOut" class="tool-out"></div></section>
      <section class="tool"><h2>Asteikot</h2><p class="tool-help">Valitse perussävel ja asteikko. Askelrivillä 1 = sävelaskel, ½ = puoli sävelaskelta, 1½ = ylinouseva sekunti.</p>
        <div class="formrow"><label>Perussävel <select id="sRoot">${L7}</select></label><label><select id="sAcc">${accSel}</select></label>
        <label>Asteikko <select id="sType">${['duuri', 'luonnollinen', 'harmoninen', 'melodinen', 'itämainen'].map(t => `<option value="${t}">${t === 'duuri' ? 'duuri' : t + ' molli'}</option>`).join('')}<option value="krom">kromaattinen</option></select></label></div>
        <div id="sOut" class="tool-out"></div></section>
      <section class="tool"><h2>Intervallimittari</h2><p class="tool-help">Valitse alempi sävel ja intervalli. Näet ylemmän sävelen ja säännön: kuuluuko ylempi sävel alemman sävelen duuriasteikkoon?</p>
        <div class="formrow"><label>Alempi sävel <select id="iLo">${['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C#4', 'Eb4', 'F#4', 'Ab4', 'Bb4', 'Db4', 'G#4'].map(n => `<option value="${n}">${T.octName(n)}</option>`).join('')}</select></label>
        <label>Intervalli <select id="iAb">${['pu1', 'pi2', 's2', 'y2', 'pi3', 's3', 'v4', 'pu4', 'y4', 'v5', 'pu5', 'y5', 'pi6', 's6', 'y6', 'v7', 'pi7', 's7', 'pu8', 'pi9', 's9', 'pi10', 's10'].map(a => `<option ${a === 's3' ? 'selected' : ''}>${a}</option>`).join('')}</select></label></div>
        <div id="iOut" class="tool-out"></div></section>
      <section class="tool"><h2>Kvinttiympyrä</h2><p class="tool-help">Klikkaa sävellajia. Ulkokehällä on duuri, sisäkehällä sen rinnakkaissävellaji, molli, jolla on sama etumerkintä.</p>
        <div class="circ-tool"><div data-circle="1" class="circwrap">${R.circle({ hi: TT.circ })}</div><div id="kOut" class="tool-out"></div></div></section>
    </div>`;
  }
  const ladder = ns => ns.map((n, i) => `<span class="n">${T.name(n).toLowerCase()}</span>` + (i < ns.length - 1 ? `<span class="iv ${T.interval(n, ns[i + 1]).q === 'suuri' ? 's' : 'p'}">${T.ivAbbr(T.interval(n, ns[i + 1]))}</span>` : '')).join('<span>→</span>');
  function updTools() {
    const g = id => document.getElementById(id);
    if (!g('cOut')) return;
    // sointu
    const root = T.str({ l: T.LET.indexOf(g('cRoot').value), acc: +g('cAcc').value, oct: 4 });
    const type = g('cType').value;
    let ch = T.chord(root, type);
    const inv = Math.min(+g('cInv').value, ch.length - 1);
    const shown = T.invert(ch, inv);
    const ints = ch.slice(1).map((n, i) => T.ivAbbr(T.interval(ch[i], n)));
    g('cOut').innerHTML = `<div class="sym">${T.chordSymbol(root, type)}<small>${T.CHORD_FI[type]}</small></div>
      <div class="tool-vis">${R.staff({ clef: 'g', notes: [{ n: shown, lab: shown.map(n => T.name(n).toLowerCase()).join(' ') }], forceAcc: true })}${R.piano({ from: 'C4', oct: 2, marks: shown.map(n => ({ n, lab: T.name(n).toLowerCase() })), legend: false })}</div>
      <div class="ladder">${ladder(shown)}</div>
      <p>Perusmuodon rakenne alhaalta: <b>${ints.join(' + ')}</b> · pohjasävelestä kvintti: <b>${T.ivAbbr(T.interval(ch[0], ch[2]))}</b>${ch[3] ? ' · septimi: <b>' + T.ivAbbr(T.interval(ch[0], ch[3])) + '</b>' : ''}${inv ? ` · alimpana ${['', 'terssi', 'kvintti', 'septimi'][inv]}` : ''}</p>
      <button class="btn ghost" data-tplay="${shown.join(',')}">▶ Soita</button>`;
    // asteikko
    const sr = T.str({ l: T.LET.indexOf(g('sRoot').value), acc: +g('sAcc').value, oct: 4 });
    const st = g('sType').value;
    let sc, lab;
    if (st === 'krom') { const c = T.chromatic(sr); sc = c.up; lab = 'kromaattinen ylöspäin'; }
    else { sc = T.scale(sr, st); lab = st === 'duuri' ? T.name(sr) + '-duuri' : `${st} ${T.name(sr).toLowerCase()}-molli`; }
    const steps = sc.slice(1).map((n, i) => { const d = T.midi(n) - T.midi(sc[i]); return d === 1 ? 'P' : d === 2 ? 'K' : 'Y'; });
    g('sOut').innerHTML = `<div class="sym sm">${lab}</div><div class="tool-vis">${R.staff({ clef: 'g', notes: sc, names: 'fi', forceAcc: true, colW: st === 'krom' ? 28 : 36 })}</div><div class="vis">${R.piano({ from: 'C4', oct: 2, marks: sc.map(n => ({ n, lab: T.name(n).toLowerCase() })), legend: false })}</div>
      ${st !== 'krom' ? stepsHTML(steps) : ''}<button class="btn ghost" data-tplay="${sc.join(',')}" data-seq="1">▶ Soita</button>`;
    // intervalli
    const lo = g('iLo').value, ab = g('iAb').value;
    const { q, num } = T.ivFromAbbr(ab);
    const hi = T.str(T.up(lo, num, q));
    const semi = T.midi(hi) - T.midi(lo);
    const INV = { suuri: 'pi', pieni: 's', puhdas: 'pu', ylinouseva: 'v', 'vähennetty': 'y' };
    const inMajor = T.scale(lo, 'duuri').some(n => T.name(n) === T.name(hi));
    g('iOut').innerHTML = `<div class="sym sm">${T.octName(lo)} → ${T.octName(hi)}</div><div class="tool-vis">${R.staff({ clef: 'g', notes: [[lo, hi]], forceAcc: true })}${R.piano({ from: 'C4', oct: 3, marks: [{ n: lo, lab: T.octName(lo) }, { n: hi, lab: T.octName(hi) }], legend: false })}</div>
      <p class="rulebox">Kuuluuko <b>${T.name(hi).toLowerCase()}</b> ${T.name(lo)}-duuriasteikkoon (${T.scale(lo, 'duuri').slice(0, 7).map(n => T.name(n).toLowerCase()).join(' ')})? <b>${inMajor ? 'Kyllä → suuri tai puhdas' : 'Ei → pieni, ylinouseva tai vähennetty'}</b></p>
      <p><b>${ab}</b> = ${q} ${['priimi', 'sekunti', 'terssi', 'kvartti', 'kvintti', 'seksti', 'septimi', 'oktaavi', 'nooni', 'desimi'][num - 1]} · ${semi} puolisävelaskelta${num <= 8 ? ` · käännösintervalli: <b>${INV[q]}${9 - num}</b>` : ''}</p>
      <button class="btn ghost" data-tplay="${lo},${hi}" data-seq="1">▶ Soita</button>`;
    // kvinttiympyrä
    const c = R.CIRCLE[TT.circ];
    const k = c.k;
    g('kOut').innerHTML = `<div class="sym sm">${T.majorName(k)} / ${T.minorName(k)}</div>${R.staff({ clef: 'g', key: k, notes: [] })}
      <p>${k === 0 ? 'Ei etumerkkejä' : Math.abs(k) + (k > 0 ? ' korotusta: ' : ' alennusta: ') + (k > 0 ? T.SHARP_ORDER.slice(0, k).map(l => T.name({ l, acc: 1, oct: 4 }).toLowerCase()) : T.FLAT_ORDER.slice(0, -k).map(l => T.name({ l, acc: -1, oct: 4 }).toLowerCase())).join(', ')}</p>
      <button class="btn ghost" data-tplay="${T.scale(T.MAJOR[k] + '4', 'duuri').join(',')}" data-seq="1">▶ Duuriasteikko</button>`;
  }
  function toolPiano(m) {
    const out = document.getElementById('tPianoOut'); if (!out) return;
    const pc = m % 12, oct = Math.floor(m / 12) - 1;
    const sharpN = [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [3, 0], [3, 1], [4, 0], [4, 1], [5, 0], [5, 1], [6, 0]][pc];
    const flatN = [[0, 0], [1, -1], [1, 0], [2, -1], [2, 0], [3, 0], [4, -1], [4, 0], [5, -1], [5, 0], [6, -1], [6, 0]][pc];
    const [l, acc] = TT.spell > 0 ? sharpN : flatN;
    const n = T.str({ l, acc, oct });
    const clef = m < 60 ? 'f' : 'g';
    const enh = acc !== 0 ? ` = ${T.octName(T.str({ l: (TT.spell > 0 ? flatN : sharpN)[0], acc: (TT.spell > 0 ? flatN : sharpN)[1], oct }))}` : '';
    const tp = document.getElementById('tPiano'); if (tp) tp.innerHTML = R.piano({ from: 'C2', oct: 4, marks: [{ n, lab: T.octName(n) }] });
    out.innerHTML = `<div class="pnote">${R.staff({ clef, notes: [n], forceAcc: true })}<div><div class="sym">${T.octName(n)}${enh}</div><small>${T.OCT_FI[oct] || ''}</small></div></div>`;
  }

  // ---------- Sanasto, merkit, asetukset ----------
  function viewGlossary() {
    return `<h1>Sanasto</h1><p class="lead">Teoriakäsitteet lyhyesti. Kirjoita hakukenttään.</p>
      <input class="search" id="gSearch" placeholder="Hae, esim. johtosävel" autocomplete="off">
      <div class="gloss" id="gList">${GLOSSARY.slice().sort((a, b) => a[0].localeCompare(b[0], 'fi')).map(([t, d]) => `<div class="gitem" data-t="${esc(t.toLowerCase())} ${esc(d.toLowerCase())}"><b>${t}</b><span>${d}</span></div>`).join('')}</div>`;
  }
  function viewBadges() {
    return `<h1>Merkit</h1><p class="lead">Kerää merkkejä harjoittelemalla. ${Object.keys(S.badges).filter(k => BADGES.find(b => b.id === k)).length}/${BADGES.length} ansaittu.</p>
      <div class="badges">${BADGES.map(b => `<div class="badge ${S.badges[b.id] ? 'got' : ''}">${ICONS.medal(b.i, b.c, !!S.badges[b.id])}<b>${b.n}</b><small>${b.d}</small></div>`).join('')}</div>`;
  }
  function accountHTML() {
    const acct = Sync.enabled
      ? (Sync.user
        ? `<div class="setrow" id="tili"><div><b>Kirjautunut: ${esc(Sync.user.displayName || Sync.user.email || 'Google-tili')}</b><small>Edistyminen synkronoituu automaattisesti kaikille laitteillesi.</small></div><button class="btn" data-act="logout">Kirjaudu ulos</button></div>`
        : `<div class="setrow" id="tili"><div><b>Kirjaudu Google-tilillä</b><small>Edistyminen tallentuu tilillesi, ja voit jatkaa millä tahansa laitteella.</small></div><button class="btn primary" data-act="login">Kirjaudu</button></div>`)
      : '';
    return acct + `<div class="setrow col"><div><b>Siirtokoodi</b><small>Siirrä edistyminen toiselle laitteelle ilman tunnuksia: luo koodi tällä laitteella ja liitä se toisella. Tiedot yhdistetään, eikä mitään katoa.</small></div>
      <div class="codebox"><button class="btn" data-act="mkcode">Luo siirtokoodi</button><textarea id="codeOut" readonly rows="3" placeholder="Koodi ilmestyy tähän"></textarea><button class="btn ghost sm" data-act="copycode">Kopioi koodi</button></div>
      <div class="codebox"><label for="codeIn"><b>Liitä koodi toiselta laitteelta</b></label><textarea id="codeIn" rows="3" placeholder="SP1-…"></textarea><button class="btn primary" data-act="importcode">Tuo edistyminen</button><p id="codeMsg" class="small" role="status"></p></div></div>`;
  }
  const THEMES = [
    ['auto', 'Laitteen mukaan', 'Flyygeli, vaalea tai tumma'],
    ['light', 'Flyygeli', 'Vanilja, pianon musta, messinki'],
    ['dark', 'Flyygeli yö', 'Lakattu musta ja messinki'],
    ['salvia', 'Salvia', 'Oliivi, salvia ja terrakotta'],
    ['retro', 'Retro', 'Teräksensininen, terrakotta, hiekka'],
    ['persikka', 'Persikka', 'Suklaa, aprikoosi ja ruusupuu'],
    ['vuoristo', 'Vuoristo', 'Yönsininen ja pölyinen roosa'],
    ['metsa', 'Metsä', 'Havunvihreä ja sumunharmaa'],
  ];
  const themePreview = v => {
    if (v === 'auto') return [...THEME_SWATCH.light.slice(0, 3), ...THEME_SWATCH.dark.slice(0, 2)].map(c => `<i style="background:${c}"></i>`).join('');
    return (THEME_SWATCH[v] || []).map(c => `<i style="background:${c}"></i>`).join('');
  };
  const footer = () => `<footer class="appfoot"><p>${'Sävelpolku on itsenäinen musiikin teorian harjoitussovellus.'}</p><p><a href="#/tietosuoja">Tietosuoja</a> · <a href="#/asetukset">Asetukset</a></p></footer>`;
  function viewPrivacy() {
    return `<h1>Tietosuoja</h1>
      <section class="prose">
        <p class="lead">Tällä sivulla kerrotaan, mitä tietoja Sävelpolku tallentaa ja miten voit poistaa ne.</p>
        <h2>Ilman kirjautumista</h2>
        <p>Edistymisesi ja asetuksesi (esimerkiksi tehdyt oppitunnit, pisteet, teema ja opettajan nimi) tallentuvat vain tämän laitteen selaimeen. Niitä ei lähetetä minnekään. Sovellus ei käytä mainoksia, seurantaa eikä analytiikkaa.</p>
        <h2>Kun kirjaudut Google-tilillä</h2>
        <p>Kirjautuminen on vapaaehtoista. Kun kirjaudut, Googlen Firebase-palveluun tallennetaan:</p>
        <ul><li>Google-tilisi nimi, sähköpostiosoite ja tunniste (kirjautumista varten)</li><li>edistymisesi ja asetuksesi (jotta voit jatkaa toisella laitteella)</li></ul>
        <p>Tietoja käytetään vain edistymisen tallentamiseen ja siirtämiseen laitteiden välillä. Vain sinä pääset omiin tietoihisi. Tietoja ei luovuteta kenellekään muulle. Firebasen tarjoaa Google, ja tiedot käsitellään Googlen palvelimilla.</p>
        <h2>Tietojen poistaminen</h2>
        <p>Voit poistaa kaikki tietosi milloin tahansa: <b>Asetukset → Poista tietoni</b>. Jos olet kirjautunut, tiedot poistetaan myös pilvestä ja sinut kirjataan ulos.</p>
        <h2>Alle 13-vuotiaat</h2>
        <p>Alle 13-vuotias tarvitsee huoltajan luvan Google-kirjautumiseen. Ilman kirjautumista sovellusta voi käyttää kuka tahansa.</p>
        <h2>Yhteystiedot</h2>
        <p>Sovellusta ylläpitää GitHub-käyttäjä makaatkos. Kysymykset ja pyynnöt: <a href="https://github.com/makaatkos/savelpolku/issues" target="_blank" rel="noopener">github.com/makaatkos/savelpolku/issues</a></p>
        <h2>Tekijänoikeudet</h2>
        <p>Sävelpolku on itsenäinen musiikin teorian harjoitussovellus. Oppituntien selitykset, tehtävät ja kuvat on tehty tätä sovellusta varten. Kirjasimet: Bricolage Grotesque, Atkinson Hyperlegible ja Noto Music (SIL Open Font License).</p>
      </section>`;
  }
  function viewSettings() {
    const cols = [['#ffcf33', 'Keltainen'], ['#d98a2b', 'Oranssi'], ['#f07a5f', 'Koralli'], ['#e8a3a0', 'Pinkki'], ['#c9a3e8', 'Laventeli'], ['#8fb1f0', 'Sininen'], ['#a9c1d9', 'Taivas'], ['#6fcfc0', 'Turkoosi'], ['#a8d5b5', 'Minttu'], ['#c5dc6a', 'Lime'], ['#c69a6d', 'Kaakao'], ['#b8b2a7', 'Harmaa'], ['#f5f0e6', 'Valkoinen']];
    return `<h1>Asetukset</h1>
      <section class="settings">
        <div class="setrow mascot-set"><div class="mascot-wrap">${Mascot.svg('wow', S.set.color, 110)}</div><div>
          <label>Opettajan nimi <input id="sName" value="${esc(S.set.name)}" maxlength="20"></label>
          <div class="colors">${cols.map(([c, n]) => `<button class="sw ${S.set.color === c ? 'on' : ''}" data-color="${c}" style="--c:${c}" title="${n}" aria-label="${n}"></button>`).join('')}</div></div></div>
        <div class="setrow"><div><b>Animaatiot</b><small>Siirtymät ja ilmestymisanimaatiot</small></div><div class="seg sm">${[['on', 'Päällä'], ['auto', 'Laitteen mukaan'], ['off', 'Vähemmän']].map(([v, l]) => `<button data-motion="${v}" class="${(S.set.motion || 'on') === v ? 'on' : ''}">${l}</button>`).join('')}</div></div>
        <div class="setrow col"><div><b>Teema</b><small>Valitse värimaailma. "Laitteen mukaan" vaihtaa Flyygelin vaalean ja tumman välillä laitteen asetuksen mukaan.</small></div>
          <div class="themes" role="radiogroup" aria-label="Teema">${THEMES.map(([v, l, desc]) => `<button class="themebtn ${(S.set.theme || 'auto') === v ? 'on' : ''}" role="radio" aria-checked="${(S.set.theme || 'auto') === v}" data-theme="${v}"><span class="tprev">${themePreview(v)}</span><b>${l}</b><small>${desc}</small></button>`).join('')}</div></div>
        ${[['colors', 'Värikoodatut nuotit', 'Nuotit väritetään sävelnimen mukaan (c punainen, d oranssi…). Pois päältä nuotit ovat mustia.'], ['sound', 'Äänet', 'Soita nuotit ja soinnut'], ['tts', 'Lue tekstit ääneen automaattisesti', 'Helpottaa, jos lukeminen väsyttää'], ['focus', 'Keskittymistila', 'Piilottaa ylävalikon oppitunneilla']].map(([k, l, d]) => `<label class="setrow toggle"><div><b>${l}</b><small>${d}</small></div><input type="checkbox" data-set="${k}" ${S.set[k] ? 'checked' : ''}><span class="sw2"></span></label>`).join('')}
        ${accountHTML()}
        <div class="setrow col"><div><b>Lisää kotinäytölle</b><small>${isStandalone() ? 'Sävelpolku on jo kotinäytölläsi. Ohje muita laitteita varten:' : 'Sävelpolku aukeaa puhelimessa yhdellä napautuksella kuin oma sovellus.'}</small></div>${installHTML()}</div>
        <div class="setrow"><div><b>Esittely ja opas</b><small>Esittelyssä opettaja esittäytyy. Opas näyttää, mistä löydät sovelluksen osat.</small></div><div class="btnpair"><button class="btn" data-act="intro">Näytä esittely</button><button class="btn" data-act="tour">Näytä opas</button></div></div>
        <div class="setrow"><div><b>Poista tietoni</b><small>Poistaa kaiken edistymisen ja asetukset tältä laitteelta${Sync.user ? ' ja Google-tililtäsi (pilvestä)' : ''}. <a href="#/tietosuoja">Tietosuoja</a></small></div><button class="btn danger" data-act="wipe">Poista tietoni</button></div>
        <div class="setrow"><div><b>Nollaa edistyminen</b><small>Poistaa pisteet, merkit ja suoritukset tältä laitteelta</small></div><button class="btn danger" data-act="reset">Nollaa</button></div>
      </section>
      <p class="muted small">${Sync.user ? 'Edistyminen tallentuu tilillesi ja tähän selaimeen.' : 'Edistyminen tallentuu tämän laitteen selaimeen. Siirtokoodilla tai kirjautumalla saat sen muille laitteille.'}</p>`;
  }

  // ---------- Kirjautumissuositus ----------
  const GICON = '<svg class="gico" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>';
  function loginBanner() {
    if (!Sync.enabled || Sync.user || (S.lbSnooze && S.lbSnooze > today())) return '';
    return `<section class="loginbanner"><span class="lb-ico">${GICON}</span>
      <div class="lb-text"><b>Kirjaudu, niin edistymisesi ei katoa</b><small>Nyt tiedot ovat vain tässä selaimessa. Kirjautuneena ne tallentuvat tilillesi, ja voit jatkaa millä tahansa laitteella. <a href="#/tietosuoja">Tietosuoja</a></small></div>
      <div class="lb-act"><button class="btn primary gbtn" data-act="login">${GICON}Kirjaudu Googlella</button><button class="btn ghost" data-act="lbsnooze">Myöhemmin</button></div></section>`;
  }

  // ---------- Opas ensimmäisellä käyttökerralla ----------
  const visibleEl = sels => [].concat(sels).map(q => document.querySelector(q)).find(el => el && el.offsetWidth > 0 && el.getClientRects().length);
  // ---------- Ohje: lisää kotinäyttöön ----------
  const isStandalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  const guessOS = () => /android/i.test(navigator.userAgent) ? 'android' : 'ios';
  const I_SHARE = '<svg class="ii" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v11M6 6l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 9H5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const I_PLUS = '<svg class="ii" viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 6.5v7M6.5 10h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const I_DOTS = '<svg class="ii" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="4" r="1.8" fill="currentColor"/><circle cx="10" cy="10" r="1.8" fill="currentColor"/><circle cx="10" cy="16" r="1.8" fill="currentColor"/></svg>';
  const I_PHONE = '<svg class="ii" viewBox="0 0 20 20" aria-hidden="true"><rect x="5" y="2" width="10" height="16" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 7v5M7.8 10l2.2 2.2 2.2-2.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function installHTML() {
    const os = guessOS();
    const step = (n, html) => `<li><span class="n">${n}</span><span>${html}</span></li>`;
    return `<div class="inst" data-os="${os}">
      <div class="seg sm" role="tablist" aria-label="Puhelin">${[['ios', 'iPhone'], ['android', 'Android']].map(([v, l]) => `<button role="tab" data-inst="${v}" aria-selected="${os === v}" class="${os === v ? 'on' : ''}">${l}</button>`).join('')}</div>
      <ol class="inst-ios">
        ${step(1, 'Avaa Sävelpolku <b>Safarissa</b>.')}
        ${step(2, `Napauta <b>Jaa</b>-painiketta ${I_SHARE} (iPhonessa alareunassa, iPadissa yläreunassa).`)}
        ${step(3, `Valitse <b>Lisää Koti-valikkoon</b> ${I_PLUS}. Jos et näe sitä, vieritä valikkoa alaspäin.`)}
        ${step(4, 'Napauta oikeasta yläkulmasta <b>Lisää</b>.')}
      </ol>
      <ol class="inst-android">
        ${step(1, 'Avaa Sävelpolku <b>Chromessa</b>.')}
        ${step(2, `Napauta oikean yläkulman <b>valikkoa</b> ${I_DOTS}.`)}
        ${step(3, `Valitse <b>Lisää aloitusnäytölle</b> tai <b>Asenna sovellus</b> ${I_PHONE}.`)}
        ${step(4, 'Vahvista napauttamalla <b>Lisää</b> tai <b>Asenna</b>.')}
      </ol>
      <p class="inst-note">Sävelpolku aukeaa sen jälkeen kotinäytön kuvakkeesta kuin oma sovellus, aina etusivulle.</p>
    </div>`;
  }

  function tourSteps() {
    return [
      { sel: '.hero-cta .btn.primary', t: 'Aloita tai jatka tästä', x: 'Tämä nappi vie aina seuraavaan oppituntiin. Jos jätät oppitunnin kesken, se muistaa kohdan, ja napissa lukee "Jatka".' },
      { sel: '.hero-cta .btn.energy', t: 'Pikatreeni', x: '10 sekalaista tehtävää kaikista aiheista. Hyvä tapa lämmitellä tai kerrata ennen koetta.' },
      { sel: ['#nav [data-nav="polut"]', '#tabbar [data-nav="polut"]'], t: 'Polut', x: 'Kaikki 41 oppituntia aiheittain, sopivassa oppimisjärjestyksessä.' },
      { sel: ['#nav [data-nav="treeni"]', '#tabbar [data-nav="treeni"]'], t: 'Treeni', x: 'Loputtomasti uusia tehtäviä kaikista aiheista. Kun teet kierroksen loppuun, kortti muuttuu vihreäksi.' },
      { sel: ['#nav [data-nav="koe"]', '#tabbar [data-nav="koe"]'], t: 'Taitotesti', x: 'Kokeen harjoitus: tehtäviä kaikista aiheista sekaisin. Lopuksi näet, mitä kannattaa kerrata.' },
      { sel: ['#nav [data-nav="tyokalut"]', '#tabbar [data-nav="tyokalut"]'], t: 'Työkalut', x: 'Piano, sointurakentaja, asteikot, intervallimittari ja kvinttiympyrä. Kokeile ja kuuntele vapaasti.' },
      Sync.enabled && !Sync.user
        ? { sel: '#acctPill', t: 'Kirjaudu, niin mikään ei katoa', x: 'Kun kirjaudut Google-tilillä, edistymisesi tallentuu tilillesi, ja voit jatkaa millä tahansa laitteella. Suosittelen kirjautumaan heti.', login: true }
        : { sel: '#acctPill', t: 'Asetukset', x: 'Täältä voit vaihtaa teeman, nimetä minut uudelleen ja siirtää edistymisesi toiselle laitteelle.' },
      ...(isStandalone() ? [] : [{ t: 'Lisää Sävelpolku kotinäytölle', x: 'Näin Sävelpolku aukeaa puhelimessa yhdellä napautuksella. Ohje löytyy myös asetuksista.', html: installHTML(), wide: true }]),
    ];
  }
  // ---------- Esittely ensimmäisellä avauskerralla ----------
  // Kvintti esittäytyy muutamalla lyhyellä repliikillä ennen opasta.
  const introLines = () => [
    { m: 'wow', t: `Hei, minä olen ${esc(S.set.name)}!`, x: 'Olen musiikin teorian opettajasi. Käydään yhdessä läpi rytmit, asteikot, intervallit, soinnut ja paljon muuta.' },
    { m: 'happy', t: 'Pienin palasin', x: 'Jokainen oppitunti kestää muutaman minuutin. Näet asiat nuotteina ja pianolla, ja voit kuunnella ne.' },
    { m: 'think', t: 'Treenaa ja testaa', x: 'Treenin tehtävät ovat joka kerta uusia, ja taitotesti on kuin harjoituskoe. Lopuksi näet, mitä kannattaa kerrata.' },
    { m: 'party', t: 'Aloitetaan!', x: 'Näytän vielä, mistä löydät kaiken. Se kestää alle minuutin.' },
  ];
  let intro = null;
  function startIntro() {
    endIntro(false); endTour(false);
    const ov = document.createElement('div');
    ov.className = 'intro'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'introTitle');
    ov.innerHTML = `<div class="intro-card"><div class="intro-mascot"></div><div class="intro-body"></div>
      <div class="intro-foot"><div class="tour-dots"></div>
        <button class="btn ghost sm" data-intro="listen">Kuuntele</button>
        <button class="btn ghost sm" data-intro="skip">Ohita</button>
        <button class="btn primary" data-intro="next">Seuraava</button></div></div>`;
    document.body.appendChild(ov);
    document.documentElement.classList.add('touring');
    intro = { i: 0, ov, lines: introLines() };
    intro.onKey = e => {
      if (!intro) return;
      if (e.key === 'Escape') { e.preventDefault(); endIntro(true); }
      else if (e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); introGo(intro.i + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); introGo(intro.i - 1); }
    };
    document.addEventListener('keydown', intro.onKey, true);
    ov.addEventListener('click', e => {
      const b = e.target.closest('[data-intro]'); if (!b) return;
      const a = b.dataset.intro, ln = intro.lines[intro.i];
      if (a === 'next') introGo(intro.i + 1);
      else if (a === 'skip') endIntro(true);
      else if (a === 'listen') speak(ln.t + '. ' + ln.x);
    });
    introGo(0, true);
    requestAnimationFrame(() => ov.classList.add('show'));
  }
  function introGo(i, first) {
    if (!intro) return;
    if (i < 0) return;
    if (i >= intro.lines.length) { endIntro(false); setTimeout(startTour, reduceMotion() ? 0 : 260); return; }
    intro.i = i;
    const ln = intro.lines[i], card = intro.ov.querySelector('.intro-card');
    const render = () => {
      intro.ov.querySelector('.intro-mascot').innerHTML = Mascot.svg(ln.m, S.set.color, 150);
      // Sanat ilmestyvät peräkkäin: kevyt animaatio (vain läpinäkyvyys ja liike)
      const words = ln.x.split(' ').map((w, k) => `<span class="w" style="--d:${k * 28}ms">${w}</span>`).join(' ');
      intro.ov.querySelector('.intro-body').innerHTML = `<h2 id="introTitle">${ln.t}</h2><p>${words}</p>`;
      intro.ov.querySelector('.tour-dots').innerHTML = intro.lines.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
      intro.ov.querySelector('[data-intro="next"]').textContent = i === intro.lines.length - 1 ? 'Näytä opas' : 'Seuraava';
      card.classList.remove('out');
      intro.ov.querySelector('[data-intro="next"]').focus({ preventScroll: true });
    };
    if (first || reduceMotion()) return render();
    card.classList.add('out');
    setTimeout(render, 170);
  }
  function endIntro(markDone) {
    if (!intro) return;
    speechSynthesis && speechSynthesis.cancel && speechSynthesis.cancel();
    document.removeEventListener('keydown', intro.onKey, true);
    const ov = intro.ov; intro = null;
    ov.classList.remove('show');
    setTimeout(() => ov.remove(), reduceMotion() ? 0 : 220);
    if (!tour) document.documentElement.classList.remove('touring');
    if (markDone) { S.tourDone = true; save(); }
  }

  // ---------- Opas ----------
  // Kohdevalo ja selitys häivytetään pois, siirretään ja häivytetään takaisin. Sijainnit asetetaan
  // transformilla, eikä mitään kokoa animoida, joten siirtymä on sulava myös puhelimella.
  // Seuraava kuvaruutu; varmistus ajastimella, jos selain ei piirrä (esim. taustavälilehti)
  function nextFrame(fn) { let done = false; const go = () => { if (!done) { done = true; fn(); } }; requestAnimationFrame(go); setTimeout(go, 60); }
  let tour = null;
  function startTour() {
    endTour(false);
    const steps = tourSteps();
    const block = document.createElement('div'); block.className = 'tour-block';
    const spot = document.createElement('div'); spot.className = 'tour-spot hide';
    const card = document.createElement('div'); card.className = 'tour-card hide'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-modal', 'true'); card.setAttribute('aria-labelledby', 'tourTitle');
    document.body.append(block, spot, card);
    document.documentElement.classList.add('touring');
    tour = { i: -1, steps, block, spot, card, busy: false };
    tour.onKey = e => {
      if (!tour) return;
      if (e.key === 'Escape') { e.preventDefault(); endTour(true); }
      else if (e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); e.stopPropagation(); tourGo(tour.i + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); tourGo(tour.i - 1); }
    };
    let rz = 0;
    tour.onResize = () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => tourPlace()); };
    document.addEventListener('keydown', tour.onKey, true);
    window.addEventListener('resize', tour.onResize);
    card.addEventListener('click', e => {
      const b = e.target.closest('[data-tour]'); if (!b) return;
      const a = b.dataset.tour;
      if (a === 'next') tourGo(tour.i + 1);
      else if (a === 'prev') tourGo(tour.i - 1);
      else if (a === 'skip') endTour(true);
      else if (a === 'login') { endTour(true); Sync.signIn().catch(err => toast('Kirjautuminen ei onnistunut: ' + esc(err.message || err))); }
    });
    tourGo(0);
  }
  function tourGo(i) {
    if (!tour || tour.busy) return;
    if (i >= tour.steps.length) return endTour(true);
    if (i < 0) return;
    const first = tour.i < 0;
    tour.i = i; tour.busy = true;
    const swap = () => {
      if (!tour) return;
      const st = tour.steps[i], last = i === tour.steps.length - 1;
      tour.card.classList.toggle('wide', !!st.wide);
      tour.card.innerHTML = `${bubbleless(st)}
        <div class="tour-foot"><div class="tour-dots">${tour.steps.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>
          ${i === 0 ? '<button class="btn ghost sm" data-tour="skip">Ohita</button>' : '<button class="btn ghost sm" data-tour="prev" aria-label="Edellinen">←</button>'}
          ${st.login ? `<button class="btn sm" data-tour="${last ? 'skip' : 'next'}">Myöhemmin</button><button class="btn primary sm gbtn" data-tour="login">${GICON}Kirjaudu</button>`
            : `<button class="btn primary sm" data-tour="next">${last ? 'Valmis' : 'Seuraava'}</button>`}</div>`;
      const el = st.sel ? visibleEl(st.sel) : null;
      tour.el = el;
      // Vieritys tehdään heti (ei pehmeää vieritystä), jotta valo ja kohde eivät liiku eri tahdissa
      if (el) { const r = el.getBoundingClientRect(); if (r.top < 70 || r.bottom > innerHeight - 90) { document.documentElement.classList.remove('touring'); el.scrollIntoView({ block: 'center', behavior: 'instant' }); document.documentElement.classList.add('touring'); } }
      nextFrame(() => {
        tourPlace();
        tour.spot.classList.remove('hide'); tour.card.classList.remove('hide');
        tour.card.querySelector('[data-tour="next"], [data-tour="login"]')?.focus({ preventScroll: true });
        tour.busy = false;
      });
    };
    if (first || reduceMotion()) return swap();
    tour.spot.classList.add('hide'); tour.card.classList.add('hide');
    setTimeout(swap, 190);
  }
  const bubbleless = st => `<div class="speaker"><div class="mascot-wrap">${Mascot.svg(st.login ? 'wow' : 'happy', S.set.color, 64)}</div><div><h3 id="tourTitle">${st.t}</h3><p>${st.x}</p></div></div>${st.html || ''}`;
  function tourPlace() {
    if (!tour) return;
    const { spot, card, el } = tour;
    const cw = card.offsetWidth, ch = card.offsetHeight, vw = document.documentElement.clientWidth, vh = innerHeight;
    if (!el) {
      spot.classList.add('center');
      spot.style.transform = `translate3d(${vw / 2}px, ${vh / 2}px, 0)`; spot.style.width = spot.style.height = '0px';
      card.style.transform = `translate3d(${Math.max(16, (vw - cw) / 2)}px, ${Math.max(16, (vh - ch) / 2)}px, 0)`;
      return;
    }
    spot.classList.remove('center');
    const r = el.getBoundingClientRect(), pad = 6;
    spot.style.width = r.width + pad * 2 + 'px'; spot.style.height = r.height + pad * 2 + 'px';
    spot.style.transform = `translate3d(${r.left - pad}px, ${r.top - pad}px, 0)`;
    let top = r.bottom + 16;
    if (top + ch > vh - 12) top = r.top - ch - 16;
    top = Math.max(12, Math.min(top, vh - ch - 12));
    let left = r.left + r.width / 2 - cw / 2;
    left = Math.max(16, Math.min(left, vw - cw - 16));
    card.style.transform = `translate3d(${left}px, ${top}px, 0)`;
  }
  function endTour(markDone) {
    if (!tour) return;
    document.removeEventListener('keydown', tour.onKey, true);
    window.removeEventListener('resize', tour.onResize);
    const { block, spot, card } = tour;
    tour = null;
    spot.classList.add('hide'); card.classList.add('hide');
    setTimeout(() => { block.remove(); spot.remove(); card.remove(); }, reduceMotion() ? 0 : 200);
    if (!intro) document.documentElement.classList.remove('touring');
    if (markDone) { S.tourDone = true; save(); }
  }

  // ================= REITITYS =================
  // Sivujen järjestys siirtymän suuntaa varten (vasemmalle / oikealle)
  const NAV_ORDER = ['home', 'polut', 'oppitunti', 'treeni', 'koe', 'tyokalut', 'sanasto', 'merkit', 'asetukset'];
  let lastTop = null;
  const reduceMotion = () => document.documentElement.classList.contains('reduce-motion');
  function route() {
    stopPlay();
    const top = (location.hash.replace(/^#\/?/, '').split('#')[0].split('/')[0]) || 'home';
    const first = lastTop === null;
    const di = NAV_ORDER.indexOf(top) - NAV_ORDER.indexOf(lastTop);
    document.documentElement.dataset.dir = first || top === lastTop ? '' : (di > 0 ? 'left' : 'right');
    lastTop = top;
    if (!first && !reduceMotion() && document.startViewTransition && document.visibilityState === 'visible') {
      // Jos selain ohittaa siirtymän (esim. nopeat peräkkäiset vaihdot), sivu piirretään silti
      let rendered = false;
      const draw = () => { if (rendered) return; rendered = true; renderRoute(); moveInd(); };
      const vt = document.startViewTransition(draw);
      vt.updateCallbackDone.catch(draw); vt.ready.catch(() => { }); vt.finished.catch(() => { });
      setTimeout(draw, 400);
    } else {
      renderRoute(); moveInd();
      if (!first && !reduceMotion()) { app.classList.remove('fallback-in'); void app.offsetWidth; app.classList.add('fallback-in'); }
    }
  }
  // Saman sivun päivitys (asetukset, suodattimet): ei siirtymää, ja vierityskohta säilyy
  function refresh() {
    const y = window.scrollY, fid = document.activeElement && document.activeElement.closest && document.activeElement.closest('[data-theme], [data-color], [data-motion]');
    const sel = fid ? ['theme', 'color', 'motion'].map(k => fid.dataset[k] !== undefined ? `[data-${k}="${fid.dataset[k]}"]` : '').join('') : '';
    renderRoute(true);
    window.scrollTo(0, y);
    const again = sel && app.querySelector(sel); if (again) again.focus({ preventScroll: true });
  }
  // Yläpalkin valintapallo liukuu valitun kohdan alle
  function moveInd() {
    const nav = $('#nav'); if (!nav) return;
    let ind = nav.querySelector('.nav-ind');
    if (!ind) { ind = document.createElement('span'); ind.className = 'nav-ind'; nav.prepend(ind); }
    const on = nav.querySelector('a.on');
    if (!on || !on.offsetWidth) { ind.style.opacity = 0; return; }
    // Ensimmäisellä kerralla pallo asettuu suoraan paikalleen; myöhemmin se liukuu
    const firstPlace = !ind.dataset.ready;
    if (firstPlace) ind.style.transition = 'none';
    ind.style.opacity = 1; ind.style.width = on.offsetWidth + 'px'; ind.style.transform = `translateX(${on.offsetLeft}px)`;
    if (firstPlace) { void ind.offsetWidth; ind.style.transition = ''; ind.dataset.ready = '1'; }
  }
  window.addEventListener('resize', () => { moveInd(); const tb = $('#tabbar'); document.documentElement.style.setProperty('--tabh', tb && getComputedStyle(tb).position === 'fixed' ? tb.offsetHeight + 'px' : '0px'); });
  // Kirjasimen latautuminen muuttaa valikon tekstien leveyttä, joten pallo asetetaan uudelleen
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveInd());
  // Kortit ja rivit ilmestyvät peräkkäin pienellä viiveellä
  const STAGGER = '.modgrid, .gengrid, .examgrid, .badges, .lessons, .gloss, .stats-row, .settings, .tools, .restable, .hero-cta';
  function stagger(root) {
    const els = [];
    // Vain näkyvissä olevat ensimmäiset rivit porrastetaan; loput tulevat yhtä aikaa, jottei mikään jää odottamaan
    root.querySelectorAll(STAGGER).forEach(g => [...g.children].forEach((c, i) => { c.style.setProperty('--i', Math.min(i, 10)); els.push(c); }));
    [...root.children].forEach((c, i) => { if (c.matches('.module, .trainsec, .hero, .loginbanner, h1, .lead, .seg, .sechead, .progress-line, .sec, .examgrid, .tools')) { c.style.setProperty('--i', Math.min(i, 8)); els.push(c); } });
    els.forEach(c => c.classList.add('rise'));
    // Varmistus: jos animaatio ei jostain syystä käynnisty (taustavälilehti, virransäästö), sisältö tulee silti näkyviin
    clearTimeout(stagger.t);
    stagger.t = setTimeout(() => els.forEach(c => c.classList.remove('rise')), 1400);
  }
  function renderRoute(keep) {
    const h = location.hash.replace(/^#\/?/, '');
    const [a, b, c] = h.split('#')[0].split('/');
    speechSynthesis && speechSynthesis.cancel && speechSynthesis.cancel();
    document.querySelectorAll('[data-nav]').forEach(x => x.classList.toggle('on', x.dataset.nav === (a || 'home') || (a === 'oppitunti' && x.dataset.nav === 'polut')));
    document.body.classList.toggle('in-lesson', a === 'oppitunti' || (a === 'treeni' && !!b) || (a === 'koe' && !!b));
    let html;
    switch (a || '') {
      case '': html = viewHome() + footer(); break;
      case 'polut': html = viewPaths(); break;
      case 'oppitunti': html = viewLesson(b); break;
      case 'treeni': html = b ? viewRun() : viewPracticeHome(); break;
      case 'koe': html = b ? viewRun() : viewExamHome(); break;
      case 'tyokalut': html = viewTools(); break;
      case 'sanasto': html = viewGlossary(); break;
      case 'merkit': html = viewBadges(); break;
      case 'asetukset': html = viewSettings() + footer(); break;
      case 'tietosuoja': html = viewPrivacy() + footer(); break;
      default: html = viewHome();
    }
    app.innerHTML = html;
    if (a === 'oppitunti') renderStep();
    if (a === 'treeni' && b) {
      const lv = LV;
      const ids = b === 'sekoitus' ? P.GENS.filter(g => g.lv <= lv && g.id !== 'kuulo').map(g => g.id) : [P.get(b) ? b : 'intervalli'];
      startRun('practice', ids, TRAIN_N, b === 'sekoitus' ? 'Pikatreeni' : P.get(b)?.name || 'Treeni', lv, tKey(b));
    }
    if (a === 'koe' && b) startExam(b);
    if (a === 'tyokalut') updTools();
    if (keep) return;
    stagger(app);
    if (a === 'polut' && h.includes('#')) { const el = document.getElementById(h.split('#')[1]); el && setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); }
    else window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }

  // ================= TAPAHTUMAT =================
  document.addEventListener('click', e => {
    const t = e.target.closest('button, .pk, .cf-seg, [data-act]');
    if (!t) return;
    const ib = e.target.closest('[data-inst]');
    if (ib) {
      const box = ib.closest('.inst'); box.dataset.os = ib.dataset.inst;
      box.querySelectorAll('[data-inst]').forEach(b => { const on = b === ib; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
      if (tour) nextFrame(() => tourPlace());
      return;
    }
    const pk = e.target.closest('.pk');
    if (pk) {
      const m = +pk.dataset.midi; Sound.init(); Sound.tone(m, 0, 0.9, 0.5);
      pk.classList.add('press'); setTimeout(() => pk.classList.remove('press'), 180);
      if (L && $('#lesson') && L.les.steps[L.i]?.pick) lessonPick(m);
      if (pk.closest('[data-tool="piano"]')) toolPiano(m);
      return;
    }
    const seg = e.target.closest('.cf-seg');
    if (seg && seg.closest('[data-circle]')) {
      const i = +seg.dataset.i; TT.circ = i;
      seg.closest('[data-circle]').innerHTML = R.circle({ hi: i });
      const c = R.CIRCLE[i]; Sound.init(); Sound.play(T.chord(T.MAJOR[c.k] + '4', 'duuri'), 'chord');
      if (document.getElementById('kOut')) updTools();
      else toast(`<b>${T.majorName(c.k)}</b> / ${T.minorName(c.k)}: ${c.k === 0 ? 'ei etumerkkejä' : Math.abs(c.k) + (c.k > 0 ? '♯' : '♭')}`);
      return;
    }
    const d = t.dataset;
    if (d.opt !== undefined) return lessonAnswer(+d.opt);
    if (d.ropt !== undefined) return runAnswer(+d.ropt);
    if (d.playchord) { const [r, ty] = d.playchord.split('|'); Sound.init(); Sound.play(T.chord(r, ty), 'both', 0.35); return; }
    if (d.tplay) { Sound.init(); Sound.play(d.tplay.split(','), d.seq ? 'seq' : 'both', d.seq ? 0.32 : 0.35); return; }
    if (d.spell) { TT.spell = +d.spell; document.querySelectorAll('[data-spell]').forEach(b => b.classList.toggle('on', b === t)); return; }
    if (d.color) { S.set.color = d.color; save(); applySettings(); return refresh(); }
    if (d.motion) { S.set.motion = d.motion; save(); applySettings(); return refresh(); }
    if (d.theme) { S.set.theme = d.theme; save(); applySettings(); return refresh(); }
    switch (d.act) {
      case 'next': stopPlay(); return lessonNext();
      case 'prev': stopPlay(); if (L.i > 0) { L.i--; L.answered = false; L.back = true; renderStep(); } return;
      case 'restart': L.resumed = false; L.i = 0; L.right = 0; L.seen = new Set(); L.answered = false; return renderStep();
      case 'play': return togglePlay(playOf(L.les.steps[L.i]));
      case 'tts': { const st = L && L.les.steps[L.i]; if (st) speak((st.t || '') + '. ' + (st.x || st.q || st.pick || '') + (L.answered && st.e ? '. ' + st.e : '')); return; }
      case 'rplay': return togglePlay(playOf(Q.cur));
      case 'rnext': stopPlay(); Q.i++; Q.answered = false; if (Q.i < Q.n) savePart(); return Q.i >= Q.n ? renderRun() : nextQ();
      case 'login': Sync.signIn().catch(err => toast('Kirjautuminen ei onnistunut: ' + esc(err.message || err))); return;
      case 'logout': Sync.signOut().then(() => { toast('Kirjauduit ulos. Edistyminen säilyy tällä laitteella.'); refresh(); }); return;
      case 'mkcode': { const o = $('#codeOut'); o.value = Sync.exportCode(S); o.select(); return; }
      case 'copycode': { const o = $('#codeOut'); if (!o.value) o.value = Sync.exportCode(S); navigator.clipboard?.writeText(o.value).then(() => toast('Koodi kopioitu.'), () => { o.select(); toast('Valitse koodi ja kopioi se (Ctrl+C).'); }); return; }
      case 'importcode': {
        const msg = $('#codeMsg');
        try {
          const data = Sync.importCode($('#codeIn').value);
          adopt({ ...Sync.merge(S, data), v2: true }); save(); applySettings(); checkBadges();
          msg.textContent = `Edistyminen tuotu: ${doneCount()}/${ALL} oppituntia, ${S.xp} pistettä.`; msg.className = 'small ok-text';
        } catch (err) { msg.textContent = err.message; msg.className = 'small err-text'; }
        return;
      }
      case 'again': { const h = t.dataset.href; if (location.hash === h) route(); else location.hash = h; return; }
      case 'lbsnooze': S.lbSnooze = dayKey(3); save(); refresh(); return;
      case 'intro': location.hash = '#/'; setTimeout(startIntro, 450); return;
      case 'tour': location.hash = '#/'; setTimeout(startTour, 450); return;
      case 'wipe':
        confirmBox('Poistetaanko kaikki tietosi?', `Kaikki edistyminen, merkit ja asetukset poistetaan pysyvästi ${Sync.user ? 'tältä laitteelta ja pilvestä, ja sinut kirjataan ulos' : 'tältä laitteelta'}. Tätä ei voi perua.`, 'Poista pysyvästi', async () => {
          try { if (Sync.user) await Sync.deleteCloud(); } catch (err) { toast('Pilvitietojen poisto epäonnistui. Yritä uudelleen.'); return; }
          try { localStorage.removeItem(KEY); } catch (e) { }
          adopt(JSON.parse(JSON.stringify(DEF))); S.tourDone = true;
          try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { }
          applySettings(); location.hash = '#/'; route(); toast('Tietosi on poistettu.');
        });
        return;
      case 'reset':
        confirmBox('Nollataanko kaikki?', `Pisteet, merkit, oppitunnit ja treenien tulokset poistetaan ${Sync.user ? 'tililtäsi ja tältä laitteelta' : 'tältä laitteelta'}. Tätä ei voi perua.`, 'Nollaa kaikki', () => { const set = S.set; S = JSON.parse(JSON.stringify(DEF)); S.set = set; S.tourDone = true; save(); applySettings(); route(); toast('Edistyminen nollattu.'); });
        return;
    }
  });
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.set) { S.set[t.dataset.set] = t.checked; save(); applySettings(); return; }
    if (t.closest('.tools')) updTools();
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'sName') { S.set.name = e.target.value || 'Kvintti'; save(); }
    if (e.target.id === 'gSearch') { const q = e.target.value.toLowerCase(); document.querySelectorAll('.gitem').forEach(g => g.style.display = g.dataset.t.includes(q) ? '' : 'none'); }
  });
  document.addEventListener('keydown', e => {
    if (e.target.matches && e.target.matches('input, select, textarea')) return;
    if (document.querySelector('.modal-ov, .tour-card, .intro')) return;
    const n = parseInt(e.key, 10);
    if ($('#lesson') && L) {
      const st = L.les.steps[L.i];
      if (st && st.q && !L.answered && n >= 1 && n <= st.o.length) return lessonAnswer(n - 1);
      if ((e.key === 'Enter' || e.key === 'ArrowRight') && L.i < L.les.steps.length && (!(st.q || st.pick) || L.answered)) { e.preventDefault(); return lessonNext(); }
      if (e.key === 'ArrowLeft' && L.i > 0) { L.i--; L.answered = false; L.back = true; return renderStep(); }
    }
    if ($('#run') && Q && Q.i < Q.n) {
      if (!Q.answered && n >= 1 && n <= Q.cur.o.length) return runAnswer(n - 1);
      if ((e.key === 'Enter' || e.key === 'ArrowRight') && Q.answered) { e.preventDefault(); Q.i++; Q.answered = false; if (Q.i < Q.n) savePart(); return Q.i >= Q.n ? renderRun() : nextQ(); }
    }
  });
  window.addEventListener('hashchange', route);
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
  // Sovellus avautuu aina aloitusnäyttöön, vaikka pikakuvake tai kirjanmerkki osoittaisi muualle
  lastSetJSON = JSON.stringify(S.set);
  if (location.hash && location.hash !== '#/') history.replaceState(null, '', location.pathname + location.search + '#/');
  applySettings();
  try { route(); } catch (e) { console.error(e); location.hash = '#/'; renderRoute(); }
  window.SP_READY = true;
  try { sessionStorage.removeItem('sp-fix'); } catch (e) { }
  // Tallennus pilveen heti, kun sovellus suljetaan tai siirtyy taustalle
  window.addEventListener('pagehide', () => Sync.flush());
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') Sync.flush(); });
  if (!S.tourDone && !(location.hash.replace(/^#\/?/, '') || '').split('/')[0]) setTimeout(startIntro, 600);
  Sync.init(async u => {
    if (u) {
      try {
        const remote = await Sync.pull();
        adopt({ ...Sync.merge(S, remote), v2: true });
        save(); checkBadges();
        toast(`Kirjauduit: ${esc(u.displayName || u.email || '')}. Edistyminen synkronoitu.`);
      } catch (e) { toast('Tilin tietojen haku epäonnistui. Edistyminen tallentuu silti tälle laitteelle.'); }
    }
    applySettings();
    if (/asetukset/.test(location.hash) || !location.hash || location.hash === '#/') refresh();
  });
})();
