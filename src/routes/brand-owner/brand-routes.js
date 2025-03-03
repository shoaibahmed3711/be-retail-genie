const express = require('express');
const router = express.Router();
const { Brand, User } = require('../models/brandModel');
const auth = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// Get all brands for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const brands = await Brand.find({ 
      $or: [
        { owner: req.user.id },
        { collaborators: req.user.id }
      ]
    }).select('-changeHistory');
    
    res.json(brands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific brand by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    // Check if user has permission to view this brand
    if (brand.owner.toString() !== req.user.id && 
        !brand.collaborators.includes(req.user.id) && 
        !brand.visibilitySettings.isPublic) {
      return res.status(403).json({ message: 'Not authorized to view this brand' });
    }
    
    res.json(brand);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new brand
router.post('/', auth, async (req, res) => {
  try {
    const { name, tagline, mission, email, phone, website, address } = req.body;
    
    // Create new brand instance
    const newBrand = new Brand({
      name,
      tagline,
      mission,
      email,
      phone,
      website,
      address,
      owner: req.user.id
    });
    
    // Add initial change to history
    newBrand.addToHistory('Brand created', req.user.id);
    
    // Save the brand
    await newBrand.save();
    
    res.status(201).json(newBrand);
  } catch (err) {
    console.error(err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a brand
router.put('/:id', auth, async (req, res) => {
  try {
    let brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    // Check if user has permission to edit this brand
    if (brand.owner.toString() !== req.user.id && 
        !brand.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this brand' });
    }
    
    // Fields that can be updated
    const updateFields = [
      'name', 'tagline', 'mission', 'email', 'phone', 'website', 'address',
      'theme', 'visibilitySettings', 'languages', 'categories', 'keywords'
    ];
    
    // Track which fields were updated
    const updatedFieldNames = [];
    
    // Update each provided field
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        brand[field] = req.body[field];
        updatedFieldNames.push(field);
      }
    });
    
    // Handle special cases like nested objects
    if (req.body.socialLinks) {
      brand.socialLinks = { ...brand.socialLinks, ...req.body.socialLinks };
      updatedFieldNames.push('socialLinks');
    }
    
    if (req.body.businessHours) {
      Object.keys(req.body.businessHours).forEach(day => {
        brand.businessHours[day] = {
          ...brand.businessHours[day],
          ...req.body.businessHours[day]
        };
      });
      updatedFieldNames.push('businessHours');
    }
    
    // Add to change history if fields were updated
    if (updatedFieldNames.length > 0) {
      brand.addToHistory(
        `Updated fields: ${updatedFieldNames.join(', ')}`,
        req.user.id
      );
    }
    
    await brand.save();
    
    res.json(brand);
  } catch (err) {
    console.error(err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload logo
router.post('/:id/logo', [auth, upload.single('logo')], async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    if (brand.owner.toString() !== req.user.id && 
        !brand.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // If there was a previous logo, we could delete it here
    // if (brand.logo) {
    //   const oldLogoPath = path.join(__dirname, '../', brand.logo);
    //   if (fs.existsSync(oldLogoPath)) {
    //     fs.unlinkSync(oldLogoPath);
    //   }
    // }
    
    // Update with new file path
    brand.logo = `/uploads/${req.file.filename}`;
    brand.addToHistory('Logo updated', req.user.id);
    
    await brand.save();
    
    res.json({ success: true, logo: brand.logo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add gallery images
router.post('/:id/gallery', [auth, upload.array('galleryImages', 6)], async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    if (brand.owner.toString() !== req.user.id && 
        !brand.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Get existing image count
    const currentCount = brand.galleryImages.length;
    
    // Make sure we don't exceed 6 images
    const filesToAdd = req.files.slice(0, 6 - currentCount);
    
    // Add new images to the gallery
    filesToAdd.forEach(file => {
      brand.galleryImages.push(`/uploads/${file.filename}`);
    });
    
    brand.addToHistory('Gallery images added', req.user.id);
    
    await brand.save();
    
    res.json({ success: true, galleryImages: brand.galleryImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a gallery image
router.delete('/:id/gallery/:imageIndex', auth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    if (brand.owner.toString() !== req.user.id && 
        !brand.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const imageIndex = parseInt(req.params.imageIndex);
    
    if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= brand.galleryImages.length) {
      return res.status(400).json({ message: 'Invalid image index' });
    }
    
    // Could delete file here
    // const imagePath = path.join(__dirname, '../', brand.galleryImages[imageIndex]);
    // if (fs.existsSync(imagePath)) {
    //   fs.unlinkSync(imagePath);
    // }
    
    // Remove from array
    brand.galleryImages.splice(imageIndex, 1);
    brand.addToHistory('Gallery image removed', req.user.id);
    
    await brand.save();
    
    res.json({ success: true, galleryImages: brand.galleryImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a team member
router.post('/:id/team', auth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    if (brand.owner.toString() !== req.user.id && 
        !brand.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { name, role } = req.body;
    
    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' });
    }
    
    // Add to team members
    brand.teamMembers.push({
      name,
      role,
      order: brand.teamMembers.length  // Default order based on position
    });
    
    brand.addToHistory('Team member added', req.user.id);
    
    await brand.save();
    
    res.status(201).json(brand.teamMembers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a team member
router.delete('/:id/team/:memberId', auth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    if (brand.owner.toString() !== req.user.id && 
        !brand.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Find team member index
    const memberIndex = brand.teamMembers.findIndex(
      member => member._id.toString() === req.params.memberId
    );
    
    if (memberIndex === -1) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    // Remove member
    brand.teamMembers.splice(memberIndex, 1);
    brand.addToHistory('Team member removed', req.user.id);
    
    await brand.save();
    
    res.json(brand.teamMembers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export settings
router.get('/:id/export', auth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    if (brand.owner.toString() !== req.user.id && 
        !brand.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const format = req.query.format || 'json';
    
    if (format === 'json') {
      // Send JSON data
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=brand-settings-${brand._id}.json`);
      return res.json(brand);
    } else if (format === 'csv') {
      // Generate CSV (simplified example)
      const headers = ['Field,Value'];
      const rows = [];
      
      // Flatten basic fields
      ['name', 'tagline', 'mission', 'email', 'phone', 'website', 'address'].forEach(field => {
        rows.push(`${field},${brand[field] || ''}`);
      });
      
      // Add theme
      rows.push(`theme,${brand.theme}`);
      
      // Languages
      rows.push(`languages,${brand.languages.join(';')}`);
      
      // Categories and keywords
      rows.push(`categories,${brand.categories.join(';')}`);
      rows.push(`keywords,${brand.keywords.join(';')}`);
      
      const csv = [...headers, ...rows].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=brand-settings-${brand._id}.csv`);
      return res.send(csv);
    } else {
      return res.status(400).json({ message: 'Unsupported export format' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get brand analytics
router.get('/:id/analytics', auth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    if (brand.owner.toString() !== req.user.id && 
        !brand.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Fetch analytics data from the virtual
    const analytics = brand.analytics;
    
    // Add some extended analytics data for demonstration
    analytics.changeHistory = {
      today: brand.changeHistory.filter(
        entry => new Date(entry.timestamp).toDateString() === new Date().toDateString()
      ).length,
      week: brand.changeHistory.filter(
        entry => new Date(entry.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      month: brand.changeHistory.filter(
        entry => new Date(entry.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length
    };
    
    res.json(analytics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a brand
router.delete('/:id', auth, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    // Only the owner can delete a brand
    if (brand.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this brand' });
    }
    
    // Could delete associated files here
    
    await Brand.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;