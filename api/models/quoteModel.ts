import mongoose, { Document, Schema } from "mongoose";

interface IQuote extends Document {
  userId: mongoose.Types.ObjectId;
  movieId: mongoose.Types.ObjectId;
  text: {
    en: string;
    ka: string;
  };
  image: string;
  comments: [mongoose.Types.ObjectId];
}

const quoteSchema: Schema<IQuote> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId_field_required"],
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: [true, "movieId_field_required"],
    },
    text: {
      en: {
        type: String,
        required: [true, "text_en_field_required"],
      },
      ka: {
        type: String,
        required: [true, "text_ka_field_required"],
      },
    },
    image: {
      type: String,
      required: [true, "image_field_required"],
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

quoteSchema.virtual("likes", {
  ref: "Like",
  foreignField: "quoteId",
  localField: "_id",
});

quoteSchema.pre<IQuote>(/^find/, function (next) {
  this.populate("userId");
  this.populate("movieId");
  next();
});

const Quote = mongoose.model<IQuote>("Quote", quoteSchema);

export default Quote;
