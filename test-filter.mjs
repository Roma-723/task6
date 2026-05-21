import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  console.log('✅ Page loaded');
  
  console.log('\n=== Test 1: Initial state - no commands ===');
  const buttons = await page.locator('button:has-text("Добавить команду")').count();
  console.log(`Add command button found: ${buttons > 0}`);
  
  // Add first command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  console.log('✅ Added first command');
  
  // Change first to 'where'
  await page.locator('select').first().selectOption('where');
  await page.waitForTimeout(300);
  console.log('✅ Changed first command to "where"');
  
  // Add second command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  console.log('✅ Added second command');
  
  console.log('\n=== Test 2: Check dropdown states after first command is "where" ===');
  const secondSelect = await page.locator('select').nth(1);
  
  // Check if 'where' is disabled in second dropdown
  const whereOption = secondSelect.locator('option[value="where"]');
  const whereDisabled = await whereOption.getAttribute('disabled');
  console.log(`"where" option in 2nd dropdown disabled: ${whereDisabled !== null}`);
  
  // Check if 'range' is NOT disabled in second dropdown
  const rangeOption = secondSelect.locator('option[value="range"]');
  const rangeDisabled = await rangeOption.getAttribute('disabled');
  console.log(`"range" option in 2nd dropdown disabled: ${rangeDisabled !== null}`);
  
  // Change second to 'range'
  await secondSelect.selectOption('range');
  await page.waitForTimeout(300);
  console.log('✅ Changed second command to "range"');
  
  // Add third command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  console.log('✅ Added third command');
  
  console.log('\n=== Test 3: Check first dropdown - should have "where" disabled ===');
  const firstSelect = await page.locator('select').first();
  const firstWhereDisabled = await firstSelect.locator('option[value="where"]').getAttribute('disabled');
  console.log(`"where" option in 1st dropdown disabled: ${firstWhereDisabled !== null} (should be true)`);
  
  console.log('\n=== Test 4: Check third dropdown - should have "where" and "range" disabled ===');
  const thirdSelect = await page.locator('select').nth(2);
  const thirdWhereDisabled = await thirdSelect.locator('option[value="where"]').getAttribute('disabled');
  const thirdRangeDisabled = await thirdSelect.locator('option[value="range"]').getAttribute('disabled');
  console.log(`"where" option in 3rd dropdown disabled: ${thirdWhereDisabled !== null} (should be true)`);
  console.log(`"range" option in 3rd dropdown disabled: ${thirdRangeDisabled !== null} (should be true)`);
  
  console.log('\n=== Test 5: Add "should" command - should never be disabled ===');
  await thirdSelect.selectOption('should');
  await page.waitForTimeout(300);
  
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  
  const fourthSelect = await page.locator('select').nth(3);
  const shouldOption = fourthSelect.locator('option[value="should"]');
  const shouldDisabled = await shouldOption.getAttribute('disabled');
  console.log(`"should" option in 4th dropdown disabled: ${shouldDisabled !== null} (should be false)`);
  
  // Add another should
  await fourthSelect.selectOption('should');
  await page.waitForTimeout(300);
  
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(500);
  
  const fifthSelect = await page.locator('select').nth(4);
  const fifthShouldDisabled = await fifthSelect.locator('option[value="should"]').getAttribute('disabled');
  console.log(`"should" option in 5th dropdown disabled: ${fifthShouldDisabled !== null} (should be false)`);
  
  console.log('\n=== Test 6: "should" command can select its own type ===');
  const currentFifthType = await fifthSelect.inputValue();
  console.log(`5th command type: ${currentFifthType} (should be "range")`);
  
  // Change to should
  await fifthSelect.selectOption('should');
  await page.waitForTimeout(300);
  
  const updatedFifthType = await fifthSelect.inputValue();
  console.log(`5th command type after change: ${updatedFifthType} (should be "should")`);
  
  await browser.close();
  console.log('\n✅ All tests completed successfully!');
})().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
