import { instance } from "./axios";

export const updateMe = (data: {
  image: string;
  username: string;
  email: string;
}) => {
  return instance.put("/user/updateMe", data);
};

export const updateMyPassword = (data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) => {
  return instance.patch("/user/updateMyPassword", data);
};
