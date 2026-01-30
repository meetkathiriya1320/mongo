import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { RESPONSE } from '../helpers/response.js';
import { AUTH_MESSAGES } from '../helpers/messages.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return RESPONSE.error(res, AUTH_MESSAGES.USER_EXISTS, 400);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        // Create token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });

        RESPONSE.success(res, AUTH_MESSAGES.REGISTRATION_SUCCESS, {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        }, 201);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return RESPONSE.error(res, AUTH_MESSAGES.INVALID_CREDENTIALS, 400);
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return RESPONSE.error(res, AUTH_MESSAGES.INVALID_CREDENTIALS, 400);
        }

        // Create token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });

        RESPONSE.success(res, AUTH_MESSAGES.LOGIN_SUCCESS, {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};