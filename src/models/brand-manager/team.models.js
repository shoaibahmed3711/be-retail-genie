import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['Administrator', 'Brand Manager', 'Content Creator', 'Analyst', 'Viewer'],
    default: 'Brand Manager'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  assignedBrands: {
    type: [String],
    default: []
  },
  avatar: {
    type: String,
    default: null
  },
  isOwner: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
