# microsoft-rewards
## About
microsoft-rewards is a script to automatically earn points with Microsoft (Bing.com) that can be redeemed for [giftcards and more](https://account.microsoft.com/rewards/redeem). [Microsoft Rewards / Bing Rewards]

This script useses [Puppeteer](https://github.com/GoogleChrome/puppeteer) (a headless Chrome API) to gather search terms and perform searches on Bing.com; earning you points.

## Requirements
* [node](https://nodejs.org/en/)
* [yarn](https://yarnpkg.com/lang/en/) or [npm](https://www.npmjs.com/get-npm)

## Installation
`yarn install` or `npm install`

## Configuration
Update `default.json` in the `config` directory with:

* `login` - your Microsoft login
* `password` - your Microsoft password
* `numOfSearches` - the number of searches to perform
* `shuffleSearch` - set to true if you want to shuffle the array of search terms
* `isHeadless` - set to true to hide the Chrome window

## Usage
`npm start` or `node index.js`


