import mongoose from 'mongoose';

const attributeSchema = new mongoose.Schema({
  strength: { type: Number, default: 1 },
  intellect: { type: Number, default: 1 },
  discipline: { type: Number, default: 1 },
  creativity: { type: Number, default: 1 },
  energy: { type: Number, default: 1 },
  empathy: { type: Number, default: 1 },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    timezone: { type: String, default: 'UTC', maxlength: 64 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    attributes: { type: attributeSchema, default: () => ({}) },
    characterClass: { type: String, default: 'Unassigned' },
    identity: { type: String },
    element: { type: String },
    companion: { type: String },
    specialAbility: { type: String },
    discoveryVersion: { type: Number, default: 1 },
    quizCompleted: { type: Boolean, default: false },
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' }],
    equippedAvatar: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
    equippedTheme: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' },
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' }],
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
