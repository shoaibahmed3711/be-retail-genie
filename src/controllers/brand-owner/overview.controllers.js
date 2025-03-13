import { PerformanceMetric, Activity, Notification, Brand } from '../../models/brand-manager/overview.models';

// Performance Metrics Controllers
const getPerformanceMetrics = async (req, res) => {
  try {
    const metrics = await PerformanceMetric.find();
    res.status(200).json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPerformanceMetric = async (req, res) => {
  try {
    const metric = new PerformanceMetric(req.body);
    const newMetric = await metric.save();
    res.status(201).json(newMetric);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Activity Controllers
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createActivity = async (req, res) => {
  try {
    const activity = new Activity(req.body);
    const newActivity = await activity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Notification Controllers
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Brand Controllers
const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBrand = async (req, res) => {
  try {
    const brand = new Brand(req.body);
    const newBrand = await brand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPerformanceMetrics,
  createPerformanceMetric,
  getActivities,
  createActivity,
  getNotifications,
  createNotification,
  markNotificationAsRead,
  getBrands,
  createBrand
};
