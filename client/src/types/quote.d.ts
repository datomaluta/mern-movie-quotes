import { CommentType } from "./comment";
import { MovieType } from "./movie";

export type QuoteType = {
  _id: string;
  text: {
    en: string;
    ka: string;
  };
  movieId: MovieType;
  image: string;
  comments: CommentType[];
};

export type QuoteFormDataToSendType = {
  text: {
    en: string;
    ka: string;
  };
  movieId: string;
  image?: string;
};

export type QuoteFormDataType = {
  text_en: string;
  text_ka: string;
  movieId: string;
  image: string | FileList;
  imgUrl?: string;
};
