import express from 'express';
import {
  addFavourite,
  getFavourites,
  getFavouriteById,
  updateFavourite,
  deleteFavourite,
  getFavouritesByType,
  getFavouritesByCategory
} from '../../controllers/buyer/favourites.controllers.js';
import { authMiddleware } from '../../middleware/auth.js'; // Assuming you have auth middleware

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Base routes
router.post('/', addFavourite);
router.get('/', getFavourites);
router.get('/:id', getFavouriteById);
router.put('/:id', updateFavourite);
router.delete('/:id', deleteFavourite);

// Additional routes for filtering
router.get('/type/:type', getFavouritesByType);
router.get('/category/:category', getFavouritesByCategory);

export default router;