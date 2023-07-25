const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateMiddleware = require("../middleware/authMiddleware");
const baseRoute = "/api";

//user register
router.post(`${baseRoute}/register`, userController.userRegister);
router.post(`${baseRoute}/login`, userController.userLogin);
router.get(`${baseRoute}/gettoken`, userController.userGetToken);
router.get(
  `${baseRoute}/about`,
  authenticateMiddleware,
  userController.userAbout
);
router.post(`${baseRoute}/logout`, userController.userLogout);

module.exports = router;
