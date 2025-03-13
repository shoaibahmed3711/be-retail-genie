import { SampleRequest, Transaction } from '../../models/admin/transaction.models.js';

// Sample Request Controllers
export const createSampleRequest = async (req, res) => {
    try {
        const sampleRequest = new SampleRequest(req.body);
        const savedRequest = await sampleRequest.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllSampleRequests = async (req, res) => {
    try {
        const requests = await SampleRequest.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSampleRequestById = async (req, res) => {
    try {
        const request = await SampleRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Sample request not found' });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSampleRequest = async (req, res) => {
    try {
        const updatedRequest = await SampleRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Sample request not found' });
        }
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSampleRequest = async (req, res) => {
    try {
        const request = await SampleRequest.findByIdAndDelete(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Sample request not found' });
        }
        res.status(200).json({ message: 'Sample request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Transaction Controllers
export const createTransaction = async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        const savedTransaction = await transaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
