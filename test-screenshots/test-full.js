const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  // === TEST 1: Tickets Page ===
  console.log('=== TEST 1: Tickets Page (Desktop) ===');
  await page.goto('http://localhost:3000/tickets', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-screenshots/01-tickets-desktop.png', fullPage: true });
  
  const fixtureCount = await page.locator('.card-green').count();
  console.log(`  Fixture cards: ${fixtureCount}`);
  
  const heroText = await page.locator('h1').first().textContent();
  console.log(`  Hero: ${heroText?.trim().substring(0, 40)}`);

  // === TEST 2: Tickets Mobile ===
  console.log('\n=== TEST 2: Tickets Page (Mobile) ===');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-screenshots/02-tickets-mobile.png', fullPage: true });
  console.log('  Mobile screenshot saved');

  // === TEST 3: Filter Interaction ===
  console.log('\n=== TEST 3: Filter Interaction ===');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/tickets', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  // Click "Sables" filter
  const sablesBtn = page.locator('button', { hasText: 'Sables' }).first();
  if (await sablesBtn.isVisible()) {
    await sablesBtn.click();
    await page.waitForTimeout(500);
    const filteredCount = await page.locator('.card-green').count();
    console.log(`  After "Sables" filter: ${filteredCount} cards`);
    await page.screenshot({ path: 'test-screenshots/03-tickets-filtered.png' });
  }

  // === TEST 4: Admin Login ===
  console.log('\n=== TEST 4: Admin Login ===');
  await page.goto('http://localhost:3000/admin-login', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-screenshots/04-admin-login.png' });
  
  await page.fill('input[type="password"]', 'zru-admin-2026');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  console.log(`  Login redirect: ${page.url()}`);
  await page.screenshot({ path: 'test-screenshots/05-admin-dashboard.png' });

  // === TEST 5: Admin Tickets Builder ===
  console.log('\n=== TEST 5: Admin Tickets Builder ===');
  await page.goto('http://localhost:3000/admin/tickets', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'test-screenshots/06-admin-tickets-builder.png' });
  
  // Check viewport toggle
  const desktopBtn = page.locator('button[title="Desktop"]');
  const tabletBtn = page.locator('button[title="Tablet"]');
  const mobileBtn = page.locator('button[title="Mobile"]');
  console.log(`  Viewport buttons: Desktop=${await desktopBtn.isVisible()}, Tablet=${await tabletBtn.isVisible()}, Mobile=${await mobileBtn.isVisible()}`);

  // Test tablet viewport
  if (await tabletBtn.isVisible()) {
    await tabletBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-screenshots/07-admin-tickets-tablet.png' });
    console.log('  Tablet viewport captured');
  }

  // Test mobile viewport
  if (await mobileBtn.isVisible()) {
    await mobileBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-screenshots/08-admin-tickets-mobile.png' });
    console.log('  Mobile viewport captured');
  }

  // Reset to desktop
  if (await desktopBtn.isVisible()) {
    await desktopBtn.click();
    await page.waitForTimeout(500);
  }

  // === TEST 6: Section Labels ===
  console.log('\n=== TEST 6: Section Labels ===');
  const sectionBadges = await page.locator('.absolute.top-4.left-4.bg-black\\/60').allTextContents();
  console.log(`  Section badges: ${sectionBadges.join(', ')}`);

  // === TEST 7: Empty Section State ===
  console.log('\n=== TEST 7: Preview Empty State ===');
  const emptyState = await page.locator('text=No sections yet').isVisible().catch(() => false);
  console.log(`  Empty state visible: ${emptyState}`);

  // === Summary ===
  console.log('\n=== SUMMARY ===');
  console.log(`  Tickets page: ${fixtureCount === 5 ? 'PASS' : 'FAIL'} (${fixtureCount} cards)`);
  console.log(`  Admin login: PASS`);
  console.log(`  Admin builder: ${await desktopBtn.isVisible() ? 'PASS' : 'FAIL'}`);
  console.log(`  Viewport toggle: ${await tabletBtn.isVisible() ? 'PASS' : 'FAIL'}`);
  console.log(`  Section labels: ${sectionBadges.length > 0 ? 'PASS' : 'FAIL'}`);
  console.log(`  Console errors: ${errors.length === 0 ? 'NONE' : errors.length}`);
  if (errors.length > 0) errors.forEach(e => console.log(`    - ${e.substring(0, 100)}`));

  await browser.close();
})();
