// Import mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Business Hours Schema (sub-document)
const businessHoursSchema = new Schema({
  open: {
    type: String,
    default: '09:00'
  },
  close: {
    type: String,
    default: '17:00'
  },
  isOpen: {
    type: Boolean,
    default: true
  }
});

// Social Links Schema (sub-document)
const socialLinksSchema = new Schema({
  facebook: {
    type: String,
    default: ''
  },
  twitter: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  instagram: {
    type: String,
    default: ''
  },
  youtube: {
    type: String,
    default: ''
  },
  pinterest: {
    type: String,
    default: ''
  }
});

// Team Member Schema (sub-document)
const teamMemberSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
});

// Visibility Settings Schema (sub-document)
const visibilitySettingsSchema = new Schema({
  isPublic: {
    type: Boolean,
    default: true
  },
  showEmail: {
    type: Boolean,
    default: true
  },
  showPhone: {
    type: Boolean,
    default: true
  },
  showAddress: {
    type: Boolean,
    default: true
  },
  showSocial: {
    type: Boolean,
    default: true
  },
  showGallery: {
    type: Boolean,
    default: true
  }
});

// Change History Schema (sub-document)
const historyEntrySchema = new Schema({
  action: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

// Main Brand Schema
const brandSchema = new Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    trim: true
  },
  mission: {
    type: String,
    trim: true
  },

  // Contact
  email: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /\S+@\S+\.\S+/.test(v) || v === '';
      },
      message: 'Invalid email format'
    }
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\+?[\d\s-]{8,}$/.test(v) || v === '';
      },
      message: 'Invalid phone format'
    }
  },
  website: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },

  // Media
  logo: {
    type: String, // URL or Base64 data
    default: ''
  },
  galleryImages: [{
    type: String, // URLs or Base64 data
    maxlength: 6 // Enforced in the application logic as well
  }],

  // Organization
  businessHours: {
    monday: businessHoursSchema,
    tuesday: businessHoursSchema,
    wednesday: businessHoursSchema,
    thursday: businessHoursSchema,
    friday: businessHoursSchema,
    saturday: businessHoursSchema,
    sunday: businessHoursSchema
  },
  socialLinks: socialLinksSchema,
  teamMembers: [teamMemberSchema],

  // Classification
  categories: [{
    type: String,
    trim: true
  }],
  keywords: [{
    type: String,
    trim: true
  }],
  
  // Settings
  theme: {
    type: String,
    enum: ['blue', 'green', 'purple', 'red'],
    default: 'blue'
  },
  visibilitySettings: visibilitySettingsSchema,
  languages: [{
    type: String,
    enum: ['en', 'es', 'fr', 'de', 'zh', 'it', 'ja'],
    default: ['en']
  }],
  
  // Metadata
  changeHistory: [historyEntrySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // User relationship
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Pre-save middleware to update the updatedAt field
brandSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add a method to record changes to the history
brandSchema.methods.addToHistory = function(action, userId) {
  const historyEntry = {
    action,
    timestamp: Date.now(),
    user: userId
  };
  
  this.changeHistory.unshift(historyEntry);
  
  // Keep only the last 15 changes
  if (this.changeHistory.length > 15) {
    this.changeHistory = this.changeHistory.slice(0, 15);
  }
};

// Create analytics virtual to calculate metrics
brandSchema.virtual('analytics').get(function() {
  // In a real application, you would calculate these from other collections
  // This is a placeholder implementation
  return {
    profileViews: Math.floor(Math.random() * 1000),
    socialClicks: Math.floor(Math.random() * 500),
    changesThisWeek: this.changeHistory.filter(
      entry => new Date(entry.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length
  };
});

// Create the model from the schema
const Brand = mongoose.model('Brand', brandSchema);

// User Schema (referenced by Brand)
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Export the models
module.exports = {
  Brand,
  User
};