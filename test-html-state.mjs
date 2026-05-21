import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Add first command
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(800);
  
  // Add second command  
  await page.click('button:has-text("Добавить команду")');
  await page.waitForTimeout(800);
  
  console.log('=== Command 1 Dropdown HTML ===');
  const cmd1Html = await page.locator('select').nth(0).innerHTML();
  console.log(cmd1Html);
  
  console.log('\n=== Command 2 Dropdown HTML ===');
  const cmd2Html = await page.locator('select').nth(1).innerHTML();
  console.log(cmd2Html);
  
  console.log('\n✅ HTML inspection complete');
  await browser.close();
})().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
