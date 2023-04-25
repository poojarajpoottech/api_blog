const bcrypt = require("bcryptjs");

const data = {
  users: [
    {
      name: "satyendra singh",
      email: "satyendrasingh@gmail.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: true,
    },
    {
      name: "satyendra",
      email: "user@gmail.com",
      password: bcrypt.hashSync("123456"),
      isAdmin: false,
    },
  ],
};
module.exports = data;
