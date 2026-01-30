import express from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// GET all users
router.get('/users', getUsers);

// POST create user
router.post('/users', createUser);

// GET single user
router.get('/users/:id', getUser);

// PUT update user
router.put('/users/:id', updateUser);

// DELETE user
router.delete('/users/:id', deleteUser);

export default router;