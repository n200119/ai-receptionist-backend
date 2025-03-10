const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const { assignTask } = require("../controllers/taskController");

const router = express.Router();

// ✅ Task Routes (Protected)
router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
