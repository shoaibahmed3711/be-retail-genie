import express from 'express';
import {
  getSalesAnalytics,
  createSalesAnalytics,
  getProducts,
  updateProduct,
  getCustomerSegments,
  updateCustomerSegment,
  getAnalyticsMetrics,
  createAnalyticsMetrics
} from '../../controllers/brand-manager/analysis.controllers.js';

const router = express.Router();

// Sales Analytics Routes
router.get('/sales', getSalesAnalytics);
router.post('/sales', createSalesAnalytics);

// Product Analytics Routes
router.get('/products', getProducts);
router.put('/products/:id', updateProduct);

// Customer Segment Routes
router.get('/segments', getCustomerSegments);
router.put('/segments/:name', updateCustomerSegment);

// Analytics Metrics Routes
router.get('/metrics', getAnalyticsMetrics);
router.post('/metrics', createAnalyticsMetrics);

export default router;
