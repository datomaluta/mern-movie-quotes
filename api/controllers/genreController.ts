import Genre from "../models/genreModel";
import { catchAsync } from "../utils/catchAsync";

export const createGenre = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const newGenre = await Genre.create({
    name: {
      en: name.en,
      ka: name.ka,
    },
  });

  res.status(201).json({
    status: "sucess",
    data: {
      genre: newGenre,
    },
  });
});
