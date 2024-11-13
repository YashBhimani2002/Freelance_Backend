const mongoose = require('mongoose');

// Define the Mongoose schema
const educationSchema = new mongoose.Schema({
  user_id: {
    type: String, // Adjust the data type based on your needs
    required: true,
    ref: "users",
  },
  school: {
    type: String,
  },
  degree: {
    type: String,
  },
  study: {
    type: String, // Adjust the field name based on your needs
  },

  from_date: { type: Date, required: true },
  to_date: { type: Date, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Define the Mongoose model based on the schema
const Education = mongoose.model('Education', educationSchema, 'education_tbl');

module.exports = Education;
