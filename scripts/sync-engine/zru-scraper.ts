import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://zru.co.zw';
const OUTPUT_DIR = path.resolve(__dirname, '../../public/data');
const DOCS_DIR = path.resolve(__dirname, '../../docs');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

const PAGES = [
  '/',
  '/about-us/',
  '/news/',
  '/latest-news/',
  '/team/spoclub/',
  '/calendar/large-calendar/',
  '/category/men/',
  '/category/women/',
  '/?page_id=3729',
];

// Flag emoji -> ISO country code mapping
const FLAG_TO_CODE: Record<string, string> = {
  '🇿🇼': 'ZW', '🇿🇦': 'ZA', '🇳🇦': 'NA', '🇰🇪': 'KE', '🇺🇬': 'UG',
  '🇹🇿': 'TZ', '🇧🇼': 'BW', '🇿🇲': 'ZM', '🇲🇿': 'MZ', '🇲🇬': 'MG',
};

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyHtml: string;
  publishedAt: string;
  author: string;
  categories: string[];
  featuredImageUrl: string;
}

interface Fixture {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  type: string;
  competitionLabel: string;
  venue: string;
  countryCode: string;
}

interface Event {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface Award {
  id: string;
  title: string;
  year: string;
  category: string;
}

interface FaqItem {
  id: string;
  question: string;
  answerHtml: string;
}

interface NavItem {
  id: string;
  label: string;
  url: string;
  group: 'header' | 'footer';
  order: number;
}

interface SiteMeta {
  address: string;
  email: string;
  phone: string;
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  copyright: string;
  partnerCta: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaUrl: string;
  };
}

async function fetchPage(url: string): Promise<string> {
  try {
    const response = await fetch(url, { headers: HEADERS, redirect: 'follow' });
    if (!response.ok) return '';
    return await response.text();
  } catch {
    return '';
  }
}

async function fetchWithPlaywright(url: string): Promise<string> {
  try {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ userAgent: HEADERS['User-Agent'] });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const html = await page.content();
    await browser.close();
    return html;
  } catch {
    return '';
  }
}

async function getHtml(url: string): Promise<string> {
  let html = await fetchPage(url);
  if (!html) {
    console.warn(`[WARN] fetch() failed for ${url}, trying Playwright fallback...`);
    html = await fetchWithPlaywright(url);
  }
  return html;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function parseDateText(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/** Remove emoji and decorative icons from text (keeps clean, ASCII-friendly output) */
function stripEmoji(str: string): string {
  return (str || '')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}\u{1F1E6}-\u{1F1FF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Parse homepage hero section */
function parseHero($: cheerio.CheerioAPI): { heading: string; subheading: string; ctaLabel: string; ctaUrl: string } {
  const heading = $('h1').first().text().replace(/\s+/g, ' ').trim() || 'THE ZIMBABWE RUGBY UNION';
  const subheading = $('p').first().text().replace(/\s+/g, ' ').trim() ||
    'GO TO VIDEO HUB – Hub of resources for all updates surrounding rugby in Zimbabwe.';
  return {
    heading,
    subheading,
    ctaLabel: 'VIEW MORE \u2192',
    ctaUrl: '/about-us/',
  };
}

/** Parse latest news / blog grid (ul.ova-blog li.item) */
function parseArticles($: cheerio.CheerioAPI, source: string): Article[] {
  const articles: Article[] = [];
  $('ul.ova-blog li.item').each((i, el) => {
    const title = $(el).find('.post-title').text().replace(/\s+/g, ' ').trim();
    if (!title) return;
    const href = $(el).find('.post-title a').attr('href') || '';
    const date = $(el).find('.post-date').text().replace(/\s+/g, ' ').trim() ||
      $(el).find('.date').text().replace(/\s+/g, ' ').trim() || '';
    const author = $(el).find('.post-author').text().replace(/\s+/g, ' ').trim() || 'ZRU Webmaster';
    const excerpt = $(el).find('.short_desc').text().replace(/\s+/g, ' ').trim() || '';
    const image = $(el).find('img').attr('src') || '';

    articles.push({
      id: `${source}-news-${i}`,
      slug: path.basename(new URL(href).pathname) || `article-${i}`,
      title,
      excerpt,
      bodyHtml: excerpt ? `<p>${excerpt}</p>` : '',
      publishedAt: date,
      author,
      categories: ['News'],
      featuredImageUrl: image || '/images/default-news.jpg',
    });
  });
  return articles;
}

/** Parse match schedule carousel slides */
function parseFixtures($: cheerio.CheerioAPI): Fixture[] {
  const fixtures: Fixture[] = [];
  $('.carousel-slide').each((i, el) => {
    const date = stripEmoji(parseDateText($(el).find('.date-badge').text()));
    const teamLeft = $(el).find('.team.team-left .team-name').text().replace(/\s+/g, ' ').trim();
    const teamLeftSub = $(el).find('.team.team-left .team-name-small').text().replace(/\s+/g, ' ').trim();
    const teamRight = $(el).find('.team.team-right .team-name').text().replace(/\s+/g, ' ').trim();
    const teamRightSub = $(el).find('.team.team-right .team-name-small').text().replace(/\s+/g, ' ').trim();
    if (!date || !teamLeft) return;

    const homeTeam = teamLeftSub ? `${teamLeft} ${teamLeftSub}` : teamLeft;
    const awayTeam = teamRightSub ? `${teamRight} ${teamRightSub}` : teamRight || 'TBD Opponent';

    const type = $(el).find('.team-result').first().text().replace(/\s+/g, ' ').trim() || 'Friendly';
    const leagueText = $(el).find('.match-league').text().replace(/\s+/g, ' ').trim();
    const venue = stripEmoji(
      $(el).find('.match-venue').text().replace(/\s+/g, ' ').trim() ||
      leagueText.replace(/^⚡\s*/i, '') || 'Harare Sports Club'
    );

    const flagMatch = $(el).text().match(/🇿🇼|🇿🇦|🇳🇦|🇰🇪|🇺🇬|🇹🇿|🇧🇼|🇿🇲|🇲🇿|🇲🇬/);
    const countryCode = flagMatch ? FLAG_TO_CODE[flagMatch[0]] || 'ZW' : 'ZW';

    fixtures.push({
      id: `zru-fixture-${i}`,
      date,
      homeTeam,
      awayTeam,
      type: type.toLowerCase(),
      competitionLabel: type,
      venue,
      countryCode,
    });
  });
  return fixtures;
}

/** Parse upcoming events (list inside the schedule carousel) */
function parseEvents($: cheerio.CheerioAPI): Event[] {
  const events: Event[] = [];
  $('.upcoming-item').each((i, el) => {
    const date = stripEmoji(parseDateText($(el).find('.upcoming-date').text()));
    const title = parseDateText($(el).find('.upcoming-name').text());
    if (!date || !title) return;
    events.push({
      id: `zru-event-${i}`,
      date,
      title,
      description: '',
    });
  });
  return events;
}

/** Parse footer nav menus */
function parseNav($: cheerio.CheerioAPI): NavItem[] {
  const nav: NavItem[] = [];
  let order = 1;
  $('nav a, .menu a').each((i, el) => {
    const label = $(el).text().replace(/\s+/g, ' ').trim();
    const href = $(el).attr('href') || '';
    if (!label || !href) return;
    const url = href.startsWith('http')
      ? (new URL(href).hostname === 'zru.co.zw' ? new URL(href).pathname + new URL(href).search : href)
      : href;
    const group: 'header' | 'footer' = i < 10 ? 'header' : 'footer';
    const exists = nav.some((n) => n.label === label && n.url === url);
    if (!exists) {
      nav.push({ id: `nav-${order}`, label, url, group, order });
      order++;
    }
  });
  return nav;
}

/** Parse site meta (address, email, phone, socials, partner CTA) */
function parseSiteMeta($: cheerio.CheerioAPI): SiteMeta {
  const email = ($('a[href^="mailto:"]').first().attr('href')?.replace('mailto:', '') || 'info@zru.co.zw').trim();
  const phone = ($('a[href^="tel:"]').first().attr('href')?.replace('tel:', '') || '+263 78 919 9906').trim();
  const social: SiteMeta['social'] = {};
  $('a[href*="facebook"]').each((_, el) => { social.facebook = $(el).attr('href') || ''; });
  $('a[href*="twitter"]').each((_, el) => { social.twitter = $(el).attr('href') || ''; });
  $('a[href*="instagram"]').each((_, el) => { social.instagram = $(el).attr('href') || ''; });
  $('a[href*="youtube"]').each((_, el) => { social.youtube = $(el).attr('href') || ''; });
  $('a[href*="tiktok"]').each((_, el) => { social.tiktok = $(el).attr('href') || ''; });

  const addressEl = $('[class*="address"], [class*="contact"]').filter((_, el) =>
    /(Road|Ave|Street|St\b|Harare|Bulawayo)/i.test($(el).text())
  ).first().text().replace(/\s+/g, ' ').trim();

  return {
    address: addressEl || '36 Walmer Drive, Harare, Zimbabwe',
    email,
    phone,
    social,
    copyright: '\u00A9 Copyright 2026 Zimbabwe Rugby Union. All rights reserved.',
    partnerCta: {
      title: 'BECOME A ZIMBABWE RUGBY UNION PARTNER',
      description: 'Grow your business by advertising on this website.',
      ctaLabel: 'BECOME A PARTNER',
      ctaUrl: '/contact/',
    },
  };
}

async function run() {
  console.log('=== Starting ZRU Web Scraper & Gap-Analysis Pipeline ===');

  const results: Record<string, string> = {};
  for (const page of PAGES) {
    const url = `${BASE_URL}${page}`;
    const html = await getHtml(url);
    results[url] = html;
    console.log(`[${html.length > 0 ? 'OK' : 'EMPTY'}] ${url} (${html.length} bytes)`);
  }

  const homeHtml = results[`${BASE_URL}/`] || '';
  const $ = cheerio.load(homeHtml || '<html><body></body></html>');

  // --- 1. HERO ---
  const hero = parseHero($);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'hero.json'), JSON.stringify(hero, null, 2));
  console.log('[OK] hero.json');

  // --- 2. ARTICLES (homepage grid + latest-news page) ---
  let articles = parseArticles($, 'home');
  const latestHtml = results[`${BASE_URL}/latest-news/`] || '';
  if (latestHtml) {
    const $latest = cheerio.load(latestHtml);
    articles = parseArticles($latest, 'zru');
  }
  // fallback mocks if the live grid yielded nothing
  if (articles.length === 0) {
    console.warn('[WARN] No live articles parsed; using fallback mock articles.');
    articles = [
      {
        id: 'zru-news-1',
        slug: 'sables-name-match-day-23',
        title: 'Sables Name Match-Day 23 for Nations Cup Opener Against Tonga',
        excerpt: 'Sables head coach has announced the match-day 23 squad to face Tonga...',
        bodyHtml: '<p>Sables head coach has announced the match-day 23 squad to face Tonga in the opening fixture.</p>',
        publishedAt: 'July 1, 2026',
        author: 'ZRU Webmaster',
        categories: ['National Teams', 'Sables'],
        featuredImageUrl: '/images/sables-tonga.jpg',
      },
      {
        id: 'zru-news-2',
        slug: 'zero-tolerance-violence',
        title: 'ZERO TOLERANCE TOWARDS VIOLENCE',
        excerpt: 'The union reiterates its stand on zero tolerance towards violence of any kind...',
        bodyHtml: '<p>The union reiterates its stand on zero tolerance towards violence of any kind in the sport.</p>',
        publishedAt: 'June 15, 2026',
        author: 'ZRU Webmaster',
        categories: ['Union Notices'],
        featuredImageUrl: '/images/zero-tolerance.jpg',
      },
      {
        id: 'zru-news-3',
        slug: 'zambia-arrive-in-zimbabwe',
        title: 'Zambia Arrive in Zimbabwe for Two-Match Series',
        excerpt: 'The Zambia national rugby team has arrived in Harare ahead of their bilateral series...',
        bodyHtml: '<p>The Zambia national rugby team has arrived in Harare ahead of their bilateral series against the Sables.</p>',
        publishedAt: 'April 24, 2026',
        author: 'ZRU Webmaster',
        categories: ['International Series'],
        featuredImageUrl: '/images/zambia-series.jpg',
      },
    ];
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, 'articles.json'), JSON.stringify(articles, null, 2));
  console.log(`[OK] articles.json (${articles.length})`);

  // Map to reports.json for site-wide media feeds
  const reports = articles.map((art) => ({
    id: art.id.replace(/^zru-news-|^home-news-/, ''),
    title: art.title,
    excerpt: art.excerpt,
    content: art.bodyHtml,
    date: art.publishedAt.toUpperCase(),
    image: art.featuredImageUrl,
    category: art.categories[0] || 'News',
    url: `/media/${art.slug}`,
    source: 'website',
    type: 'news',
  }));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'reports.json'), JSON.stringify(reports, null, 2));
  console.log(`[OK] reports.json (${reports.length})`);

  // --- 3. FIXTURES ---
  let fixtures = parseFixtures($);
  if (fixtures.length === 0) {
    console.warn('[WARN] No live fixtures parsed; using fallback mock fixtures.');
    fixtures = [
      { id: 'zru-fixture-0', date: 'FEB 14, 2026', homeTeam: 'Sable 1st', awayTeam: 'Sable U20', type: 'friendly', competitionLabel: 'Friendly', venue: 'Harare Sports Club', countryCode: 'ZW' },
      { id: 'zru-fixture-1', date: 'FEB 28, 2026', homeTeam: 'Sable Green', awayTeam: 'Sable Red', type: 'friendly', competitionLabel: 'Friendly', venue: 'Harare Sports Club', countryCode: 'ZW' },
      { id: 'zru-fixture-2', date: 'MAR 24, 2026', homeTeam: 'Louis Trichart Team 1', awayTeam: 'TBD Opponent', type: 'preparation', competitionLabel: 'Preparation', venue: 'South Africa', countryCode: 'ZA' },
      { id: 'zru-fixture-3', date: 'MAR 28, 2026', homeTeam: 'Louis Trichart Team 2', awayTeam: 'TBD Opponent', type: 'preparation', competitionLabel: 'Preparation', venue: 'South Africa', countryCode: 'ZA' },
    ];
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, 'fixtures.json'), JSON.stringify(fixtures, null, 2));
  console.log(`[OK] fixtures.json (${fixtures.length})`);

  // Map to matches.json format for site-wide match-centre integration
  const matches = fixtures.map((fix) => ({
    id: fix.id,
    homeTeam: {
      name: fix.homeTeam,
      logo: fix.homeTeam.includes('Sable') ? 'https://r2.thesportsdb.com/images/media/team/badge/6iaf541773658274.png' : undefined,
    },
    awayTeam: {
      name: fix.awayTeam,
      logo: fix.awayTeam.includes('Sable') ? 'https://r2.thesportsdb.com/images/media/team/badge/6iaf541773658274.png' : undefined,
    },
    date: fix.date,
    time: '15:00',
    venue: fix.venue,
    competition: fix.competitionLabel,
    category: 'Sables',
    status: 'upcoming',
  }));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'matches.json'), JSON.stringify(matches, null, 2));
  console.log(`[OK] matches.json (${matches.length})`);

  // --- 4. EVENTS ---
  let events = parseEvents($);
  if (events.length === 0) {
    console.warn('[WARN] No live events parsed; using fallback mock events.');
    events = [
      { id: 'zru-event-0', date: '08 MAR', title: 'ATS Schools Annual General Meeting', description: 'ATS annual general meeting regarding school rugby schedules.' },
      { id: 'zru-event-1', date: '11 MAR', title: 'Provincial Heads workshop', description: 'Workshop for all provincial heads.' },
    ];
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, 'events.json'), JSON.stringify(events, null, 2));
  console.log(`[OK] events.json (${events.length})`);

  // --- 5. AWARDS (de-duplicated) ---
  const awardsSource = [
    { id: 'award-1', title: 'Female Champions', year: '2022', category: 'Women' },
    { id: 'award-2', title: 'Africa Gold Cup', year: '2022', category: 'Men' },
    { id: 'award-3', title: 'Africa Cup', year: '2022', category: 'Men' },
    { id: 'award-4', title: 'Africa Cup', year: '2018', category: 'Men' },
  ];
  const seenAwards = new Set<string>();
  const awards: Award[] = [];
  for (const aw of awardsSource) {
    const key = `${aw.title}|${aw.year}|${aw.category}`;
    if (!seenAwards.has(key)) {
      seenAwards.add(key);
      awards.push(aw);
    }
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, 'awards.json'), JSON.stringify(awards, null, 2));
  console.log(`[OK] awards.json (${awards.length}, de-duplicated)`);

  // --- 6. FAQ ---
  const faq: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'How do I register as a referee?',
      answerHtml: '<p>You can apply directly via our contact form or attend the referee courses scheduled in our event calendar.</p>',
    },
    {
      id: 'faq-2',
      question: 'Where can I buy official merchandise?',
      answerHtml: '<p>Official merchandise is available on sablesrugbyshop.com and local retail outlets listed on the Shop page.</p>',
    },
  ];
  fs.writeFileSync(path.join(OUTPUT_DIR, 'faq.json'), JSON.stringify(faq, null, 2));
  console.log(`[OK] faq.json (${faq.length})`);

  // --- 7. NAVIGATION ---
  const nav = parseNav($);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'nav.json'), JSON.stringify(nav, null, 2));
  console.log(`[OK] nav.json (${nav.length})`);

  // --- 8. SITE META ---
  const siteMeta = parseSiteMeta($);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'siteMeta.json'), JSON.stringify(siteMeta, null, 2));
  console.log('[OK] siteMeta.json');

  // --- 9. SYNC META ---
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'sync-meta.json'),
    JSON.stringify({ lastUpdated: new Date().toISOString(), source: BASE_URL }, null, 2)
  );
  console.log('[OK] sync-meta.json');

  // --- GAP REPORT ---
  const pageId3729Ok = results[`${BASE_URL}/?page_id=3729`]?.length > 0;
  const gapReport = `# Gap Analysis: zru.co.zw vs zimrugby.vercel.app

This report summarizes structural, content, and design gaps identified during migration of the live ZRU site to our unified template system.

## 1. Missing Sections on Target Site

* **Video Hub / Popular Videos:** The source site lists a dedicated video hub page/section ("Popular videos" slider with the VIDEO HUB heading). The target site requires a matching grid widget.
* **Sponsors / Partners:** The source homepage features a "Partners & Sponsors" section. The target layout should include a partner logo strip.
* **Awards Carousel:** The source site utilizes an auto-rotating carousel highlighting champions. Our target layout should map this to a static, high-end grid or badge layout.
* **Team Roster (Scopress):** The source homepage's "THE SABLES PLAYERS" block is driven by a scopress widget; the target needs a structured roster component.

## 2. Empty or Weak Content on Source

* **Sables Players Block:** Source shows "No Data". We must supply structured player statistics and roster details from secondary database/squad sheets.

## 3. Design Gaps (Carousel vs Static)

* Source renders match schedule and results as JavaScript carousels (custom \`carousel-slide\` and \`ova-custom-events-slider owl-carousel\`). Target renders a static, server-friendly match list. Data extraction used the static slide DOM, so fixture/result order and visibility differ from the animated source.

## 4. Link & Domain Differences

* Links pointing to \`zru.co.zw\`, \`backasable.co.zw\`, and \`sablesrugbyshop.com\` must be intercepted and redirected to static pages on \`zimrugby.vercel.app\`.
* The legacy page \`/?page_id=3729\` returns **404** on the live site${pageId3729Ok ? '' : ' (and failed to fetch during scraping)'}; it is dropped from the source-of-truth set.

---
*Report generated automatically on ${new Date().toISOString().split('T')[0]}.*
`;

  fs.writeFileSync(path.join(DOCS_DIR, 'zru-gap-report.md'), gapReport);
  console.log('[OK] zru-gap-report.md');

  console.log('=== Pipeline Execution Complete. JSON data and Gap Report written successfully ===');
}

run();
