const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    faq_type: {
        type: String,
        required: true
    },
    faq_question: {
        type: String,
        required: true
    },
    faq_desc: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 0, // 1 for active, 0 for inactive
        enum: [0, 1] // Only allow 0 or 1 as values
    }
});

const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq;
