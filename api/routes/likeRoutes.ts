import express from "express";
import { protect } from "../controllers/authController";
import { getLikes, likeQuote, unlikeQuote } from "../controllers/likeController";

const likeRouter = express.Router();

likeRouter.post("/", protect, likeQuote);
likeRouter.delete("/:id", protect, unlikeQuote);
likeRouter.get("/", protect, getLikes);

export default likeRouter;
