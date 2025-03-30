import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand, toggleBrandStatus, getBrandsByCategory, uploadBrandLogo, getBrandByOwner } from '../../controllers/brand-owner/brand.controllers.js';
import fs from 'fs';
// Import removed for now
// import { isAuthenticated } from "../../middleware/auth.middleware.js";

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads/brands');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all brands
router.get('/', getAllBrands);

// Get brands by category
router.get('/category/:category', getBrandsByCategory);

// Get brand by owner (using the owner ID as a parameter)
router.get('/owner/:ownerId?', getBrandByOwner);

// Get single brand
router.get('/:id', getBrandById);

// Create new brand
router.post('/', upload.single('logo'), createBrand);

// Update brand
router.put('/:id', upload.single('logo'), updateBrand);

// Upload brand logo
router.post('/:id/logo', upload.single('logo'), uploadBrandLogo);

// Delete brand
router.delete('/:id', deleteBrand);

// Toggle brand status
router.patch('/:id/toggle-status', toggleBrandStatus);

export default router;