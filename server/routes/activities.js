const { Router } = require("express");
const router = Router();

const { authenticate } = require("../middleware/auth.js");

const { getAllactivities } = require("../controllers/activities.js");

// @desc    Get all activities
// @route   get /api/activities
// @access  formateur
router.get("/", getAllactivities);

module.exports = router;
