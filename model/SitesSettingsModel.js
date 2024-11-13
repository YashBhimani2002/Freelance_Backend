const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  email: String,
  address: String,
  contact_no: String,
  facebook: String,
  twitter: String,
  instagram: String,
  linkedin: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, { collection: 'site_settings' });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

// const getDataSite = async () => {
//   return await SiteSettings.findOne({ _id: 1 }); // Assuming id is 1 in MongoDB
// };

module.exports = { SiteSettings };
