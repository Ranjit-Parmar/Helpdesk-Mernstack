import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../model/userModel.js";
import CustomError from "../utils/customError.js";
import { generateToken } from "../utils/generateToken.js";
import { ApiFeatures } from "../utils/apiFeatures.js";
import { sendMail } from "../utils/sendMail.js";
import crypto from "crypto";


// Create User
export const createUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  const existingUser = await User.find({ email });

  if (!existingUser) {
    const err = CustomError("User not found. Please Register User", 404);
    next(err);
  }

  const userData = await User.create({
    username,
    email,
    password,
    role,
  });


  // Generate Token
  const jwt_token = generateToken(userData._id);

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: process.env.COOKIE_EXPIRE,
    sameSite: "none",
  };

  res.cookie("auth_token", jwt_token, options).status(201).json({
    success: true,
    message: "user created successfully",
    token: jwt_token,
    user: userData,
  });
});


// Login User
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // checking user input
  if (!email || !password) {
    const err = new CustomError("Please provide all the fields", 400);
    return next(err);
  }

  // find user in database
  const userData = await User.findOne({ email }).select("+password");

  if (!userData) {
    const err = new CustomError(
      "You are not registered user! Please Signup",
      401
    );
    return next(err);
  }

  // if user is exist then check password
  const decryptPass = await userData.comparePassword(password);

  if (!decryptPass) {
    const err = new CustomError("Invalid credential", 401);
    return next(err);
  }

  // if password is matched then generate token
  const jwt_token = generateToken(userData._id);

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: process.env.COOKIE_EXPIRE,
    sameSite: "none",
  };

  res.cookie("auth_token", jwt_token, options).status(200).json({
    success: true,
    message: "user login successfully",
    token: jwt_token,
    user: userData,
  });
});


// Load User
export const loadUser = asyncHandler(async (req, res, next) => {
  const activeUser = req.user;

  if (!activeUser) {
    res.status(401).json({
      success: false,
      message: "token expire! please login",
    });
  } else {
    res.status(200).json({
      success: true,
      user: activeUser,
    });
  }
});


// Get All Users
export const getAllUsers = asyncHandler(async (req, res, next) => {

  // const getAllUser = await User.find();
  const resultApiFeatures = new ApiFeatures(User.find(), req.query)
    .filter()
    .pagination();

  const getAllUser = await resultApiFeatures.query;

  if (!getAllUser) {
    const err = new CustomError("Users not found", 404);
    return next(err);
  }

  res.status(200).json({
    success: true,
    length: getAllUser.length,
    getAllUser,
  });
});


// Get Single User
export const getUser = asyncHandler(async (req, res, next) => {

  const { id } = req.params;

  const getUserById = await User.findById(id);

  if (!getUserById) {
    const err = new CustomError("User not found", 404);
    return next(err);
  }
  res.status(200).json({
    sucess: true,
    user: getUserById,
  });
});


// LOG OUT USER
export const logOutUser = asyncHandler(async (req, res, next) => {

  res.clearCookie("auth_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({
      success: true,
      message: "logout successfully",
    });
});


// Update User
export const updateUserRole = asyncHandler(async (req, res, next) => {
 
  const { id } = req.params;

  const {role}  = req.body;
 
  // find use with given ID
  const userExist = await User.findById(id);

  if (!userExist) {
    const err = new CustomError("User not found", 404);
    return next(err);
  }

  await User.findByIdAndUpdate(id, { role: role }, { new: true });

  res.status(200).json({
    success: true,
    message: "User Role Updated Successfully",
  });
});


// Delete User
export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // find use with given ID
  const userExist = await User.findById(id);

  if (!userExist) {
    const err = new CustomError("User not found", 404);
    return next(err);
  }

  // deleting user
  await User.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "user is deleted successfully",
  });
});

// Forgot Password
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  //    find user in database by email
  const userExist = await User.findOne({ email });

  if (!userExist) {
    const err = new CustomError("User not found", 404);
    return next(err);
  }

  //   call an intance method to generate reset token
  const token = await userExist.generatePasswordResetToken();

  await userExist.save();

  // send token to user's mail
  const sendMailInfo = await sendMail(userExist, token);

  if (!sendMailInfo) {
    const err = new CustomError(err.message, 404);
    return next(err);
  }

  res.status(200).json({
    success: true,
    message: sendMailInfo.messageId,
  });
});


// Reset Password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const token = req.params.id;
  const { password } = req.body;

  // token verification
  const verifyToken = crypto.createHash("sha256").update(token).digest("hex");

  // get user based on a token
  const getUserBaseOnToken = await User.findOne({
    passwordResetToken: verifyToken,
  }).select("+password");

  // check user has expiry token
  if(!getUserBaseOnToken){
    const err = new CustomError("Invalid Token! please try again", 500);
    return next(err);
  }
  // check token is still valid or not
  if (getUserBaseOnToken?.passwordResetTokenExpire > Date.now()) {
    getUserBaseOnToken.password = password;
    getUserBaseOnToken.passwordResetToken = undefined;
    getUserBaseOnToken.passwordResetTokenExpire = undefined;

    await getUserBaseOnToken.save();
  } else {
    getUserBaseOnToken.passwordResetToken = undefined;
    getUserBaseOnToken.passwordResetTokenExpire = undefined;
    await getUserBaseOnToken.save();

    const err = new CustomError(
      "Your password reset token has expired! please try again",
      500
    );
    return next(err);
  }

  res.status(200).json({
    success: true,
    message: "password reset successfully",
  });
});
