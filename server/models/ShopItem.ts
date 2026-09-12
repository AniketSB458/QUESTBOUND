import mongoose from 'mongoose';

const shopItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    type: {
      type: String,
      enum: ['badge', 'avatar', 'theme', 'title', 'cosmetic'],
      required: true,
    },
    rarity: {
      type: String,
      enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
      required: true,
    },
    icon: { type: String, required: true }, // URL or lucide icon name
  },
  { timestamps: true }
);

shopItemSchema.index({ type: 1, rarity: 1, price: 1 });

export const ShopItem = mongoose.model('ShopItem', shopItemSchema);
