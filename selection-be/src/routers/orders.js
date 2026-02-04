import express from 'express';
import { createOrder, getAllOrders, getOrderDetails, getUserOrders } from '../controllers/orderController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
// User route must come before :id route to avoid conflict
router.get('/my', authenticate, getUserOrders);
router.get('/', authenticate, authorizeAdmin, getAllOrders);
router.get('/:id', authenticate, getOrderDetails);

export default router;
