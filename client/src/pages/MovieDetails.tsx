import { useQuery } from "@tanstack/react-query";
import { useTranslate } from "../hooks/useTranslate";
import { useParams } from "react-router-dom";
import { getMovie } from "../services/movies";
import LoadingSpinnerWithWrapper from "../components/ui/sharedComponents/LoadingSpinnerWithWrapper";
import { MovieType } from "../types/movie.t";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import LazyImageDisplay from "../components/ui/sharedComponents/lazyImage/LazyImageDisplay";
import { CiSquarePlus } from "react-icons/ci";
import { VscComment } from "react-icons/vsc";
import { IoMdHeartEmpty } from "react-icons/io";
import { RxDotsHorizontal } from "react-icons/rx";
// import { FaRegEye } from "react-icons/fa";

const MovieDetails = () => {
  const { t } = useTranslate();
  const { id } = useParams();
  const { lang } = useSelector((state: RootState) => state.lang);

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery<MovieType>({
    queryKey: ["movie", id],
    queryFn: () => getMovie(id as string).then((res) => res.data?.data?.movie),
    enabled: !!id,
  });

  console.log(isError);

  return (
    <div className="">
      <h1 className="text-xl md:text-base font-helvetica-medium mb-4">
        {t("movie_details")}
      </h1>
      {isLoading && <LoadingSpinnerWithWrapper />}
      {isError && <p className="text-center">{t("something_went_wrong")}</p>}
      {movie && (
        <div className="flex gap-4 md:flex-col">
          <div className="w-[60%] md:w-full h-[441px] sm:h-[300px] rounded-lg overflow-hidden">
            <LazyImageDisplay imageUrl={movie.poster} alt={movie.title[lang]} />
          </div>
          <div className="w-[40%] md:w-full">
            <div className="flex justify-between gap-4 items-center mb-6">
              <h1 className="text-project-yellow font-helvetica-medium">
                <span className="mr-2">{movie?.title[lang]}</span>
                <span>({movie?.releaseYear})</span>
              </h1>
              <div className="flex items-center gap-1 bg-project-light-blue rounded-lg overflow-hidden shrink-0">
                <button className="hover:bg-project-dark-blue py-2 px-4">
                  <MdOutlineModeEditOutline />
                </button>
                <span className="block h-[14px] w-[0.2px] bg-project-gray"></span>
                <button className="hover:bg-project-dark-blue py-2 px-4">
                  <RiDeleteBin6Line />
                </button>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap mb-6">
              {movie?.genreIds?.map((genre) => (
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
      )}

      <div className="flex gap-3 items-center mt-10">
        <p>
          {t("quotes")} <span>({t("total")} 7)</span>
        </p>
        <span className="block h-[18px] w-[0.2px] bg-project-gray"></span>
        <button className="flex shrink-0 items-center gap-1 bg-project-red hover:bg-project-dark-red px-4 py-2 rounded">
          <CiSquarePlus className="h-5 w-5" />
          {t("add_quote")}
        </button>
      </div>

      <div className="flex flex-col w-[60%] 2xl:w-full mt-8">
        <div className="bg-project-dark-blue px-6 py-6 rounded-lg relative">
          <button className="absolute top-[4%] right-[2%]">
            <RxDotsHorizontal className="h-6 w-6" />
          </button>
          {/* <div className="flex flex-col gap-4 bg-project-light-blue rounded p-6 absolute top-[15%] -right-28 2xl:right-0">
            <button className="flex gap-4 items-center">
              <FaRegEye />
              {t("view_quote")}
            </button>
            <button className="flex gap-4 items-center">
              <MdOutlineModeEditOutline />
              {t("edit")}
            </button>
            <button className="flex gap-4 items-center">
              <RiDeleteBin6Line />
              {t("delete")}
            </button>
          </div> */}
          <div className="border-b border-gray-700 flex pb-6 gap-8 items-center sm:flex-col">
            <div className="h-[140px] sm:h-[200px] w-[226px] sm:w-full shrink-0 rounded overflow-hidden">
              <img
                className="h-full w-full object-cover"
                src="https://firebasestorage.googleapis.com/v0/b/movie-quotes-34603.appspot.com/o/1722683758327Screenshot_67.jpg?alt=media&token=d43b0f7c-a96e-4ca0-8f2c-169b20f48b35"
                alt=""
              />
            </div>
            <div>
              <p className="text-gray-400 text-2xl md:text-xl italic line-clamp-3 ">
                "Following their explosive showdown, Godzilla and Kong must"
              </p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <p className="flex items-center gap-2">
              3<VscComment className="h-7 w-7" />
            </p>
            <p className="flex items-center gap-2">
              10
              <IoMdHeartEmpty className="h-7 w-7" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
