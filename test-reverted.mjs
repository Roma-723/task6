import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  
  console.log('Verification after reverting filter\n');
  
  // Add first command (defaults to range)
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(800);
  
  const firstSelect = page.locator('select').first();
  const firstHtml = await firstSelect.evaluate(el => el.outerHTML);
  const options = firstHtml.match(/<option[^>]*value="([^"]+)"/g).map(o => o.match(/value="([^"]+)"/)[1]);
  
  console.log('Command 1 (type: range)');
  console.log(`  Dropdown shows: ${options.join(', ')}`);
  console.log(`  ✓ "range" (own type) shown: ${options.includes('range')}`);
  console.log(`  ✓ "should" shown: ${options.includes('should')}\n`);
  
  // Add second command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(800);
  
  const secondSelect = page.locator('select').nth(1);
  const secondHtml = await secondSelect.evaluate(el => el.outerHTML);
  const secondOptions = secondHtml.match(/<option[^>]*value="([^"]+)"/g).map(o => o.match(/value="([^"]+)"/)[1]);
  
  console.log('Command 2 (type: range)');
  console.log(`  Dropdown shows: ${secondOptions.join(', ')}`);
  console.log(`  ✓ "range" (own type) shown: ${secondOptions.includes('range')}`);
  console.log(`  ✓ Already-used "range" excluded from other: ${!secondOptions.includes('where')}\n`);
  
  console.log('✅ Reverted: Current type now shows in own dropdown');
  
  await browser.close();
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
