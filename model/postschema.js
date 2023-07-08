const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    publish: { type: String },
    metaKeywords: [{ type: String, required: true }],
    content: { type: String, required: true },
    comments: [
      {
        name: { type: String },
        avatarUrl: { type: String },
        message: { type: String },
        postedAt: { type: Date, default: Date.now },
        users: [
          {
            name: { type: String },
            avatarUrl: { type: String },
          },
        ],
        replyComment: [
          {
            userId: { type: String },
            message: { type: String },
            postedAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    tags: [{ type: String, required: true }],
    metaTitle: { type: String },
    createdAt: { type: Date, default: Date.now },
    title: { type: String, required: true },
    coverUrl: { type: String, required: true },
    totalViews: { type: Number },
    totalShares: { type: Number },
    totalComments: { type: Number },
    totalFavorites: { type: Number },
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
