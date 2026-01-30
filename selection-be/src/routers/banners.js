import express from 'express';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBanners);
router.post('/', authenticate, authorizeAdmin, createBanner);
router.put('/:id', authenticate, authorizeAdmin, updateBanner);
router.delete('/:id', authenticate, authorizeAdmin, deleteBanner);

export default router;
