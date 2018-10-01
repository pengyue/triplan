const puppeteer = require('puppeteer');

let bookingUrl = 'https://www.booking.com/searchresults.en-gb.html?label=gen173nr-1FCAEoggJCAlhYSDNYBGhQiAEBmAEuuAEHyAEM2AEB6AEB-AELkgIBeagCAw&lang=en-gb&sid=9f829bae9e16215c91641f1efdf46a8d&sb=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.en-gb.html%3Flabel%3Dgen173nr-1FCAEoggJCAlhYSDNYBGhQiAEBmAEuuAEHyAEM2AEB6AEB-AELkgIBeagCAw%3Bsid%3D9f829bae9e16215c91641f1efdf46a8d%3Bsb_price_type%3Dtotal%26%3B&ss=Chengdu%2C+Sichuan%2C+China&ssne=Sanya&ssne_untouched=Sanya&checkin_monthday=22&checkin_month=12&checkin_year=2018&checkout_monthday=27&checkout_month=12&checkout_year=2018&no_rooms=1&group_adults=4&group_children=0&b_h4u_keep_filters=&from_sf=1&ss_raw=chengdu&ac_position=0&ac_langcode=en&dest_id=-1900349&dest_type=city&iata=CTU&place_id_lat=30.6667&place_id_lon=104.067001&search_pageview_id=8d7b873c83e8016d&search_selected=true&search_pageview_id=8d7b873c83e8016d&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0';
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(bookingUrl);

    // get hotel details
    let hotelData = await page.evaluate(() => {
        let hotels = [];
        // get the hotel elements
        let hotelsElms = document.querySelectorAll('div.sr_property_block[data-hotelid]');
        // get the hotel data
        hotelsElms.forEach((hotelelement) => {
            let hotelJson = {};
            try {
                hotelJson.name = hotelelement.querySelector('span.sr-hotel__name').innerText;
                hotelJson.reviews = hotelelement.querySelector('span.review-score-widget__subtext').innerText;
                hotelJson.rating = hotelelement.querySelector('span.review-score-badge').innerText;
                if(hotelelement.querySelector('strong.price')){
                    hotelJson.price = hotelelement.querySelector('strong.price').innerText;
                }
            }
            catch (exception){

            }
            hotels.push(hotelJson);
        });
        return hotels;
    });

    console.dir(hotelData);
})();
