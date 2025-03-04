import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        required: true,
        enum: ['30 minutes', '1 hour', '1.5 hours', '2 hours'],
        default: '1 hour'
    },
    type: {
        type: String,
        required: true,
        enum: ['video', 'phone', 'in-person'],
        default: 'video'
    },
    participants: [{
        type: String,
        required: true,
        trim: true
    }],
    status: {
        type: String,
        required: true,
        enum: ['confirmed', 'pending', 'cancelled'],
        default: 'confirmed'
    },
    agenda: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Add indexes for common queries
meetingSchema.index({ date: 1 });
meetingSchema.index({ brand: 1 });
meetingSchema.index({ status: 1 });

// Virtual for getting formatted date
meetingSchema.virtual('formattedDate').get(function() {
    return this.date.toLocaleDateString();
});

// Virtual for getting formatted time
meetingSchema.virtual('formattedTime').get(function() {
    return this.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

// Instance method to check if meeting is upcoming
meetingSchema.methods.isUpcoming = function() {
    return this.date > new Date();
};

// Static method to find upcoming meetings
meetingSchema.statics.findUpcoming = function() {
    return this.find({
        date: { $gt: new Date() },
        status: { $ne: 'cancelled' }
    }).sort({ date: 1 });
};

// Static method to find past meetings
meetingSchema.statics.findPast = function() {
    return this.find({
        date: { $lt: new Date() }
    }).sort({ date: -1 });
};

// Static method to find meetings by date range
meetingSchema.statics.findByDateRange = function(startDate, endDate) {
    return this.find({
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({ date: 1 });
};

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;
