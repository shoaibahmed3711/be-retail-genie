import { PerformanceMetric, Activity, Notification, Brand } from '../../models/admin/overview.models.js';

export const getAllPerformanceMetrics = async (req, res) => {
  try {
    const metrics = await PerformanceMetric.find().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: metrics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createPerformanceMetric = async (req, res) => {
  try {
    const metric = await PerformanceMetric.create(req.body);
    res.status(201).json({ success: true, data: metric });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updatePerformanceMetric = async (req, res) => {
  try {
    const metric = await PerformanceMetric.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!metric) {
      return res.status(404).json({ success: false, error: 'Performance metric not found' });
    }
    
    res.status(200).json({ success: true, data: metric });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deletePerformanceMetric = async (req, res) => {
  try {
    const metric = await PerformanceMetric.findByIdAndDelete(req.params.id);
    
    if (!metric) {
      return res.status(404).json({ success: false, error: 'Performance metric not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Activity Controllers
export const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 });
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createActivity = async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found' });
    }
    
    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Notification Controllers
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Brand Controllers
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }
    
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Dashboard Overview
export const getDashboardOverview = async (req, res) => {
  try {
    const metrics = await PerformanceMetric.find().sort({ updatedAt: -1 }).limit(3);
    const activities = await Activity.find().sort({ timestamp: -1 }).limit(5);
    const notifications = await Notification.find({ isRead: false }).sort({ createdAt: -1 }).limit(5);
    const brands = await Brand.find().sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      data: {
        metrics,
        activities,
        notifications,
        brands
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
