const mongoose = require("mongoose");
const { Schema } = mongoose;

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
    createdAt: {
      type: Date,
      required: true,
    },
    view: {
      type: Number,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "author",
    },
    tags: [{ type: String }],
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
