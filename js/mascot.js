// Reusable hand-drawn mascot — a simple round blob character, 6 poses.
// Thin black linework, round blob head-body, two dot eyes, small open smiling mouth,
// little arms/feet. NO scarf / collar / clothing / colour. Monochromatic black.
// Recognizable at small sizes, consistent proportions across poses.
const INK = '#1a1a1a';
const SW = 3;

// Consistent round, slightly irregular blob head-body (hand-drawn feel).
const BLOB = `<path d="M60 15 C84 14 99 32 99 55 C99 77 85 91 62 92 C40 93 23 79 22 56 C21 32 37 16 60 15 Z"
  fill="#fff" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"/>`;

// Eyes + open smiling mouth (consistent face).
const FACE = `
  <circle cx="51" cy="49" r="3.2" fill="${INK}"/>
  <circle cx="69" cy="49" r="3.2" fill="${INK}"/>
  <path d="M54 59 Q60 72 66 59 Q60 63 54 59 Z" fill="${INK}"/>`;

// Legs + little feet (consistent). Right leg slightly bent like the reference.
const LEGS = `
  <path d="M53 90 C51 102 49 110 46 118" fill="none" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round"/>
  <path d="M46 118 q-8 2 -11 -2" fill="none" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round"/>
  <path d="M68 90 C71 101 70 110 67 118" fill="none" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round"/>
  <path d="M67 118 q8 3 12 -1" fill="none" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round"/>`;

const stroke = `fill="none" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round"`;

// three little motion ticks near the head (top-left), hand-drawn energy
const TICKS = `<g ${stroke}>
  <path d="M16 30 L7 25"/>
  <path d="M22 22 L18 12"/>
  <path d="M31 20 L35 11"/>
</g>`;
// small sparkle (celebrate)
const SPARK = (x,y)=>`<path d="M${x} ${y-7} L${x+2} ${y-2} L${x+7} ${y} L${x+2} ${y+2} L${x} ${y+7} L${x-2} ${y+2} L${x-7} ${y} L${x-2} ${y-2} Z" fill="${INK}"/>`;

// arm sets per pose (attach near sides of the blob)
const ARMS = {
  // one arm waving up-left, other resting down with a little curl hand
  welcome: `<path d="M34 72 C24 66 18 56 20 46" ${stroke}/>
            <path d="M20 46 q-5 -1 -7 3 q4 1 6 -1" ${stroke}/>
            <path d="M88 76 C95 84 95 95 89 104" ${stroke}/>
            <path d="M89 104 q4 2 8 -1" ${stroke}/>`,
  // pointing arm to the left with a pointing hand; other down curled (matches reference)
  point: `<path d="M33 76 C21 79 13 75 7 71" ${stroke}/>
          <path d="M7 71 q-4 -3 -2 -7 q2 2 4 2 q2 2 1 5" ${stroke}/>
          <path d="M88 76 C96 85 95 97 88 106" ${stroke}/>
          <path d="M88 106 q5 2 9 -2" ${stroke}/>`,
  // one hand up to the side of the head (thinking); other resting
  think: `<path d="M37 72 C31 63 33 54 42 52" ${stroke}/>
          <path d="M42 52 q4 -2 5 2" ${stroke}/>
          <path d="M86 78 C92 86 92 96 87 104" ${stroke}/>`,
  // one finger up (idea); other resting
  hint: `<path d="M37 72 C31 61 35 50 44 49" ${stroke}/>
         <path d="M44 49 l0 -9" ${stroke}/>
         <path d="M87 77 C94 85 93 96 87 104" ${stroke}/>`,
  // both arms up (cheer)
  celebrate: `<path d="M35 73 C26 64 22 52 25 42" ${stroke}/>
              <path d="M25 42 q-4 -2 -3 -6 q3 2 5 1" ${stroke}/>
              <path d="M86 73 C95 64 99 52 96 42" ${stroke}/>
              <path d="M96 42 q4 -2 3 -6 q-3 2 -5 1" ${stroke}/>`,
  // both arms open outward (welcoming / encouraging)
  encourage: `<path d="M33 79 C23 83 17 91 15 100" ${stroke}/>
              <path d="M15 100 q-4 1 -5 5" ${stroke}/>
              <path d="M88 79 C98 83 104 91 106 100" ${stroke}/>
              <path d="M106 100 q4 1 5 5" ${stroke}/>`,
};

// per-pose extra decorations (idea bulb, thought dots, sparkles, motion ticks)
const EXTRA = {
  welcome: TICKS,
  point: TICKS,
  think: `<g ${stroke}><circle cx="86" cy="26" r="2.4"/><circle cx="95" cy="16" r="3.6"/></g>`,
  hint: `<g ${stroke}><circle cx="44" cy="33" r="7"/><path d="M41 43 h6"/></g>`,
  celebrate: `${SPARK(18,26)}${SPARK(104,30)}`,
  encourage: '',
};

export function mascot(pose = 'welcome', size = 120) {
  const p = ARMS[pose] ? pose : 'welcome';
  return `<svg viewBox="0 0 120 128" width="${size}" height="${size}" role="img" aria-label="Praktickô maskot"
    xmlns="http://www.w3.org/2000/svg">
    ${EXTRA[p] || ''}
    ${LEGS}
    ${ARMS[p]}
    ${BLOB}
    ${FACE}
  </svg>`;
}
export const POSE_LIST = Object.keys(ARMS);
