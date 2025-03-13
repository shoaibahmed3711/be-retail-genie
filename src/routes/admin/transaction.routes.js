import express from 'express';
import {
    createSampleRequest,
    getAllSampleRequests,
    getSampleRequestById,
    updateSampleRequest,
    deleteSampleRequest,
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} from '../../controllers/admin/transaction.controllers.js';

const router = express.Router();

// Sample Request Routes
router.post('/sample-requests', createSampleRequest);
router.get('/sample-requests', getAllSampleRequests);
router.get('/sample-requests/:id', getSampleRequestById);
router.put('/sample-requests/:id', updateSampleRequest);
router.delete('/sample-requests/:id', deleteSampleRequest);

// Transaction Routes
router.post('/transactions', createTransaction);
router.get('/transactions', getAllTransactions);
router.get('/transactions/:id', getTransactionById);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;
