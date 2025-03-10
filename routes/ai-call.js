const express = require("express");
const router = express.Router();
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const OpenAI = require("openai");

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🟢 Step 1: Initial Call (User must press a key to continue)
router.post("/ai-call", async (req, res) => {
  const twiml = new VoiceResponse();

  // Ask the user to press any key to proceed
  const gather = twiml.gather({
    numDigits: 1,
    action: "/play-ai-message",
    method: "POST",
  });

  gather.say("Press any key to receive your reminder.");

  res.type("text/xml");
  res.send(twiml.toString());
});

// 🟢 Step 2: Play AI-Generated Message After Key Press
router.post("/play-ai-message", async (req, res) => {
  const twiml = new VoiceResponse();

  try {
    // Generate AI-based response
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI-powered reminder assistant.",
        },
      ],
      max_tokens: 50,
    });

    const responseText = aiResponse.choices[0].message.content;

    // ✅ Speak AI response
    twiml.say({ voice: "alice" }, responseText);
  } catch (error) {
    console.error("❌ OpenAI Error:", error.message);
    twiml.say("Sorry, I couldn't generate your reminder.");
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

module.exports = router;
