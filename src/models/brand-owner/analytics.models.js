// models/Sale.js
const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    enum: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  year: {
    type: Number,
    required: true
  },
  sales: {
    type: Number,
    required: true
  },
  returns: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for unique month-year combinations
SaleSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Sale', SaleSchema);

// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  inventory: {
    type: Number,
    required: true,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  sales: {
    type: Number,
    default: 0
  },
  revenue: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Product', ProductSchema);

// models/Customer.js
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
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
  segment: {
    type: String,
    enum: ['New', 'Returning', 'VIP'],
    default: 'New'
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  orderCount: {
    type: Number,
    default: 0
  },
  lastOrderDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Customer', CustomerSchema);

// models/Order.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const OrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [OrderItemSchema],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Pending'
  },
  isReturned: {
    type: Boolean,
    default: false
  },
  returnReason: {
    type: String
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

module.exports = mongoose.model('Order', OrderSchema);

// models/AnalyticsSummary.js
const mongoose = require('mongoose');

const AnalyticsSummarySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  activeCustomers: {
    type: Number,
    default: 0
  },
  returnRate: {
    type: Number,
    default: 0
  },
  customerSegments: {
    new: { type: Number, default: 0 },
    returning: { type: Number, default: 0 },
    vip: { type: Number, default: 0 }
  },
  engagement: {
    productViews: { type: Number, default: 0 },
    addToCart: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
  },
  feedback: {
    reviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    responseRate: { type: Number, default: 0 }
  },
  inventory: {
    lowStockItems: { type: Number, default: 0 },
    outOfStock: { type: Number, default: 0 },
    reorderNeeded: { type: Number, default: 0 }
  },
  topProducts: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    sales: Number,
    revenue: Number
  }]
});

module.exports = mongoose.model('AnalyticsSummary', AnalyticsSummarySchema);