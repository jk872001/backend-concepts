require("dotenv").config();
const express = require("express");
let ejs = require("ejs");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// using ejs middleware
app.set("view engine", "ejs");

app.get("/myget", (req, res) => {
  res.send(req.body);
});

app.get("/mygetform", (req, res) => {
  res.render("getForm");
});

app.get("/mypostform", (req, res) => {
  res.render("postForm");
});

module.exports = app;
