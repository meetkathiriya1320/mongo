import mongoose from 'mongoose';

const selectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    up_color: { type: String, required: true },
    up_size: { type: String, required: true },
    dawn_color: { type: String, required: true },
    dawn_size: { type: String, required: true },
    SKU: { type: String, required: true, unique: true },
    photo: { type: String }, // URL or path to photo
    price: { type: Number, required: true },
    rent_count: { type: Number, default: 0 },
}, { timestamps: true });

const Selection = mongoose.model('Selection', selectionSchema);

export default Selection;