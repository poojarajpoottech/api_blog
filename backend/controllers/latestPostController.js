const LatestPost = require("../model/latestposts");
const paramCase = require("../utils/paramCase");

const createLatestPost = async (req, res) => {
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
    const ExistPost = await LatestPost.findOne({ title: paramCase(title) });
    if (ExistPost) {
      return res.status(422).json({ error: "This Post already Exist" });
    } else {
      const newPost = new LatestPost({
        title: paramCase(title),
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
        .json({ message: "Post created successfully", LatestPost: newPost });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const latestPost = async (req, res) => {
  try {
    const latestPosts = await LatestPost.find().lean();
    res.json({ latestPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllLatestPost = async (req, res) => {
  let { title } = req.query;
  try {
    const post = await LatestPost.findOne({ title }).lean();
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

module.exports = { createLatestPost, latestPost, getAllLatestPost };
