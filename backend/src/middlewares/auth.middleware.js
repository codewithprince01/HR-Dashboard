const jwt = require("jsonwebtoken");
const { User } = require("../models/authentication/User.model");
const ApiError = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.token || 
                 req.header("Authorization")?.replace("Bearer ", "");
                 
    
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // Check if token is expired
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      throw new jwt.TokenExpiredError("Token expired", new Date(decoded.exp * 1000));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Session expired. Please login again");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid token. Please login again");
    }
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

// Middleware to check inactive sessions
const checkInactivity = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const now = new Date();
  const lastActive = new Date(user.lastActive);
  const hoursSinceLastActive = (now - lastActive) / (1000 * 60 * 60);

  if (hoursSinceLastActive > 2) {
    throw new ApiError(401, "Session expired due to inactivity");
  }
  
  next();
});

module.exports = { 
  verifyJWT,
  checkInactivity
};