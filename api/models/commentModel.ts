import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  quoteId: mongoose.Types.ObjectId;
  text: string;
}

const CommentSchema: Schema<IComment> = new mongoose.Schema(
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
    text: {
      type: String,
      required: [true, "text_field_required"],
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.pre<IComment>(/^find/, function (next) {
  this.populate("userId");
//   this.populate("quoteId");
  next();
});

const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
