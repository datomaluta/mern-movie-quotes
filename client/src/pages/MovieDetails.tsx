import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslate } from "../hooks/useTranslate";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteMovie, getMovie } from "../services/movies";
import LoadingSpinnerWithWrapper from "../components/ui/sharedComponents/LoadingSpinnerWithWrapper";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import LazyImageDisplay from "../components/ui/sharedComponents/lazyImage/LazyImageDisplay";
import { CiSquarePlus } from "react-icons/ci";
import { useState } from "react";
import toast from "react-hot-toast";
import { GenreType } from "../types/genre";
import { MovieType } from "../types/movie";
import { AnimatePresence } from "framer-motion";
import QuotesList from "../components/quotes/QuotesList";
import DeleteModal from "../components/ui/sharedComponents/DeleteModal";
import { QuoteType } from "../types/quote";
import { getQuotes } from "../services/quote";

const MovieDetails = () => {
  const { t } = useTranslate();
  const { id } = useParams();
  const { lang } = useSelector((state: RootState) => state.lang);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery<MovieType>({
    queryKey: ["movie", id],
    queryFn: () => getMovie(id as string).then((res) => res.data?.data?.movie),
    enabled: !!id,
  });

  const {
    data: movieQuotes,
    isLoading: isLoadingMovieQuotes,
    isError: isErrorMovieQuotes,
  } = useQuery<QuoteType[]>({
    queryKey: ["movie-quotes", id],
    queryFn: () =>
      getQuotes({ queryString: `movieId=${id}` }).then(
        (res) => res.data?.data?.quotes
      ),
    enabled: !!id,
  });

  const { mutate: movieDeleteMutate, isPending: deleteIsLoading } = useMutation(
    {
      mutationFn: () => deleteMovie(id as string),
      onSuccess: () => {
        setDeleteModalIsOpen(false);
        setTimeout(() => {
          navigate("/movies");
        }, 1000);
        toast.success(t("movie_deleted_successfully"));
      },
      onError: () => {
        toast.error(t("something_went_wrong"));
      },
    }
  );

  return (
    <div className="">
      <h1 className="text-xl md:text-base font-helvetica-medium mb-4">
        {t("movie_details")}
      </h1>
      <AnimatePresence>
        {deleteModalIsOpen && (
          <DeleteModal
            setDeleteModalIsOpen={setDeleteModalIsOpen}
            onSubmit={() => movieDeleteMutate()}
            deleteIsLoading={deleteIsLoading}
          />
        )}
      </AnimatePresence>
      {(isLoading || isLoadingMovieQuotes) && <LoadingSpinnerWithWrapper />}
      {(isError || isErrorMovieQuotes) && (
        <p className="text-center">{t("something_went_wrong")}</p>
      )}
      {movie && movieQuotes && (
        <>
          <div className="flex gap-4 md:flex-col">
            <div className="w-[60%] md:w-full h-[27.5rem] sm:h-[18.75rem] rounded-lg overflow-hidden">
              <LazyImageDisplay
                imageUrl={movie.poster}
                alt={movie.title[lang]}
              />
            </div>
            <div className="w-[40%] md:w-full">
              <div className="flex justify-between gap-4 items-center mb-6">
                <h1 className="text-project-yellow font-helvetica-medium">
                  <span className="mr-2">{movie?.title[lang]}</span>
                  <span>({movie?.releaseYear})</span>
                </h1>
                <div className="flex items-center gap-1 bg-project-light-blue rounded-lg overflow-hidden shrink-0">
                  <Link
                    to={`/movies/edit/${movie._id}`}
                    className="hover:bg-project-dark-blue py-2 px-4"
                  >
                    <MdOutlineModeEditOutline />
                  </Link>
                  <span className="block h-[0.875rem] w-[0.2px] bg-project-gray"></span>
                  <button
                    onClick={() => setDeleteModalIsOpen(true)}
                    className="hover:bg-project-dark-blue py-2 px-4"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap mb-6">
                {movie?.genreIds?.map((genre: GenreType) => (
                  <p
                    className="bg-project-gray px-3 py-1 rounded font-helvetica-medium text-sm"
                    key={genre?._id}
                  >
                    {genre?.name[lang]}
                  </p>
                ))}
              </div>

              <p className="mb-6 text-gray-400 flex gap-2">
                {t("director")}:
                <span className="font-helvetica-medium text-white">
                  {movie?.director[lang]}
                </span>
              </p>

              <p className="leading-7 text-gray-400">
                {movie?.description[lang]}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center mt-10">
            <p>
              {t("quotes")}
              <span className="ml-1">
                ({t("total")} {movie?.quotes?.length})
              </span>
            </p>
            <span className="block h-[1.125rem] w-[0.2px] bg-project-gray"></span>
            <Link
              to={`/movies/${movie?._id}/quotes/create`}
              className="flex shrink-0 items-center gap-1 bg-project-red hover:bg-project-dark-red px-4 py-2 rounded"
            >
              <CiSquarePlus className="h-5 w-5" />
              {t("add_quote")}
            </Link>
          </div>
          <QuotesList quotes={movieQuotes} />
        </>
      )}
    </div>
  );
};

export default MovieDetails;
