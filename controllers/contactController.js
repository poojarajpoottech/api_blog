const { startOfDay, endOfDay, isWithinInterval } = require("date-fns");
const Contact = require("../model/contactSchema");
const verifyEmail = require("../utils/emailVerification");

// Endpoint for submitting a contact form
const addContact = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res
      .status(400)
      .json({ error: "Please fill in all required fields" });
  }
  try {
    const currentDate = new Date();
    const startOfCurrentDay = startOfDay(currentDate);
    const endOfCurrentDay = endOfDay(currentDate);

    let userContact = await Contact.findOne({ email });

    if (userContact) {
      const messageCountToday = userContact.messages.filter((msg) =>
        isWithinInterval(new Date(msg.timestamp), {
          start: startOfCurrentDay,
          end: endOfCurrentDay,
        })
      ).length;

      if (messageCountToday >= 2) {
        return res
          .status(429)
          .json({ error: "You can only send 2 messages per day" });
      }

      userContact.messages.push({ content: message, timestamp: currentDate });
      await userContact.save();
    } else {
      const emailVerificationResult = await verifyEmail(email);
      if (emailVerificationResult.status === "valid") {
        userContact = new Contact({
          userIdentifier: email,
          name,
          email,
          subject,
          messages: [{ content: message, timestamp: currentDate }],
        });
        await userContact.save();
      } else {
        return res.status(400).json({ error: "Invalid email address" });
      }
    }
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting the message" });
  }
};
// Endpoint to get all contacts
const getAllContactDetails = async (req, res) => {
  try {
    const allContacts = await Contact.find();
    res.status(200).json({ allContacts });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching contacts" });
  }
};

module.exports = { addContact, getAllContactDetails };
