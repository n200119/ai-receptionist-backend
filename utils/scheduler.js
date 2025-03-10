const cron = require("node-cron");
const Task = require("../models/Task");
const { sendSMS, makeAICall } = require("../utils/twilioService");

const scheduleReminders = async () => {
  const nowUTC = new Date();

  // ✅ Convert UTC → IST (Add 5 hours 30 minutes)
  const nowIST = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000);
  const oneHourLaterIST = new Date(nowIST.getTime() + 60 * 60 * 1000);
  const thirtyMinutesLaterIST = new Date(nowIST.getTime() + 30 * 60 * 1000);

  console.log(`🕒 Current UTC Time: ${nowUTC.toISOString()}`);
  console.log(`🇮🇳 Current IST Time: ${nowIST.toISOString()}`);
  console.log(
    `🔎 Checking tasks between ${nowIST.toISOString()} and ${oneHourLaterIST.toISOString()} (for SMS)`
  );
  console.log(
    `🔎 Checking tasks between ${nowIST.toISOString()} and ${thirtyMinutesLaterIST.toISOString()} (for Calls)`
  );

  // ✅ Find tasks for SMS reminders (1 hour before task in IST)
  const smsTasks = await Task.find({
    date: { $gte: nowIST, $lte: oneHourLaterIST },
    smsSent: false,
  });

  for (const task of smsTasks) {
    await sendSMS(
      task.phoneNumber,
      `📌 Reminder: ${task.title} is scheduled at ${task.date.toLocaleString(
        "en-IN",
        {
          timeZone: "Asia/Kolkata",
        }
      )}.`
    );
    task.smsSent = true;
    await task.save();
    console.log(
      `📩 SMS sent for task: ${task.title} at ${task.date.toISOString()}`
    );
  }

  // ✅ Find tasks for AI-powered Call reminders (30 minutes before task in IST)
  const callTasks = await Task.find({
    date: { $gte: nowIST, $lte: thirtyMinutesLaterIST },
    callMade: false,
  });

  for (const task of callTasks) {
    await makeAICall(task.phoneNumber, task._id);
    task.callMade = true;
    await task.save();
    console.log(`📞 AI Call made for task: ${task.title}`);
  }
};

// ✅ Start the cron job (runs every minute)
cron.schedule("* * * * *", async () => {
  console.log("⏳ AI Scheduler running...");
  await scheduleReminders();
});

module.exports = { scheduleReminders };
