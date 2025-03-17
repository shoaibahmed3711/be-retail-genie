import express from 'express';
import {
  getAllHistory,
  getHistoryByType,
  createHistory,
  deleteHistory,
  getHistoryByDateRange
} from '../../controllers/buyer/history.controllers.js';

const router = express.Router();

// Get all history entries
router.get('/', getAllHistory);

// Get history by type
router.get('/type/:type', getHistoryByType);

// Get history by date range
router.get('/date-range', getHistoryByDateRange);

// Create new history entry
router.post('/', createHistory);

// Delete history entry
router.delete('/:id', deleteHistory);

export default router;