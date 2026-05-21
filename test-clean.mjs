import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  console.log('VERIFICATION: Dropdown Options\n');
  
  // Add first command (defaults to range)
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  // Get the first command's dropdown
  const firstSelect = page.locator('select').first();
  const firstType = await firstSelect.inputValue();
  const firstHtml = await firstSelect.innerHTML();
  
  // Extract option values
  const optionMatches = firstHtml.matchAll(/<option[^>]*value="([^"]+)"/g);
  const firstOptions = Array.from(optionMatches).map(m => m[1]);
  
  console.log(`Command 1 (type: ${firstType})`);
  console.log(`Available options: ${firstOptions.join(', ')}`);
  
  const hasOwnType = firstOptions.includes(firstType);
  const hasShouldOption = firstOptions.includes('should');
  
  console.log(`\n✓ Own type NOT in dropdown: ${!hasOwnType ? 'YES ✅' : 'NO ❌'}`);
  console.log(`✓ "should" available: ${hasShouldOption ? 'YES ✅' : 'NO ❌'}`);
  
  if (!hasOwnType && hasShouldOption) {
    console.log('\n✅ VERIFIED: Dropdown correctly hides current type and shows switch options');
  } else {
    throw new Error('Verification failed');
  }
  
  await browser.close();
})().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
