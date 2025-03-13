import express from 'express';
import {
  getAllTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMembersByBrand,
  getTeamMembersByRole,
  toggleMemberStatus
} from '../../controllers/brand-manager/team.controllers.js';

const router = express.Router();

// Basic CRUD routes
router.get('/', getAllTeamMembers);
router.get('/:id', getTeamMember);
router.post('/', createTeamMember);
router.put('/:id', updateTeamMember);
router.delete('/:id', deleteTeamMember);

// Additional specialized routes
router.get('/brand/:brand', getTeamMembersByBrand);
router.get('/role/:role', getTeamMembersByRole);
router.patch('/:id/toggle-status', toggleMemberStatus);

export default router;