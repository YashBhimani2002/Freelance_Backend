const mongoose = require('mongoose');
const crypto = require("crypto");
const bcrypt = require("bcrypt");


const contactUsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  contactReason: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  filesName: {
    type: String,
  }
}, { timestamps: true });


const Contact = mongoose.model('ContactUs', contactUsSchema);

module.exports = Contact;
