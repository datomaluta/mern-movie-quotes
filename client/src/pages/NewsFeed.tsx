import { FaEdit } from "react-icons/fa";
import { useTranslate } from "../hooks/useTranslate";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getQuotes } from "../services/quote";
import LoadingSpinnerWithWrapper from "../components/ui/sharedComponents/LoadingSpinnerWithWrapper";
import InfiniteScroll from "react-infinite-scroller";
import QuoteItem from "../components/quotes/QuoteItem";
import { QuoteType } from "../types/quote";
import LoadingSpinner from "../components/ui/sharedComponents/LoadingSpinner";

const NewsFeed = () => {
  const { t } = useTranslate();
  const [searchIsActive, setSearchIsActive] = useState(false);
  const [searchParams] = useSearchParams();
  const queryString = searchParams.get("search")
    ? `search=${searchParams.get("search")}&searchFields=${searchParams.get(
        "searchFields"
      )}`
    : "";

  const {
    data: quotes,
    fetchNextPage,
    hasNextPage,
    // isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["quotes", queryString],
    queryFn: ({ pageParam }) =>
      getQuotes({ page: pageParam, queryString })?.then(
        (res) => res.data?.data?.quotes
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const nextPage = lastPage?.length ? allPages?.length + 1 : undefined;
      return nextPage;
    },
  });

  console.log(quotes?.pages?.flat());
  console.log(quotes?.pages?.flat().length);

  return (
    <div className="max-w-[938px]">
      <div className="flex gap-4">
        <Link
          to={"/quotes/create"}
          className={`flex gap-2 items-center bg-project-light-blue ${
            searchIsActive ? "w-max" : "flex-1"
          } px-4 py-2 rounded shrink-0 transition-all`}
        >
          <FaEdit />
          {t("write_new_quote")}
        </Link>
        {!searchIsActive && (
          <button
            onClick={() => setSearchIsActive(true)}
            className="flex items-center gap-2"
          >
            <IoIosSearch className="h-5 w-5" />
            {t("search_by")}
          </button>
        )}
        {searchIsActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full border-b border-gray-700 "
          >
            <button>
              <IoIosSearch className="h-5 w-5 absolute top-1/2 left- -translate-y-1/2" />
            </button>
            <input
              type="text"
              className="w-full bg-transparent  pl-8 py-2 outline-none"
              placeholder={t("news_feed_search_placeholder")}
            />
          </motion.div>
        )}
      </div>

      {status === "pending" && <LoadingSpinnerWithWrapper />}

      {quotes && quotes?.pages[0]?.length === 0 && (
        <h1 className="text-2xl font-bold text-center mt-20">
          {t("movies_not_found")}
        </h1>
      )}

      {status === "error" && (
        <h1 className="text-2xl font-bold text-center mt-20">
          {t("something_went_wrong")}
        </h1>
      )}

      <InfiniteScroll
        pageStart={0}
        loadMore={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <div className="flex justify-center mt-6" key={0}>
            <LoadingSpinner />
          </div>
        }
      >
        {
          <div className="flex flex-col mt-8 gap-8">
            {quotes?.pages?.flat().map((quote: QuoteType) => (
              <QuoteItem key={quote._id} quote={quote} />
            ))}
          </div>
        }
      </InfiniteScroll>
    </div>
  );
};
export default NewsFeed;
