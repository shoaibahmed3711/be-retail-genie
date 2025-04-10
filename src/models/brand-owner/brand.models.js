import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Social Links Schema - for storing brand social media profiles
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
  }
});

// Country Related Schema - for manufacturing and sourcing
const componentSourceSchema = new Schema({
  component: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Main Brand Schema
const brandSchema = new Schema({
  // Basic Brand Information
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true
  },
  tagline: {
    type: String,
    trim: true,
    default: ''
  },
  mission: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Contact Information
  email: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /\S+@\S+\.\S+/.test(v);
      },
      message: props => 'Invalid email format'
    },
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^\+?[\d\s-]{8,}$/.test(v);
      },
      message: props => 'Invalid phone format'
    },
    default: ''
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Media
  logo: {
    type: String, // URL to image
    default: ''
  },
  
  // Social Media
  socialLinks: {
    type: socialLinksSchema,
    default: () => ({})
  },
  
  // Business Information
  yearsInBusiness: {
    type: Number,
    min: 0,
    default: 0
  },
  isCanadianRegistered: {
    type: Boolean,
    default: false
  },
  registeredCountry: {
    type: String,
    trim: true,
    default: ''
  },
  isManufacturedInCanada: {
    type: Boolean,
    default: false
  },
  manufacturingCountry: {
    type: String,
    trim: true,
    default: ''
  },
  hasInternationalSourcing: {
    type: Boolean,
    default: false
  },
  componentSources: {
    type: [componentSourceSchema],
    default: []
  },
  productCount: {
    type: Number,
    min: 0,
    default: 0
  },
  retailerLocationCount: {
    type: Number,
    min: 0,
    default: 0
  },
  isGS1Registered: {
    type: Boolean,
    default: false
  },
  supportsEDI: {
    type: Boolean,
    default: false
  },
  
  // Owner Reference
  owner: {
    type: String,
    required: true,
    default: 'temp-owner-123'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' timestamp before saving
brandSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Find brand by owner
brandSchema.statics.findByOwner = function(ownerId) {
  return this.findOne({ owner: ownerId });
};

// Instance method to update brand data
brandSchema.methods.updateBrandInfo = function(brandData) {
  const updateableFields = [
    'name', 'tagline', 'mission', 
    'email', 'phone', 'website', 'address',
    'socialLinks', 'yearsInBusiness', 'isCanadianRegistered',
    'registeredCountry', 'isManufacturedInCanada', 'manufacturingCountry',
    'hasInternationalSourcing', 'componentSources', 'productCount',
    'retailerLocationCount', 'isGS1Registered', 'supportsEDI'
  ];
  
  updateableFields.forEach(field => {
    if (brandData[field] !== undefined) {
      this[field] = brandData[field];
    }
  });
  
  return this.save();
};

// Create Brand model
const Brand = mongoose.model('Brand', brandSchema);

export default Brand;