const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const Authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = Authenticate;
