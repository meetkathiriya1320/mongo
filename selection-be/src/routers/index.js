import express from 'express';
import auth from './auth.js';
import users from './users.js';
import selections from './selections.js';
import bookings from './bookings.js';
import banners from './banners.js';
import inquiries from './inquiries.js';
import payments from './payments.js';
import orders from './orders.js';
import selectionOrders from './selectionOrders.js';

import uploadRouter from './upload.js';
import categoryRouter from './categories.js';

const router = express.Router();

router.use('/upload', uploadRouter);
router.use('/category', categoryRouter);

router.use('/auth', auth);
router.use('/user', users);
router.use('/selection', selections);
router.use('/booking', bookings);
router.use('/banner', banners);
router.use('/inquiry', inquiries);
router.use('/payment', payments);
router.use('/order', orders); // New Main Order API
router.use('/selection-order', selectionOrders);

export default router;