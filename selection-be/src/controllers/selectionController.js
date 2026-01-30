import Selection from '../models/Selection.js';
import { RESPONSE } from '../helpers/response.js';
import { get_message } from '../helpers/messages.js';

export const getSelections = async (req, res) => {
    try {
        const query = req.query; // Simple filtering by query params e.g. ?category=Wedding
        const selections = await Selection.find(query);
        RESPONSE.success(res, 2001, selections);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const getSelection = async (req, res) => {
    try {
        const selection = await Selection.findById(req.params.id);
        if (!selection) return RESPONSE.error(res, 2002, 404);
        RESPONSE.success(res, null, selection);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const createSelection = async (req, res) => {
    const selection = new Selection(req.body);
    try {
        const newSelection = await selection.save();
        RESPONSE.success(res, 2003, newSelection, 201);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const updateSelection = async (req, res) => {
    try {
        const selection = await Selection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!selection) return RESPONSE.error(res, 2002, 404);
        RESPONSE.success(res, 2004, selection);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const deleteSelection = async (req, res) => {
    try {
        const selection = await Selection.findByIdAndDelete(req.params.id);
        if (!selection) return RESPONSE.error(res, 2002, 404);
        RESPONSE.success(res, 2005);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};