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
import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import Quote from "./models/quoteModel";
import Like from "./models/likeModel";
import Notification from "./models/notificationModel";
import cors from "cors";
import cookie from "cookie";
import notificationRouter from "./routes/notificationRouter";

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

// io.use((socket: any, next) => {
//   const cookies = socket.handshake.headers.cookie; // Get cookies from headers
//   const parsedCookies = cookie.parse(cookies || "");
//   const token = parsedCookies.jwt; // Assuming cookie name is 'token'

//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
//       if (err) return next(new Error("Authentication error"));
//       socket.user = decoded;
//       next();
//     });
//   } else {
//     next(new Error("Authentication error"));
//   }
// });

io.use((socket: any, next) => {
  const cookies = socket.handshake.headers.cookie;
  // console.log(cookies);

  if (!cookies) {
    // console.log("No cookies found");
    return next(new Error("No cookies found"));
  }

  const parsedCookies = cookie.parse(cookies);
  const token = parsedCookies["jwt"]; // Adjust the cookie name as necessary
  console.log(token);

  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user: any) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    console.log(user);
    socket.user = user;
    // socket.join(user.id);
    console.log("MIDDLEWARE HAPPENED");
    next();
  });
});

io.on("connection", (socket: any) => {
  console.log("Connected to socket.io ", socket.id);
  socket.join(socket.user.id);

  // socket.on("authenticate", (token: any) => {
  //   console.log("Token ", token);
  //   jwt.verify(
  //     token,
  //     process.env.JWT_SECRET as string,
  //     (err: any, user: any) => {
  //       if (err) {
  //         socket.disconnect("unauthorized");
  //       } else {
  //         socket.user = user;
  //         socket.join(user._id);
  //       }
  //     }
  //   );
  // });

  socket.on("message", (data: any) => {
    console.log(data);
    socket.broadcast.emit("receive_message", data);
    // io.broadcast("message", data);
  });

  socket.on("like", async (data: any) => {
    console.log("LIKEEE");
    if (!socket.user) {
      console.log("User not authenticated");
      return;
    }
    const { quoteId } = data;
    const userId = socket.user.id;
    // console.log(userId);

    try {
      const quote = await Quote.findById(quoteId);
      // console.log("QUOTEEE", quote);

      if (!quote) {
        socket.emit("error", "Quote not found");
        return;
      }

      const existingLike = await Like.findOne({
        userId: userId,
        quoteId: quoteId,
      });

      if (existingLike) {
        console.log("Existing like found");
        socket.emit("error", "You already liked this quote");
        return;
      }

      const notification = new Notification({
        recipient: quote.userId?._id?.toString(),
        sender: userId,
        type: "like",
        quote: quoteId,
      });
      await notification.save();

      const like = new Like({ userId: userId, quoteId });
      await like.save();

      console.log("SENT TO: ", quote.userId?._id?.toString());

      socket
        .to(quote.userId?._id?.toString())
        .emit("notification", notification);
      // socket.broadcast.emit("notification", "NOTIFICATION");
      // socket.broadcast.emit("receive_message", "HEHEHE");
    } catch (error) {
      socket.emit("error", "An error occurred while commenting on the quote");
      console.error(error);
    }
  });

  //   console.log("LIKEEE");
  //   if (!socket.user) {
  //     console.log("User not authenticated");
  //     return;
  //   }
  //   const { quoteId } = data;
  //   const userId = socket.user.id;

  //   try {
  //     const quote = await Quote.findById(quoteId);
  //     if (!quote) {
  //       socket.emit("error", "Quote not found");
  //       return;
  //     }

  //     const existingLike = await Like.findOne({
  //       userId: userId,
  //       quoteId: quoteId,
  //     });
  //     console.log(existingLike);
  //     if (existingLike) {
  //       console.log("Existing like found");
  //       socket.emit("error", "You already liked this quote");
  //       return;
  //     }

  //     const notification = new Notification({
  //       recipient: quote.userId,
  //       sender: userId,
  //       type: "like",
  //       quote: quoteId,
  //     });
  //     await notification.save();

  //     const like = new Like({ userId: userId, quoteId });
  //     await like.save();

  //     io.to(quote.userId.toString()).emit("notification", notification);
  //   } catch (error) {
  //     socket.emit("error", "An error occurred while commenting on the quote");
  //     console.error(error);
  //   }
  // });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
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
app.use("/api/comments", commentRouter);
app.use("/api/likes", likeRouter);
app.use("/api/notifications", notificationRouter);

app.use(globalErrorHandler);
