const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Collect ALL console messages
  page.on('console', msg => console.log(`[CONSOLE ${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => console.log(`[PAGE ERROR] ${err.message}`));
  page.on('requestfailed', req => console.log(`[REQUEST FAILED] ${req.url()} ${req.failure()?.errorText}`));

  console.log('=== TEST: Admin Tickets Page ===');
  try {
    // Login first
    await page.goto('http://localhost:3000/admin-login', { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.fill('input[type="password"]', 'zru-admin-password-***REMOVED***');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    console.log(`After login URL: ${page.url()}`);
    
    // Try navigating to tickets with load instead of networkidle
    const response = await page.goto('http://localhost:3000/admin/tickets', { waitUntil: 'load', timeout: 30000 });
    console.log(`Response status: ${response?.status()}`);
    console.log(`Current URL: ${page.url()}`);
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-screenshots/admin-tickets-debug2.png' });
    
    // Get page content
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
  }

  await browser.close();
})();
