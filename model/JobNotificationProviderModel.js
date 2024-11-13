const mongoose = require('mongoose');

const jobNotificationProviderSchema = new mongoose.Schema({
    job_id: {
        type: Number,
        required: true,
    },
    professional_id: {
        type: Number,
        required: true,
    },
    user_id: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        enum: ['1', '0'],
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'Job_notification_provider' });

const JobNotificationProvider = mongoose.model('JobNotificationProvider', jobNotificationProviderSchema);

module.exports = JobNotificationProvider;
