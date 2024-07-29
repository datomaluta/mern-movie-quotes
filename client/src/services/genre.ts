import { instance } from "./axios";

export const getGenres = async () => {
  return await instance.get("/genres");
};
