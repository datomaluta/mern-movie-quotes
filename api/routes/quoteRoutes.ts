import express from "express";
import { protect } from "../controllers/authController";
import {
  createQuote,
  deleteQuote,
  getQuote,
  getQuotes,
  updateQuote,
} from "../controllers/quoteController";

const quoteRouter = express.Router();

quoteRouter.post("/", protect, createQuote);
quoteRouter.get("/", protect, getQuotes);
quoteRouter.get("/:id", protect, getQuote);
quoteRouter.put("/:id", protect, updateQuote);
quoteRouter.delete("/:id", protect, deleteQuote);

export default quoteRouter;
