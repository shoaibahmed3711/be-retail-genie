import Subscription from '../../models/brand-manager/subscription.models.js';

// Get all subscriptions
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate('userId');
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get subscription by ID
export const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate('userId');
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new subscription
export const createSubscription = async (req, res) => {
  const subscription = new Subscription(req.body);
  try {
    const newSubscription = await subscription.save();
    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update subscription
export const updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    Object.assign(subscription, req.body);
    const updatedSubscription = await subscription.save();
    res.status(200).json(updatedSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete subscription
export const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    await subscription.remove();
    res.status(200).json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update subscription status
export const updateSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    subscription.status = req.body.status;
    const updatedSubscription = await subscription.save();
    res.status(200).json(updatedSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add billing history
export const addBillingHistory = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    subscription.billingHistory.push(req.body);
    const updatedSubscription = await subscription.save();
    res.status(200).json(updatedSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};