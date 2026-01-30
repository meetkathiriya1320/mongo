import express from 'express';
import auth from './auth.js'
import users from './users.js'

const router = express.Router();

router.use('auth', auth)
router.use('user', users)






export default router;