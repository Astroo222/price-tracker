const router = require('express').Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const { searchProducts } = require('../search');

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
}

router.post('/', auth, async (req, res) => {
  const { url, target_price, alert_pct } = req.body;
  const store = url.includes('amazon') ? 'amazon'
    : url.includes('walmart') ? 'walmart'
    : url.includes('bestbuy') ? 'bestbuy' : 'other';
  const result = await db.query(
    `INSERT INTO tracked_products (user_id,url,store,target_price,alert_pct)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [req.user.userId, url, store, target_price, alert_pct]
  );
  res.json(result.rows[0]);
});

router.get('/', auth, async (req, res) => {
  const result = await db.query(
    'SELECT * FROM tracked_products WHERE user_id=$1 ORDER BY created_at DESC',
    [req.user.userId]
  );
  res.json(result.rows);
});

router.delete('/:id', auth, async (req, res) => {
  await db.query(
    'DELETE FROM tracked_products WHERE id=$1 AND user_id=$2',
    [req.params.id, req.user.userId]
  );
  res.json({ success: true });
});
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Parametre q manquant' });
    const results = await searchProducts(q);
    res.json(results);
  } catch (e) {
    console.error('Erreur recherche:', e.message);
    res.status(500).json({ error: 'Erreur de recherche' });
  }
});
module.exports = router;