const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  title: String,
  description: String,
  date: Date,
  phoneNumber: String,
  smsSent: { type: Boolean, default: false }, // Track SMS reminder
  callMade: { type: Boolean, default: false }, // Track call reminder
});

module.exports = mongoose.model("Task", TaskSchema);
