const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const VoiceResponse = require("twilio").twiml.VoiceResponse;

router.post("/voice", async (req, res) => {
  const { message } = req.query;

  console.log("🎙 Incoming AI Voice Call Request:", message);

  if (!message) {
    return res.status(400).send("❌ No message provided.");
  }

  try {
    const twiml = new VoiceResponse();

    // AI-Powered Interactive Call
    const gather = twiml.gather({
      input: "speech",
      timeout: 5,
      action: "/voice/response",
      method: "POST",
    });

    gather.say(
      { voice: "Polly.Joanna" }, // Amazon Polly AI Voice (Better than 'alice')
      `Hello! This is an AI-powered reminder. ${message}. To confirm, say "yes". To cancel, say "no".`
    );

    res.type("text/xml");
    res.send(twiml.toString());
  } catch (error) {
    console.error("❌ AI Voice Response Error:", error.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Handle User Response (Yes/No)
router.post("/voice/response", async (req, res) => {
  const userResponse = req.body.SpeechResult?.toLowerCase();

  console.log("🗣 User said:", userResponse);

  const twiml = new VoiceResponse();

  if (userResponse === "yes") {
    twiml.say(
      { voice: "Polly.Joanna" },
      "Thank you! Your reminder is confirmed."
    );
  } else if (userResponse === "no") {
    twiml.say(
      { voice: "Polly.Joanna" },
      "Okay, your reminder has been cancelled."
    );
  } else {
    twiml.say(
      { voice: "Polly.Joanna" },
      "I didn't understand. Please try again next time."
    );
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

module.exports = router;
