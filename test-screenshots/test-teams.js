const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  console.log('=== TEST: Teams Page ===');
  await page.goto('http://localhost:3000/teams', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'test-screenshots/teams-desktop.png', fullPage: true });

  // Check team cards rendered
  const teamCards = await page.locator('[class*="group"]').count();
  console.log(`Team cards/elements: ${teamCards}`);

  // Check hero
  const heroText = await page.locator('h1').first().textContent();
  console.log(`Hero: ${heroText?.trim().substring(0, 40)}`);

  // Check for team names
  const pageText = await page.textContent('body');
  const hasSables = pageText?.includes('SABLES') || pageText?.includes('Sables');
  const hasCheetahs = pageText?.includes('CHEETAHS') || pageText?.includes('Cheetahs');
  console.log(`Has Sables: ${hasSables}, Has Cheetahs: ${hasCheetahs}`);

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(e => console.log(`  - ${e.substring(0, 100)}`));
  } else {
    console.log('\nNo errors');
  }

  await browser.close();
})();
