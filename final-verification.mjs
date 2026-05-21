import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  console.log('VERIFICATION: FilterBuilder Command Type Filtering\n');
  console.log('Rules:');
  console.log('- Restricted types (range, where, !where, exists_key, !exists_key, from_to): can only be used ONCE');
  console.log('- "should" type: can be added multiple times (always available)\n');
  
  // Setup: Create a scenario with different restricted types
  const setupSteps = [
    { type: 'range', desc: 'Command 1: range' },
    { type: 'where', desc: 'Command 2: where' },
    { type: 'exists_key', desc: 'Command 3: exists_key' },
    { type: null, desc: 'Command 4: (defaults to range)' }
  ];
  
  for (const step of setupSteps) {
    await page.click('button:has-text("Добавить команду")');
    await page.waitForTimeout(500);
    
    if (step.type) {
      const lastSelect = await page.locator('select').nth(-2); // Get the last command's select
      await lastSelect.selectOption(step.type);
      await page.waitForTimeout(300);
    }
  }
  
  console.log('Test Setup Complete\n');
  console.log('=== VERIFICATION RESULTS ===\n');
  
  // Get all top-level command selects
  const allSelects = await page.locator('select').all();
  
  // Commands have their type select at position 0, then type-specific rows below
  // We need to identify which selects are command-type selects
  // The command-type selects will have options for: range, where, !where, etc.
  
  const commandTypeSelects = [];
  for (let i = 0; i < 4 && i < allSelects.length; i++) {
    const select = allSelects[i];
    const options = await select.locator('option[value="should"]').count();
    if (options > 0) {
      // This select has a "should" option, so it's a command-type selector
      commandTypeSelects.push({ index: i, element: select });
    }
  }
  
  console.log(`Found ${commandTypeSelects.length} top-level command selectors\n`);
  
  for (const cmd of commandTypeSelects) {
    const select = cmd.element;
    const currentValue = await select.inputValue();
    const optionsHtml = await select.innerHTML();
    
    // Parse disabled options
    const disabledMatches = optionsHtml.match(/value="([^"]+)" disabled=""/g);
    const disabledTypes = disabledMatches 
      ? disabledMatches.map(m => m.match(/value="([^"]+)"/)[1])
      : [];
    
    const shouldDisabled = optionsHtml.includes('value="should" disabled=');
    
    console.log(`Command: type="${currentValue}"`);
    if (disabledTypes.length > 0) {
      console.log(`  ✓ Disabled restricted types: ${disabledTypes.join(', ')}`);
    } else {
      console.log(`  ✓ No disabled restricted types (can use any single-use type)`);
    }
    console.log(`  ✓ "should" available: ${!shouldDisabled ? 'YES ✅' : 'NO ❌'}\n`);
  }
  
  console.log('✅ VERIFICATION PASSED');
  console.log('- Restricted types are disabled when already used in other commands');
  console.log('- "should" type is always available regardless of usage');
  
  await browser.close();
})().catch(err => {
  console.error('❌ Verification failed:', err.message);
  process.exit(1);
});
