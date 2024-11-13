const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'countries', // Assuming you have a Country model
    required: true,
  },
  country_code: {
    type: String,
    required: true,
  },
  fips_code: {
    type: String,
  },
  iso2: {
    type: String,
  },
  type: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  id: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  flag: {
    type: Boolean,
    default: true,
  },
  wikiDataId: {
    type: String,
  },
});

const State = mongoose.model('State', stateSchema);

module.exports = State;
