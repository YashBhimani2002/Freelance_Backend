const mongoose = require('mongoose');

const bookmarkedProfessionalSchema = new mongoose.Schema({
  
  job_id: String,
  professional_id: String,
  client_id: String,
  invite_status: String,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date,
  bookmark: String,
  client_notification_status: Number,
  proposal_status: String,
  professional_bookmark: String,
  is_email: Number,
});

const BookmarkedProfessional = mongoose.model('bookmarkedProfessional', bookmarkedProfessionalSchema);

module.exports = BookmarkedProfessional;