const moment = require("moment");
const forgotPassword = require("../models/forgot_password");
const Users = require("../models/users");
const { sendResetPasswordEmail } = require("../utils/send_email");
const { hashPassword } = require("../utils/bcrypt");
const { generateResetToken, verifyJWT } = require("../utils/jwt");
const { validateEmail } = require("../middlewares/validate");
const { err } = require(`../utils/customError`);

async function requestResetPassword(req, res) {
  const { email } = req.body;
  try {
    if (!validateEmail(email)) {
      return new Error("invalid email");
    }
    const user = await Users.getUserByEmail(email);
    if (user === undefined) {
      throw new Error("User not found with the provided email address");
    }
    const resetToken = await generateResetToken(user);
    console.log(resetToken);
    const expiredDate = moment().add(1, "hours").toDate();
    await forgotPassword.createResetToken(user.id, resetToken, expiredDate);

    await sendResetPasswordEmail(email, resetToken);

    return res.status(200).json({
      message: "Request successful",
      data: { email },
    });
  } catch (error) {
    res.status(err.errorRequest.statusCode).json({
      message: err.errorRequest.message,
      error: error.message,
    });
  }
}

async function resetPassword(req, res) {
  const { id: userId } = req.params;
  const newPassword = req.body;
  try {
    const verify = await verifyJWT(token);
    const user = await Users.getUserById(verify.userId);
    if (user === undefined) {
      throw new Error("Invalid credentials");
    }
    const hashedPassword = await hashPassword(newPassword);
    await Users.updatePassword(user.id, hashedPassword);
    return res.status(200).json({
      message: "password updated successfully",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expired");
    }
    res.status(err.errorReset.statusCode).json({
      message: err.errorReset.message,
      error: error.message,
    });
  }
}
module.exports = {
  requestResetPassword,
  resetPassword,
};
