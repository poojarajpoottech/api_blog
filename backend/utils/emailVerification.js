const axios = require("axios");
const HUNTER_API_KEY = process.env.HUNTER_API_KEY;

async function verifyEmail(email) {
  try {
    const response = await axios.get(
      `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${HUNTER_API_KEY}`
    );
    const verificationResult = response.data.data;

    if (verificationResult.result === "deliverable") {
      return { status: "valid", message: "Email is valid and deliverable." };
    } else if (verificationResult.result === "undeliverable") {
      return {
        status: "invalid",
        message: "Email is invalid or undeliverable.",
      };
    } else {
      return {
        status: "unknown",
        message: "Email verification result is unknown.",
      };
    }
  } catch (error) {
    console.error("Error while verifying email:", error.message);
    if (error.response) {
      return { status: "error", message: error.response.data.message };
    } else {
      return {
        status: "error",
        message: "An error occurred during email verification.",
      };
    }
  }
}

module.exports = verifyEmail;
