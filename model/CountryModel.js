const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  iso3: String,
  id: String,
  numericCode: String,
  iso2: String,
  phonecode: String,
  capital: String,
  currency: String,
  currencyName: String,
  currencySymbol: String,
  tld: String,
  native: String,
  region: String,
  subregion: String,
  timezones: [String],
  translations: Object, // You might want to adjust this based on your actual data structure
  latitude: Number,
  longitude: Number,
  emoji: String,
  emojiU: String,
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
  wikiDataId: String,
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
