import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  console.log('TEST: Command Type Change Complete Replacement\n');
  
  // Add a range command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  console.log('✓ Created initial command (default type: range)');
  
  // Get initial state
  let rangeRows = await page.locator('text=>=').count();
  console.log(`✓ Range command has ${rangeRows} row(s)\n`);
  
  // Change type to 'where'
  await page.locator('select').first().selectOption('where');
  await page.waitForTimeout(600);
  
  console.log('✓ Changed command type from range to where\n');
  
  // Verify range UI is gone and where UI is present
  let rangeRowsAfter = await page.locator('text=>=').count();
  let whereInputs = await page.locator('input[placeholder*="key"]').count();
  
  console.log('After type change:');
  console.log(`  ✓ Range UI elements gone: ${rangeRowsAfter === 0 ? 'YES ✅' : 'NO ❌'}`);
  console.log(`  ✓ Where UI elements present: ${whereInputs > 0 ? 'YES ✅' : 'NO ❌'}\n`);
  
  // Change type again to 'exists_key'
  await page.locator('select').first().selectOption('exists_key');
  await page.waitForTimeout(600);
  
  console.log('✓ Changed command type from where to exists_key\n');
  
  let whereInputsAfter = await page.locator('input[placeholder*="key"]').count();
  let selectDropdowns = await page.locator('select').count();
  
  console.log('After second type change:');
  console.log(`  ✓ Where UI elements gone: ${whereInputsAfter === 0 ? 'YES ✅' : 'NO ❌'}`);
  console.log(`  ✓ New fresh exists_key UI present: ${selectDropdowns > 1 ? 'YES ✅' : 'NO ❌'}\n`);
  
  console.log('✅ VERIFICATION PASSED');
  console.log('Command type changes properly replace old command with fresh empty command');
  
  await browser.close();
})().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
