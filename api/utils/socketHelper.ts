import { io } from "./../index";
import { INotification } from "../models/notificationModel";

export const emitNotification = (
  recepientId: string,
  emitKey: string,
  notification: INotification
) => {
  io.to(recepientId).emit(emitKey, notification);
};
