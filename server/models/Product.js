import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  original_price: { type: Number },
  image: { type: String, required: true },
  description: { type: String, default: "" },
  is_bestseller: { type: Boolean, default: false },
  in_stock: { type: Boolean, default: true },
  colors: [String],
  sizes: [String],
  size_images: { type: mongoose.Schema.Types.Mixed, default: {} },
  created_at: { type: Date, default: Date.now }
}, { minimize: false });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
