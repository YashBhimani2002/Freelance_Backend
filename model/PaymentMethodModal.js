const mongoose = require('mongoose');
const paymentMethodSchema = new mongoose.Schema({
  payment_method: {
    type: String,
  },
  status: {
    type: Number,
  },
  current_status: {
    type: String,
  },

},{ timestamps: true });

const PaymentMethod = mongoose.model('payment_method', paymentMethodSchema);

module.exports = PaymentMethod;
