const fs = require('fs');

async function parseExactRules() {
  const res = await fetch('https://www.world.rugby/resources/prod/v9.19.3/css/t-wr.css');
  const css = await res.text();
  
  // Format: .tLogo80x-ALG { ... background: url(...) 0 -94px no-repeat; width: 80px; height: 105px }
  const regex = /\.tLogo80x-([a-zA-Z0-9_-]+)\s*\{[^}]*background:\s*url\([^)]+\)\s*(-?[\d\.]+(?:px|%))\s*(-?[\d\.]+(?:px|%))/gi;
  let match;
  const mappings = {};

  while ((match = regex.exec(css)) !== null) {
    const code = match[1].toLowerCase();
    mappings[code] = {
      x: parseInt(match[2], 10),
      y: parseInt(match[3], 10),
      width: 80,
      height: 105
    };
  }

  console.log('Total 80x national shield mappings extracted:', Object.keys(mappings).length);
  console.log('Sample mappings (RSA, NZL, FIJ, ENG, ZIM, NAM, KEN, UGA):', {
    rsa: mappings['rsa'],
    nzl: mappings['nzl'],
    fij: mappings['fij'],
    eng: mappings['eng'],
    zim: mappings['zim'],
    nam: mappings['nam'],
    ken: mappings['ken'],
    uga: mappings['uga'],
    sam: mappings['sam'],
    ton: mappings['ton'],
    aus: mappings['aus']
  });
  
  fs.writeFileSync('scripts/wr-shield-mappings.json', JSON.stringify(mappings, null, 2));
}
parseExactRules();
