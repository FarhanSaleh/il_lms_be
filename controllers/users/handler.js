const { createUser, loginUser } = require("./service");
const { errors } = require("../../utils/customError");
const Roles = require("../../models/roles");
const Genders = require("../../models/genders");
const Religions = require("../../models/religions");
const { validateEmail } = require("../../middlewares/validate");

async function createUserHandler(req, res) {
  try {
    const userData = req.body;
    console.log("User Data received:", userData);

    const requiredFields = [
      "username",
      "email",
      "password",
      "profile_image",
      "fullName",
      "phone_Number",
      "address",
      "institute",
      "date_of_birth",
      "roleId",
      "genderId",
      "religionId",
    ];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return res.status(400).json({
          status: "error",
          message: `Field ${field} is required.`,
        });
      }
    }

    if (!validateEmail(userData.email)) {
      return res.status(errors.invalidEmail.statusCode).json({
        status: "error",
        message: errors.invalidEmail.message,
      });
    }

    const validRole = await Roles.getRoleById(userData.roleId);
    if (!validRole) {
      return res.status(errors.roleInvalid.statusCode).json({
        status: "error",
        message: errors.roleInvalid.message,
      });
    }

    const validGender = await Genders.getGenderById(userData.genderId);
    if (!validGender) {
      return res.status(errors.genderNotFound.statusCode).json({
        status: "error",
        message: errors.genderNotFound.message,
      });
    }

    const validReligion = await Religions.getReligionById(userData.religionId);
    if (!validReligion) {
      return res.status(errors.religionNotFound.statusCode).json({
        status: "error",
        message: errors.religionNotFound.message,
      });
    }

    const userId = await createUser(userData);
    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: { userId },
    });
  } catch (error) {
    console.error("Error in createUserHandler:", error);
    return res.status(errors.internalServerError.statusCode).json({
      status: "error",
      message: errors.internalServerError.message,
    });
  }
}

async function loginHandler(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(errors.requiredEmailPassword.statusCode).json({
      status: "error",
      message: errors.requiredEmailPassword.message,
    });
  }

  try {
    console.log("Attempting to login user:", email);
    const { token, refreshToken, user } = await loginUser(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { token, user },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res
      .status(error.statusCode || errors.internalServerError.statusCode)
      .json({
        status: "error",
        message: error.message || errors.internalServerError.message,
        details: error.details || null,
      });
  }
}

module.exports = {
  createUserHandler,
  loginHandler,
};
