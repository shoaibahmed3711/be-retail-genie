import mongoose from 'mongoose';

const favouriteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['brand', 'product'],
    default: 'product'
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    required: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
favouriteSchema.index({ userId: 1 });
favouriteSchema.index({ category: 1 });
favouriteSchema.index({ type: 1 });

const Favourite = mongoose.model('Favourite', favouriteSchema);

export default Favourite;
