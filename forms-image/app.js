require("dotenv").config();
const express = require("express");
const fileUpload=require("express-fileupload")
const app = express();
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: 'dgvnvi6wk', 
    api_key: '677599397488387', 
    api_secret: 'LlYns2719923Sd6SToZNlMbrcbo' 
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload(
    {
        useTempFiles:true,
        tempFileDir:"/tmp/"
    }
))
// using ejs middleware
app.set("view engine", "ejs");

app.get("/myget", (req, res) => {
  res.send(req.query);
});

app.post("/mypost", async(req, res) => {
    // console.log(req.body);
    // console.log(req.files);

    const file=req.files.samplefile;
   result= await cloudinary.uploader
   .upload(file.tempFilePath,{
    folder:"users"
   });

   console.log(result);

   details={
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    result
   }

    res.send(details);
  });

app.get("/mygetform", (req, res) => {
  res.render("getForm");
});



app.get("/mypostform", (req, res) => {
  res.render("postForm");
});

module.exports = app;
