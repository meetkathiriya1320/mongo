import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SelectionOrder' },
    amount: { type: Number, required: true },
    transaction_id: { type: String },
    payment_method: { type: String },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
