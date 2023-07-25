const nodemailer = require("nodemailer");
const Notify = require("../model/notifySchema");
const verifyEmail = require("../utils/emailVerification");

// Create a transporter to send emails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "satyendrasingh@titan.co.in",
    pass: "yk*QVe8ATi",
  },
});

const notify = async (req, res) => {
  const { email } = req.body;
  if (!email || email.trim() === "") {
    return res.status(400).json({ error: "Email field can't be empty." });
  }

  try {
    const verificationResult = await verifyEmail(email);
    if (verificationResult.status !== "valid") {
      return res.status(400).json({ error: "Invalid email address." });
    }
    let existingNotify = await Notify.findOne({ email });
    if (existingNotify) {
      existingNotify.lastUpdated = new Date();
      await existingNotify.save();
    } else {
      const newNotify = new Notify({ email });
      await newNotify.save();
    }

    const mailOptions = {
      from: "satyendrasingh@titan.co.in",
      to: email,
      subject: "Thank you for your notification!",
      text: `Dear Subscriber,\n\nThank you for contacting us. We have received your notification and appreciate your communication with us.\n\nOur team is already looking into the matter, and we will get back to you as soon as possible with further updates or any actions required.\n\nIn the meantime, if you have any questions or need to provide additional information, please feel free to reply to this email, and we'll be happy to assist you.\n\nThank you again for reaching out to us. We value your feedback and engagement.\n\nBest regards,\nDesignWithSatya`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ error: "An error occurred while sending the email." });
      }
      res.json({ message: "You will be notified soon!" });
    });
  } catch (error) {
    console.error("Error saving email:", error);
    res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
};

module.exports = { notify };
