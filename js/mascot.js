/* Sävelpolku – oma hahmo "Kvintti": pullea ankkaopettaja, jolla pyöreät silmälasit,
   kuulokkeet, turkoosi kaulahuivi ja kapellimestarin tahtipuikko.
   mood: happy | think | wow | oops | party | sleep */
const Mascot = (() => {
  const INK = '#17140f';
  function svg(mood = 'happy', color = '#ffcf33', size = 96) {
    const dark = shade(color, -30), light = shade(color, 45);
    const BEAK = '#ff8a1f', BEAK_D = '#d9640a';
    const eyes = {
      happy: `<g class="m-blink"><circle cx="49" cy="41" r="5.2" fill="#fff"/><circle cx="67" cy="41" r="5.2" fill="#fff"/>
              <circle cx="50" cy="42" r="3" fill="${INK}"/><circle cx="68" cy="42" r="3" fill="${INK}"/>
              <circle cx="51" cy="40.8" r="1" fill="#fff"/><circle cx="69" cy="40.8" r="1" fill="#fff"/></g>`,
      think: `<g><circle cx="49" cy="41" r="5.2" fill="#fff"/><circle cx="67" cy="41" r="5.2" fill="#fff"/>
              <circle cx="51" cy="38.5" r="3" fill="${INK}"/><circle cx="69" cy="38.5" r="3" fill="${INK}"/>
              <path d="M42 29 q6 -4 12 0" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`,
      wow: `<g><circle cx="49" cy="41" r="6.2" fill="#fff"/><circle cx="67" cy="41" r="6.2" fill="#fff"/>
              <circle cx="49" cy="41" r="3.6" fill="${INK}"/><circle cx="67" cy="41" r="3.6" fill="${INK}"/>
              <circle cx="50.3" cy="39.7" r="1.2" fill="#fff"/><circle cx="68.3" cy="39.7" r="1.2" fill="#fff"/></g>`,
      oops: `<g><path d="M44.5 42 q4.5 -4.5 9 0 M62.5 42 q4.5 -4.5 9 0" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
              <path d="M86 30 q3 6 0 9 q-3 -3 0 -9z" fill="#7dd3fc"/></g>`,
      party: `<g><path d="M44 43 q5 -7 10 0 M62 43 q5 -7 10 0" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/></g>`,
      sleep: `<g><path d="M44.5 41 q4.5 3.5 9 0 M62.5 41 q4.5 3.5 9 0" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`,
    }[mood] || '';
    // nokka: kiinni / auki
    const open = mood === 'party' || mood === 'wow';
    const beak = open
      ? `<path d="M44 53 q14 -7 28 0 q-2 4 -14 4 q-12 0 -14 -4z" fill="${BEAK}" stroke="${BEAK_D}" stroke-width="1.2"/>
         <path d="M47 58 q11 12 22 0 q-11 3 -22 0z" fill="#7a1f3d"/>
         <path d="M51 61 q7 4 14 0" fill="#ff7aa8"/>
         <path d="M46 58 q12 14 24 0" fill="none" stroke="${BEAK_D}" stroke-width="1.4"/>
         <path d="M45 57.5 q13 3 26 0" fill="${BEAK}" opacity=".0"/>`
      : mood === 'oops'
        ? `<path d="M44 54 q14 -6 28 0 q-3 7 -14 7 q-11 0 -14 -7z" fill="${BEAK}" stroke="${BEAK_D}" stroke-width="1.2"/>
           <path d="M47 57.5 q4 -2 7 0 q4 2 7 0 q4 -2 7 0" stroke="${BEAK_D}" stroke-width="1.4" fill="none"/>`
        : `<path d="M44 54 q14 -6 28 0 q-3 7 -14 7 q-11 0 -14 -7z" fill="${BEAK}" stroke="${BEAK_D}" stroke-width="1.2"/>
           <path d="M47 57 q11 ${mood === 'think' ? 0 : 3} 22 0" stroke="${BEAK_D}" stroke-width="1.4" fill="none"/>
           <circle cx="53" cy="54" r=".9" fill="${BEAK_D}"/><circle cx="63" cy="54" r=".9" fill="${BEAK_D}"/>`;
    const extra = {
      party: `<g class="m-spark"><path d="M8 30 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3z" fill="#e6bb4f"/>
              <text x="96" y="100" font-size="16" fill="#d4b06a" class="mus">♪</text><text x="8" y="70" font-size="14" fill="#9b2f3b" class="mus">♫</text></g>`,
      think: `<g class="m-float"><circle cx="96" cy="22" r="3" fill="var(--muted)"/><circle cx="104" cy="12" r="5" fill="var(--muted)"/><text x="100.5" y="16" font-size="9" font-weight="800" fill="var(--bg)">?</text></g>`,
      sleep: `<text x="92" y="26" font-size="14" font-weight="800" fill="var(--muted)" class="m-float">z</text><text x="102" y="14" font-size="11" font-weight="800" fill="var(--muted)" class="m-float">z</text>`,
      wow: `<g class="m-spark"><path d="M14 32 l4 -2 M12 42 h5 M16 22 l3 3" stroke="#e6bb4f" stroke-width="2.6" stroke-linecap="round"/></g>`,
    }[mood] || '';
    return `<svg class="mascot m-${mood}" width="${size}" height="${size}" viewBox="0 0 120 120" aria-hidden="true">
      <ellipse cx="58" cy="114" rx="30" ry="4.5" fill="#000" opacity=".18"/>
      <g class="m-body">
        <!-- räpylät -->
        <path d="M38 104 l-8 8 h20 z" fill="${BEAK}" stroke="${BEAK_D}" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M70 104 l-6 8 h20 z" fill="${BEAK}" stroke="${BEAK_D}" stroke-width="1.6" stroke-linejoin="round"/>
        <!-- vartalo -->
        <ellipse cx="58" cy="82" rx="33" ry="27" fill="${color}"/>
        <ellipse cx="58" cy="88" rx="21" ry="17" fill="${light}" opacity=".7"/>
        <!-- vasen siipi -->
        <path class="m-arm-l" d="M27 76 q-14 8 -8 24 q8 -4 12 -12z" fill="${dark}"/>
        <!-- oikea siipi + tahtipuikko -->
        <g class="m-arm-r">
          <line x1="94" y1="74" x2="112" y2="46" stroke="#5b3a1e" stroke-width="3" stroke-linecap="round"/>
          <line x1="104" y1="58.5" x2="112" y2="46" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M88 72 q14 -6 12 10 q-6 6 -14 2z" fill="${dark}"/>
        </g>
        <!-- kaulahuivi -->
        <path d="M34 63 q24 12 48 0 l2 7 q-26 13 -52 0z" fill="#4f8f6a" stroke="#3a6e51" stroke-width="1.2"/>
        <path d="M70 68 l6 16 l-8 -2 l-4 -12z" fill="#4f8f6a" stroke="#3a6e51" stroke-width="1.2"/>
        <!-- pää -->
        <circle cx="58" cy="42" r="25" fill="${color}"/>
        <path d="M54 18 q-4 -10 4 -12 q-2 6 2 10 q2 -8 9 -6 q-6 3 -5 9z" fill="${color}" stroke="${dark}" stroke-width="1.2"/>
        <!-- posket -->
        <ellipse cx="40" cy="51" rx="4.5" ry="2.8" fill="#ff7aa8" opacity=".55"/>
        <ellipse cx="76" cy="51" rx="4.5" ry="2.8" fill="#ff7aa8" opacity=".55"/>
        ${eyes}
        <!-- silmälasit -->
        <circle cx="49" cy="41" r="9" fill="none" stroke="${INK}" stroke-width="2.4"/>
        <circle cx="67" cy="41" r="9" fill="none" stroke="${INK}" stroke-width="2.4"/>
        <path d="M56 40 q2 -2 4 0" stroke="${INK}" stroke-width="2.2" fill="none"/>
        ${beak}
        <!-- kuulokkeet -->
        <path d="M33 44 C30 8, 86 8, 83 44" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        <rect x="27" y="36" width="11" height="19" rx="5.5" fill="#9b2f3b" stroke="${INK}" stroke-width="2.4"/>
        <rect x="78" y="36" width="11" height="19" rx="5.5" fill="#9b2f3b" stroke="${INK}" stroke-width="2.4"/>
      </g>
      ${extra}
    </svg>`;
  }
  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = v => Math.max(0, Math.min(255, Math.round(v + (pct / 100) * (pct > 0 ? 255 - v : v))));
    return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  const CHEER = ['Mahtavaa!', 'Just noin!', 'Täysosuma!', 'Olet liekeissä!', 'Soi kuin sinfonia!', 'Bravo!', 'Nappiin!', 'Kvaak-tastista!'];
  const OOPS = ['Melkein! Katso selitys 👇', 'Ei haittaa, tästä opitaan.', 'Hups! Katsotaan miksi.', 'Lähellä oli!'];
  return { svg, CHEER, OOPS };
})();
