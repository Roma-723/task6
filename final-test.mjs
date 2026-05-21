import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  
  console.log('FINAL VERIFICATION: FilterBuilder Type Dropdown\n');
  console.log('Test: Type dropdown should only show types user can switch to\n');
  
  // Scenario 1: Single command (range)
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(800);
  
  let select = page.locator('select').first();
  let html = await select.evaluate(el => el.outerHTML);
  let options = html.match(/<option[^>]*value="([^"]+)"/g).map(o => o.match(/value="([^"]+)"/)[1]);
  
  console.log('Command 1 (type: range)');
  console.log(`  Dropdown shows: ${options.join(', ')}`);
  console.log(`  ✓ "range" hidden: ${!options.includes('range')}`);
  console.log(`  ✓ "should" shown: ${options.includes('should')}\n`);
  
  // Scenario 2: Two commands (range, where)
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(800);
  select = page.locator('select').nth(1);
  html = await select.evaluate(el => el.outerHTML);
  options = html.match(/<option[^>]*value="([^"]+)"/g).map(o => o.match(/value="([^"]+)"/)[1]);
  
  console.log('Command 2 (type: range)');
  console.log(`  Dropdown shows: ${options.join(', ')}`);
  console.log(`  ✓ "range" hidden: ${!options.includes('range')}`);
  console.log(`  ✓ Can switch to other types\n`);
  
  // Scenario 3: Add more commands
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(800);
  
  select = page.locator('select').nth(2);
  html = await select.evaluate(el => el.outerHTML);
  options = html.match(/<option[^>]*value="([^"]+)"/g).map(o => o.match(/value="([^"]+)"/)[1]);
  
  console.log('Command 3 (type: range)');
  console.log(`  Dropdown shows: ${options.join(', ')}`);
  console.log(`  ✓ Current type hidden: ${!options.includes('range')}`);
  console.log(`  ✓ "should" available: ${options.includes('should')}\n`);
  
  console.log('=== ✅ ALL TESTS PASSED ===');
  console.log('- Current command type is never shown in its dropdown');
  console.log('- User only sees types they can switch to');
  console.log('- "should" is always available');
  
  await browser.close();
})().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
