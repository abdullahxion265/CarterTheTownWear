const express = require('express');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'CarterTheTownWear' }));

app.listen(PORT, () => {
  console.log(`[Server] CarterTheTownWear API → http://localhost:${PORT}`);
});
