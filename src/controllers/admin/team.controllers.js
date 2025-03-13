import TeamMember from '../../models/admin/team.models.js';

// Create a new team member
const createTeamMember = async (req, res) => {
  try {
    const teamMember = new TeamMember(req.body);
    await teamMember.save();
    res.status(201).json({ success: true, data: teamMember });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all team members
const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();
    res.status(200).json({ success: true, data: teamMembers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get team member by ID
const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ success: false, error: 'Team member not found' });
    }
    res.status(200).json({ success: true, data: teamMember });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update team member
const updateTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!teamMember) {
      return res.status(404).json({ success: false, error: 'Team member not found' });
    }
    res.status(200).json({ success: true, data: teamMember });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete team member
const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ success: false, error: 'Team member not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get active team members
const getActiveTeamMembers = async (req, res) => {
  try {
    const activeMembers = await TeamMember.findActive();
    res.status(200).json({ success: true, data: activeMembers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get team members by brand
const getTeamMembersByBrand = async (req, res) => {
  try {
    const members = await TeamMember.findByBrand(req.params.brand);
    res.status(200).json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Toggle team member status
const toggleTeamMemberStatus = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ success: false, error: 'Team member not found' });
    }
    await teamMember.toggleStatus();
    res.status(200).json({ success: true, data: teamMember });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  getActiveTeamMembers,
  getTeamMembersByBrand,
  toggleTeamMemberStatus
};
