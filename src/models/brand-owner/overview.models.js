// models/index.js
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['brand_owner', 'admin'],
    default: 'brand_owner'
  },
  planType: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  planExpiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Revenue Schema
const revenueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  month: {
    type: Date,
    required: true
  },
  source: {
    type: String,
    enum: ['direct_sales', 'affiliate', 'sponsorship', 'advertisement'],
    default: 'direct_sales'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a static method to get monthly revenue
revenueSchema.statics.getMonthlyRevenue = async function(userId, month) {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  
  const result = await this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        month: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].totalRevenue : 0;
};

// Post Schema
const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    enum: ['Instagram', 'Snapchat', 'Social Hub', 'Messages', 'Other'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  mediaUrls: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'in-progress'],
    default: 'pending'
  },
  engagement: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  publishedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Stats Schema
const statSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Date,
    required: true
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalPosts: {
    type: Number,
    default: 0
  },
  engagementCount: {
    type: Number,
    default: 0
  },
  revenueGrowth: {
    type: Number,
    default: 0
  },
  postsGrowth: {
    type: Number,
    default: 0
  },
  engagementGrowth: {
    type: Number,
    default: 0
  },
  monthlyGoalPercentage: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Goal Schema
const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Date,
    required: true
  },
  revenueGoal: {
    type: Number,
    default: 0
  },
  postsGoal: {
    type: Number,
    default: 0
  },
  engagementGoal: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Dashboard Update Schema
const dashboardUpdateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
const User = mongoose.model('User', userSchema);
const Revenue = mongoose.model('Revenue', revenueSchema);
const Post = mongoose.model('Post', postSchema);
const Stat = mongoose.model('Stat', statSchema);
const Goal = mongoose.model('Goal', goalSchema);
const DashboardUpdate = mongoose.model('DashboardUpdate', dashboardUpdateSchema);

// Helper function to calculate dashboard stats
async function calculateMonthlyStats(userId, month) {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const previousMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1);
  
  const monthlyRevenue = await Revenue.getMonthlyRevenue(userId, month);
  
  const monthlyPosts = await Post.countDocuments({
    userId,
    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
  });
  
  const posts = await Post.find({
    userId,
    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
  });
  
  let totalEngagement = 0;
  posts.forEach(post => {
    totalEngagement += post.engagement.likes + post.engagement.comments + post.engagement.shares;
  });
  
  const prevMonthRevenue = await Revenue.getMonthlyRevenue(userId, previousMonth);
  
  const prevMonthPosts = await Post.countDocuments({
    userId,
    createdAt: { 
      $gte: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1),
      $lte: new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0)
    }
  });
  
  const prevMonthPosts2 = await Post.find({
    userId,
    createdAt: { 
      $gte: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1),
      $lte: new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0)
    }
  });
  
  let prevTotalEngagement = 0;
  prevMonthPosts2.forEach(post => {
    prevTotalEngagement += post.engagement.likes + post.engagement.comments + post.engagement.shares;
  });
  
  const revenueGrowth = prevMonthRevenue > 0 ? ((monthlyRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 0;
  const postsGrowth = prevMonthPosts > 0 ? ((monthlyPosts - prevMonthPosts) / prevMonthPosts) * 100 : 0;
  const engagementGrowth = prevTotalEngagement > 0 ? ((totalEngagement - prevTotalEngagement) / prevTotalEngagement) * 100 : 0;
  
  const monthlyGoal = await Goal.findOne({
    userId,
    month: {
      $gte: startOfMonth,
      $lte: endOfMonth
    }
  });
  
  const revenueGoalPercentage = monthlyGoal && monthlyGoal.revenueGoal > 0 
    ? (monthlyRevenue / monthlyGoal.revenueGoal) * 100 
    : 0;
  
  const stats = await Stat.findOneAndUpdate(
    {
      userId,
      month: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    },
    {
      totalRevenue: monthlyRevenue,
      totalPosts: monthlyPosts,
      engagementCount: totalEngagement,
      revenueGrowth,
      postsGrowth,
      engagementGrowth,
      monthlyGoalPercentage: revenueGoalPercentage
    },
    { new: true, upsert: true }
  );
  
  return stats;
}

module.exports = {
  connectDB,
  User,
  Revenue,
  Post,
  Stat,
  Goal,
  DashboardUpdate,
  calculateMonthlyStats
};