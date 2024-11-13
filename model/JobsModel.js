const mongoose = require('mongoose');

const jobsSchema = new mongoose.Schema({
    
    job_title: {
        type: String,
        maxlength: 191,
    },
    job_description: {
        type: String,
    },
    user_id: {
        ref: 'User',
        type: String,
        required: true,
    },
    professional_id: {
        type: String,
    },
    professional_user_id: {
        type: String,
    },
    job_type: {
        type: String,
    },
    budget_from: {
        type: Number,
    },
    budget_to: {
        type: Number,
    },
    job_deliverables: {
        type: String,
    },
    expected_delivery_date: {
        type: Date,
    },
    status: {
        type: Number,
    },
    total_hours_spent: {
        type: Number,
    },
    in_favor_of: {
        type: Number,
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
    application_job_type: {
        type: Number,
    },
    application_id: {
        type: String,
    },
    experience_level: {
        type: String,
        enum: ['expert', 'intermediate', 'fresher'],
    },
    budget_type: {
        type: String,
        enum: ['Fixed', 'hourly' , 'range'],
    },
    job_start_date: {
        type: Date,
    },
    job_end_date: {
        type: Date,
    },
    cover_page_detail: {
        type: String,
        maxlength: 255,
    },
    location: {
        type: String,
    },
    job_place: {
        type: String,
        enum: ['remote', 'physical'],
    },
    notification_readable: {
        type: Number,
    },
    client_notification_status: {
        type: Number,
        enum: ['1', '0'],
    },
    p_fees_id: {
        type: String,
    },
    type: {
        type: String,
    },
}, { collection: 'jobs' });

const Jobs = mongoose.model('Jobs', jobsSchema);

module.exports = Jobs;

jobsSchema.index({ job_title: 'text', job_description: 'text' });