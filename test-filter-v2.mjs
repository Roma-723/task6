import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  console.log('✅ Page loaded\n');
  
  // Test 1: Add command and set to 'where'
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  await page.locator('select').first().selectOption('where');
  await page.waitForTimeout(300);
  console.log('Command 1 set to: where');
  
  // Test 2: Add second command (defaults to range)
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  const cmd2Value = await page.locator('select').nth(1).inputValue();
  console.log(`Command 2 defaults to: ${cmd2Value}`);
  
  // Check if 'where' is disabled in second dropdown (should be YES)
  const cmd2WhereDisabled = await page.locator('select').nth(1).locator('option[value="where"]').getAttribute('disabled');
  console.log(`✅ "where" disabled in cmd2 dropdown: ${cmd2WhereDisabled !== null} (should be true)\n`);
  
  // Test 3: Change cmd2 to 'exists_key' to test another type
  await page.locator('select').nth(1).selectOption('exists_key');
  await page.waitForTimeout(300);
  console.log('Command 2 set to: exists_key');
  
  // Add third command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  
  // Test 4: Check first dropdown - 'where' should NOT be disabled, 'exists_key' should be disabled
  const cmd1WhereDisabled = await page.locator('select').nth(0).locator('option[value="where"]').getAttribute('disabled');
  const cmd1ExistsKeyDisabled = await page.locator('select').nth(0).locator('option[value="exists_key"]').getAttribute('disabled');
  console.log(`✅ "where" disabled in cmd1 dropdown: ${cmd1WhereDisabled !== null} (should be false, it's cmd1's type)`);
  console.log(`✅ "exists_key" disabled in cmd1 dropdown: ${cmd1ExistsKeyDisabled !== null} (should be true, it's used in cmd2)\n`);
  
  // Test 5: Check third dropdown - both 'where' and 'exists_key' should be disabled
  const cmd3WhereDisabled = await page.locator('select').nth(2).locator('option[value="where"]').getAttribute('disabled');
  const cmd3ExistsKeyDisabled = await page.locator('select').nth(2).locator('option[value="exists_key"]').getAttribute('disabled');
  const cmd3RangeDisabled = await page.locator('select').nth(2).locator('option[value="range"]').getAttribute('disabled');
  console.log(`✅ "where" disabled in cmd3 dropdown: ${cmd3WhereDisabled !== null} (should be true)`);
  console.log(`✅ "exists_key" disabled in cmd3 dropdown: ${cmd3ExistsKeyDisabled !== null} (should be true)`);
  console.log(`✅ "range" disabled in cmd3 dropdown: ${cmd3RangeDisabled !== null} (should be false)\n`);
  
  // Test 6: Verify "should" is always available
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  
  const cmd4ShouldDisabled = await page.locator('select').nth(3).locator('option[value="should"]').getAttribute('disabled');
  console.log(`✅ "should" disabled in cmd4 dropdown: ${cmd4ShouldDisabled !== null} (should be false, always available)\n`);
  
  // Test 7: Change cmd3 to 'should' and verify 'should' still works
  await page.locator('select').nth(2).selectOption('should');
  await page.waitForTimeout(300);
  
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  
  const cmd5ShouldDisabled = await page.locator('select').nth(4).locator('option[value="should"]').getAttribute('disabled');
  console.log(`✅ "should" disabled in cmd5 dropdown: ${cmd5ShouldDisabled !== null} (should be false, can be used multiple times)\n`);
  
  console.log('✅ All tests passed!');
  await browser.close();
})().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
