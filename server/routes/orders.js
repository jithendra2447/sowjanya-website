import express from 'express';
import Razorpay from 'razorpay';
import { Order } from '../models/Order.js';

const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create order
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData.id) {
      orderData.id = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    }
    const order = new Order(orderData);
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create Razorpay order for payment gateway checkout
router.post('/create-razorpay-order', async (req, res) => {
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
    res.json(rzpOrder);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ message: 'Failed to initialize payment order', error: error.message });
  }
});

// PATCH update order by id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Order.findOneAndUpdate(
      { $or: [{ _id: id }, { id: id }] },
      { $set: req.body },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE order by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Order.deleteOne({ $or: [{ _id: id }, { id: id }] });
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
