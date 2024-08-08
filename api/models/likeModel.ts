import mongoose, { Schema, Document } from "mongoose";

interface ILike extends Document {
  userId: mongoose.Types.ObjectId;
  quoteId: mongoose.Types.ObjectId;
}

const LikeSchema: Schema<ILike> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId_field_required"],
    },
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      required: [true, "quoteId_field_required"],
    },
  },
  {
    timestamps: true,
  }
);

LikeSchema.pre<ILike>(/^find/, function (next) {
  this.populate("userId");
  //   this.populate("quoteId");
  next();
});

const Like = mongoose.model<ILike>("Like", LikeSchema);

export default Like;
