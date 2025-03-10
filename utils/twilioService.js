const twilio = require("twilio");
require("dotenv").config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log("📩 SMS Sent:", response.sid);
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message, error);
  }
};

const makeAICall = async (to) => {
  try {
    const call = await client.calls.create({
      url: `${process.env.TWILIO_CALL_URL}/ai-call`, // Calls our new AI-powered webhook
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    console.log("📞 AI Call initiated:", call.sid);
  } catch (error) {
    console.error("❌ Error making AI call:", error.message);
  }
};

module.exports = { makeAICall };

// const makeAICall = async (to, taskId) => {
//   try {
//     const call = await client.calls.create({
//       url: `${process.env.TWILIO_CALL_URL}/voice?taskId=${taskId}`,
//       to: to,
//       from: process.env.TWILIO_PHONE_NUMBER,
//     });

//     console.log("📞 AI Call initiated:", call.sid);
//   } catch (error) {
//     console.error("❌ Error making AI call:", error.message);
//   }
// };

// const makeCall = async (to, taskId) => {
//   try {
//     const call = await client.calls.create({
//       url: `${process.env.SERVER_URL}/api/voice?taskId=${taskId}`, // Your backend endpoint
//       to: to,
//       from: process.env.TWILIO_PHONE_NUMBER,
//     });

//     console.log("📞 AI Call initiated:", call.sid);
//   } catch (error) {
//     console.error("❌ Error making AI call:", error.message);
//   }
// };

module.exports = { sendSMS, makeAICall };
