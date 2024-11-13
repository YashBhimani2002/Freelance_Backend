const mongoose = require('mongoose');

// Define the schema
const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State', // Assuming you have a State model
    required: true,
  },
  stateCode: {
    type: String,
    required: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country', // Assuming you have a Country model
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
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

// Index for geospatial queries
citySchema.index({ location: '2dsphere' });

// Create the model
const City = mongoose.model('City', citySchema);

module.exports = City;
