import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIRECTUS_URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@zimrugby.co.zw';
const PASSWORD = 'admin-password-***REMOVED***';

function extractArray(filePath, varName) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] File not found: ${filePath}`);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = new RegExp(`${varName}\\s*(:\\s*[^=]+)?\\s*=\\s*\\[`);
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

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] File not found: ${filePath}`);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  try {
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(`[ERROR] Failed to parse ${filePath}:`, err.message);
    return [];
  }
}

const MONTHS = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };

function parseDisplayDate(str) {
  if (!str) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str;
  const m = str.match(/^(\d{1,2})\s+([A-Z]{3})\s+(\d{4})$/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const month = MONTHS[m[2]];
  const year = parseInt(m[3], 10);
  if (month === undefined || isNaN(day) || isNaN(year)) return null;
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T09:00:00`;
}

function slugFromUrl(url, id) {
  if (!url || url === '/' || url.startsWith('#')) return `news-${id}`;
  const last = url.split('/').filter(Boolean).pop();
  return last || `news-${id}`;
}

function extractImagePath(image) {
  if (!image) return '';
  return image.startsWith('/') ? image : image;
}

async function run() {
  console.log('=== ZimRugby Content Collections Migration (news, faqs) ===');

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

  const rootDir = path.join(__dirname, '..');
  const reportsFile = path.join(rootDir, 'public/data/reports.json');
  const ticketsFile = path.join(rootDir, 'src/app/tickets/TicketsClient.tsx');

  const jobs = [
    {
      name: 'news',
      source: () => readJson(reportsFile),
      mapper: (item, index) => {
        const date = parseDisplayDate(item.date) || '2026-01-01T09:00:00';
        return {
          title: item.title,
          slug: slugFromUrl(item.url, item.id || index),
          excerpt: item.excerpt,
          body: item.content || item.excerpt || '',
          image: extractImagePath(item.image),
          category: item.category || 'NEWS',
          date,
          status: 'published'
        };
      }
    },
    {
      name: 'faqs',
      source: () => extractArray(ticketsFile, 'FALLBACK_FAQS'),
      mapper: (item, index) => ({
        question: item.question,
        answer: item.answer,
        category: 'Tickets',
        sort: index + 1,
        status: 'published'
      })
    },
    {
      name: 'matches',
      source: () => readJson(path.join(rootDir, 'public/data/matches.json')),
      mapper: (item) => ({
        home_team_name: item.homeTeam?.name || 'TBD',
        away_team_name: item.awayTeam?.name || 'TBD',
        home_team_logo: item.homeTeam?.logo || '',
        away_team_logo: item.awayTeam?.logo || '',
        venue: item.venue || 'Harare Sports Club',
        competition: item.competition || 'Friendly',
        category: item.category || 'Sables',
        date: item.date || '',
        time: item.time || '15:00',
        status: item.status || 'upcoming',
        home_team_score: item.score?.home,
        away_team_score: item.score?.away
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

    const items = job.source();
    if (items.length === 0) {
      console.log(`[SKIP] No items extracted for ${job.name}.`);
      report.push({ collection: job.name, status: 'skipped', reason: 'No source data' });
      continue;
    }
    console.log(`[INFO] Extracted ${items.length} items.`);

    let success = 0;
    let failed = 0;
    for (let i = 0; i < items.length; i++) {
      const mapped = job.mapper(items[i], i);
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
