const token = 'zru-directus-admin-bd92e3c6572c02320b494e2bfa5f9d888d780879debdae60';
const baseUrl = 'https://zru-directus-cms-production.up.railway.app';

const updates = [
  {
    id: 1,
    category: 'Sables',
    tags: ['Sables', 'Nations Cup', 'Squad Announcement', 'Tonga']
  },
  {
    id: 2,
    category: 'Governance',
    tags: ['ZRU Policy', 'Discipline', 'Code of Conduct', 'Integrity']
  },
  {
    id: 3,
    category: 'Sables',
    tags: ['Sables', 'Battle of the Zambezi', 'Zambia', 'Test Series']
  },
  {
    id: 4,
    category: 'Sables',
    tags: ['Sables', 'South Africa', 'SA A', 'International Friendly']
  },
  {
    id: 5,
    category: 'Sables',
    tags: ['Sables', 'Shingi Katsvere', 'Squad Selection', 'Battle of the Zambezi']
  },
  {
    id: 6,
    category: 'Lady Sables',
    tags: ['Lady Sables', 'Women in Rugby', 'Africa Cup', 'Match Preview']
  },
  {
    id: 7,
    category: 'Lady Sables',
    tags: ['Lady Sables', 'Player Profile', 'Gabby', 'Training']
  },
  {
    id: 8,
    category: 'Lady Sables',
    tags: ['Lady Sables', 'Women Rugby', 'Africa Women Cup', 'ZRU Governance']
  },
  {
    id: 9,
    category: 'Sables',
    tags: ['ANSA Awards', 'Prince Edward', 'Awards', 'Technical Team']
  },
  {
    id: 10,
    category: 'Sables',
    tags: ['Sables', 'Player Profile', 'Squad Call-up', 'Shoriwa']
  },
  {
    id: 11,
    category: 'Sables',
    tags: ['Sables', 'ANSA Awards', 'National Honours', 'Achievements']
  },
  {
    id: 12,
    category: 'Community',
    tags: ['Domestic Rugby', 'Nedbank Challenge Cup', 'Harare Sports Club', 'Club Rugby']
  },
  {
    id: 13,
    category: 'Governance',
    tags: ['Coaching', 'Technical Team', 'Africa Cup', 'Appointments']
  },
  {
    id: 14,
    category: 'Lady Sables',
    tags: ['Lady Sables', 'Muchenje', 'Squad Return', 'Player News']
  },
  {
    id: 15,
    category: 'Community',
    tags: ['Domestic Rugby', 'Harare Sports Club', 'Weekend Preview', 'Club Fixtures']
  },
  {
    id: 16,
    category: 'Governance',
    tags: ['IOC', 'Kirsty Coventry', 'Olympic Movement', 'ZRU Congratulations']
  },
  {
    id: 17,
    category: 'Junior Sables',
    tags: ['Junior Sables', 'U20', 'Outback Barbarians', 'Match Report']
  },
  {
    id: 18,
    category: 'Community',
    tags: ['Grassroots', 'Tag Rugby', 'Plumtree', 'Women Month', 'Youth']
  },
  {
    id: 19,
    category: 'Lady Sables',
    tags: ['Lady Sables', 'Ivory Coast', 'Training Squad', 'Tour']
  },
  {
    id: 20,
    category: 'Sables',
    tags: ['Sables', 'World Rugby Rankings', 'Rankings', 'International']
  },
  {
    id: 62,
    category: 'Community',
    tags: ['Inspiration', 'Community', 'ZRU News']
  }
];

async function updateArticles() {
  console.log('Starting intelligent categorization & tagging...');
  for (const item of updates) {
    try {
      const res = await fetch(`${baseUrl}/items/news/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: item.category,
          tags: item.tags
        })
      });
      if (res.ok) {
        console.log(`✓ Updated article #${item.id} -> [${item.category}] with tags: ${item.tags.join(', ')}`);
      } else {
        const errText = await res.text();
        console.error(`✗ Failed article #${item.id}: HTTP ${res.status} - ${errText}`);
      }
    } catch (e) {
      console.error(`✗ Error on #${item.id}:`, e.message);
    }
  }
  console.log('Finished updating articles.');
}

updateArticles();
