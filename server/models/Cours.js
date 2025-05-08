const mongoose = require("mongoose");

const coursSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, "Le titre du cours est obligatoire"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "La description du cours est obligatoire"],
  },
  formatContenu: {
    type: String,
    enum: ["video", "texte", "image", "pdf"],
    required: true,
  },
  contenu: {
    type: mongoose.Schema.Types.Mixed,
    required: function () {
      return this.formatContenu !== null;
    },
  },
  duree: {
    type: Number,
    required: [true, "La durée estimée est obligatoire"],
    min: [1, "La durée doit être supérieure à 0"],
  },
  ordrePublication: {
    type: Number,
    required: [true, "L'ordre de publication est obligatoire"],
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Le module est obligatoire"],
    ref: "Module",
  },
  statut: { type: String, default: "Brouillon", enum: ["Brouillon", "Publié"] },
  tags: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
});

// Index pour les recherches par tags et titre
coursSchema.index({ tags: 1, titre: 1 });

module.exports = mongoose.model("Cours", coursSchema);
