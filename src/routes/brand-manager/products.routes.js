import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  recordProductSale
} from '../../controllers/brand-manager/products.controllers.js';

const router = express.Router();

// Base route: /api/products
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/record-sale', recordProductSale);

export default router;
