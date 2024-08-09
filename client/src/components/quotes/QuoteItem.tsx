import { useSelector } from "react-redux";
import UserImageAndName from "../ui/sharedComponents/UserImageAndName";
import { RootState } from "../../redux/store";
import { QuoteType } from "../../types/quote";
import { Link } from "react-router-dom";
import LazyImageDisplay from "../ui/sharedComponents/lazyImage/LazyImageDisplay";
import { VscComment } from "react-icons/vsc";
import QuoteLikesSection from "./QuoteLikesSection";
import QuoteCommentsSection from "./QuoteCommentsSection";

const QuoteItem = ({ quote }: { quote: QuoteType }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { lang } = useSelector((state: RootState) => state.lang);

  return (
    <div className="max-w-[961px] bg-project-dark-blue p-6 rounded-xl overflow-hidden">
      <UserImageAndName
        imgSrc={currentUser?.image || ""}
        userName={currentUser?.username || ""}
      />

      <div className=" mt-6 mb-6">
        <p className="inline-block break-all">"{quote?.text[lang]}"</p>
        <span className="mx-1">-</span>
        <Link
          className="text-project-yellow"
          to={`/movies/${quote?.movieId?._id}`}
        >
          {quote?.movieId?.title[lang]}
        </Link>
      </div>

      <div
        className={
          "h-[501px] md:h-[370px] sm:h-[240px] overflow-hidden rounded-lg"
        }
      >
        <LazyImageDisplay imageUrl={quote.image} alt={quote.text[lang]} />
      </div>

      <div className="flex gap-4 mt-6 border-b border-gray-700 pb-4">
        <p className="flex items-center gap-2">
          {quote?.comments?.length}
          <VscComment className="h-7 w-7" />
        </p>

        <QuoteLikesSection quoteId={quote._id} />
      </div>

      <QuoteCommentsSection comments={quote?.comments} quoteId={quote._id} />
    </div>
  );
};

export default QuoteItem;
