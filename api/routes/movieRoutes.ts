import express from "express";
import { createMovie, getMovie } from "../controllers/movieController";

const movieRouter = express.Router();

movieRouter.post("/", createMovie);
movieRouter.get("/:id", getMovie);

export default movieRouter;
