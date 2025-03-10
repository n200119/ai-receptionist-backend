require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");

const app = express();

app.use(cors{ origin: "*", methods: ["GET", "POST"] });
// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.use(express.static("public"));

// Import and Call the Reminder Scheduler
const { scheduleReminders } = require("./utils/scheduler");
scheduleReminders(); // ✅ Make sure it's called!

// Default Route
app.get("/", (req, res) => {
  res.send("AI Receptionist Backend Running...");
});

app.use("/twilio", require("./routes/twilioRoutes"));

const aiCallRoutes = require("./routes/ai-call");
app.use("/", aiCallRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
