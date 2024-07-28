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

const movieSchema: Schema<IMovie> = new mongoose.Schema(
  {
    title: {
      en: {
        type: String,
        required: [true, "title_en_field_required"],
        unique: true,
      },
      ka: {
        type: String,
        required: [true, "title_ka_field_required"],
        unique: true,
      },
    },
    poster: {
      type: String,
      required: [true, "poster_field_required"],
    },
    releaseYear: {
      type: Number,
      required: [true, "releaseYear_field_required"],
    },
    genreIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
        required: [true, "genreIds_field_required"],
      },
    ],
    description: {
      en: {
        type: String,
        required: [true, "description_en_field_required"],
      },
      ka: {
        type: String,
        required: [true, "description_ka_field_required"],
      },
    },
    director: {
      en: {
        type: String,
        required: [true, "director_en_field_required"],
      },
      ka: {
        type: String,
        required: [true, "director_ka_field_required"],
      },
    },
    income: {
      type: Number,
      required: [true, "income_field_required"],
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model<IMovie>("Movie", movieSchema);

export default Movie;
