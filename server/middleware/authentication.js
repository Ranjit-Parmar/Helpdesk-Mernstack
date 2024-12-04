import User from "../model/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import CustomError from "../utils/customError.js";
import { verifyAccessToken } from "../utils/generateToken.js";


// check authentication
export const authenticateUser = asyncHandler(async (req, res, next) => {

  // checking if user has access token or not?
  const token = req.cookies?.auth_token;

  if (!token) {
    const err = new CustomError("you are not logged in, please login", 401);
    return next(err);
  }

  // if user hase token then verify token
  const verifyUser = verifyAccessToken(token);

  // find user is exist based on token id
  req.user = await User.findById(verifyUser.id);

  next();

});

// check authorization
export const authorization = asyncHandler(async (req, res, next) => {
  
  if (req.user.role !== "admin" && req.user.role !== "agent") {
    const err = new CustomError("Unauthorized access", 401);
    return next(err);
  }
  next();
});
