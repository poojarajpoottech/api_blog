const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
require("../db/conn");
const baseRoute = "/api/post";
const postController = require("../controllers/postController");

router.post(`${baseRoute}/createpost`, postController.createPost);
router.put(`${baseRoute}/:postId`, postController.updatePost);
router.get(`${baseRoute}/list`, postController.postList);
router.get(`${baseRoute}/details`, postController.postDetails);
router.get(`${baseRoute}/search/:title`, postController.postTitle);
router.delete(`${baseRoute}/delete/:id`, postController.deletePost);

module.exports = router;
