const mongoose = require('mongoose');

const professionalApplicationAttachmentSchema = new mongoose.Schema({
    job_id: {
        type: String,
        required: true,
    },
    file_name: {
        type: String,
        maxlength: 255,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    user_id: {
        type: String,
    },
}, { collection: 'professional_application_attachment' });

const ProfessionalApplicationAttachment = mongoose.model('ProfessionalApplicationAttachment', professionalApplicationAttachmentSchema);

module.exports = ProfessionalApplicationAttachment;
