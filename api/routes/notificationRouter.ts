import express from "express";

import { protect } from "../controllers/authController";
import {
  getNotificationsByUser,
  markAllNotificationsAsRead,
} from "../controllers/notificationController";

const notificationRouter = express.Router();

notificationRouter.get("/", protect, getNotificationsByUser);
notificationRouter.patch(
  "/mark-all-as-read",
  protect,
  markAllNotificationsAsRead
);

export default notificationRouter;
