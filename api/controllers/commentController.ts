import i18next from "i18next";
import Comment from "../models/commentModel";
import Quote from "../models/quoteModel";
import { CustomRequest } from "../types";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import mongoose from "mongoose";
import Notification from "../models/notificationModel";
import { emitNotification } from "../utils/socketHelper";

export const createComment = catchAsync(async (req: any, res, next) => {
  const { text, quoteId } = req.body;

  const newComment = await Comment.create({
    text,
    userId: req.user._id,
    quoteId,
  });

  const quote = await Quote.findByIdAndUpdate(quoteId, {
    $push: { comments: newComment._id },
  });

  if (!quote) {
    return next(
      new AppError(i18next.t("errors.No quote found with that ID"), 404)
    );
  }

  const notification = new Notification({
    recipient: quote.userId?._id?.toString(),
    sender: req.user._id?.toString(),
    type: "comment",
    quote: quoteId,
  });
  await notification.save();

  // req.io
  //   .to(quote.userId?._id?.toString())
  //   .emit("notification_comment", notification);
  emitNotification(
    quote.userId?._id?.toString(),
    "notification_comment",
    notification
  );

  res.status(201).json({
    status: "success",
    data: {
      comment: newComment,
    },
  });
});

export const editComment = catchAsync(async (req: CustomRequest, res, next) => {
  if (req.user.id !== req.body.userId) {
    return next(
      new AppError("errors.You are not allowed to edit this comment", 403)
    );
  }

  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!comment) {
    return next(
      new AppError(i18next.t("errors.No comment found with that ID"), 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      comment: comment,
    },
  });
});

export const deleteComment = catchAsync(
  async (req: CustomRequest, res, next) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(
        new AppError(i18next.t("errors.No comment found with that ID"), 404)
      );
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    if (!comment.userId._id.equals(userId)) {
      return next(
        new AppError("errors.You are not allowed to edit this comment", 403)
      );
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
