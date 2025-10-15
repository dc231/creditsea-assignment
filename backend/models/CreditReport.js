const mongoose = require('mongoose');

// Schema for individual credit accounts
const AccountSchema = new mongoose.Schema({
  subscriberName: { type: String, trim: true },
  accountNumber: { type: String, trim: true },
  accountType: { type: String },
  isCreditCard: { type: Boolean, default: false },
  openDate: { type: Date },
  currentBalance: { type: Number },
  amountOverdue: { type: Number },
  paymentHistory: { type: String },
  dateReported: { type: Date },
  address: { type: String }
});

// Main schema for the entire credit report
const CreditReportSchema = new mongoose.Schema({
  // Basic Details
  name: { type: String, required: true },
  pan: { type: String, required: true, unique: true },
  mobile: { type: String },
  creditScore: { type: Number, required: true },

  // Report Summary
  totalAccounts: { type: Number },
  activeAccounts: { type: Number },
  closedAccounts: { type: Number },
  totalCurrentBalance: { type: Number }, 
  totalSecuredBalance: { type: Number }, 
  totalUnsecuredBalance: { type: Number }, 
  enquiriesLast7Days: { type: Number }, 

  // Credit Accounts Information 
  accounts: [AccountSchema],

}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

module.exports = mongoose.model('CreditReport', CreditReportSchema);