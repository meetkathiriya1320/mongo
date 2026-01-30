import express from 'express';
import { createSelectionOrder, getSelectionOrders, getMyOrders, cancelOrder, updateStatus } from '../controllers/selectionOrderController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createSelectionOrder);
router.get('/', authenticate, authorizeAdmin, getSelectionOrders); // Admin sees all
router.put('/:id/status', authenticate, authorizeAdmin, updateStatus); // Admin updates status
router.get('/my', authenticate, getMyOrders); // User sees theirs
router.post('/cancel/:id', authenticate, cancelOrder); // User cancels theirs

export default router;
