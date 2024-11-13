const mongoose = require("mongoose");
const Transaction = require("../model/TransactionModel");

const milestoneJobSchema = new mongoose.Schema({
  job_id: { ref: "Jobs", type: String, required: true },
  professional_id: { type: String, ref: "User", required: true },
  milestone_task: { type: String, required: true },
  milestone_hours: { type: Number, required: true },
  milestone_price: { type: Number, required: true },
  milestone_original_start_date: { type: Date, required: true },
  milestone_original_end_date: { type: Date, required: true },
  milestone_start_date: { type: Date, required: true },
  milestone_end_date: { type: Date, required: true },
  hours_spent: { type: Number },
  status: { type: String },
  current_status: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
  deleted_at: { type: Date },
  submit_task_status: { type: String },
  submit_task_files: {
    type: [String], // Array of strings
    default: [],
  },
  submit_task_description: { type: String },
  price_withdrowed: { type: String, default: "0" },
});
milestoneJobSchema.statics.countEarnedHours = async function (professionalId) {
  try {
    const transactions = await Transaction.aggregate([
      {
        $match: { professional_user_id: professionalId },
      },
      {
        $lookup: {
          from: "job_milestones",
          localField: "milestone_id",
          foreignField: "id",
          as: "milestone",
        },
      },
      {
        $unwind: "$milestone",
      },
      {
        $lookup: {
          from: "jobs",
          localField: "milestone.job_id",
          foreignField: "id",
          as: "job",
        },
      },
      {
        $unwind: "$job",
      },
      {
        $project: {
          milestone_start_date: 1,
          milestone_end_date: 1,
          // Add other fields you may need
        },
      },
    ]);

    let hours = 0;

    transactions.forEach((transaction) => {
      const startDate = new Date(transaction.milestone_start_date);
      const endDate = new Date(transaction.milestone_end_date);
      const diff = endDate - startDate;
      const diffInHours = diff / (1000 * 60 * 60);
      hours += diffInHours;
    });

    return hours;
  } catch (error) {
    console.error("Error counting earned hours:", error);
    throw error;
  }
};

// Export the MilestoneJob model
const MilestoneJob = mongoose.model(
  "MilestoneJob",
  milestoneJobSchema,
  "job_milestones"
);
module.exports = MilestoneJob;
