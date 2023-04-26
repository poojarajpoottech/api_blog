const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    cover: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    view: {
      type: Number,
      required: true,
    },
    createdAt: { type: Date, default: Date.now },

    body: {
      type: String,
      required: true,
    },
    comments: [
      {
        name: {
          type: String,
          require: true,
        },
        avatarUrl: {
          type: String,
          require: true,
        },
        message: {
          type: String,
          require: true,
        },
        postedAt: {
          type: String,
          require: true,
          default: Date.now,
        },
        users: [
          {
            name: {
              type: String,
              require: true,
            },
            avatarUrl: {
              type: String,
              require: true,
            },
          },
        ],
        replyComment: [
          {
            message: {
              type: String,
              require: true,
            },
            postedAt: {
              type: String,
              require: true,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.model("Posts", PostSchema);

module.exports = Posts;
