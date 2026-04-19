import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WP_API_URL = 'https://zru.co.zw/wp-json/wp/v2/posts';

interface Match {
  id: string;
  homeTeam: { name: string; logo?: string };
  awayTeam: { name: string; logo?: string };
  date: string;
  time: string;
  venue: string;
  competition: string;
  category: string;
  status: 'upcoming' | 'live' | 'finished';
  score?: { home: number; away: number };
}

interface Report {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  url: string;
  source: string;
  type: string;
}

interface Post {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  link: string;
  content: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
    }[];
  };
}


function parseFixturesFromContent(content: string, postId: string): Match[] {
  const $ = cheerio.load(content);
  const matches: Match[] = [];

  // TODO: Adjust selectors to match actual HTML structure on the website
  $('tr.match-row').each((index, element) => {
    const row = $(element);
    
    const homeTeam = row.find('.home-team').text().trim();
    const awayTeam = row.find('.away-team').text().trim();
    const date = row.find('.date').text().trim();
    const time = row.find('.time').text().trim();
    const venue = row.find('.venue').text().trim();
    const competition = row.find('.competition').text().trim();

    if (homeTeam && awayTeam) {
        matches.push({
            id: `${postId}-${index}`,
            homeTeam: { name: homeTeam },
            awayTeam: { name: awayTeam },
            date,
            time,
            venue,
            competition,
            category: 'Sables', // TODO: Determine from content if possible
            status: 'upcoming', // TODO: Determine status from content
        });
    }
  });

  return matches;
}

async function fetchLatestPosts(): Promise<Post[]> {
  try {
    const response = await axios.get(WP_API_URL, {
      params: {
        per_page: 10,
        _embed: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching WP posts:', error);
    return [];
  }
}

async function sync() {
  console.log('--- Starting ZRU Content Sync ---');
  const posts: Post[] = await fetchLatestPosts();
  
  const reports: Report[] = [];
  let allMatches: Match[] = [];

  posts.forEach((post: Post) => {

    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
    
    reports.push({
      id: post.id.toString(),
      title: post.title.rendered,
      excerpt: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
      date: new Date(post.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      image: featuredMedia || '/images/media/placeholder.jpg',
      category: 'Sables',
      url: post.link,
      source: 'website',
      type: 'news',
    });

    const fixtures = parseFixturesFromContent(post.content.rendered, post.id.toString());
    allMatches = [...allMatches, ...fixtures];
  });

  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(path.join(dataDir, 'reports.json'), JSON.stringify(reports, null, 2));
  fs.writeFileSync(path.join(dataDir, 'matches.json'), JSON.stringify(allMatches, null, 2));
  fs.writeFileSync(path.join(dataDir, 'sync-meta.json'), JSON.stringify({ lastUpdated: new Date().toISOString() }, null, 2));

  console.log(`--- Sync Complete: ${reports.length} Reports, ${allMatches.length} Matches ---`);
}

sync();
