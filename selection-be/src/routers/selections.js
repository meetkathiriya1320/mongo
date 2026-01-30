import express from 'express';
import { getSelections, getSelection, createSelection, updateSelection, deleteSelection } from '../controllers/selectionController.js';

const router = express.Router();

// GET all selections
router.get('/', getSelections);

// POST create selection
router.post('/', createSelection);

// GET single selection
router.get('/:id', getSelection);

// PUT update selection
router.put('/:id', updateSelection);

// DELETE selection
router.delete('/:id', deleteSelection);

export default router;