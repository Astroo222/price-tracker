const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'Price Tracker API running' }));

app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port', process.env.PORT || 3000);
});

require('./scheduler');