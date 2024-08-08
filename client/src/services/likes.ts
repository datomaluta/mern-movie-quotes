import { likeFormDataToSendType } from "../types/like";
import { instance } from "./axios";

export const likeQuote = async (data: likeFormDataToSendType) => {
  return await instance.post("/likes", data);
};

export const unlikeQuote = async (id: string) => {
  return await instance.delete(`/likes/${id}`);
};

export const getLikes = async (query: string) => {
  return await instance.get(`/likes?${query}`);
};
