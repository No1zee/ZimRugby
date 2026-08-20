#!/usr/bin/env node
/**
 * Official Rugby Data Sync Engine for Zimbabwe Rugby Union
 * 
 * Ingestion Flow:
 * 1. Scrape / ingest official national rugby fixtures & results (Sables, Lady Sables, Junior Sables, Cheetahs).
 * 2. SINGLE SOURCE OF TRUTH: Register master fixture in `events` (Events Calendar).
 * 3. Resolve or auto-create `opponents` and `venues`.
 * 4. Upsert corresponding relational fixture in `matches` (Match Centre).
 * 5. Reconcile & Merge: Prevent duplicates by matching on date + team.
 * 6. Fire Next.js ISR webhook for instant live site refresh.
 */

import crypto from 'crypto';

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://zru-directus-cms-production.up.railway.app';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_TOKEN || process.env.DIRECTUS_ADMIN_TOKEN || 'zru-directus-admin-bd92e3c6572c02320b494e2bfa5f9d888d780879debdae60';
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || '7lVFN3MEHmgsJ5irAGhpf8BckW0SXyC6';
const SITE_URL = process.env.SITE_URL || 'https://zimrugby.vercel.app';

// Known Team UUID Mapping in Directus
const ZRU_TEAMS = {
  SABLES: { id: '49c6b5b8-dfa9-49b2-a605-f5bc1fe1fcb7', name: 'Zimbabwe Sables', slug: 'sables' },
  LADY_SABLES: { id: '716878c7-8df9-4116-b823-56270d19ba27', name: 'Zimbabwe Lady Sables', slug: 'lady-sables' },
  JUNIOR_SABLES: { id: 'acc56cf0-eb23-4f11-ae11-1f018eededf3', name: 'Zimbabwe Junior Sables', slug: 'junior-sables' },
  U20: { id: '710b9565-d266-4c8c-94c8-596f617d7549', name: 'Zimbabwe U20', slug: 'zimbabwe-u20' },
  CHEETAHS: { id: 'ace495a6-a663-4ebd-bfdc-72044a0cb7bb', name: 'Zimbabwe Cheetahs 7s', slug: 'cheetahs' }
};

// Directus API Helper
async function directusApi(endpoint, options = {}) {
  const url = `${DIRECTUS_URL}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Directus API Error [${res.status}] ${endpoint}: ${errorText}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

/**
 * Opponent Resolver: Find existing or auto-create opponent record
 */
async function resolveOpponent(opponentName, countryCode = 'INT') {
  const slug = opponentName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existing = await directusApi(`/items/opponents?filter[slug][_eq]=${encodeURIComponent(slug)}`);

  if (existing?.data?.length > 0) {
    return existing.data[0].id;
  }

  // Auto-create missing opponent
  const id = crypto.randomUUID();
  const payload = {
    id,
    name: opponentName,
    short_name: opponentName.replace(/ Rugby| National Team| XV/gi, '').trim(),
    slug,
    code: countryCode.toUpperCase(),
    country: opponentName,
    team_type: 'national',
    status: 'published'
  };

  await directusApi('/items/opponents', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  console.log(`🆕 Auto-created opponent: "${opponentName}" (ID: ${id})`);
  return id;
}

/**
 * Competition Resolver: Find existing or auto-create competition record
 */
async function resolveCompetition(compName, compType = 'cup') {
  const slug = compName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existing = await directusApi(`/items/competitions?filter[slug][_eq]=${encodeURIComponent(slug)}`);

  if (existing?.data?.length > 0) {
    return existing.data[0].id;
  }

  const id = crypto.randomUUID();
  const payload = {
    id,
    name: compName,
    short_name: compName.replace(/ 20\d\d/g, '').trim(),
    slug,
    competition_type: compType,
    season_label: new Date().getFullYear().toString(),
    is_standings_enabled: false,
    status: 'published'
  };

  await directusApi('/items/competitions', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  console.log(`🆕 Auto-created competition: "${compName}" (ID: ${id})`);
  return id;
}

/**
 * Venue Resolver: Find existing or auto-create venue record
 */
async function resolveVenue(venueName, city = 'Harare') {
  if (!venueName) venueName = 'Harare Sports Club';
  const slug = venueName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existing = await directusApi(`/items/venues?filter[slug][_eq]=${encodeURIComponent(slug)}`);

  if (existing?.data?.length > 0) {
    return existing.data[0].id;
  }

  const id = crypto.randomUUID();
  const payload = {
    id,
    name: venueName,
    slug,
    city: city || 'Harare',
    country: 'Zimbabwe',
    status: 'published'
  };

  await directusApi('/items/venues', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  console.log(`🆕 Auto-created venue: "${venueName}" (ID: ${id})`);
  return id;
}

/**
 * Primary Ingestion Function: Ingest fixture via Events Calendar first, then Match Centre
 */
export async function ingestFixture({
  title,
  teamKey = 'SABLES',
  opponentName,
  opponentCountryCode = 'INT',
  competitionName = 'Rugby Africa Cup 2026',
  venueName = 'Harare Sports Club',
  dateIso, // e.g. "2026-08-25T15:00:00Z"
  dateLabel, // e.g. "25 AUG"
  timeLabel = '15:00 CAT',
  status = 'upcoming', // 'upcoming' | 'completed' | 'live'
  homeScore = null,
  awayScore = null,
  isHome = true
}) {
  const zruTeam = ZRU_TEAMS[teamKey] || ZRU_TEAMS.SABLES;
  const matchTitle = title || `${zruTeam.name} vs ${opponentName}`;
  const matchSlug = `${zruTeam.slug}-vs-${opponentName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${dateIso ? dateIso.split('T')[0] : 'tbd'}`;

  // 1. Ingest into Master Events Calendar FIRST (Single Source of Truth)
  console.log(`\n📅 [Calendar Event] Processing: "${matchTitle}"...`);
  const eventDate = dateIso ? dateIso.split('T')[0] : null;
  const existingEvents = await directusApi(`/items/events?filter[title][_eq]=${encodeURIComponent(matchTitle)}`);
  
  const eventPayload = {
    title: matchTitle,
    subtitle: `${competitionName} • ${zruTeam.name}`,
    date: eventDate,
    time: timeLabel,
    date_label: dateLabel || (eventDate ? new Date(eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase() : 'TBD'),
    location: venueName,
    description: `Official rugby fixture between ${zruTeam.name} and ${opponentName} in the ${competitionName}.`,
    category: 'International',
    event_type: 'match',
    page_type: 'competition',
    timezone: 'Africa/Harare',
    visibility: 'public',
    status: 'published'
  };

  let eventId;
  if (existingEvents?.data?.length > 0) {
    eventId = existingEvents.data[0].id;
    await directusApi(`/items/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(eventPayload)
    });
    console.log(`🔄 Reconciled & updated master calendar event #${eventId}: "${matchTitle}"`);
  } else {
    const res = await directusApi('/items/events', {
      method: 'POST',
      body: JSON.stringify(eventPayload)
    });
    eventId = res.data.id;
    console.log(`✅ Created master calendar event #${eventId}: "${matchTitle}"`);
  }

  // 2. Resolve Relational Entities
  const opponentId = await resolveOpponent(opponentName, opponentCountryCode);
  const competitionId = await resolveCompetition(competitionName);
  const venueId = await resolveVenue(venueName);

  // 3. Upsert into Match Centre
  console.log(`🏉 [Match Centre] Linking fixture: ${matchSlug}...`);
  const existingMatches = await directusApi(`/items/matches?filter[slug][_eq]=${encodeURIComponent(matchSlug)}`);

  const matchPayload = {
    title: matchTitle,
    slug: matchSlug,
    team_id: zruTeam.id,
    opponent_id: opponentId,
    competition_id: competitionId,
    venue_id: venueId,
    season_year: dateIso ? new Date(dateIso).getFullYear() : 2026,
    match_type: 'test_match',
    status: status,
    home_or_away: isHome ? 'home' : 'away',
    kickoff_at: dateIso || new Date().toISOString(),
    kickoff_timezone: 'Africa/Harare',
    display_date_label: dateLabel || (eventDate ? new Date(eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase() : 'TBD'),
    display_time_label: timeLabel,
    team_score: homeScore,
    opponent_score: awayScore,
    show_on_match_centre: true,
    show_on_homepage: true,
    show_on_team_page: true,
    status_editorial: 'published'
  };

  if (existingMatches?.data?.length > 0) {
    const matchId = existingMatches.data[0].id;
    await directusApi(`/items/matches/${matchId}`, {
      method: 'PATCH',
      body: JSON.stringify(matchPayload)
    });
    console.log(`🔄 Updated Match Centre fixture: ${matchSlug}`);
  } else {
    matchPayload.id = crypto.randomUUID();
    await directusApi('/items/matches', {
      method: 'POST',
      body: JSON.stringify(matchPayload)
    });
    console.log(`✅ Created Match Centre fixture: ${matchSlug}`);
  }

  return { eventId, matchSlug };
}

/**
 * Revalidate Edge Cache on Vercel
 */
export async function triggerRevalidation(collections = ['events', 'matches', 'competitions', 'opponents', 'venues']) {
  console.log(`\n🚀 Triggering site ISR revalidation for: ${collections.join(', ')}...`);
  try {
    for (const coll of collections) {
      const res = await fetch(`${SITE_URL}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${REVALIDATE_SECRET}`
        },
        body: JSON.stringify({ collection: coll })
      });
      if (res.ok) {
        console.log(`✅ Revalidated cache tag: directus:${coll}`);
      } else {
        console.warn(`⚠️ Revalidation response for ${coll}: ${res.status}`);
      }
    }
  } catch (err) {
    console.warn('⚠️ Revalidation error:', err.message);
  }
}

/**
 * Automated Test Runner / Sync Routine
 */
async function run() {
  console.log('🏉 === Zimbabwe Rugby Union - Master Fixture Sync Engine === 🏉');
  console.log(`Directus Target: ${DIRECTUS_URL}`);
  
  try {
    // Example: Sync key representative squad fixtures through Events Calendar first
    await ingestFixture({
      title: 'Zimbabwe Sables vs Namibia Welwitschias',
      teamKey: 'SABLES',
      opponentName: 'Namibia Welwitschias',
      opponentCountryCode: 'NAM',
      competitionName: 'Rugby Africa Cup 2026',
      venueName: 'Harare Sports Club',
      dateIso: '2026-08-29T15:00:00Z',
      dateLabel: '29 AUG',
      timeLabel: '15:00 CAT',
      status: 'upcoming'
    });

    await ingestFixture({
      title: 'Zimbabwe Lady Sables vs Uganda Lady Cranes',
      teamKey: 'LADY_SABLES',
      opponentName: 'Uganda Lady Cranes',
      opponentCountryCode: 'UGA',
      competitionName: 'Rugby Africa Women Cup 2026',
      venueName: 'Police Grounds, Harare',
      dateIso: '2026-09-05T14:00:00Z',
      dateLabel: '05 SEP',
      timeLabel: '14:00 CAT',
      status: 'upcoming'
    });

    await triggerRevalidation();
    console.log('\n🎉 All fixtures successfully synchronized through Events Calendar first!');
  } catch (err) {
    console.error('\n❌ Ingestion error:', err);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith('official-rugby-sync.mjs')) {
  run();
}
