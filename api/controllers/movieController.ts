import i18next from "i18next";
import Movie from "../models/movieModel";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import APIFeatures from "../utils/apiFeatures";
import { CustomRequest } from "../types";

export const createMovie = catchAsync(async (req: CustomRequest, res, next) => {
  const {
    title,
    poster,
    releaseYear,
    genreIds,
    description,
    director,
    income,
  } = req.body;

  const newMovie = await Movie.create({
    userId: req.user._id,
    title: {
      en: title.en,
      ka: title.ka,
    },
    poster,
    releaseYear: releaseYear,
    genreIds: genreIds,
    description: {
      en: description.en,
      ka: description.ka,
    },
    director: {
      en: director.en,
      ka: director.ka,
    },
    income,
  });

  res.status(201).json({
    status: "sucess",
    data: {
      movie: newMovie,
    },
  });
});

export const getMovies = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Movie.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const movies = await features.query;
  res.status(200).json({
    status: "success",
    results: movies.length,
    data: {
      movies: movies,
    },
  });
});

export const getMovie = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const lang = req.headers["accept-language"];

  const movie = await Movie.findById(id).populate("genreIds");

  if (!movie) {
    return next(new AppError(i18next.t("No movie found with that ID"), 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      movie: movie,
    },
  });
});

export const updateMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) {
    return next(new AppError(i18next.t("No movie found with that ID"), 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      movie: movie,
    },
  });
});

export const deleteMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) {
    return next(new AppError(i18next.t("No movie found with that ID"), 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
