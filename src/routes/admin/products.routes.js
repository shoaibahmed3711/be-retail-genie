import express from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, recordProductSale, getProductsByCategory, getProductsByStatus, searchProducts} from '../../controllers/admin/products.controllers';

// Base route: /api/admin/products
const router = express.Router();

// Get all products and create a new product
router
  .route('/')
  .get(getAllProducts)
  .post(createProduct);

// Search products
router.get('/search', searchProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Get products by status
router.get('/status/:status', getProductsByStatus);

// Get, update, and delete a specific product
router
  .route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

// Record a sale for a product
router.post('/:id/record-sale', recordProductSale);

module.exports = router;
