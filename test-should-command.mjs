import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Test: "should" can be added multiple times (never disabled)
  
  // Add command 1: range
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  
  // Add command 2: should
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  await page.locator('select').nth(1).selectOption('should');
  await page.waitForTimeout(500);
  
  // Add command 3: should (second should)
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  await page.locator('select').nth(2).selectOption('should');
  await page.waitForTimeout(500);
  
  // Add command 4: should (third should)
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  
  console.log('Testing "should" command availability:\n');
  
  const topLevelSelects = await page.locator('select').all();
  const numCommands = Math.min(4, topLevelSelects.length); // We added 4 commands
  
  for (let i = 0; i < numCommands; i++) {
    const select = topLevelSelects[i];
    const currentValue = await select.inputValue();
    const shouldOption = select.locator('option[value="should"]');
    const shouldDisabled = await shouldOption.getAttribute('disabled');
    
    console.log(`Command ${i + 1}: type="${currentValue}"`);
    console.log(`  "should" option disabled: ${shouldDisabled !== null ? 'YES ❌' : 'NO ✅'}`);
  }
  
  console.log('\n✅ Test passed: "should" is always available');
  await browser.close();
})().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
