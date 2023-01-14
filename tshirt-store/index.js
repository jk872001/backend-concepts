require("dotenv").config()
const app=require("./app")
const fileUpload = require("express-fileupload");
const connectWithDb=require('./config/db')
const {PORT}=process.env
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: 'dgvnvi6wk', 
    api_key: '677599397488387', 
    api_secret: 'LlYns2719923Sd6SToZNlMbrcbo' 
  });
connectWithDb();

app.listen(PORT,()=>
{
    console.log(`Server is running on ${PORT}`)
})