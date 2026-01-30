import Inquiry from '../models/Inquiry.js';
import { RESPONSE } from '../helpers/response.js';

export const createInquiry = async (req, res) => {
    try {
        const inquiry = new Inquiry({
            ...req.body,
            user_id: req.user ? req.user._id : undefined
        });
        await inquiry.save();
        RESPONSE.success(res, 201, inquiry);
    } catch (error) {
        RESPONSE.error(res, 500, error.message);
    }
};

export const getInquiries = async (req, res) => {
    try {
        // Admin gets all, User gets theirs? Usually inquiry list is Admin only.
        const inquiries = await Inquiry.find().populate('selection_id', 'name SKU');
        RESPONSE.success(res, 200, inquiries);
    } catch (error) {
        RESPONSE.error(res, 500, error.message);
    }
};

export const getMyInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ user_id: req.user._id }).populate('selection_id', 'name SKU');
        RESPONSE.success(res, 200, inquiries);
    } catch (error) {
        RESPONSE.error(res, 500, error.message);
    }
};
