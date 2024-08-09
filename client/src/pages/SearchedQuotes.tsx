import { useInfiniteQuery } from "@tanstack/react-query";
import { getQuotes } from "../services/quote";
import QuotesList from "../components/quotes/QuotesList";
import { useSearchParams } from "react-router-dom";
import { QuoteType } from "../types/quote";
import { useTranslate } from "../hooks/useTranslate";
import LoadingSpinnerWithWrapper from "../components/ui/sharedComponents/LoadingSpinnerWithWrapper";
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";

const SearchedQuotes = () => {
  const { t } = useTranslate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchState, setSearchState] = useState("");
  const queryString = searchParams.get("search")
    ? `search=${searchParams.get("search")}&searchFields=${searchParams.get(
        "searchFields"
      )}`
    : "";

  const {
    data: quotes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["searchedQuotes", queryString],
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
  return (
    <div>
      <div className="relative border-b border-gray-700">
        <button
          onClick={() =>
            setSearchParams({
              search: searchState,
              searchFields: "text.en,text.ka",
            })
          }
        >
          <IoIosSearch className="h-5 w-5 absolute top-1/2 left- -translate-y-1/2" />
        </button>
        <input
          onChange={(e) => setSearchState(e.target.value)}
          type="text"
          className="w-full bg-transparent  pl-8 py-2 outline-none"
          placeholder={t("search")}
        />
      </div>

      {quotes && quotes?.pages[0]?.length === 0 && (
        <h1 className="text-2xl font-bold text-center mt-20">
          {t("quotes_not_found")}
        </h1>
      )}

      {status === "pending" && <LoadingSpinnerWithWrapper />}

      {status === "error" && (
        <h1 className="text-2xl font-bold text-center mt-20">
          {t("something_went_wrong")}
        </h1>
      )}

      <QuotesList quotes={quotes?.pages?.flat() as QuoteType[]} />

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

export default SearchedQuotes;
