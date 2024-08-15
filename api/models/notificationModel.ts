import mongoose, { Document, Schema } from "mongoose";

interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: string;
  quote: mongoose.Types.ObjectId;
  comment: mongoose.Types.ObjectId;
  isRead: boolean;
}

const notificationSchema: Schema<INotification> = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["like", "comment"],
    },
    quote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.pre<INotification>(/^find/, function (next) {
  this.populate("sender");
  next();
});

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;
