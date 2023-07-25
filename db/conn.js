const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const DB = mongoose.connection;
DB.on("error", console.error.bind(console, "MongoDB connection error:"));
DB.once("open", () => {
  console.log("Connected to MongoDB");
});
