const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define the MyContracts schema
const MyContractsSchema = new mongoose.Schema({
  user_id: {
    ref: 'User',
    type: String,
    required: true,
  },
  professional_id: {
    ref: 'User',
    type: String,
    required: true,
  },
  contract_title: {
    type: String,
    required: true,
  },
  contract_desc: {
    type: String,
    required: true,
  },
  contact_type: {
    type: String,
    required: true,
  },
  bargaining_option: {
    type: String,
  },
  budget: {
    type: Number,
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  job_id: {
    ref: 'Jobs',
    type: String,
    required: true,
  },
  client_id: {
    ref: 'User',
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  type: {
    type: String,
  },
  milestone_type:{
    type: Number,
  }
}, {
  collection: 'my_contracts', // Set the collection name
  timestamps: true, // Automatically manage created_at and updated_at
});

// Create models based on the schemas
const MyContracts = mongoose.model('MyContracts', MyContractsSchema);

module.exports = MyContracts;
