import express from 'express';
import {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  updateSubscriptionStatus,
  addBillingHistory
} from '../../controllers/brand-manager/subscription.controllers.js';

const router = express.Router();

// Base route: /api/subscriptions

// Get all subscriptions
router.get('/', getAllSubscriptions);

// Get subscription by ID
router.get('/:id', getSubscriptionById);

// Create new subscription
router.post('/', createSubscription);

// Update subscription
router.put('/:id', updateSubscription);

// Delete subscription
router.delete('/:id', deleteSubscription);

// Update subscription status
router.patch('/:id/status', updateSubscriptionStatus);

// Add billing history
router.post('/:id/billing-history', addBillingHistory);

export default router;