import mongoose from 'mongoose';

// Schema for monthly sales analytics
const SalesAnalyticsSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    enum: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  sales: {
    type: Number,
    required: true,
    default: 0
  },
  returns: {
    type: Number,
    required: true,
    default: 0
  },
  views: {
    type: Number,
    required: true,
    default: 0
  },
  year: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for products
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sales: {
    type: Number,
    required: true,
    default: 0
  },
  revenue: {
    type: Number,
    required: true,
    default: 0
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  inventory: {
    currentStock: {
      type: Number,
      required: true,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      default: 10
    },
    reorderPoint: {
      type: Number,
      required: true,
      default: 5
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for customer segments
const CustomerSegmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['New', 'Returning', 'VIP']
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  customerCount: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for overall analytics metrics
const AnalyticsMetricsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  totalRevenue: {
    type: Number,
    required: true,
    default: 0
  },
  totalOrders: {
    type: Number,
    required: true,
    default: 0
  },
  activeCustomers: {
    type: Number,
    required: true,
    default: 0
  },
  returnRate: {
    type: Number,
    required: true,
    default: 0
  },
  customerEngagement: {
    productViews: {
      type: Number,
      default: 0
    },
    addToCart: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  },
  customerFeedback: {
    totalReviews: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    responseRate: {
      type: Number,
      default: 0
    }
  },
  inventoryHealth: {
    lowStockItems: {
      type: Number,
      default: 0
    },
    outOfStock: {
      type: Number,
      default: 0
    },
    reorderNeeded: {
      type: Number,
      default: 0
    }
  }
});

const SalesAnalytics = mongoose.model('SalesAnalytics', SalesAnalyticsSchema);
const Product = mongoose.model('Product', ProductSchema);
const CustomerSegment = mongoose.model('CustomerSegment', CustomerSegmentSchema);
const AnalyticsMetrics = mongoose.model('AnalyticsMetrics', AnalyticsMetricsSchema);

export { SalesAnalytics, Product, CustomerSegment, AnalyticsMetrics };
