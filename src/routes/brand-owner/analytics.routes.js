// routes/api/analytics.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Sale = require('../../models/Sale');
const Product = require('../../models/Product');
const Customer = require('../../models/Customer');
const Order = require('../../models/Order');
const AnalyticsSummary = require('../../models/AnalyticsSummary');

// @route   GET api/analytics/overview
// @desc    Get analytics overview data
// @access  Private
router.get('/overview', async (req, res) => {
  try {
    const { timeRange = '6M' } = req.query;
    
    // Calculate date range based on timeRange
    const endDate = new Date();
    const startDate = new Date();
    
    switch(timeRange) {
      case '1M':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 6);
    }
    
    // Get the latest analytics summary
    const latestSummary = await AnalyticsSummary.findOne()
      .sort({ date: -1 })
      .populate('topProducts.product');

    // Get sales trend data
    const salesData = await Sale.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort('year month');

    // Get top performing products
    const topProducts = await Product.find()
      .sort('-sales')
      .limit(3);

    // Get customer segments
    const customerSegments = await Customer.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$segment', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);

    // Return all analytics data
    res.json({
      keyMetrics: {
        totalRevenue: latestSummary?.totalRevenue || 0,
        totalOrders: latestSummary?.totalOrders || 0,
        activeCustomers: latestSummary?.activeCustomers || 0,
        returnRate: latestSummary?.returnRate || 0
      },
      salesData,
      topProducts: topProducts.map(product => ({
        name: product.name,
        sales: product.sales,
        revenue: product.revenue,
        rating: product.rating
      })),
      customerSegments,
      engagement: latestSummary?.engagement || {},
      feedback: latestSummary?.feedback || {},
      inventory: latestSummary?.inventory || {}
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/analytics/sales
// @desc    Get sales data by time period
// @access  Private
router.get('/sales', async (req, res) => {
  try {
    const { timeRange = '6M' } = req.query;
    
    // Calculate date range based on timeRange
    const endDate = new Date();
    const startDate = new Date();
    
    switch(timeRange) {
      case '1M':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 6);
    }
    
    const salesData = await Sale.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort('year month');

    res.json(salesData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/analytics/products
// @desc    Get product performance data
// @access  Private
router.get('/products', async (req, res) => {
  try {
    const { limit = 10, sort = 'sales' } = req.query;
    
    const sortOptions = {};
    if (sort === 'sales') {
      sortOptions.sales = -1;
    } else if (sort === 'revenue') {
      sortOptions.revenue = -1;
    } else if (sort === 'rating') {
      sortOptions.rating = -1;
    }
    
    const products = await Product.find()
      .sort(sortOptions)
      .limit(parseInt(limit));
      
    res.json(products.map(product => ({
      id: product._id,
      name: product.name,
      sales: product.sales,
      revenue: product.revenue,
      rating: product.rating,
      reviewCount: product.reviewCount,
      inventory: product.inventory
    })));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/analytics/customers
// @desc    Get customer segment data
// @access  Private
router.get('/customers', async (req, res) => {
  try {
    const segments = await Customer.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$segment', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);
    
    res.json(segments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/analytics/inventory
// @desc    Get inventory health data
// @access  Private
router.get('/inventory', async (req, res) => {
  try {
    const lowStockItems = await Product.countDocuments({ 
      inventory: { $gt: 0, $lte: '$lowStockThreshold' } 
    });
    
    const outOfStock = await Product.countDocuments({ inventory: 0 });
    
    const reorderNeeded = await Product.countDocuments({
      $or: [
        { inventory: 0 },
        { inventory: { $lte: '$lowStockThreshold' } }
      ]
    });
    
    res.json({
      lowStockItems,
      outOfStock,
      reorderNeeded,
      items: await Product.find({
        $or: [
          { inventory: 0 },
          { inventory: { $lte: '$lowStockThreshold' } }
        ]
      }).select('name inventory lowStockThreshold')
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/analytics/generate-summary
// @desc    Generate analytics summary (would be called by a cron job)
// @access  Private
router.post('/generate-summary', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate total revenue and orders
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $nin: ['Cancelled', 'Returned'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const totalOrders = await Order.countDocuments({ 
      status: { $nin: ['Cancelled', 'Returned'] } 
    });
    
    // Calculate active customers (placed order in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeCustomers = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$customer' } },
      { $count: 'count' }
    ]);
    
    // Calculate return rate
    const returnedOrders = await Order.countDocuments({ isReturned: true });
    const returnRate = totalOrders > 0 ? (returnedOrders / totalOrders) * 100 : 0;
    
    // Get customer segments
    const customerSegments = await Customer.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$segment', count: { $sum: 1 } } }
    ]);
    
    const segments = {
      new: 0,
      returning: 0,
      vip: 0
    };
    
    customerSegments.forEach(segment => {
      if (segment._id === 'New') segments.new = segment.count;
      if (segment._id === 'Returning') segments.returning = segment.count;
      if (segment._id === 'VIP') segments.vip = segment.count;
    });
    
    // Get engagement metrics (these would come from analytics tracking)
    // For demo purposes, we'll use placeholder values
    const engagement = {
      productViews: 12450,
      addToCart: 4320,
      conversionRate: 3.2
    };
    
    // Get feedback metrics
    const reviews = await Product.aggregate([
      { $group: { _id: null, totalReviews: { $sum: '$reviewCount' } } }
    ]);
    
    const averageRating = await Product.aggregate([
      { $match: { reviewCount: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    
    // Get inventory health
    const lowStockItems = await Product.countDocuments({ 
      inventory: { $gt: 0, $lte: '$lowStockThreshold' } 
    });
    
    const outOfStock = await Product.countDocuments({ inventory: 0 });
    
    // Get top products
    const topProducts = await Product.find()
      .sort('-sales')
      .limit(3);
    
    // Create analytics summary
    const summary = new AnalyticsSummary({
      date: today,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      activeCustomers: activeCustomers[0]?.count || 0,
      returnRate,
      customerSegments: segments,
      engagement,
      feedback: {
        reviews: reviews[0]?.totalReviews || 0,
        averageRating: averageRating[0]?.avgRating || 0,
        responseRate: 95 // Placeholder
      },
      inventory: {
        lowStockItems,
        outOfStock,
        reorderNeeded: lowStockItems + outOfStock
      },
      topProducts: topProducts.map(product => ({
        product: product._id,
        sales: product.sales,
        revenue: product.revenue
      }))
    });
    
    await summary.save();
    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
