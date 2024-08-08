import express from "express";
import { protect } from "../controllers/authController";
import {
  createComment,
  deleteComment,
  editComment,
} from "../controllers/commentController";

const commentRouter = express.Router();

commentRouter.post("/", protect, createComment);
commentRouter.put("/:id", protect, editComment);
commentRouter.delete("/:id", protect, deleteComment);

export default commentRouter;
