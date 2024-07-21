import express from "express";
import {
  verifyUser,
  signup,
  signin,
  forgotPassword,
  resetPassword,
  googleSignin,
} from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.patch("/verify/:verifyToken", verifyUser);
authRouter.post("/signin", signin);
authRouter.post("/forgot-password", forgotPassword);
authRouter.patch("/reset-password/:token", resetPassword);
authRouter.post("/google", googleSignin);

export default authRouter;
