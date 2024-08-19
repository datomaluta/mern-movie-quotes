import { useState } from "react";
import { useTranslate } from "../../hooks/useTranslate";
import { QuoteType } from "../../types/quote";
import { RxDotsHorizontal } from "react-icons/rx";
import { FaRegEye } from "react-icons/fa";
import { Link, useLocation, useParams } from "react-router-dom";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import LazyImageDisplay from "../ui/sharedComponents/lazyImage/LazyImageDisplay";
import { VscComment } from "react-icons/vsc";
import { IoMdHeartEmpty } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const QuotesCard = ({
  quote,
  setChosenQuote,
  setDeleteModalIsOpen,
}: {
  quote: QuoteType;
  setChosenQuote: React.Dispatch<React.SetStateAction<QuoteType | null>>;
  setDeleteModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslate();
  const { lang } = useSelector((state: RootState) => state.lang);
  const [contextMenuIsOpen, setContextMenuIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { id: movieId } = useParams();

  return (
    <>
      <div key={quote._id} className="flex flex-col w-[60%] 2xl:w-full mt-8">
        <div className="bg-project-dark-blue px-6 py-6 rounded-lg relative">
          <button
            onClick={() => {
              setContextMenuIsOpen((currState) => !currState);
            }}
            className="absolute top-[4%] right-[2%]"
          >
            <RxDotsHorizontal className="h-6 w-6" />
          </button>
          {contextMenuIsOpen && (
            <div className="flex flex-col gap-4 bg-project-light-blue rounded p-6 absolute top-[15%] -right-28 2xl:right-0 z-30">
              <Link
                to={`/quotes/${quote._id}`}
                className="flex gap-4 items-center"
              >
                <FaRegEye />
                {t("view_quote")}
              </Link>
              {currentUser?._id === quote.userId?._id && (
                <>
                  <Link
                    to={`${
                      pathname.includes("search")
                        ? `/quotes/edit/${quote._id}`
                        : `/movies/${movieId}/quotes/edit/${quote._id}`
                    }`}
                    className="flex gap-4 items-center"
                  >
                    <MdOutlineModeEditOutline />
                    {t("edit")}
                  </Link>
                  <button
                    onClick={() => {
                      setChosenQuote(quote);
                      setDeleteModalIsOpen(true);
                    }}
                    className="flex gap-4 items-center"
                  >
                    <RiDeleteBin6Line />
                    {t("delete")}
                  </button>{" "}
                </>
              )}
            </div>
          )}
          <div className="border-b border-gray-700 flex pb-6 gap-8 items-center sm:flex-col">
            <div className="h-[8.75rem] sm:h-[12.5rem] w-[14.125rem] sm:w-full shrink-0 rounded overflow-hidden mt-6">
              <LazyImageDisplay imageUrl={quote?.image} alt={quote.text.en} />
            </div>
            <div className="w-full">
              <p className="text-gray-400 text-2xl md:text-xl italic line-clamp-3 w-full">
                "{quote?.text[lang]}"
              </p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <p className="flex items-center gap-2">
              {quote?.comments.length}
              <VscComment className="h-7 w-7" />
            </p>
            <p className="flex items-center gap-2">
              {quote?.likes?.length}
              <IoMdHeartEmpty className="h-7 w-7" />
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuotesCard;
