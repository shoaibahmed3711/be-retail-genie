import express from 'express';
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  getRequestsByStatus,
  updateRequestStatus
} from '../../controllers/buyer/requests.controllers.js';

const router = express.Router();

// Create a new request
router.post('/requests', createRequest);

// Get all requests
router.get('/requests', getAllRequests);

// Get request by ID
router.get('/requests/:id', getRequestById);

// Update request
router.put('/requests/:id', updateRequest);

// Delete request
router.delete('/requests/:id', deleteRequest);

// Get requests by status
router.get('/requests/status/:status', getRequestsByStatus);

// Update request status
router.patch('/requests/:id/status', updateRequestStatus);

export default router;