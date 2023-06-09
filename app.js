const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.BACKEND_PORT || 5000;
const app = express();

app.use(cookieParser());
dotenv.config({ path: ".env" });
require("./db/conn");
app.use(express.json());

const corsOptions = {
  origin: ["https://designwithsatya.vercel.app", "http://localhost:3031"],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
};

app.use(cors(corsOptions));
app.get("/", async (req, res) => {
  res.send("Production is working");
});
app.use(require("./router/userAuth"));
app.use(require("./router/Post"));
app.use(require("./router/latestapipost"));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:", error);
  process.exit(1);
});
