import express from "express";
import {
  createMovie,
  deleteMovie,
  getMovie,
  getMovies,
  updateMovie,
} from "../controllers/movieController";

const movieRouter = express.Router();

movieRouter.post("/", createMovie);
movieRouter.get("/:id", getMovie);
movieRouter.get("/", getMovies);
movieRouter.put("/:id", updateMovie);
movieRouter.delete("/:id", deleteMovie);

export default movieRouter;
