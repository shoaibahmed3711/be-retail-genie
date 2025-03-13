import { SalesAnalytics, Product, CustomerSegment, AnalyticsMetrics } from '../../models/brand-manager/analysis.models.js';

// Sales Analytics Controllers
export const getSalesAnalytics = async (req, res) => {
  try {
    const { year, month } = req.query;
    const query = {};
    if (year) query.year = year;
    if (month) query.month = month;
    
    const salesAnalytics = await SalesAnalytics.find(query);
    res.status(200).json(salesAnalytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSalesAnalytics = async (req, res) => {
  try {
    const salesAnalytics = new SalesAnalytics(req.body);
    const savedAnalytics = await salesAnalytics.save();
    res.status(201).json(savedAnalytics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Product Analytics Controllers
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Customer Segment Controllers
export const getCustomerSegments = async (req, res) => {
  try {
    const segments = await CustomerSegment.find();
    res.status(200).json(segments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomerSegment = async (req, res) => {
  try {
    const { name } = req.params;
    const updatedSegment = await CustomerSegment.findOneAndUpdate(
      { name },
      req.body,
      { new: true }
    );
    res.status(200).json(updatedSegment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Analytics Metrics Controllers
export const getAnalyticsMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const metrics = await AnalyticsMetrics.find(query);
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAnalyticsMetrics = async (req, res) => {
  try {
    const metrics = new AnalyticsMetrics(req.body);
    const savedMetrics = await metrics.save();
    res.status(201).json(savedMetrics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
