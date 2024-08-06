import { Genre } from "./genre";

export type MovieFormDataType = {
  title_en: string;
  title_ka: string;
  genreIds: { name: string; id: string }[];
  releaseYear: string;
  director_en: string;
  director_ka: string;
  description_en: string;
  description_ka: string;
  poster: string | FileList;
  income: string;
  imgUrl?: string;
};

export type MovieFormDataToSendType = {
  title: {
    en: string;
    ka: string;
  };
  genreIds: string[];
  releaseYear: string;
  director: {
    en: string;
    ka: string;
  };
  description: {
    en: string;
    ka: string;
  };
  poster?: string;
  income: string;
};

export type MovieType = {
  _id: string;
  userId: UserType;
  title: {
    en: string;
    ka: string;
  };
  poster: string;
  releaseYear: string;
  genreIds: Genre[];
  description: {
    en: string;
    ka: string;
  };
  director: {
    en: string;
    ka: string;
  };
  income: string;
};
