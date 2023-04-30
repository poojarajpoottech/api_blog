const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));

//db connection
require("../db/conn");
const Post = require("../model/postschema");
const RecentPost = require("../model/recentpostschema");

//we are checking here is admin or not
const Authenticate = require("../middleware/authMiddleware");

//GetAllPost
router.get("/api/blog/posts", (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 6;
    Post.find()
      .populate("author")
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
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//GetPostByTitle
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

//RecentPost
router.get("/api/blog/posts/recent", async (req, res) => {
  try {
    // const { title } = req.query;
    const recentpost = await RecentPost.find().sort({ createdAt: -1 }).limit(4);
    if (recentpost) {
      res.json(recentpost);
    } else {
      res.status(500).json({ message: "Server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Route for creating a new post that can only be accessed by an admin user
router.post("/api/blog/posts", Authenticate, async (req, res) => {
  try {
    const { title, content, author } = req.body;

    const post = await Post.create({
      title,
      content,
      author,
      isPublished: true,
    });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
