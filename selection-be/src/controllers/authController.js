import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { RESPONSE } from '../helpers/response.js';
import { AUTH_MESSAGES } from '../helpers/messages.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

import { generateOTP, sendOTPEmail } from '../helpers/emailService.js';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user && user.isVerified) {
            return RESPONSE.error(res, AUTH_MESSAGES.USER_EXISTS, 400);
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        if (user && !user.isVerified) {
            // Resend OTP to unverified user
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            user.name = name;
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        } else {
            // New user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpires,
                isVerified: false
            });
            await user.save();
        }

        // Send OTP Email
        await sendOTPEmail(email, otp);

        RESPONSE.success(res, "OTP sent to your email. Please verify to complete registration.", { email }, 200);

    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return RESPONSE.error(res, "User not found", 400);
        }

        if (user.isVerified) {
            return RESPONSE.error(res, "User already verified", 400);
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return RESPONSE.error(res, "Invalid or expired OTP", 400);
        }

        // Verify user
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Create token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });

        RESPONSE.success(res, AUTH_MESSAGES.REGISTRATION_SUCCESS, {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }, 200);
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
                role: user.role,
            },
        });
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};