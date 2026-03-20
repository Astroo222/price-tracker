const { getJson } = require('serpapi');
require('dotenv').config();

async function searchProducts(query) {
  const results = await getJson({
    engine: 'google_shopping',
    q: query,
    api_key: process.env.SERPAPI_KEY,
    gl: 'ca',
    hl: 'en',
    num: 20,
  });

  const items = results.shopping_results || [];

  return items.map(item => ({
    name: item.title,
    price: item.price,
    raw_price: parseFloat(item.extracted_price || 0),
    store: item.source,
    link: item.link,
    thumbnail: item.thumbnail,
    rating: item.rating || null,
    reviews: item.reviews || null,
  }));
}

module.exports = { searchProducts };