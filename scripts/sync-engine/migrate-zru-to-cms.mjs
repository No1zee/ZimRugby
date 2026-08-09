import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'admin@zimrugby.co.zw';
const PASSWORD = 'admin-password-***REMOVED***';

const DATA_DIR = path.resolve(__dirname, '../../public/data');

function readJson(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] File not found: ${filePath}`);
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

async function run() {
  console.log('=== Migrating Scraped ZRU Data to Directus CMS ===');

  // Authenticate
  const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  if (!loginRes.ok) {
    console.error('Failed to authenticate with Directus CMS.');
    process.exit(1);
  }
  const loginData = await loginRes.json();
  const token = loginData.data.access_token;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  console.log('[SUCCESS] Authenticated with Directus.');

  // Helper to delete all items in a collection to avoid duplicate/validation failures
  async function clearCollection(name) {
    try {
      const getRes = await fetch(`${DIRECTUS_URL}/items/${name}?limit=-1`, { headers });
      const data = await getRes.json();
      if (data.data && data.data.length > 0) {
        const ids = data.data.map(item => item.id);
        const delRes = await fetch(`${DIRECTUS_URL}/items/${name}`, {
          method: 'DELETE',
          headers,
          body: JSON.stringify(ids)
        });
        if (delRes.ok) {
          console.log(`[OK] Cleared existing ${data.data.length} items from collection: ${name}`);
        } else {
          console.warn(`[WARN] Failed to delete items in ${name}: ${delRes.statusText}`);
        }
      }
    } catch (err) {
      console.warn(`[WARN] Error clearing ${name}: ${err.message}`);
    }
  }

  // --- Clear target tables ---
  await clearCollection('news');
  await clearCollection('faqs');
  await clearCollection('events');
  await clearCollection('matches');

  // --- 1. Migrate News (from articles.json) ---
  const articles = readJson('articles.json');
  console.log(`\n--- Migrating News (${articles.length} items) ---`);
  for (const art of articles) {
    const payload = {
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt,
      body: art.bodyHtml,
      image: art.featuredImageUrl.startsWith('/') ? art.featuredImageUrl : '',
      category: art.categories[0] || 'News',
      date: art.publishedAt ? new Date(art.publishedAt).toISOString() : new Date().toISOString(),
      status: 'published'
    };
    const res = await fetch(`${DIRECTUS_URL}/items/news`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      console.log(`[OK] Migrated article: ${art.title}`);
    } else {
      console.error(`[ERROR] Failed migrating article: ${art.title}`, await res.text());
    }
  }

  // --- 2. Migrate FAQs (from faq.json) ---
  const faqs = readJson('faq.json');
  console.log(`\n--- Migrating FAQs (${faqs.length} items) ---`);
  for (const f of faqs) {
    const payload = {
      question: f.question,
      answer: f.answerHtml,
      category: 'General',
      status: 'published'
    };
    const res = await fetch(`${DIRECTUS_URL}/items/faqs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      console.log(`[OK] Migrated FAQ: ${f.question}`);
    } else {
      console.error(`[ERROR] Failed migrating FAQ: ${f.question}`, await res.text());
    }
  }

  // --- 3. Migrate Events (from events.json) ---
  const events = readJson('events.json');
  console.log(`\n--- Migrating Events (${events.length} items) ---`);
  for (const ev of events) {
    const payload = {
      id: ev.id,
      title: ev.title,
      description: ev.description,
      date: new Date().toISOString().split('T')[0], // Map to ISO date string format
      status: 'published'
    };
    const res = await fetch(`${DIRECTUS_URL}/items/events`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      console.log(`[OK] Migrated Event: ${ev.title}`);
    } else {
      console.error(`[ERROR] Failed migrating Event: ${ev.title}`, await res.text());
    }
  }

  // --- 4. Migrate Matches (from fixtures.json) ---
  const fixtures = readJson('fixtures.json');
  console.log(`\n--- Migrating Matches (${fixtures.length} items) ---`);
  
  // IDs resolved from active data.db check
  const sablesTeamId = '0e676b8b-6ae1-4c71-8531-802717787a46';
  const zambiaOpponentId = '476fab29-2375-42d4-8033-e44198b7ed11';
  const friendlyCompetitionId = 'friendly-international';
  const harareVenueId = '2b2beb99-f9be-4a1d-888c-d48e3044b4a8';

  for (const fix of fixtures) {
    const title = `${fix.homeTeam} vs ${fix.awayTeam}`;
    const slug = `${fix.homeTeam.toLowerCase().replace(/ /g, '-')}-vs-${fix.awayTeam.toLowerCase().replace(/ /g, '-')}-${fix.id}`;
    
    const payload = {
      id: fix.id,
      title: title,
      slug: slug,
      team_id: sablesTeamId,
      opponent_id: zambiaOpponentId, // Zambia opponent ID as default match opponent relation
      competition_id: friendlyCompetitionId,
      venue_id: harareVenueId,
      match_type: 'friendly',
      kickoff_at: new Date().toISOString(),
      display_date_label: fix.date,
      display_time_label: '15:00',
      status: 'upcoming',
      home_team_name: fix.homeTeam,
      away_team_name: fix.awayTeam,
      competition: fix.competitionLabel,
      venue: fix.venue,
      category: 'Sables',
      date: fix.date,
      time: '15:00'
    };
    
    const res = await fetch(`${DIRECTUS_URL}/items/matches`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      console.log(`[OK] Migrated Match: ${title}`);
    } else {
      console.error(`[ERROR] Failed migrating Match: ${title}`, await res.text());
    }
  }

  console.log('\n=== Directus CMS Migration Completed ===');
}

run();
