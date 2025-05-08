const User = require("../models/User");

const getAllusers = async (req, res) => {
  try {
    const users = await User.find(); // récupérer tous les utilisateurs
    return res.status(200).json({
      success: true,
      message: "Utilisateurs récupérés avec succès",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer les utilisateurs",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // récupère l'id de l'utilisateur
    const user = await User.findByIdAndDelete(id);
    console.log(" deleteUser ~ req.params:", req.params);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'utilisateur",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      fName,
      lName,
      email,
      password,
      adresse,
      role,
      socials = {},
    } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email!",
      });
    }

    // Créer le nouvel utilisateur
    const newUser = new User({
      fName,
      lName,
      email,
      password: password,
      adresse,
      role,
      socials,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      data: newUser,
    });
  } catch (error) {
    console.error("Erreur lors de la création d'utilisateur:", error);
    res.status(500).json({
      success: false,
      message:
        error.message || "Erreur serveur lors de la création d'utilisateur",
      error: error.message,
    });
  }
};

const getUserInfoById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Informations de l'utilisateur récupérées avec succès",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'utilisateur",
      error: error.message,
    });
  }
};

const updateUserInfoById = async (req, res) => {
  try {
    const { id } = req.params; // récupérer l'id de l'utilisateur
    const updates = req.body; // récupérer les données à mettre à jour

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true, // retourne le document mis à jour
      runValidators: true, // valide les mises à jour avec le modèle Mongoose
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error: error.message,
    });
  }
};

module.exports = {
  getAllusers,
  deleteUser,
  createUser,
  getUserInfoById,
  updateUserInfoById,
};
