/* Flat cast: solid colours only, one light source (top left), construction grid 200x260.
   Head circle r56 at (100,92). Eyes at y98, 40 apart. Mouth at y120. Shoulders from y158. */
const PAL = {
  leo:  { skin:"#F6C6A0", shade:"#E3AA80", hair:"#2A1F33", hairHi:"#48395A", top:"#FF4F5E", topShade:"#D9344A", apron:"#FFFFFF", apronShade:"#E4E7F5", accent:"#1FCB8B", blush:"#FF8A8A" },
  amira:{ skin:"#E9B48C", shade:"#D29A70", hair:"#3A2418", hairHi:"#5C3B28", top:"#1FCB8B", topShade:"#0FA36C", band:"#FFC531", accent:"#FFC531", blush:"#F08A7A" },
  maya: { skin:"#C98A5E", shade:"#AE6F45", hair:"#221A38", hairHi:"#3E3466", top:"#FFC531", topShade:"#E09E00", band:"#2F6BFF", accent:"#2F6BFF", blush:"#F0715F" }
};
let FUID = 0;
const INK = "#1D1730", MOUTH = "#5B2236", TONGUE = "#FF8C9C";
function flatChar(name, o = {}) {
  const c = PAL[name]; const id = "fc" + (++FUID);
  const leo = name === "leo", amira = name === "amira";
  const back = leo ? "" : amira ? `
    <path d="M40 96 C38 54 65 29 100 29 C135 29 162 54 160 96 V176 Q160 188 148 188 H52 Q40 188 40 176 Z" fill="${c.hair}"/>` : `
    <circle cx="100" cy="30" r="19" fill="${c.hair}"/>
    <path d="M90 20 a12 12 0 0 1 12 -6" stroke="${c.hairHi}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
  const ears = leo ? `
    <circle cx="45" cy="100" r="11" fill="${c.skin}"/><circle cx="46.5" cy="100" r="5" fill="${c.shade}"/>
    <circle cx="155" cy="100" r="11" fill="${c.skin}"/><circle cx="153.5" cy="100" r="5" fill="${c.shade}"/>` : "";
  const hair = amira ? `
    <path d="M44 102 C40 60 66 32 100 32 C136 32 160 58 156 102 C152 84 142 70 126 63 C110 75 84 81 59 83 C51 87 46 94 44 102 Z" fill="${c.hair}"/>
    <path d="M70 46 C82 38 98 35 112 36" stroke="${c.hairHi}" stroke-width="4" stroke-linecap="round" fill="none"/>` : leo ? `
    <path d="M44 97 C39 58 66 31 102 31 C138 31 162 57 156 97 C153 82 146 72 135 65 C126 71 115 73 104 71 C88 79 67 82 51 89 C48 91 45.5 94 44 97 Z" fill="${c.hair}"/>
    <path d="M72 46 C84 37 100 34 116 36" stroke="${c.hairHi}" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M128 40 C134 43 139 47 142 51" stroke="${c.hairHi}" stroke-width="4" stroke-linecap="round" fill="none"/>` : `
    <path d="M43 112 C38 64 64 34 100 34 C136 34 162 64 157 112 L147 112 C148 92 143 76 133 66 C122 72 108 72 100 62 C92 72 78 72 67 66 C57 76 52 92 53 112 Z" fill="${c.hair}"/>
    <path d="M57 64 C73 47 127 47 143 64 L138 71 C123 58 77 58 62 71 Z" fill="${c.band}"/>
    <path d="M66 59 C78 52 92 50 104 50" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M48.5 104 C47.5 96 48 89 50.5 83" stroke="${c.hairHi}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <path d="M48 112 V117" stroke="${c.hair}" stroke-width="2.5" stroke-linecap="round"/><circle cx="48" cy="121.5" r="4.5" fill="${c.band}"/>
    <path d="M152 112 V117" stroke="${c.hair}" stroke-width="2.5" stroke-linecap="round"/><circle cx="152" cy="121.5" r="4.5" fill="${c.band}"/>`;
  const outfit = amira ? `
    <path d="M84 159 C88 171 112 171 116 159" stroke="${c.topShade}" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M100 168 V178" stroke="${c.accent}" stroke-width="2.5"/><circle cx="100" cy="182" r="5" fill="${c.accent}"/>` : leo ? `
    <path d="M72 260 V188 C72 184 75 181 79 181 H121 C125 181 128 184 128 188 V260 Z" fill="${c.apron}"/>
    <path d="M110 181 H121 C125 181 128 184 128 188 V260 H110 Z" fill="${c.apronShade}"/>
    <path d="M80 181 L72 162" stroke="${c.apron}" stroke-width="6" stroke-linecap="round"/>
    <path d="M120 181 L128 162" stroke="${c.apron}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="100" cy="204" r="9" fill="${c.accent}"/>
    <path d="M96 200 H104 V205 A4 4 0 0 1 100 209 A4 4 0 0 1 96 205 Z" fill="#fff"/>` : `
    <path d="M84 159 C88 171 112 171 116 159" stroke="${c.topShade}" stroke-width="6" stroke-linecap="round" fill="none"/>
    <circle cx="100" cy="176" r="4" fill="${c.accent}"/>`;
  const wave = o.wave ? `
    <g class="wave"><path d="M142 178 C156 164 164 148 166 126" stroke="${c.top}" stroke-width="22" stroke-linecap="round" fill="none"/>
    <circle cx="166" cy="118" r="11" fill="${c.skin}"/></g>` : "";
  const vb = o.head ? "34 14 132 132" : "0 0 200 260";
  return `<svg viewBox="${vb}" class="${o.cls || ""}" role="img" aria-label="${name}">
  ${o.head ? "" : `<ellipse cx="100" cy="254" rx="62" ry="7" fill="#000" opacity=".16"/>`}
  ${amira ? back : ""}
  <g class="breathe">
    ${wave}
    <path d="M44 260 V206 C44 176 68 158 100 158 C132 158 156 176 156 206 V260 Z" fill="${c.top}"/>
    <path d="M127 162 C145 170 156 186 156 206 V260 H140 V210 C140 188 136 172 127 162 Z" fill="${c.topShade}"/>
    <path d="M88 134 H112 V158 C112 166 88 166 88 158 Z" fill="${c.shade}"/>
    ${outfit}
    <g class="head">
      ${amira ? "" : back}
      ${ears}
      <clipPath id="${id}h"><circle cx="100" cy="92" r="56"/></clipPath>
      <circle cx="100" cy="92" r="56" fill="${c.skin}"/>
      <path clip-path="url(#${id}h)" d="M126 43 C146 54 157 74 156 96 C155 122 140 141 117 148 C137 135 148 116 149 94 C150 74 141 57 126 43 Z" fill="${c.shade}" opacity=".5"/>
      <circle cx="71" cy="113" r="8.5" fill="${c.blush}" opacity=".45"/><circle cx="129" cy="113" r="8.5" fill="${c.blush}" opacity=".45"/>
      <g class="eyes e-open">
        <ellipse cx="80" cy="98" rx="6" ry="7.5" fill="${INK}"/><ellipse cx="120" cy="98" rx="6" ry="7.5" fill="${INK}"/>
        <circle cx="82.2" cy="95.4" r="2.2" fill="#fff"/><circle cx="122.2" cy="95.4" r="2.2" fill="#fff"/>
      </g>
      <g class="e-happy" stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none"><path d="M73 100 Q80 92 87 100"/><path d="M113 100 Q120 92 127 100"/></g>
      <path d="M72 84 Q80 80 88 83" stroke="${c.hair}" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M112 83 Q120 80 128 84" stroke="${c.hair}" stroke-width="4" stroke-linecap="round" fill="none"/>
      <ellipse cx="100" cy="109" rx="3.5" ry="2.5" fill="${c.shade}"/>
      <path class="m-smile" d="M90 120 Q100 128 110 120" stroke="${MOUTH}" stroke-width="4" stroke-linecap="round" fill="none"/>
      <g class="m-open"><path d="M91 118 H109 Q109 131 100 131 Q91 131 91 118 Z" fill="${MOUTH}"/><path d="M94.5 126.5 Q100 123.5 105.5 126.5 Q103.5 130.5 100 130.5 Q96.5 130.5 94.5 126.5 Z" fill="${TONGUE}"/></g>
      <g class="m-grin"><path d="M86 116 H114 Q114 134 100 134 Q86 134 86 116 Z" fill="${MOUTH}"/><path d="M88 116 H112 V119.5 Q100 122 88 119.5 Z" fill="#fff"/><path d="M93 129 Q100 125 107 129 Q104 133 100 133 Q96 133 93 129 Z" fill="${TONGUE}"/></g>
      ${hair}
    </g>
  </g>
</svg>`;
}
if (typeof module !== "undefined") module.exports = { flatChar, PAL };
