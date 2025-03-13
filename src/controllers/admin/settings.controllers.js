import User from '../../models/buyer/settings.models.js';
import bcrypt from 'bcrypt';

/**
 * Get user profile information
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ data: user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user profile information
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, phone } = req.body;
    
    // Check if email is already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        firstName, 
        lastName, 
        email, 
        phone 
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user password
 */
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Validate request
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    
    // Get user with password
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    user.password = hashedPassword;
    user.passwordLastChanged = Date.now();
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Toggle two-factor authentication
 */
export const toggleTwoFactor = async (req, res) => {
  try {
    const userId = req.user.id;
    const { enabled } = req.body;
    
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ message: 'Enabled status must be a boolean' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { twoFactorEnabled: enabled },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`,
      data: { twoFactorEnabled: user.twoFactorEnabled }
    });
  } catch (error) {
    console.error('Error toggling two-factor authentication:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notifications } = req.body;
    
    if (!notifications) {
      return res.status(400).json({ message: 'Notification settings are required' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { notifications },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Notification settings updated successfully',
      data: { notifications: user.notifications }
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update theme preference
 */
export const updateThemePreference = async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme } = req.body;
    
    if (!theme || !['light', 'dark'].includes(theme)) {
      return res.status(400).json({ message: 'Valid theme (light or dark) is required' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { theme },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Theme preference updated successfully',
      data: { theme: user.theme }
    });
  } catch (error) {
    console.error('Error updating theme preference:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update language preference
 */
export const updateLanguagePreference = async (req, res) => {
  try {
    const userId = req.user.id;
    const { language } = req.body;
    
    if (!language || !['english', 'spanish', 'french'].includes(language)) {
      return res.status(400).json({ message: 'Valid language is required' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { language },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Language preference updated successfully',
      data: { language: user.language }
    });
  } catch (error) {
    console.error('Error updating language preference:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update timezone preference
 */
export const updateTimezonePreference = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timezone } = req.body;
    
    if (!timezone) {
      return res.status(400).json({ message: 'Timezone is required' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { timezone },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Timezone preference updated successfully',
      data: { timezone: user.timezone }
    });
  } catch (error) {
    console.error('Error updating timezone preference:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update currency preference
 */
export const updateCurrencyPreference = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currency } = req.body;
    
    if (!currency) {
      return res.status(400).json({ message: 'Currency is required' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { currency },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Currency preference updated successfully',
      data: { currency: user.currency }
    });
  } catch (error) {
    console.error('Error updating currency preference:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Manage active sessions
 */
export const manageActiveSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = req.params.sessionId;
    
    // If sessionId is provided, delete that session
    if (sessionId && req.method === 'DELETE') {
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { activeSessions: { _id: sessionId } } },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ 
        message: 'Session removed successfully',
        data: { activeSessions: user.activeSessions }
      });
    }
    
    // Otherwise, return all active sessions
    const user = await User.findById(userId).select('activeSessions');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      data: { activeSessions: user.activeSessions }
    });
  } catch (error) {
    console.error('Error managing active sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update data settings
 */
export const updateDataSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { autoBackup, dataSaver, backupSchedule } = req.body;
    
    const updateFields = {};
    
    if (typeof autoBackup === 'boolean') updateFields.autoBackup = autoBackup;
    if (typeof dataSaver === 'boolean') updateFields.dataSaver = dataSaver;
    if (backupSchedule && ['daily', 'weekly', 'monthly'].includes(backupSchedule)) {
      updateFields.backupSchedule = backupSchedule;
    }
    
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Data settings updated successfully',
      data: {
        autoBackup: user.autoBackup,
        dataSaver: user.dataSaver,
        backupSchedule: user.backupSchedule
      }
    });
  } catch (error) {
    console.error('Error updating data settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Manage connected accounts
 */
export const manageConnectedAccounts = async (req, res) => {
  try {
    const userId = req.user.id;
    const provider = req.params.provider;
    
    // GET - retrieve all connected accounts
    if (req.method === 'GET') {
      const user = await User.findById(userId).select('connectedAccounts');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ 
        data: { connectedAccounts: user.connectedAccounts }
      });
    }
    
    // POST - connect a new account
    if (req.method === 'POST' && provider) {
      const { accountId } = req.body;
      
      if (!accountId) {
        return res.status(400).json({ message: 'Account ID is required' });
      }
      
      if (!['Google', 'GitHub', 'LinkedIn'].includes(provider)) {
        return res.status(400).json({ message: 'Invalid provider' });
      }
      
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          $push: { 
            connectedAccounts: {
              provider,
              accountId,
              connected: true,
              dateConnected: Date.now()
            }
          }
        },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ 
        message: `${provider} account connected successfully`,
        data: { connectedAccounts: user.connectedAccounts }
      });
    }
    
    // DELETE - disconnect an account
    if (req.method === 'DELETE' && provider) {
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { connectedAccounts: { provider } } },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ 
        message: `${provider} account disconnected successfully`,
        data: { connectedAccounts: user.connectedAccounts }
      });
    }
    
    res.status(400).json({ message: 'Invalid request' });
  } catch (error) {
    console.error('Error managing connected accounts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Manage integrations
 */
export const manageIntegrations = async (req, res) => {
  try {
    const userId = req.user.id;
    const service = req.params.service;
    
    // GET - retrieve all integrations
    if (req.method === 'GET') {
      const user = await User.findById(userId).select('integrations');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ 
        data: { integrations: user.integrations }
      });
    }
    
    // Validate service for other methods
    if (service && !['Slack', 'Dropbox', 'Google Drive', 'Microsoft Teams'].includes(service)) {
      return res.status(400).json({ message: 'Invalid service' });
    }
    
    // POST - add a new integration
    if (req.method === 'POST' && service) {
      const { config } = req.body;
      
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          $push: { 
            integrations: {
              service,
              status: 'connected',
              config: config || {},
              dateConnected: Date.now()
            }
          }
        },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ 
        message: `${service} integration added successfully`,
        data: { integrations: user.integrations }
      });
    }
    
    // PUT - update an integration
    if (req.method === 'PUT' && service) {
      const { status, config } = req.body;
      
      if (!status || !['connected', 'disconnected'].includes(status)) {
        return res.status(400).json({ message: 'Valid status is required' });
      }
      
      const user = await User.findOneAndUpdate(
        { 
          _id: userId,
          'integrations.service': service
        },
        { 
          $set: { 
            'integrations.$.status': status,
            'integrations.$.config': config || {}
          }
        },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User or integration not found' });
      }
      
      return res.status(200).json({ 
        message: `${service} integration updated successfully`,
        data: { integrations: user.integrations }
      });
    }
    
    // DELETE - remove an integration
    if (req.method === 'DELETE' && service) {
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { integrations: { service } } },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ 
        message: `${service} integration removed successfully`,
        data: { integrations: user.integrations }
      });
    }
    
    res.status(400).json({ message: 'Invalid request' });
  } catch (error) {
    console.error('Error managing integrations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
