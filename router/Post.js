const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));

//db connection
require("../db/conn");
const Post = require("../model/postschema");
const baseRoute = "/api/post";

// Endpoint for creating a new post
router.post(`${baseRoute}/createpost`, async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      coverUrl,
      tags,
      metaKeywords,
      metaTitle,
      metaDescription,
    } = req.body;
    if (
      !title ||
      !description ||
      !content ||
      !coverUrl ||
      tags.length < 2 ||
      metaKeywords.length < 1 ||
      !metaTitle ||
      !metaDescription
    ) {
      return res.status(400).json({ message: "Plz filled the field properly" });
    }
    const ExistPost = await Post.findOne({ title: title });
    if (ExistPost) {
      return res.status(422).json({ error: "This Post already Exist" });
    } else {
      const newPost = new Post({
        title,
        description,
        content,
        coverUrl,
        tags,
        metaKeywords,
        metaTitle,
        metaDescription,
      });
      await newPost.save();

      res
        .status(201)
        .json({ message: "Post created successfully", Post: newPost });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint for updating an existing post
router.put(`${baseRoute}/:postId`, async (req, res) => {
  try {
    const { postId } = req.params;
    const {
      title,
      description,
      content,
      coverUrl,
      tags,
      metaKeywords,
      metaTitle,
      metaDescription,
    } = req.body;

    if (
      !title ||
      !description ||
      !content ||
      !coverUrl ||
      tags.length < 2 ||
      metaKeywords.length < 1 ||
      !metaTitle ||
      !metaDescription
    ) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const updatedPost = {
      title,
      description,
      content,
      coverUrl,
      tags,
      metaKeywords,
      metaTitle,
      metaDescription,
    };

    const updatedPostData = await Post.findOneAndUpdate(
      { _id: postId },
      updatedPost,
      { new: true }
    );

    if (!updatedPostData) {
      return res.status(404).json({ message: "Post not found" });
    }

    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPostData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
router.get(`${baseRoute}/details`, async (req, res) => {
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
