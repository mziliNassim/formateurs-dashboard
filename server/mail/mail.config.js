// mail.config.js
const nodemailer = require("nodemailer");

// Create a transporter using Mailtrap SMTP credentials
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILER_USER, // Your email
    pass: process.env.NODEMAILER_PASSWORD, // Your email password (or app-specific password)
  },
});

// Default sender configuration
const sender = {
  email: "web4jobs@gmail.com",
  name: "WEB4JOBS",
};

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification failed:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

module.exports = {
  sender,
  transporter,
};
