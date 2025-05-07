const { Router } = require("express");
const router = Router();

const { tokenAuthorize, authenticate } = require("../middleware/auth.js"); // JWT Token Verification Middleware for protected routes

const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.js");

// ! ========== Token Validation ==========
// @desc
// @route   get /api/users/validToken
// @access  Public
router.get("/validToken/:token", tokenAuthorize);

// ! ========== Authentification ==========
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", register);

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", login);

// @desc    Logout a user
// @route   POST /api/auth/logout
// @access  Formateur
router.post("/logout", authenticate, logout);

// @desc
// @route   POST /api/auth/forgot-password
// @access  Public
router.post("/forgot-password", forgotPassword);

// @desc
// @route   POST /api/auth/reset-password/:token
// @access  Public
router.post("/reset-password/:token", resetPassword);

module.exports = router;
