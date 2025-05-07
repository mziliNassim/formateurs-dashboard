const Module = require("../models/Module");
const Cours = require("../models/Cours");
const mongoose = require("mongoose");

const getAllModules = async (req, res) => {
  try {
    const {
      titre,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
      includeCourses = false,
    } = req.query;

    // Build filter object
    const filter = {};

    if (titre) {
      filter.titre = { $regex: titre, $options: "i" }; // Case-insensitive search
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sortBy] = order === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let query = Module.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Optionally populate courses
    if (includeCourses === "true") {
      query = query.populate({
        path: "cours",
        select: "titre description formatContenu duree ordrePublication",
        options: { sort: { ordrePublication: 1 } },
      });
    }

    // Execute query
    const modules = await query;

    // Get total count for pagination
    const total = await Module.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: modules.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: modules,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer les modules",
      error: error.message,
    });
  }
};

const getModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { includeCourses = true } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de module invalide",
      });
    }

    let query = Module.findById(id);

    if (includeCourses === "true") {
      query = query.populate({
        path: "cours",
        select: "titre description formatContenu duree ordrePublication statut",
        options: { sort: { ordrePublication: 1 } },
      });
    }

    const module = await query;

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
      });
    }

    return res.status(200).json({
      success: true,
      data: module,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer le module",
      error: error.message,
    });
  }
};

const addModule = async (req, res) => {
  try {
    const { titre, description, image } = req.body;

    const newModule = new Module({
      titre,
      description,
      image,
      cours: [],
    });

    const savedModule = await newModule.save();

    return res.status(201).json({
      success: true,
      message: "Module créé avec succès",
      data: savedModule,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Impossible de créer le module",
      error: error.message,
    });
  }
};

const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de module invalide",
      });
    }

    // Prevent direct modification of cours array through this endpoint
    if (updateData.cours) {
      delete updateData.cours;
    }

    const updatedModule = await Module.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedModule) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Module mis à jour avec succès",
      data: updatedModule,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Impossible de mettre à jour le module",
      error: error.message,
    });
  }
};

const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { deleteCourses = true } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de module invalide",
      });
    }

    const module = await Module.findById(id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
      });
    }

    // Start a session to handle the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete the module
      const deletedModule = await Module.findByIdAndDelete(id).session(session);

      // Optionally delete all associated courses
      if (deleteCourses === "true" && module.cours && module.cours.length > 0) {
        await Cours.deleteMany({ _id: { $in: module.cours } }).session(session);
      } else if (module.cours && module.cours.length > 0) {
        // If not deleting courses, update them to remove module reference
        await Cours.updateMany(
          { _id: { $in: module.cours } },
          { $unset: { module: "" } }
        ).session(session);
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Module supprimé avec succès",
        data: deletedModule,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Impossible de supprimer le module",
      error: error.message,
    });
  }
};

const addCourseToModule = async (req, res) => {
  try {
    const { id, courseId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res.status(400).json({
        success: false,
        message: "ID de module ou de cours invalide",
      });
    }

    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
      });
    }

    const course = await Cours.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé",
      });
    }

    // Check if course is already in module
    if (module.cours.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Le cours est déjà associé à ce module",
      });
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Add course to module
      module.cours.push(courseId);
      await module.save({ session });

      // Update course to reference this module
      course.module = id;
      await course.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Cours ajouté au module avec succès",
        data: module,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Impossible d'ajouter le cours au module",
      error: error.message,
    });
  }
};

const removeCourseFromModule = async (req, res) => {
  try {
    const { id, courseId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res.status(400).json({
        success: false,
        message: "ID de module ou de cours invalide",
      });
    }

    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
      });
    }

    // Check if course is in module
    if (!module.cours.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Le cours n'est pas associé à ce module",
      });
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Remove course from module
      module.cours = module.cours.filter(
        (course) => course.toString() !== courseId
      );
      await module.save({ session });

      // Update course to remove module reference
      await Cours.findByIdAndUpdate(
        courseId,
        { $unset: { module: "" } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Cours retiré du module avec succès",
        data: module,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Impossible de retirer le cours du module",
      error: error.message,
    });
  }
};

module.exports = {
  getAllModules,
  getModule,
  addModule,
  updateModule,
  deleteModule,
  addCourseToModule,
  removeCourseFromModule,
};
