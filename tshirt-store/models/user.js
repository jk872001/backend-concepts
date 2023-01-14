const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
global.crypto = require('crypto')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the name"],
    maxLength: [40, "Please privide valid name"],
  },
  email: {
    type: String,
    required: [true, "Please provide the email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide the password"],
    minLength: [8, "Password must be 8 char"],
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  createdAt: {
    type: String,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); //converting to hash password
  }
  next();
});

// password validation
userSchema.methods.isValidatedPassword = async function (userSendPassword) {
  // console.log(userSendPassword,this.password)
  return await bcrypt.compare(userSendPassword, this.password);
};

// jwt token generation
userSchema.methods.getToken =   function () {
  return  jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// forget password token generation (simple string)
userSchema.methods.getForgetPassToken = async function () {
  const forgotToken = crypto.randomBytes(64).toString("hex");

  // we can hash the value
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 60 * 1000;

  return forgotToken;
  
};

module.exports = mongoose.model("User", userSchema);
