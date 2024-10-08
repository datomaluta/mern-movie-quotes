import { useTranslate } from "../hooks/useTranslate";
import { useMutation } from "@tanstack/react-query";
import { MovieFormDataType } from "../types/movie";
import { createMovie } from "../services/movies";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MovieForm from "../components/movies/form/MovieForm";

const MovieCreate = () => {
  const { t } = useTranslate();

  const navigate = useNavigate();

  const { mutate: createMovieMutate, isPending: createMovieIsPending } =
    useMutation({
      mutationFn: createMovie,
      onSuccess: () => {
        toast.success(t("movie_create_successfully"));
        setTimeout(() => {
          navigate("/movies");
        }, 2000);
      },
    });

  const submitHandler = (data: MovieFormDataType) => {
    if (!data.imgUrl) {
      return;
    }

    const requestObj = {
      title: {
        en: data.title_en,
        ka: data.title_ka,
      },
      genreIds: data.genreIds.map((genre) => genre.id),
      releaseYear: data.releaseYear,
      director: {
        en: data.director_en,
        ka: data.director_ka,
      },
      income: data.income,
      description: {
        en: data.description_en,
        ka: data.description_ka,
      },
      poster: data.imgUrl,
    };

    createMovieMutate(requestObj);
  };

  return (
    <MovieForm
      submitHandler={submitHandler}
      actionLoading={createMovieIsPending}
      action="create"
    />
  );
};

export default MovieCreate;
