import express from 'express';
import {
  getAllPerformanceMetrics,
  createPerformanceMetric,
  updatePerformanceMetric,
  deletePerformanceMetric,
  getAllActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getAllNotifications,
  createNotification,
  updateNotification,
  markNotificationAsRead,
  deleteNotification,
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getDashboardOverview
} from '../../controllers/admin/overview.controllers.js';

const router = express.Router();

// Dashboard Overview
router.get('/dashboard', getDashboardOverview);

// Performance Metrics Routes
router.route('/metrics')
  .get(getAllPerformanceMetrics)
  .post(createPerformanceMetric);

router.route('/metrics/:id')
  .put(updatePerformanceMetric)
  .delete(deletePerformanceMetric);

// Activity Routes
router.route('/activities')
  .get(getAllActivities)
  .post(createActivity);

router.route('/activities/:id')
  .put(updateActivity)
  .delete(deleteActivity);

// Notification Routes
router.route('/notifications')
  .get(getAllNotifications)
  .post(createNotification);

router.route('/notifications/:id')
  .put(updateNotification)
  .delete(deleteNotification);

router.patch('/notifications/:id/read', markNotificationAsRead);

// Brand Routes
router.route('/brands')
  .get(getAllBrands)
  .post(createBrand);

router.route('/brands/:id')
  .put(updateBrand)
  .delete(deleteBrand);

export default router;