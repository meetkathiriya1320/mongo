import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    selection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Selection' }, // Optional, if inquiring about specific item
    name: { type: String }, // For non-logged in users or quick contact
    mobile: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
}, { timestamps: true });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;
