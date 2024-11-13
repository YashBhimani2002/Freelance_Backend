const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    milestone_id: {
      type: String,
      ref: "MilestoneJob",
    },
    user_id: {
      ref: "User",
      type: String,
      required: true,
    },
    reference: {
      type: String,
    },
    amount: {
      type: String,
      default: null,
    },
    commission_rate: {
      type: String,
      default: null,
    },
    response: {
      type: Object,
      default: null,
    },
    status: {
      type: String,
      required: true,
    },
    payment_gateway: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    // deleted_at: {
    //     type: Date,
    //     default:'NULL'
    // },
    type: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    professional_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    operation_user_id: {
      type: String,
      ref: "User",
      required: true,
    },
    response_text: {
      type: Object,
      required: true,
    },
  },
  { collection: "transactions" }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
