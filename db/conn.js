const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const DB = mongoose.connection;
DB.on("error", console.error.bind(console, "MongoDB connection error:"));
DB.once("open", () => {
  console.log("Connected to MongoDB");
});
