class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const err = {
  invalidEmail: {
    message: "Invalid email format",
    statusCode: 400,
  },
  requiredEmailPassword: {
    message: "Email and password are required",
    statusCode: 400,
  },
  requiredTokenRefresh: {
    message: "Refresh token is required",
    statusCode: 400,
  },
  invalidTokenRefresh: {
    message: "Invalid refresh token",
    statusCode: 400,
  },
  invalidPassword: {
    message: "Invalid password",
    statusCode: 400,
  },
  unauthorized: {
    message: "Unauthorized access",
    statusCode: 401,
  },
  userNotFound: {
    message: "User not found",
    statusCode: 404,
  },
  internalServerError: {
    message: "Internal Server Error",
    statusCode: 500,
  },
  notFound: {
    message: "Resource not found",
    statusCode: 404,
  },
  roleGenderReligionNotFound: {
    message: "Invalid role, gender, or religion ID",
    statusCode: 404,
  },
  roleInvalid: {
    message: "invalid role",
    statusCode: 400,
  },
  genderInvalid: {
    message: "invalid gender",
    statusCode: 400,
  },
  religionInvalid: {
    message: "invalid religion",
    statusCode: 400,
  },
  emailAlready: {
    message: "Email is already registered. Please use another email",
    statusCode: 409,
  },
  failedCreate: {
    message: "Failed to create user",
    statusCode: 500,
  },
  failedUpdate: {
    message: "Failed to update user",
    statusCode: 500,
  },
  failedDelete: {
    message: "Failed to delete user",
    statusCode: 500,
  },
  failedRoles: {
    message: "Failed to create role",
    statusCode: 500,
  },
  failedReligion: {
    message: "Failed to create religion",
    statusCode: 500,
  },
  failedGender: {
    message: "Failed to create gender",
    statusCode: 500,
  },
  changeRole: {
    message: "Failed to change user role",
    statusCode: 500,
  },
  errGet: {
    message: "Failed to fetch users",
    statusCode: 500,
  },
  errLogin: {
    message: "An error occurred during login",
    statusCode: 500,
  },
  incorrectPass: {
    message: "Incorrect password",
    statusCode: 401,
  },
  updatePass: {
    message: "Password needs to be updated. Please contact administrator",
    statusCode: 400,
  },
  dataError: {
    message: "Database Error",
    statusCode: 500,
  },
  authError: {
    message: "Authentication error",
    statusCode: 500,
  },
  logoutErr: {
    message: "Failed to logout",
    statusCode: 400,
  },
  cannotLogout: {
    message: "An error occurred during logout",
    statusCode: 500,
  },
};

module.exports = {
  CustomError,
  err,
};
