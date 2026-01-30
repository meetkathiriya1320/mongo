import express from 'express';
import { getSelectionOrders, createSelectionOrder } from '../controllers/selectionOrderController.js';

const router = express.Router();

// GET all selection orders
router.get('/', getSelectionOrders);

// POST create selection order
router.post('/', createSelectionOrder);

export default router;