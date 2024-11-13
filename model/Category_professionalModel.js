const mongoose = require('mongoose');

const categoryProfessionalSchema = new mongoose.Schema({
    professionalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    categoryId: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    deletedAt: {
        type: Date,
    },
});

// Mongoose model
const CategoryProfessional = mongoose.model('CategoryProfessional', categoryProfessionalSchema);

module.exports = CategoryProfessional;
