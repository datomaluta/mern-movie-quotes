import i18next from "i18next";
import Comment from "../models/commentModel";
import Quote from "../models/quoteModel";
import { CustomRequest } from "../types";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import mongoose from "mongoose";

export const createComment = catchAsync(
  async (req: CustomRequest, res, next) => {
    const { text, quoteId } = req.body;

    const newComment = await Comment.create({
      text,
      userId: req.user._id,
      quoteId,
    });

    await Quote.findByIdAndUpdate(quoteId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json({
      status: "success",
      data: {
        comment: newComment,
      },
    });
  }
);

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
