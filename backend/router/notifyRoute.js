const express = require("express");
const router = express.Router();
const notifyController = require("../controllers/notifyController");

router.post("/notify", notifyController.notify);

module.exports = router;
