const puppeteer = require('puppeteer');

let lonelyPlanetUrl = 'https://www.lonelyplanet.com/england/london';
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(lonelyPlanetUrl);

    // get city introductions
    let attractionsData = await page.evaluate(() => {
        let attractions = [];
        // get the attraction elements
        let attractionsElms = document.querySelectorAll('div.SightsList-item');
        // get the attraction data
        attractionsElms.forEach((attractionElement) => {
            let attractionJson = {};
            try {
                attractionJson.name = attractionElement.querySelector('h5').innerText;
                attractionJson.location = attractionElement.querySelector('p').innerText;
            }
            catch (exception){
              console.log(exception);
            }
            attractions.push(attractionJson);
        });
        return attractions;
    });
    
    console.dir(attractionsData);
})();
