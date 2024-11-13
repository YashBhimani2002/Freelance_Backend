const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  payment_method: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  current_status: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  }
});

const PaymentMethods = mongoose.model('payment_methods', PaymentSchema);

module.exports = PaymentMethods;
