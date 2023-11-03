// model/contactSchema.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    userIdentifier: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    messages: [messageSchema],
    lastMessageDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
