import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Add first command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  // Get the first select's full HTML including the select tag
  const firstSelectHtml = await page.locator('select').first().evaluate(el => el.outerHTML);
  console.log('=== First Command Dropdown HTML ===');
  console.log(firstSelectHtml.substring(0, 500));
  
  const firstType = await page.locator('select').first().inputValue();
  console.log('\n=== Extracted Info ===');
  console.log(`Current value: ${firstType}`);
  
  // Add second command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(600);
  
  const secondSelectHtml = await page.locator('select').nth(1).evaluate(el => el.outerHTML);
  console.log('\n=== Second Command Dropdown HTML ===');
  console.log(secondSelectHtml.substring(0, 500));
  
  const secondType = await page.locator('select').nth(1).inputValue();
  console.log(`\nCurrent value: ${secondType}`);
  
  await browser.close();
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
