import SelectionOrder from '../models/SelectionOrder.js';
import SelectionDetails from '../models/SelectionDetails.js';
import { RESPONSE } from '../helpers/response.js';
import { get_message } from '../helpers/messages.js';

export const getSelectionOrders = async (req, res) => {
    try {
        const orders = await SelectionOrder.find().populate('user_id', 'name email').populate('selection_id');
        RESPONSE.success(res, 2101, orders);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await SelectionOrder.find({ user_id: req.user._id }).populate('selection_id');
        RESPONSE.success(res, 2101, orders);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const createSelectionOrder = async (req, res) => {
    const order = new SelectionOrder({
        ...req.body,
        user_id: req.user._id
    });
    try {
        const newOrder = await order.save();
        RESPONSE.success(res, 2102, newOrder, 201);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const cancelOrder = async (req, res) => {
    try {
        let order;
        if (req.user && req.user.role === 'admin') {
            order = await SelectionOrder.findById(req.params.id);
        } else {
            order = await SelectionOrder.findOne({ _id: req.params.id, user_id: req.user._id });
        }

        if (!order) return RESPONSE.error(res, 404, 'Order not found or unauthorized');

        if (order.status !== 'pending' && (!req.user || req.user.role !== 'admin')) {
            return RESPONSE.error(res, 400, 'Cannot cancel order that is not pending');
        }

        order.status = 'cancelled';
        await order.save();
        RESPONSE.success(res, 200, order);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const checkAvailability = async (req, res) => {
    try {
        const { id } = req.params; // selection_id
        const orders = await SelectionOrder.find({
            selection_id: id,
            status: { $in: ['pending', 'confirmed', 'delivered', 'received'] }
        });

        const orderIds = orders.map(o => o._id);
        const details = await SelectionDetails.find({ selection_order_id: { $in: orderIds } });

        const bookedDates = details.map(d => ({
            from: d.deliver_date,
            to: d.receive_date
        }));

        RESPONSE.success(res, 200, bookedDates);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'delivered', 'received', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return RESPONSE.error(res, 400, "Invalid status");
        }

        const order = await SelectionOrder.findById(req.params.id);
        if (!order) {
            return RESPONSE.error(res, 404, "Order not found");
        }

        order.status = status;
        await order.save();
        RESPONSE.success(res, 200, order);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};