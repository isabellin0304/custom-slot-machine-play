// Self-contained vector covers. Only colours from this fixed palette enter the SVG.
const palettes = [
  ['草莓奶霜', '#F6D5DE', '#D987A0', '#AF5978', '#FBEAEF', 'cherries'],
  ['蜜桃奶昔', '#F8DDCC', '#E2A280', '#AB7053', '#FBEDE1', 'peach'],
  ['香草布丁', '#F6E8B9', '#D9B96A', '#A3803C', '#FBF3D6', 'star'],
  ['開心果奶油', '#DDEBCF', '#A1BC88', '#6B895C', '#EEF3E1', 'clover'],
  ['薄荷牛奶', '#D1EAE3', '#8EBDAE', '#598E82', '#E8F3EA', 'cup'],
  ['天空奶昔', '#D7E7F8', '#95B5D4', '#6486A7', '#EAF1F8', 'moon'],
  ['薰衣草奶霜', '#E6D9F5', '#B69CD4', '#8567A4', '#F1EBF9', 'flower'],
  ['芋泥牛奶', '#E8DCE9', '#B8A1B8', '#89718A', '#F4EDF3', 'heart']
];

const ink = '#664D44';
const cream = '#FFF6DD';
const gold = '#F1C575';
let serial = 0;

function paletteFor(theme) {
  const key = String(theme || '').toUpperCase();
  return palettes.find(([name, hex]) => name === theme || hex === key) || palettes[0];
}

const symbols = {
  cherries: `<path d="M-8 4C-5-1-4-8 0-12M9 6C10-1 6-7 1-11" fill="none" stroke="#687953" stroke-width="2.3"/><path d="M0-11Q4-20 14-16Q12-9 0-11Z" fill="#A6BA80" stroke="#687953" stroke-width="1.3"/><circle cx="-8" cy="7" r="6" fill="#D9767D"/><circle cx="8" cy="8" r="6.5" fill="#E38D8D"/><path d="M-11 5l2-1m14 3 2-1" stroke="#FCE2D3" stroke-width="1.7"/>`,
  star: `<path d="m0-13 4.7 8.1 9.6 1.5-6.8 6.6 1.4 9.6L0 8.9l-8.9 3.9 1.4-9.6-6.8-6.6 9.6-1.5Z" fill="#F3CD79"/><path d="m-6-1 4-1 2-4" fill="none" stroke="#FFF2C2" stroke-width="2"/>`,
  heart: `<path d="M0 12C-4 8-14 3-14-4c0-9 10-12 14-4 5-8 15-5 15 3 0 6-9 13-15 17Z" fill="#E49B9E"/><path d="M-10-4q1-4 5-3" stroke="#FFE8D8" fill="none" stroke-width="2"/>`,
  peach: `<path d="M1-8c10-6 17 2 12 10C10 9 5 12 0 15-5 10-14 9-15 0c-1-7 6-13 16-8Z" fill="#EFAD91"/><path d="M0-8Q-4-15-12-15q3 9 12 7Z" fill="#AAC28B"/><path d="M0-8q6 6 3 13" fill="none" stroke="#C88978"/>`,
  clover: `<path d="M0 1q-15 6-14-4 0-6 7-6-3-8 4-9Q3-20 4-10q10-6 13 1Q20 0 7 1q9 4 5 10-5 6-11-5-2 6-8 11" fill="#A7C191" transform="scale(.85)"/>`,
  cup: `<path d="M8-4h4q6 0 3 6-2 3-6 2" fill="#FFF3CE"/><path d="M-12-5H10L8 5Q5 13-4 10q-7-1-8-15Z" fill="#B4D2BB"/><path d="M-15 12Q0 15 14 11M-4-9q-3-4 1-7M2-10q-2-3 1-5" fill="none"/>`,
  moon: `<path d="M5-13C-13-17-21 5-6 13q12 6 20-7C1 11-9-2 5-13Z" fill="#ECC879"/><path d="m10-10 1.2 3.3L15-5.5l-3.8 1.2L10-1 8.7-4.3 5-5.5l3.7-1.2Z" fill="#EDC887" stroke-width="1"/>`,
  flower: `<g fill="#CFABD0"><ellipse cy="-7" rx="5.8" ry="8"/><ellipse cy="-7" rx="5.8" ry="8" transform="rotate(72)"/><ellipse cy="-7" rx="5.8" ry="8" transform="rotate(144)"/><ellipse cy="-7" rx="5.8" ry="8" transform="rotate(216)"/><ellipse cy="-7" rx="5.8" ry="8" transform="rotate(288)"/></g><circle r="4" fill="#F2CD82"/>`
};

function icon(key, x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${symbols[key]}</g>`;
}

function twinkle(x, y, r, color = gold) {
  return `<path transform="translate(${x} ${y}) scale(${r / 10})" d="M0-10C1-3 3-1 9 0 3 1 1 3 0 10-1 3-3 1-9 0-3-1-1-3 0-10Z" fill="${color}" stroke="${ink}" stroke-width="1.2"/>`;
}

function dots(coords, color, r) {
  return coords.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`).join('');
}

function cabinet(p, id) {
  const [, shell, flank, trim, , emblem] = p;
  const reelSymbols = [emblem, emblem === 'star' ? 'moon' : 'star', emblem === 'heart' ? 'cherries' : 'heart'];
  const reels = reelSymbols.map((symbol, i) => {
    const x = 49 + i * 46;
    return `<rect x="${x}" y="97" width="42" height="57" rx="7" fill="url(#${id}-reel)" stroke="#A68D73" stroke-width="1.5"/><path d="M${x + 5} 103h32m-32 46h32" stroke="#E4D8BC" stroke-width="1"/>${icon(symbol, x + 21, 126, 1.03)}`;
  }).join('');
  return `<g stroke="${ink}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <g transform="rotate(-2 110 130)">
    <path d="m185 135 16-6 3 20-17 5Z" fill="${trim}"/><ellipse cx="198" cy="138" rx="8" ry="11" fill="${flank}"/>
    <path d="m200 134 16-55" fill="none" stroke-width="8"/><path d="m200 134 16-55" fill="none" stroke="#ECCE8C" stroke-width="4.2"/>
    <circle cx="217" cy="74" r="10.5" fill="${flank}"/><path d="M213 71q1-4 5-4" fill="none" stroke="#FFF2D8" stroke-width="2.4"/>
    <path d="m178 47 12 7q6 4 7 15l1 116 8 19-1 14-15 6-12-11Z" fill="${flank}"/>
    <path d="M35 66q1-11 14-14l121-8q15-1 17 13l2 128-155 5Z" fill="${shell}"/>
    <path d="m41 77 137-8m12 5 4-2m-3 97 4-1" fill="none" stroke="${trim}" stroke-width="1.2"/>
    <path d="M31 74q-4-4-1-12l6-17q4-11 13-13l30-4q15-15 31-16 20-1 35 12l24 1q11 0 15 7l7 17q4 10-1 14l-4 3-148 12Z" fill="${flank}"/>
    <path d="M29 66q1-4 6-18 4-12 15-14l29-4q15-15 32-15 19-1 34 12l24 1q10 0 13 7l6 15q3 8-2 10l-151 13q-7 1-6-7Z" fill="${shell}"/>
    <path d="m42 62 5-15q2-3 7-4l30-4q13-13 28-13 14-1 27 10l28 1q5 0 7 4l3 10Z" fill="${cream}" stroke="${trim}" stroke-width="1.4"/>
    <g transform="rotate(-4 108 46)">${twinkle(86, 49, 4, flank)}${icon(emblem, 110, 44, .7)}${twinkle(135, 46, 4, flank)}</g>
    <g transform="skewY(-4)">
      <rect x="37" y="90" width="150" height="72" rx="13" fill="${flank}"/>
      <rect x="42" y="93" width="144" height="65" rx="10" fill="#8C7467"/>
      ${reels}
      <path d="m38 121 4 3-4 3m145-6-4 3 4 3" stroke="none" fill="${cream}"/>
      <path d="M39 170h142" stroke="${trim}" stroke-width="1.2"/>
      ${dots([[51, 177], [59, 177], [67, 177]], trim, 1.3)}
      <rect x="142" y="173" width="28" height="5" rx="2" fill="${trim}" stroke-width="1"/>
      <path d="M35 185h154l10 17q2 4-4 6H28q-5-1-3-6Z" fill="${shell}"/>
      <path d="M25 206h171v12q-1 6-7 6H31q-7 0-7-6Z" fill="${flank}"/>
      <path d="M38 200h143" stroke="${cream}" stroke-width="1.3"/>
      <path d="M71 192h70l3 5H67Z" fill="${trim}" stroke-width="1.3"/>
      <path d="M79 193.5h55" stroke="#775D51" stroke-width="1.5"/>
      <rect x="37" y="223" width="16" height="4" rx="2" fill="${ink}" stroke="none"/>
      <rect x="167" y="223" width="16" height="4" rx="2" fill="${ink}" stroke="none"/>
    </g></g></g>`;
}

function ticket(x, y, angle, scale, color) {
  return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})" stroke="${ink}" stroke-linejoin="round">
    <path d="M-36-16h74v10q-8 5 0 11v10h-74V6q8-6 0-12Z" fill="${color}" stroke-width="1.7"/>
    <path d="M-30-11h48v21h-48m53-22v25" stroke-dasharray="2 3" fill="none" stroke-width="1"/>
    ${twinkle(-7, 0, 7, cream)}
    <path d="M26-6v12m3-12V6m3-12V6" stroke-width="1.2"/>
  </g>`;
}

/**
 * A decorative, accessible-by-context SVG. The card or heading supplies its name.
 * @param {string} theme Machine theme as HEX or its Traditional Chinese name.
 * @param {'card'|'hero'} variant Card includes a 4:5 illustrated backdrop.
 * @returns {string}
 */
export function machineArt(theme, variant = 'card') {
  const p = paletteFor(theme);
  const id = 'machine-art-' + ++serial;
  const [, shell, flank, , background] = p;
  const hero = variant === 'hero';
  const defs = `<defs>
    <linearGradient id="${id}-reel" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#DFD3B5"/><stop offset=".19" stop-color="#FFF8E9"/><stop offset=".49" stop-color="#FFFDF2"/><stop offset=".81" stop-color="#FBF5E5"/><stop offset="1" stop-color="#DCD0B6"/></linearGradient>
    <pattern id="${id}-paper" width="13" height="13" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".7" fill="${flank}" opacity=".28"/></pattern>
  </defs>`;
  const body = hero ? `
    <ellipse cx="222" cy="226" rx="134" ry="10" fill="#B99886" opacity=".17"/>
    ${ticket(110, 190, -27, .88, '#F6D69C')}${ticket(98, 203, -16, .81, cream)}
    ${twinkle(101, 72, 13)}${twinkle(82, 86, 5, shell)}${twinkle(325, 35, 8, shell)}
    ${twinkle(340, 160, 10)}${twinkle(357, 150, 4, shell)}
    ${dots([[120, 44], [352, 178], [87, 144], [296, 24]], flank, 2)}
    <g transform="translate(96 -5) rotate(5 120 140) scale(1.03)">${cabinet(p, id)}</g>
    ${ticket(302, 219, 10, .66, '#F4DDB0')}
  ` : `
    <rect width="240" height="300" fill="${background}"/>
    <rect width="240" height="300" fill="url(#${id}-paper)"/>
    <path d="M-12 261Q111 244 251 254v48H-12Z" fill="${shell}" opacity=".54"/>
    <ellipse cx="121" cy="249" rx="79" ry="8" fill="${flank}" opacity=".24"/>
    ${twinkle(34, 101, 8)}${twinkle(47, 91, 3.5, flank)}${twinkle(193, 49, 7, flank)}
    ${twinkle(206, 200, 7)}${twinkle(198, 211, 3.5, flank)}
    <g transform="translate(8 43) scale(.92)">${cabinet(p, id)}</g>
  `;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${hero ? '419 250' : '240 300'}" class="machine-art machine-art--${hero ? 'hero' : 'card'}" aria-hidden="true" focusable="false">${defs}${body}</svg>`;
}
