const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
const Joi = require("joi");
app.use(bodyParser.urlencoded({ extended: true }));

//db connection
require("../db/conn");
const Post = require("../model/postschema");
const baseRoute = "/api/blog";

const postSchema = Joi.object({
  publish: Joi.boolean().required(),
  metaKeywords: Joi.string().required(),
  content: Joi.string().required(),
  comments: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.string()),
  metaTitle: Joi.string().required(),
  createdAt: Joi.date().required(),
  title: Joi.string().required(),
  coverUrl: Joi.string().required(),
  totalViews: Joi.number().integer().min(0).required(),
  totalShares: Joi.number().integer().min(0).required(),
  totalComments: Joi.number().integer().min(0).required(),
  totalFavorites: Joi.number().integer().min(0).required(),
  metaDescription: Joi.string().required(),
  description: Joi.string().required(),
  author: Joi.string().required(),
});
// create a new post
router.post(`${baseRoute}/createpost`, async (req, res) => {
  try {
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.details });
    }

    const savedPost = await Post.create(value);
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create post" });
  }
});
//get post
router.get(`${baseRoute}/post`, async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//GetPostByTitle
router.get(`${baseRoute}/post/:title`, async (req, res) => {
  try {
    const title = req.params.title;
    const post = await Post.findOne({ title });

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

//delete the post based on the id

router.delete(`${baseRoute}/deletepost/:id`, async (req, res) => {
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
