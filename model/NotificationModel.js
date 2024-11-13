const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    job_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
    },
    message: {
        type: String,
        required: true
    },
    client_id: {
        type: String,
    },
    professional_id: {
        type: String,
    },
    is_read: {
        type: Boolean,
        required: false
    },
    subject: {
        type: String,
        required: true
    },
    send_by: {
        type: String,
        required: true
    },
    rout: {
        type: String,
    },
    status: {
        type: Number,
        default: 0 
    }
}, {
    collection: 'tbl_notification',
    timestamps: false // If you don't want Mongoose to manage createdAt and updatedAt fields
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
