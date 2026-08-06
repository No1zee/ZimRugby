import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIRECTUS_URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@zimrugby.co.zw';
const PASSWORD = 'admin-password-***REMOVED***';

function extractObject(filePath, varName) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] File not found: ${filePath}`);
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = new RegExp(`const\\s+${varName}\\s*(:\\s*[^=]+)?\\s*=\\s*\\{`);
  const match = content.match(regex);
  if (!match) {
    console.warn(`[WARN] Variable ${varName} not found in ${filePath}`);
    return null;
  }
  const startIndex = match.index + match[0].length - 1;
  let braceCount = 0;
  let endIndex = -1;
  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') {
      braceCount--;
      if (braceCount === 0) { endIndex = i; break; }
    }
  }
  if (endIndex === -1) return null;
  const objectText = content.slice(startIndex, endIndex + 1);
  try {
    const cleanedText = objectText
      .replace(/as\s+const/g, '')
      .replace(/:\s*[A-Z][A-Za-z0-9_]+/g, '');
    const data = eval(`(${cleanedText})`);
    return data;
  } catch (err) {
    console.error(`[ERROR] Failed to eval object for ${varName}:`, err.message);
    return null;
  }
}

async function run() {
  console.log('=== ZimRugby Rankings Migration ===');

  const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  const loginData = await loginRes.json();
  const token = loginData.data.access_token;
  const apiHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  console.log('[SUCCESS] Authenticated with Directus.');

  const checkRes = await fetch(`${DIRECTUS_URL}/items/rankings?limit=1`, { headers: apiHeaders });
  const checkData = await checkRes.json();
  if (checkData.data && checkData.data.length > 0) {
    console.log('[SKIP] rankings already has items.');
    return;
  }

  const rankingsFile = path.join(__dirname, '../src/lib/api/rankings.ts');
  const mock = extractObject(rankingsFile, 'MOCK_RANKINGS');
  if (!mock) {
    console.log('[SKIP] Could not extract MOCK_RANKINGS.');
    return;
  }

  const payload = {
    world_position: mock.world.position,
    world_previous_position: mock.world.previousPosition ?? null,
    world_points: mock.world.points,
    world_trend: mock.world.trend || 'stable',
    africa_position: mock.africa.position,
    africa_previous_position: mock.africa.previousPosition ?? null,
    africa_points: mock.africa.points,
    africa_trend: mock.africa.trend || 'stable',
    last_updated: mock.world.lastUpdated || 'June 2026',
    status: 'published'
  };

  const postRes = await fetch(`${DIRECTUS_URL}/items/rankings`, {
    method: 'POST',
    headers: apiHeaders,
    body: JSON.stringify(payload)
  });
  if (postRes.ok) {
    console.log('[RESULT] rankings: 1 migrated, 0 failed.');
  } else {
    const errData = await postRes.json();
    console.error('[RESULT] rankings POST failed:', errData.errors || postRes.statusText);
    console.log('Payload:', JSON.stringify(payload));
  }
}

run();
