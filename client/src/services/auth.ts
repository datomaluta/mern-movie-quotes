import { instance } from "./axios";

export const signup = async (data: {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}) => {
  return await instance.post("/auth/signup", data);
};

export const verifyUser = async (verifyToken: string) => {
  return await instance.patch(`/auth/verify/${verifyToken}`);
};
