require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const User = require("./model/user");
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello World</h1>");
});

app.get("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      res.status(400).send("All fields are mandatory");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).send("User Already Exists");
    }

    const safePassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: safePassword,
    });

    // token generation
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    // update in db or not
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
