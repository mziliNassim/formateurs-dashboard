const jwt = require("jsonwebtoken");
const User = require("../models/User");
const TokenBlacklist = require("../models/TokenBlacklist");

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// Authenticate user
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("Authorization token is required");

    // Check if the token is blacklisted
    const isBlacklisted = await TokenBlacklist.findOne({ token });
    if (isBlacklisted) throw new Error("Token is invalid");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) throw new Error("user not found or inactive");

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Authentication required!",
      data: null,
    });
  }
};

// Authorize user
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
        data: null,
      });
    }
    next();
  };
};

// Token Validation
const tokenAuthorize = (req, res) => {
  const token = req.params.token;

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "No token provided", data: null });

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err)
      return res
        .status(401)
        .json({ success: false, message: "Invalid token !", data: null });

    return res
      .status(200)
      .json({ success: true, message: "Valid token !", data: null });
  });
};

module.exports = { generateToken, authenticate, authorize, tokenAuthorize };
