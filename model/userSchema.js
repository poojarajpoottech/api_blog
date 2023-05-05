const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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
    },
    isAdmin: {
      type: Boolean,
      require: true,
      default: false,
    },
    messages: [
      {
        name: {
          type: String,
          require: true,
        },
        email: {
          type: String,
          require: true,
        },
        phone: {
          type: Number,
          require: true,
        },
        message: {
          type: String,
          require: true,
        },
      },
    ],
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
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    return token;
  } catch (err) {
    console.log(err);
  }
};

//add message
userSchema.methods.addMessage = async function (name, email, phone, message) {
  try {
    this.messages = this.messages.concat({ name, email, phone, message });
    await this.save();
    return this.messages;
  } catch (error) {
    console.log(error);
  }
};

// collection creation
const User = mongoose.model("User", userSchema);

module.exports = User;
