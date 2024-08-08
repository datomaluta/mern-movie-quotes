import { CommentFormDataToSendType } from "../types/comment";
import { instance } from "./axios";

export const createComment = async (data:CommentFormDataToSendType) => {
    return await instance.post("/comments", data);
};
