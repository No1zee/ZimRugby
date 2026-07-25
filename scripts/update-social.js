const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs');
const path = require('path');

chromium.use(stealth);

const FB_PAGE = 'ZimbabweRugbyUnion';
const MAX_POSTS = 15;

function formatDisplayDate(d) {
  if (!d) return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}

function parseRelativeDate(text) {
  if (!text) return null;
  const clean = text.trim().toLowerCase();
  const now = new Date();

  const minAgo = clean.match(/(\d+)\s*min/);
  if (minAgo) { const d = new Date(now); d.setMinutes(d.getMinutes() - parseInt(minAgo[1])); return d; }

  const hrAgo = clean.match(/(\d+)\s*(?:h|hr|hour)/);
  if (hrAgo) { const d = new Date(now); d.setHours(d.getHours() - parseInt(hrAgo[1])); return d; }

  const dayAgo = clean.match(/(\d+)\s*(?:d|day)/);
  if (dayAgo) { const d = new Date(now); d.setDate(d.getDate() - parseInt(dayAgo[1])); return d; }

  const wkAgo = clean.match(/(\d+)\s*(?:w|wk|week)/);
  if (wkAgo) { const d = new Date(now); d.setDate(d.getDate() - parseInt(wkAgo[1]) * 7); return d; }

  const moAgo = clean.match(/(\d+)\s*(?:mo|month)/);
  if (moAgo) { const d = new Date(now); d.setMonth(d.getMonth() - parseInt(moAgo[1])); return d; }

  if (clean.includes('just now') || clean.includes('moments')) return now;

  return null;
}

function extractPostId(url) {
  if (!url) return null;
  const m = url.match(/\/(posts|reel|photos|videos)\/(\d+)/);
  if (m) return `fb_${m[2]}`;
  const m2 = url.match(/pfbid([a-zA-Z0-9]+)/);
  if (m2) return `fb_pfbid${m2[1]}`;
  return null;
}

function categorizePost(text) {
  const l = (text || '').toLowerCase();
  if (l.includes('matchday') || l.includes('kickoff') || l.includes('match day') || l.includes('game day')) return 'MATCHDAY';
  if (l.includes('highlight') || l.includes('replay') || l.includes('recap')) return 'HIGHLIGHTS';
  if (l.includes('ticket') || l.includes('get your')) return 'TICKETS';
  if (l.includes('result') || l.includes('full time') || l.match(/\bft\b/) || l.includes('win') || l.includes('loss')) return 'RESULTS';
  if (l.includes('squad') || l.includes('team sheet') || l.includes('lineup') || l.includes('named')) return 'SQUAD';
  if (l.includes('training') || l.includes('camp') || l.includes('session')) return 'TRAINING';
  if (l.includes('congrat') || l.includes('celebrat') || l.includes('happy')) return 'SOCIAL';
  return 'SOCIAL';
}

async function updateSocialFeed() {
  console.log(`[facebook-sync] Starting feed update for ${FB_PAGE}...`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    locale: 'en-US',
    viewport: { width: 1280, height: 900 }
  });

  const page = await context.newPage();

  try {
    // Try main Facebook site directly — mbasic redirects anyway
    console.log(`[facebook-sync] Navigating to facebook.com/${FB_PAGE}/...`);
    await page.goto(`https://www.facebook.com/${FB_PAGE}/`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait for content — Facebook loads posts via JS
    console.log('[facebook-sync] Waiting for posts to render...');
    try {
      await page.waitForSelector('div[role="article"], div[role="main"]', { timeout: 15000 });
    } catch {
      console.warn('[facebook-sync] Timed out waiting for article elements, trying to extract anyway...');
    }

    // Extra settle time
    await page.waitForTimeout(3000);

    // Scroll down to load more posts
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(1500);
    }

    console.log('[facebook-sync] Extracting posts...');

    const posts = await page.evaluate(() => {
      const results = [];

      // Strategy 1: div[role="article"] elements (most reliable on main FB site)
      const articles = document.querySelectorAll('div[role="article"]');

      for (const article of articles) {
        const text = (article.innerText || '').trim();
        if (!text || text.length < 5) continue;

        // Find post link
        const links = Array.from(article.querySelectorAll('a'));
        const postLink = links.find(a => {
          const h = a.getAttribute('href') || '';
          return (h.includes('/posts/') || h.includes('/reel/') || h.includes('/photos/') || h.includes('/videos/') || h.includes('pfbid'));
        });

        // Skip comments
        if (postLink && (postLink.getAttribute('href') || '').includes('comment_id')) continue;

        const url = postLink ? (postLink.href || postLink.getAttribute('href') || '') : '';

        // Find the main image (skip profile pics and tiny images)
        const imgs = Array.from(article.querySelectorAll('img'));
        const mainImg = imgs.find(img => {
          const src = img.src || '';
          const w = img.naturalWidth || img.width || 0;
          const h = img.naturalHeight || img.height || 0;
          return (src.includes('scontent') || src.includes('fbcdn')) && w > 100 && h > 100;
        });

        // Find timestamp — look for abbr[title], or spans with relative time
        let dateStr = '';
        const abbr = article.querySelector('abbr[title]');
        if (abbr) {
          dateStr = abbr.getAttribute('title') || abbr.innerText || '';
        }
        if (!dateStr) {
          const timeSpan = links.find(a => {
            const t = (a.innerText || '').trim().toLowerCase();
            return t.match(/^\d+[hdwm]$/) || t.includes('hour') || t.includes('day') || t.includes('week') || t.includes('min') || t.includes('just now');
          });
          if (timeSpan) dateStr = timeSpan.innerText.trim();
        }

        // Extract title from text: first meaningful line
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        // Skip lines that are just page names or timestamps
        const meaningfulLines = lines.filter(l => {
          const cl = l.trim().toLowerCase();
          return cl.length > 3 &&
            !cl.match(/^[a-z ]+rugby union$/i) &&
            !cl.match(/^\d+[hdwm]$/) &&
            !cl.match(/^(just now|\d+ (hour|day|week|month|minute))/i) &&
            !cl.match(/^(like|comment|share|send)/i) &&
            !cl.match(/^[A-Z][a-z]+ [A-Z][a-z]+ (and \d+ more)$/);
        });

        const title = meaningfulLines[0] || lines[0] || 'Social Update';
        const excerpt = meaningfulLines.slice(1, 4).join(' ').substring(0, 250);

        results.push({
          url: url,
          text: text.substring(0, 600),
          title: title.substring(0, 120),
          excerpt: excerpt || title.substring(0, 250),
          image: mainImg ? mainImg.src : null,
          dateStr: dateStr
        });
      }

      // Strategy 2: If no articles found, try data-ft posts
      if (results.length === 0) {
        const dataFtPosts = document.querySelectorAll('[data-ft]');
        for (const el of Array.from(dataFtPosts).slice(0, 15)) {
          const text = (el.innerText || '').trim();
          if (!text || text.length < 5) continue;

          const links = Array.from(el.querySelectorAll('a'));
          const postLink = links.find(a => {
            const h = a.getAttribute('href') || '';
            return h.includes('/posts/') || h.includes('/reel/') || h.includes('/photos/') || h.includes('pfbid');
          });
          if (!postLink) continue;
          if ((postLink.getAttribute('href') || '').includes('comment_id')) continue;

          const imgs = Array.from(el.querySelectorAll('img'));
          const mainImg = imgs.find(img => {
            const src = img.src || '';
            const w = img.naturalWidth || img.width || 0;
            return (src.includes('scontent') || src.includes('fbcdn')) && w > 100;
          });

          let dateStr = '';
          const abbr = el.querySelector('abbr[title]');
          if (abbr) dateStr = abbr.getAttribute('title') || abbr.innerText || '';

          const lines = text.split('\n').filter(l => l.trim().length > 0);

          results.push({
            url: postLink.href || postLink.getAttribute('href') || '',
            text: text.substring(0, 600),
            title: (lines[0] || 'Social Update').substring(0, 120),
            excerpt: lines.slice(1, 4).join(' ').substring(0, 250),
            image: mainImg ? mainImg.src : null,
            dateStr: dateStr
          });
        }
      }

      return results;
    });

    console.log(`[facebook-sync] Found ${posts.length} raw posts`);

    // Process and deduplicate
    const existingPath = path.join(__dirname, '..', 'public', 'data', 'social.json');
    let existing = [];
    try { existing = JSON.parse(fs.readFileSync(existingPath, 'utf8')); } catch {}
    const existingUrls = new Set(existing.map(p => p.url).filter(Boolean));
    const existingIds = new Set(existing.map(p => p.id).filter(Boolean));

    const newPosts = [];
    for (const post of posts.slice(0, MAX_POSTS)) {
      if (!post.url || existingUrls.has(post.url)) continue;

      const postId = extractPostId(post.url);
      if (postId && existingIds.has(postId)) continue;

      // Clean Facebook UI noise from text
      const cleanText = (s) => s
        .replace(/\.{3}\s*See more/gi, '…')
        .replace(/\s*See more\s*/gi, ' ')
        .replace(/\s*See less\s*/gi, ' ')
        .replace(/All reactions:\s*.*$/s, '')
        .replace(/View more comments\s*/gi, '')
        .replace(/\d+ Comments?\s*/gi, '')
        .replace(/\d+ Shares?\s*/gi, '')
        .replace(/Like\s+Comment\s+Share\s*/g, '')
        .replace(/Like\s+Comment\s+Send\s*/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

      const parsedDate = parseRelativeDate(post.dateStr);
      const displayDate = parsedDate ? formatDisplayDate(parsedDate) : formatDisplayDate(new Date());

      const cleanTitle = cleanText(post.title);
      const cleanExcerpt = cleanText(post.excerpt);

      newPosts.push({
        id: postId || `fb_${Date.now()}_${newPosts.length}`,
        title: cleanTitle || 'Social Update',
        excerpt: cleanExcerpt || cleanTitle,
        date: displayDate,
        image: post.image || '/images/media/fb_placeholder.jpg',
        category: categorizePost(post.text),
        url: post.url,
        source: 'facebook'
      });
    }

    const merged = [...newPosts, ...existing];
    const final = merged.slice(0, 30);

    if (newPosts.length > 0) {
      fs.writeFileSync(existingPath, JSON.stringify(final, null, 2));
      console.log(`[facebook-sync] Written ${final.length} posts (${newPosts.length} new, ${final.length - newPosts.length} existing)`);
    } else {
      console.log('[facebook-sync] No new posts found. Existing data unchanged.');
    }

  } catch (error) {
    console.error('[facebook-sync] Error:', error.message);
  } finally {
    await browser.close();
    console.log('[facebook-sync] Done.');
  }
}

updateSocialFeed();
