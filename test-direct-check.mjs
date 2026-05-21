import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  
  // Add first command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(1000);
  
  console.log('=== VERIFICATION: First Command Dropdown ===\n');
  
  const firstSelect = page.locator('select').first();
  
  // Get the complete HTML to see what options are actually rendered
  const selectHtml = await firstSelect.evaluate(el => el.outerHTML);
  console.log('Complete select HTML:');
  console.log(selectHtml);
  
  // Extract options list
  const options = selectHtml.match(/<option[^>]*value="([^"]+)"/g) || [];
  const optionValues = options.map(o => o.match(/value="([^"]+)"/)[1]);
  
  console.log(`\nRendered options: ${optionValues.join(', ')}`);
  console.log(`"range" in rendered options: ${optionValues.includes('range') ? 'NO ❌' : 'YES ✅'}`);
  console.log(`"should" in rendered options: ${optionValues.includes('should') ? 'YES ✅' : 'NO ❌'}`);
  
  if (!optionValues.includes('range') && optionValues.includes('should')) {
    console.log('\n✅ VERIFIED: Dropdown correctly filters out current type');
  }
  
  await browser.close();
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
