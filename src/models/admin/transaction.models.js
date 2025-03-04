import mongoose from 'mongoose';

// Schema for Sample Requests
const sampleRequestSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true,
        trim: true
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    dateRequested: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
        default: 'Pending'
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    notes: {
        type: String,
        trim: true
    },
    contactEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    rejectionReason: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Schema for Transactions
const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    brandName: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    type: {
        type: String,
        required: true,
        enum: ['Subscription', 'Sample Order', 'Platform Fee', 'Listing Fee']
    },
    plan: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Completed', 'Processing', 'Failed', 'Refunded'],
        default: 'Processing'
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    failureReason: {
        type: String,
        trim: true
    },
    refundReason: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Create models from schemas
const SampleRequest = mongoose.model('SampleRequest', sampleRequestSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

export { SampleRequest, Transaction };
