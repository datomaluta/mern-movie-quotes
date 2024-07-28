import express from "express";
import {
  createMovie,
  deleteMovie,
  getMovie,
  getMovies,
  updateMovie,
} from "../controllers/movieController";
import { protect } from "../controllers/authController";

const movieRouter = express.Router();

movieRouter.post("/", protect, createMovie);
movieRouter.get("/:id", protect, getMovie);
movieRouter.get("/", protect, getMovies);
movieRouter.put("/:id", protect, updateMovie);
movieRouter.delete("/:id", protect, deleteMovie);

export default movieRouter;
