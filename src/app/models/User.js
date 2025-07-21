import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  company: { type: String },
  phone: { type: String },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ['admin', 'superadmin', 'agent', 'user'],
    default: 'user',
    required: true
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
