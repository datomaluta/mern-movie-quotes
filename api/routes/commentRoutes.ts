import express from "express";
import { protect } from "../controllers/authController";
import { createComment } from "../controllers/commentController";

const commentRouter = express.Router();

commentRouter.post("/", protect, createComment);

export default commentRouter;
