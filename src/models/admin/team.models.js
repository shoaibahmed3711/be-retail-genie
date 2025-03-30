import mongoose from "mongoose";
const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Basic phone number validation
        return /\+\d{1,3}\s?\(\d{3}\)\s?\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Format: +1 (555) 123-4567`
    }
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['Administrator', 'Brand Manager', 'Content Creator', 'Analyst', 'Viewer'],
      message: '{VALUE} is not a valid role'
    },
    default: 'Brand Manager'
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['active', 'inactive'],
      message: '{VALUE} is not a valid status'
    },
    default: 'active'
  },
  joinDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  assignedBrands: [{
    type: String,
    enum: {
      values: ['EcoFresh', 'TechNova', 'UrbanStyle', 'HomeComfort', 'FitLife'],
      message: '{VALUE} is not a valid brand'
    }
  }],
  avatar: {
    type: String, 
    default: null
  },
  isOwner: {
    type: Boolean,
    default: false
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
teamMemberSchema.index({ email: 1 }, { unique: true });
teamMemberSchema.index({ role: 1 });
teamMemberSchema.index({ status: 1 });
teamMemberSchema.index({ assignedBrands: 1 });

// Pre-save middleware to update lastModified
teamMemberSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Virtual for full name formatting
teamMemberSchema.virtual('fullName').get(function() {
  return this.name;
});

// Instance method to toggle status
teamMemberSchema.methods.toggleStatus = function() {
  this.status = this.status === 'active' ? 'inactive' : 'active';
  return this.save();
};

// Static method to find active team members
teamMemberSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Static method to find members by brand
teamMemberSchema.statics.findByBrand = function(brandName) {
  return this.find({ assignedBrands: brandName });
};

// Static method to find members by role
teamMemberSchema.statics.findByRole = function(role) {
  return this.find({ role });
};

// Compound index for common queries
teamMemberSchema.index({ status: 1, role: 1 });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
