const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdfController");

router.get("/api/download/pdf", pdfController.downloadPdf);

module.exports = router;
