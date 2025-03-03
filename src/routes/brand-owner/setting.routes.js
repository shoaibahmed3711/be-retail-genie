// routes/settingsRoutes.js
import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all settings routes
router.use(authMiddleware);

// Get all user settings
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update personal information
router.put('/account', async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    // Validate input
    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone },
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update email address (requires verification)
router.put('/account/email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // In a real app, you'd implement email verification here
    // For now, just update the email
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { email },
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Security settings
router.put('/security/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // In a real app, validate password strength
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }
    
    const user = await User.findById(req.user.id).select('+password');
    
    // In a real app, compare hashed passwords here
    
    // Update password
    user.password = newPassword; // In a real app, hash this password
    user.passwordLastChanged = new Date();
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Toggle two-factor authentication
router.put('/security/two-factor', async (req, res) => {
  try {
    const { enabled } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { twoFactorEnabled: enabled },
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get active sessions
router.get('/security/sessions', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.activeSessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove a session
router.delete('/security/sessions/:sessionId', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.activeSessions = user.activeSessions.filter(
      session => session._id.toString() !== req.params.sessionId
    );
    await user.save();
    res.json(user.activeSessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update preferences
router.put('/preferences', async (req, res) => {
  try {
    const { language, timezone, soundEffects, locationServices } = req.body;
    
    const updates = {};
    if (language) updates.language = language;
    if (timezone) updates.timezone = timezone;
    if (soundEffects !== undefined) updates.soundEffects = soundEffects;
    if (locationServices !== undefined) updates.locationServices = locationServices;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update notification settings
router.put('/preferences/notifications', async (req, res) => {
  try {
    const { email, push, updatesNotification, marketing, security } = req.body;
    
    const updates = {};
    if (email !== undefined) updates['notifications.email'] = email;
    if (push !== undefined) updates['notifications.push'] = push;
    if (updatesNotification !== undefined) updates['notifications.updates'] = updatesNotification;
    if (marketing !== undefined) updates['notifications.marketing'] = marketing;
    if (security !== undefined) updates['notifications.security'] = security;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    );
    
    res.json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update data settings
router.put('/data', async (req, res) => {
  try {
    const { autoBackup, dataSaver, backupSchedule } = req.body;
    
    const updates = {};
    if (autoBackup !== undefined) updates.autoBackup = autoBackup;
    if (dataSaver !== undefined) updates.dataSaver = dataSaver;
    if (backupSchedule) updates.backupSchedule = backupSchedule;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get data usage
router.get('/data/usage', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.dataUsage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Connect/disconnect an account
router.put('/connections/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const { connected, accountId } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Find if the account already exists
    const existingAccountIndex = user.connectedAccounts.findIndex(
      account => account.provider === provider
    );
    
    if (existingAccountIndex >= 0) {
      // Update existing account
      user.connectedAccounts[existingAccountIndex].connected = connected;
      if (accountId) user.connectedAccounts[existingAccountIndex].accountId = accountId;
      if (connected) user.connectedAccounts[existingAccountIndex].dateConnected = new Date();
    } else {
      // Add new account
      user.connectedAccounts.push({
        provider,
        accountId,
        connected,
        dateConnected: connected ? new Date() : null
      });
    }
    
    await user.save();
    res.json(user.connectedAccounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Connect/disconnect an integration
router.put('/integrations/:service', async (req, res) => {
  try {
    const { service } = req.params;
    const { status, config } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Find if the integration already exists
    const existingIntegrationIndex = user.integrations.findIndex(
      integration => integration.service === service
    );
    
    if (existingIntegrationIndex >= 0) {
      // Update existing integration
      user.integrations[existingIntegrationIndex].status = status;
      if (config) user.integrations[existingIntegrationIndex].config = config;
      if (status === 'connected') user.integrations[existingIntegrationIndex].dateConnected = new Date();
    } else {
      // Add new integration
      user.integrations.push({
        service,
        status,
        config,
        dateConnected: status === 'connected' ? new Date() : null
      });
    }
    
    await user.save();
    res.json(user.integrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;