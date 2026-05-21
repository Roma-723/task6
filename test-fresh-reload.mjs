import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Hard refresh to ensure latest code
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.keyboard.press('F5');
  await page.waitForTimeout(2000);
  
  console.log('Testing after fresh reload\n');
  
  // Add first command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  const firstSelect = page.locator('select').first();
  const firstType = await firstSelect.inputValue();
  const firstHtml = await firstSelect.innerHTML();
  
  const optionMatches = firstHtml.matchAll(/<option[^>]*value="([^"]+)"/g);
  const options = Array.from(optionMatches).map(m => m[1]);
  
  console.log(`Command type: ${firstType}`);
  console.log(`Available options: ${options.join(', ')}`);
  console.log(`\nCurrent type in options: ${options.includes(firstType) ? 'YES' : 'NO'}`);
  console.log(`Expected: Current type should NOT be in options`);
  
  if (!options.includes(firstType)) {
    console.log('\n✅ CORRECT: Current type is hidden from dropdown');
  } else {
    console.log('\n❌ BUG: Current type is still in dropdown');
  }
  
  await browser.close();
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
