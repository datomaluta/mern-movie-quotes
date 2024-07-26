import express from "express";
import { createGenre } from "../controllers/genreController";

const genreRouter = express.Router();

genreRouter.post("/", createGenre);

export default genreRouter;
