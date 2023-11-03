const bcryptjs = require("bcryptjs");
const User = require("../model/userSchema");
const errorHandler = require("../utils/error");

const updateUser = async (req, res, next) => {
  if (req.userID !== req.params.id) {
    return next(errorHandler(401, "You can update only your account!"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
//about
const userAbout = async (req, res) => {
  if (!req.rootUser) {
    return res.status(401).json({ error: "Unauthorized here" });
  }
  res.send(req.rootUser);
};
//admin data
const requireAdminRole = (req, res, next) => {
  const user = req.rootUser;
  if (user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Requires admin role." });
  }
};

//delete
const deleteUser = async (req, res, next) => {
  if (req.userID !== req.params.id) {
    return next(errorHandler(401, "You can delete only your account!"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userAbout,
  deleteUser,
  updateUser,
  requireAdminRole,
};
