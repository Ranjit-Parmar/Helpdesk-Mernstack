import express from "express";

import { createUser, deleteUser, forgotPassword, resetPassword, getAllUsers, getUser, loginUser, logOutUser, updateUserRole, loadUser } from "../controller/userController.js";
import { authenticateUser, authorization } from "../middleware/authentication.js";

const router = express.Router();

// create users
router.post("/createUser", createUser);

// login users
router.post("/loginUser", loginUser);

// get all the users
router.get("/getAllUsers", authenticateUser, authorization, getAllUsers);

// load user
router.get("/loadUser", authenticateUser, loadUser);

// get single user by id
router.get("/getUser/:id", authenticateUser, getUser);

// logout user
router.get("/logOut", authenticateUser, logOutUser);

// update user
router.patch("/updateUserRole/:id", authenticateUser, authorization, updateUserRole);

// delete user
router.delete("/deleteUser/:id", authenticateUser, authorization, deleteUser); //later fixed out the issue

// forgot password
router.put("/forgotPassword", forgotPassword);

// reset password
router.post("/resetPassword/:id", resetPassword);

export default router;
