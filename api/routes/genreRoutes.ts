import express from "express";
import { createGenre, getGenres } from "../controllers/genreController";

const genreRouter = express.Router();

genreRouter.post("/", createGenre);
genreRouter.get("/", getGenres);

export default genreRouter;
