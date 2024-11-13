const mongoose = require('mongoose');

const ProfessionalPortfolios = new mongoose.Schema({
  user_id: {
    ref: 'User',
    type: String,
    required: true,
  },
  title: String,
  portfolio_image: String,
  portfolio_link: String,
  portfolio_type: String,
}, { timestamps: true });

module.exports = mongoose.model('professional_portfolios', ProfessionalPortfolios);
