const express = require("express");
const router = express.Router();

//db connection
require("../db/conn");
const LatestPost = require("../model/latestposts");

//rest api define
router.get("/api/blog/latest", async (req, res) => {
  try {
    const data = await LatestPost.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/api/blog/search/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const post = await LatestPost.findOne({ title });

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
