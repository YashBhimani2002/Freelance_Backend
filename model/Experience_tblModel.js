const mongoose = require('mongoose');

// Define the Mongoose schema
const experienceSchema = new mongoose.Schema({
  user_id: {
    type: String, // Adjust the data type based on your needs
    required: true,
    ref: "users",
  },
  exp_title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  city_id: {
    type: String,
    // required: true,
  },
  country_id: {
    type: String,
    // required: true,
  },
  state_id: {
    type: String,
    // required: true,
  },
  address: {
    type: String,
    // required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  end_month: {
    type: Number,
    default:null,
    // required: true,
  },
  end_year: {
    type: Number,
    default:null,
    // required: true,
  },
  check: {
    type: Boolean,
    // required: true,
  },
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
const Experience = mongoose.model('Experience', experienceSchema, 'experience');

module.exports = Experience;
