const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  phoneNumber: String,
  smsSent: { type: Boolean, default: false }, // Track SMS reminder
  callMade: { type: Boolean, default: false }, // Track call reminder
});

module.exports = mongoose.model("Task", TaskSchema);
