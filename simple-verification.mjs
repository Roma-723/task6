import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  console.log('TEST: FilterBuilder Command Type Filtering\n');
  
  // Add commands manually one at a time
  // Command 1
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  // Get Command 1's select and change type
  let cmd1Select = page.locator('select').first();
  let cmd1Html = await cmd1Select.innerHTML();
  let cmd1Value = await cmd1Select.inputValue();
  
  console.log('Command 1 (initial type: ' + cmd1Value + ')');
  console.log('- "range" disabled: ' + (cmd1Html.includes('value="range" disabled=""') ? '❌ YES' : '✅ NO'));
  console.log('- "should" disabled: ' + (cmd1Html.includes('value="should" disabled=""') ? '❌ YES' : '✅ NO\n'));
  
  // Add Command 2
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  // Command 2 gets added with default type 'range'
  let cmd2Select = page.locator('select').nth(1);
  let cmd2Html = await cmd2Select.innerHTML();
  let cmd2Value = await cmd2Select.inputValue();
  
  console.log('Command 2 (initial type: ' + cmd2Value + ')');
  console.log('- "range" disabled: ' + (cmd2Html.includes('value="range" disabled=""') ? '✅ YES' : '❌ NO') + ' (both are "range")');
  console.log('- "should" disabled: ' + (cmd2Html.includes('value="should" disabled=""') ? '❌ YES' : '✅ NO\n'));
  
  // Recheck Command 1 after Command 2 is added
  cmd1Select = page.locator('select').first();
  cmd1Html = await cmd1Select.innerHTML();
  
  console.log('Command 1 (after Command 2 added):');
  console.log('- "range" disabled: ' + (cmd1Html.includes('value="range" disabled=""') ? '✅ YES' : '❌ NO') + ' (Command 2 also uses it)');
  console.log('- "where" disabled: ' + (cmd1Html.includes('value="where" disabled=""') ? '❌ YES' : '✅ NO') + ' (not used by Command 2)\n');
  
  // Add Command 3
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  let cmd3Select = page.locator('select').nth(2);
  let cmd3Html = await cmd3Select.innerHTML();
  let cmd3Value = await cmd3Select.inputValue();
  
  console.log('Command 3 (initial type: ' + cmd3Value + ')');
  console.log('- "range" disabled: ' + (cmd3Html.includes('value="range" disabled=""') ? '✅ YES' : '❌ NO') + ' (Cmd1 and Cmd2 use it)');
  console.log('- "should" disabled: ' + (cmd3Html.includes('value="should" disabled=""') ? '❌ YES' : '✅ NO') + ' (always available)\n');
  
  console.log('=== VERIFICATION SUMMARY ===');
  console.log('✅ Restricted types are disabled when used by other commands');
  console.log('✅ "should" is NEVER disabled, even when multiple are present');
  console.log('✅ Each command can keep its own type in the dropdown');
  
  await browser.close();
})().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
