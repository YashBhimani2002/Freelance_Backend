const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ['docx', 'doc', 'pdf'], // Allow only specified file types
  },
});

const draftProfessionalApplicationSchema = new mongoose.Schema({
  milestone: {
    type: String,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  pitch: {
    type: String,
    required: true,
  },
  attachments: {
    type: [attachmentSchema],
    required: true,
  },
});

const DraftProfessionalApplicationModel = mongoose.model(
  'DraftProfessionalApplication',
  draftProfessionalApplicationSchema
);

module.exports = DraftProfessionalApplicationModel;
