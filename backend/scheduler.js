const cron = require('node-cron');
const db = require('./db');
const { scrapePrice } = require('./scraper');

async function checkAllPrices() {
  console.log('[Scheduler] Vérification des prix...', new Date().toISOString());

  const { rows: products } = await db.query(
    `SELECT * FROM tracked_products
     WHERE last_checked IS NULL
        OR last_checked < NOW() - INTERVAL '55 minutes'`
  );

  console.log(`[Scheduler] ${products.length} produits à vérifier`);

  for (const product of products) {
    try {
      const { price } = await scrapePrice(product.url);

      await db.query(
        'INSERT INTO price_snapshots (product_id, price) VALUES ($1, $2)',
        [product.id, price]
      );

      await db.query(
        'UPDATE tracked_products SET current_price=$1, last_checked=NOW() WHERE id=$2',
        [price, product.id]
      );

      const shouldAlert =
        (product.target_price && price <= product.target_price) ||
        (product.alert_pct && product.current_price &&
         ((product.current_price - price) / product.current_price * 100) >= product.alert_pct);

      if (shouldAlert) await sendAlert(product, price);

      await new Promise(r => setTimeout(r, 2000));

    } catch (err) {
      console.error(`[Scheduler] Erreur pour ${product.url}:`, err.message);
    }
  }
}

async function sendAlert(product, newPrice) {
  const recent = await db.query(
    `SELECT id FROM alerts_sent
     WHERE product_id=$1 AND sent_at > NOW() - INTERVAL '24 hours'`,
    [product.id]
  );
  if (recent.rows.length > 0) return;

  await db.query(
    'INSERT INTO alerts_sent (product_id, trigger_price) VALUES ($1, $2)',
    [product.id, newPrice]
  );

  console.log(`[Alerte] Baisse de prix! ${product.product_name}: $${newPrice}`);
}

cron.schedule('0 * * * *', checkAllPrices);
checkAllPrices();

module.exports = { checkAllPrices };