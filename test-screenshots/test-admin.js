const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Collect console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  console.log('=== TEST: Admin Tickets Page ===');
  try {
    // Login first
    await page.goto('http://localhost:3000/admin-login', { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="password"]', 'zru-admin-2026');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**', { timeout: 10000 });
    console.log('Logged in');
    
    // Navigate to tickets
    await page.goto('http://localhost:3000/admin/tickets', { waitUntil: 'networkidle', timeout: 30000 });
    console.log(`Current URL: ${page.url()}`);
    
    // Check for errors on page
    const pageContent = await page.content();
    if (pageContent.includes('404') || pageContent.includes('Not Found')) {
      console.log('Page shows 404');
    }
    
    await page.screenshot({ path: 'test-screenshots/admin-tickets-debug.png' });
    
    // Check if AdminAuthGate is blocking
    const authGateVisible = await page.locator('text=Sign in').isVisible().catch(() => false);
    console.log(`Auth gate visible: ${authGateVisible}`);
    
    // Check if page builder loaded
    const builderLoaded = await page.locator('text=Official Tickets').isVisible().catch(() => false);
    console.log(`Page builder loaded: ${builderLoaded}`);
    
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
  }

  if (errors.length > 0) {
    console.log('\nConsole errors:');
    errors.forEach(e => console.log(`  - ${e}`));
  }

  await browser.close();
})();
