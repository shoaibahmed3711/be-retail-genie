import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  recordProductSale
} from '../../controllers/brand-owner/products.controllers.js';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Define upload directories for each file type
const uploadDirectories = {
  products: path.join(__dirname, '../../../uploads/products'),
  ingredientsLabel: path.join(__dirname, '../../../uploads/ingredientsLabel'),
  nutritionalLabel: path.join(__dirname, '../../../uploads/nutritionalLabel'),
  elevatorPitchFile: path.join(__dirname, '../../../uploads/elevatorPitchFile'),
  sellSheetFile: path.join(__dirname, '../../../uploads/sellSheetFile'),
  presentationFile: path.join(__dirname, '../../../uploads/presentationFile')
};

// Create each upload directory if it doesn't exist
Object.values(uploadDirectories).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination directory based on the field name
    let destination = uploadDirectories.products; // Default to products directory
    
    if (file.fieldname === 'ingredientsLabel') {
      destination = uploadDirectories.ingredientsLabel;
    } else if (file.fieldname === 'nutritionalLabel') {
      destination = uploadDirectories.nutritionalLabel;
    } else if (file.fieldname === 'elevatorPitchFile') {
      destination = uploadDirectories.elevatorPitchFile;
    } else if (file.fieldname === 'sellSheetFile') {
      destination = uploadDirectories.sellSheetFile;
    } else if (file.fieldname === 'presentationFile') {
      destination = uploadDirectories.presentationFile;
    }
    
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                           'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
  
  // Check file types based on field name
  if (file.fieldname === 'productImage' || file.fieldname === 'ingredientsLabel' || file.fieldname === 'nutritionalLabel') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for this field!'), false);
    }
  } else if (file.fieldname === 'elevatorPitchFile' || file.fieldname === 'sellSheetFile' || file.fieldname === 'presentationFile') {
    if ([...allowedImageTypes, ...allowedDocTypes].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image or document files are allowed for this field!'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Set up fields for multiple file uploads
const multipleUpload = upload.fields([
  { name: 'productImage', maxCount: 1 },
  { name: 'ingredientsLabel', maxCount: 1 },
  { name: 'nutritionalLabel', maxCount: 1 },
  { name: 'elevatorPitchFile', maxCount: 1 },
  { name: 'sellSheetFile', maxCount: 1 },
  { name: 'presentationFile', maxCount: 1 }
]);

// Error handler middleware for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    console.error('Upload error:', err);
    return res.status(400).json({ message: err.message });
  }
  next();
};

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', multipleUpload, handleMulterError, createProduct);
router.put('/:id', multipleUpload, handleMulterError, updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/record-sale', recordProductSale);

export default router;