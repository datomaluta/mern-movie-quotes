import express from "express";
import { verifyUser, signup } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.patch("/verify/:verifyToken", verifyUser);

export default authRouter;
