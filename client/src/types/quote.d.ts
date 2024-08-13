import { CommentType } from "./comment";
import { MovieType } from "./movie";
import { UserType } from "./user";

export type QuoteType = {
  _id: string;
  text: {
    en: string;
    ka: string;
  };
  movieId: MovieType;
  image: string;
  comments: CommentType[];
  userId: UserType | string;
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
