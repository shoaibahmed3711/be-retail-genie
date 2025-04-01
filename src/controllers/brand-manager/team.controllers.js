import TeamMember from '../../models/brand-manager/team.models.js';

// @desc    Get all team members
// @route   GET /api/team
// @access  Private
export const getTeamMembers = async (req, res) => {
  try {
    // You might want to add filtering options based on req.query
    const teamMembers = await TeamMember.find().sort({ joinDate: -1 });
    res.status(200).json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Private
export const getTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    res.status(200).json(teamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new team member
// @route   POST /api/team
// @access  Private
export const createTeamMember = async (req, res) => {
  try {
    const { name, email, phone, role, status, assignedBrands } = req.body;
    
    // Check if email already exists
    const emailExists = await TeamMember.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Handle avatar properly - ensure it's a string or null
    let avatarValue = null;
    if (req.body.avatar) {
      // If it's an object but not a string URL, set to null
      // In a real app, you'd upload the file to storage and set the URL
      avatarValue = typeof req.body.avatar === 'string' ? req.body.avatar : null;
    }
    
    // Create team member
    const teamMember = await TeamMember.create({
      name,
      email,
      phone: phone || '',
      role,
      status,
      assignedBrands: assignedBrands || [],
      avatar: avatarValue
    });
    
    if (teamMember) {
      res.status(201).json(teamMember);
    } else {
      res.status(400).json({ message: 'Invalid team member data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private
export const updateTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    // If updating email, check if new email already exists (unless it's the same member)
    if (req.body.email && req.body.email !== teamMember.email) {
      const emailExists = await TeamMember.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Handle avatar properly - ensure it's a string or null
    if (req.body.avatar && typeof req.body.avatar !== 'string') {
      // If it's an object but not a string URL, keep existing avatar or set to null
      // In a real app, you'd upload the file to storage and set the URL
      req.body.avatar = teamMember.avatar || null;
    }
    
    // Protect owner status
    if (teamMember.isOwner) {
      // Don't allow changing status or isOwner flag for owner
      req.body.status = 'active';
      req.body.isOwner = true;
    }
    
    const updatedTeamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedTeamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private
export const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    // Prevent deleting owner
    if (teamMember.isOwner) {
      return res.status(400).json({ message: 'Cannot delete owner account' });
    }
    
    await teamMember.deleteOne();
    
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle team member status
// @route   PATCH /api/team/:id/toggle-status
// @access  Private
export const toggleMemberStatus = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    // Prevent changing owner status
    if (teamMember.isOwner) {
      return res.status(400).json({ message: 'Cannot change owner status' });
    }
    
    // Toggle status
    const newStatus = teamMember.status === 'active' ? 'inactive' : 'active';
    
    const updatedTeamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { status: newStatus },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedTeamMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
