const mongoose = require('mongoose');
const crypto = require("crypto");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  avatar: { type: String},
  last_name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true,
  },
  country: {
    type: String,
    // required: true,
    ref: 'Country',
  },
  is_verified_user: {
    type: Number,
  },
  login_as: {
    type: Number,
  },
  company_name: {
    type: String,
  },
  status: {
    type: Number,
  },
  activation_token: {
    type: String,
  },
  wallet_balance: {
    type: Number,
  },
  bank_acc_name: {
    type: String,
  },
  bank_acc_number: {
    type: String,
  },
  bank_name: {
    type: String,
  },
  remember_token: {
    type: String,
  },
  deleted_at: {
    type: Date,
  },
  online: {
    type: Number,
  },
  google_id: {
    type: String,
  },
  google_token: {
    type: String,
  },
  facebook_id: {
    type: String,
  },
  linkedin_id: {
    type: String,
  },
  facebook_token: {
    type: String,
  },
  client_profile_complete: {
    type: Number,
  },
  professional_profile_complete: {
    type: Number,
  },
  profile_view: {
    type: Number,
  },
  user_timezone: {
    type: String,
  },
  notification_status:{
    type:Number,
    default:1
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //token expire in 15 min 
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return this.resetPasswordToken; // Return the value stored in this.resetPasswordToken
};
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hashSync(this.password, 10);
});
const User = mongoose.model('User', userSchema);

module.exports = User;
