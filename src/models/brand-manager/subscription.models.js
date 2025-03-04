import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_transfer'],
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  last4: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 4
  },
  expMonth: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  expYear: {
    type: Number,
    required: true
  }
});

const billingHistorySchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    required: true
  },
  downloadUrl: {
    type: String
  }
});

const billingAddressSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  streetAddress: {
    type: String,
    required: true
  },
  suite: String,
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planName: {
    type: String,
    required: true,
    enum: ['Starter', 'Business Pro', 'Enterprise']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  nextBillingDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'suspended'],
    default: 'active'
  },
  brandsAllowed: {
    type: Number,
    required: true,
    min: 1
  },
  brandsUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  features: [{
    type: String,
    required: true
  }],
  paymentMethod: paymentMethodSchema,
  billingAddress: billingAddressSchema,
  billingHistory: [billingHistorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware to ensure brandsUsed doesn't exceed brandsAllowed
subscriptionSchema.pre('save', function(next) {
  if (this.brandsUsed > this.brandsAllowed) {
    next(new Error('Brands used cannot exceed brands allowed'));
  }
  next();
});

// Virtual for brand usage percentage
subscriptionSchema.virtual('brandUsagePercentage').get(function() {
  return (this.brandsUsed / this.brandsAllowed) * 100;
});

// Method to check if subscription is near limit
subscriptionSchema.methods.isNearLimit = function() {
  return this.brandUsagePercentage > 80;
};

// Method to check if can add more brands
subscriptionSchema.methods.canAddBrand = function() {
  return this.brandsUsed < this.brandsAllowed;
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
