const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../src'));
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('text-white/40') || content.includes('text-white/20')) {
    // text-white/40 -> text-white/60
    // text-white/20 -> text-white/50
    content = content.replace(/text-white\/40/g, 'text-white/60');
    content = content.replace(/text-white\/20/g, 'text-white/50');
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
  }
});

console.log(`Updated contrast classes in ${changedCount} files.`);
