const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  adresse: { type: String, required: false, default: "" },
  active: { type: Boolean, default: false },
  role: { type: String, default: "formateur", enum: ["formateur", "admin"] },
  socials: {
    linkedin: { type: String, required: false, default: "" },
    website: { type: String, required: false, default: "" },
    github: { type: String, required: false, default: "" },
    bio: { type: String, required: false, default: "" },
  },
  profilePic: { type: String, required: false, default: "" },
  resetPasswordToken: { type: String, required: false },
  resetPasswordExpiresAt: { type: Date, required: false },
});

// Name validation
userSchema.methods.validName = async function (name) {
  const nameRegex = /^[a-zA-Z\s]{4,}$/;
  if (nameRegex.test(name)) return true;
  else
    throw new Error(
      "First name and last name must be at least 4 characters long and contain only letters and spaces!"
    );
};

// Email validation
userSchema.methods.validEmail = async function (email) {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (emailRegex.test(email)) return true;
  else throw new Error("Invalid email format!");
};

// Email exist
userSchema.statics.emailExists = async function (email) {
  return await this.findOne({ email });
};

// Match passwords
userSchema.methods.matchPassword = async function (password, confirmPassword) {
  if (password !== confirmPassword) throw new Error("Passwords do not match!");

  // Validate password format
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number."
    );
  }
  return true;
};

// Hash the password before saving only if it's modified
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(this.password)) {
      throw new Error(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number."
      );
    }
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password to db password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
