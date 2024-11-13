const mongoose = require('mongoose');
const config = require('../config');


const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      deletedAt: {
        type: Date,
        default: null,
      },
      status: {
        type: String,
        enum: ['0', '1'],
        default: '1',
        required: true,
      },    
}, {
    timestamps: true,
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
