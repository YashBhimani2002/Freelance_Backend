const mongoose = require('mongoose');

const skillJobSchema = new mongoose.Schema({
    job_id: {
        type: String,
        required: true,
    },
    skill_id: {
        type: String,
        ref: 'SkillModel', // Replace with your actual SkillModel reference
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
}, { collection: 'skill_job' });

const SkillJob = mongoose.model('SkillJob', skillJobSchema);

module.exports = SkillJob;
