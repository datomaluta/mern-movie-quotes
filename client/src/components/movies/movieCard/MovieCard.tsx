import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import LazyImageDisplay from "../../ui/sharedComponents/lazyImage/LazyImageDisplay";
import { Link } from "react-router-dom";
import { MovieType } from "../../../types/movie";
import { BsChatQuote } from "react-icons/bs";

const MovieCard = ({ movie }: { movie: MovieType }) => {
  const { lang } = useSelector((state: RootState) => state.lang);

  return (
    <Link
      to={`/movies/${movie._id}`}
      className="w-full max-w-[27.5rem] hover:bg-project-light-blue rounded-xl overflow-hidden group h-full flex flex-col transition-all"
    >
      <div className=" rounded-xl overflow-hidden h-[22rem] 2xl:h-[15.625rem] xl:h-[22rem] sm:h-[15.625rem] transition-all">
        <LazyImageDisplay imageUrl={movie?.poster} alt={movie?.title[lang]} />
      </div>

      <h1 className="text-xl md:text-lg font-helvetica-medium p-2 mt-3">
        {movie?.title[lang]}
      </h1>
      <p className="flex items-center gap-2 p-2 mt-auto">
        <span>{movie?.quotes?.length}</span>
        <BsChatQuote className="w-5 h-5" />
      </p>
    </Link>
  );
};

export default MovieCard;
