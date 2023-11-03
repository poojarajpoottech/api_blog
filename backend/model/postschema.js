const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  avatarUrl: { type: String },
});

const replyCommentSchema = new mongoose.Schema({
  userId: { type: String },
  message: { type: String },
});

const commentSchema = new mongoose.Schema({
  name: { type: String },
  avatarUrl: { type: String },
  message: { type: String },
  postedAt: { type: Date, default: Date.now },
  users: [userSchema],
  replyComment: [replyCommentSchema],
});

const postSchema = new mongoose.Schema(
  {
    publish: { type: String, required: true },
    metaKeywords: [{ type: String, required: true }],
    content: { type: String, required: true },
    comments: [commentSchema],
    tags: [{ type: String, required: true }],
    metaTitle: { type: String },
    createdAt: { type: Date, default: Date.now },
    title: { type: String, required: true },
    coverUrl: { type: String, required: true },
    totalComments: { type: Number },
    metaDescription: { type: String },
    description: { type: String, required: true },
    author: {
      name: { type: String },
      avatarUrl: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
