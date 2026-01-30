import SelectionDetails from '../models/SelectionDetails.js';
import { RESPONSE } from '../helpers/response.js';
import { get_message } from '../helpers/messages.js';

export const getSelectionDetails = async (req, res) => {
    try {
        const details = await SelectionDetails.find();
        RESPONSE.success(res, 2201, details);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const createSelectionDetails = async (req, res) => {
    const details = new SelectionDetails(req.body);
    try {
        const newDetails = await details.save();
        RESPONSE.success(res, 2202, newDetails, 201);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};