const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['1', '0'],
        default: '1',
        required: true,
    },
    position: {
        type: Number,
        default: 0,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
