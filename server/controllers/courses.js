const Activities = require("../models/Activities");
const Cours = require("../models/Cours");
const mongoose = require("mongoose");
const Module = require("../models/Module");

const getAllCourses = async (req, res) => {
  try {
    const {
      module,
      formatContenu,
      tags,
      titre,
      statut,
      sortBy = "ordrePublication",
      order = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = {};

    if (module) filter.module = module;
    if (formatContenu) filter.formatContenu = formatContenu;
    if (statut) filter.statut = statut;
    if (titre) filter.titre = { $regex: titre, $options: "i" }; // Case-insensitive search
    if (tags) {
      // Handle comma-separated tags
      const tagArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagArray };
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sortBy] = order === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const courses = await Cours.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("module", "titre");

    // Get total count for pagination
    const total = await Cours.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les cours",
      error: error.message,
    });
  }
};

const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de cours invalide",
      });
    }

    const course = await Cours.findById(id).populate(
      "module",
      "titre description"
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
      message: "Cours récupéré avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Impossible de récupérer le cours",
      error: error.message,
    });
  }
};

const addCourse = async (req, res) => {
  try {
    const {
      titre,
      description,
      formatContenu,
      contenu,
      duree,
      ordrePublication,
      module,
      statut,
      tags,
    } = req.body;

    // Check for required module
    if (!module) {
      return res.status(400).json({
        success: false,
        message: "Le module est obligatoire",
      });
    }

    if (module && !mongoose.Types.ObjectId.isValid(module)) {
      return res.status(400).json({
        success: false,
        message: "ID du module invalide",
      });
    }

    // Create new course
    const newCourse = new Cours({
      titre,
      description,
      formatContenu,
      contenu,
      duree,
      ordrePublication,
      module,
      statut: statut || "Brouillon",
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
    });

    const savedCourse = await newCourse.save();

    // Handle activity action
    const activite = new Activities({
      title: "Création d'un cours",
      description: titre,
      type: "Create",
    });

    await activite.save();

    // add cours ID to module
    await Module.findByIdAndUpdate(module, {
      $push: { cours: savedCourse._id },
    });

    res.status(201).json({
      success: true,
      message: "Cours créé avec succès",
      data: savedCourse,
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
      message: "Impossible de créer le cours",
      error: error.message,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de cours invalide",
      });
    }

    // Check if module ID is valid if provided
    if (
      updateData.module &&
      !mongoose.Types.ObjectId.isValid(updateData.module)
    ) {
      return res.status(400).json({
        success: false,
        message: "ID du module invalide",
      });
    }

    // Handle tags if provided as string
    if (updateData.tags && !Array.isArray(updateData.tags)) {
      updateData.tags = updateData.tags.split(",").map((tag) => tag.trim());
    }

    const updatedCourse = await Cours.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé",
      });
    }

    // Update cours ID to module
    await Module.findByIdAndUpdate(updatedCourse.module, {
      $pull: { cours: updatedCourse._id },
    });

    await Module.findByIdAndUpdate(updatedCourse.module, {
      $push: { cours: updatedCourse._id },
    });

    res.status(200).json({
      success: true,
      message: "Cours mis à jour avec succès",
      data: updatedCourse,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Impossible de mettre à jour le cours",
      error: error.message,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de cours invalide",
      });
    }

    const deletedCourse = await Cours.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé",
      });
    }

    // delete cours ID to module
    await Module.findByIdAndUpdate(deletedCourse.module, {
      $pull: { cours: deletedCourse._id },
    });

    res.status(200).json({
      success: true,
      message: "Cours supprimé avec succès",
      data: deletedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Impossible de supprimer le cours",
      error: error.message,
    });
  }
};

const publierCours = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de cours invalide",
      });
    }

    const course = await Cours.findByIdAndUpdate(
      id,
      { statut: "Publié" },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cours publié avec succès",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Impossible de publier le cours",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  publierCours,
};
