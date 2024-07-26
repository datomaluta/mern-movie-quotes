import i18next from "i18next";
import mongoose, { Document, Schema } from "mongoose";

interface IMovie extends Document {
  title: {
    en: string;
    ka: string;
  };
  poster: string;
  releaseYear: number;
  genreIds: mongoose.Types.ObjectId[];
  description: {
    en: string;
    ka: string;
  };
  director: {
    en: string;
    ka: string;
  };
  income: number;
}

const movieSchema: Schema<IMovie> = new mongoose.Schema({
  title: {
    en: {
      type: String,
      required: [true, i18next.t("required_field")],
    },
    ka: {
      type: String,
      required: [true, i18next.t("required_field")],
    },
  },
  poster: {
    type: String,
    required: [true, i18next.t("required_field")],
  },
  releaseYear: {
    type: Number,
    required: [true, i18next.t("required_field")],
  },
  genreIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
  description: {
    en: {
      type: String,
      required: [true, i18next.t("required_field")],
    },
    ka: {
      type: String,
      required: [true, i18next.t("required_field")],
    },
  },
  director: {
    en: {
      type: String,
      required: [true, i18next.t("required_field")],
    },
    ka: {
      type: String,
      required: [true, i18next.t("required_field")],
    },
  },
  income: {
    type: Number,
    required: [true, i18next.t("required_field")],
  },
});

const Movie = mongoose.model<IMovie>("Movie", movieSchema);

export default Movie;
