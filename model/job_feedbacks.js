const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobFeedbackSchema = new Schema({
    job_id: {
        type: String,
        required: true
    },
    contract_id: {
        type: String,
        required: true
    },
    rate_by: {
        type: String,
        required: true,
    },
    rate_to: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
    },
    feedback: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date
    }
});

const JobFeedback = mongoose.model('JobFeedback', jobFeedbackSchema);

module.exports = JobFeedback;
