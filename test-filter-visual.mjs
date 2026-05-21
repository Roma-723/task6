import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Setup: 3 commands with different types
  // Cmd 1: "where"
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  await page.locator('select').first().selectOption('where');
  await page.waitForTimeout(500);
  
  // Cmd 2: "exists_key"
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  await page.locator('select').nth(1).selectOption('exists_key');
  await page.waitForTimeout(500);
  
  // Cmd 3: leave as default "range"
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/filter-builder.png' });
  console.log('Screenshot saved to /tmp/filter-builder.png');
  
  // Now verify the disabled states
  const selects = await page.locator('select').all();
  console.log(`\nTotal commands: ${selects.length}`);
  
  for (let i = 0; i < selects.length; i++) {
    const select = selects[i];
    const currentValue = await select.inputValue();
    console.log(`\nCommand ${i + 1}: type = "${currentValue}"`);
    
    const options = await select.locator('option').all();
    const disabledOptions = [];
    for (const opt of options) {
      const value = await opt.getAttribute('value');
      const disabled = await opt.getAttribute('disabled');
      if (disabled !== null) {
        disabledOptions.push(value);
      }
    }
    
    if (disabledOptions.length > 0) {
      console.log(`  Disabled options: ${disabledOptions.join(', ')}`);
    } else {
      console.log(`  Disabled options: none`);
    }
  }
  
  console.log('\n✅ Test completed');
  await browser.close();
})().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
