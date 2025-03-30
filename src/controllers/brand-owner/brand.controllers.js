import Brand from '../../models/brand-owner/brand.models.js';
// Import fs and path for file handling if we're saving files to disk
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all brands
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single brand
const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create brand
const createBrand = async (req, res) => {
  try {
    // Handle file upload if present in the request
    if (req.file) {
      req.body.logo = req.file.path || req.file.location; // path for local storage, location for S3
    }

    // Use a default owner if not provided
    if (!req.body.owner) {
      req.body.owner = 'temp-owner-123';
    }

    // Handle JSON-stringified objects from form data
    ['socialLinks', 'visibilitySettings', 'businessHours'].forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
        }
      }
    });

    const brand = new Brand(req.body);
    
    // Add to history
    if (typeof brand.addToHistory === 'function') {
      brand.addToHistory('Brand created', req.body.owner || 'system');
    }
    
    const newBrand = await brand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update brand
const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    // Handle file upload if present in the request
    if (req.file) {
      // If there's an existing logo and it's stored locally, delete it
      if (brand.logo && brand.logo.startsWith('/uploads/')) {
        const oldLogoPath = path.join(__dirname, '../..', brand.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      
      req.body.logo = req.file.path || req.file.location; // path for local storage, location for S3
    }
    
    // Handle JSON-stringified objects from form data
    ['socialLinks', 'visibilitySettings', 'businessHours'].forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
        }
      }
    });

    // Update brand fields
    Object.assign(brand, req.body);
    
    // Add to history
    if (typeof brand.addToHistory === 'function') {
      brand.addToHistory('Brand updated', brand.owner || 'system');
    }
    
    const updatedBrand = await brand.save();
    res.status(200).json(updatedBrand);
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete brand
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    await brand.deleteOne();
    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle brand status
const toggleBrandStatus = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    // Toggle between active and inactive
    brand.status = brand.status === 'active' ? 'inactive' : 'active';
    // Also toggle visibility for consistency
    brand.visibilitySettings.isPublic = brand.status === 'active';
    
    await brand.save();
    
    // Add to history
    if (typeof brand.addToHistory === 'function') {
      brand.addToHistory(`Status changed to ${brand.status}`, brand.owner || 'system');
    }
    
    res.status(200).json(brand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get brands by category
const getBrandsByCategory = async (req, res) => {
  try {
    const brands = await Brand.find({ 
      categories: { $elemMatch: { $eq: req.params.category } }
    });
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload brand logo
const uploadBrandLogo = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // If there's an existing logo and it's stored locally, delete it
    if (brand.logo && brand.logo.startsWith('/uploads/')) {
      const oldLogoPath = path.join(__dirname, '../..', brand.logo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }
    
    // Update logo with the new file path
    brand.logo = req.file.path || req.file.location; // path for local storage, location for S3
    
    // Add to history
    if (typeof brand.addToHistory === 'function') {
      brand.addToHistory('Logo updated', brand.owner || 'system');
    }
    
    await brand.save();
    
    res.status(200).json({ 
      message: 'Logo uploaded successfully', 
      logo: brand.logo 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get brand by owner
const getBrandByOwner = async (req, res) => {
  try {
    // Use the provided owner ID or the temp owner for development
    const ownerId = req.params.ownerId || 'temp-owner-123';
    
    // Add basic response caching header
    res.set('Cache-Control', 'private, max-age=300'); // Cache for 5 minutes
    
    // Find brand by owner ID (now a string, not ObjectId)
    const brand = await Brand.findOne({ owner: ownerId });
    
    if (!brand) {
      return res.status(404).json({ message: 'No brand found for this owner' });
    }
    
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  toggleBrandStatus,
  getBrandsByCategory,
  uploadBrandLogo,
  getBrandByOwner
};
