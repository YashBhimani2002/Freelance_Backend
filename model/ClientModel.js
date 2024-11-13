const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    user_id: {
        ref: 'User',
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    country_id: {
        type: String,
    },
    city_id: {
        type: Number,
    },
    state_id: {
        type: Number,
    },
    company_name: {
        type: String,
    },
    company_desc: {
        type: String,
    },
    location: {
        type: String,
    },
    profile_img: {
        type: String,
    },
    designation: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deleted_at: {
        type: Date,
    },
    notification_readable: {
        type: Date,
    },
    web_address: {
        type: String,
    },
}, {
    collection: 'clients', // Specify the collection name explicitly
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
