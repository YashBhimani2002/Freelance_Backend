const mongoose = require('mongoose');

const professionals = new mongoose.Schema({
    user_id: {
        ref: 'User',
        type: String,
        required: true,
    },
    company: {
        type: String,
    },
    phone: String,
    location: String,
    weburl: String,
    timezone: String,
    profile_img: String,
    bio_title: String,
    bio_brief: String,
    language: String,
    socials: Object,
    bank_name: String,
    bank_acc_name: String,
    bank_acc_number: String,
    bank_acc_ifsc: String,
    hours_available: String,
    bargaining_option: String,
    deleted_at: Date,
    city_id: Number,
    country_id: String,
    state_id: Number,
    // hourly_rate: Number,
    // hourly_available: Number,
    notification_readable: String,
    experience_level: String,
    designation : String,
},{ timestamps: true });

const Professionals = mongoose.model('professionals', professionals);

module.exports = Professionals;