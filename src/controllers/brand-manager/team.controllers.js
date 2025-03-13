import TeamMember from '../../models/brand-manager/team.models.js';

// Get all team members
export const getAllTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single team member
export const getTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new team member
export const createTeamMember = async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update team member
export const updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    Object.assign(member, req.body);
    const updatedMember = await member.save();
    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete team member
export const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    await member.deleteOne();
    res.status(200).json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get team members by brand
export const getTeamMembersByBrand = async (req, res) => {
  try {
    const members = await TeamMember.findByBrand(req.params.brand);
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get team members by role
export const getTeamMembersByRole = async (req, res) => {
  try {
    const members = await TeamMember.findByRole(req.params.role);
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle team member status
export const toggleMemberStatus = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    await member.toggleStatus();
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};