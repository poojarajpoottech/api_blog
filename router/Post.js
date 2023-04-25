const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));

//db connection
require("../db/conn");
const Post = require("../model/postschema");

//pagination
router.get("/api/blog/posts", (req, res) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 6;
  Post.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .then((data) => {
      Post.countDocuments().then((count) => {
        res.json({
          data,
          totalPages: Math.ceil(count / perPage),
        });
      });
    });
});

router.get("/api/blog/post/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const recentpostres = await Post.findById(title);
    res.json(recentpostres);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
