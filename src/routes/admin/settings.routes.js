import express from 'express';
import { 
  getUserProfile,
  updateUserProfile,
  updatePassword,
  toggleTwoFactor,
  updateNotificationSettings,
  updateThemePreference,
  updateLanguagePreference,
  updateTimezonePreference,
  updateCurrencyPreference,
  manageActiveSessions,
  updateDataSettings,
  manageConnectedAccounts,
  manageIntegrations
} from '../../controllers/buyer/settings.controllers.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all settings routes
router.use(authenticate);

// Profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Security routes
router.put('/security/password', updatePassword);
router.put('/security/two-factor', toggleTwoFactor);
router.get('/security/sessions', manageActiveSessions);
router.delete('/security/sessions/:sessionId', manageActiveSessions);

// Preferences routes
router.put('/preferences/theme', updateThemePreference);
router.put('/preferences/language', updateLanguagePreference);
router.put('/preferences/timezone', updateTimezonePreference);
router.put('/preferences/currency', updateCurrencyPreference);

// Notification settings
router.put('/notifications', updateNotificationSettings);

// Data settings
router.put('/data', updateDataSettings);

// Connected accounts
router.get('/connected-accounts', manageConnectedAccounts);
router.post('/connected-accounts/:provider', manageConnectedAccounts);
router.delete('/connected-accounts/:provider', manageConnectedAccounts);

// Integrations
router.get('/integrations', manageIntegrations);
router.post('/integrations/:service', manageIntegrations);
router.put('/integrations/:service', manageIntegrations);
router.delete('/integrations/:service', manageIntegrations);

export default router;
