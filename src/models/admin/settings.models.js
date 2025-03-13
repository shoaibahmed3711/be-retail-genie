// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // Personal information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
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
  phone: {
    type: String,
    trim: true
  },
  
  // Account settings
  language: {
    type: String,
    enum: ['english', 'spanish', 'french'],
    default: 'english'
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  
  // Security settings
  password: {
    type: String,
    required: true,
    select: false
  },
  passwordLastChanged: {
    type: Date,
    default: Date.now
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  activeSessions: [{
    deviceName: String,
    ip: String,
    lastActive: Date,
    location: String
  }],
  
  // Preferences
  soundEffects: {
    type: Boolean,
    default: true
  },
  locationServices: {
    type: Boolean,
    default: true
  },
  
  // Notifications
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: false
    },
    updates: {
      type: Boolean,
      default: true
    },
    marketing: {
      type: Boolean,
      default: false
    },
    security: {
      type: Boolean,
      default: true
    }
  },
  
  // Data settings
  autoBackup: {
    type: Boolean,
    default: true
  },
  dataSaver: {
    type: Boolean,
    default: false
  },
  backupSchedule: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  dataUsage: {
    storage: {
      type: String,
      default: '0GB'
    },
    bandwidth: {
      type: String,
      default: '0GB/month'
    },
    lastBackup: {
      type: Date
    }
  },
  
  connectedAccounts: [{
    provider: {
      type: String,
      enum: ['Google', 'GitHub', 'LinkedIn']
    },
    accountId: String,
    connected: {
      type: Boolean,
      default: false
    },
    dateConnected: Date
  }],
  
  integrations: [{
    service: {
      type: String,
      enum: ['Slack', 'Dropbox', 'Google Drive', 'Microsoft Teams']
    },
    status: {
      type: String,
      enum: ['connected', 'disconnected'],
      default: 'disconnected'
    },
    config: {
      type: mongoose.Schema.Types.Mixed
    },
    dateConnected: Date
  }]
}, {
  timestamps: true
});

export default mongoose.model('User', UserSchema);