import express from 'express';
import upload from '../middlewares/upload.js';
import { RESPONSE } from '../helpers/response.js';

const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return RESPONSE.error(res, 9999, 400, new Error('No file uploaded'));
        }

        // Return relative path suitable for frontend
        // Assuming server is hosting public folder at root or /uploads
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        RESPONSE.success(res, 200, { url: fileUrl });
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
});

export default router;
