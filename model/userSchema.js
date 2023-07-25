const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      min: 3,
      max: 20,
    },
    phone: {
      type: Number,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 5,
      max: 15,
    },
  },
  {
    timestamps: true,
  }
);

// we are hashing the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// we are generating token
userSchema.methods.generateAuthToken = function () {
  try {
    const token = jwt.sign({ userId: this._id }, process.env.SECRET_KEY);
    return token;
  } catch (err) {
    throw new Error("Token generation failed");
  }
};

// collection creation
const User = mongoose.model("User", userSchema);

module.exports = User;
