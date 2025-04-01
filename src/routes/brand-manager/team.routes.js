import express from 'express';
import {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleMemberStatus
} from '../../controllers/brand-manager/team.controllers.js';

const router = express.Router();

// Routes for /api/team
router.route('/')
  .get(getTeamMembers)
  .post(createTeamMember);

// Routes for /api/team/:id
router.route('/:id')
  .get(getTeamMember)
  .put(updateTeamMember)
  .delete(deleteTeamMember);

// Route for /api/team/:id/toggle-status
router.route('/:id/toggle-status')
  .patch(toggleMemberStatus);

export default router;