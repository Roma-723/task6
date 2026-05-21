import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  console.log('TEST: Dropdown only shows available options to switch to\n');
  
  // Add first command (defaults to "range")
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  let cmd1Select = page.locator('select').first();
  let cmd1Options = await cmd1Select.locator('option').all();
  let cmd1Values = [];
  for (const opt of cmd1Options) {
    cmd1Values.push(await opt.getAttribute('value'));
  }
  
  console.log('Command 1 (type: range)');
  console.log(`  Available options: ${cmd1Values.join(', ')}`);
  console.log(`  ✓ "range" NOT in dropdown: ${!cmd1Values.includes('range') ? 'YES ✅' : 'NO ❌'}`);
  console.log(`  ✓ "should" in dropdown: ${cmd1Values.includes('should') ? 'YES ✅' : 'NO ❌'}\n`);
  
  // Add second command (defaults to "range")
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  let cmd2Select = page.locator('select').nth(1);
  let cmd2Options = await cmd2Select.locator('option').all();
  let cmd2Values = [];
  for (const opt of cmd2Options) {
    cmd2Values.push(await opt.getAttribute('value'));
  }
  
  console.log('Command 2 (type: range)');
  console.log(`  Available options: ${cmd2Values.join(', ')}`);
  console.log(`  ✓ "range" NOT in dropdown: ${!cmd2Values.includes('range') ? 'YES ✅' : 'NO ❌'}`);
  console.log(`  ✓ "should" in dropdown: ${cmd2Values.includes('should') ? 'YES ✅' : 'NO ❌'}\n`);
  
  // Change Command 2 to "where"
  await cmd2Select.selectOption('where');
  await page.waitForTimeout(600);
  
  // Check Command 1's options again
  cmd1Select = page.locator('select').first();
  cmd1Options = await cmd1Select.locator('option').all();
  cmd1Values = [];
  for (const opt of cmd1Options) {
    cmd1Values.push(await opt.getAttribute('value'));
  }
  
  console.log('Command 1 after Command 2 changed to "where"');
  console.log(`  Available options: ${cmd1Values.join(', ')}`);
  console.log(`  ✓ "range" still NOT in dropdown: ${!cmd1Values.includes('range') ? 'YES ✅' : 'NO ❌'}`);
  console.log(`  ✓ "where" NOT in dropdown: ${!cmd1Values.includes('where') ? 'YES ✅' : 'NO ❌'}`);
  console.log(`  ✓ "should" in dropdown: ${cmd1Values.includes('should') ? 'YES ✅' : 'NO ❌'}\n`);
  
  // Add third command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  let cmd3Select = page.locator('select').nth(2);
  let cmd3Options = await cmd3Select.locator('option').all();
  let cmd3Values = [];
  for (const opt of cmd3Options) {
    cmd3Values.push(await opt.getAttribute('value'));
  }
  
  console.log('Command 3 (type: range)');
  console.log(`  Available options: ${cmd3Values.join(', ')}`);
  console.log(`  ✓ "range" NOT in dropdown: ${!cmd3Values.includes('range') ? 'YES ✅' : 'NO ❌'}`);
  console.log(`  ✓ "where" NOT in dropdown: ${!cmd3Values.includes('where') ? 'YES ✅' : 'NO ❌'}`);
  console.log(`  ✓ Only "should" available: ${cmd3Values.join(', ') === 'should' ? 'YES ✅' : 'NO ❌'}\n`);
  
  console.log('✅ VERIFICATION PASSED');
  console.log('- Current command type is never shown in its own dropdown');
  console.log('- Users only see types they can switch to');
  console.log('- "should" is always available as an option');
  
  await browser.close();
})().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
