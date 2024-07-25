import express from "express";
import {
  verifyUser,
  signup,
  signin,
  forgotPassword,
  resetPassword,
  googleSignin,
  logout,
} from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.patch("/verify/:verifyToken", verifyUser);
authRouter.post("/signin", signin);
authRouter.post("/forgot-password", forgotPassword);
authRouter.patch("/reset-password/:token", resetPassword);
authRouter.post("/google", googleSignin);
authRouter.get("/logout", logout);

export default authRouter;
