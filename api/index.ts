import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import movieRouter from "./routes/movieRoutes";
import { globalErrorHandler } from "./controllers/errorController";
import cookieParser from "cookie-parser";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";
import genreRouter from "./routes/genreRoutes";
import quoteRouter from "./routes/quoteRoutes";

dotenv.config();

mongoose
  .connect(process.env.MONGO as string)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, "locales/{{lng}}/{{ns}}.json"),
    },
    fallbackLng: "ka",
    preload: ["en", "ka"], // Preload the languages
    ns: ["translation"],
    defaultNS: "translation",
    detection: {
      order: ["querystring", "header", "cookie"],
      // caches: ["cookie"],
    },
    saveMissing: true,
    debug: false,
  });

app.use(express.json());
app.use(cookieParser());
app.use(middleware.handle(i18next));

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

app.get("/", (req: any, res: Response) => {
  res.send(req.t("title"));
  // res.send("text");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/genres", genreRouter);
app.use("/api/quotes", quoteRouter);

app.use(globalErrorHandler);
