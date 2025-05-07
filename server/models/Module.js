const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, "Le titre du module est obligatoire"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "La description du module est obligatoire"],
  },
  cours: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cours",
    },
  ],
  image: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Module", moduleSchema);
