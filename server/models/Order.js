import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customer_name: { type: String, required: true },
  customer_phone: { type: String, required: true },
  shipping_address: { type: String, required: true },
  total_amount: { type: Number, required: true },
  payment_method: { type: String, required: true },
  payment_status: { type: String, default: "Pending" },
  order_status: { type: String, default: "Pending" },
  items: [
    {
      slug: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      itemCode: String,
    }
  ],
  created_at: { type: Date, default: Date.now }
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
