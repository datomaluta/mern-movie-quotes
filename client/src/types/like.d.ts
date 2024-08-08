import { UserType } from "./user";

export type LikeType = {
  _id: string;
  userId: UserType;
  quoteId: string;
};

export type likeFormDataToSendType = {
  userId: string;
  quoteId: string;
};
