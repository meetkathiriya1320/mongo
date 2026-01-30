import mongoose from 'mongoose';

const selectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String }, // Optional category field
    topSizes: [{ type: String }],
    bottomSizes: [{ type: String }],
    colors: [{ type: String }],
    up_color: { type: String },
    up_size: { type: String },
    dawn_color: { type: String },
    dawn_size: { type: String },
    SKU: { type: String, required: true, unique: true },
    photos: [{ type: String }],
    photo: { type: String }, // Deprecated, kept for backward compatibility until migration
    price: { type: Number, required: true },
    rent_count: { type: Number, default: 0 },
}, { timestamps: true });

const Selection = mongoose.model('Selection', selectionSchema);

export default Selection;