const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  revenue: {
    type: Number,
    default: 0
  },
  growth: {
    type: Number,
    default: 0
  },
  products: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  logo: {
    type: String // URL to the logo image
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This will automatically handle createdAt and updatedAt
});

// Create indexes for frequently queried fields
brandSchema.index({ name: 1 });
brandSchema.index({ category: 1 });
brandSchema.index({ status: 1 });
brandSchema.index({ visibility: 1 });

// Virtual for formatted revenue (with currency symbol)
brandSchema.virtual('formattedRevenue').get(function() {
  return `$${(this.revenue / 1000000).toFixed(2)}M`;
});

// Virtual for formatted growth (with + or - symbol)
brandSchema.virtual('formattedGrowth').get(function() {
  return `${this.growth >= 0 ? '+' : ''}${this.growth}%`;
});

// Pre-save middleware to update the updatedAt timestamp
brandSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to toggle brand status
brandSchema.methods.toggleStatus = function() {
  this.status = this.status === 'active' ? 'inactive' : 'active';
  return this.save();
};

// Method to toggle brand visibility
brandSchema.methods.toggleVisibility = function() {
  this.visibility = this.visibility === 'public' ? 'private' : 'public';
  return this.save();
};

// Static method to find active brands
brandSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Static method to find by category
brandSchema.statics.findByCategory = function(category) {
  return this.find({ category: category });
};

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
