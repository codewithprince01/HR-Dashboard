const { User } = require("../models/authentication/User.model.js");
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler.js");
const  ApiError  = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    
    const accessToken = user.generateAccessToken();
    await user.updateLastActive();
    
    return { accessToken };
  } catch (error) {
    throw new ApiError(500, "Token generation failed");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullname, email, password, confirmpassword } = req.body;

    if (!fullname || !email || !password || !confirmpassword) {
      throw new ApiError(400, "All fields are required");
    }

    if (password !== confirmpassword) {
      throw new ApiError(400, "Passwords do not match");
    }

    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "Email already registered");
    }

    const user = await User.create({ fullname, email, password });

    return res.status(201).json(
      new ApiResponse(201, {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      }, "User registered successfully")
    );
  } catch (error) {
    console.log("Detailed error:", error);
    throw error; // Let asyncHandler handle the response
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken } = await generateAccessToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
    path: "/",
  };

  return res
    .status(200)
    .cookie("token", accessToken, options)
    .json(new ApiResponse(200, {
      accessToken,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email
      }
    }, "Login successful"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// Add this endpoint to check session validity
const checkSession = asyncHandler(async (req, res) => {
  await req.user.updateLastActive();
  res.status(200).json(
    new ApiResponse(200, { valid: true }, "Session is valid")
  );
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkSession
};