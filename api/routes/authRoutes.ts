import express from "express";
import { verifyUser, signup, signin } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.patch("/verify/:verifyToken", verifyUser);
authRouter.post("/signin", signin);

export default authRouter;
