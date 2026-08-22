async function parseMore() {
  const res = await fetch('https://www.world.rugby/resources/prod/v9.19.3/css/t-wr.css');
  const css = await res.text();
  
  const regex = /\.(?:flag-80x-|tLogo80\.|tLogo80x-)([a-zA-Z0-9_-]+)\s*\{[^}]*background:\s*url\([^)]+\)\s*(-?[\d\.]+(?:px|%))\s*(-?[\d\.]+(?:px|%))/gi;
  let match;
  const list = {};
  while ((match = regex.exec(css)) !== null) {
    const code = match[1].toLowerCase();
    list[code] = {
      x: parseInt(match[2], 10),
      y: parseInt(match[3], 10)
    };
  }
  
  console.log('Total extracted:', Object.keys(list).length);
  ['sam', 'uga', 'tga', 'ton', 'bot', 'zam', 'nam', 'ken', 'alg', 'civ', 'sen', 'tun', 'mad', 'gha', 'ngr'].forEach(c => {
    console.log(c, list[c]);
  });
  
  const fs = require('fs');
  fs.writeFileSync('scripts/wr-all-shields.json', JSON.stringify(list, null, 2));
}
parseMore();
