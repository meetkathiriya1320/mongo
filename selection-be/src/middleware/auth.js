import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { RESPONSE } from '../helpers/response.js';
import { AUTH_MESSAGES } from '../helpers/messages.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return RESPONSE.error(res, AUTH_MESSAGES.NO_TOKEN, 401);
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return RESPONSE.error(res, AUTH_MESSAGES.INVALID_TOKEN, 401);
        }

        req.user = user;
        next();
    } catch (error) {
        RESPONSE.error(res, AUTH_MESSAGES.INVALID_TOKEN, 401);
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        RESPONSE.error(res, 4003, 403, 'Access denied. Admin rights required.');
    }
};