const { Router } = require("express");
const router = Router();

const { tokenAuthorize, authenticate } = require("../middleware/auth.js"); // JWT Token Verification Middleware for protected routes

const {
  login,
  logout,
  getUserInfobyToken,
  updateProfile,
  updatePassword,
} = require("../controllers/auth.js");

// ! ========== Token Validation ==========
// @desc
// @route   get /api/auth/validToken/:token
// @access  Public
router.get("/validToken/:token", tokenAuthorize);

// ! ========== Authentification ==========
// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", login);

// @desc    Logout a user
// @route   POST /api/auth/logout
// @access  Formateur
router.post("/logout", authenticate, logout);

// @desc    Get User Infos
// @route   POST /api/auth/infos
// @access  formateur
router.get("/infos", authenticate, getUserInfobyToken);

// @desc    Update Profile Infos
// @route   PUT /api/auth/infos
// @access  formateur
router.put("/profile", authenticate, updateProfile);
router.put("/password", authenticate, updatePassword);

module.exports = router;
