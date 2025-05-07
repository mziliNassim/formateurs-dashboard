const {
  PASSWORD_WELCOME_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} = require("./emailTemplates.js");

const { transporter, sender } = require("./mail.config.js");

const sendWelcomeEmail = async (email, fName, lname, role) => {
  try {
    const mailOptions = {
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Welcome to our website",
      html: PASSWORD_WELCOME_TEMPLATE.replace("{email}", email)
        .replace("{fName}", fName)
        .replace("{lName}", lname)
        .replace("{role}", role), // ["admin", "formateur"]
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};

const sendResetPasswordEmail = async (email, resetURL) => {
  try {
    const mailOptions = {
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        "{resetURL}",
        resetURL
      ).replace("{clientURL}", process.env.CLIENT_URL),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};

const sendResetSuccessEmail = async (email) => {
  try {
    const mailOptions = {
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace(
        "{clientURL}",
        process.env.CLIENT_URL
      ),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`Error sending Reset Success Email: ${error.message}`);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
};
