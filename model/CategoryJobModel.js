const mongoose = require('mongoose');

const categoryJobSchema = new mongoose.Schema({
    job_id: {
        type: String,
        required: true,
    },
    category_id: {
        type: String,
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
}, { collection: 'category_job' });

const CategoryJob = mongoose.model('CategoryJob', categoryJobSchema);

module.exports = CategoryJob;
