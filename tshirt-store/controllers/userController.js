const BigPromise = require("../middlewares/bigPromise");
const cookieToken = require("../utils/cookieToken");
const User = require("../models/user");
const fileupload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
var bcrypt = require("bcrypt");
const user = require("../models/user");
const mailHelper = require("../utils/emailHepler");
const crypto=require("crypto")

exports.user = async (req, res, next) => {
  // if (!req.files) {
  //   return next(new Error("please upload photo"));
  // }
  // const file = req.files.photo;
  // const result = await cloudinary.uploader.upload(file.tempFilePath, {
  //   folder: "users",
  // });

  const { name, email, password } = req.body;

  if (!(email || name || password)) {
    return next(new Error("Please fill all the fields"));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  cookieToken(user, res);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email || password)) {
    return next(new Error("Please fill all the fields"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new Error("User not exist"));
  }

  const isPasswordCorrect = await user.isValidatedPassword(password);

  if (!isPasswordCorrect) {
    return next(new Error("User not existsss"));
  }

  cookieToken(user, res);
};

exports.showAllUsers = async (req, res, next) => {
  var mysort = { name: 1 };
  const user = await User.find({}).sort(mysort);
  res.status(200).send(user);
};

exports.deleteUser = async (req, res, next) => {
 const {email}=req.body;
  const user = await User.findOneAndRemove({email})
  res.status(200).json({
    message:"User Deleted Successfully",
    User:user
  });
};

exports.logout = async (req, res, next) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };
  res.cookie("token", null, options);
  res.status(200).json({
    success: true,
    message: "Logout Successfully",
  });
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not exist"));
  }
  const forgotToken = await user.getForgetPassToken();
  await user.save({ validateBeforeSave: false });
  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${forgotToken}`;

  const msg = `Visit to the following link:-
  ${myUrl}`;

  try {
    mailHelper({
      email: email,
      subject: "Password reset mail",
      text: msg,
    });
    res.status(200).json({
      success: true,
      message: "Email send Successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new Error("Email send unsuccess"));
  }
};

exports.passwordReset = async (req, res, next) => {
  const token=req.params.token;

  const encryToken= crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");

  const user=await User.findOne({encryToken,forgotPasswordExpiry:{$gt:  Date.now()}});

  if(!user)
  {
    return next(new Error("Token is invalid or expired"));
  }

 if(req.body.password!==req.body.confirmPassword)
 {
  return next(new Error("Password and confirm password is not equal"));
 }

 user.password=req.body.password;
 await user.save();
 res.status(200).json({
  success:true,
  msg:"Password Change Successfully"
 })
}