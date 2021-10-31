const puppeteer = require('puppeteer');

const url = 'https://devfest21.web.app/';

async function main() {
    console.log('CHECKING....');
    const browser = await puppeteer.launch({
        headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle2',
    });

    const totalResult = await page.evaluate(() => {
        const res = [];
        const teamNames = document.getElementsByTagName('h2');
        const spanTags = document.getElementsByClassName('v-chip__content');
        for (let i = 0; i < spanTags.length; i += 1) {
            res.push({
                teamName: teamNames[i].innerText,
                price: spanTags[i].innerText.replace(' $G', '')
            });
        }
        return res;
    });
    browser.close();

    totalResult.sort((teamInfo1, teamInfo2) => parseInt(teamInfo2.price, 10) - parseInt(teamInfo1.price, 10));

    console.log('\x1b[32m%s\x1b[0m', `1ST: ${totalResult[0].teamName} WITH ${totalResult[0].price}`);
    console.log('\x1b[36m%s\x1b[0m', `2ND: ${totalResult[1].teamName} WITH ${totalResult[1].price}`);
    console.log('\x1b[35m%s\x1b[0m', `3ND: ${totalResult[2].teamName} WITH ${totalResult[2].price}`);

    const homeTeamIndex = totalResult.findIndex(teamInfo => teamInfo.teamName === 'TrueMedic');
    console.log('-----------------------------------------------');

    if (homeTeamIndex > 0) {
        console.log('\x1b[31m%s\x1b[0m', `YOUR TEAM: NUMBER ${homeTeamIndex + 1} IN DASHBOARD`);
        console.log('\x1b[31m%s\x1b[0m', `STILL NEED ${parseInt(totalResult[0].price, 10) - totalResult[homeTeamIndex].price + 1000} TO BE A LEADER`);
    } else {
        console.log(`YOUR TEAM: NUMBER ${homeTeamIndex + 1} IN DASHBOARD`);
        console.log('\x1b[31m%s\x1b[0m', `2ND TEAM ONLY NEED ${parseInt(totalResult[homeTeamIndex].price, 10) - totalResult[1].price} TO BE YOU`);
    }
}

main();
