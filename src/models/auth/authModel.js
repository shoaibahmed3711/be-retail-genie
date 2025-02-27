import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'BUYER', 'BRAND_OWNER', 'BRAND_MANAGER'],
    default: 'BRAND_OWNER'
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  }],
  address: {
    type: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    code: String,
    expiresAt: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  refreshToken: String
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String
});

const User = mongoose.model('User', userSchema);
const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

export { User, LoginHistory };