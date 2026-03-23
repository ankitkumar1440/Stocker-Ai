import mongoose from 'mongoose';

const PredictionSchema = new mongoose.Schema({
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true,
  },
  prediction: {
    type: String, // e.g., 'UP', 'DOWN', 'STABLE'
    required: true,
  },
  confidence: {
    type: Number, // Percentage 0-100
    required: true,
  },
  reason: {
    type: String,
    required: true, // Explanation from AI
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.models.Prediction || mongoose.model('Prediction', PredictionSchema);
