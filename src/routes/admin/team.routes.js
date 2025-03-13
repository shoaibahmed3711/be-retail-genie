import express from 'express';
const router = express.Router();
import { 
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  getActiveTeamMembers,
  getTeamMembersByBrand,
  toggleTeamMemberStatus
} from '../../controllers/admin/team.controllers';

// Base route: /api/admin/team

// Create and Get all team members
router.route('/')
  .post(createTeamMember)
  .get(getAllTeamMembers);

// Get active team members
router.get('/active', getActiveTeamMembers);

// Get team members by brand
router.get('/brand/:brand', getTeamMembersByBrand);

// Toggle team member status
router.patch('/:id/toggle-status', toggleTeamMemberStatus);

// Get, Update and Delete team member by ID
router.route('/:id')
  .get(getTeamMemberById)
  .put(updateTeamMember)
  .delete(deleteTeamMember);

module.exports = router;