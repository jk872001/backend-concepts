require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const app = express();

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// morgan and fileupload middleware
app.use(morgan("tiny"));
app.use(fileUpload());
app.use(fileUpload(
    {
        useTempFiles:true,
        tempFileDir:"/tmp/"
    }
))

// import all routes
const home = require("./routes/home");
const user = require("./routes/user");



// router middlewares
app.use("/api/v1", home);
app.use("/api/v1", user);



// export app.js
module.exports = app;
