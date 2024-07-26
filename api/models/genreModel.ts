import i18next from "i18next";
import mongoose, { Schema } from "mongoose";

interface IGenre extends Document {
  name: {
    en: string;
    ka: string;
  };
}

const genreSchema: Schema<IGenre> = new mongoose.Schema({
  name: {
    en: {
      type: String,
      required: [true, i18next.t("required_field")],
    },
    ka: {
      type: String,
      required: [true, i18next.t("required_field")],
    },
  },
});

const Genre = mongoose.model<IGenre>("Genre", genreSchema);
export default Genre;
