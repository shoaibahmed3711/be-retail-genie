import Meeting from '../../models/buyer/meetings.models.js';

// Get all meetings
export const getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find().sort({ date: 1 });
        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new meeting
export const createMeeting = async (req, res) => {
    try {
        const meeting = new Meeting(req.body);
        const newMeeting = await meeting.save();
        res.status(201).json(newMeeting);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get meeting by ID
export const getMeetingById = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.status(200).json(meeting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update meeting
export const updateMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.status(200).json(meeting);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete meeting
export const deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndDelete(req.params.id);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get upcoming meetings
export const getUpcomingMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.findUpcoming();
        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get past meetings
export const getPastMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.findPast();
        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get meetings by date range
export const getMeetingsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const meetings = await Meeting.findByDateRange(new Date(startDate), new Date(endDate));
        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};