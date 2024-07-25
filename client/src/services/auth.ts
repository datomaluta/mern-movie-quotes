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

export const forgotPassword = async (data: { email: string }) => {
  return await instance.post("/auth/forgot-password", data);
};

export const resetPassword = async ({
  data,
  token,
}: {
  data: { password: string; confirm_password: string };
  token: string;
}) => {
  return await instance.patch(`/auth/reset-password/${token}`, data);
};

export const googleAuth = async (data: {
  username: string;
  email: string;
  googlePhotoUrl: string;
}) => {
  return await instance.post("/auth/google", data);
};

export const logout = async () => {
  return await instance.get("/auth/logout");
};
