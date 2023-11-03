const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.AccessToken;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Missing access token" });
    }

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!verifyToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid access token" });
    }

    const rootUser = await User.findById(verifyToken._id);
    if (!rootUser) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // Set req.userID to the user's ID
    req.rootUser = rootUser;
    req.userID = verifyToken._id;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = authenticateUser;
