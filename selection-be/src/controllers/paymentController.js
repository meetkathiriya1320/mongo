import Payment from '../models/Payment.js';
import { RESPONSE } from '../helpers/response.js';

export const recordPayment = async (req, res) => {
    try {
        const payment = new Payment({
            ...req.body,
            user_id: req.user._id
        });
        await payment.save();
        RESPONSE.success(res, 201, payment);
    } catch (error) {
        RESPONSE.error(res, 500, error.message);
    }
};

export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('user_id', 'name email').populate('order_id');
        RESPONSE.success(res, 200, payments);
    } catch (error) {
        RESPONSE.error(res, 500, error.message);
    }
};

export const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user_id: req.user._id }).populate('order_id');
        RESPONSE.success(res, 200, payments);
    } catch (error) {
        RESPONSE.error(res, 500, error.message);
    }
};
