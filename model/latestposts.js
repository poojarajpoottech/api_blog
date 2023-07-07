const mongoose = require("mongoose");

const LatestpostSchema = new mongoose.Schema(
  {
    publish: { type: String, required: true },
    metaKeywords: [{ type: String }],
    content: { type: String, required: true },
    comments: [
      {
        name: { type: String, required: true },
        avatarUrl: { type: String, required: true },
        message: { type: String, required: true },
        postedAt: { type: Date, required: true },
        users: [
          {
            name: { type: String, required: true },
            avatarUrl: { type: String, required: true },
          },
        ],
        replyComment: [
          {
            userId: { type: String, required: true },
            message: { type: String, required: true },
            postedAt: { type: Date, required: true },
          },
        ],
      },
    ],
    tags: [{ type: String }],
    metaTitle: { type: String, required: true },
    createdAt: { type: Date, required: true },
    title: { type: String, required: true },
    coverUrl: { type: String, required: true },
    totalViews: { type: Number, required: true },
    totalShares: { type: Number, required: true },
    totalComments: { type: Number, required: true },
    totalFavorites: { type: Number, required: true },
    metaDescription: { type: String, required: true },
    description: { type: String, required: true },
    author: {
      name: { type: String, required: true },
      avatarUrl: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.model("latestpost", LatestpostSchema);

module.exports = Posts;
