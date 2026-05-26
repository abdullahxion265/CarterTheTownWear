const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// --- Multer ---
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files allowed'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 8 * 1024 * 1024 } });

// GET /api/products
// Query: brand, category (men|women|kids), page, limit
router.get('/', async (req, res) => {
  try {
    const { brand, category, page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = [];
    let params = [];

    if (brand && brand !== 'all') { where.push('brand = ?'); params.push(brand); }
    if (category && category !== 'all') { where.push('category = ?'); params.push(category); }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const [rows] = await db.query(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      products: rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('[GET /products]', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/brands
router.get('/brands', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT brand FROM products ORDER BY brand ASC');
    res.json(rows.map((r) => r.brand));
  } catch (err) {
    console.error('[GET /products/brands]', err);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

// GET /api/products/picks — 3 random products
router.get('/picks', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY RAND() LIMIT 3');
    res.json(rows);
  } catch (err) {
    console.error('[GET /products/picks]', err);
    res.status(500).json({ error: 'Failed to fetch picks' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('[GET /products/:id]', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products — admin only
router.post('/', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, brand, category = 'men', price, description } = req.body;

    if (!name || !brand || !price) {
      return res.status(400).json({ error: 'Name, brand, and price are required' });
    }

    const validCategories = ['men', 'women', 'kids'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Category must be men, women, or kids' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      'INSERT INTO products (name, brand, category, price, description, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, brand, category, parseFloat(price), description || null, imageUrl]
    );

    const [newProduct] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(newProduct[0]);
  } catch (err) {
    console.error('[POST /products]', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT image_url FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });

    const imageUrl = rows[0].image_url;
    if (imageUrl) {
      const filePath = path.join(__dirname, '..', imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('[DELETE /products/:id]', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
