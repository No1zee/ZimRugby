import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIRECTUS_URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@zimrugby.co.zw';
const PASSWORD = 'admin-password-***REMOVED***';

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

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function ensureField(token, collection, field, type, meta = {}) {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  const check = await fetch(`${DIRECTUS_URL}/fields/${collection}`, { headers });
  const checkData = await check.json();
  const exists = (checkData.data || []).some((f) => f.field === field);
  if (exists) {
    console.log(`[SKIP] ${collection}.${field} already exists.`);
    return;
  }

  const body = {
    field,
    type,
    meta: {
      interface: meta.interface || 'input',
      options: meta.options || null,
      hidden: false,
      readonly: false,
      required: false,
      sort: meta.sort || null,
      note: meta.note || null
    },
    schema: {
      data_type: type === 'string' ? 'varchar' : undefined,
      max_length: type === 'string' ? 255 : undefined
    }
  };
  // only include schema keys that apply
  if (type !== 'string') delete body.schema;

  const res = await fetch(`${DIRECTUS_URL}/fields/${collection}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  if (res.ok) {
    console.log(`[OK] + ${collection}.${field} (${type})`);
  } else {
    const errData = await res.json();
    console.warn(`[WARN] Could not create ${collection}.${field}:`, errData.errors || res.statusText);
  }
}

async function patchItem(token, collection, id, payload) {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  const res = await fetch(`${DIRECTUS_URL}/items/${collection}/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload)
  });
  return res.ok;
}

async function run() {
  console.log('=== Option A: Align Directus Schema to Frontend Contract ===');

  const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD })
  });
  const loginData = await loginRes.json();
  const token = loginData.data.access_token;
  console.log('[SUCCESS] Authenticated.');

  // ---- 1. Add contract fields ----
  console.log('\n--- announcements ---');
  await ensureField(token, 'announcements', 'slug', 'string');
  await ensureField(token, 'announcements', 'scope', 'json', { interface: 'list' });
  await ensureField(token, 'announcements', 'starts_at', 'dateTime', { interface: 'datetime' });
  await ensureField(token, 'announcements', 'ends_at', 'dateTime', { interface: 'datetime' });
  await ensureField(token, 'announcements', 'segment', 'string');
  await ensureField(token, 'announcements', 'design_variant', 'string');
  await ensureField(token, 'announcements', 'is_sticky', 'boolean', { interface: 'toggle' });
  await ensureField(token, 'announcements', 'badge', 'string');

  console.log('\n--- photos ---');
  await ensureField(token, 'photos', 'album', 'string');
  await ensureField(token, 'photos', 'image', 'uuid', { interface: 'file' });
  await ensureField(token, 'photos', 'image_url', 'string');
  await ensureField(token, 'photos', 'date', 'dateTime', { interface: 'datetime' });
  await ensureField(token, 'photos', 'date_label', 'string');
  await ensureField(token, 'photos', 'description', 'text', { interface: 'input-multiline' });

  console.log('\n--- videos ---');
  await ensureField(token, 'videos', 'embed_url', 'string');
  await ensureField(token, 'videos', 'date', 'dateTime', { interface: 'datetime' });
  await ensureField(token, 'videos', 'date_label', 'string');
  await ensureField(token, 'videos', 'thumbnail_url', 'string');

  // ---- 2. Backfill existing rows ----
  console.log('\n=== Backfilling existing rows ===');

  const headers = { Authorization: `Bearer ${token}` };
  const apiHeaders = { ...headers, 'Content-Type': 'application/json' };

  // --- announcements: derive contract fields from seeded values ---
  console.log('\n--- announcements backfill ---');
  const annRes = await fetch(`${DIRECTUS_URL}/items/announcements?limit=100`, { headers });
  const annItems = (await annRes.json()).data || [];
  for (const it of annItems) {
    const payload = {
      slug: it.slug || slugify(it.title || `announcement-${it.id}`),
      scope: it.scope ?? ['homepage'],
      starts_at: it.starts_at || it.start_at || it.date || new Date().toISOString(),
      ends_at: it.ends_at || it.end_at || '2030-12-31T23:59:59',
      segment: it.segment || (it.audience_scope === 'all' ? 'general' : (it.audience_scope || 'general')),
      design_variant: it.design_variant || (it.variant === 'ticker' ? 'ticker' : 'banner'),
      is_sticky: it.is_sticky ?? !!it.urgent,
      badge: it.badge || it.category || 'ANNOUNCEMENT'
    };
    const ok = await patchItem(token, 'announcements', it.id, payload);
    console.log(`[${ok ? 'OK' : 'FAIL'}] announcements/${it.id} (${it.title})`);
  }

  // --- photos: backfill from mock (matched by title) ---
  console.log('\n--- photos backfill ---');
  const gallerySrc = path.join(__dirname, '..', 'src', 'lib', 'api', 'gallery.ts');
  const galleryContent = fs.readFileSync(gallerySrc, 'utf-8');
  const mockStart = galleryContent.indexOf('const mockPhotos: Photo[] = [');
  const mockEnd = galleryContent.indexOf('];', mockStart) + 2;
  const mockArr = galleryContent.slice(mockStart, mockEnd)
    .replace('const mockPhotos: Photo[] = ', '')
    .replace(/;\s*$/, '')
    .replace(/as\s+const/g, '');
  let mockPhotos = [];
  try {
    mockPhotos = eval(`(${mockArr})`);
  } catch (err) {
    console.warn('[WARN] Could not parse mockPhotos:', err.message);
  }

  const photoRes = await fetch(`${DIRECTUS_URL}/items/photos?limit=100`, { headers });
  const photoItems = (await photoRes.json()).data || [];
  for (const it of photoItems) {
    const mock = mockPhotos.find((p) => p.title === it.title);
    const dateISO = parseDisplayDate(mock?.date) || parseDisplayDate(it.taken_at) || null;
    const payload = {
      album: it.album || mock?.album || 'General',
      image_url: it.image_url || mock?.image || '',
      date: it.date || dateISO,
      date_label: it.date_label || mock?.date || '',
      description: it.description || mock?.description || it.caption || ''
    };
    const ok = await patchItem(token, 'photos', it.id, payload);
    console.log(`[${ok ? 'OK' : 'FAIL'}] photos/${it.id} (${it.title})`);
  }

  // --- videos: backfill from mock (matched by title) ---
  console.log('\n--- videos backfill ---');
  const videosSrc = path.join(__dirname, '..', 'src', 'lib', 'api', 'videos.ts');
  const videosContent = fs.readFileSync(videosSrc, 'utf-8');
  const vStart = videosContent.indexOf('const mockVideos: Video[] = [');
  const vEnd = videosContent.indexOf('];', vStart) + 2;
  const vArr = videosContent.slice(vStart, vEnd)
    .replace('const mockVideos: Video[] = ', '')
    .replace(/;\s*$/, '')
    .replace(/as\s+const/g, '');
  let mockVideos = [];
  try {
    mockVideos = eval(`(${vArr})`);
  } catch (err) {
    console.warn('[WARN] Could not parse mockVideos:', err.message);
  }

  const videoRes = await fetch(`${DIRECTUS_URL}/items/videos?limit=100`, { headers });
  const videoItems = (await videoRes.json()).data || [];
  for (const it of videoItems) {
    const mock = mockVideos.find((v) => v.title === it.title);
    const dateISO = parseDisplayDate(mock?.date) || null;
    const payload = {
      embed_url: it.embed_url || it.video_url || '',
      thumbnail_url: it.thumbnail_url || mock?.thumbnail || '',
      date: it.date || dateISO,
      date_label: it.date_label || mock?.date || ''
    };
    const ok = await patchItem(token, 'videos', it.id, payload);
    console.log(`[${ok ? 'OK' : 'FAIL'}] videos/${it.id} (${it.title})`);
  }

  console.log('\n=== Option A migration complete ===');
}

run().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
