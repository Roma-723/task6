import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Capture console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  console.log('Adding first command...\n');
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(800);
  
  console.log('\nAdding second command...\n');
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(800);
  
  console.log('\nChecking dropdowns...');
  const firstSelect = page.locator('select').first();
  const firstType = await firstSelect.inputValue();
  const firstHtml = await firstSelect.innerHTML();
  const firstOptions = Array.from(firstHtml.matchAll(/<option[^>]*value="([^"]+)"/g)).map(m => m[1]);
  
  console.log(`\nFirst command type: ${firstType}`);
  console.log(`First command available options: ${firstOptions.join(', ')}`);
  console.log(`Current type in options: ${firstOptions.includes(firstType)}`);
  
  await browser.close();
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
