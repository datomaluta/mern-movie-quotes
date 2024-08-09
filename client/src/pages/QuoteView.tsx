import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteQuote, getQuote } from "../services/quote";
import { QuoteType } from "../types/quote";
import LazyImageDisplay from "../components/ui/sharedComponents/lazyImage/LazyImageDisplay";
import LoadingSpinnerWithWrapper from "../components/ui/sharedComponents/LoadingSpinnerWithWrapper";
import { VscComment } from "react-icons/vsc";
import UserImageAndName from "../components/ui/sharedComponents/UserImageAndName";
import { useTranslate } from "../hooks/useTranslate";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState } from "react";
import DeleteModal from "../components/ui/sharedComponents/DeleteModal";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import QuoteCommentsSection from "../components/quotes/QuoteCommentsSection";
import QuoteLikesSection from "../components/quotes/QuoteLikesSection";

const QuoteView = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { lang } = useSelector((state: RootState) => state.lang);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const { t } = useTranslate();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: quote, isLoading: quoteLoading } = useQuery<QuoteType>({
    queryKey: ["quote", id],
    queryFn: () => getQuote(id as string).then((res) => res.data?.data?.quote),
    enabled: !!id,
  });

  const { mutate: quoteDeleteMutate, isPending: deleteIsLoading } = useMutation(
    {
      mutationFn: (quoteId: string) => deleteQuote(quoteId),
      onSuccess: () => {
        setDeleteModalIsOpen(false);
        toast.success(t("quote_deleted_successfully"));
        setTimeout(() => {
          navigate(`/movies/${quote?.movieId?._id}`);
        }, 2000);
      },
      onError: () => {
        toast.error(t("something_went_wrong"));
      },
    }
  );

  return (
    <div className="max-w-[961px]">
      <div className="flex items-center w-max ml-auto  mb-3 gap-1 rounded-lg overflow-hidden shrink-0">
        <Link
          to={`/movies/${quote?.movieId?._id}/quotes/edit/${quote?._id}`}
          className="hover:bg-project-dark-blue py-2 px-4"
        >
          <MdOutlineModeEditOutline />
        </Link>
        <span className="block h-[14px] w-[0.2px] bg-project-gray"></span>
        <button
          onClick={() => setDeleteModalIsOpen(true)}
          className="hover:bg-project-dark-blue py-2 px-4"
        >
          <RiDeleteBin6Line />
        </button>
      </div>

      <AnimatePresence>
        {deleteModalIsOpen && (
          <DeleteModal
            deleteIsLoading={deleteIsLoading}
            onSubmit={() => quoteDeleteMutate(id as string)}
            setDeleteModalIsOpen={setDeleteModalIsOpen}
          />
        )}
      </AnimatePresence>

      {quoteLoading && <LoadingSpinnerWithWrapper />}
      {quote && !quoteLoading && (
        <div className="max-w-[961px] bg-project-dark-blue p-6 rounded-xl overflow-hidden">
          <UserImageAndName
            imgSrc={currentUser?.image || ""}
            userName={currentUser?.username || ""}
          />

          <div className=" mt-6 mb-6">
            <p className="inline-block break-all">"{quote?.text[lang]}</p>
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

            <QuoteLikesSection />
          </div>

          <QuoteCommentsSection comments={quote?.comments} />
        </div>
      )}
    </div>
  );
};

export default QuoteView;
