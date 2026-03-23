import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false, // Don't return password by default
  },
  name: {
    type: String,
  },
  wishlist: [{
    id: String,
    symbol: String,
    name: String,
    price: Number,
    change: Number,
    isPositive: Boolean
  }],
  preferences: {
    theme: { type: String, default: 'dark' },
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Force HMR to clear cached Mongoose models to allow schema updates without restarting server
delete mongoose.models.User;
export default mongoose.model('User', UserSchema);
