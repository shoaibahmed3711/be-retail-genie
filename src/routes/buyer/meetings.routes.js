import express from 'express';
import {
    getAllMeetings,
    createMeeting,
    getMeetingById,
    updateMeeting,
    deleteMeeting,
    getUpcomingMeetings,
    getPastMeetings,
    getMeetingsByDateRange
} from '../../controllers/buyer/meetings.controllers.js';

const router = express.Router();

// Basic CRUD routes
router.get('/', getAllMeetings);
router.post('/', createMeeting);
router.get('/:id', getMeetingById);
router.put('/:id', updateMeeting);
router.delete('/:id', deleteMeeting);

// Additional specialized routes
router.get('/filter/upcoming', getUpcomingMeetings);
router.get('/filter/past', getPastMeetings);
router.get('/filter/date-range', getMeetingsByDateRange);

export default router;