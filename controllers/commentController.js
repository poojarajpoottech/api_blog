const Post = require("../model/postschema");
const mongoose = require("mongoose");

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { name, avatarUrl, message } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const newComment = {
      name,
      avatarUrl,
      message,
    };
    post.comments.push(newComment);
    post.totalComments = post.comments.length;
    await post.save();
    res.status(201).json({ message: "Comment added successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find();
    for (const postData of posts) {
      for (const comment of postData.comments) {
        for (const user of comment.users) {
          if (user.name === userId) {
            return res.json(user);
          }
        }
      }
    }
    res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addReplyToComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { userId, message } = req.body;

    // Convert postId and commentId to ObjectId
    const objectIdPostId = mongoose.Types.ObjectId(postId);
    const objectIdCommentId = mongoose.Types.ObjectId(commentId);

    const post = await Post.findById(objectIdPostId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = post.comments.find((comment) =>
      comment._id.equals(objectIdCommentId)
    );
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const newReply = {
      userId,
      message,
    };

    comment.replyComment.push(newReply);

    await post.save();

    res
      .status(201)
      .json({ message: "Reply added successfully", reply: newReply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { addComment, getUserDetails, addReplyToComment };
