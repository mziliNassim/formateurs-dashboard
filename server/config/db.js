const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dashbord"
    );
    console.log("MongoDB connected successfully!");
    return true;
  } catch (err) {
    console.error(`MongoDB connected Failed! Error : ${err.message}`);
    return false;
    process.exit(1);
  }
};

module.exports = connectDB;
