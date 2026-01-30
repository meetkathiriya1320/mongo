import express from 'express';
import { recordPayment, getAllPayments, getMyPayments } from '../controllers/paymentController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, recordPayment);
router.get('/', authenticate, authorizeAdmin, getAllPayments);
router.get('/my', authenticate, getMyPayments);

export default router;
