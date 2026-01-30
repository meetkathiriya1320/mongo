import express from 'express';
import { createInquiry, getInquiries, getMyInquiries } from '../controllers/inquiryController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createInquiry); // Public (or authenticated)
router.get('/', authenticate, authorizeAdmin, getInquiries);
router.get('/my', authenticate, getMyInquiries);

export default router;
