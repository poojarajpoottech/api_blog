const express = require("express");
const router = express.Router();
const latestPostController = require("../controllers/latestPostController");
require("../db/conn");
const baseRoute = "/api/post";

router.post(
  `${baseRoute}/createlatestpost`,
  latestPostController.createLatestPost
);
router.get(`${baseRoute}/latest`, latestPostController.latestPost);
router.get(`${baseRoute}/latest`, latestPostController.getAllLatestPost);

module.exports = router;
