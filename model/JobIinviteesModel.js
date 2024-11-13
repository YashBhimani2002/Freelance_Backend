const mongoose = require('mongoose');

// Define the JobInvitees schema
const jobInviteesSchema = new mongoose.Schema({
  job_id: String,
  job_title: String,
  job_status: String,
  client_id: {
    type: String,
    ref: 'User',
  },
  professional_id: String,
  invite_status: String,
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  bookmarkUpdatedAt: {
    type: Date
  },
  deleted_at: Date,
  bookmark: String,
  client_notification_status: Number,
  proposal_status: String,
  professional_bookmark: String,
  is_email: Number,
});

// Create the JobInvitees model
const JobInvitees = mongoose.model('JobInvitees', jobInviteesSchema);

module.exports = JobInvitees;
// Define the invitees_status route
// app.get('/invitees_status/:job_id/:client_id', async (req, res) => {
//   const { job_id, client_id } = req.params;

//   try {
//     const inviteesCnt = await JobInvitees.countDocuments({
//       job_id,
//       client_id,
//       client_notification_status: 0,
//     });

//     if (inviteesCnt > 0) {
//       const inviteesIds = await JobInvitees.findOne({
//         job_id,
//         client_id,
//         client_notification_status: 0,
//       });

//       if (inviteesIds && inviteesIds.id > 0) {
//         res.json(inviteesIds);
//       } else {
//         res.json({ status: 1 });
//       }
//     } else {
//       res.json({ status: 1 });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

