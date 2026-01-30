import SelectionOrder from '../models/SelectionOrder.js';
import { RESPONSE } from '../helpers/response.js';
import { get_message } from '../helpers/messages.js';

export const getSelectionOrders = async (req, res) => {
    try {
        const orders = await SelectionOrder.find();
        RESPONSE.success(res, 2101, orders);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const createSelectionOrder = async (req, res) => {
    const order = new SelectionOrder(req.body);
    try {
        const newOrder = await order.save();
        RESPONSE.success(res, 2102, newOrder, 201);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};