import { Socket } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { IUser } from "../models/userModel";

export interface SocketWithUser extends Socket {
  user?: IUser;
}

export const authMiddleware = (
  socket: SocketWithUser,
  next: (err?: any) => void
) => {
  const cookies = socket.handshake.headers.cookie;

  if (!cookies) {
    return next(new Error("No cookies found"));
  }

  const parsedCookies = cookie.parse(cookies);
  const token = parsedCookies["jwt"]; // Adjust the cookie name as necessary

  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user: any) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    socket.user = user;
    next();
  });
};
