const fs = require("fs");

const downloadPdf = (req, res) => {
  const filePath = "E:/api_blog/public/resume/poojarajpoot.pdf";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error while reading the resume file:", err);
      res.status(500).json({ error: "Failed to read the resume." });
    } else {
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=poojarajpoot.pdf"
      );
      res.setHeader("Content-Type", "application/pdf");
      res.send(data);
    }
  });
};

module.exports = { downloadPdf };
