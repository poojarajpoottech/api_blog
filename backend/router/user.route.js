const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authenticateUser = require("../middleware/authMiddleware");
const baseRoute = "/api/auth";

//user register

router.delete(
  `${baseRoute}/delete/:id`,
  authenticateUser,
  userController.deleteUser
);
router.post(
  `${baseRoute}/update/:id`,
  authenticateUser,
  userController.updateUser
);
router.get(`${baseRoute}/me`, authenticateUser, userController.userAbout);
router.get(
  `${baseRoute}/admin/resource`,
  authenticateUser,
  userController.requireAdminRole
);

module.exports = router;
