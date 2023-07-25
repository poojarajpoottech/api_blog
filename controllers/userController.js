const bcrypt = require("bcryptjs");
require("../db/conn");
const User = require("../model/userSchema");

const userRegister = async (req, res) => {
  const { name, phone, email, password } = req.body;
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
      const user = new User({ name, email, password });
      await user.save();
      res.status(201).json({ message: "user registered successfuly" });
    }
  } catch (err) {
    console.log(err);
  }
};

// user login
const userLogin = async (req, res) => {
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
};

const userGetToken = async (req, res) => {
  try {
    const token = req.cookies.jwtToken;
    res.json(token);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userAbout = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.send(req.user);
};

const userLogout = async (req, res) => {
  res.clearCookie("jwtToken", { path: "/" });
  res.status(200).send("User Loggedout!");
};

module.exports = {
  userRegister,
  userLogin,
  userGetToken,
  userAbout,
  userLogout,
};
