import { UserType } from "./user";

export type NotificationType = {
  _id: string;
  recipient: string;
  sender: UserType;
  type: string;
  quote: string;
  comment: string;
  isRead: boolean;
  createdAt: string;
};
