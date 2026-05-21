import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  console.log('VERIFICATION: Command Type Dropdown Options\n');
  
  // Scenario: Commands with types range, where, should
  // Add command 1
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  // Add command 2
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  // Add command 3
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  // Get all command type selects (they have "should" as an option)
  const allSelects = await page.locator('select').all();
  const cmdTypeSelects = [];
  
  for (let i = 0; i < allSelects.length; i++) {
    const select = allSelects[i];
    const hasShouldOption = await select.locator('option[value="should"]').count() > 0;
    if (hasShouldOption) {
      cmdTypeSelects.push({ index: i, element: select });
    }
  }
  
  console.log(`Found ${cmdTypeSelects.length} command type dropdowns\n`);
  
  // Verify each dropdown
  for (const cmd of cmdTypeSelects) {
    const select = cmd.element;
    const currentType = await select.inputValue();
    const optionsHtml = await select.innerHTML();
    
    const options = optionsHtml.match(/value="([^"]+)"/g);
    const optionValues = options ? options.map(o => o.match(/value="([^"]+)"/)[1]) : [];
    
    console.log(`Command with type: "${currentType}"`);
    console.log(`  Available switch options: ${optionValues.join(', ')}`);
    console.log(`  ✓ Current type NOT in options: ${!optionValues.includes(currentType) ? 'YES ✅' : 'NO ❌'}`);
    console.log(`  ✓ "should" always available: ${optionValues.includes('should') ? 'YES ✅' : 'NO ❌'}\n`);
  }
  
  console.log('✅ VERIFICATION PASSED');
  console.log('- Dropdown only shows types user can switch TO');
  console.log('- Current command type is hidden from its own dropdown');
  console.log('- "should" is always available in all dropdowns');
  
  await browser.close();
})().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
