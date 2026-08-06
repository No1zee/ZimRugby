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

  console.log('=== TEST 1: Tickets Page ===');
  try {
    await page.goto('http://localhost:3000/tickets', { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: 'test-screenshots/tickets-desktop.png', fullPage: true });
    
    // Check fixtures rendered
    const fixtureCards = await page.locator('[class*="card-green"]').count();
    console.log(`Fixture cards rendered: ${fixtureCards}`);
    
    // Check filter buttons
    const filterButtons = await page.locator('button:has-text("All"), button:has-text("Sables"), button:has-text("Domestic")').count();
    console.log(`Filter buttons: ${filterButtons}`);
    
    // Check hero section
    const heroTitle = await page.locator('h1').first().textContent();
    console.log(`Hero title: ${heroTitle?.trim()}`);
    
    // Check for broken images
    const images = await page.locator('img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      const natural = await img.evaluate(el => el.naturalWidth);
      if (natural === 0) console.log(`BROKEN IMAGE: ${src}`);
    }
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
  }

  console.log('\n=== TEST 2: Tickets Page Mobile ===');
  try {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.screenshot({ path: 'test-screenshots/tickets-mobile.png', fullPage: true });
    console.log('Mobile screenshot saved');
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
  }

  console.log('\n=== TEST 3: Admin Login ===');
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/admin-login', { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: 'test-screenshots/admin-login.png' });
    
    // Login
    await page.fill('input[type="password"]', 'zru-admin-2026');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**', { timeout: 10000 });
    console.log('Login successful');
    await page.screenshot({ path: 'test-screenshots/admin-dashboard.png' });
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
  }

  console.log('\n=== TEST 4: Admin Tickets Page Builder ===');
  try {
    await page.goto('http://localhost:3000/admin/tickets', { waitUntil: 'networkidle', timeout: 30000 });
    await page.screenshot({ path: 'test-screenshots/admin-tickets-builder.png' });
    
    // Check viewport toggle exists
    const viewportButtons = await page.locator('button[title="Desktop"], button[title="Tablet"], button[title="Mobile"]').count();
    console.log(`Viewport toggle buttons: ${viewportButtons}`);
    
    // Test viewport toggle
    const tabletBtn = page.locator('button[title="Tablet"]');
    if (await tabletBtn.isVisible()) {
      await tabletBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-screenshots/admin-tickets-tablet.png' });
      console.log('Tablet viewport toggle works');
    }
    
    const mobileBtn = page.locator('button[title="Mobile"]');
    if (await mobileBtn.isVisible()) {
      await mobileBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-screenshots/admin-tickets-mobile.png' });
      console.log('Mobile viewport toggle works');
    }
    
    // Check section labels
    const sectionLabels = await page.locator('.absolute.top-4.left-4').allTextContents();
    console.log(`Section labels in preview: ${sectionLabels.join(', ')}`);
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
  }

  console.log('\n=== TEST 5: Console Errors ===');
  if (errors.length > 0) {
    console.log('Console errors found:');
    errors.forEach(e => console.log(`  - ${e}`));
  } else {
    console.log('No console errors');
  }

  await browser.close();
  console.log('\n=== ALL TESTS COMPLETE ===');
})();
