const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Authenticate = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/isAdmin");

//db connection here
require("../db/conn");
const User = require("../model/userSchema");

//user register
router.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Plz filled the field properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    } else {
      const user = new User({ name, email, password });
      await user.save();
      res.status(201).json({ message: "user registered successfuly" });
    }
  } catch (err) {
    console.log(err);
  }
});

// user login

router.post("/api/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Plz Filled the data" });
    }
    const userLogin = await User.findOne({ email: email });
    // Check if user exists and verify password
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credientials " });
      } else {
        token = await userLogin.generateAuthToken();
        res.setHeader(
          "Set-Cookie",
          `jwtToken=${token}; Expires=${new Date(
            Date.now() + 25850000
          ).toUTCString()}; HttpOnly; Secure; SameSite=None;`
        );
        res.json(token);
      }
    } else {
      res.status(400).json({ error: "Invalid Credientials " });
    }
  } catch (err) {
    console.log(err);
  }
});

//get token
router.get("/api/gettoken", (req, res) => {
  try {
    const token = req.cookies.jwtToken;
    res.json(token);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Uthenticate About
router.get("/api/about", Authenticate, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.send(req.user);
});

//get contactus data for home page or contactus form
router.get("/api/getdata", Authenticate, requireAdmin, (req, res) => {
  res.send(req.user);
});

//protected contactus form

router.post("/api/contact-us", Authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.json({ error: "please filled all field" });
    }
    const UserContact = await User.findOne({ userId: req.userID });
    if (UserContact) {
      const userMessage = await UserContact.addMessage(
        name,
        email,
        phone,
        message
      );
      await UserContact.save();
      res.status(201).json({ message: "Message sent successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

// user logout
router.get("/api/logout", (req, res) => {
  res.clearCookie("jwtToken", { path: "/" });
  res.status(200).send("User Loggedout!");
});

module.exports = router;
