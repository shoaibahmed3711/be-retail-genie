import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  detailedDescription: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  cogs: {
    type: Number,
    min: 0,
    default: 0
  },
  margin: {
    type: Number,
    min: 0,
    default: 0
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: 0,
    default: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock', 'Discontinued', 'Coming Soon'],
    default: 'In Stock'
  },
  tags: {
    type: [String],
    default: []
  },
  salesCount: {
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
  imageUrl: {
    type: String,
    default: '/api/placeholder/300/300'
  },
  packaging: {
    type: String,
    trim: true
  },
  distributors: {
    type: [String],
    default: []
  },
  brokers: {
    type: [String],
    default: []
  },
  marketingChannels: {
    type: [String],
    default: []
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to calculate margin if price and cogs are provided
ProductSchema.pre('save', function(next) {
  if (this.price && this.cogs) {
    this.margin = ((this.price - this.cogs) / this.price * 100).toFixed(2);
  }
  next();
});

// Virtual property for discounted price
ProductSchema.virtual('discountedPrice').get(function() {
  if (this.discount) {
    return (this.price * (1 - this.discount / 100)).toFixed(2);
  }
  return this.price;
});

// Methods to update sales and revenue
ProductSchema.methods.recordSale = function(quantity, salePrice) {
  this.salesCount += quantity;
  this.revenue += salePrice * quantity;
  return this.save();
};

// Make sure virtuals are included when converting to JSON
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', ProductSchema);
export default Product;