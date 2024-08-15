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
import commentRouter from "./routes/commentRoutes";
import likeRouter from "./routes/likeRoutes";
import { Server, Socket } from "socket.io";
import http from "http";
import cors from "cors";
import notificationRouter from "./routes/notificationRouter";
import { setupSocketRoutes } from "./routes/socketRoutes";

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
app.use(express.json());
app.use(cookieParser());
app.use(middleware.handle(i18next));
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  cookie: true,
});

setupSocketRoutes(io);

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, "locales/{{lng}}/{{ns}}.json"),
    },
    fallbackLng: "ka",
    preload: ["en", "ka"],
    ns: ["translation"],
    defaultNS: "translation",
    detection: {
      order: ["querystring", "header", "cookie"],
    },
    saveMissing: true,
    debug: false,
  });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/genres", genreRouter);
app.use("/api/quotes", quoteRouter);
app.use("/api/comments", commentRouter);
app.use("/api/likes", likeRouter);
app.use("/api/notifications", notificationRouter);

app.use(globalErrorHandler);
