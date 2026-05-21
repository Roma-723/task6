const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  
  console.log('=== Test 1: Check initial state ===');
  const selects = await page.locator('select').all();
  console.log(`Found ${selects.length} command dropdowns`);
  
  // Add first command (range)
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(300);
  
  console.log('\n=== Test 2: Add range command ===');
  let selectOptions = await page.locator('select').first().locator('option');
  let optionCount = await selectOptions.count();
  for (let i = 0; i < optionCount; i++) {
    const value = await selectOptions.nth(i).getAttribute('value');
    const disabled = await selectOptions.nth(i).getAttribute('disabled');
    console.log(`Option: ${value}, Disabled: ${disabled}`);
  }
  
  // Change first command to 'where'
  await page.locator('select').first().selectOption('where');
  await page.waitForTimeout(300);
  
  // Add second command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(300);
  
  console.log('\n=== Test 3: After adding second command ===');
  const secondSelect = await page.locator('select').nth(1);
  selectOptions = secondSelect.locator('option');
  optionCount = await selectOptions.count();
  for (let i = 0; i < optionCount; i++) {
    const value = await selectOptions.nth(i).getAttribute('value');
    const disabled = await selectOptions.nth(i).getAttribute('disabled');
    console.log(`Second dropdown - Option: ${value}, Disabled: ${disabled}`);
  }
  
  // Change second command to 'range'
  await secondSelect.selectOption('range');
  await page.waitForTimeout(300);
  
  // Add third command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(300);
  
  console.log('\n=== Test 4: After adding third command ===');
  const firstSelect = await page.locator('select').first();
  selectOptions = firstSelect.locator('option');
  optionCount = await selectOptions.count();
  console.log('First command dropdown (should have "range" disabled):');
  for (let i = 0; i < optionCount; i++) {
    const value = await selectOptions.nth(i).getAttribute('value');
    const disabled = await selectOptions.nth(i).getAttribute('disabled');
    if (value === 'range' || value === 'where') {
      console.log(`  Option: ${value}, Disabled: ${disabled}`);
    }
  }
  
  const thirdSelect = await page.locator('select').nth(2);
  selectOptions = thirdSelect.locator('option');
  optionCount = await selectOptions.count();
  console.log('Third command dropdown (should have "where" and "range" disabled):');
  for (let i = 0; i < optionCount; i++) {
    const value = await selectOptions.nth(i).getAttribute('value');
    const disabled = await selectOptions.nth(i).getAttribute('disabled');
    console.log(`  Option: ${value}, Disabled: ${disabled}`);
  }
  
  // Test that "should" is never disabled
  await thirdSelect.selectOption('should');
  await page.waitForTimeout(300);
  
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(300);
  
  console.log('\n=== Test 5: "should" is always available ===');
  const fourthSelect = await page.locator('select').nth(3);
  selectOptions = fourthSelect.locator('option');
  optionCount = await selectOptions.count();
  for (let i = 0; i < optionCount; i++) {
    const value = await selectOptions.nth(i).getAttribute('value');
    const disabled = await selectOptions.nth(i).getAttribute('disabled');
    if (value === 'should') {
      console.log(`Should option disabled: ${disabled}`);
    }
  }
  
  await browser.close();
  console.log('\n✅ All tests completed');
})().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
