const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;
const app = express();

// const User = require("./model/userSchema");
// const data = require("./utils/data");
// const Postschema = require("./model/postschema");
// const posts = require("./utils/posts");

app.use(cookieParser());
dotenv.config({ path: "./config.env" });
require("./db/conn");
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3031",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// seed data here in database
// async function seedData() {
//   try {
//     // await User.deleteMany();
//     // await User.insertMany(data.users);
//     await Postschema.deleteMany();
//     await Postschema.insertMany(posts.posts);
//     console.log("Data seeded successfully");
//   } catch (error) {
//     console.log(error);
//   }
// }
// seedData();

// ****** SEND API
app.get("/", async (req, res) => {
  res.send("Production is working");
});

//user router
app.use(require("./router/userAuth"));
app.use(require("./router/Post"));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
