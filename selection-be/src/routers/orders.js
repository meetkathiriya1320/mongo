import express from 'express';
import { createOrder, getAllOrders, getOrderDetails } from '../controllers/orderController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, authorizeAdmin, getAllOrders);
router.get('/:id', authenticate, authorizeAdmin, getOrderDetails);

export default router;
