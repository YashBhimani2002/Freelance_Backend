const mongoose = require('mongoose');

const bankDetailSchema = new mongoose.Schema({
    bank_name: { type: String, required: true },
    account_holder_name: { type: String, required: true },
    bank_account: { type: String, required: true },
    bank_type: { type: String, required: true },
    ifsc_code: { type: String },
    status: { type: String, required: true },
    routing_number: { type: String },
    swift_code: { type: String },
    address: { type: String },
    country: { type: String },
    user_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const BankDetail = mongoose.model('BankDetail', bankDetailSchema);

module.exports = BankDetail;
