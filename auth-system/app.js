require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const User = require("./model/user");
const isAuth=require("./middleware/auth")
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello World</h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      res.status(400).send("All fields are mandatory");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).send("User Already Exists");
    }

    const safePassword = await bcrypt.hash(password, 10)

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

    // handle password situation
    user.password=undefined;

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async(req,res)=>
{
  try{
    const {email,password}=req.body;

    if(!(email && password))
    {
      res.status(400).send("Please Fill All The Fields");
    }
 
    const user= await User.findOne({email});
 
    if(user && bcrypt.compare(password,user.password))
    {
      const token = jwt.sign(
        {user_id:user._id,email},
        process.env.SECRET_KEY,
        {
          expiresIn:"2h"
        }
      )
      user.token=token
      user.password=undefined;

      res.status(201).json(user)
    }

    res.status(400).send("Wrong Credentials")
  }
  catch(error)
  {
    console.log(error)
  }
   
})

app.get("/dashboard",isAuth,(req,res)=>
{
  res.send("Welcome to the secret info")
})
module.exports = app;
