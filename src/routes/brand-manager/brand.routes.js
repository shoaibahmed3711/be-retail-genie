import express from "express";
import { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand, toggleBrandStatus, getBrandsByCategory} from '../../controllers/brand-manager/brand.controllers.js';

const router = express.Router();
// Get all brands
router.get('/', getAllBrands);

// Get brands by category
router.get('/category/:category', getBrandsByCategory);

// Get single brand
router.get('/:id', getBrandById);

// Create new brand
router.post('/', createBrand);

// Update brand
router.put('/:id', updateBrand);

// Delete brand
router.delete('/:id', deleteBrand);

// Toggle brand status
router.patch('/:id/toggle-status', toggleBrandStatus);

module.exports = router;