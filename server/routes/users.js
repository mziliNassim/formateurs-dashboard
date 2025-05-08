const { Router } = require("express");
const router = Router();

const { authenticate, authorize } = require("../middleware/auth.js");

const {
  getAllusers,
  deleteUser,
  createUser,
  getUserInfoById,
  updateUserInfoById,
} = require("../controllers/users.js");

// @desc    Get all users
// @route   get /api/users
// @access  admin
router.get("/", authenticate, authorize(["admin"]), getAllusers);

// @desc    Delete user by ID
// @route   delete /api/users
// @access  admin
router.delete("/:id", authenticate, authorize(["admin"]), deleteUser);

// @desc
// @route   post /api/users
// @access  admin
router.post("/", authenticate, authorize(["admin"]), createUser);

// @desc    Get User Infos
// @route   POST /api/users/:id
// @access  admin
router.get("/:id", authenticate, authorize(["admin"]), getUserInfoById);

// @desc    Update User Infos
// @route   PUT /api/users/:id
// @access  admin
router.put("/:id", authenticate, authorize(["admin"]), updateUserInfoById);

module.exports = router;
