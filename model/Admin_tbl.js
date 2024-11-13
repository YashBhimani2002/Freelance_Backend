const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: String,
    contact_no: String,
    password: {
        type: String,
        required: true
    },
    is_verified_user: {
        type: Number,
      },
    api_key: String,
    api_token: String,
    remember_key: String
}, {
    collection: 'admin_tbl'
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
