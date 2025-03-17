import express from 'express';
import {
  getPerformanceMetrics,
  createPerformanceMetric,
  getActivities,
  createActivity,
  getNotifications,
  createNotification,
  markNotificationAsRead,
  getBrands,
  createBrand,
  updateBrand
} from '../../controllers/buyer/overview.controllers.js';

const router = express.Router();

// Performance Metrics Routes
router.get('/metrics', getPerformanceMetrics);
router.post('/metrics', createPerformanceMetric);

// Activity Routes
router.get('/activities', getActivities);
router.post('/activities', createActivity);

// Notification Routes
router.get('/notifications', getNotifications);
router.post('/notifications', createNotification);
router.patch('/notifications/:id/read', markNotificationAsRead);

// Brand Routes
router.get('/brands', getBrands);
router.post('/brands', createBrand);
router.put('/brands/:id', updateBrand);

export default router;