import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newView();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  console.log('CLEAR VERIFICATION: Dropdown options\n');
  
  // Add first command (defaults to range)
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  // Get the first command's dropdown
  const firstSelect = page.locator('select').first();
  const firstType = await firstSelect.inputValue();
  const firstHtml = await firstSelect.innerHTML();
  
  // Extract all option values from the HTML
  const optionMatches = firstHtml.matchAll(/<option[^>]*value="([^"]+)"/g);
  const firstOptions = Array.from(optionMatches).map(m => m[1]);
  
  console.log(`=== Command 1 ===`);
  console.log(`Current type: ${firstType}`);
  console.log(`Available options in dropdown: ${firstOptions.join(', ')}`);
  
  const hasOwnType = firstOptions.includes(firstType);
  const hasShouldOption = firstOptions.includes('should');
  
  console.log(`\nResults:`);
  console.log(`✓ Own type (${firstType}) hidden from dropdown: ${!hasOwnType ? 'YES ✅' : 'NO ❌'}`);
  console.log(`✓ "should" always available: ${hasShouldOption ? 'YES ✅' : 'NO ❌'}`);
  
  if (!hasOwnType && hasShouldOption) {
    console.log('\n✅ VERIFICATION PASSED');
  } else {
    console.log('\n❌ VERIFICATION FAILED');
    process.exit(1);
  }
  
  await browser.close();
})().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
