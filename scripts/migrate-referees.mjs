import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIRECTUS_URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@zimrugby.co.zw';
const PASSWORD = 'admin-password-***REMOVED***';

function extractMockArray(filePath, varName) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] File not found: ${filePath}`);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = new RegExp(`const\\s+${varName}\\s*(:\\s*[^=]+)?\\s*=\\s*\\[`);
  const match = content.match(regex);
  if (!match) {
    console.warn(`[WARN] Variable ${varName} not found in ${filePath}`);
    return [];
  }

  const startIndex = match.index + match[0].length - 1;
  let braceCount = 0;
  let endIndex = -1;
  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '[') braceCount++;
    if (content[i] === ']') {
      braceCount--;
      if (braceCount === 0) { endIndex = i; break; }
    }
  }
  if (endIndex === -1) {
    console.warn(`[WARN] Matching bracket not found for ${varName}`);
    return [];
  }

  const arrayText = content.slice(startIndex, endIndex + 1);
  try {
    const cleanedText = arrayText
      .replace(/as\s+const/g, '')
      .replace(/:\s*[A-Z][A-Za-z0-9_]+/g, '');
    const data = eval(`(${cleanedText})`);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`[ERROR] Failed to eval array for ${varName}:`, err.message);
    return [];
  }
}

async function run() {
  console.log('=== ZimRugby Referee Collections Migration ===');

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

  const refereesFile = path.join(__dirname, '../src/lib/api/referees.ts');

  const jobs = [
    {
      name: 'referee_courses',
      varName: 'mockCourses',
      mapper: (item) => ({
        title: item.title,
        level: item.level,
        date_label: item.date,
        venue: item.venue,
        instructor: item.instructor,
        status: item.status
      })
    },
    {
      name: 'referee_resources',
      varName: 'mockResources',
      mapper: (item) => ({
        title: item.title,
        category: item.category,
        size: item.size,
        download_url: item.downloadUrl
      })
    },
    {
      name: 'referee_notices',
      varName: 'mockNotices',
      mapper: (item) => ({
        title: item.title,
        date_label: item.date,
        excerpt: item.excerpt,
        content: item.content
      })
    }
  ];

  const report = [];

  for (const job of jobs) {
    console.log(`\n--- Processing collection: ${job.name} ---`);

    try {
      const checkRes = await fetch(`${DIRECTUS_URL}/items/${job.name}?limit=1`, { headers: apiHeaders });
      const checkData = await checkRes.json();
      if (checkData.data && checkData.data.length > 0) {
        console.log(`[SKIP] Collection ${job.name} already has items. Skipping to avoid duplicates.`);
        report.push({ collection: job.name, status: 'skipped', reason: 'Already populated' });
        continue;
      }
    } catch (err) {
      console.warn(`[WARN] Could not check items in ${job.name}:`, err.message);
    }

    const items = extractMockArray(refereesFile, job.varName);
    if (items.length === 0) {
      console.log(`[SKIP] No mock items extracted for ${job.name}.`);
      report.push({ collection: job.name, status: 'skipped', reason: 'No mock data' });
      continue;
    }
    console.log(`[INFO] Extracted ${items.length} items.`);

    let success = 0;
    let failed = 0;
    for (const rawItem of items) {
      const mapped = job.mapper(rawItem);
      try {
        const postRes = await fetch(`${DIRECTUS_URL}/items/${job.name}`, {
          method: 'POST',
          headers: apiHeaders,
          body: JSON.stringify(mapped)
        });
        if (postRes.ok) {
          success++;
        } else {
          const errData = await postRes.json();
          const code = errData.errors?.[0]?.extensions?.code || errData.errors?.[0]?.code;
          if (code === 'RECORD_NOT_UNIQUE') {
            console.log('[INFO] Item already exists. Skipped.');
          } else {
            failed++;
            console.warn(`[ERROR] POST to ${job.name} failed:`, errData.errors || postRes.statusText);
            console.log('Payload:', JSON.stringify(mapped));
          }
        }
      } catch (err) {
        failed++;
        console.warn(`[ERROR] POST to ${job.name} failed:`, err.message);
      }
    }

    console.log(`[RESULT] ${job.name}: ${success} succeeded, ${failed} failed.`);
    report.push({ collection: job.name, status: success > 0 ? 'success' : 'failed', details: `${success} migrated, ${failed} failed` });
  }

  console.log('\n=== Migration Completed ===');
  console.table(report);
}

run();
