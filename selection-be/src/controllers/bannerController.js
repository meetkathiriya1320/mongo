import Banner from '../models/Banner.js';
import { RESPONSE } from '../helpers/response.js';

export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true });
        RESPONSE.success(res, 200, banners);
    } catch (error) {
        RESPONSE.error(res, 500, error.message);
    }
};

export const createBanner = async (req, res) => {
    try {
        const banner = new Banner(req.body);
        await banner.save();
        RESPONSE.success(res, 201, banner);
    } catch (error) {
        RESPONSE.error(res, 500, error.message);
    }
};

export const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!banner) return RESPONSE.error(res, 404, 'Banner not found');
        RESPONSE.success(res, 200, banner);
    } catch (error) {
        RESPONSE.error(res, 500, error.message);
    }
};

export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) return RESPONSE.error(res, 404, 'Banner not found');
        RESPONSE.success(res, 200, 'Banner deleted successfully');
    } catch (error) {
        RESPONSE.error(res, 500, error.message);
    }
};
