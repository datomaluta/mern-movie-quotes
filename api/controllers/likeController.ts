import i18next from "i18next";
import Like from "../models/likeModel";
import { CustomRequest } from "../types";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import APIFeatures from "../utils/apiFeatures";

export const likeQuote = catchAsync(async (req: CustomRequest, res, next) => {
  const { quoteId } = req.body;

  // check if user already liked quote
  const alreadyLiked = await Like.findOne({
    userId: req.user._id,
    quoteId,
  });

  if (alreadyLiked) {
    return next(
      new AppError(i18next.t("errors.You already liked this quote"), 400)
    );
  }

  const newLike = await Like.create({
    userId: req.user._id,
    quoteId,
  });

  res.status(201).json({
    status: "success",
    data: {
      like: newLike,
    },
  });
});

export const unlikeQuote = catchAsync(async (req: CustomRequest, res, next) => {
  const { id: quoteId } = req.params;
  console.log(quoteId, req.user._id?.toString());

  const like = await Like.findOneAndDelete({
    quoteId: quoteId,
    userId: req.user._id,
  });

  if (!like) {
    return next(new AppError(i18next.t("No like found with that ID"), 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getLikes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Like.find(), req.query).filter().sort();

  const likes = await features.query;

  res.status(200).json({
    status: "success",
    results: likes.length,
    data: {
      likes: likes,
    },
  });
});
