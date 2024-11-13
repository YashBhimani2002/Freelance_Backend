const mongoose = require('mongoose');

const skillProfessionalSchema = new mongoose.Schema({
    professional_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    skill_id: {
        type: [String],
    },
}, {timestamps: true});

// Mongoose model
const SkillProfessional = mongoose.model('SkillProfessional', skillProfessionalSchema);

module.exports = SkillProfessional;
