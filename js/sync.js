/* Sävelpolku – edistymisen siirto laitteiden välillä.
   1) Siirtokoodi: toimii aina, ei tunnuksia.
   2) Google-kirjautuminen (Firebase): kytkeytyy päälle, kun js/firebase-config.js sisältää asetukset. */
const Sync = (() => {
  // Koko tila tallennetaan: edistyminen, asetukset (nimi, väri, teema …) ja muut valinnat.
  // JSON-kierros poistaa tyhjät (undefined) arvot, joita Firestore ei hyväksy.
  const progress = S => JSON.parse(JSON.stringify(S || {}));
  const maxOf = (x, y) => Math.max(x || 0, y || 0);

  // Yhdistää kaksi edistymistä niin, ettei kummastakaan katoa mitään
  function merge(a, b) {
    if (!b) return a;
    // Tuntemattomat avaimet: säilytä oma arvo, muuten toisen laitteen arvo
    const o = { ...b, ...a };
    // Asetukset: uudemmin muutettu versio voittaa (setAt = muutoshetki)
    const sa_ = a.setAt || 0, sb_ = b.setAt || 0;
    o.set = sb_ > sa_ ? { ...(a.set || {}), ...(b.set || {}) } : { ...(b.set || {}), ...(a.set || {}) };
    o.setAt = Math.max(sa_, sb_);
    o.lbSnooze = [a.lbSnooze, b.lbSnooze].filter(Boolean).sort().pop() || null;
    o.v2 = true;
    o.done = { ...(b.done || {}), ...(a.done || {}) };
    o.badges = { ...(b.badges || {}), ...(a.badges || {}) };
    o.pos = {}; new Set([...Object.keys(a.pos || {}), ...Object.keys(b.pos || {})]).forEach(k => { if (!o.done[k]) o.pos[k] = maxOf(a.pos?.[k], b.pos?.[k]); });
    o.cur = a.cur && !o.done[a.cur] ? a.cur : (b.cur && !o.done[b.cur] ? b.cur : null);
    o.best = {}; new Set([...Object.keys(a.best || {}), ...Object.keys(b.best || {})]).forEach(k => { o.best[k] = maxOf(a.best?.[k], b.best?.[k]); });
    o.pday = { ...(b.pday || {}), ...(a.pday || {}) };
    o.day = {}; new Set([...Object.keys(a.day || {}), ...Object.keys(b.day || {})]).forEach(k => { o.day[k] = maxOf(a.day?.[k], b.day?.[k]); });
    o.stats = {}; new Set([...Object.keys(a.stats || {}), ...Object.keys(b.stats || {})]).forEach(k => {
      const x = a.stats?.[k], y = b.stats?.[k];
      o.stats[k] = !x ? y : !y ? x : (y.t > x.t ? y : x);
    });
    // Treenit: kierrosten määrä ja paras tulos säilyvät suurimpina
    o.trained = {}; new Set([...Object.keys(a.trained || {}), ...Object.keys(b.trained || {})]).forEach(k => {
      const x = a.trained?.[k], y = b.trained?.[k];
      const n = r => r ? (r.n || 1) : 0, best = r => r ? (r.best ?? r.r ?? 0) : 0;
      o.trained[k] = { n: Math.max(n(x), n(y)), best: Math.max(best(x), best(y)), t: (x || y).t || 10, d: [x?.d, y?.d].filter(Boolean).sort().pop() };
    });
    o.tourDone = !!(a.tourDone || b.tourDone);
    // Keskeneräiset kierrokset: pidempi edistyminen voittaa
    o.part = {}; new Set([...Object.keys(a.part || {}), ...Object.keys(b.part || {})]).forEach(k => {
      const x = a.part?.[k], y = b.part?.[k];
      o.part[k] = !x ? y : !y ? x : (y.i > x.i ? y : x);
    });
    o.exams = {}; new Set([...Object.keys(a.exams || {}), ...Object.keys(b.exams || {})]).forEach(k => {
      const x = a.exams?.[k] || {}, y = b.exams?.[k] || {};
      o.exams[k] = { best: maxOf(x.best, y.best), n: maxOf(x.n, y.n) };
    });
    const sa = a.streak || { n: 0, last: '' }, sb = b.streak || { n: 0, last: '' };
    o.streak = sb.last > sa.last || (sb.last === sa.last && sb.n > sa.n) ? sb : sa;
    ['xp', 'combo', 'maxCombo', 'ear'].forEach(k => { o[k] = maxOf(a[k], b[k]); });
    return o;
  }

  // ---------- Siirtokoodi ----------
  function exportCode(S) {
    const json = JSON.stringify(progress(S));
    return 'SP1-' + btoa(unescape(encodeURIComponent(json)));
  }
  function importCode(code) {
    const c = String(code || '').trim().replace(/\s+/g, '');
    if (!c.startsWith('SP1-')) throw new Error('Koodi ei ole Sävelpolun siirtokoodi. Sen pitää alkaa merkeillä SP1-.');
    let data;
    try { data = JSON.parse(decodeURIComponent(escape(atob(c.slice(4))))); } catch (e) { throw new Error('Koodi on vaillinainen. Kopioi koko koodi uudelleen.'); }
    if (typeof data !== 'object' || !data) throw new Error('Koodista ei löytynyt edistymistä.');
    return data;
  }

  // ---------- Google-kirjautuminen (Firebase) ----------
  const cfg = window.SAVELPOLKU_FIREBASE || null;
  const SDK = '10.12.2';
  let user = null, pushT = null, onUser = () => { };
  const loadScript = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Kirjautumispalvelu ei latautunut.')); document.head.appendChild(s); });
  // Firebase (Google) ladataan vasta, kun käyttäjä kirjautuu tai on aiemmin kirjautunut tällä laitteella.
  // Kirjautumattoman käyttäjän selain ei siis ota yhteyttä Googleen.
  const AUTH_FLAG = 'savelpolku-auth';
  const flag = v => { try { if (v) localStorage.setItem(AUTH_FLAG, v); else localStorage.removeItem(AUTH_FLAG); } catch (e) { } };
  const hadAuth = () => { try { return !!localStorage.getItem(AUTH_FLAG); } catch (e) { return false; } };
  // Onko Firebasen omassa tallenteessa kirjautunut käyttäjä? (avaa tietokannan vain, jos se on jo olemassa)
  async function firebaseUserStored() {
    try {
      if (!indexedDB || !indexedDB.databases) return false;
      if (!(await indexedDB.databases()).some(d => d.name === 'firebaseLocalStorageDb')) return false;
      return await new Promise(res => {
        const rq = indexedDB.open('firebaseLocalStorageDb');
        rq.onerror = () => res(false);
        rq.onsuccess = () => {
          const db = rq.result;
          try {
            const k = db.transaction('firebaseLocalStorage', 'readonly').objectStore('firebaseLocalStorage').getAllKeys();
            k.onsuccess = () => { db.close(); res(k.result.some(x => String(x).startsWith('firebase:authUser:'))); };
            k.onerror = () => { db.close(); res(false); };
          } catch (e) { db.close(); res(false); }
        };
      });
    } catch (e) { return false; }
  }
  let ready = null;
  function boot() {
    if (ready) return ready;
    ready = (async () => {
      for (const m of ['app', 'auth', 'firestore']) await loadScript(`https://www.gstatic.com/firebasejs/${SDK}/firebase-${m}-compat.js`);
      firebase.initializeApp(cfg);
      firebase.auth().getRedirectResult().catch(() => { });
      firebase.auth().onAuthStateChanged(u => { user = u; flag(u ? '1' : null); onUser(u); });
    })();
    return ready;
  }
  async function init(cb) {
    onUser = cb;
    if (!cfg) return false;
    // Aiempi kirjautuminen tunnistetaan myös Firebasen omasta tallenteesta (ennen tätä versiota kirjautuneet)
    let had = hadAuth();
    if (!had) had = await firebaseUserStored();
    if (!had) return false;
    try { await boot(); return true; } catch (e) { console.warn(e); return false; }
  }
  async function signIn() {
    flag('pending');
    await boot();
    const p = new firebase.auth.GoogleAuthProvider();
    try { await firebase.auth().signInWithPopup(p); }
    catch (e) { if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') await firebase.auth().signInWithRedirect(p); else throw e; }
  }
  const signOut = () => { flag(null); return firebase.auth().signOut(); };
  // Poistaa käyttäjän tiedot pilvestä ja kirjaa ulos
  async function deleteCloud() {
    if (!user) return;
    clearTimeout(pushT); pending = null;
    await ref().delete();
    flag(null);
    await firebase.auth().signOut();
  }
  const ref = () => firebase.firestore().collection('users').doc(user.uid);
  async function pull() {
    if (!user) return null;
    const d = await ref().get();
    return d.exists ? d.data().progress || null : null;
  }
  let pending = null;
  function write(state) {
    return ref().set({ progress: progress(state), updated: firebase.firestore.FieldValue.serverTimestamp() })
      .catch(e => console.warn('Tallennus pilveen epäonnistui', e));
  }
  function push(S) {
    if (!user) return;
    pending = S;
    clearTimeout(pushT);
    pushT = setTimeout(() => { const st = pending; pending = null; if (st) write(st); }, 1200);
  }
  // Tallentaa heti, esim. kun sovellus suljetaan tai siirtyy taustalle
  function flush() {
    if (!user || !pending) return;
    clearTimeout(pushT);
    const st = pending; pending = null; write(st);
  }
  return { merge, exportCode, importCode, init, signIn, signOut, deleteCloud, pull, push, flush, get enabled() { return !!cfg; }, get user() { return user; } };
})();
