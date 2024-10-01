const {
  createUser,
  loginUser,
  changeUserRole,
  updateUser,
  deleteUser,
  getAllUser,
} = require("./service");
const { errors } = require("../../utils/customError");
const Roles = require("../../models/roles");
const Genders = require("../../models/genders");
const Religions = require("../../models/religions");
const { validateEmail } = require("../../middlewares/validate");

async function createUserHandler(req, res) {
  try {
    const userData = req.body;

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
      return res.status(errors.genderInvalid.statusCode).json({
        status: "error",
        message: errors.genderInvalid.message,
      });
    }

    const validReligion = await Religions.getReligionById(userData.religionId);
    if (!validReligion) {
      return res.status(errors.religionInvalid.statusCode).json({
        status: "error",
        message: errors.religionInvalid.message,
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

async function updateUserHandler(req, res) {
  const { id: userId } = req.params;
  const userUpdate = req.body;
  try {
    const result = await updateUser(userId, userUpdate);
    res.status(200).json({
      message: "User updated successfully",
      result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    res.status(400).json({
      message: error.message,
    });
  }
}

async function deleteUserHandler(req, res) {
  const userId = req.params.id;
  try {
    const userDelete = await deleteUser(userId);
    return res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteUserHandler:", error.message);
    res.status(400).json({ message: error.message });
  }
}

async function getAllUserHandler(req, res) {
  try {
    const userAll = await getAllUser();
    return res.status(200).json({
      status: "success",
      data: userAll,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
    });
  }
}
async function changeUserRoleHandler (req, res) {
  const { id: userId } = req.params;
  const { roleId } = req.body;
  try {
    const result = await changeUserRole(userId, roleId);

    return res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Failed to change role",
    });
  }
};

module.exports = {
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getAllUserHandler,
  loginHandler,
  changeUserRoleHandler,
};
