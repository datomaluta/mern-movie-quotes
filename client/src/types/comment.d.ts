import { UserType } from "./user";

export type CommentType = {
  _id: string;
  text: string;
  userId: UserType;
  quoteId: string;
};

export type CommentFormDataToSendType = {
  text: string;
  quoteId: string;
  userId?: string;
};

export type CommentFormDataType = {
  text: string;
};
