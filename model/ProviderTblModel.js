const mongoose = require('mongoose');

const providerTblSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    company: {
        type: String,
    },
    phone: {
        type: String,
    },
    weburl: {
        type: String,
    },
    location: {
        type: String,
    },
    timezone: {
        type: String,
    },
    profile_img: {
        type: String,
    },
    bio_title: {
        type: String,
    },
    bio_brief: {
        type: String,
    },
    language: {
        type: String,
    },
    socials: {
        type: String,
    },
    bank_name: {
        type: String,
    },
    bank_acc_name: {
        type: String,
    },
    bank_acc_number: {
        type: String,
    },
    bank_acc_ifsc: {
        type: String,
    },
    hours_available: {
        type: String,
    },
    bargaining_option: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    deleted_at: {
        type: Date,
    },
    city_id: {
        type: Number,
    },
    country_id: {
        type: Number,
    },
    state_id: {
        type: Number,
    },
    notification_readable: {
        type: Number,
    },
    experience_level: {
        type: String,
    },
}, { collection: 'provider_tbl' });

const ProviderTbl = mongoose.model('ProviderTbl', providerTblSchema);

module.exports = ProviderTbl;
