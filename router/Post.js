const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));

//db connection
require("../db/conn");
const Post = require("../model/postschema");
const RecentPost = require("../model/recentpostschema");

//pagination
router.get("/api/blog/posts", (req, res) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 6;
  Post.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .then((data) => {
      Post.countDocuments().then((count) => {
        res.json({
          data,
          totalPages: Math.ceil(count / perPage),
        });
      });
    });
});

router.get("/api/blog/post", async (req, res) => {
  try {
    const { title } = req.query;
    const post = await Post.findOne({ title });
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

//recent post
router.get("/api/blog/posts/recent", async (req, res) => {
  try {
    // const { title } = req.query;
    const recentpost = await RecentPost.find().sort({ createdAt: -1 }).limit(2);
    if (recentpost) {
      res.json(recentpost);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
