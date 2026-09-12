import mongoose from 'mongoose';

const questSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Coding', 'Study', 'Fitness', 'Health', 'Reading', 'Creativity', 'Personal', 'Other'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Epic'],
      required: true,
    },
    xpReward: { type: Number, required: true },
    creditReward: { type: Number, required: true },
    attributeReward: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const Quest = mongoose.model('Quest', questSchema);
