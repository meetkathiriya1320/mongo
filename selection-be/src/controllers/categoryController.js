import Category from '../models/Category.js';
import { RESPONSE } from '../helpers/response.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true });
        RESPONSE.success(res, 200, categories);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        const newCategory = await category.save();
        RESPONSE.success(res, 201, newCategory);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        RESPONSE.success(res, 200);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return RESPONSE.error(res, 9999, 404);
        RESPONSE.success(res, 200, category);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};
