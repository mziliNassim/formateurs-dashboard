const Activities = require("../models/Activities");

const getAllactivities = async (req, res) => {
  try {
    const activities = await Activities.find();
    if (!activities) {
      return res.status(404).json({
        success: false,
        message: "Aucune activité trouvée",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Liste des activités récupérée avec succès",
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Impossible de récupérer les activités",
      error: error.message,
    });
  }
};

module.exports = { getAllactivities };
