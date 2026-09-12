import mongoose from 'mongoose';

const questSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
    description: { type: String, default: '', trim: true, maxlength: 1000 },
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
    dueDate: { type: Date },
  },
  { timestamps: true }
);

questSchema.index({ userId: 1, completed: 1, createdAt: -1 });
questSchema.index({ userId: 1, completedAt: -1 });

export const Quest = mongoose.model('Quest', questSchema);
