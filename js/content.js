/* Sävelpolku – oppituntien sisältö. */

const N = (n, txt) => `<span class="nchip" style="--c:${T.color(n)}">${txt || T.name(n)}</span>`;
const K = s => `<span class="kw">${s}</span>`;      // avainsana
const BIG = s => `<div class="bigfact">${s}</div>`;

const ERAS = [
  { n: 'Renessanssi', y: '1450–1600', c: '#a78bfa' },
  { n: 'Barokki', y: '1600–1750', c: '#f59e0b' },
  { n: 'Klassismi', y: '1750–1820', c: '#38bdf8' },
  { n: 'Romantiikka', y: '1800–1890', c: '#f472b6' },
  { n: 'Impressionismi', y: '1890–1920', c: '#34d399' },
  { n: 'Ekspressionismi', y: '1910–1930', c: '#f87171' },
  { n: 'Uusklassismi', y: '1920–1940', c: '#facc15' },
  { n: 'The Beatles', y: '1962–1970', c: '#94a3b8' },
];
const COMPOSERS = [
  { n: 'Giovanni Pierluigi da Palestrina', s: 'Palestrina', y: '1525–1594', e: 'Renessanssi', m: 'Italia' },
  { n: 'Orlando di Lasso', s: 'Lasso', y: '1532–1594', e: 'Renessanssi', m: 'Flanderi' },
  { n: 'Johann Sebastian Bach', s: 'Bach', y: '1685–1750', e: 'Barokki', m: 'Saksa' },
  { n: 'Georg Friedrich Händel', s: 'Händel', y: '1685–1759', e: 'Barokki', m: 'Saksa / Englanti' },
  { n: 'Antonio Vivaldi', s: 'Vivaldi', y: '1678–1741', e: 'Barokki', m: 'Italia' },
  { n: 'Georg Philipp Telemann', s: 'Telemann', y: '1681–1767', e: 'Barokki', m: 'Saksa' },
  { n: 'Franz Joseph Haydn', s: 'Haydn', y: '1732–1809', e: 'Klassismi', m: 'Itävalta' },
  { n: 'Wolfgang Amadeus Mozart', s: 'Mozart', y: '1756–1791', e: 'Klassismi', m: 'Itävalta' },
  { n: 'Ludwig van Beethoven', s: 'Beethoven', y: '1770–1827', e: 'Klassismi', m: 'Saksa' },
  { n: 'Franz Peter Schubert', s: 'Schubert', y: '1797–1828', e: 'Romantiikka', m: 'Itävalta' },
  { n: 'Robert Schumann', s: 'Schumann', y: '1810–1856', e: 'Romantiikka', m: 'Saksa' },
  { n: 'Niccolò Paganini', s: 'Paganini', y: '1782–1840', e: 'Romantiikka', m: 'Italia' },
  { n: 'Frédéric Chopin', s: 'Chopin', y: '1810–1849', e: 'Romantiikka', m: 'Puola' },
  { n: 'Franz Liszt', s: 'Liszt', y: '1811–1886', e: 'Romantiikka', m: 'Unkari' },
  { n: 'Johannes Brahms', s: 'Brahms', y: '1833–1897', e: 'Romantiikka', m: 'Saksa' },
  { n: 'Edvard Grieg', s: 'Grieg', y: '1843–1907', e: 'Romantiikka', m: 'Norja' },
  { n: 'Jean Sibelius', s: 'Sibelius', y: '1865–1957', e: 'Romantiikka', m: 'Suomi' },
  { n: 'Pjotr Iljitš Tšaikovski', s: 'Tšaikovski', y: '1840–1893', e: 'Romantiikka', m: 'Venäjä' },
  { n: 'Modest Musorgski', s: 'Musorgski', y: '1839–1881', e: 'Romantiikka', m: 'Venäjä' },
  { n: 'Erik Satie', s: 'Satie', y: '1866–1925', e: 'Impressionismi', m: 'Ranska' },
  { n: 'Claude Debussy', s: 'Debussy', y: '1862–1918', e: 'Impressionismi', m: 'Ranska' },
  { n: 'Maurice Ravel', s: 'Ravel', y: '1875–1937', e: 'Impressionismi', m: 'Ranska' },
  { n: 'Arnold Schönberg', s: 'Schönberg', y: '1874–1951', e: 'Ekspressionismi', m: 'Itävalta' },
  { n: 'Sergei Prokofjev', s: 'Prokofjev', y: '1891–1953', e: 'Uusklassismi', m: 'Venäjä' },
  { n: 'John Lennon', s: 'Lennon', y: '1940–1980', e: 'The Beatles', m: 'Englanti' },
  { n: 'Paul McCartney', s: 'McCartney', y: '1942–', e: 'The Beatles', m: 'Englanti' },
  { n: 'George Harrison', s: 'Harrison', y: '1943–2001', e: 'The Beatles', m: 'Englanti' },
  { n: 'Ringo Starr', s: 'Starr', y: '1940–', e: 'The Beatles', m: 'Englanti' },
];

function pyramidHTML(rows) {
  return `<div class="pyramid">${rows.map(r => `<div class="pyr-row"><span class="pyr-lab">${r[1]}</span>${R.rhythm(r[0])}</div>`).join('')}</div>`;
}
function tableHTML(head, rows, cls = '') {
  return `<table class="tbl ${cls}"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
function stepsHTML(steps) { // K K P ... visuaalinen askelrivi
  return `<div class="stepsrow">${steps.map(s => `<span class="stp ${s === 'P' ? 'half' : s === 'Y' ? 'aug' : 'whole'}">${s === 'Y' ? '1½' : s === 'P' ? '½' : '1'}</span>`).join('')}</div>`;
}
function timelineHTML() {
  return `<div class="timeline">${ERAS.map(e => `<div class="era" style="--c:${e.c}"><b>${e.n}</b><span>${e.y}</span><small>${COMPOSERS.filter(c => c.e === e.n).map(c => c.s).join(', ')}</small></div>`).join('')}</div>`;
}
const sc = (tonic, type, clef = 'g', extra = {}) => ({ staff: { clef, notes: T.scale(tonic, type), names: 'fi', forceAcc: true, ...extra } });
const tri = (root, type) => T.chord(root, type);

const PATHS = [
/* ====================================================================================== */
{
  id: 'osa1', title: 'Osa 1', sub: '', color: '#ffd23f', icon: '',
  intro: 'Rytmit, oktaavialat, asteikot 4 etumerkkiin asti, kolmisoinnut, sointuasteet ja intervallit.',
  modules: [
  { id: 'rytmi', title: 'Rytmi', desc: 'Nuottipyramidi, nuotit ja tauot, tahtiviivat', lessons: [
    { id: 'pyramidi', title: 'Nuottipyramidi', sub: 'Miten nuottiarvot jakautuvat', steps: [
      { t: 'Nuottiarvot ovat kuin pizza', x: `Kokonuotti on koko pizza. Kun se jaetaan kahtia, saadaan kaksi ${K('puolinuottia')}. Kun ne jaetaan taas kahtia, saadaan neljä ${K('neljäsosanuottia')}… ja niin edelleen.`, v: { html: pyramidHTML([['w', 'kokonuotti'], ['h h', '2 puolinuottia'], ['q q q q', '4 neljäsosaa'], ['[e e] [e e] [e e] [e e]', '8 kahdeksasosaa']]) } },
      { t: 'Iskuina laskettuna', x: `4/4-tahdissa neljäsosanuotti on <b>1 isku</b>. Silloin:`, v: { html: tableHTML(['Nuotti', 'Nimi', 'Iskuja'], [[R.rhythm('w'), 'kokonuotti', '4'], [R.rhythm('h'), 'puolinuotti', '2'], [R.rhythm('q'), 'neljäsosanuotti', '1'], [R.rhythm('e'), 'kahdeksasosanuotti', '½'], [R.rhythm('s'), 'kuudestoistaosanuotti', '¼']], 'rtbl') } },
      { q: 'Montako kahdeksasosanuottia mahtuu yhteen puolinuottiin?', o: ['2', '4', '8'], a: 1, e: 'Puolinuotti = 2 neljäsosaa = 4 kahdeksasosaa.' },
      { t: 'Piste pidentää', x: `Piste nuotin perässä lisää nuottiin <b>puolet sen omasta arvosta</b>.<br>Pisteellinen puolinuotti = 2 + 1 = <b>3 iskua</b>.<br>Pisteellinen neljäsosa = 1 + ½ = <b>1½ iskua</b>.`, v: { rhythm: 'h. q.', beats: true }, play: { rhythm: 'h. q. e', bpm: 80 } },
      { q: 'Montako iskua on pisteellinen puolinuotti (kun neljäsosa = 1 isku)?', v: { rhythm: 'h.' }, o: ['2', '2½', '3', '4'], a: 2, e: 'Puolinuotti 2 + piste (puolet = 1) = 3.' },
      { t: 'Kuuntele rytmiä', x: 'Paina <b>Soita</b>. Ensin tulee neljä laskuiskua, sitten rytmi. Seuraa nuotteja kuunnellessasi.', v: { rhythm: 'q [e e] h | q q [e e] q', beats: true, time: '4/4' }, play: { rhythm: 'q [e e] h q q [e e] q', bpm: 84 } },
      { q: 'Mikä on suurin: kokonuotti, pisteellinen puolinuotti vai kaksi neljäsosaa?', o: ['kokonuotti (4)', 'pisteellinen puolinuotti (3)', 'kaksi neljäsosaa (2)'], a: 0, e: 'Kokonuotti on 4 iskua, mikä on enemmän kuin 3 tai 2.' },
    ] },
    { id: 'nuotit-tauot', title: 'Nuotit ja tauot', sub: 'Jokaisella nuotilla on taukopari', steps: [
      { t: 'Jokaisella nuotilla on tauko-kaksonen', x: `Tauko on hiljaisuus, joka kestää yhtä kauan kuin vastaava nuotti.`, v: { html: tableHTML(['Nuotti', 'Tauko', 'Nimi'], [[R.rhythm('w'), R.rhythm('rw'), 'koko'], [R.rhythm('h'), R.rhythm('rh'), 'puoli'], [R.rhythm('q'), R.rhythm('rq'), 'neljäsosa'], [R.rhythm('e'), R.rhythm('re'), 'kahdeksasosa'], [R.rhythm('s'), R.rhythm('rs'), 'kuudestoistaosa'], [R.rhythm('t'), R.rhythm('rt'), '32-osa']], 'rtbl') } },
      { t: 'Koko- ja puolitauko: hattu vai hattu päässä?', x: `Ne näyttävät samalta, mutta paikka ratkaisee:<br>• ${K('Kokotauko')} <b>roikkuu</b> viivan alla (raskas, kuin painava laukku).<br>• ${K('Puolitauko')} <b>istuu</b> viivan päällä (kevyt, kuin hattu).`, v: { rhythm: 'rw | rh rh', time: '' } },
      { q: 'Mikä tauko tässä on?', v: { rhythm: 'rq' }, o: ['puolitauko', 'neljäsosatauko', 'kahdeksasosatauko'], a: 1, e: 'Mutkikas "salama" on neljäsosatauko.' },
      { t: 'Koukut kertovat arvon', x: `Kahdeksasosanuotissa on yksi koukku, kuudestoistaosanuotissa kaksi ja 32-osanuotissa kolme. Kun samanlaisia nuotteja on peräkkäin, koukut yhdistetään viivoiksi.<br>Tauoissa sama: kahdeksasosatauossa yksi koukku, kuudestoistaosatauossa kaksi ja 32-osatauossa kolme.`, v: { rhythm: 'e s t | [e e] [s s s s]' } },
      { t: 'Pisteelliset nuotit = nuotti + puolet', x: `Pisteellisen nuotin voi kirjoittaa <b>kahtena sidottuna nuottina</b>.<br>• pisteellinen kokonuotti = koko + puoli<br>• pisteellinen puoli = puoli + neljäsosa<br>• pisteellinen neljäsosa = neljäsosa + kahdeksasosa<br>• pisteellinen kahdeksasosa = kahdeksasosa + kuudestoistaosa`, v: [{ rhythm: 'h. | h _q', beats: true }, { rhythm: 'q. | q _e', beats: true }] },
      { q: 'Pisteellinen kahdeksasosanuotti = ?', o: ['kahdeksasosa + kahdeksasosa', 'kahdeksasosa + kuudestoistaosa', 'neljäsosa + kahdeksasosa'], a: 1, e: 'Kahdeksasosan puolikas on kuudestoistaosa.' },
      { t: 'Pisteelliset tauot toimivat samoin', x: 'Pisteellinen puolitauko = puolitauko + neljäsosatauko. Pisteellinen neljäsosatauko = neljäsosatauko + kahdeksasosatauko.', v: { rhythm: 'rh. | rh rq' } },
      { q: 'Mikä on 32-osanuotti?', v: { rhythm: 't' }, o: ['nuotti, jossa on 3 koukkua', 'nuotti, jossa on 2 koukkua', 'nuotti, jossa on piste'], a: 0, e: '3 koukkua = 32-osa (kolmaskymmenestoinen osa kokonuotista).' },
    ] },
    { id: 'tahtiviivat', title: 'Tahtiviivat', sub: 'Jaa rytmi tahteihin', steps: [
      { t: 'Tahtiosoitus kertoo reseptin', x: `${K('Ylempi numero')} = montako iskua tahdissa on.<br>${K('Alempi numero')} = minkä arvoinen nuotti on yksi isku (4 = neljäsosa, 8 = kahdeksasosa, 2 = puolinuotti).`, v: { html: `<div class="tsdemo"><div class="tsbig"><span>3</span><span>4</span></div><div>→ <b>3</b> kpl <b>neljäsosia</b> joka tahdissa</div></div>` } },
      { t: 'Erikoismerkit 𝄴 ja 𝄵', x: `${K('C')} = 4/4-tahtilaji.<br>${K('C viivalla')} = 2/2-tahtilaji eli <i>alla breve</i>: isku on puolinuotti.`, v: { html: `<div class="tsdemo"><span class="mus" style="font-size:46px">𝄴</span> = 4/4 &nbsp;&nbsp; <span class="mus" style="font-size:46px">𝄵</span> = 2/2</div>` } },
      { t: 'Näin lisäät tahtiviivat', x: `1. Katso tahtiosoitus.<br>2. Laske nuottien arvoja yhteen vasemmalta.<br>3. Kun summa täyttyy (esim. 3 iskua 3/4-tahdissa) → <b>tahtiviiva</b>.<br>4. Aloita laskeminen alusta.`, v: { rhythm: 'q q q | h q | [e e] [e e] q | h. ||', time: '3/4', beats: true } },
      { q: '2/4-tahti. Mihin kohtaan tulee ensimmäinen tahtiviiva?', v: { rhythm: 'q [e e] q q', time: '2/4', nums: true }, o: ['nuotin 1 jälkeen', 'nuotin 3 jälkeen', 'nuotin 4 jälkeen'], a: 1, e: 'Neljäsosa (1) + kaksi kahdeksasosaa (1) = 2 iskua, joten tahti on täynnä nuotin 3 jälkeen.' },
      { t: '6/8-tahti: kahdeksasosat iskuina', x: `Alempi numero 8 tarkoittaa, että kahdeksasosa on yksi isku. Tahtiin mahtuu <b>6 kahdeksasosaa</b>, mikä vastaa esimerkiksi kahta pisteellistä neljäsosaa tai pisteellistä puolinuottia.`, v: { rhythm: '[e e e] [e e e] | q. q. | q e q e | h. ||', time: '6/8' }, play: { rhythm: '[e e e] [e e e] q. q. q e q e h.', bpm: 72, beats: 6, unit: 0.5 } },
      { q: 'Montako kahdeksasosaa mahtuu 3/8-tahtiin?', o: ['3', '6', '8'], a: 0, e: 'Ylempi numero 3, alempi numero 8 → kolme kahdeksasosaa.' },
      { q: '4/4-tahti: tahdissa on puolinuotti ja neljäsosanuotti. Mitä puuttuu?', o: ['neljäsosanuotti', 'puolinuotti', 'kahdeksasosanuotti'], a: 0, e: '2 + 1 = 3 iskua, joten puuttuu 1 isku = neljäsosa.' },
    ] },
  ] },
  { id: 'nimet', title: 'Sävelten nimet', desc: 'Oktaavialat ja nuotin nimi', lessons: [
    { id: 'oktaavialat', title: 'Oktaavialat', sub: 'Saman sävelen eri kerrokset', steps: [
      { t: 'Piano on kerrostalo', x: `Sävelnimet <b>c d e f g a h</b> toistuvat koko ajan. Jotta tiedetään, missä kerroksessa ollaan, käytetään ${K('oktaavialoja')}. Jokainen oktaaviala alkaa <b>c:stä</b> ja loppuu <b>h:hon</b>.`, v: { piano: { from: 'C3', oct: 3, marks: [{ n: 'C3', lab: 'c' }, { n: 'C4', lab: 'c¹' }, { n: 'C5', lab: 'c²' }, { n: 'C6', lab: 'c³' }] } } },
      { t: 'Kerrosten nimet', x: 'Alhaalta ylös:', v: { html: tableHTML(['Oktaaviala', 'Merkintä', 'Esim.'], [['suuri oktaavi', 'iso kirjain', '<b>C D E … H</b>'], ['pieni oktaavi', 'pieni kirjain', '<b>c d e … h</b>'], ['yksiviivainen', 'pieni + ¹', '<b>c¹ … h¹</b>'], ['kaksiviivainen', 'pieni + ²', '<b>c² … h²</b>'], ['kolmiviivainen', 'pieni + ³', '<b>c³ … h³</b>']]) } },
      { t: 'Yksiviivainen c = c¹', x: `Tärkein maamerkki: ${N('C4', 'c¹')} (yksiviivainen c) on <b>apuviivalla</b> G-avaimen alapuolella ja F-avaimen yläpuolella. Se on pianon keskellä.`, v: [{ staff: { clef: 'g', notes: [{ n: 'C4', lab: 'c¹' }] } }, { staff: { clef: 'f', notes: [{ n: 'C4', lab: 'c¹' }] } }], play: { notes: ['C4'] } },
      { t: 'G-avaimen alue', x: 'G-avainviivastolla liikutaan enimmäkseen yksi- ja kaksiviivaisessa oktaavissa.', v: { staff: { clef: 'g', notes: ['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6'], names: 'oct' } }, play: { notes: ['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6'] } },
      { t: 'F-avaimen alue', x: 'F-avainviivastolla (bassoavain) liikutaan suuressa ja pienessä oktaavissa.', v: { staff: { clef: 'f', notes: ['C2', 'E2', 'G2', 'C3', 'E3', 'G3', 'C4'], names: 'oct' } }, play: { notes: ['C2', 'E2', 'G2', 'C3', 'E3', 'G3', 'C4'] } },
      { q: 'Mikä on tämän nuotin nimi ja oktaaviala?', v: { staff: { clef: 'g', notes: ['G5'] } }, o: ['g¹', 'g²', 'g'], a: 1, e: 'Se on yläpuolella c²:ta → kaksiviivainen g = g².' },
      { q: 'Mikä on tämän nuotin nimi ja oktaaviala?', v: { staff: { clef: 'f', notes: ['A2'] } }, o: ['A', 'a', 'a¹'], a: 0, e: 'Bassoavaimen alin väli on suuren oktaavin A (iso kirjain).' },
      { pick: 'Klikkaa pianosta e¹', target: ['E4'], v: { piano: { from: 'C3', oct: 3, labels: 'none' } }, e: 'e¹ on c¹:n yläpuolella oleva e.' },
    ] },
    { id: 'nimi-oktaavi', title: 'Nuotin nimi ja oktaaviala', sub: 'Korotukset ja alennukset nimissä', steps: [
      { t: 'Korotusmerkki ♯ → +is', x: `${K('Korotusmerkki')} nostaa säveltä puolisävelaskeleen. Nimeen lisätään <b>-is</b>: c → cis, f → fis, g → gis.`, v: { piano: { from: 'C4', oct: 1, marks: ['C#4', 'F#4', 'G#4'] } }, play: { notes: ['F4', 'F#4'] } },
      { t: 'Alennusmerkki ♭ → +es', x: `${K('Alennusmerkki')} laskee puolisävelaskeleen. Nimeen lisätään <b>-es</b>: d → des, g → ges.<br><b>Poikkeukset:</b> e → <b>es</b>, a → <b>as</b>, h → <b>b</b>`, v: { piano: { from: 'C4', oct: 1, marks: ['Db4', 'Eb4', 'Ab4', 'Bb4'] } } },
      { q: 'Mikä on h:n alennettu nimi?', o: ['hes', 'b', 'bes'], a: 1, e: 'Erikoinen mutta tärkeä: alennettu h on b.' },
      { q: 'Nimeä nuotti (huomaa oktaaviala).', v: { staff: { clef: 'g', notes: ['F#4'] } }, o: ['fis¹', 'fis²', 'f¹'], a: 0, e: 'Viivaston alin väli on f¹; korotettuna fis¹.' },
      { q: 'Nimeä nuotti.', v: { staff: { clef: 'g', notes: ['Ab5'] } }, o: ['as²', 'aes²', 'as¹'], a: 0, e: 'a² alennettuna = as² (ei "aes").' },
      { t: 'Etumerkintä vaikuttaa koko kappaleeseen', x: `Jos viivaston alussa on esim. ♯ f-viivalla, <b>jokainen f</b> soitetaan fis:nä, myös eri oktaaveissa. Muista tämä nimetessäsi!`, v: { staff: { clef: 'g', key: 1, notes: ['F#4', 'A4', 'F#5'], labels: ['fis¹', 'a¹', 'fis²'] } } },
      { q: 'Viivaston alussa on 2 korotusta (fis, cis). Mikä tämä nuotti on?', v: { staff: { clef: 'g', key: 2, notes: ['C#5'] } }, o: ['c²', 'cis²', 'cis¹'], a: 1, e: 'Etumerkintä korottaa kaikki c:t → cis².' },
      { q: 'Mikä nuotti on c¹:n kanssa samassa oktaavialassa?', o: ['h¹', 'h', 'c²'], a: 0, e: 'Yksiviivainen oktaavi: c¹ d¹ e¹ f¹ g¹ a¹ h¹.' },
    ] },
  ] },
  { id: 'asteikot', title: 'Asteikot', desc: 'Duuri, molli, uudet sävellajit, kvinttiympyrä', lessons: [
    { id: 'asteikot-kertaus', title: 'Asteikkojen kertausta', sub: 'Duuriasteikon resepti', steps: [
      { t: 'Duuriasteikko = portaat', x: `Duuriasteikossa on 8 säveltä. Välit ovat ${K('sävelaskelia')} (1) ja ${K('puolia sävelaskelia')} (½). Resepti on aina sama:`, v: { html: stepsHTML(['K', 'K', 'P', 'K', 'K', 'K', 'P']) } },
      { t: 'C-duuri: vain valkoiset koskettimet', x: `Puolet sävelaskeleet ovat ${N('E4', 'e')}–${N('F4', 'f')} ja ${N('B4', 'h')}–${N('C5', 'c')}, eli kohdissa, joissa koskettimien välissä ei ole mustaa.`, v: [{ piano: { from: 'C4', oct: 1, marks: T.scale('C4', 'duuri') } }, sc('C4', 'duuri')], play: { notes: T.scale('C4', 'duuri') } },
      { t: 'G-duuri tarvitsee yhden korotuksen', x: `Kun aloitetaan g:stä ja käytetään samaa reseptiä, 7. sävelen täytyy olla ${N('F#4', 'fis')}, jotta lopussa on puoli sävelaskelta. G-duurin etumerkintä: <b>1 ♯ (fis)</b>.`, v: [{ piano: { from: 'C4', oct: 2, marks: T.scale('G4', 'duuri') } }, sc('G4', 'duuri')], play: { notes: T.scale('G4', 'duuri') } },
      { t: 'F-duuri tarvitsee yhden alennuksen', x: `F:stä alkaen 4. sävelen täytyy olla ${N('Bb4', 'b')}. F-duurin etumerkintä: <b>1 ♭ (b)</b>.`, v: sc('F4', 'duuri'), play: { notes: T.scale('F4', 'duuri') } },
      { t: 'Rinnakkaissävellajit = saman talon kaksi asukasta', x: `Jokaisella duurilla on molli, jolla on <b>sama etumerkintä</b>. Ne ovat ${K('rinnakkaissävellajit')}. Molli löytyy <b>pienen terssin (pi3) alaspäin</b> duurista.<br>C → a · G → e · F → d · D → h · B → g`, v: { html: tableHTML(['Etumerkintä', 'Duuri', 'Molli'], [['–', 'C', 'a'], ['1♯', 'G', 'e'], ['2♯', 'D', 'h'], ['1♭', 'F', 'd'], ['2♭', 'B', 'g']]) } },
      { q: 'Mikä duuri ja molli? (esim. G – e)', v: { staff: { clef: 'g', key: 2, notes: [] } }, o: ['D – h', 'G – e', 'A – fis'], a: 0, e: '2 korotusta (fis, cis) = D-duuri ja h-molli.' },
      { q: 'Mikä duuri ja molli?', v: { staff: { clef: 'f', key: -2, notes: [] } }, o: ['F – d', 'B – g', 'Es – c'], a: 1, e: '2 alennusta (b, es) = B-duuri ja g-molli.' },
      { q: 'Duuriasteikon puolisävelaskeleet ovat sävelten…', o: ['3–4 ja 7–8 välissä', '2–3 ja 5–6 välissä', '4–5 ja 7–8 välissä'], a: 0, e: '1 1 ½ 1 1 1 ½ → puoli sävelaskelta on 3.–4. ja 7.–8. sävelen välissä.' },
    ] },
    { id: 'uudet-asteikot', title: 'Uusia asteikkoja', sub: '3 ja 4 etumerkkiä', steps: [
      { t: 'Uudet sävellajit', x: `Nyt mukaan tulevat 3 ja 4 etumerkin sävellajit:`, v: { html: tableHTML(['Etumerkit', 'Duuri', 'Molli', 'Merkit'], [['3♯', 'A', 'fis', 'fis cis gis'], ['4♯', 'E', 'cis', 'fis cis gis dis'], ['3♭', 'Es', 'c', 'b es as'], ['4♭', 'As', 'f', 'b es as des']]) } },
      { t: 'A-duuri', x: 'A-duurissa on 3 korotusta: fis, cis, gis.', v: sc('A4', 'duuri', 'g', { key: 3, forceAcc: false }), play: { notes: T.scale('A4', 'duuri') } },
      { t: 'Es-duuri', x: 'Es-duurissa on 3 alennusta: b, es, as.', v: sc('Eb4', 'duuri', 'g', { key: -3, forceAcc: false }), play: { notes: T.scale('Eb4', 'duuri') } },
      { t: 'Kikka: korotussävellajin nimi', x: `Katso <b>viimeistä korotusta</b> ja nouse siitä <b>puolisävelaskel</b> ylöspäin.<br>Esim. viimeinen ♯ on gis → puoli sävelaskelta ylös → <b>A-duuri</b>.`, v: { staff: { clef: 'g', key: 3, notes: [{ n: 'A4', lab: 'a = sävellaji' }] } } },
      { t: 'Kikka: alennussävellajin nimi', x: `Katso <b>toiseksi viimeistä alennusta</b>. Se on sävellajin nimi!<br>Esim. b, es, <b>as</b>, des → <b>As-duuri</b>. (Poikkeus: 1♭ = F-duuri.)`, v: { staff: { clef: 'g', key: -4, notes: [] } } },
      { q: 'Mikä duuri ja molli?', v: { staff: { clef: 'g', key: 4, notes: [] } }, o: ['E – cis', 'A – fis', 'H – gis'], a: 0, e: 'Viimeinen korotus dis → puoli sävelaskelta ylös = E. Molli pi3 alaspäin = cis.' },
      { q: 'Mikä duuri ja molli?', v: { staff: { clef: 'g', key: -3, notes: [] } }, o: ['B – g', 'Es – c', 'As – f'], a: 1, e: 'Toiseksi viimeinen alennus on es → Es-duuri, c-molli.' },
      { q: 'Mitkä etumerkit on E-duurissa?', o: ['fis cis gis', 'fis cis gis dis', 'b es as des'], a: 1, e: 'E-duuri = 4♯: fis, cis, gis, dis.' },
    ] },
    { id: 'molliasteikot', title: 'Molliasteikot', sub: 'Luonnollinen, harmoninen, melodinen', steps: [
      { t: 'Kolme mollia, kolme väriä', x: `Molliasteikosta on kolme muotoa. Opi ne a-mollin avulla, koska siinä ei ole etumerkkejä.`, v: { html: tableHTML(['Muoto', 'Muutos'], [['<b>luonnollinen</b>', 'sama sävelet kuin rinnakkaisduurissa'], ['<b>harmoninen</b>', '7. sävel korotetaan'], ['<b>melodinen</b>', 'ylös: 6. ja 7. korotetaan · alas: luonnollinen']]) } },
      { t: 'Luonnollinen a-molli', x: 'Vain valkoiset koskettimet, a:sta a:han.', v: sc('A4', 'luonnollinen'), play: { notes: T.scale('A4', 'luonnollinen') } },
      { t: 'Harmoninen a-molli', x: `7. sävel korotetaan: g → ${N('G#5', 'gis')}. Siitä tulee ${K('johtosävel')}, joka "vetää" kohti a:ta. Kuuntele 6. ja 7. sävelen väliä: se on iso hyppy (ylinouseva sekunti), joka kuulostaa itämaiselta.`, v: [sc('A4', 'harmoninen'), { html: stepsHTML(['K', 'P', 'K', 'K', 'P', 'Y', 'P']) }], play: { notes: T.scale('A4', 'harmoninen') } },
      { t: 'Melodinen a-molli', x: `Ylöspäin korotetaan 6. ja 7. sävel (${N('F#5', 'fis')}, ${N('G#5', 'gis')}). Alaspäin palataan luonnolliseen.`, v: { staff: { clef: 'g', notes: T.scale('A4', 'melodinen').concat(T.scale('A4', 'luonnollinen').reverse().slice(1)), names: 'fi', forceAcc: true, colW: 30 } }, play: { notes: T.scale('A4', 'melodinen').concat(T.scale('A4', 'luonnollinen').reverse().slice(1)) } },
      { q: 'Mikä molli tässä on?', v: sc('D4', 'harmoninen'), o: ['luonnollinen d-molli', 'harmoninen d-molli', 'melodinen d-molli'], a: 1, e: 'Vain 7. sävel (cis) on korotettu → harmoninen.' },
      { q: 'Harmonisessa e-mollissa korotetaan…', o: ['c → cis', 'd → dis', 'f → fis'], a: 1, e: 'e-mollin 7. sävel on d → dis (johtosävel).' },
      { q: 'Melodisessa mollissa alaspäin mentäessä…', o: ['käytetään luonnollista mollia', 'korotetaan 6. ja 7.', 'korotetaan vain 7.'], a: 0, e: 'Ylös korotukset, alas luonnollinen.' },
    ] },
    { id: 'kvinttiympyra', title: 'Kvinttiympyrä', sub: 'Kaikki sävellajit yhdessä kuvassa', steps: [
      { t: 'Sävellajien kello', x: `${K('Kvinttiympyrä')} on kuin kello. Ylhäällä on C-duuri / a-molli (ei etumerkkejä). Myötäpäivään jokainen askel on <b>puhdas kvintti ylös</b> ja lisää yhden ♯. Vastapäivään jokainen askel lisää yhden ♭.`, v: { circle: 0 } },
      { t: 'Korotusmerkkiduurit', x: `G – D – A – E – H – Fis – Cis<br>Korotusmerkkiduuriloru: <b>G</b>ideon <b>D</b>aavid <b>A</b>atami <b>E</b>eva <b>H</b>yppäsivät <b>Fis</b>sistä <b>Cis</b>siin`, v: { circle: 1 } },
      { t: 'Alennusmerkkiduurit', x: `F – B – Es – As – Des – Ges – Ces<br>Alennusmerkkiduuriloru: <b>F</b>iksusta <b>B</b>oksista <b>Es</b>iin <b>As</b>tuu <b>Des</b>pootti <b>Ges</b> <b>Ces</b>`, v: { circle: 11 } },
      { t: 'Sisäkehä = rinnakkaissävellajit', x: 'Jokaisen duurin vieressä sisäkehällä on sen rinnakkaissävellaji, molli, jolla on sama etumerkintä.', v: { circle: 3 } },
      { q: 'Kuinka monta korotusta on H-duurissa?', o: ['4', '5', '6'], a: 1, e: 'G1 D2 A3 E4 H5.' },
      { q: 'Mikä on Es-duurin rinnakkaissävellaji?', o: ['c-molli', 'g-molli', 'f-molli'], a: 0, e: 'Es → pi3 alaspäin → c.' },
      { q: 'Mikä sävellaji on 4 alennusta (molli)?', o: ['c-molli', 'f-molli', 'b-molli'], a: 1, e: '4♭ = As-duuri / f-molli.' },
    ] },
  ] },
  { id: 'transp', title: 'Transponointi', desc: 'Sävelmän siirtäminen', lessons: [
    { id: 'transponointi', title: 'Transponointi', sub: 'Sama melodia, eri korkeus', steps: [
      { t: 'Hissi ylös tai alas', x: `${K('Transponointi')} = sävelmän siirtäminen toiseen korkeuteen tai sävellajiin. Melodia pysyy samana, kaikki sävelet vain liikkuvat <b>saman intervallin verran</b>.`, v: [{ staff: { clef: 'g', key: 0, notes: ['C4', 'D4', 'E4', 'C4'], names: 'fi' } }, { staff: { clef: 'g', key: 1, notes: ['G4', 'A4', 'B4', 'G4'], names: 'fi' } }], play: { notes: ['C4', 'D4', 'E4', 'C4', 'G4', 'A4', 'B4', 'G4'] } },
      { t: 'Kolme askelta', x: `1. <b>Tunnista sävellaji</b> (etumerkintä + loppusävel).<br>2. <b>Laske uusi sävellaji</b> intervallin avulla.<br>3. <b>Kirjoita uusi etumerkintä</b> ja siirrä jokainen nuotti saman verran (esim. terssi ylös = jokainen nuotti 2 porrasta ylemmäs).` },
      { t: 'Esimerkki: D-duurista F-duuriin', x: `D-duurin melodia siirretään <b>pieni terssi ylöspäin</b> → D + pi3 = <b>F</b>. Uusi etumerkintä: 1 ♭. Jokainen nuotti nousee 2 viivaston porrasta.`, v: [{ staff: { clef: 'g', key: 2, notes: ['D4', 'F#4', 'A4', 'F#4', 'D4'], names: 'fi' } }, { staff: { clef: 'g', key: -1, notes: ['F4', 'A4', 'C5', 'A4', 'F4'], names: 'fi' } }] },
      { q: 'G-duurin melodia transponoidaan suuri sekunti (s2) ylöspäin. Mikä on uusi sävellaji?', o: ['A-duuri', 'As-duuri', 'F-duuri'], a: 0, e: 'g + s2 = a → A-duuri (3♯).' },
      { q: 'Melodian sävel e¹ siirretään puhdas kvartti (pu4) ylöspäin. Mikä sävel tulee?', o: ['a¹', 'h¹', 'as¹'], a: 0, e: 'e–f–g–a = 4 porrasta, ja e–a on puhdas kvartti.' },
      { q: 'Transponoinnissa jokaisen nuotin pitää siirtyä…', o: ['saman intervallin verran', 'oktaavin verran', 'eri verran'], a: 0, e: 'Muuten melodia muuttuisi.' },
    ] },
    { id: 'lisaa-transp', title: 'Lisää transponointia', sub: 'Alaspäin ja yli oktaavin', steps: [
      { t: 'Alaspäin transponointi', x: `Toimii samoin, mutta lasketaan alaspäin. Esim. g-mollin melodia siirretään <b>pieni seksti alaspäin</b>: g − pi6 = h, joten uusi sävellaji on <b>h-molli</b>.`, v: [{ staff: { clef: 'g', key: -2, notes: ['G4', 'Bb4', 'D5'], names: 'fi' } }, { staff: { clef: 'g', key: 2, notes: ['B3', 'D4', 'F#4'], names: 'fi' } }] },
      { t: 'Nooni = oktaavi + sekunti', x: `Kun siirto on yli oktaavin, intervallit jatkuvat: <b>nooni (9)</b> = oktaavi + sekunti, <b>desimi (10)</b> = oktaavi + terssi. Suuri nooni alaspäin = oktaavi alas + suuri sekunti alas.` },
      { q: 'C-duurin melodia siirretään puhdas kvintti (pu5) alaspäin. Uusi sävellaji?', o: ['F-duuri', 'G-duuri', 'E-duuri'], a: 0, e: 'c – h – a – g – f: viisi porrasta alas = f.' },
      { q: 'a-mollin melodia siirretään suuri terssi (s3) alaspäin. Uusi sävellaji?', o: ['f-molli', 'fis-molli', 'e-molli'], a: 0, e: 'a – s3 alas = f → f-molli (4♭).' },
      { q: 'Mikä on suuri nooni?', o: ['oktaavi + suuri sekunti', 'oktaavi + suuri terssi', '9 puolisävelaskelta'], a: 0, e: 'Nooni = 9. sävel = oktaavi + sekunti.' },
    ] },
  ] },
  { id: 'soinnut', title: 'Soinnut', desc: 'Kolmisoinnut, sointumerkit, asteet', lessons: [
    { id: 'kolmisointu', title: 'Kolmisointu', sub: 'Lumiukko asteikosta', steps: [
      { t: 'Kolmisointu = lumiukko', x: `Ota asteikosta sävelet <b>1, 3 ja 5</b> ja pinoa ne päällekkäin. Syntyy ${K('kolmisointu')}. Nuotit ovat joko kaikki viivoilla tai kaikki väleissä, kuin lumiukko.`, v: [sc('D4', 'duuri'), { staff: { clef: 'g', notes: [{ n: ['D4', 'F#4', 'A4'], lab: 'D' }], forceAcc: true } }], play: { notes: ['D4', 'F#4', 'A4'], mode: 'both' } },
      { t: 'Sävelten nimet soinnussa', x: `Alin = ${K('pohjasävel')} (antaa soinnulle nimen)<br>Keskimmäinen = ${K('terssi')}<br>Ylin = ${K('kvintti')}`, v: { staff: { clef: 'g', notes: [{ n: ['C4', 'E4', 'G4'], lab: 'C' }] } } },
      { t: 'Neljä sointutyyppiä', x: `Merkinnät:<br>${K('D')} = duurikolmisointu · ${K('Dm')} = mollikolmisointu<br>${K('D+')} = ylinouseva kolmisointu · ${K('D°')} = vähennetty kolmisointu`, v: { staff: { clef: 'g', notes: [{ n: tri('D4', 'duuri'), lab: 'D' }, { n: tri('D4', 'molli'), lab: 'Dm' }, { n: tri('D4', 'ylinouseva'), lab: 'D+' }, { n: tri('D4', 'vähennetty'), lab: 'D°' }], forceAcc: true, colW: 60 } }, play: { notes: tri('D4', 'duuri'), mode: 'chord' } },
      { t: 'Kuuntele eroa', x: 'Duuri kuulostaa iloiselta, molli surulliselta, ylinouseva jännittyneeltä ja vähennetty kiristyneeltä. Paina nappeja!', v: { html: `<div class="btnrow">${['duuri', 'molli', 'ylinouseva', 'vähennetty'].map(t => `<button class="chip-btn" data-playchord="D4|${t}">${T.chordSymbol('D4', t)}</button>`).join('')}</div>` } },
      { q: 'Mikä on tämän kolmisoinnun pohjasävel?', v: { staff: { clef: 'g', notes: [tri('F4', 'duuri')] } }, o: ['f', 'a', 'c'], a: 0, e: 'Alin sävel = pohjasävel = f → sointu F.' },
      { q: 'Mikä merkki tarkoittaa vähennettyä kolmisointua?', o: ['D+', 'D°', 'Dm'], a: 1, e: '° (pieni ympyrä) = vähennetty, + = ylinouseva.' },
    ] },
    { id: 'sointumerkit', title: 'Sointumerkit', sub: 'Kirjain kertoo soinnun', steps: [
      { t: 'Sointumerkki = soinnun nimilappu', x: `Suomessa käytetään angloamerikkalaisia sointumerkkejä, mutta <b>B:n tilalla on H</b>. Alennettu h kirjoitetaan <b>B♭</b>.`, v: { html: tableHTML(['Merkki', 'Tarkoittaa', 'Esim. G'], [['G', 'duurikolmisointu', 'g h d'], ['Gm', 'mollikolmisointu', 'g b d'], ['G+', 'ylinouseva', 'g h dis'], ['G°', 'vähennetty', 'g b des']]) } },
      { t: 'Etumerkit sointumerkeissä', x: `Korotus: ${K('F♯')}, ${K('C♯m')} · Alennus: ${K('E♭')}, ${K('B♭m')}, ${K('A♭+')}`, v: { staff: { clef: 'g', notes: [{ n: tri('F#4', 'duuri'), lab: 'F♯' }, { n: tri('Bb4', 'molli'), lab: 'B♭m' }, { n: tri('Eb4', 'duuri'), lab: 'E♭' }], forceAcc: true, colW: 60 } } },
      { q: 'Mikä sointu tässä on?', v: { staff: { clef: 'g', notes: [tri('E4', 'molli')], forceAcc: true } }, o: ['E', 'Em', 'E°'], a: 1, e: 'e g h: e–g on pieni terssi → molli → Em.' },
      { q: 'Mitkä sävelet kuuluvat sointuun A?', o: ['a cis e', 'a c e', 'a cis eis'], a: 0, e: 'Duurisointu: s3 (a–cis) + pi3 (cis–e).' },
      { q: 'Mikä sointu tässä on?', v: { staff: { clef: 'g', notes: [tri('B4', 'vähennetty')], forceAcc: true } }, o: ['Hm', 'H°', 'H+'], a: 1, e: 'h d f: pi3 + pi3 = vähennetty → H°.' },
    ] },
    { id: 'sointuasteet-duuri', title: 'Sointuasteet duurissa', sub: 'I – VII ja T, S, D', steps: [
      { t: 'Jokaiselle asteelle oma sointu', x: `Rakenna kolmisointu asteikon jokaiselle sävelelle käyttäen vain asteikon omia säveliä. Soinnut numeroidaan roomalaisilla numeroilla: <b>I II III IV V VI VII</b>. Merkintä <b>C:</b> tarkoittaa C-duuria.`, v: { staff: { clef: 'g', notes: [0, 1, 2, 3, 4, 5, 6].map(i => ({ n: T.degreeTriad(T.scale('C4', 'duuri'), i), lab: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][i] })), colW: 46 } } },
      { t: 'Muistitaulukko', x: 'Tämä toistuu <b>jokaisessa</b> duurissa:', v: { html: tableHTML(['Duurisointuja asteilla', 'Mollisointuja asteilla', 'Vähennetty sointu asteella'], [['<b>I IV V</b>', '<b>II III VI</b>', '<b>VII</b>']]) } },
      { t: 'C-duurin soinnut sointumerkein', x: 'C · Dm · Em · F · G · Am · H°', v: { staff: { clef: 'g', notes: [0, 1, 2, 3, 4, 5, 6].map(i => { const t = T.degreeTriad(T.scale('C4', 'duuri'), i); return { n: t, lab: T.chordSymbol(t[0], T.triadQuality(t)) }; }), colW: 46 } }, play: { notes: ['C4', 'E4', 'G4'], mode: 'chord' } },
      { t: 'Toonika, subdominantti ja dominantti', x: `${K('Toonika (T)')} = asteen <b>I</b> sointu (asteikon 1. sävel), "koti".<br>${K('Subdominantti (S)')} = asteen <b>IV</b> sointu (4. sävel).<br>${K('Dominantti (D)')} = asteen <b>V</b> sointu (5. sävel), joka "haluaa" palata kotiin.`, play: { seq: [['C4', 'E4', 'G4'], ['F4', 'A4', 'C5'], ['G4', 'B4', 'D5'], ['C4', 'E4', 'G4']] } },
      { q: 'Mikä sointu on G:V (G-duurin V aste)?', o: ['D', 'Dm', 'C'], a: 0, e: 'G-duurin 5. sävel on d. V-aste on duuri → D.' },
      { q: 'Mikä sointu on F:II?', o: ['G', 'Gm', 'G°'], a: 1, e: 'F-duurin 2. sävel on g; II-aste on molli → Gm.' },
      { q: 'Millä asteella on vähennetty sointu duurissa?', o: ['II', 'V', 'VII'], a: 2, e: 'Duurissa vain VII-aste on vähennetty.' },
      { q: 'D-duurissa: mikä on subdominantti?', o: ['G', 'A', 'Em'], a: 0, e: 'S = IV-aste. D-duurin 4. sävel on g → G.' },
    ] },
    { id: 'sointusysteemi', title: 'Sointusysteemi', sub: 'Sointujen muuttaminen toisikseen', steps: [
      { t: 'Neljä taikatemppua', x: `Sointusysteemillä muutat sointutyypin yhdellä siirrolla:<br>1. <b>Alenna</b> duurisoinnusta <b>keskimmäinen</b> sävel ⇒ mollisointu<br>2. <b>Korota</b> mollisoinnusta <b>keskimmäinen</b> sävel ⇒ duurisointu<br>3. <b>Korota</b> duurisoinnusta <b>ylin</b> sävel ⇒ ylinouseva sointu<br>4. <b>Alenna</b> mollisoinnusta <b>ylin</b> sävel ⇒ vähennetty sointu` },
      { t: 'Kuvana', x: 'Duuri on keskellä. Keskimmäinen sävel alas = molli. Ylin ylös = ylinouseva. Mollin ylin alas = vähennetty.', v: { staff: { clef: 'g', notes: [{ n: tri('C4', 'ylinouseva'), lab: 'C+' }, { n: tri('C4', 'duuri'), lab: 'C' }, { n: tri('C4', 'molli'), lab: 'Cm' }, { n: tri('C4', 'vähennetty'), lab: 'C°' }], forceAcc: true, colW: 60 } }, play: { seq: [tri('C4', 'ylinouseva'), tri('C4', 'duuri'), tri('C4', 'molli'), tri('C4', 'vähennetty')] } },
      { q: 'G (g h d): alenna keskimmäinen sävel. Mikä sointu syntyy?', o: ['Gm (g b d)', 'G° (g b des)', 'G+ (g h dis)'], a: 0, e: 'Keskimmäinen alas = molli.' },
      { q: 'Am (a c e): alenna ylin sävel. Mikä syntyy?', o: ['A°', 'A', 'A+'], a: 0, e: 'Mollin ylin alas = vähennetty: a c es.' },
      { q: 'E (e gis h): korota ylin sävel. Mikä syntyy?', o: ['E+ (e gis his)', 'Em', 'E°'], a: 0, e: 'Duurin ylin ylös = ylinouseva.' },
      { q: 'Dm (d f a): korota keskimmäinen. Mikä syntyy?', o: ['D', 'D+', 'D°'], a: 0, e: 'Mollin keskimmäinen ylös = duuri: d fis a.' },
    ] },
    { id: 'sointuasteet-molli', title: 'Sointuasteet mollissa', sub: 'Harmoninen molli', steps: [
      { t: 'Mollin asteet: harmoninen molli', x: `Mollin soinnut rakennetaan <b>harmonisesta mollista</b>, eli 7. sävel on korotettu (johtosävel). Merkintä pienellä kirjaimella: <b>c:</b> = c-molli.`, v: { staff: { clef: 'g', notes: [0, 1, 2, 3, 4, 5, 6].map(i => { const t = T.degreeTriad(T.scale('A4', 'harmoninen'), i); return { n: t, lab: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][i] }; }), forceAcc: true, colW: 46 } } },
      { t: 'Muistitaulukko', v: { html: tableHTML(['Mollisointuja', 'Duurisointuja', 'Vähennettyjä', 'Ylinouseva'], [['<b>I IV</b>', '<b>V VI</b>', '<b>II VII</b>', '<b>III</b>']]) }, x: 'Harmonisessa mollissa:' },
      { t: 'a-mollin soinnut', x: 'Am · H° · C+ · Dm · E · F · G♯°<br>Huomaa: V-aste (E) on <b>duuri</b> johtosävelen gis ansiosta!', v: { staff: { clef: 'g', notes: [0, 1, 2, 3, 4, 5, 6].map(i => { const t = T.degreeTriad(T.scale('A4', 'harmoninen'), i); return { n: t, lab: T.chordSymbol(t[0], T.triadQuality(t)) }; }), forceAcc: true, colW: 46 } } },
      { q: 'Mikä sointu on e:V (e-molli, V aste)?', o: ['H', 'Hm', 'H°'], a: 0, e: 'e-mollin 5. sävel h. Harmonisessa mollissa V on duuri: h dis fis → H.' },
      { q: 'Mikä sointu on d:III?', o: ['F', 'F+', 'Fm'], a: 1, e: 'III-aste mollissa on ylinouseva: f a cis → F+.' },
      { q: 'Millä asteilla mollissa on vähennetty sointu?', o: ['II ja VII', 'VII', 'III ja VI'], a: 0, e: 'Harmonisessa mollissa vähennettyjä ovat II ja VII.' },
    ] },
    { id: 'kolmisointu-rakenne', title: 'Kolmisointujen intervallirakenne', sub: 'Terssit pinossa', steps: [
      { t: 'Sointu = kaksi terssiä päällekkäin', x: `Lyhenteet: <b>s</b> = suuri, <b>pi</b> = pieni, <b>pu</b> = puhdas, <b>y</b> = ylinouseva, <b>v</b> = vähennetty.`, v: { html: tableHTML(['Sointu', 'Alempi terssi', 'Ylempi terssi', 'Kvintti'], [['Duurikolmisointu', 's3', 'pi3', 'pu5'], ['Mollikolmisointu', 'pi3', 's3', 'pu5'], ['Ylinouseva', 's3', 's3', 'y5'], ['Vähennetty', 'pi3', 'pi3', 'v5']]) } },
      { t: 'Laske koskettimista', x: `Pieni terssi = 1½ sävelaskelta. Suuri terssi = 2 sävelaskelta.<br>Duuri C: c → e (2) + e → g (1½).`, v: { piano: { from: 'C4', oct: 1, marks: ['C4', 'E4', 'G4'] } } },
      { q: 'Alhaalta s3 + pi3. Mikä sointu?', o: ['duuri', 'molli', 'ylinouseva'], a: 0, e: 'Duuri = s3 + pi3.' },
      { q: 'Alhaalta pi3 + pi3. Mikä sointu?', o: ['molli', 'vähennetty', 'ylinouseva'], a: 1, e: 'Kaksi pientä terssiä → vähennetty kvintti → vähennetty sointu.' },
      { q: 'Mikä kvintti on ylinousevassa kolmisoinnussa?', o: ['pu5', 'y5', 'v5'], a: 1, e: 's3 + s3 = y5.' },
    ] },
  ] },
  { id: 'intervallit', title: 'Intervallit', desc: 'Suuret, pienet, puhtaat, vähennetyt, ylinousevat', lessons: [
    { id: 'iv-suuret-puhtaat', title: 'Intervallit: suuret ja puhtaat', sub: 'Duuriasteikko on mittanauha', steps: [
      { t: 'Intervalli = kahden sävelen välimatka', x: `Intervallin <b>numero</b> lasketaan nuottinimistä: alempi sävel on 1. Esim. c → e: c(1) d(2) e(3) = <b>terssi</b>.`, v: { html: tableHTML(['1', '2', '3', '4', '5', '6', '7', '8'], [['priimi', 'sekunti', 'terssi', 'kvartti', 'kvintti', 'seksti', 'septimi', 'oktaavi']]) } },
      { t: 'Kultainen sääntö', x: BIG('Jos intervallin <b>ylempi sävel</b> kuuluu <b>alemman sävelen duuriasteikkoon</b>, intervalli on <b>suuri</b> tai <b>puhdas</b>.') },
      { t: 'Kumpi: suuri vai puhdas?', x: `${K('Puhtaita')} ovat priimi, kvartti, kvintti ja oktaavi (pu1, pu4, pu5, pu8).<br>${K('Suuria')} ovat sekunti, terssi, seksti ja septimi (s2, s3, s6, s7).`, v: { staff: { clef: 'g', notes: [['C4', 'C4'], ['C4', 'D4'], ['C4', 'E4'], ['C4', 'F4'], ['C4', 'G4'], ['C4', 'A4'], ['C4', 'B4'], ['C4', 'C5']], labels: ['pu1', 's2', 's3', 'pu4', 'pu5', 's6', 's7', 'pu8'], colW: 40 } } },
      { t: 'Esimerkki', x: `Mikä on d¹ → fis¹? D-duurissa on fis ✔ → terssi on <b>suuri</b> = <b>s3</b>.`, v: { staff: { clef: 'g', notes: [['D4', 'F#4']], labels: ['s3'] } }, play: { notes: ['D4', 'F#4'], mode: 'both' } },
      { q: 'Mikä intervalli? (vihje: kuuluuko ylempi alemman duuriasteikkoon?)', v: { staff: { clef: 'g', notes: [['G4', 'E5']] } }, o: ['s6', 'pu6', 's5'], a: 0, e: 'g → e = 6 nimeä. E kuuluu G-duuriin → suuri seksti s6.' },
      { q: 'Mikä intervalli?', v: { staff: { clef: 'g', notes: [['F4', 'Bb4']], forceAcc: true } }, o: ['s4', 'pu4', 'pu5'], a: 1, e: 'f → b = kvartti. F-duurissa on b ✔ → puhdas kvartti pu4.' },
      { q: 'Muodosta s7 ylöspäin sävelestä a¹. Mikä on ylempi sävel?', o: ['gis²', 'g²', 'a²'], a: 0, e: 'A-duurin 7. sävel on gis → gis².' },
      { q: 'Mikä intervalli?', v: { staff: { clef: 'f', notes: [['E3', 'B3']] } }, o: ['pu5', 's5', 'pu4'], a: 0, e: 'e → h = kvintti; h kuuluu E-duuriin → pu5.' },
    ] },
    { id: 'iv-suuret-pienet', title: 'Intervallit: suuret ja pienet', sub: 'Suuri − puolisävel = pieni', steps: [
      { t: 'Kutistus: suuri → pieni', x: `Kun ${K('suurta')} intervallia pienennetään <b>puolisävelaskeleella</b>, siitä tulee ${K('pieni')} (lyhenne <b>pi</b>).`, v: { staff: { clef: 'g', notes: [['C4', 'E4'], ['C4', 'Eb4'], ['C4', 'A4'], ['C4', 'Ab4']], labels: ['s3', 'pi3', 's6', 'pi6'], forceAcc: true, colW: 48 } }, play: { seq: [['C4', 'E4'], ['C4', 'Eb4']] } },
      { t: 'Vain sekunti, terssi, seksti ja septimi', x: `Pieniä ja suuria voivat olla vain 2, 3, 6 ja 7. Puhtaista ei koskaan tule "pieniä".`, v: { html: tableHTML(['Intervalli', 'Suuri', 'Pieni'], [['sekunti', 's2 (1)', 'pi2 (½)'], ['terssi', 's3 (2)', 'pi3 (1½)'], ['seksti', 's6 (4½)', 'pi6 (4)'], ['septimi', 's7 (5½)', 'pi7 (5)']]) + '<small>Suluissa sävelaskeleet (½ = puoli sävelaskelta)</small>' } },
      { q: 'Mikä intervalli?', v: { staff: { clef: 'g', notes: [['A4', 'C5']] } }, o: ['s3', 'pi3', 'pu3'], a: 1, e: 'A-duurissa on cis. Tässä c, eli puoli sävelaskelta pienempi → pi3.' },
      { q: 'Mikä intervalli?', v: { staff: { clef: 'g', notes: [['D4', 'C5']] } }, o: ['s7', 'pi7', 'pu7'], a: 1, e: 'D-duurissa cis. Tässä c → pieni septimi pi7.' },
      { q: 'Muodosta pi6 ylöspäin sävelestä e¹.', o: ['c²', 'cis²', 'h¹'], a: 0, e: 'E-duurissa cis (s6). Puoli sävelaskelta alas → c² = pi6.' },
      { q: 'Montako sävelaskelta on pieni terssi?', o: ['1', '1½', '2'], a: 1, e: 'pi3 = 1½ sävelaskelta, s3 = 2 sävelaskelta.' },
    ] },
    { id: 'iv-puhtaat-vahennetyt', title: 'Intervallit: puhtaat ja vähennetyt', sub: 'Puhdas − puolisävel = vähennetty', steps: [
      { t: 'Puhdas pienenee → vähennetty', x: `Kun ${K('puhdasta')} intervallia pienennetään puolisävelaskeleella, siitä tulee ${K('vähennetty')} (lyhenne <b>v</b>). Esim. pu5 → <b>v5</b>.`, v: { staff: { clef: 'g', notes: [['C4', 'G4'], ['C4', 'Gb4'], ['C4', 'F4'], ['C4', 'Fb4']], labels: ['pu5', 'v5', 'pu4', 'v4'], forceAcc: true, colW: 48 } }, play: { seq: [['C4', 'G4'], ['C4', 'Gb4']] } },
      { t: 'Myös pieni pienenee → vähennetty', x: 'Kaavio: <b>SUURI</b> → (−½ sävelaskelta) → <b>Pieni</b> → (−½ sävelaskelta) → <b>Vähennetty</b>. <b>PUHDAS</b> → (−½ sävelaskelta) → <b>Vähennetty</b>.', v: { html: `<div class="ivmap"><span class="iv s">SUURI</span>→<span class="iv p">pieni</span>→<span class="iv v">vähennetty</span><br><span class="iv pu">PUHDAS</span>→<span class="iv v">vähennetty</span></div>` } },
      { q: 'Mikä intervalli? (h¹ → f²)', v: { staff: { clef: 'g', notes: [['B4', 'F5']] } }, o: ['pu5', 'v5', 'pi5'], a: 1, e: 'H-duurissa fis. Tässä f → puoli sävelaskelta pienempi → vähennetty kvintti.' },
      { q: 'Muodosta v8 ylöspäin sävelestä g¹.', o: ['ges²', 'g²', 'fis²'], a: 0, e: 'pu8 = g². Puoli sävelaskelta pienempi (sama nimi!) = ges².' },
      { q: 'Voiko kvintti olla "pieni"?', o: ['Ei, kvintti on puhdas, vähennetty tai ylinouseva', 'Kyllä'], a: 0, e: 'Puhtaat intervallit (1, 4, 5, 8) eivät ole koskaan pieniä tai suuria.' },
    ] },
    { id: 'iv-ylinousevat', title: 'Intervallit: ylinousevat', sub: 'Suuri tai puhdas + puolisävel', steps: [
      { t: 'Venytys: ylinouseva', x: `Kun ${K('suurta')} tai ${K('puhdasta')} intervallia suurennetaan puolisävelaskeleella, siitä tulee ${K('ylinouseva')} (lyhenne <b>y</b>).`, v: { staff: { clef: 'g', notes: [['C4', 'F4'], ['C4', 'F#4'], ['C4', 'A4'], ['C4', 'A#4']], labels: ['pu4', 'y4', 's6', 'y6'], forceAcc: true, colW: 48 } } },
      { t: 'Koko kaavio', x: 'Muista tämä kuva:', v: { html: `<div class="ivmap"><span class="iv y">ylinouseva</span><br>↗ +1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; +1 ↖<br><span class="iv s">SUURI</span> &nbsp;&nbsp; <span class="iv pu">PUHDAS</span><br>↓ −1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; −1 ↓<br><span class="iv p">pieni</span> −1 → <span class="iv v">vähennetty</span></div>` } },
      { t: 'Tritonus', x: `${K('Tritonus')} = ylinouseva kvartti (y4), esim. f → h. Se on kolme sävelaskelta, ja sen sointi on kirpeä.`, v: { staff: { clef: 'g', notes: [['F4', 'B4']], labels: ['y4'] } }, play: { notes: ['F4', 'B4'], mode: 'both' } },
      { q: 'Mikä intervalli? (c¹ → gis¹)', v: { staff: { clef: 'g', notes: [['C4', 'G#4']], forceAcc: true } }, o: ['y5', 'pi6', 's5'], a: 0, e: 'Nimet c–g = kvintti. C-duurissa g (pu5). gis on puoli sävelaskelta enemmän → y5.' },
      { q: 'Muodosta y2 ylöspäin sävelestä f¹.', o: ['gis¹', 'as¹', 'g¹'], a: 0, e: 's2 = g¹. Puoli sävelaskelta lisää samalla nimellä = gis¹.' },
      { q: 'Mikä on tritonus?', o: ['ylinouseva kvartti', 'pieni seksti', 'puhdas kvintti'], a: 0, e: 'Tritonus = ylinouseva kvartti (3 sävelaskelta).' },
    ] },
  ] },
  ],
},
/* ====================================================================================== */
{
  id: 'osa2', title: 'Osa 2', sub: '', color: '#ff5a4e', icon: '',
  intro: 'Kaikki sävellajit, tuplaetumerkit, itämainen molli, kromaattinen asteikko, kaikki intervallit, käännökset ja septimisoinnut.',
  modules: [
  { id: 'kertaus', title: 'Rytmi & oktaavit', desc: 'Nuottitalo, triolit, oktaavialat', lessons: [
    { id: 'nuottitalo', title: 'Nuottitalo', sub: 'Triolit mukaan', steps: [
      { t: 'Nuottitalon kerrokset', x: 'Sama kuin pyramidi, mutta kerroksia on enemmän. Kuudestoistaosat ja <b>triolit</b> tulevat mukaan.', v: { html: pyramidHTML([['w', 'koko'], ['h h', '2 puolta'], ['3[q q q]', 'neljäsosatrioli'], ['q q q q', '4 neljäsosaa'], ['3[e e e] 3[e e e]', 'kahdeksasosatriolit'], ['[s s s s] [s s s s]', 'kuudestoistaosat']]) } },
      { t: 'Trioli = kolme kahden paikalla', x: `${K('Trioli')} = kolme nuottia soitetaan siinä ajassa, jossa tavallisesti soitetaan kaksi samanarvoista. Merkkinä on <b>3</b> palkin yllä.<br>Kahdeksasosatrioli = 1 isku · neljäsosatrioli = 2 iskua.`, v: { rhythm: '[e e] 3[e e e] q q', syl: false, beats: true }, play: { rhythm: '[e e] 3[e e e] [e e] 3[e e e]', bpm: 76 } },
      { q: 'Montako iskua kestää neljäsosatrioli (kolme neljäsosaa 3-merkillä) 4/4-tahdissa?', o: ['1', '2', '3'], a: 1, e: 'Kolme neljäsosaa kahden neljäsosan ajassa = 2 iskua.' },
      { q: 'Kahdeksasosatrioli kestää yhtä kauan kuin…', o: ['yksi neljäsosanuotti', 'kolme kahdeksasosaa', 'puolinuotti'], a: 0, e: '3 kahdeksasosaa 2 kahdeksasosan ajassa = 1 neljäsosa.' },
    ] },
    { id: 'nuotit-tauot-jatko', title: 'Nuotit ja tauot, jatko', sub: 'Pisteelliset ja triolit', steps: [
      { t: 'Kertaus: nuotit ja tauot', v: { html: tableHTML(['Nuotti', 'Tauko', 'Nimi'], [[R.rhythm('w'), R.rhythm('rw'), 'koko'], [R.rhythm('h'), R.rhythm('rh'), 'puoli'], [R.rhythm('q'), R.rhythm('rq'), 'neljäsosa'], [R.rhythm('e'), R.rhythm('re'), 'kahdeksasosa'], [R.rhythm('s'), R.rhythm('rs'), 'kuudestoistaosa'], [R.rhythm('t'), R.rhythm('rt'), '32-osa']], 'rtbl') }, x: 'Jokaisella nuotilla on vastaava tauko.' },
      { t: 'Pisteellinen = nuotti + puolet', x: 'Pisteellinen kahdeksasosa = kahdeksasosa + kuudestoistaosa. Pisteellinen kuudestoistaosa = kuudestoistaosa + 32-osa.', v: [{ rhythm: 'e. | e _s', beats: true }] },
      { t: 'Triolit eri arvoina', x: 'Neljäsosatrioli (2 iskua), kahdeksasosatrioli (1 isku) ja kuudestoistaosatrioli (½ iskua).', v: { rhythm: '3[q q q] 3[e e e] 3[s s s]', beats: false } },
      { q: 'Pisteellinen kuudestoistaosatauko = ?', o: ['kuudestoistaosatauko + 32-osatauko', 'kahdeksasosatauko + kuudestoistaosatauko', 'kaksi kuudestoistaosataukoa'], a: 0, e: 'Piste = puolet lisää: kuudestoistaosan puolikas = 32-osa.' },
      { q: 'Montako kuudestoistaosaa on pisteellisessä neljäsosassa?', o: ['4', '6', '3'], a: 1, e: 'Neljäsosa = 4 kuudestoistaosaa, piste lisää 2 → 6.' },
    ] },
    { id: 'oktaavialat-jatko', title: 'Oktaavialat, jatko', sub: '8va, loco ja kontraoktaavi', steps: [
      { t: 'Koko kerrostalo', x: 'Koko sävelalue alhaalta ylös:', v: { html: tableHTML(['Oktaaviala', 'Merkintä'], [['kontraoktaavi', 'C₁ … H₁'], ['suuri oktaavi', 'C … H'], ['pieni oktaavi', 'c … h'], ['yksiviivainen', 'c¹ … h¹'], ['kaksiviivainen', 'c² … h²'], ['kolmiviivainen', 'c³ … h³'], ['neliviivainen', 'c⁴']]) } },
      { t: '8va ja loco', x: `${K('8va')} = oktaavisiirto: soita oktaavia <b>ylempää</b> kuin on kirjoitettu (viivaston alla 8va = oktaavia alempaa).<br>${K('loco')} = lopettaa oktaavisiirron.`, v: { html: `<div class="eight"><span>8va - - - - ┐</span></div>` } },
      { q: 'Mikä on oktaaviala merkinnällä B₁?', o: ['kontraoktaavi', 'suuri oktaavi', 'pieni oktaavi'], a: 0, e: 'Alaindeksi ₁ = kontraoktaavi.' },
      { q: 'Nimeä nuotti.', v: { staff: { clef: 'g', notes: ['C#6'] } }, o: ['cis³', 'cis²', 'c³'], a: 0, e: 'Kaksi apuviivaa yläpuolella = c³ → korotettuna cis³.' },
      { q: 'Nimeä nuotti.', v: { staff: { clef: 'f', notes: ['E2'] } }, o: ['E', 'e', 'E₁'], a: 0, e: 'F-avaimen alin viiva on G (suuri oktaavi), ja apuviivalla sen alapuolella on E.' },
      { q: 'Nuotin yläpuolella on 8va. Kirjoitettu sävel on c³. Mikä sävel soi?', o: ['c⁴', 'c²', 'c³'], a: 0, e: '8va (ylhäällä) = oktaavia ylempää.' },
    ] },
  ] },
  { id: 'savellajit', title: 'Etumerkit & asteikot', desc: 'Tuplaetumerkit, kaikki sävellajit', lessons: [
    { id: 'etumerkit', title: 'Etumerkit', sub: 'Tuplakorotus, tupla-alennus, enharmonia', steps: [
      { t: 'Viisi merkkiä', v: { html: tableHTML(['Merkki', 'Nimi', 'Vaikutus', 'Nimeen'], [['♯', 'korotusmerkki', '+½', '-is'], ['♭', 'alennusmerkki', '−½', '-es'], ['𝄪', 'tuplakorotusmerkki', '+1', '-isis'], ['𝄫', 'tupla-alennusmerkki', '−1', '-eses'], ['♮', 'palautusmerkki', 'palauttaa', '–']]) }, x: 'Etumerkit ja niiden vaikutus:' },
      { t: 'Tuplakorotus 𝄪', x: `Tuplakorotus nostaa <b>sävelaskeleen</b>: c → cisis, f → fisis, g → gisis. Fisis soi kuin g!`, v: { staff: { clef: 'g', notes: ['C##5', 'F##4', 'G##4'], names: 'fi', colW: 50 } } },
      { t: 'Tupla-alennus 𝄫', x: `Tupla-alennus laskee sävelaskeleen: d → deses, e → eses, a → ases, h → heses.`, v: { staff: { clef: 'g', notes: ['Dbb5', 'Ebb4', 'Abb4', 'Bbb4'], names: 'fi', colW: 50 } } },
      { t: 'Enharmonia', x: `${K('Enharmoninen')} sävel on sama ääni, jolla on eri nimi. Esim. ${N('C#4', 'cis')} = ${N('Db4', 'des')}, ${N('F##4', 'fisis')} = ${N('G4', 'g')}, ${N('B#3', 'his')} = ${N('C4', 'c')}.`, v: { piano: { from: 'C4', oct: 1, marks: [{ n: 'C#4', lab: 'cis = des' }, { n: 'G4', lab: 'g = fisis' }] } } },
      { q: 'Mikä on f:n tuplakorotettu nimi?', o: ['fisis', 'fis', 'feses'], a: 0, e: '𝄪 → -isis.' },
      { q: 'Mikä on des:n enharmoninen vastine?', o: ['cis', 'dis', 'c'], a: 0, e: 'des ja cis ovat sama musta kosketin.' },
      { q: 'Nimeä nuotti.', v: { staff: { clef: 'g', notes: ['Ebb5'] } }, o: ['eses²', 'es²', 'eses¹'], a: 0, e: 'e² tuplaalennettuna = eses².' },
    ] },
    { id: 'molliasteikot-jatko', title: 'Molliasteikot, jatko', sub: '+ itämainen molli', steps: [
      { t: 'Neljä mollia', v: { html: tableHTML(['Molli', 'Muutos luonnolliseen'], [['luonnollinen', '–'], ['harmoninen', '7. korotettu'], ['melodinen', 'ylös 6. ja 7. korotettu, alas luonnollinen'], ['<b>itämainen</b>', '<b>4. ja 7. korotettu</b>']]) }, x: 'Uutena tulee itämainen molli:' },
      { t: 'Itämainen molli', x: `${K('Itämainen molli')}: korota luonnollisesta mollista <b>4. ja 7. sävel</b>. Asteikossa on kaksi isoa hyppyä (ylinouseva sekunti).`, v: [sc('C4', 'itämainen'), { html: stepsHTML(['K', 'P', 'Y', 'P', 'P', 'Y', 'P']) }], play: { notes: T.scale('C4', 'itämainen') } },
      { t: 'Tilapäiset etumerkit', x: 'Tehtävissä asteikot kirjoitetaan <b>tilapäisillä etumerkeillä</b>, eli jokaisen nuotin eteen tulee sen oma ♯/♭ (ei etumerkintää alkuun).', v: sc('F#4', 'itämainen') },
      { q: 'Mikä asteikko?', v: sc('A4', 'itämainen'), o: ['harmoninen a-molli', 'itämainen a-molli', 'melodinen a-molli'], a: 1, e: 'dis (4.) ja gis (7.) korotettu → itämainen.' },
      { q: 'Itämaisessa e-mollissa korotetaan…', o: ['a → ais ja d → dis', 'c → cis ja d → dis', 'f → fis'], a: 0, e: 'e-mollin 4. on a ja 7. on d.' },
      { q: 'Harmoninen gis-molli: mikä on 7. sävel?', o: ['fis', 'fisis', 'g'], a: 1, e: 'gis-mollissa (5♯) on jo fis; korotettuna → fisis.' },
    ] },
    { id: 'asteikot-kertaus-jatko', title: 'Asteikkojen kertausta, jatko', sub: 'Duurit ja mollit tilapäisin etumerkein', steps: [
      { t: 'Resepti muistiin', v: [{ html: '<b>Duuri</b>' + stepsHTML(['K', 'K', 'P', 'K', 'K', 'K', 'P']) }, { html: '<b>Luonnollinen molli</b>' + stepsHTML(['K', 'P', 'K', 'K', 'P', 'K', 'K']) }], x: 'Kaikki asteikot rakentuvat näistä:' },
      { t: 'Tapa 1: laske askeleet', x: 'Kirjoita 8 nuottia (joka viiva/väli) ja tarkista askel kerrallaan, tarvitaanko ♯ tai ♭.' },
      { t: 'Tapa 2: muista etumerkintä', x: 'Nopeampi tapa: tiedä sävellajin etumerkit ja lisää ne tilapäisinä oikeisiin nuotteihin. Mollissa lisää vielä muodon korotukset.', v: sc('E4', 'harmoninen'), play: { notes: T.scale('E4', 'harmoninen') } },
      { q: 'Mikä asteikko?', v: sc('Bb3', 'duuri'), o: ['B-duuri', 'H-duuri', 'Es-duuri'], a: 0, e: 'b c d es f g a b = B-duuri (2♭).' },
      { q: 'Mikä asteikko?', v: sc('F4', 'melodinen'), o: ['harmoninen f-molli', 'melodinen f-molli', 'F-duuri'], a: 1, e: 'f g as b c d e f: 6. (d) ja 7. (e) korotettu → melodinen.' },
    ] },
    { id: 'uudet-asteikot-jatko', title: 'Uusia asteikkoja, jatko', sub: '5–7 etumerkkiä', steps: [
      { t: 'Kaikki loput sävellajit', v: { html: tableHTML(['Merkit', 'Duuri', 'Molli'], [['5♯', 'H', 'gis'], ['6♯', 'Fis', 'dis'], ['7♯', 'Cis', 'ais'], ['5♭', 'Des', 'b'], ['6♭', 'Ges', 'es'], ['7♭', 'Ces', 'as']]) }, x: 'Uudet sävellajit taulukkona:' },
      { t: 'H-duuri ja gis-molli', v: [{ staff: { clef: 'g', key: 5, notes: [] } }, sc('B3', 'duuri', 'g', { key: 5, forceAcc: false })], x: '5 korotusta: fis cis gis dis ais.', play: { notes: T.scale('B3', 'duuri') } },
      { t: 'Des-duuri ja b-molli', v: [{ staff: { clef: 'g', key: -5, notes: [] } }, sc('Db4', 'duuri', 'g', { key: -5, forceAcc: false })], x: '5 alennusta: b es as des ges.', play: { notes: T.scale('Db4', 'duuri') } },
      { t: 'Enharmoniset sävellajit', x: `Fis-duuri (6♯) ja Ges-duuri (6♭) <b>kuulostavat täysin samalta</b>. Samoin H = Ces ja Cis = Des.`, v: { circle: 6 } },
      { q: 'Mikä duuri ja molli?', v: { staff: { clef: 'g', key: 6, notes: [] } }, o: ['Fis – dis', 'H – gis', 'Cis – ais'], a: 0, e: 'Viimeinen korotus eis → puoli sävelaskelta ylös = Fis.' },
      { q: 'Mikä duuri ja molli?', v: { staff: { clef: 'f', key: -6, notes: [] } }, o: ['Des – b', 'Ges – es', 'Ces – as'], a: 1, e: 'Toiseksi viimeinen alennus ges → Ges-duuri, es-molli.' },
      { q: 'Montako etumerkkiä on ais-mollissa?', o: ['5♯', '6♯', '7♯'], a: 2, e: 'ais-molli on Cis-duurin rinnakkaissävellaji, eli 7♯.' },
    ] },
    { id: 'kromaattinen', title: 'Kromaattinen asteikko', sub: 'Kaikki puolisävelaskeleet', steps: [
      { t: 'Kaikki 12 säveltä', x: `${K('Kromaattinen asteikko')} etenee pelkin puolisävelaskelin. Oktaavissa on 12 eri säveltä.`, v: { piano: { from: 'C4', oct: 1, marks: ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'] } }, play: { notes: ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'], gap: 0.22 } },
      { t: 'Duuriasteikkoon pohjautuva', x: `Kirjoita ensin duuriasteikko. Täytä kokoaskeleiden väliin puuttuvat sävelet: <b>ylöspäin korotuksin (♯)</b>, <b>alaspäin alennuksin (♭)</b>. Asteikon omat sävelet pysyvät.`, v: [{ staff: { clef: 'g', notes: T.chromatic('C4').up, names: 'fi', forceAcc: true, colW: 26 } }, { staff: { clef: 'g', notes: T.chromatic('C4').down, names: 'fi', forceAcc: true, colW: 26 } }] },
      { t: 'Molliasteikkoon pohjautuva', x: 'Sama periaate luonnollisen mollin pohjalta.', v: { staff: { clef: 'g', notes: T.chromatic('A4', 'molli').up, names: 'fi', forceAcc: true, colW: 26 } } },
      { q: 'C-duuriin pohjautuva kromaattinen asteikko ylöspäin: mikä sävel tulee c:n ja d:n väliin?', o: ['cis', 'des'], a: 0, e: 'Ylöspäin korotuksin → cis.' },
      { q: 'Alaspäin: mikä sävel tulee e:n ja d:n väliin?', o: ['dis', 'es'], a: 1, e: 'Alaspäin alennuksin → es.' },
    ] },
    { id: 'kvinttiympyra-jatko', title: 'Kvinttiympyrä & etumerkintätaulukko', sub: 'Kaikki 30 sävellajia', steps: [
      { t: 'Koko kvinttiympyrä', x: 'Myötäpäivään ♯ lisääntyy, vastapäivään ♭ lisääntyy. Alhaalla Fis = Ges (enharmoniset). Klikkaa sävellajeja!', v: { circle: 0, interactive: true } },
      { t: 'Lorut', x: `Korotusmerkkiduuriloru: <b>G</b>ideon <b>D</b>aavid <b>A</b>atami <b>E</b>eva <b>H</b>yppäsivät <b>Fis</b>sistä <b>Cis</b>siin<br>Alennusmerkkiduuriloru: <b>F</b>iksusta <b>B</b>oksista <b>Es</b>iin <b>As</b>tuu <b>Des</b>pootti <b>Ges</b> <b>Ces</b>` },
      { t: 'Etumerkintätaulukko: korotukset', v: { html: tableHTML(['Duuri', 'Molli', 'Etumerkit'], [['G', 'e', 'fis'], ['D', 'h', 'fis cis'], ['A', 'fis', 'fis cis gis'], ['E', 'cis', 'fis cis gis dis'], ['H', 'gis', 'fis cis gis dis ais'], ['Fis', 'dis', 'fis cis gis dis ais eis'], ['Cis', 'ais', 'fis cis gis dis ais eis his']]) }, x: 'Korotusten järjestys: fis cis gis dis ais eis his' },
      { t: 'Etumerkintätaulukko: alennukset', v: { html: tableHTML(['Duuri', 'Molli', 'Etumerkit'], [['F', 'd', 'b'], ['B', 'g', 'b es'], ['Es', 'c', 'b es as'], ['As', 'f', 'b es as des'], ['Des', 'b', 'b es as des ges'], ['Ges', 'es', 'b es as des ges ces'], ['Ces', 'as', 'b es as des ges ces fes']]) }, x: 'Alennusten järjestys: b es as des ges ces fes (korotukset takaperin!)' },
      { q: 'Mikä on 6. korotusmerkki järjestyksessä?', o: ['ais', 'eis', 'his'], a: 1, e: 'fis cis gis dis ais EIS his.' },
      { q: 'Mikä on Ces-duurin rinnakkaissävellaji?', o: ['as-molli', 'es-molli', 'b-molli'], a: 0, e: 'Ces − pi3 = as.' },
      { q: 'Yhdistä: E-duuri ↔ ?', o: ['cis-molli', 'c-molli', 'e-molli'], a: 0, e: 'E-duuri (4♯) = cis-molli.' },
    ] },
  ] },
  { id: 'iv3', title: 'Intervallit', desc: 'Kaikki laadut ja käännökset', lessons: [
    { id: 'intervallit', title: 'Intervallit', sub: 'y, v, nooni ja desimi', steps: [
      { t: 'Sääntö pysyy samana', x: BIG('Jos ylempi sävel kuuluu alemman duuriasteikkoon → <b>suuri</b> tai <b>puhdas</b>. Sitten säädetään puolisävelaskelin.'), v: { html: `<div class="ivmap"><span class="iv y">Ylinouseva</span><br>↗ +1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; +1 ↖<br><span class="iv s">SUURI</span> &nbsp;&nbsp; <span class="iv pu">PUHDAS</span><br>↓ −1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; −1 ↓<br><span class="iv p">Pieni</span> −1 → <span class="iv v">Vähennetty</span></div>` } },
      { t: 'Yli oktaavin: nooni ja desimi', x: `${K('Nooni (9)')} = oktaavi + sekunti. ${K('Desimi (10)')} = oktaavi + terssi. Laatu määräytyy samalla tavalla: s9, pi9, s10, pi10, y9…`, v: { staff: { clef: 'g', notes: [['C4', 'D5'], ['C4', 'E5']], labels: ['s9', 's10'], colW: 50 } } },
      { t: 'Alaspäin muodostaminen ↓', x: 'Kun intervalli muodostetaan <b>alaspäin</b>, mieti: "minkä sävelen duuriasteikossa annettu sävel on?" Esim. pi3↓ e¹:stä: cis–e on pi3 → <b>cis¹</b>.' },
      { q: 'Mikä intervalli?', v: { staff: { clef: 'g', notes: [['E4', 'C5']] } }, o: ['pi6', 's6', 'y5'], a: 0, e: 'E-duurissa cis (s6). Tässä c → pi6.' },
      { q: 'Mikä intervalli?', v: { staff: { clef: 'g', notes: [['Bb4', 'E5']], forceAcc: true } }, o: ['pu4', 'y4', 'v5'], a: 1, e: 'B-duurissa es (pu4). Tässä e → y4.' },
      { q: 'Muodosta s9 ylöspäin sävelestä d¹.', o: ['e²', 'e¹', 'es²'], a: 0, e: 'Oktaavi d² + s2 = e².' },
      { q: 'Muodosta pi3 alaspäin sävelestä g¹.', o: ['e¹', 'es¹', 'eis¹'], a: 0, e: 'e–g on pieni terssi (1½ sävelaskelta) → e¹.' },
    ] },
    { id: 'kaannosintervallit', title: 'Käännösintervallit', sub: 'Summa on 9', steps: [
      { t: 'Käännös = alempi sävel ylös oktaavilla', x: `Kun intervallin alempi sävel siirretään oktaavia ylemmäs (tai ylempi alemmas), syntyy ${K('käännösintervalli')}.`, v: { staff: { clef: 'g', notes: [['C4', 'E4'], ['E4', 'C5']], labels: ['s3', 'pi6'], colW: 60 } }, play: { seq: [['C4', 'E4'], ['E4', 'C5']] } },
      { t: 'Kaksi sääntöä', x: `1. Numerot yhteensä <b>9</b>: 2↔7, 3↔6, 4↔5, 1↔8.<br>2. Laatu kääntyy: <b>suuri ↔ pieni</b>, <b>ylinouseva ↔ vähennetty</b>, <b>puhdas ↔ puhdas</b>.`, v: { html: tableHTML(['Intervalli', 'pu1', 'pi2', 's2', 'pi3', 's3', 'pu4', 'y4', 'v5', 'pu5', 'pi6', 's6', 'pi7', 's7', 'pu8'], [['Käännös', 'pu8', 's7', 'pi7', 's6', 'pi6', 'pu5', 'v5', 'y4', 'pu4', 's3', 'pi3', 's2', 'pi2', 'pu1']], 'small') } },
      { q: 'Mikä on s3:n käännösintervalli?', o: ['pi6', 's6', 'pi5'], a: 0, e: '3 + 6 = 9, suuri → pieni.' },
      { q: 'Mikä on y4:n käännösintervalli?', o: ['v5', 'y5', 'pu5'], a: 0, e: '4 + 5 = 9, ylinouseva → vähennetty.' },
      { q: 'Mikä on pu5:n käännösintervalli?', o: ['pu4', 'pi4', 'pu5'], a: 0, e: 'Puhdas pysyy puhtaana; 5 + 4 = 9.' },
      { q: 'Mikä on pi2:n käännösintervalli?', o: ['s7', 'pi7', 's6'], a: 0, e: '2 + 7 = 9, pieni → suuri.' },
    ] },
  ] },
  { id: 'transp3', title: 'Transponointi', desc: 'Siirrot ja sävellajin tunnistaminen', lessons: [
    { id: 'transponointi-jatko', title: 'Transponointi, jatko', sub: 'Tunnista sävellaji ensin', steps: [
      { t: 'Ensin: mikä sävellaji?', x: `Katso etumerkintä → duuri tai molli. Sitten katso <b>loppusävel</b> ja onko melodiassa <b>johtosävel</b> (korotettu 7.) → molli.<br>Esim. 1♯ ja lopussa e, matkalla dis → <b>e-molli</b>.`, v: { staff: { clef: 'g', key: 1, notes: ['E4', 'G4', 'B4', 'D#5', 'E5'], names: 'fi' } } },
      { t: 'Sitten: siirto', x: 'Laske uusi sävellaji intervallilla, kirjoita uusi etumerkintä ja siirrä jokainen nuotti saman verran. Tilapäiset etumerkit siirtyvät mukana (esim. dis → johtosävel myös uudessa sävellajissa).' },
      { q: 'h-mollin melodia transponoidaan pu4 alaspäin. Uusi sävellaji?', o: ['fis-molli', 'e-molli', 'g-molli'], a: 0, e: 'h – a – g – fis: 4 porrasta alas = fis (h–fis on pu4 alaspäin).' },
      { q: 'Melodiassa on 2♭ ja lopussa g, matkalla fis. Mikä sävellaji?', o: ['B-duuri', 'g-molli', 'd-molli'], a: 1, e: '2♭ = B / g. Lopetus g:hen ja johtosävel fis → g-molli.' },
      { q: 'A-duurin melodia siirretään pi3 ylöspäin. Uusi etumerkintä?', o: ['C-duuri, ei etumerkkejä', 'Cis-duuri, 7♯', 'H-duuri 5♯'], a: 0, e: 'a + pi3 = c → C-duuri.' },
    ] },
    { id: 'lisaa-transp-jatko', title: 'Lisää transponointia, jatko', sub: 'Sävel kerrallaan', steps: [
      { t: 'Tarkista jokainen intervalli', x: 'Hyvä tapa tarkistaa: alkuperäisen ja uuden melodian jokaisen nuotin välisen intervallin pitää olla sama.' },
      { q: 'Transponoi sävel fis¹ s3 ylöspäin.', o: ['ais¹', 'a¹', 'b¹'], a: 0, e: 'Fis-duurin 3. sävel = ais.' },
      { q: 'Transponoi sävel es² pu5 alaspäin.', o: ['as¹', 'a¹', 'ges¹'], a: 0, e: 'As-duurin 5. sävel on es → as¹.' },
      { q: 'F-duurin melodia siirretään s2 alaspäin. Uusi sävellaji?', o: ['Es-duuri', 'E-duuri', 'G-duuri'], a: 0, e: 'f − s2 = es → Es-duuri (3♭).' },
    ] },
  ] },
  { id: 'kolmi3', title: 'Kolmisoinnut', desc: 'Rakenne, asteet, käännökset', lessons: [
    { id: 'kolmisointu-rakenne-jatko', title: 'Kolmisointujen intervallirakenne, jatko', sub: 'D Y M V', steps: [
      { t: 'Neljä sointua, neljä kirjainta', x: 'Tehtävissä: <b>D</b> = duuri, <b>Y</b> = ylinouseva, <b>M</b> = molli, <b>V</b> = vähennetty.', v: { html: tableHTML(['', 'Rakenne', 'Kvintti', 'Merkki'], [['D', 's3 + pi3', 'pu5', 'C'], ['M', 'pi3 + s3', 'pu5', 'Cm'], ['Y', 's3 + s3', 'y5', 'C+'], ['V', 'pi3 + pi3', 'v5', 'C°']]) } },
      { t: 'Alaspäin muodostaminen', x: 'Jos sointu muodostetaan annetusta sävelestä <b>alaspäin</b>, annettu sävel on <b>kvintti</b> (ylin). Esim. Y alaspäin g²:stä: kvintti g → pohjasävel es, terssi g… → <b>es g h</b> (Es+).' },
      { q: 'Muodosta M (molli) ylöspäin sävelestä fis¹.', o: ['fis¹ a¹ cis²', 'fis¹ ais¹ cis²', 'fis¹ a¹ c²'], a: 0, e: 'pi3 (fis–a) + s3 (a–cis).' },
      { q: 'Muodosta V (vähennetty) ylöspäin sävelestä e¹.', o: ['e¹ g¹ b¹', 'e¹ g¹ h¹', 'e¹ gis¹ h¹'], a: 0, e: 'pi3 + pi3: e–g–b.' },
      { q: 'Mikä sointu?', v: { staff: { clef: 'g', notes: [tri('Ab4', 'ylinouseva')], forceAcc: true } }, o: ['A♭+', 'A♭', 'A♭m'], a: 0, e: 'as c e = s3 + s3 → ylinouseva.' },
    ] },
    { id: 'sointuasteet', title: 'Sointuasteet duurissa ja mollissa', sub: 'Kertaus + kaikki sävellajit', steps: [
      { t: 'Kaksi muistitaulukkoa', v: { html: '<b>Duuri</b>' + tableHTML(['Duurisointuja', 'Mollisointuja', 'Vähennetty'], [['I IV V', 'II III VI', 'VII']]) + '<b>Harmoninen molli</b>' + tableHTML(['Mollisointuja', 'Duurisointuja', 'Vähennettyjä', 'Ylinouseva'], [['I IV', 'V VI', 'II VII', 'III']]) }, x: 'Nämä pätevät kaikissa sävellajeissa.' },
      { t: 'Merkintä "sävellaji:aste"', x: `<b>Es:V</b> = Es-duurin V aste = B. <b>fis:I</b> = fis-mollin I aste = F♯m. <b>c:VII</b> = c-mollin VII aste = H°.<br>Iso kirjain = duuri, pieni = molli.` },
      { q: 'Mikä sointu on As:IV?', o: ['D♭', 'D♭m', 'E♭'], a: 0, e: 'As-duurin 4. sävel des; IV = duuri → D♭.' },
      { q: 'Mikä sointu on gis:III?', o: ['H+', 'H', 'Hm'], a: 0, e: 'gis-mollin III aste on ylinouseva: h dis fisis → H+.' },
      { q: 'Mikä sointu on c:VII?', o: ['H°', 'B', 'B°'], a: 0, e: 'Harmonisen c-mollin 7. sävel on h (johtosävel) → h d f = H°.' },
      { q: 'Sointu Em on G-duurissa aste…', o: ['VI', 'III', 'II'], a: 0, e: 'G a h c d E → 6. aste.' },
    ] },
    { id: 'kaannokset', title: 'Kolmisoinnun käännökset', sub: 'Perusmuoto, sekstisointu, kvarttisekstisointu', steps: [
      { t: 'Kolme muotoa – kuka on alimpana?', x: 'Kolmisoinnun sävelet voi järjestää uudelleen. Tärkeintä on, mikä sävel on <b>alimpana</b>.', v: { staff: { clef: 'g', notes: [{ n: ['C4', 'E4', 'G4'], lab: 'C:I' }, { n: ['E4', 'G4', 'C5'], lab: 'C:I⁶' }, { n: ['G4', 'C5', 'E5'], lab: 'C:I⁶₄' }], colW: 70 } }, play: { seq: [['C4', 'E4', 'G4'], ['E4', 'G4', 'C5'], ['G4', 'C5', 'E5']] } },
      { t: 'Nimet ja merkinnät', v: { html: tableHTML(['Alimpana', 'Nimi', 'Toinen nimi', 'Merkintä'], [['pohjasävel', '<b>terssikvinttisointu</b>', 'perusmuoto', 'I'], ['terssi', '<b>sekstisointu</b>', 'terssikäännös', 'I⁶'], ['kvintti', '<b>kvarttisekstisointu</b>', 'kvinttikäännös', 'I⁶₄']]) }, x: 'Nimi tulee bassosta laskettavista intervalleista:' },
      { t: 'Miksi "sekstisointu"?', x: 'Kun terssi on alimpana (e g c), bassosta ylimpään (e → c) on <b>seksti</b>. Kvarttisekstisoinnussa (g c e) bassosta on <b>kvartti</b> (g → c) ja <b>seksti</b> (g → e).' },
      { t: 'Asemat: kuka on ylimpänä?', x: `${K('Oktaaviasema')} = pohjasävel ylimpänä · ${K('terssiasema')} = terssi ylimpänä · ${K('kvinttiasema')} = kvintti ylimpänä.`, v: { staff: { clef: 'g', notes: [{ n: ['C4', 'E4', 'G4'], lab: 'kvinttiasema' }, { n: ['E4', 'G4', 'C5'], lab: 'oktaaviasema' }, { n: ['G4', 'C5', 'E5'], lab: 'terssiasema' }], colW: 90 } } },
      { q: 'Mikä käännös? (a c f)', v: { staff: { clef: 'g', notes: [['A4', 'C5', 'F5']] } }, o: ['perusmuoto', 'sekstisointu', 'kvarttisekstisointu'], a: 1, e: 'Sointu on F (f a c). Alimpana terssi a → sekstisointu (F:I⁶ tai C:IV⁶).' },
      { q: 'Mikä käännös? (d g h)', v: { staff: { clef: 'g', notes: [['D4', 'G4', 'B4']] } }, o: ['sekstisointu', 'kvarttisekstisointu', 'perusmuoto'], a: 1, e: 'Sointu G (g h d), alimpana kvintti d → kvarttisekstisointu.' },
      { q: 'Muodosta G:V⁶. Mitkä sävelet alhaalta?', o: ['fis a d', 'd fis a', 'a d fis'], a: 0, e: 'G:V = D (d fis a). ⁶ = terssi alimpana → fis a d.' },
    ] },
  ] },
  { id: 'sept', title: 'Septimisoinnut', desc: 'Nelisoinnut asteilla', lessons: [
    { id: 'sept-asteet', title: 'Sointuasteet duurissa: septimisoinnut', sub: 'Lumiukkoon neljäs pallo', steps: [
      { t: 'Neljäs kerros', x: `Kun kolmisoinnun päälle lisätään vielä yksi terssi, syntyy ${K('septimisointu')} (nelisointu). Ylin sävel on pohjasävelestä <b>septimin</b> päässä. Merkintä: <b>I⁷</b>.`, v: { staff: { clef: 'g', notes: [0, 1, 2, 3, 4, 5, 6].map(i => ({ n: T.degreeChord(T.scale('C4', 'duuri'), i, 4), lab: ['I⁷', 'II⁷', 'III⁷', 'IV⁷', 'V⁷', 'VI⁷', 'VII⁷'][i] })), colW: 46 } } },
      { t: 'Muistitaulukko', v: { html: tableHTML(['Asteet', 'Sointu', 'Merkki (C:)'], [['<b>I IV</b>', 'duurisuurseptimisointu', 'Cmaj7, Fmaj7'], ['<b>V</b>', 'duuripieniseptimisointu', 'G7'], ['<b>II III VI</b>', 'mollipieniseptimisointu', 'Dm7, Em7, Am7'], ['<b>VII</b>', 'vähennetty pieniseptimisointu', 'Hm7♭5']]) }, x: 'Duurissa:' },
      { t: 'Kuuntele V⁷ → I', x: 'Duuripieniseptimisointu (V⁷) kuulostaa siltä, että sen täytyy päästä kotiin.', play: { seq: [['G3', 'B3', 'D4', 'F4'], ['C4', 'E4', 'G4', 'C5']] }, v: { staff: { clef: 'g', notes: [{ n: ['G4', 'B4', 'D5', 'F5'], lab: 'G7' }, { n: ['C5', 'E5', 'G5'], lab: 'C' }], colW: 60 } } },
      { q: 'Mikä sointu on D:V⁷?', o: ['A7', 'Amaj7', 'Am7'], a: 0, e: 'D-duurin V = a; V⁷ = duuripieniseptimisointu → A7 (a cis e g).' },
      { q: 'Mikä sointu on F:II⁷?', o: ['Gm7', 'G7', 'Gmaj7'], a: 0, e: 'II⁷ = mollipieniseptimisointu → Gm7 (g b d f).' },
      { q: 'Mikä sointu on B:VII⁷?', o: ['Am7♭5', 'A7', 'Am7'], a: 0, e: 'VII⁷ = vähennetty pieniseptimisointu → Am7♭5 (a c es g).' },
    ] },
    { id: 'sept-rakenne', title: 'Septimisointujen intervallirakenne', sub: 'Kolme terssiä päällekkäin', steps: [
      { t: 'Rakenne alhaalta ylös', v: { html: tableHTML(['Sointu', 'Terssit', 'Septimi', 'Merkki'], [['Duurisuurseptimisointu', 's3 + pi3 + s3', 's7', 'Cmaj7'], ['Duuripieniseptimisointu', 's3 + pi3 + pi3', 'pi7', 'C7'], ['Mollipieniseptimisointu', 'pi3 + s3 + pi3', 'pi7', 'Cm7'], ['Vähennetty pieniseptimisointu', 'pi3 + pi3 + s3', 'pi7', 'Cm7♭5']]) }, x: 'Nimi kertoo kaksi asiaa: <b>kolmisoinnun</b> (duuri/molli/vähennetty) + <b>septimin</b> (suuri/pieni).' },
      { t: 'Kuvana C:stä', v: { staff: { clef: 'g', notes: [{ n: T.chord('C4', 'maj7'), lab: 'Cmaj7' }, { n: T.chord('C4', 'dom7'), lab: 'C7' }, { n: T.chord('C4', 'm7'), lab: 'Cm7' }, { n: T.chord('C4', 'm7b5'), lab: 'Cm7♭5' }], forceAcc: true, colW: 64 } }, x: 'Kuuntele eroja napeista:', play: { seq: [T.chord('C4', 'maj7'), T.chord('C4', 'dom7'), T.chord('C4', 'm7'), T.chord('C4', 'm7b5')] } },
      { q: 'Duurikolmisointu + pieni septimi = ?', o: ['duuripieniseptimisointu (7)', 'duurisuurseptimisointu (maj7)', 'mollipieniseptimisointu (m7)'], a: 0, e: 'Duuri + pi7 = esim. C7.' },
      { q: 'Mikä on vähennetyn pieniseptimisoinnun rakenne?', o: ['pi3 + pi3 + s3', 'pi3 + s3 + pi3', 's3 + pi3 + pi3'], a: 0, e: 'Vähennetty kolmisointu (pi3+pi3) + s3 = pi7.' },
    ] },
    { id: 'sept-merkit', title: 'Sointumerkit: septimisoinnut', sub: 'maj7, 7, m7, m7♭5', steps: [
      { t: 'Neljä merkkiä', x: `${K('Gmaj7')} = g h d fis · ${K('G7')} = g h d f · ${K('Gm7')} = g b d f · ${K('Gm7♭5')} = g b des f`, v: { staff: { clef: 'g', notes: [{ n: T.chord('G4', 'maj7'), lab: 'Gmaj7' }, { n: T.chord('G4', 'dom7'), lab: 'G7' }, { n: T.chord('G4', 'm7'), lab: 'Gm7' }, { n: T.chord('G4', 'm7b5'), lab: 'Gm7♭5' }], forceAcc: true, colW: 64 } } },
      { t: 'Vinkki: aloita kolmisoinnusta', x: '1. Tee kolmisointu (G, Gm tai G°).<br>2. Lisää septimi: <b>maj7</b> = suuri septimi, muut = pieni septimi.' },
      { q: 'Mitkä sävelet ovat Dmaj7:ssä?', o: ['d fis a cis', 'd fis a c', 'd f a c'], a: 0, e: 'D (d fis a) + s7 (cis).' },
      { q: 'Mitkä sävelet ovat E7:ssä?', o: ['e gis h d', 'e gis h dis', 'e g h d'], a: 0, e: 'E (e gis h) + pi7 (d).' },
      { q: 'Mikä sointu?', v: { staff: { clef: 'g', notes: [T.chord('A4', 'm7')], forceAcc: true } }, o: ['Am7', 'A7', 'Amaj7'], a: 0, e: 'a c e g: molli + pi7 → Am7.' },
    ] },
  ] },
  { id: 'saveltajat', title: 'Säveltäjiä', desc: 'Aikakaudet ja säveltäjät', lessons: [
    { id: 'saveltajat', title: 'Säveltäjiä', sub: 'Aikajana renessanssista Beatlesiin', steps: [
      { t: 'Musiikin aikakaudet', x: 'Aikajana:', v: { html: timelineHTML() } },
      { t: 'Muistikikka: B-B-K-R', x: `Renessanssi → <b>B</b>arokki (Bach!) → <b>K</b>lassismi (Mozart) → <b>R</b>omantiikka (Chopin) → Impressionismi (Debussy) → Ekspressionismi (Schönberg).<br>Bach kuoli <b>1750</b>, ja samana vuonna barokki päättyy.` },
      { t: 'Suomalainen: Jean Sibelius 🇫🇮', x: 'Sibelius (1865–1957) luetaan romantiikkaan.' },
      { q: 'Mihin aikakauteen Bach kuuluu?', o: ['Barokki', 'Klassismi', 'Romantiikka'], a: 0, e: 'J. S. Bach 1685–1750 = barokki.' },
      { q: 'Kuka eli 1756–1791?', o: ['Mozart', 'Beethoven', 'Haydn'], a: 0, e: 'W. A. Mozart 1756–1791.' },
      { q: 'Mihin aikakauteen Debussy kuuluu?', o: ['Impressionismi', 'Ekspressionismi', 'Barokki'], a: 0, e: 'Debussy 1862–1918 = impressionismi.' },
      { q: 'Kuka on renessanssin säveltäjä?', o: ['Palestrina', 'Schönberg', 'Chopin'], a: 0, e: 'Palestrina 1525–1594.' },
      { q: 'Mihin aikakauteen Schönberg kuuluu?', o: ['Ekspressionismi', 'Klassismi', 'Renessanssi'], a: 0, e: 'Arnold Schönberg 1874–1951.' },
    ] },
  ] },
  ],
},
];

const GLOSSARY = [
  ['aste', 'Asteikon sävelen järjestysnumero (I–VII). Sointuasteet merkitään roomalaisin numeroin.'],
  ['alennusmerkki ♭', 'Laskee säveltä puolisävelaskeleen. Nimeen -es (e → es, a → as, h → b).'],
  ['dominantti (D)', 'Asteikon 5. sävel ja sille rakennettu V asteen sointu.'],
  ['enharmoninen', 'Sama sävel eri nimellä, esim. cis = des.'],
  ['etumerkintä', 'Kiinteät etumerkit sävellyksen alussa, ne määräävät sävellajin.'],
  ['etumerkki', 'Korotus-, alennus- tai palautusmerkki.'],
  ['intervalli', 'Kahden sävelen välimatka.'],
  ['johtosävel', 'Duuri- tai harmonisen molliasteikon 7. sävel (puolisävelaskeleen päässä toonikasta).'],
  ['kolmisointu', 'Kolme säveltä terssien välein: pohjasävel, terssi, kvintti.'],
  ['korotusmerkki ♯', 'Nostaa säveltä puolisävelaskeleen. Nimeen -is.'],
  ['kromaattinen asteikko', 'Asteikko, joka etenee pelkin puolisävelaskelin (12 säveltä).'],
  ['kvarttisekstisointu', 'Kolmisoinnun käännös, jossa kvintti on alimpana (I⁶₄).'],
  ['kvinttiympyrä', 'Sävellajit kvintin välein ympyrässä: myötäpäivään ♯, vastapäivään ♭.'],
  ['käännösintervalli', 'Intervalli käännettynä. Numerot yhteensä 9, suuri↔pieni, y↔v, puhdas pysyy.'],
  ['loco', 'Lopettaa oktaavisiirron.'],
  ['8va', 'Oktaavisiirto: soitetaan oktaavia ylempää (tai alempaa, jos merkintä on alla).'],
  ['oktaaviala', 'Sävelten "kerros": suuri, pieni, yksiviivainen (c¹), kaksiviivainen (c²)…'],
  ['palautusmerkki ♮', 'Kumoaa korotuksen tai alennuksen.'],
  ['perusmuoto', 'Kolmisointu, jossa pohjasävel on alimpana (terssikvinttisointu).'],
  ['puoli sävelaskelta', 'Pienin askel: vierekkäiset koskettimet pianossa.'],
  ['rinnakkaissävellajit', 'Duuri ja molli, joilla on sama etumerkintä (C-duuri ja a-molli).'],
  ['sekstisointu', 'Kolmisoinnun käännös, jossa terssi on alimpana (I⁶).'],
  ['septimisointu', 'Nelisointu: kolmisointu + septimi.'],
  ['sävellaji', 'Duuri- tai molliasteikko, jota sävellys noudattaa.'],
  ['subdominantti (S)', 'Asteikon 4. sävel ja sille rakennettu IV asteen sointu.'],
  ['tahtiosoitus', 'Murtoluku, joka kertoo iskujen määrän ja iskun arvon (esim. 3/4).'],
  ['toonika (T)', 'Asteikon 1. sävel ja I asteen sointu, "koti".'],
  ['transponointi', 'Sävelmän siirtäminen toiseen sävelkorkeuteen tai sävellajiin.'],
  ['trioli', 'Kolme nuottia kahden saman arvoisen ajassa.'],
  ['tritonus', 'Ylinouseva kvartti (kolme sävelaskelta).'],
  ['tuplakorotusmerkki 𝄪', 'Nostaa sävelaskeleen. Nimeen -isis.'],
  ['tupla-alennusmerkki 𝄫', 'Laskee sävelaskeleen. Nimeen -eses.'],
  ['itämainen molli', 'Molli, jonka 4. ja 7. sävel on korotettu.'],
];

/* Yksi yhteinen polku: oppitunnit aiheittain oppimisen kannalta järkevässä järjestyksessä. */
const LESSONS = {};
PATHS.forEach(p => p.modules.forEach(m => m.lessons.forEach(l => { LESSONS[l.id] = l; })));
const COURSE = {
  id: 'polku', title: 'Sävelpolku', sub: 'Musiikin teoria aiheittain',
  modules: [
    { id: 'rytmi', icon: '♩♪', title: 'Rytmi', desc: 'Nuottiarvot, tauot, triolit ja tahtiviivat', ids: ['pyramidi', 'nuotit-tauot', 'nuottitalo', 'nuotit-tauot-jatko', 'tahtiviivat'] },
    { id: 'nimet', icon: 'c¹', title: 'Sävelten nimet', desc: 'Oktaavialat ja etumerkit', ids: ['oktaavialat', 'oktaavialat-jatko', 'nimi-oktaavi', 'etumerkit'] },
    { id: 'asteikot', icon: '♯♭', title: 'Asteikot ja sävellajit', desc: 'Duurit, mollit, kvinttiympyrä, kromatiikka', ids: ['asteikot-kertaus', 'uudet-asteikot', 'uudet-asteikot-jatko', 'kvinttiympyra', 'kvinttiympyra-jatko', 'molliasteikot', 'molliasteikot-jatko', 'asteikot-kertaus-jatko', 'kromaattinen'] },
    { id: 'intervallit', icon: 's3', title: 'Intervallit', desc: 'Suuret, pienet, puhtaat, y, v ja käännökset', ids: ['iv-suuret-puhtaat', 'iv-suuret-pienet', 'iv-puhtaat-vahennetyt', 'iv-ylinousevat', 'intervallit', 'kaannosintervallit'] },
    { id: 'kolmisoinnut', icon: 'Dm', title: 'Kolmisoinnut', desc: 'Rakenne, sointumerkit, sointusysteemi', ids: ['kolmisointu', 'kolmisointu-rakenne', 'sointumerkit', 'sointusysteemi', 'kolmisointu-rakenne-jatko'] },
    { id: 'asteet', icon: 'IV', title: 'Sointuasteet ja käännökset', desc: 'I–VII duurissa ja mollissa, T S D', ids: ['sointuasteet-duuri', 'sointuasteet-molli', 'sointuasteet', 'kaannokset'] },
    { id: 'septimit', icon: 'G7', title: 'Septimisoinnut', desc: 'maj7, 7, m7, m7♭5', ids: ['sept-rakenne', 'sept-merkit', 'sept-asteet'] },
    { id: 'transponointi', icon: '⇅', title: 'Transponointi', desc: 'Melodian siirtäminen', ids: ['transponointi', 'lisaa-transp', 'transponointi-jatko', 'lisaa-transp-jatko'] },
    { id: 'saveltajat', icon: '1750', title: 'Säveltäjät', desc: 'Aikakaudet', ids: ['saveltajat'] },
  ],
};
COURSE.modules.forEach(m => { m.lessons = m.ids.map(id => LESSONS[id]); });
const ORDER = COURSE.modules.flatMap(m => m.lessons.map(l => l.id));
