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
  const { lang } = useSelector((state: RootState) => state.lang);

  return (
    <div className="max-w-[60rem] bg-project-dark-blue p-6 rounded-xl overflow-hidden">
      <UserImageAndName
        imgSrc={
          quote?.userId && typeof quote.userId === "object"
            ? quote.userId.image
            : ""
        }
        userName={
          quote?.userId && typeof quote.userId === "object"
            ? quote.userId.username
            : ""
        }
      />

      <div className=" mt-6 mb-6">
        <p className="inline-block break-words">
          <span>"{quote?.text[lang]}"</span>
          <span> - </span>
          <Link
            className="text-project-yellow"
            to={`/movies/${quote?.movieId?._id}`}
          >
            {quote?.movieId?.title[lang]}
          </Link>
        </p>
      </div>

      <div
        className={
          "h-[31rem] md:h-[23.125rem] sm:h-[15rem] overflow-hidden rounded-lg"
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
