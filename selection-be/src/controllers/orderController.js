import Order from '../models/Order.js';
import SelectionOrder from '../models/SelectionOrder.js';
import { RESPONSE } from '../helpers/response.js';

export const createOrder = async (req, res) => {
    try {
        const { items, user_id } = req.body;
        // If admin provides user_id, use it. Otherwise use logged in user.
        let targetUserId = req.user._id;
        if (req.user.role === 'admin' && user_id) {
            targetUserId = user_id;
        }

        if (!items || items.length === 0) {
            return RESPONSE.error(res, 400, "No items in order");
        }

        // Calculate totals
        const total_amount = items.reduce((sum, item) => sum + item.pay, 0);
        const total_deposit = items.reduce((sum, item) => sum + item.deposit, 0);

        // 1. Create Main Order
        const mainOrder = new Order({
            user_id: targetUserId,
            total_amount,
            total_deposit,
            status: 'pending',
            items_count: items.length
        });
        await mainOrder.save();

        // 2. Create SelectionOrders linked to Main Order
        const selectionOrders = items.map(item => ({
            ...item,
            user_id: targetUserId,
            order_id: mainOrder._id,
            status: 'pending'
        }));

        await SelectionOrder.insertMany(selectionOrders);

        RESPONSE.success(res, 201, mainOrder);
    } catch (error) {
        console.error(error);
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user_id', 'name email')
            .sort({ createdAt: -1 });
        RESPONSE.success(res, 200, orders);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('user_id', 'name email');
        if (!order) return RESPONSE.error(res, 404, "Order not found");

        const items = await SelectionOrder.find({ order_id: id }).populate('selection_id');

        RESPONSE.success(res, 200, { order, items });
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};
