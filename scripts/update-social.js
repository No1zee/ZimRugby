const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function updateSocialFeed() {
  console.log('Starting social feed update...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to ZimRugby Facebook page...');
    await page.goto('https://www.facebook.com/ZimbabweRugbyUnion/', { waitUntil: 'networkidle' });

    // Wait for posts to load
    await page.waitForSelector('div[role="main"]');

    console.log('Extracting posts...');
    const posts = await page.evaluate(() => {
      const postElements = Array.from(document.querySelectorAll('div[role="article"]')).slice(0, 10);
      
      return postElements.map((el, index) => {
        // This selector is a bit generic as FB classes change, but role="article" is stable
        const textContent = el.innerText || '';
        const links = Array.from(el.querySelectorAll('a')).map(a => a.href);
        const postLink = links.find(href => href.includes('/posts/') || href.includes('/reel/') || href.includes('/photos/')) || '';
        
        // Try to get image
        const img = el.querySelector('img');
        const image = img ? img.src : '/images/media/fb_placeholder.jpg';

        // Extract a title from the first line
        const firstLine = textContent.split('\n')[0] || 'Social Update';
        const title = firstLine.length > 60 ? firstLine.substring(0, 57) + '...' : firstLine;

        // Clean up text for excerpt
        const excerpt = textContent.split('\n').slice(1, 4).join(' ').substring(0, 150) + '...';

        return {
          id: `fb_${Date.now()}_${index}`,
          title: title,
          excerpt: excerpt,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
          image: image,
          category: 'SOCIAL',
          url: postLink,
          source: 'facebook'
        };
      }).filter(p => p.url); // Only keep posts with links
    });

    if (posts.length > 0) {
      const filePath = path.join(__dirname, '..', 'public', 'data', 'social.json');
      fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
      console.log(`Successfully updated ${posts.length} posts in social.json`);
    } else {
      console.warn('No posts found. Check selectors.');
    }

  } catch (error) {
    console.error('Error updating social feed:', error);
  } finally {
    await browser.close();
  }
}

updateSocialFeed();
