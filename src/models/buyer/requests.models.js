import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  requestDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'shipped', 'delivered', 'rejected'],
    default: 'pending'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  expectedDelivery: {
    type: Date,
    default: null
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  trackingNumber: {
    type: String,
    trim: true,
    sparse: true
  },
  notes: {
    type: String,
    trim: true
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'medium', 'high'],
    default: 'normal'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Create indexes for frequently queried fields
requestSchema.index({ status: 1 });
requestSchema.index({ brand: 1 });
requestSchema.index({ requestDate: -1 });

// Add a pre-save middleware to update lastUpdate
requestSchema.pre('save', function(next) {
  this.lastUpdate = new Date();
  next();
});

// Create virtual for formatted dates
requestSchema.virtual('formattedRequestDate').get(function() {
  return this.requestDate.toLocaleDateString();
});

requestSchema.virtual('formattedExpectedDelivery').get(function() {
  return this.expectedDelivery ? this.expectedDelivery.toLocaleDateString() : 'TBD';
});

requestSchema.virtual('formattedLastUpdate').get(function() {
  return this.lastUpdate.toLocaleDateString();
});

// Export the model
const BuyerRequest = mongoose.model('BuyerRequest', requestSchema);

export default BuyerRequest;
