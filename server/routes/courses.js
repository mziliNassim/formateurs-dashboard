const { Router } = require("express");
const router = Router();

const { authenticate } = require("../middleware/auth.js");

const {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses.js");

// @desc    Get all courses
// @route   get /api/courses/getAllCourses
// @access  formateur
router.get("/", getAllCourses);

// @desc    Get a course by id
// @route   get /api/courses/getCourse/:id
// @access  formateur
router.get("/:id", authenticate, getCourse);

// @desc    Add a course
// @route   post /api/courses/
// @access  formateur
router.post("/", addCourse);

// @desc    Update a course by id
// @route   put /api/courses/updateCourse/:id
// @access  formateur
router.put("/:id", authenticate, updateCourse);

// @desc    Delete a course by id
// @route   delete /api/courses/deleteCourse/:id
// @access  formateur
router.delete("/:id", authenticate, deleteCourse);

module.exports = router;
