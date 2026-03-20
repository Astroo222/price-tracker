const axios = require('axios');
const cheerio = require('cheerio');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

const SELECTORS = {
  amazon:  { name: '#productTitle',             price: '.a-price-whole' },
  walmart: { name: '[itemprop="name"]',          price: '[itemprop="price"]' },
  bestbuy: { name: '.sku-title h1',              price: '.priceView-customer-price span' },
};

function detectStore(url) {
  if (url.includes('amazon'))  return 'amazon';
  if (url.includes('walmart')) return 'walmart';
  if (url.includes('bestbuy')) return 'bestbuy';
  return 'unknown';
}

async function scrapePrice(url) {
  const store = detectStore(url);
  const sel = SELECTORS[store];
  if (!sel) throw new Error('Store non supporté: ' + url);

  const { data } = await axios.get(url, { headers: HEADERS });
  const $ = cheerio.load(data);

  const name  = $(sel.name).first().text().trim();
  const raw   = $(sel.price).first().text().trim();
  const price = parseFloat(raw.replace(/[^0-9.]/g, ''));

  if (!price || isNaN(price)) throw new Error('Prix introuvable sur la page');

  return { name, price, store };
}

module.exports = { scrapePrice };