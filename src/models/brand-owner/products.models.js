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
  
  // Pricing Section
  msrp: {
    type: Number,
    required: [true, 'MSRP is required'],
    min: 0
  },
  retailMargin: {
    type: Number,
    min: 0,
    default: 35
  },
  wholesalePrice: {
    type: Number,
    min: 0
  },
  casePackSize: {
    type: Number,
    min: 1,
    default: 1
  },
  casePrice: {
    type: Number,
    min: 0
  },
  dateAvailable: {
    type: Date
  },
  pricingComments: {
    type: String,
    trim: true
  },
  cogs: {
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
  
  // Packaging Section
  packaging: {
    productBarcode: {
      hasUPC: {
        type: Boolean,
        default: false
      },
      upcCode: {
        type: String,
        validate: {
          validator: function(v) {
            return !this.packaging.productBarcode.hasUPC || /^\d{12}$/.test(v);
          },
          message: props => 'UPC must be 12 digits'
        }
      }
    },
    multipleLanguages: {
      hasMultipleLanguages: {
        type: Boolean,
        default: false
      },
      languages: {
        type: [String]
      }
    },
    unitPackaging: {
      measurementSystem: {
        type: String,
        enum: ['Imperial', 'Metric'],
        default: 'Metric'
      },
      height: Number,
      width: Number,
      length: Number,
      weightUnit: {
        type: String,
        enum: ['Kilograms', 'Pounds']
      },
      weight: Number,
      volume: Number
    },
    casePackaging: {
      hasCasePacking: {
        type: Boolean,
        default: false
      },
      measurementSystem: {
        type: String,
        enum: ['Imperial', 'Metric'],
        default: 'Metric'
      },
      height: Number,
      width: Number,
      length: Number,
      weightUnit: {
        type: String,
        enum: ['Kilograms', 'grams', 'Pounds', 'ounces']
      },
      weight: Number,
      volume: Number,
      casesPerTier: Number,
      tiersPerPallet: Number,
      caseUPC: {
        type: String,
        validate: {
          validator: function(v) {
            return !this.packaging.casePackaging.hasCasePacking || !v || /^\d{14}$/.test(v);
          },
          message: props => 'Case UPC must be 14 digits'
        }
      }
    },
    innerCasePackaging: {
      hasInnerCase: {
        type: Boolean,
        default: false
      },
      unitsPerInnerCase: Number,
      measurementSystem: {
        type: String,
        enum: ['Imperial', 'Metric'],
        default: 'Metric'
      },
      height: Number,
      width: Number,
      length: Number,
      weightUnit: {
        type: String,
        enum: ['Kilograms', 'grams', 'Pounds', 'ounces']
      },
      weight: Number
    },
    callouts: {
      hasCallouts: {
        type: Boolean,
        default: false
      },
      calloutList: {
        type: [String],
        validate: {
          validator: function(v) {
            return !this.packaging.callouts.hasCallouts || v.length <= 10;
          },
          message: props => 'Maximum 10 callouts allowed'
        }
      }
    },
    ingredients: {
      isFrozen: {
        type: Boolean,
        default: false
      },
      isRefrigerated: {
        type: Boolean,
        default: false
      },
      isShelfStable: {
        type: Boolean,
        default: false
      },
      hasIngredients: {
        type: Boolean,
        default: false
      },
      ingredientsList: [String],
      ingredientsLabelImage: String,
      foreignIngredients: {
        hasSourcedIngredients: {
          type: Boolean,
          default: false
        },
        sourceCountries: [String]
      }
    },
    shelfLife: {
      hasShelfLife: {
        type: Boolean,
        default: false
      },
      unit: {
        type: String,
        enum: ['Days', 'Months', 'Years']
      },
      value: Number
    },
    nutritionalInfo: {
      hasNutritionalLabel: {
        type: Boolean,
        default: false
      },
      nutritionalLabelImage: String
    }
  },
  
  // Certifications Section
  certifications: {
    hasCertifications: {
      type: Boolean,
      default: false
    },
    certificationList: [String]
  },
  
  // Product Allergens Section
  allergens: {
    dairy: {
      type: String,
      enum: ['Contains', 'May Contain', 'Does Not Contain'],
      default: 'Does Not Contain'
    },
    egg: {
      type: String,
      enum: ['Contains', 'May Contain', 'Does Not Contain'],
      default: 'Does Not Contain'
    },
    mustard: {
      type: String,
      enum: ['Contains', 'May Contain', 'Does Not Contain'],
      default: 'Does Not Contain'
    },
    peanuts: {
      type: String,
      enum: ['Contains', 'May Contain', 'Does Not Contain'],
      default: 'Does Not Contain'
    },
    seafood: {
      type: String,
      enum: ['Contains', 'May Contain', 'Does Not Contain'],
      default: 'Does Not Contain'
    },
    soy: {
      type: String,
      enum: ['Contains', 'May Contain', 'Does Not Contain'],
      default: 'Does Not Contain'
    },
    sesame: {
      type: String,
      enum: ['Contains', 'May Contain', 'Does Not Contain'],
      default: 'Does Not Contain'
    },
    sulfites: {
      type: String,
      enum: ['Contains', 'May Contain', 'Does Not Contain'],
      default: 'Does Not Contain'
    },
    treeNuts: {
      type: String,
      enum: ['Contains', 'May Contain', 'Does Not Contain'],
      default: 'Does Not Contain'
    },
    wheatGluten: {
      type: String,
      enum: ['Contains', 'May Contain', 'Does Not Contain'],
      default: 'Does Not Contain'
    }
  },
  
  // Distribution Section
  distribution: {
    manufactureCountry: String,
    manufactureRegion: String,
    hasDistributors: {
      type: Boolean,
      default: false
    },
    distributors: {
      type: [{
        name: String,
        percentage: Number,
        doesPickup: {
          type: Boolean,
          default: false
        }
      }],
      default: [],
      set: function(value) {
        if (typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch (e) {
            return [];
          }
        }
        return value;
      }
    },
    retailers: [String],
    distributionComments: String
  },
  
  // Broker Section
  broker: {
    hasBrokers: {
      type: Boolean,
      default: false
    },
    brokers: {
      type: [{
        name: String,
        chargesCommission: {
          type: Boolean,
          default: false
        },
        commissionPercentage: Number,
        commissionDuration: String,
        chargesRetainer: {
          type: Boolean,
          default: false
        },
        retainerAmount: Number,
        retainerDuration: String
      }],
      default: [],
      set: function(value) {
        if (typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch (e) {
            return [];
          }
        }
        return value;
      }
    },
    brokerComments: String
  },
  
  // Marketing Section
  marketing: {
    hasElevatorPitch: {
      type: Boolean,
      default: false
    },
    elevatorPitch: String,
    elevatorPitchFile: String,
    hasSellSheet: {
      type: Boolean,
      default: false
    },
    sellSheetFile: String,
    hasPresentation: {
      type: Boolean,
      default: false
    },
    presentationFile: String
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
  imageDetails: {
    originalName: String,
    mimetype: String,
    size: Number
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

// Pre-save middleware to calculate wholesalePrice and casePrice
ProductSchema.pre('save', function (next) {
  // Calculate wholesalePrice based on MSRP and retail margin
  if (this.msrp && this.retailMargin) {
    this.wholesalePrice = (this.msrp * (1 - (this.retailMargin / 100))).toFixed(2);
  }
  
  // Calculate casePrice based on wholesalePrice and casePackSize
  if (this.wholesalePrice && this.casePackSize) {
    this.casePrice = (this.wholesalePrice * this.casePackSize).toFixed(2);
  }
  
  next();
});

// Virtual property for discounted price
ProductSchema.virtual('discountedPrice').get(function () {
  if (this.discount) {
    return (this.msrp * (1 - this.discount / 100)).toFixed(2);
  }
  return this.msrp;
});

// Methods to update sales and revenue
ProductSchema.methods.recordSale = function (quantity, salePrice) {
  this.salesCount += quantity;
  this.revenue += salePrice * quantity;
  return this.save();
};

// Make sure virtuals are included when converting to JSON
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', ProductSchema);
export default Product;