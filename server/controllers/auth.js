const crypto = require("crypto");

const User = require("../models/User.js");
const TokenBlacklist = require("../models/TokenBlacklist.js");

const { generateToken } = require("../middleware/auth.js");
const {
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
} = require("../mail/emails.js");

const register = async (req, res) => {
  try {
    const { fName, lName, email, password, confirmPassword } = req.body;
    if (!fName || !lName || !email || !password || !confirmPassword)
      return res.status(400).json({
        success: false,
        message: "Require all fields!",
        data: null,
      });

    const user = new User(req.body);

    try {
      // Valid name
      await user.validName(fName);
      await user.validName(lName);

      // Valid Email
      await user.validEmail(email);

      // Password match
      await user.matchPassword(password, confirmPassword);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
        data: null,
      });
    }

    await user.save();
    const token = await generateToken(user);

    user.password = undefined;
    user.__v = undefined;

    // send Welcom Email
    await sendWelcomeEmail(user.email, user.fName, user.lName, user.role);

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      data: { user, token },
    });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({
        success: false,
        message: "Invalid Email format!",
        data: null,
      });

    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user || !email) {
      return res.status(500).json({
        success: false,
        message: "Invalid email address!",
        data: null,
      });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}auth/reset-password/${resetToken}`
    );

    return res.status(200).json({
      success: true,
      message: "Reset password link sent to your email",
      user: null,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        state: "warning",
        message: "Invalid or expired reset link",
      });
    }

    // hash && update Password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    return res.status(201).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

module.exports = { register, login, logout, forgotPassword, resetPassword };
