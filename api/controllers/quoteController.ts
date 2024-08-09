import i18next from "i18next";
import Quote from "../models/quoteModel";
import { CustomRequest } from "../types";
import APIFeatures from "../utils/apiFeatures";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import mongoose from "mongoose";

export const createQuote = catchAsync(async (req: CustomRequest, res, next) => {
  const { movieId, text, image } = req.body;

  const newQuote = await Quote.create({
    userId: req.user._id,
    movieId: movieId,
    text: {
      en: text.en,
      ka: text.ka,
    },
    image,
  });

  res.status(201).json({
    status: "success",
    data: {
      quote: newQuote,
    },
  });
});

export const getQuotes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Quote.find().populate({
      path: "comments",
      populate: {
        path: "userId",
      },
    }),
    req.query
  )
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const quotes = await features.query;

  res.status(200).json({
    status: "success",
    data: {
      quotes: quotes,
    },
  });
});

// export const getQuote = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const quote = await Quote.findById(id);

//   if (!quote) {
//     return next(new AppError(i18next.t("No quote found with that ID"), 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       quote: quote,
//     },
//   });
// });

export const getQuote = catchAsync(async (req, res, next) => {
  const { id: quoteId } = req.params;

  const quoteWithComments = await Quote.findById(quoteId)
    .populate("userId")
    .populate({
      path: "comments",
      populate: {
        path: "userId",
      },
    })
    .populate("movieId");

  if (!quoteWithComments) {
    return next(new AppError(i18next.t("No quote found with that ID"), 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      quote: quoteWithComments,
    },
  });
});

export const updateQuote = catchAsync(async (req, res, next) => {
  const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!quote) {
    return next(new AppError(i18next.t("No quote found with that ID"), 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      quote: quote,
    },
  });
});

export const deleteQuote = catchAsync(async (req, res, next) => {
  const quote = await Quote.findByIdAndDelete(req.params.id);

  if (!quote) {
    return next(new AppError(i18next.t("No quote found with that ID"), 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
