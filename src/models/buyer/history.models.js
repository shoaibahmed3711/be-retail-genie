import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['product_view', 'brand_view', 'search', 'meeting', 'message']
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  details: {
    productName: String,
    brand: String,
    category: String,
    brandName: String,
    query: String,
    filters: [String],
    meetingType: {
      type: String,
      enum: ['Video Call', 'Audio Call', 'In-Person']
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Pending']
    },

    messageType: String
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
historySchema.index({ type: 1, timestamp: -1 });
historySchema.index({ 'details.brandName': 1 });
historySchema.index({ 'details.productName': 1 });

// Add a method to get time ago in human readable format
historySchema.methods.getTimeAgo = function() {
  const now = new Date();
  const diff = now - this.timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  return `${minutes} minutes ago`;
};

const History = mongoose.model('History', historySchema);

export default History;
