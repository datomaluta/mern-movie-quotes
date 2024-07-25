import express from "express";
import { updateMe } from "../controllers/userController";
import { protect, updateMyPassword } from "../controllers/authController";

const userRouter = express.Router();

userRouter.put("/updateMe", protect, updateMe);
userRouter.patch("/updateMyPassword", protect, updateMyPassword);

export default userRouter;
