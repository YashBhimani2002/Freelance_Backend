const mongoose = require('mongoose');

const AppliedJobsSchema = new mongoose.Schema({
  job_id: {
    type: String,
    required: true,
  },
  professional_id: {
    type: String,
    required: true,
  },
  client_id: {
    type: String,
    required: true,
  },
  isReviewed: {
    type: Boolean,
    default: false
  },
  isHired: {
    type: Boolean,
    default: false
  },
  contractsStatus: {
    type: String,
  },
  clientFeedback: {
    message: {
      type: String
    },
    rating: {
      type: Number
    }
  }
}, {
  collection: 'applied_jobs',
  timestamps: true,
});

const AppliedJobs = mongoose.model('AppliedJobs', AppliedJobsSchema);

module.exports = AppliedJobs;
