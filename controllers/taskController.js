const Task = require("../models/Task");

const { sendSMS } = require("../utils/twilioService");

// ✅ Get all tasks for logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user : req.user }).sort({ date: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update a task
exports.updateTask = async (req, res) => {
  console.log(req.params.id, req.body);
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, date, phoneNumber } = req.body;
    const newTask = new Task({
      user: req.user,
      title,
      description,
      date,
      phoneNumber,
      smsSent: false, // ✅ Ensure SMS is not marked as sent initially
      callMade: false, // ✅ Ensure Call is not marked as made initially
    });
    await newTask.save();

    res.status(201).json(newTask);
  } catch (err) {
    console.error("❌ Error creating task:", err.message);
    res.status(500).json({ error: err.message });
  }
};
