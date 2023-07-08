const express = require("express");
const router = express.Router();

//db connection
require("../db/conn");
const LatestPost = require("../model/latestposts");
const baseRoute = "/api/post";

router.post(`${baseRoute}/createlatestpost`, async (req, res) => {
  try {
    const postData = req.body.latestPosts;
    const newPost = await LatestPost.create(postData);
    res.status(201).json({ success: true, LatestPost: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

//rest api define
router.get(`${baseRoute}/latest`, async (req, res) => {
  try {
    const latestPosts = await LatestPost.find().lean();
    res.json({ latestPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get(`${baseRoute}/search/:title`, async (req, res) => {
  try {
    const title = req.params.title;
    const results = await LatestPost.findOne({ title }).lean();

    if (results) {
      res.json({ results });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
