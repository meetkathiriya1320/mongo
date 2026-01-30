import User from '../models/User.js';
import { RESPONSE } from '../helpers/response.js';
import { USER_MESSAGES } from '../helpers/messages.js';

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        RESPONSE.success(res, USER_MESSAGES.USERS_FETCHED, users);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return RESPONSE.error(res, USER_MESSAGES.USER_NOT_FOUND, 404);
        RESPONSE.success(res, null, user);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const createUser = async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    try {
        const newUser = await user.save();
        RESPONSE.success(res, USER_MESSAGES.USER_CREATED, newUser, 201);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return RESPONSE.error(res, USER_MESSAGES.USER_NOT_FOUND, 404);
        RESPONSE.success(res, USER_MESSAGES.USER_UPDATED, user);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return RESPONSE.error(res, USER_MESSAGES.USER_NOT_FOUND, 404);
        RESPONSE.success(res, USER_MESSAGES.USER_DELETED);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};