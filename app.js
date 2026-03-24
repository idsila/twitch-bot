require('dotenv').config({});
const { chromium } = require('playwright');
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

const COOKIE = process.env.COOKIE;
const screenshotPath = path.join(__dirname, 'full_page.jpg');

app.use(cors({methods:['GET','POST']}));
app.use(express.json());    
app.use(express.static('public'));  


async function startApp() {
  console.log('БОТ ВКЛЮЧЕН');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({ });

  const page = await context.newPage();

  await page.goto('https://www.twitch.tv/Evgexa');

  // ждём загрузку
  await page.waitForTimeout(20000);

  setInterval(async () => {
    await page.screenshot({ path: 'full_page.jpg', type: 'jpeg', quality: 10 });
  }, 1000)

  await page.evaluate(async({ cookie }) => {
    cookie.split('; ').forEach(item => { document.cookie = item; });
    setTimeout(async () => { location.reload(); return ;}, 5000);

  },{ cookie: COOKIE });

  await page.waitForTimeout(20000);

  await page.evaluate(() => {
    console.log('ПРОВЕРКА НА БАНЕР ЗАПУЩЕНА'); 
    const bannerTime = setInterval(() => {
      console.log('СКАНИРУЮ');
      const buttonAd = document.querySelector('button[data-a-target="content-classification-gate-overlay-start-watching-button"]'); 
      if(buttonAd){
        buttonAd.click();
        clearTimeout(bannerTime)
        console.log('БАНЕР БЫЛ УДАЛЕН'); 
      }
    }, 1000);
  })

}



app.get('/get', async (req, res) => {
  res.sendFile(screenshotPath);
});

app.get('/start', async (req, res) => {
  startApp();
  res.send({ type: true });
});




app.listen('3000', err => { err ? err : console.log('STARTD SERVER') });
