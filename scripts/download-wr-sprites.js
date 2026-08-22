const fs = require('fs');
const path = require('path');

async function downloadSprites() {
  const spriteBase = 'https://www.world.rugby/resources/prod/v9.19.3/i/sprites-generated/';
  const sprites = [
    'tLogo80x-sprite@x2.png',
    'tLogo80x-sprite.png',
    'tLogo50x-sprite@x2.png',
    'tLogo50x-sprite.png',
    'tLogo25x-sprite@x2.png',
    'tLogo25x-sprite.png'
  ];

  for (const s of sprites) {
    try {
      const res = await fetch(spriteBase + s);
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(path.join('public/images/teams', s), buffer);
        console.log('Downloaded sprite:', s, buffer.length, 'bytes');
      } else {
        console.log('Failed:', s, res.status);
      }
    } catch(e) {
      console.error('Error downloading', s, e);
    }
  }
}
downloadSprites();
