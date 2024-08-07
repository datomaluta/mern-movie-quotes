import { MovieFormDataToSendType } from "../types/movie";
import { instance } from "./axios";

export const getMovies = async ({
  page,
  queryString,
}: {
  page?: number | string;
  queryString?: string;
}) => {
  return instance.get(
    `/movies?page=${page ? page : ""}&limit=${page ? 10 : ""}${
      queryString ? `&${queryString}` : ""
    }`
  );
};

export const createMovie = async (data: MovieFormDataToSendType) => {
  return await instance.post("/movies", data);
};
export const getMovie = async (id: string) => {
  return await instance.get(`/movies/${id}`);
};

export const updateMovie = async ({
  id,
  data,
}: {
  id: string;
  data: MovieFormDataToSendType;
}) => {
  return await instance.put(`/movies/${id}`, data);
};
export const deleteMovie = async (id: string) => {
  return await instance.delete(`/movies/${id}`);
};
