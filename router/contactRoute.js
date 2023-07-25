const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.post("/api/contact", contactController.addContact);
router.get("/api/get/contacts", contactController.getAllContactDetails);

module.exports = router;
