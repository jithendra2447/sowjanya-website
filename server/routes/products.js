import express from 'express';
import { Product } from '../models/Product.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ created_at: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single product by id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPSERT product or list of products (POST / or POST /upsert)
const handleUpsert = async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (const item of items) {
      if (!item.id) continue;
      const updated = await Product.findOneAndUpdate(
        { id: item.id },
        { $set: item },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
      results.push(updated);
    }

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

router.post('/', handleUpsert);
router.post('/upsert', handleUpsert);

// DELETE products
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body || {};
    if (ids && Array.isArray(ids)) {
      await Product.deleteMany({ id: { $in: ids } });
      return res.json({ success: true, message: 'Products deleted' });
    }
    res.status(400).json({ success: false, error: 'ids array required' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE single product by ID param
router.delete('/:id', async (req, res) => {
  try {
    await Product.deleteOne({ id: req.params.id });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// BULK DELETE products
router.post('/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, error: 'ids must be an array' });
    }
    await Product.deleteMany({ id: { $in: ids } });
    res.json({ success: true, message: 'Products deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
