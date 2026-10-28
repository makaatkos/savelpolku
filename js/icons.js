/* Sävelpolku – piirretyt kuvakkeet. Jokainen kuva näyttää aiheen ydinasian (metronomi = rytmi,
   nuottiportaat = asteikko, nuottilumiukko = kolmisointu). Värit ovat kiinteät, jotta kuva näyttää
   samalta vaaleassa ja tummassa teemassa (tausta on aina vaalea laatta). */
const ICONS = (() => {
  const I = '#17140f', Y = '#ffcf33', P = '#9b2f3b', G = '#4f8f6a', O = '#ff8a1f', W = '#ffffff', L = '#c9bfa6';
  const svg = (body, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 48 48" aria-hidden="true">${body}</svg>`;
  const head = (x, y, fill = I, rx = 4.6, ry = 3.4) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(-20 ${x} ${y})" fill="${fill}" stroke="${I}" stroke-width="1.4"/>`;
  const lines = (ys, x1 = 4, x2 = 44) => ys.map(y => `<line x1="${x1}" x2="${x2}" y1="${y}" y2="${y}" stroke="${L}" stroke-width="1.4"/>`).join('');
  const txt = (x, y, s, size = 8, fill = I) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Bricolage Grotesque','Segoe UI',sans-serif" font-weight="800" font-size="${size}" fill="${fill}">${s}</text>`;

  const A = {
    // Rytmi: metronomi ja kahdeksasosanuotti
    rytmi: svg(`
      <path d="M16 41 L21.5 7 h5 L32 41 z" fill="${P}" stroke="${I}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M19 33 h10" stroke="${I}" stroke-width="1.4"/>
      <rect x="12" y="39" width="24" height="5" rx="2.5" fill="${I}"/>
      <line x1="24" y1="33" x2="34" y2="10" stroke="${I}" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="29.5" y="16" width="7" height="5" rx="1.5" transform="rotate(23 33 18.5)" fill="${Y}" stroke="${I}" stroke-width="1.5"/>
      <circle cx="24" cy="33" r="2.2" fill="${I}"/>
      ${head(8, 20, I, 3.2, 2.4)}<path d="M10.8 19.5 V8 q4 2 5 6.5" stroke="${I}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`),
    // Sävelten nimet: nuotti, jolla on nimilappu
    nimet: svg(`
      ${lines([16, 23, 30, 37])}
      ${head(14, 33.5)}<line x1="18.2" y1="32.5" x2="18.2" y2="10" stroke="${I}" stroke-width="2"/>
      <path d="M18.2 11 Q24 9 27 15" stroke="${I}" stroke-width="1.4" fill="none"/>
      <rect x="25" y="13" width="19" height="13" rx="3.5" transform="rotate(8 34 19.5)" fill="${Y}" stroke="${I}" stroke-width="1.8"/>
      <circle cx="28" cy="17.5" r="1.3" fill="${I}"/>
      ${txt(36, 23.5, 'c¹', 9)}`),
    // Asteikot: portaat, joilla nuotit nousevat
    asteikot: svg(`
      <path d="M4 44 V36 H14 V28 H24 V20 H34 V12 H44 V44 Z" fill="${G}" stroke="${I}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M14 36 V44 M24 28 V44 M34 20 V44" stroke="${I}" stroke-width="1" opacity=".35"/>
      ${head(9, 31.5)}${head(19, 23.5)}${head(29, 15.5)}${head(39, 7.5, Y)}`),
    // Intervallit: kaksi nuottia ja mittakaari välissä
    intervallit: svg(`
      ${lines([12, 19, 26, 33, 40])}
      ${head(12, 36.5)}${head(32, 15.5)}
      <path d="M13 30 Q13 16 26 15" stroke="${P}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M22.5 11.8 L27 15 L22.6 18.4" stroke="${P}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="25" y="30" width="19" height="12" rx="6" fill="${Y}" stroke="${I}" stroke-width="1.8"/>
      ${txt(34.5, 39, 's3', 8.5)}`),
    // Kolmisoinnut: lumiukko kolmesta nuotinpäästä
    kolmisoinnut: svg(`
      <ellipse cx="24" cy="37" rx="10" ry="7" fill="${W}" stroke="${I}" stroke-width="2"/>
      <ellipse cx="24" cy="25" rx="7.6" ry="5.6" fill="${W}" stroke="${I}" stroke-width="2"/>
      <ellipse cx="24" cy="15" rx="6" ry="4.6" fill="${W}" stroke="${I}" stroke-width="2"/>
      <rect x="19" y="3" width="10" height="7" rx="1" fill="${I}"/><rect x="16" y="9.5" width="16" height="2.4" rx="1.2" fill="${I}"/>
      <circle cx="22" cy="14.5" r="1" fill="${I}"/><circle cx="26" cy="14.5" r="1" fill="${I}"/>
      <path d="M24 16.2 l5.5 1.2 l-5.5 1.1 z" fill="${O}"/>
      <path d="M17.5 20 q6.5 3 13 0 l0.6 2.4 q-7.2 3 -14.2 0z" fill="${P}"/>
      <path d="M16.5 25 L8 19 M31.5 25 L40 19" stroke="#8a5a2b" stroke-width="2" stroke-linecap="round"/>
      <circle cx="24" cy="25" r="1.2" fill="${I}"/><circle cx="24" cy="35" r="1.2" fill="${I}"/>`),
    // Sointuasteet: temppeli, jonka pilarit ovat asteet I, IV, V
    asteet: svg(`
      <path d="M5 16 L24 5 L43 16 Z" fill="${Y}" stroke="${I}" stroke-width="2" stroke-linejoin="round"/>
      <rect x="5" y="16" width="38" height="3.5" fill="${I}"/>
      ${[8, 20, 32].map(x => `<rect x="${x}" y="19.5" width="8" height="18.5" fill="${W}" stroke="${I}" stroke-width="1.6"/>`).join('')}
      ${txt(12, 31.5, 'I', 7.5)}${txt(24, 31.5, 'IV', 7)}${txt(36, 31.5, 'V', 7.5)}
      <rect x="3" y="38" width="42" height="5.5" rx="1.5" fill="${I}"/>`),
    // Septimisoinnut: neljän nuotin pino ja 7-merkki
    septimit: svg(`
      ${lines([10, 17, 24, 31, 38], 4, 32)}
      ${head(16, 38)}${head(16, 31)}${head(16, 24)}${head(16, 17)}
      <circle cx="35" cy="16" r="9" fill="${P}" stroke="${I}" stroke-width="1.8"/>
      ${txt(35, 20.5, '7', 13, W)}`),
    // Transponointi: hissi, jossa nuotti, ja nuolet ylös ja alas
    transponointi: svg(`
      <rect x="5" y="5" width="27" height="38" rx="3" fill="#eef5ef" stroke="${I}" stroke-width="2"/>
      <line x1="18.5" y1="5" x2="18.5" y2="43" stroke="${I}" stroke-width="1.2" opacity=".35"/>
      ${head(15, 28)}<line x1="19.2" y1="27" x2="19.2" y2="14" stroke="${I}" stroke-width="2"/>
      <path d="M38 6 l6 8 h-12 z" fill="${Y}" stroke="${I}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M38 42 l6 -8 h-12 z" fill="${P}" stroke="${I}" stroke-width="1.6" stroke-linejoin="round"/>
      <line x1="38" y1="16" x2="38" y2="32" stroke="${I}" stroke-width="1.6" stroke-dasharray="2 2.4"/>`),
    // Säveltäjät: nuottiarkki ja sulkakynä
    saveltajat: svg(`
      <g transform="rotate(-7 20 24)"><rect x="6" y="6" width="26" height="35" rx="2" fill="${W}" stroke="${I}" stroke-width="2"/>
      ${[12, 15, 18].map(y => `<line x1="9" x2="29" y1="${y}" y2="${y}" stroke="${L}" stroke-width="1"/>`).join('')}
      ${[26, 29, 32].map(y => `<line x1="9" x2="29" y1="${y}" y2="${y}" stroke="${L}" stroke-width="1"/>`).join('')}
      ${head(13, 16.5, I, 2.2, 1.6)}${head(19, 13.5, I, 2.2, 1.6)}${head(25, 30.5, I, 2.2, 1.6)}${head(14, 28, I, 2.2, 1.6)}</g>
      <path d="M44 4 C34 8 28 18 27 30 C31 24 38 18 44 4 z" fill="${P}" stroke="${I}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M27 30 L24 40" stroke="${I}" stroke-width="2" stroke-linecap="round"/>
      <path d="M41 9 C35 15 31 21 28.5 27" stroke="${I}" stroke-width="1" fill="none"/>`),
    // Kuuntelu: kuulokkeet ja nuotti
    kuulo: svg(`
      <path d="M9 30 V24 a15 15 0 0 1 30 0 V30" stroke="${I}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <rect x="5" y="26" width="9" height="15" rx="4.5" fill="${P}" stroke="${I}" stroke-width="2"/>
      <rect x="34" y="26" width="9" height="15" rx="4.5" fill="${P}" stroke="${I}" stroke-width="2"/>
      ${head(21, 34, Y, 3.6, 2.7)}<path d="M24.3 33.4 V20 q4 2 4.6 6" stroke="${I}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`),
    // Taitotesti: kirjoitusalusta ja rasti
    koe: svg(`
      <rect x="8" y="7" width="30" height="37" rx="3" fill="${W}" stroke="${I}" stroke-width="2"/>
      <rect x="16" y="3.5" width="14" height="7" rx="2" fill="${Y}" stroke="${I}" stroke-width="1.8"/>
      ${[17, 25, 33].map(y => `<path d="M13 ${y} l2.5 2.5 l4.5 -5" stroke="${G}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><line x1="23" x2="33" y1="${y}" y2="${y}" stroke="${L}" stroke-width="2" stroke-linecap="round"/>`).join('')}
      <path d="M40 30 l3 3 l-11 11 l-4 1 l1 -4 z" fill="${P}" stroke="${I}" stroke-width="1.5" stroke-linejoin="round"/>`),
    // Pikatreeni: sekuntikello ja salama
    pika: svg(`
      <circle cx="24" cy="27" r="16" fill="${W}" stroke="${I}" stroke-width="2.2"/>
      <rect x="20" y="4" width="8" height="5" rx="1.5" fill="${I}"/><line x1="24" y1="9" x2="24" y2="11" stroke="${I}" stroke-width="2.2"/>
      <path d="M26 15 L18 29 h6 l-2 11 l9 -15 h-6 z" fill="${Y}" stroke="${I}" stroke-width="1.6" stroke-linejoin="round"/>`),
  };
  // Treenityypit käyttävät aiheensa kuvaa
  const GEN = { nimi: 'nimet', piirra: 'nimet', arvot: 'rytmi', tahti: 'rytmi', savellaji: 'asteikot', etumerkit: 'asteikot', kvintti: 'asteikot', asteikko: 'asteikot', transpo: 'transponointi', sointu: 'kolmisoinnut', muodosta: 'kolmisoinnut', systeemi: 'kolmisoinnut', aste: 'asteet', kaannos: 'asteet', intervalli: 'intervallit', rakenna: 'intervallit', kaanteis: 'intervallit', septimi: 'septimit', saveltaja: 'saveltajat', kuulo: 'kuulo' };

  // Alavalikon viivakuvakkeet (värit tulevat teemasta)
  const line = d => `<svg class="tabico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const TAB = {
    home: line('<path d="M3 11 L12 4 L21 11"/><path d="M5 10 V20 H19 V10"/><path d="M10 20 V14 H14 V20"/>'),
    polut: line('<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18 H14 a3.5 3.5 0 0 0 0 -7 H10 a3.5 3.5 0 0 1 0 -7 H15.5"/>'),
    treeni: line('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>'),
    koe: line('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4 V2.5 H15 V4"/><path d="M8.5 12 l2.2 2.2 l4.3 -4.5"/>'),
    tyokalut: line('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5 V13 M12 5 V13 M16 5 V13"/><path d="M8 13 V19 M12 13 V19 M16 13 V19" opacity=".5"/>'),
    sanasto: line('<path d="M4 5.5 A2.5 2.5 0 0 1 6.5 3 H20 V18 H6.5 A2.5 2.5 0 0 0 4 20.5 Z"/><path d="M4 20.5 A2.5 2.5 0 0 1 6.5 18 H20 V21 H6.5"/><path d="M9 8 H15 M9 11.5 H13"/>'),
    merkit: line('<circle cx="12" cy="14" r="6"/><path d="M8.5 9.2 L6 3 H10 L12 7.8 L14 3 H18 L15.5 9.2"/><path d="M12 11.5 l.9 1.8 2 .3 -1.45 1.4 .35 2 -1.8 -.95 -1.8 .95 .35 -2 -1.45 -1.4 2 -.3z" fill="currentColor" stroke="none"/>'),
  };

  // Merkit: mitali nauhoineen, keskellä aiheen pieni symboli tai luku
  function medal(center, color = Y, got = true) {
    return `<svg class="medal" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M20 4 L28 26 L32 22 L36 26 L44 4 Z" fill="${got ? P : '#bdb3a0'}" stroke="${I}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M32 4 V22" stroke="${I}" stroke-width="1.2" opacity=".4"/>
      <circle cx="32" cy="40" r="19" fill="${got ? color : '#e3dccd'}" stroke="${I}" stroke-width="2.4"/>
      <circle cx="32" cy="40" r="14" fill="none" stroke="${I}" stroke-width="1.2" stroke-dasharray="2 3" opacity=".5"/>
      <text x="32" y="${center.length > 2 ? 45 : 47}" text-anchor="middle" font-family="'Bricolage Grotesque','Segoe UI',sans-serif" font-weight="800" font-size="${center.length > 3 ? 12 : center.length > 2 ? 15 : 19}" fill="${I}">${center}</text>
    </svg>`;
  }
  return { ...A, GEN, TAB, medal, gen: id => A[GEN[id]] || A.rytmi };
})();
