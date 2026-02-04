import express from 'express';
import { getSelectionOrders, createSelectionOrder, updateStatus } from '../controllers/selectionOrderController.js';

const router = express.Router();

// GET all selection orders
router.get('/', getSelectionOrders);

// POST create selection order
router.post('/', createSelectionOrder);

// PUT update status
router.put('/:id/status', updateStatus);

export default router;