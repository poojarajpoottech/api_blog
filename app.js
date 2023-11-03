const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
dotenv.config({ path: ".env" });

const port = process.env.BACKEND_PORT || 5000;
require("./backend/db/conn");
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: ["http://localhost:3033", "http://localhost:3031"],
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
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

app.use(require("./backend/router/auth.route"));
app.use(require("./backend/router/user.route"));
app.use(require("./backend/router/contactRoute"));
app.use(require("./backend/router/postRoute"));
app.use(require("./backend/router/latestPostRoute"));
app.use(require("./backend/router/commentRoute"));
app.use(require("./backend/router/notifyRoute"));
app.use(require("./backend/router/downloadpdfRoute"));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
