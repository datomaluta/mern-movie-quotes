import { Genre } from "./genre";
import { UserType } from "./user";

export type MovieType = {
  _id: string;
  userId: UserType;
  title: {
    en: string;
    ka: string;
  };
  poster: string;
  releaseYear: number;
  genreIds: Genre[];
  description: {
    en: string;
    ka: string;
  };
  director: {
    en: string;
    ka: string;
  };
  income: number;
};
