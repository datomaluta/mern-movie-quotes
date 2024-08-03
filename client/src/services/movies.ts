import { MovieFormDataToSendType } from "../types/movie";
import { instance } from "./axios";

export const getMovies = async ({
  page,
  queryString,
}: {
  page: number | string;
  queryString?: string;
}) => {
  return instance.get(
    `/movies?page=${page}&limit=3${queryString ? `&${queryString}` : ""}`
  );
};

export const createMovie = async (data: MovieFormDataToSendType) => {
  return await instance.post("/movies", data);
};
export const getMovie = async (id: string) => {
  return await instance.get(`/movies/${id}`);
};
