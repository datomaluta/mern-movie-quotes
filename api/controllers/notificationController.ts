import Notification from "../models/notificationModel";
import { CustomRequest } from "../types";
import { catchAsync } from "../utils/catchAsync";

export const getNotificationsByUser = catchAsync(
  async (req: CustomRequest, res, next) => {
    const notifications = await Notification.find({
      recipient: req.user._id,
    }).sort("-createdAt");
    res.status(200).json({
      status: "success",
      data: {
        notifications: notifications,
      },
    });
  }
);

export const markAllNotificationsAsRead = catchAsync(
  async (req: CustomRequest, res, next) => {
    const notifications = await Notification.updateMany(
      { recipient: req.user._id },
      { isRead: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        notifications: notifications,
      },
    });
  }
);
