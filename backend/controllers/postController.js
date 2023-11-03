const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const Post = require("../model/postschema");
const paramCase = require("../utils/paramCase");

const createPost = async (req, res) => {
  try {
    const {
      publish,
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
      !publish ||
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
    const ExistPost = await Post.findOne({ title: paramCase(title) });
    if (ExistPost) {
      return res.status(422).json({ error: "This Post already Exist" });
    } else {
      const newPost = new Post({
        publish,
        title: paramCase(title),
        description,
        content,
        coverUrl,
        tags,
        metaKeywords,
        metaTitle,
        metaDescription,
        comments: req.body.comments,
        author: req.body.author,
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
};

const updatePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const {
      publish,
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
      !publish ||
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
      publish,
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
};

const postList = async (req, res) => {
  try {
    const posts = await Post.find().lean();
    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const postDetails = async (req, res) => {
  let { title } = req.query;
  try {
    const post = await Post.findOne({ title }).lean();
    if (post) {
      res.json({ post });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const postTitle = async (req, res) => {
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
};

const deletePost = async (req, res) => {
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
};

module.exports = {
  createPost,
  updatePost,
  postList,
  postDetails,
  postTitle,
  deletePost,
};
