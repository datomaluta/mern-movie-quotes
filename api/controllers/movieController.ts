import Movie from "../models/movieModel";
import { catchAsync } from "../utils/catchAsync";

export const createMovie = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.headers["accept-language"]);
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

export const getMovie = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const lang = req.headers["accept-language"];
  console.log(lang);

  const movie = await Movie.findById(id).populate("genreIds");
  res.status(200).json({
    status: "success",
    data: {
      movie: movie,
    },
  });
});
