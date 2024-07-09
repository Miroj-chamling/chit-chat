const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel.js");
const generateToken = require("../config/generateToken.js");

const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password, confirmPassword, pic } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error("Please Enter all the Fields!");
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords Do not match!");
  }

  if (pic === "") {
    pic = "https://icon-library.com/images/141782.svg.svg";
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already Exists!");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the User");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields!");
  }

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Inavid Email or Password");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const query = req.query.search
    ? {
        name: { $regex: req.query.search, $options: "i" },
      }
    : {};

  const users = await User.find(query).find({ _id: { $ne: req.user._id } });

  if (!users) {
    res.send([]);
  }

  res.send(users);
  console.log(query);
});

module.exports = { registerUser, authUser, getAllUsers };
