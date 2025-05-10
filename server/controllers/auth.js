const crypto = require("crypto");

const User = require("../models/User.js");
const TokenBlacklist = require("../models/TokenBlacklist.js");

const { generateToken } = require("../middleware/auth.js");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Require all fields!",
        data: null,
      });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password!",
        data: null,
      });
    }

    // Set active to true if it was false
    if (!user.active) {
      user.active = true;
      await user.save();
    }

    const token = await generateToken(user);

    user.password = undefined;
    user.__v = undefined;

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      data: { user, token },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.token;
    const blacklistedToken = new TokenBlacklist({ token });
    await blacklistedToken.save();

    // Set active to false
    const user = req.user;
    if (user.active) {
      user.active = false;
      await user.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully", data: null });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

const getUserInfobyToken = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User information",
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const allowedUpdates = [
      "profilePic",
      "fName",
      "lName",
      "email",
      "adresse",
      "socials",
    ];
    const updates = req.body;
    const updateKeys = Object.keys(updates);

    const isValidOperation = updateKeys.every((key) =>
      allowedUpdates.includes(key)
    );
    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: "Invalid updates!",
        data: null,
      });
    }

    // Apply updates
    updateKeys.forEach((key) => {
      user[key] = updates[key];
    });

    // Validate if email is changed
    if (updates.email && updates.email !== user.email) {
      await user.validEmail(updates.email);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = req.user; // From auth middleware
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    // Verify that the old password is correct
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
        data: null,
      });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
        data: null,
      });
    }

    // Validate password format using regex directly in the controller
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
        data: null,
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

module.exports = {
  login,
  logout,
  getUserInfobyToken,
  updateProfile,
  updatePassword,
};
