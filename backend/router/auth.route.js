const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth.controller");
const baseRoute = "/api/auth";

//user register
router.post(`${baseRoute}/register`, userController.userRegister);
router.post(`${baseRoute}/login`, userController.userLogin);
router.post(`${baseRoute}/logout`, userController.userLogout);
router.post(
  `${baseRoute}/forgate-password`,
  userController.sendPasswordResetLink
);
router.post(`${baseRoute}/reset-password`, userController.resetPasswordUser);

module.exports = router;
