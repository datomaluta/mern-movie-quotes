import { Server } from "socket.io";
import { authMiddleware } from "../middlewares/authMiddleware";
import { onConnection } from "../controllers/socketController";

export const setupSocketRoutes = (io: Server) => {
  io.use(authMiddleware);
  io.on("connection", onConnection);
};
