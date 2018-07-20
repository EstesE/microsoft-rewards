const puppeteer = require('puppeteer');
const config = require('config');
const notifier = require('node-notifier');
const path = require('path');

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

(async () => {
    const browser = await puppeteer.launch({ headless: config.isHeadless });
    const pages = await browser.pages();
    const page = await pages[0];

    let msg = function(message, error, exitCode) {
        browser.close();
        let title = 'Points';
        let icon = path.join(__dirname, 'assets/rewards.png');
        if (error === true) {
            title = 'Error';
            icon = path.join(__dirname, 'assets/error.png');
        }
        notifier.notify({
            title: title,
            message: message,
            icon: icon
        });
        process.exit(exitCode);
    };

    await page.goto('https://trends.google.com/trends/trendingsearches/daily?geo=US', { waitUntil: 'networkidle2' }).catch(err => {
        msg(err.message, true, 1);
    });

    for (let i = 0; i < config.microsoft.numOfSearches / 2; i++) {
        await page.waitFor(1500);
        await page.click(".feed-load-more-button").catch(err => {
            msg(err.message, true, 1);
        });
    }

    let termParts = await page.evaluate(() => {
        let parts = [];
        let items = document.querySelectorAll("md-list");
        for (let i = 1; i < items.length; i++) {
            parts.push(items[i].querySelector('span').innerText);
        }
        return parts;
    });

    await page.waitFor(1500);

    if (config.shuffleSearch === true) {
      termParts = shuffle(termParts);
    }
    await page.waitFor(500);

    await page.goto('https://www.bing.com', { waitUntil: 'networkidle2' }).catch(err => {
        msg(err.message, true, 1);
    });
    await page.waitFor(2500);
    await page.click("#id_s").catch(err => {
        msg(err.message, true, 1);
    });
    await page.waitFor(2500);
    await page.type('input[name="loginfmt"]', config.microsoft.login).catch(err => {
        msg(err.message, true, 1);
    });
    await page.waitFor(500);
    await page.click(".btn-primary").catch(err => {
        msg(err.message, true, 1);
    });
    await page.waitFor(2500);
    await page.type('input[name="passwd"]', config.microsoft.password).catch(err => {
        msg(err.message, true, 1);
    });
    await page.waitFor(500);
    await page.click(".btn-primary").catch(err => {
        msg(err.message, true, 1);
    });
    await page.waitFor(2500);

    for (let i = 0; i < config.microsoft.numOfSearches; i++) {
        await page.type('.b_searchbox', termParts[i]).catch(err => {
            msg(err.message, true, 1);
        });
        await page.waitFor(1500);
        await page.click('input[title="Search"]').catch(err => {
            msg(err.message, true, 1);
        });
        await page.waitFor(2000);
        await page.evaluate(function() {
            document.querySelector('.b_searchbox').value = ''
        });
        await page.waitFor(1500);
    }

    await page.goto('https://account.microsoft.com/rewards/pointsbreakdown', { waitUntil: 'networkidle2' }).catch(err => {
        msg(err.message, true, 1);
    });
    await page.waitFor(3500);

    let points = await page.evaluate(() => {
        return document.querySelector('.pointsDetail').innerText;
    });
    await page.waitFor(500);

    // Finished...
    msg(points, false, 0);
})();