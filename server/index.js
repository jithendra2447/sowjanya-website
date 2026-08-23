import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import cmsRouter from './routes/cms.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LS-Collections MongoDB API' });
});

// Direct Razorpay order creation endpoint (Vite proxy maps /api/create-razorpay-order to this port)
import Razorpay from 'razorpay';
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    const instance = new Razorpay({
      key_id: process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
    });

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    };

    const rzpOrder = await instance.orders.create(options);
    res.status(200).json(rzpOrder);
  } catch (error) {
    console.error("Razorpay local error:", error);
    res.status(500).json({ message: 'Failed to initialize payment gateway order', error: error.message });
  }
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/cms', cmsRouter);

app.listen(PORT, () => {
  console.log(`[Express Server] API running on http://localhost:${PORT}`);
  connectDB();
});
