import mongoose from 'mongoose';

const selectionDetailsSchema = new mongoose.Schema({
    selection_order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SelectionOrder', required: true },
    gender: { type: String, required: true },
    name: { type: String, required: true },
    mobile_number: { type: String, required: true },
    up_color: { type: String, required: true },
    up_size: { type: String, required: true },
    dawn_color: { type: String, required: true },
    dawn_size: { type: String, required: true },
    deliver_date: { type: Date, required: true },
    receive_date: { type: Date, required: true },
}, { timestamps: true });

const SelectionDetails = mongoose.model('SelectionDetails', selectionDetailsSchema);

export default SelectionDetails;