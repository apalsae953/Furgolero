import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (!response.ok()) console.log('HTTP ERROR:', response.status(), response.url());
  });

  await page.goto('https://furgolero.vercel.app/', { waitUntil: 'networkidle2' });
  
  // click La Liga
  try {
    await page.waitForSelector('div.grid > div:nth-child(1)'); // The La Liga card
    await page.click('div.grid > div:nth-child(1)');
    await page.waitForTimeout(3000);
    console.log("Clicked La Liga");
  } catch(e) {
    console.log("Could not click La Liga", e);
  }

  await browser.close();
})();
