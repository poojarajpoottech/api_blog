const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

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
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credientials " });
      } else {
        token = await userLogin.generateAuthToken();
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });

        res.json({ id: userLogin._id, email });
      }
    } else {
      res.status(400).json({ error: "Invalid Credientials " });
    }
  } catch (err) {
    console.log(err);
  }
});

// uthenticate about
router.get("/api/about", authenticate, (req, res) => {
  res.send(req.rootUser);
});
//get contactus data for home page or contactus form
router.get("/api/getdata", authenticate, (req, res) => {
  res.send(req.rootUser);
});

//contactus form

router.post("/api/contact-us", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.json({ error: "please filled all field" });
    }
    const UserContact = await User.findOne({ _id: req.userID });
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
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("user logout successfully");
});

module.exports = router;
