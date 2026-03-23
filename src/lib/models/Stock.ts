import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  percentageChange: {
    type: Number,
    default: 0,
  },
  historicalData: [{
    date: Date,
    price: Number,
    volume: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.models.Stock || mongoose.model('Stock', StockSchema);
