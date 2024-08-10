import { useTranslate } from "../hooks/useTranslate";
import MovieCard from "../components/movies/movieCard/MovieCard";
import { IoIosSearch } from "react-icons/io";
import { CiSquarePlus } from "react-icons/ci";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMovies } from "../services/movies";

import LoadingSpinnerWithWrapper from "../components/ui/sharedComponents/LoadingSpinnerWithWrapper";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MovieType } from "../types/movie";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Movies = () => {
  const { t } = useTranslate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [searchState, setSearchState] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryString = `search=${
    searchParams.get("search") || ""
  }&searchFields=${searchParams.get("searchFields") || ""}&${
    currentUser ? `userId=${currentUser._id}` : ""
  }`;
  const {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["movies", queryString],
    queryFn: ({ pageParam }) =>
      getMovies({
        page: pageParam,
        queryString,
      })?.then((res) => res.data?.data?.movies),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const nextPage = lastPage?.length ? allPages?.length + 1 : undefined;
      return nextPage;
    },
  });

  useEffect(() => {
    if (searchState.length === 0) {
      // setSearchParams({ search: "", searchFields: "" });
    }
  }, [searchState, setSearchParams]);

  return (
    <div>
      <div className="flex sm:flex-col justify-between items-center sm:items-start gap-6">
        <div className="flex justify-between w-max gap-4 bg- md:w-full items-center md:items-start ">
          <h1 className="text-xl md:text-base font-helvetica-medium">
            {t("my_list_of_movies")}
            <span className="md:block ml-1">
              ({t("total")} {"25"})
            </span>
          </h1>

          <button className="md:flex hidden items-center text-sm gap-1 bg-project-red hover:bg-project-dark-red px-4 py-2 rounded">
            <CiSquarePlus className="h-5 w-5" />
            {t("add")}
          </button>
        </div>

        <div className="flex gap-4 items-center md:hidden">
          <button
            className="flex items-center gap-1 border border-transparent hover:border-white rounded transition-all px-4 py-2"
            onClick={() =>
              setSearchParams({
                search: searchState,
                searchFields: "title.en,title.ka",
              })
            }
          >
            <IoIosSearch className="h-5 w-5" />
            {t("search")}
          </button>

          <Link
            to={"/movies/create"}
            className="flex shrink-0 items-center gap-1 bg-project-red hover:bg-project-dark-red px-4 py-2 rounded"
          >
            <CiSquarePlus className="h-5 w-5" />
            {t("add_movie")}
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          className="bg-transparent border-b border-project-gray py-1 w-full outline-none focus:border-b-slate-100 transition-all"
          placeholder={t("search_movie_placeholder")}
          onChange={(e) => setSearchState(e.target.value)}
        />
        <button
          className="md:flex hidden items-center gap-1 bg-project-light-blue px-4 py-1 rounded"
          onClick={() =>
            setSearchParams({
              search: searchState,
              searchFields: "title.en,title.ka",
            })
          }
        >
          <IoIosSearch className="h-5 w-5" />
          {t("search")}
        </button>
      </div>

      {status === "pending" && <LoadingSpinnerWithWrapper />}

      {movies && movies?.pages[0]?.length === 0 && (
        <h1 className="text-2xl font-bold text-center mt-20">
          {t("movies_not_found")}
        </h1>
      )}

      {status === "error" && (
        <h1 className="text-2xl font-bold text-center mt-20">
          {t("something_went_wrong")}
        </h1>
      )}

      <div className="mt-16 md:mt-10 grid grid-cols-3 xl:grid-cols-2 md:grid-cols-1 gap-10 place-items-center">
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
          {isFetchingNextPage ? `${t("loading")}...` : t("load_more")}
        </button>
      )}
    </div>
  );
};

export default Movies;
