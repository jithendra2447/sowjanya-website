import express from 'express';
import { CmsSetting } from '../models/CmsSetting.js';

const router = express.Router();

// GET all CMS settings
router.get('/', async (req, res) => {
  try {
    const settings = await CmsSetting.find();
    // Reduce array to a single object key-value mapping
    const data = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST save CMS setting
router.post('/', async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, error: 'Key is required' });
    }
    const updated = await CmsSetting.findOneAndUpdate(
      { key },
      { $set: { value, updated_at: new Date() } },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
