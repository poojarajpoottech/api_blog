const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
require("../db/conn");
const User = require("../model/userSchema");
dotenv.config();

const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

//user register api
const userRegister = async (req, res) => {
  const { name, phone, email, password, profilePicture, role } = req.body;
  if (!name || !phone || !email || !password) {
    return res
      .status(422)
      .json({ error: "Please fill in all the fields properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    } else {
      const user = new User({
        name,
        phone,
        email,
        password,
        profilePicture,
        role,
      });
      await user.save();
      res.status(201).json({ message: "user registered successfuly" });
    }
  } catch (err) {
    console.log(err);
  }
};
//user login
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please fill in all the fields properly" });
    }
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, validUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Credentials 2" });
    }
    const token = jwt.sign({ _id: validUser._id }, process.env.SECRET_KEY);
    const { password: hashedPassword, ...data } = validUser._doc;
    const tokenValidityDuration = 120000; // 1 hour in milliseconds
    const tokenExpirationTime = Date.now() + tokenValidityDuration;
    const expiryDate = new Date(tokenExpirationTime);
    res
      .cookie("AccessToken", token, {
        httpOnly: true,
        expires: expiryDate,
        sameSite: "strict",
        path: "/",
        secure: false,
      })
      .status(200)
      .json({
        AccessToken: token,
        user: data,
        token_expiration: expiryDate,
      });
  } catch (err) {
    next(err);
  }
};

// Generate a random token and save it to the user's document in the database
const generateResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const payload = {
    userId: user._id,
    email: user.email,
  };
  const resetToken = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  user.resetPasswordToken = resetToken;
  user.resetPasswordTokenExpiry = Date.now() + 3600000;

  await user.save();

  return resetToken;
};

// Send an email with a link to reset the password
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `http://localhost:3033/auth/new-password?token=${resetToken}`;
  console.log(`resetUrl`, resetUrl);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: SMTP_EMAIL,
    to: email, // Use the provided email here
    subject: "Password Reset",
    html: `To reset your password, <a href="${resetUrl}">click here</a>.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

// API endpoint for sending a password reset email
const sendPasswordResetLink = async (req, res) => {
  const { email } = req.body;
  try {
    const resetToken = await generateResetToken(email);
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to send reset link" });
  }
};

// API endpoint for resetting the password
const resetPasswordUser = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({
      _id: payload.userId,
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: new Date() }, // Use Date object
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ error: "Password reset failed" });
  }
};

const userLogout = async (req, res) => {
  try {
    res.clearCookie("AccessToken", { path: "/" });
    res.status(200).send("Logged out successfully!");
  } catch (error) {
    console.error(`Error clearing cookie: ${error}`);
    res.status(500).send("Logout failed");
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  sendPasswordResetLink,
  resetPasswordUser,
};
