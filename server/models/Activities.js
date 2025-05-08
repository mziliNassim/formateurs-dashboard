const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Le titre de l'activité est obligatoire"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "La description de l'activité est obligatoire"],
  },
  type: {
    type: String,
    enum: ["Create", "Update", "Delete"],
    required: [true, "Le type d'activité est obligatoire"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 259200 }, // 3 days in seconds
  },
});

// TTL index for automatic deletion
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 259200 });

module.exports = mongoose.model("Activity", activitySchema);
