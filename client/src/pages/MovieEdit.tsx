import { useTranslate } from "../hooks/useTranslate";
import { useMutation } from "@tanstack/react-query";
import { MovieFormDataToSendType, MovieFormDataType } from "../types/movie";
import { updateMovie } from "../services/movies";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import MovieForm from "../components/movies/form/MovieForm";

const MovieEdit = () => {
  const { t } = useTranslate();
  const { id } = useParams();
  const navigate = useNavigate();

  const { mutate: updateMovieMutate, isPending: updateMovieIsPending } =
    useMutation({
      mutationFn: updateMovie,
      onSuccess: () => {
        toast.success(t("movie_updated_successfully"));
        setTimeout(() => {
          navigate(`/movies/${id}`);
        }, 2000);
      },
    });

  const submitHandler = (data: MovieFormDataType) => {
    let requestObj: MovieFormDataToSendType = {
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
    };

    if (data.imgUrl) {
      requestObj = {
        ...requestObj,
        poster: data.imgUrl,
      };
    }

    updateMovieMutate({
      id: id as string,
      data: requestObj,
    });
  };

  return (
    <MovieForm
      submitHandler={submitHandler}
      actionLoading={updateMovieIsPending}
      action="edit"
    />
  );
};

export default MovieEdit;
