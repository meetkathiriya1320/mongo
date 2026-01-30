import mongoose from 'mongoose';

const selectionOrderSchema = new mongoose.Schema({
    SKU: { type: String, required: true }, // Reference to Selection SKU
    deposit: { type: Number, required: true },
    pay: { type: Number, required: true },
}, { timestamps: true });

const SelectionOrder = mongoose.model('SelectionOrder', selectionOrderSchema);

export default SelectionOrder;