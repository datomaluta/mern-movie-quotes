import { instance } from "./axios";

export const signup = async (data: {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}) => {
  return await instance.post("/auth/signup", data);
};

export const verifyUser = async (verifyToken: string) => {
  return await instance.patch(`/auth/verify/${verifyToken}`);
};

export const signin = async (data: {
  email_or_username: string;
  password: string;
}) => {
  return await instance.post("/auth/signin", data);
};
