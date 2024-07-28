import { instance } from "./axios";

export const getMovies = async ({
  page,
  queryString,
}: {
  page: number | string;
  queryString?: string;
}) => {
  return instance.get(
    `/movies?page=${page}&limit=3&${queryString ? `&${queryString}` : ""}`
  );
};
