import fs from "fs";
import path from "path";

const targetDir = path.resolve("./public/images/crests");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const CRESTS = {
  "zru-sables.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#006B3F" stroke="#ffffff" stroke-width="3"/>
  <path d="M50 12 L78 28 L78 62 L50 88 L22 62 L22 28 Z" fill="#004d2c" stroke="#ffffff" stroke-width="1.5"/>
  <path d="M38 32 C38 24, 46 16, 54 18 C58 22, 54 30, 48 34 C44 38, 44 48, 44 54 C46 56, 50 56, 52 52 C54 46, 60 40, 66 42 C68 46, 64 52, 58 56 C52 60, 48 68, 46 76 L42 76 C40 68, 36 58, 38 46 Z" fill="#ffffff"/>
  <circle cx="42" cy="44" r="2.5" fill="#006B3F"/>
  <text x="50" y="82" font-family="Arial, sans-serif" font-size="7" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">SABLES</text>
</svg>`,

  "lady-sables.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#005230" stroke="#ffffff" stroke-width="3"/>
  <path d="M50 14 L76 30 L76 64 L50 86 L24 64 L24 30 Z" fill="#003820" stroke="#ffffff" stroke-width="1.5"/>
  <path d="M38 32 C38 24, 46 16, 54 18 C58 22, 54 30, 48 34 C44 38, 44 48, 44 54 C46 56, 50 56, 52 52 C54 46, 60 40, 66 42 C68 46, 64 52, 58 56 C52 60, 48 68, 46 76 L42 76 C40 68, 36 58, 38 46 Z" fill="#ffffff"/>
  <circle cx="42" cy="44" r="2.5" fill="#005230"/>
  <text x="50" y="80" font-family="Arial, sans-serif" font-size="5.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">LADY SABLES</text>
</svg>`,

  "england-rfu.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#d31145" stroke-width="3"/>
  <path d="M50 20 C42 20, 36 28, 40 38 C42 42, 48 44, 50 48 C52 44, 58 42, 60 38 C64 28, 58 20, 50 20 Z" fill="#d31145"/>
  <path d="M34 38 C28 42, 26 52, 34 60 C38 64, 46 64, 50 68 C46 64, 42 60, 38 56 C34 50, 36 44, 40 40 Z" fill="#d31145"/>
  <path d="M66 38 C72 42, 74 52, 66 60 C62 64, 54 64, 50 68 C54 64, 58 60, 62 56 C66 50, 64 44, 60 40 Z" fill="#d31145"/>
  <path d="M50 48 C44 54, 42 64, 50 74 C58 64, 56 54, 50 48 Z" fill="#b50e3b"/>
  <path d="M50 74 L50 86 M46 80 L50 86 L54 80" stroke="#006B3F" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`,

  "wales-feathers.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#c8102e" stroke="#ffffff" stroke-width="3"/>
  <path d="M50 20 C46 36, 46 54, 50 74 C54 54, 54 36, 50 20 Z" fill="#ffffff"/>
  <path d="M32 30 C34 46, 40 60, 48 72 C42 60, 36 46, 32 30 Z" fill="#ffffff"/>
  <path d="M68 30 C66 46, 60 60, 52 72 C58 60, 64 46, 68 30 Z" fill="#ffffff"/>
  <path d="M38 74 L62 74" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
  <text x="50" y="86" font-family="Arial, sans-serif" font-size="6" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">WRU</text>
</svg>`,

  "uganda-cranes.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#1b1c1c" stroke="#fcdc04" stroke-width="3"/>
  <circle cx="50" cy="50" r="38" fill="#d90000" stroke="#ffffff" stroke-width="1.5"/>
  <circle cx="50" cy="50" r="26" fill="#ffffff"/>
  <path d="M44 40 C46 34, 54 34, 56 40 C58 48, 52 56, 46 62 L56 62" stroke="#1b1c1c" stroke-width="3" fill="none" stroke-linecap="round"/>
  <text x="50" y="82" font-family="Arial, sans-serif" font-size="6" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">UGANDA</text>
</svg>`,

  "south-africa-springbok.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#00482B" stroke="#ffffff" stroke-width="3"/>
  <circle cx="50" cy="50" r="40" fill="#003822" stroke="#006B3F" stroke-width="2"/>
  <path d="M28 54 C34 46, 44 40, 56 36 C64 34, 74 38, 78 44 C76 40, 68 34, 58 32 C48 30, 36 36, 26 46 Z" fill="#ffffff"/>
  <path d="M66 32 C68 24, 74 18, 80 16 C80 22, 76 28, 72 34 Z" fill="#ffffff"/>
  <path d="M58 30 C58 22, 62 16, 68 14 C67 20, 64 26, 62 30 Z" fill="#ffffff"/>
  <text x="50" y="78" font-family="Arial, sans-serif" font-size="6.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">SA RUGBY</text>
</svg>`,

  "all-blacks-fern.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#000000" stroke="#333333" stroke-width="3"/>
  <path d="M32 78 C42 66, 52 50, 68 24 C64 30, 58 34, 50 36 C58 32, 66 26, 72 18 C68 26, 62 32, 54 38 C62 36, 70 32, 76 24 C72 32, 64 40, 54 46 C64 44, 72 40, 78 32 C74 42, 62 50, 50 56 C58 54, 66 50, 72 44 C66 54, 52 62, 38 72 Z" fill="#ffffff"/>
  <text x="50" y="88" font-family="Arial, sans-serif" font-size="6" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">ALL BLACKS</text>
</svg>`,

  "kenya-simbas.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#B20000" stroke="#ffffff" stroke-width="3"/>
  <path d="M50 16 L76 30 L76 64 L50 86 L24 64 L24 30 Z" fill="#000000" stroke="#ffffff" stroke-width="2"/>
  <path d="M36 36 C42 30, 58 30, 64 36 C68 44, 64 56, 50 66 C36 56, 32 44, 36 36 Z" fill="#B20000"/>
  <circle cx="44" cy="44" r="2" fill="#ffffff"/>
  <circle cx="56" cy="44" r="2" fill="#ffffff"/>
  <path d="M46 54 L50 58 L54 54" stroke="#ffffff" stroke-width="2" fill="none"/>
  <text x="50" y="78" font-family="Arial, sans-serif" font-size="6.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">SIMBAS</text>
</svg>`,

  "namibia-welwitschias.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#003580" stroke="#ffffff" stroke-width="3"/>
  <circle cx="50" cy="50" r="38" fill="#002050" stroke="#D21034" stroke-width="2"/>
  <path d="M30 62 C34 46, 42 36, 50 28 C58 36, 66 46, 70 62 C62 58, 54 56, 50 56 C46 56, 38 58, 30 62 Z" fill="#0085C7"/>
  <path d="M38 68 C42 58, 46 52, 50 48 C54 52, 58 58, 62 68 C56 64, 52 64, 50 64 C48 64, 44 64, 38 68 Z" fill="#ffffff"/>
  <text x="50" y="80" font-family="Arial, sans-serif" font-size="6" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">NAMIBIA</text>
</svg>`,

  "cheetahs-7s.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#002D19" stroke="#ffffff" stroke-width="3"/>
  <circle cx="50" cy="50" r="38" fill="#004526" stroke="#006B3F" stroke-width="2"/>
  <path d="M32 46 C36 34, 48 26, 64 28 C68 34, 64 44, 54 52 C46 58, 40 66, 36 74 C34 64, 30 54, 32 46 Z" fill="#ffffff"/>
  <circle cx="48" cy="38" r="2" fill="#002D19"/>
  <circle cx="56" cy="42" r="2" fill="#002D19"/>
  <circle cx="42" cy="50" r="2" fill="#002D19"/>
  <text x="50" y="82" font-family="Arial, sans-serif" font-size="6" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">CHEETAHS 7s</text>
</svg>`,

  "junior-sables.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#004D2C" stroke="#ffffff" stroke-width="3"/>
  <path d="M50 14 L76 30 L76 64 L50 86 L24 64 L24 30 Z" fill="#00331C" stroke="#ffffff" stroke-width="1.5"/>
  <path d="M38 32 C38 24, 46 16, 54 18 C58 22, 54 30, 48 34 C44 38, 44 48, 44 54 C46 56, 50 56, 52 52 C54 46, 60 40, 66 42 C68 46, 64 52, 58 56 C52 60, 48 68, 46 76 L42 76 C40 68, 36 58, 38 46 Z" fill="#ffffff"/>
  <circle cx="42" cy="44" r="2.5" fill="#004D2C"/>
  <text x="50" y="80" font-family="Arial, sans-serif" font-size="6.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">U20 SABLES</text>
</svg>`,

  "goshawks.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#1B1C1C" stroke="#006B3F" stroke-width="3"/>
  <circle cx="50" cy="50" r="38" fill="#004526" stroke="#ffffff" stroke-width="1.5"/>
  <path d="M30 42 C38 32, 50 28, 64 34 C72 40, 74 52, 68 62 C58 58, 50 52, 44 46 C40 52, 36 60, 32 68 C30 58, 28 50, 30 42 Z" fill="#ffffff"/>
  <circle cx="54" cy="40" r="2.5" fill="#004526"/>
  <text x="50" y="80" font-family="Arial, sans-serif" font-size="6" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">GOSHAWKS</text>
</svg>`,

  "france-coq.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#002395" stroke="#ffffff" stroke-width="3"/>
  <circle cx="50" cy="50" r="38" fill="#00186B" stroke="#ED2939" stroke-width="2"/>
  <path d="M38 60 C38 48, 46 36, 56 30 C62 34, 60 44, 52 50 C58 52, 64 56, 62 64 C56 62, 50 62, 44 66 Z" fill="#ffffff"/>
  <path d="M56 26 C58 22, 64 22, 64 28 C60 28, 58 30, 56 26 Z" fill="#ED2939"/>
  <text x="50" y="80" font-family="Arial, sans-serif" font-size="6" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">FRANCE</text>
</svg>`,

  "ireland-shamrock.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#009A49" stroke="#ffffff" stroke-width="3"/>
  <path d="M50 36 C44 26, 34 32, 40 42 C44 48, 50 48, 50 54 C50 48, 56 48, 60 42 C66 32, 56 26, 50 36 Z" fill="#ffffff"/>
  <path d="M38 52 C28 48, 28 60, 38 64 C44 66, 48 60, 50 56 C46 54, 42 54, 38 52 Z" fill="#ffffff"/>
  <path d="M62 52 C72 48, 72 60, 62 64 C56 66, 52 60, 50 56 C54 54, 58 54, 62 52 Z" fill="#ffffff"/>
  <path d="M50 56 L50 74" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
  <text x="50" y="86" font-family="Arial, sans-serif" font-size="6" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">IRFU</text>
</svg>`,

  "scotland-thistle.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#002B49" stroke="#ffffff" stroke-width="3"/>
  <circle cx="50" cy="40" r="14" fill="#6A1B9A" stroke="#ffffff" stroke-width="1.5"/>
  <path d="M36 46 C32 58, 42 66, 50 68 C58 66, 68 58, 64 46 C58 52, 42 52, 36 46 Z" fill="#006B3F"/>
  <path d="M50 68 L50 80" stroke="#006B3F" stroke-width="3" stroke-linecap="round"/>
  <text x="50" y="90" font-family="Arial, sans-serif" font-size="5.5" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">SCOTLAND</text>
</svg>`,

  "australia-wallaby.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#005230" stroke="#FFCD00" stroke-width="3"/>
  <path d="M30 64 C34 48, 48 38, 62 30 C66 38, 62 50, 52 58 C60 62, 68 64, 74 68 C64 68, 54 66, 44 68 Z" fill="#FFCD00"/>
  <circle cx="60" cy="38" r="2.5" fill="#005230"/>
  <text x="50" y="82" font-family="Arial, sans-serif" font-size="5.5" font-weight="900" fill="#FFCD00" text-anchor="middle" letter-spacing="1">WALLABIES</text>
</svg>`,
};

for (const [filename, svg] of Object.entries(CRESTS)) {
  fs.writeFileSync(path.join(targetDir, filename), svg, "utf8");
  console.log(`✓ Saved crest: ${filename}`);
}
console.log("All vector crests successfully generated!");
