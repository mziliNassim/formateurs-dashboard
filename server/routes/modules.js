const { Router } = require("express");
const router = Router();

const { authenticate } = require("../middleware/auth.js");

const {
  getAllModules,
  getModule,
  addModule,
  updateModule,
  deleteModule,
} = require("../controllers/modules.js");

// @desc    Get all modules
// @route   get /api/modules
// @access  formateur
router.get("/", getAllModules);

// @desc    Get a module by id
// @route   get /api/modules/:id
// @access  formateur
router.get("/:id", getModule);

// @desc    Add a module
// @route   post /api/modules
// @access  formateur
router.post("/", addModule);

// @desc    Update a module by id
// @route   put /api/modules/:id
// @access  formateur
router.put("/:id", updateModule);

// @desc    Delete a module by id
// @route   delete /api/modules/:id
// @access  formateur
router.delete("/:id", deleteModule);

module.exports = router;
