import mongoose from 'mongoose';

const selectionOrderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Parent Order reference
    selection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Selection', required: true },
    SKU: { type: String }, // Optional, for display
    deposit: { type: Number, required: true },
    pay: { type: Number, required: true },
    selectedTopSize: { type: String },
    selectedBottomSize: { type: String },
    selectedColor: { type: String },
    deliver_date: { type: Date },
    receive_date: { type: Date },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'delivered', 'received'], default: 'pending' },
    payment_status: { type: String, enum: ['pending', 'done'], default: 'pending' },
    deposit_status: { type: String, enum: ['pending', 'received', 'returned'], default: 'pending' },
}, { timestamps: true });

const SelectionOrder = mongoose.model('SelectionOrder', selectionOrderSchema);

export default SelectionOrder;