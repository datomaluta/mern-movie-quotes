import { useTranslate } from "../hooks/useTranslate";
import MovieCard from "../components/movies/movieCard/MovieCard";
import { IoIosSearch } from "react-icons/io";
import { CiSquarePlus } from "react-icons/ci";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMovies } from "../services/movies";
import { MovieType } from "../types/movie.t";
import LoadingSpinnerWithWrapper from "../components/ui/sharedComponents/LoadingSpinnerWithWrapper";

const Movies = () => {
  const { t } = useTranslate();
  const queryString = "";

  const {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["movies", queryString],
    queryFn: ({ pageParam }) =>
      getMovies({ page: pageParam, queryString })?.then(
        (res) => res.data?.data?.movies
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const nextPage = lastPage?.length ? allPages?.length + 1 : undefined;
      return nextPage;
    },
  });

  console.log(movies?.pages?.flat());

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-helvetica-medium">{`${t(
          "my_list_of_movies"
        )} (${t("total")} ${"25"})`}</h1>

        <div className="flex gap-8 items-center">
          <button className="flex items-center gap-1">
            <IoIosSearch className="h-5 w-5" />
            {t("search")}
          </button>

          <button className="flex items-center gap-1 bg-project-red hover:bg-project-dark-red px-4 py-2 rounded">
            <CiSquarePlus className="h-5 w-5" />
            {t("add_movie")}
          </button>
        </div>
      </div>

      {status === "pending" && <LoadingSpinnerWithWrapper />}
      <div className="mt-16 grid grid-cols-3 xl:grid-cols-2 md:grid-cols-1 gap-10 place-items-center">
        {/* <div className="w-full max-w-[440px]  hover:bg-project-light-blue  rounded-xl overflow-hidden group h-full flex flex-col">
          <div className=" bg-green-500 rounded-xl overflow-hidden max-h-[350px] h-auto">
            <img
              className="h-full w-full object-cover group-hover:scale-110 transition-all duration-300"
              src={
                "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"
              }
              alt="img"
            />
          </div>

          <h1 className="text-xl font-helvetica-medium  p-2">
            Movie Nameasdasdas asdasda dasdasda dad asdasd asd adasd asdasd
          </h1>
          <p className="flex items-center gap-2 p-2 mt-auto">
            <span>10</span>
            <BsChatQuote className="w-5 h-5" />
          </p>
        </div> */}

        {movies?.pages?.flat().map((movie: MovieType) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      {hasNextPage && (
        <button
          className="mt-8 mb-8 block text-center border border-white-shade dark:border-dark-gray-tint w-max mx-auto px-5 py-3 rounded-xl"
          disabled={isFetchingNextPage || !hasNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default Movies;
