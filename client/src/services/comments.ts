import { CommentFormDataToSendType } from "../types/comment";
import { instance } from "./axios";

export const createComment = async (data: CommentFormDataToSendType) => {
  return await instance.post("/comments", data);
};

export const updateComment = async ({
  id,
  data,
}: {
  id: string;
  data: CommentFormDataToSendType;
}) => {
  return await instance.put(`/comments/${id}`, data);
};

export const deleteComment = async (id: string) => {
  return await instance.delete(`/comments/${id}`);
};
