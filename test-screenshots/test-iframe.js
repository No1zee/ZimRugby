const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  // Login
  console.log('=== Login ===');
  await page.goto('http://localhost:3000/admin-login', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.fill('input[type="password"]', 'zru-admin-password-***REMOVED***');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  console.log(`Logged in: ${page.url()}`);

  // Test teams builder with live preview
  console.log('\n=== Teams Builder - Live Preview ===');
  await page.goto('http://localhost:3000/admin/teams', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'test-screenshots/builder-teams-live.png' });

  // Check iframe exists
  const iframe = await page.locator('iframe[title="Live Preview"]');
  const iframeVisible = await iframe.isVisible().catch(() => false);
  console.log(`Iframe visible: ${iframeVisible}`);

  // Check if live mode is default
  const liveBtn = page.locator('button:has-text("Live")');
  const liveBtnVisible = await liveBtn.isVisible().catch(() => false);
  console.log(`Live button visible: ${liveBtnVisible}`);

  // Check for team content in iframe
  if (iframeVisible) {
    const frame = iframe;
    try {
      const frameContent = await frame.contentFrame()?.textContent('body');
      const hasSables = frameContent?.includes('SABLES') || frameContent?.includes('Sables');
      const hasBento = frameContent?.includes('OUR TEAMS');
      console.log(`Iframe has Sables: ${hasSables}`);
      console.log(`Iframe has bento grid: ${hasBento}`);
    } catch (e) {
      console.log(`Could not read iframe content: ${e.message}`);
    }
  }

  // Test editor mode
  console.log('\n=== Teams Builder - Editor Preview ===');
  const editorBtn = page.locator('button:has-text("Editor")');
  if (await editorBtn.isVisible()) {
    await editorBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-screenshots/builder-teams-editor.png' });
    console.log('Editor mode screenshot saved');
  }

  // Test tickets builder with live preview
  console.log('\n=== Tickets Builder - Live Preview ===');
  await page.goto('http://localhost:3000/admin/tickets', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'test-screenshots/builder-tickets-live.png' });

  const ticketsIframe = await page.locator('iframe[title="Live Preview"]');
  const ticketsIframeVisible = await ticketsIframe.isVisible().catch(() => false);
  console.log(`Tickets iframe visible: ${ticketsIframeVisible}`);

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(e => console.log(`  - ${e.substring(0, 100)}`));
  } else {
    console.log('\nNo errors');
  }

  await browser.close();
})();
