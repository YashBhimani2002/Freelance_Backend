const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  subscriber_email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Subscription = mongoose.model('subscription', subscriptionSchema);

module.exports = Subscription;
