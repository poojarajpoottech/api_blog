const mongoose = require("mongoose");

const notifySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notify = mongoose.model("Notify", notifySchema);

module.exports = Notify;
