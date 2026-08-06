import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DIRECTUS_URL = 'http://127.0.0.1:8055';
const EMAIL = 'admin@zimrugby.co.zw';
const PASSWORD = 'ZimRugbyUnion2027!';

// Helper to extract mock array from a TS file using matching brackets
function extractMockArray(filePath: string, varName: string): any[] {
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

  const startIndex = match.index! + match[0].length - 1; // start at '['
  let braceCount = 0;
  let endIndex = -1;

  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '[') braceCount++;
    if (content[i] === ']') {
      braceCount--;
      if (braceCount === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex === -1) {
    console.warn(`[WARN] Matching bracket not found for ${varName} in ${filePath}`);
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
    console.error(`[ERROR] Failed to eval array for ${varName} in ${filePath}:`, err);
    return [];
  }
}

// Helper to extract a single settings object
function extractMockObject(filePath: string, varName: string): any {
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

  const startIndex = match.index! + match[0].length - 1; // start at '{'
  let braceCount = 0;
  let endIndex = -1;

  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex === -1) {
    console.warn(`[WARN] Matching brace not found for ${varName} in ${filePath}`);
    return null;
  }

  const objectText = content.slice(startIndex, endIndex + 1);
  try {
    const data = eval(`(${objectText})`);
    return data;
  } catch (err) {
    console.error(`[ERROR] Failed to eval object for ${varName} in ${filePath}:`, err);
    return null;
  }
}

async function run() {
  console.log('=== ZimRugby Directus CMS Migration ===');
  
  // 1. Authenticate
  let token = '';
  try {
    const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const loginData = await loginRes.json() as any;
    token = loginData.data.access_token;
    console.log('[SUCCESS] Authenticated with Directus.');
  } catch (err: any) {
    console.error('[FATAL] Authentication failed:', err.message);
    process.exit(1);
  }

  const apiHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // 2. Fetch all collections to verify what's available
  let availableCollections: string[] = [];
  try {
    const collectionsRes = await fetch(`${DIRECTUS_URL}/collections`, { headers: apiHeaders });
    const collectionsData = await collectionsRes.json() as any;
    availableCollections = collectionsData.data.map((c: any) => c.collection);
  } catch (err: any) {
    console.error('[ERROR] Failed to fetch collections:', err.message);
  }

  // Helper to fetch items from a collection
  async function fetchItems(collection: string) {
    try {
      const res = await fetch(`${DIRECTUS_URL}/items/${collection}?limit=100`, { headers: apiHeaders });
      const body = await res.json() as any;
      return body.data || [];
    } catch {
      return [];
    }
  }

  // Load existing entities for matches mapping
  console.log('[INFO] Fetching current database references for matches mapping...');
  const teams = await fetchItems('teams');
  const opponents = await fetchItems('opponents');
  const competitions = await fetchItems('competitions');
  const venues = await fetchItems('venues');
  const matchesList = await fetchItems('matches');

  console.log(`[INFO] Loaded: ${teams.length} teams, ${opponents.length} opponents, ${competitions.length} competitions, ${venues.length} venues, ${matchesList.length} matches.`);

  // Helpers to resolve or create entities
  async function resolveTeamId(category: string, homeName: string, awayName: string): Promise<string> {
    const nameToMatch = category.toLowerCase().includes('lady') ? 'Lady Sables' : category.toLowerCase().includes('cheetah') ? 'Cheetahs' : 'Sables';
    const found = teams.find((t: any) => t.short_name?.toLowerCase() === nameToMatch.toLowerCase() || t.name?.toLowerCase().includes(nameToMatch.toLowerCase()));
    if (found) return String(found.id);
    
    if (teams.length > 0) return String(teams[0].id);
    
    const newId = randomUUID();
    const newTeam = {
      id: newId,
      name: 'Zimbabwe Sables',
      short_name: 'Sables',
      slug: 'sables',
      team_type: 'mens_15s',
      filter_label: 'Sables',
      status: 'published'
    };
    const res = await fetch(`${DIRECTUS_URL}/items/teams`, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(newTeam)
    });
    const body = await res.json() as any;
    teams.push(body.data);
    return String(body.data.id);
  }

  async function resolveOpponentId(name: string): Promise<string> {
    const cleanName = name.trim();
    let found = opponents.find((o: any) => o.name.toLowerCase() === cleanName.toLowerCase() || o.short_name?.toLowerCase() === cleanName.toLowerCase());
    if (found) return String(found.id);

    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    found = opponents.find((o: any) => o.slug === slug);
    if (found) return String(found.id);

    console.log(`[CREATING OPPONENT] ${cleanName}`);
    const newId = randomUUID();
    const newOpp = {
      id: newId,
      name: cleanName,
      short_name: cleanName,
      slug: slug,
      status: 'published'
    };
    const res = await fetch(`${DIRECTUS_URL}/items/opponents`, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(newOpp)
    });
    const body = await res.json() as any;
    if (body.data) {
      opponents.push(body.data);
      return String(body.data.id);
    } else {
      const errCode = body.errors?.[0]?.extensions?.code || body.errors?.[0]?.code;
      if (errCode === 'RECORD_NOT_UNIQUE') {
        console.log(`[INFO] Opponent ${cleanName} already exists by slug uniqueness.`);
        const currentOpponents = await fetchItems('opponents');
        const reFound = currentOpponents.find((o: any) => o.slug === slug);
        if (reFound) return String(reFound.id);
      }
      console.error('[ERROR] Opponent creation failed:', body.errors);
      if (opponents.length > 0) return String(opponents[0].id);
      throw new Error(`Failed to create opponent ${cleanName}`);
    }
  }

  async function resolveCompetitionId(name: string): Promise<string> {
    const cleanName = name.trim();
    let found = competitions.find((c: any) => c.name.toLowerCase() === cleanName.toLowerCase() || c.short_name?.toLowerCase() === cleanName.toLowerCase());
    if (found) return String(found.id);

    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    found = competitions.find((c: any) => c.slug === slug);
    if (found) return String(found.id);

    console.log(`[CREATING COMPETITION] ${cleanName}`);
    const newId = randomUUID();
    const newComp = {
      id: newId,
      name: cleanName,
      short_name: cleanName,
      slug: slug,
      competition_type: 'tournament',
      season_label: '2026',
      status: 'published'
    };
    const res = await fetch(`${DIRECTUS_URL}/items/competitions`, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(newComp)
    });
    const body = await res.json() as any;
    if (body.data) {
      competitions.push(body.data);
      return String(body.data.id);
    } else {
      const errCode = body.errors?.[0]?.extensions?.code || body.errors?.[0]?.code;
      if (errCode === 'RECORD_NOT_UNIQUE') {
        console.log(`[INFO] Competition ${cleanName} already exists by slug uniqueness.`);
        const currentComps = await fetchItems('competitions');
        const reFound = currentComps.find((c: any) => c.slug === slug);
        if (reFound) return String(reFound.id);
      }
      console.error('[ERROR] Competition creation failed:', body.errors);
      if (competitions.length > 0) return String(competitions[0].id);
      throw new Error(`Failed to create competition ${cleanName}`);
    }
  }

  async function resolveVenueId(name: string): Promise<string> {
    const cleanName = name.trim();
    let found = venues.find((v: any) => v.name.toLowerCase() === cleanName.toLowerCase());
    if (found) return String(found.id);

    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    found = venues.find((v: any) => v.slug === slug);
    if (found) return String(found.id);

    console.log(`[CREATING VENUE] ${cleanName}`);
    const newId = randomUUID();
    const newVenue = {
      id: newId,
      name: cleanName,
      slug: slug,
      status: 'published'
    };
    const res = await fetch(`${DIRECTUS_URL}/items/venues`, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(newVenue)
    });
    const body = await res.json() as any;
    if (body.data) {
      venues.push(body.data);
      return String(body.data.id);
    } else {
      const errCode = body.errors?.[0]?.extensions?.code || body.errors?.[0]?.code;
      if (errCode === 'RECORD_NOT_UNIQUE') {
        console.log(`[INFO] Venue ${cleanName} already exists by slug uniqueness.`);
        const currentVenues = await fetchItems('venues');
        const reFound = currentVenues.find((v: any) => v.slug === slug);
        if (reFound) return String(reFound.id);
      }
      console.error('[ERROR] Venue creation failed:', body.errors);
      if (venues.length > 0) return String(venues[0].id);
      throw new Error(`Failed to create venue ${cleanName}`);
    }
  }

  function parseKickoffTime(dateStr: string, timeStr: string): string {
    let year = 2026;
    let month = 7; 
    let day = 15;
    
    const months: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };

    const cleanDate = dateStr.toLowerCase();
    for (const mName of Object.keys(months)) {
      if (cleanDate.includes(mName)) {
        month = months[mName];
        break;
      }
    }

    const dayMatch = dateStr.match(/\b(\d+)\b/);
    if (dayMatch) {
      day = parseInt(dayMatch[1]);
    }

    const yearMatch = dateStr.match(/\b(202\d)\b/);
    if (yearMatch) {
      year = parseInt(yearMatch[1]);
    }

    let hours = 15;
    let minutes = 0;
    if (timeStr && timeStr.includes(':')) {
      const timeParts = timeStr.split(':');
      hours = parseInt(timeParts[0]);
      minutes = parseInt(timeParts[1]);
    }

    const d = new Date(Date.UTC(year, month, day, hours, minutes));
    return d.toISOString();
  }

  const apiDir = path.join(__dirname, '../src/lib/api');

  // Define migration jobs
  const jobs = [
    {
      name: 'announcements',
      filePath: path.join(apiDir, 'announcements.ts'),
      varName: 'MOCK_ANNOUNCEMENTS',
      type: 'array',
      mapper: async (item: any) => ({
        title: item.title,
        slug: item.slug,
        body: item.body,
        priority: item.priority === 'critical' ? 2 : item.priority === 'high' ? 1 : 0,
        page_scope: Array.isArray(item.scope) ? item.scope[0] : item.scope,
        cta_label: item.ctaLabel,
        cta_url: item.ctaUrl,
        start_at: item.startsAt,
        end_at: item.endsAt,
        category: item.segment,
        variant: item.designVariant,
        urgent: item.priority === 'critical'
      })
    },
    {
      name: 'hero_slides',
      filePath: path.join(apiDir, 'hero.ts'),
      varName: 'MOCK_SLIDES',
      type: 'array',
      mapper: async (item: any) => ({
        tag: item.tag,
        context_pill: item.contextPill,
        image: item.image,
        image_url: item.image,
        headline_line1: item.headline?.line1,
        headline_line2: item.headline?.line2,
        subtext: item.subtext,
        cta_primary_label: item.ctas?.primary?.label,
        cta_primary_href: item.ctas?.primary?.href,
        cta_primary_icon: item.ctas?.primary?.iconName,
        cta_secondary_label: item.ctas?.secondary?.label,
        cta_secondary_href: item.ctas?.secondary?.href,
        cta_secondary_icon: item.ctas?.secondary?.iconName
      })
    },
    {
      name: 'players',
      filePath: path.join(apiDir, 'players.ts'),
      varName: 'fallbackPlayers',
      type: 'array',
      mapper: async (item: any) => ({
        name: item.name,
        position: item.position,
        team: item.team,
        caps: item.caps,
        age: item.age,
        photo: item.photo,
        bio: item.bio,
        featured: item.featured,
        slug: item.slug,
        status: 'published'
      })
    },
    {
      name: 'competitions',
      filePath: path.join(apiDir, 'competitions.ts'),
      varName: 'fallbackCompetitions',
      type: 'array',
      mapper: async (item: any) => ({
        name: item.name,
        short_name: item.short_name,
        slug: item.slug,
        competition_type: item.competition_type,
        season_label: item.season_label,
        description: item.description,
        status: 'published'
      })
    },
    {
      name: 'matches',
      filePath: path.join(apiDir, 'fixtures.ts'),
      varName: 'staticMatches',
      type: 'array',
      mapper: async (item: any) => {
        const homeName = item.homeTeam?.name || 'Zimbabwe';
        const awayName = item.awayTeam?.name || 'Opponent';
        
        const isHome = homeName.toLowerCase().includes('zimbabwe') || homeName.toLowerCase().includes('sables');
        const opponentName = isHome ? awayName : homeName;

        const teamId = await resolveTeamId(item.category || 'Sables', homeName, awayName);
        const opponentId = await resolveOpponentId(opponentName);
        const compId = await resolveCompetitionId(item.competition || 'International Match');
        const venueId = await resolveVenueId(item.venue || 'Harare Sports Club');

        const kickoff = parseKickoffTime(item.date || '2026-08-30', item.time || '15:00');
        const slug = `${homeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-vs-${awayName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-2026`;

        return {
          id: randomUUID(),
          title: `${homeName} vs ${awayName}`,
          slug: slug,
          team_id: teamId,
          opponent_id: opponentId,
          competition_id: compId,
          venue_id: venueId,
          season_year: 2026,
          match_type: item.status === 'completed' ? 'result' : 'fixture',
          status: item.status === 'completed' ? 'final' : 'scheduled',
          home_or_away: isHome ? 'home' : 'away',
          kickoff_at: kickoff,
          display_date_label: item.date,
          display_time_label: item.time,
          round_label: item.round,
          team_score: (isHome ? item.homeTeam?.score : item.awayTeam?.score) ?? null,
          opponent_score: (isHome ? item.awayTeam?.score : item.homeTeam?.score) ?? null,
          result_outcome: item.status !== 'completed' ? 'na' : (isHome && (item.homeTeam?.score > item.awayTeam?.score)) || (!isHome && (item.awayTeam?.score > item.homeTeam?.score)) ? 'win' : 'loss',
          result_label: item.status === 'completed' ? 'RESULT' : 'UPCOMING',
          is_featured: !!item.is_featured,
          show_on_match_centre: true
        };
      }
    },
    {
      name: 'partners',
      filePath: path.join(apiDir, 'partners.ts'),
      varName: 'MOCK_PARTNERS',
      type: 'array',
      mapper: async (item: any) => ({
        name: item.name,
        role: item.role,
        logo_url: item.logo,
        description: item.blurb,
        website_url: item.href,
        badge: item.badge,
        sort: item.sort,
        status: 'published'
      })
    },
    {
      name: 'grassroots_initiatives',
      filePath: path.join(apiDir, 'initiatives.ts'),
      varName: 'FALLBACK_INITIATIVES',
      type: 'array',
      mapper: async (item: any) => ({
        title: item.title,
        badge: item.badge,
        subtitle: item.subtitle,
        description: item.description,
        stat: item.stats,
        image: item.image,
        link: item.link,
        status: 'published'
      })
    },
    {
      name: 'tickets',
      filePath: path.join(apiDir, 'tickets.ts'),
      varName: 'FALLBACK_FIXTURES',
      type: 'array',
      mapper: async (item: any) => ({
        competition: item.competition,
        teams: item.teams,
        date: item.date,
        time: item.time,
        venue: item.venue,
        city: item.city,
        status: item.status,
        url: item.url,
        category: item.category,
        is_world_cup_pathway: item.isWorldCupPathway
      })
    },
    {
      name: 'photos',
      filePath: path.join(apiDir, 'gallery.ts'),
      varName: 'mockPhotos',
      type: 'array',
      mapper: async (item: any) => ({
        title: item.title,
        album: item.album,
        image_url: item.image,
        date_label: item.date,
        description: item.description
      })
    },
    {
      name: 'videos',
      filePath: path.join(apiDir, 'videos.ts'),
      varName: 'mockVideos',
      type: 'array',
      mapper: async (item: any) => ({
        title: item.title,
        category: item.category,
        duration: item.duration,
        date_label: item.date,
        thumbnail_url: item.thumbnail,
        embed_url: item.embedUrl,
        description: item.description
      })
    },
    {
      name: 'clubs',
      filePath: path.join(apiDir, 'clubs.ts'),
      varName: 'fallbackClubs',
      type: 'array',
      mapper: async (item: any) => ({
        name: item.name,
        slug: item.slug,
        province: item.province,
        league: item.league,
        venue: item.venue,
        color: item.color,
        contact: item.contact,
        description: item.description,
        status: 'published'
      })
    },
    {
      name: 'school_initiatives',
      filePath: path.join(apiDir, 'schools.ts'),
      varName: 'fallbackInitiatives',
      type: 'array',
      mapper: async (item: any) => ({
        title: item.title,
        description: item.description,
        icon: item.icon,
        stat: item.stat,
        status: 'published'
      })
    },
    {
      name: 'referee_courses',
      filePath: path.join(apiDir, 'referees.ts'),
      varName: 'mockCourses',
      type: 'array',
      mapper: async (item: any) => ({
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
      filePath: path.join(apiDir, 'referees.ts'),
      varName: 'mockResources',
      type: 'array',
      mapper: async (item: any) => ({
        title: item.title,
        category: item.category,
        size: item.size,
        download_url: item.downloadUrl
      })
    },
    {
      name: 'referee_notices',
      filePath: path.join(apiDir, 'referees.ts'),
      varName: 'mockNotices',
      type: 'array',
      mapper: async (item: any) => ({
        title: item.title,
        date_label: item.date,
        excerpt: item.excerpt,
        content: item.content
      })
    },
    {
      name: 'global_settings',
      filePath: path.join(apiDir, 'site-settings.ts'),
      varName: 'fallbackSettings',
      type: 'object',
      mapper: async (item: any) => ({
        id: 'global-config',
        site_name: item.site_name,
        site_tagline: item.site_tagline,
        tickets_url: item.primary_cta_url,
        facebook_url: item.facebook_url,
        x_url: item.x_url || item.twitter_url,
        instagram_url: item.instagram_url,
        youtube_url: item.youtube_url,
        linkedin_url: item.linkedin_url,
        status: 'published'
      })
    }
  ];

  const report: any[] = [];

  for (const job of jobs) {
    console.log(`\n--- Processing collection: ${job.name} ---`);
    
    const hasCol = availableCollections.some(c => c.toLowerCase() === job.name.toLowerCase());
    if (!hasCol) {
      console.log(`[SKIP] Collection ${job.name} does not exist in Directus.`);
      report.push({ collection: job.name, status: 'skipped', reason: 'Collection does not exist' });
      continue;
    }

    if (job.name === 'global_settings') {
      try {
        const checkRes = await fetch(`${DIRECTUS_URL}/items/${job.name}/global-config`, { headers: apiHeaders });
        if (checkRes.ok) {
          console.log(`[SKIP] Collection ${job.name} already has global-config populated.`);
          report.push({ collection: job.name, status: 'skipped', reason: 'Already populated' });
          continue;
        }
      } catch {}
    } else {
      try {
        const checkRes = await fetch(`${DIRECTUS_URL}/items/${job.name}?limit=1`, { headers: apiHeaders });
        const checkData = await checkRes.json() as any;
        if (checkData.data && checkData.data.length > 0 && job.name !== 'matches') {
          console.log(`[SKIP] Collection ${job.name} already has items. Skipping to avoid duplicates.`);
          report.push({ collection: job.name, status: 'skipped', reason: 'Already populated' });
          continue;
        }
      } catch (err: any) {
        console.warn(`[WARN] Could not check items in ${job.name}:`, err.message);
      }
    }

    let itemsToMigrate: any[] = [];
    if (job.type === 'array') {
      itemsToMigrate = extractMockArray(job.filePath, job.varName);
    } else {
      const obj = extractMockObject(job.filePath, job.varName);
      if (obj) itemsToMigrate = [obj];
    }

    if (itemsToMigrate.length === 0) {
      console.log(`[SKIP] No mock items extracted for ${job.name}.`);
      report.push({ collection: job.name, status: 'skipped', reason: 'No mock data' });
      continue;
    }

    console.log(`[INFO] Extracted ${itemsToMigrate.length} items to migrate.`);

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    for (const rawItem of itemsToMigrate) {
      const mapped = await job.mapper(rawItem);
      try {
        const postRes = await fetch(`${DIRECTUS_URL}/items/${job.name}`, {
          method: 'POST',
          headers: apiHeaders,
          body: JSON.stringify(mapped)
        });
        if (postRes.ok) {
          successCount++;
        } else {
          const errData = await postRes.json() as any;
          const firstErr = errData.errors?.[0];
          const errCode = firstErr?.extensions?.code || firstErr?.code;
          if (errCode === 'RECORD_NOT_UNIQUE') {
            skipCount++;
            console.log(`[INFO] Item with slug/id already exists. Skipped.`);
          } else {
            failCount++;
            console.warn(`[ERROR] Failed to POST item to ${job.name}:`, errData.errors || postRes.statusText);
            console.log('Payload was:', JSON.stringify(mapped, null, 2));
          }
        }
      } catch (err: any) {
        failCount++;
        console.warn(`[ERROR] Failed to POST item to ${job.name}:`, err.message);
      }
    }

    console.log(`[RESULT] ${job.name}: ${successCount} succeeded, ${failCount} failed, ${skipCount} skipped.`);
    report.push({
      collection: job.name,
      status: successCount > 0 || skipCount > 0 ? 'success' : 'failed',
      details: `${successCount} migrated, ${skipCount} skipped, ${failCount} failed`
    });
  }

  console.log('\n=== Migration Completed ===');
  console.table(report);

  let reportMd = `# Directus Migration Report\n\n`;
  reportMd += `**Date:** ${new Date().toISOString()}\n\n`;
  reportMd += `| Collection | Status | Details / Reason |\n`;
  reportMd += `| --- | --- | --- |\n`;
  for (const item of report) {
    reportMd += `| ${item.collection} | ${item.status} | ${item.details || item.reason} |\n`;
  }

  const reportPath = 'C:\\Users\\Edward Magejo\\.gemini\\ag-comm\\pending\\res-2026-07-31-0731.md';
  fs.writeFileSync(reportPath, reportMd);
  console.log(`[SUCCESS] Wrote migration report to ${reportPath}`);
}

run();
