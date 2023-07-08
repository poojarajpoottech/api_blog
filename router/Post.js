const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));

//db connection
require("../db/conn");
const Post = require("../model/postschema");
const baseRoute = "/api/post";

router.post(`${baseRoute}/createpost`, async (req, res) => {
  try {
    const postData = req.body.post;
    const newPost = await Post.create(postData);
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

//get post
router.get(`${baseRoute}/list`, async (req, res) => {
  try {
    const posts = await Post.find().lean();
    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// Get post details by title

// router.get("/api/post/details", async (req, res) => {
//   const { title } = req.query;
//   try {
//     const post = await Post.findOne({ title }).exec();

//     if (post) {
//       res.json({ post });
//     } else {
//       res.status(404).json({ error: "Post not found" });
//     }
//   } catch (error) {
//     console.error("Error retrieving post data:", error);
//     res.status(500).json({ error: "Failed to retrieve post data" });
//   }
// });
router.get("/api/post/details", async (req, res) => {
  try {
    const post = await Post.findOne().lean();
    if (post) {
      res.json({ post });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
//GetPostByTitle
router.get(`${baseRoute}/search/:title`, async (req, res) => {
  try {
    const title = req.params.title;
    const results = await Post.findOne({ title }).lean();

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

//delete the post based on the id

router.delete(`${baseRoute}/delete/:id`, async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

module.exports = router;
