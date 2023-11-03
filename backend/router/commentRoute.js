const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.post("/api/post/:postId/comments", commentController.addComment);
router.get("/api/users/:userId", commentController.getUserDetails);
router.post(
  "/api/posts/:postId/comments/:commentId/reply",
  commentController.addReplyToComment
);

module.exports = router;
