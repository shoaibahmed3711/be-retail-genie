const mongoose = require('mongoose');

// Performance Metrics Schema
const performanceMetricSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: ['Total Sales', 'Market Share', 'Brand Growth']
  },
  value: {
    type: String,
    required: true
  },
  trend: {
    type: String,
    required: true
  },
  color: {
    type: String,
    enum: ['blue', 'green', 'purple'],
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Activity Schema
const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Product Launch', 'Marketing Campaign', 'Team Collaboration', 'Update']
  },
  brand: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  iconType: {
    type: String,
    required: true,
    enum: ['ShoppingBag', 'Globe', 'Share2', 'Activity']
  },
  iconColor: {
    type: String,
    required: true
  }
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['critical', 'reminder', 'approval']
  },
  message: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  iconType: {
    type: String,
    required: true,
    enum: ['AlertCircle', 'Clock', 'Bell']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Brand Schema
const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  marketSegment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
const PerformanceMetric = mongoose.model('PerformanceMetric', performanceMetricSchema);
const Activity = mongoose.model('Activity', activitySchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Brand = mongoose.model('Brand', brandSchema);

module.exports = { PerformanceMetric, Activity, Notification, Brand};
