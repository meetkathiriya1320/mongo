import express from 'express';
import { getSelectionDetails, createSelectionDetails } from '../controllers/selectionDetailsController.js';

const router = express.Router();

// GET all selection details
router.get('/', getSelectionDetails);

// POST create selection details
router.post('/', createSelectionDetails);

export default router;