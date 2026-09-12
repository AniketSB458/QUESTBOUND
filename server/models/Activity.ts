import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' },
    action: { type: String, required: true }, // e.g., 'QUEST_COMPLETED', 'ITEM_PURCHASED', 'LEVEL_UP'
    xpEarned: { type: Number, default: 0 },
    creditsEarned: { type: Number, default: 0 },
    attribute: { type: String }, // Which attribute increased
    attributeIncrease: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    details: { type: Object } // Any additional data
  },
  { timestamps: true }
);

export const Activity = mongoose.model('Activity', activitySchema);
