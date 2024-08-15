import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteQuote, getQuote } from "../services/quote";
import { QuoteType } from "../types/quote";
import LoadingSpinnerWithWrapper from "../components/ui/sharedComponents/LoadingSpinnerWithWrapper";
import { useTranslate } from "../hooks/useTranslate";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState } from "react";
import DeleteModal from "../components/ui/sharedComponents/DeleteModal";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import QuoteItem from "../components/quotes/QuoteItem";

const QuoteView = () => {
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
    <div className="max-w-[60rem]">
      <div className="flex items-center w-max ml-auto  mb-3 gap-1 rounded-lg overflow-hidden shrink-0">
        <Link
          to={`/movies/${quote?.movieId?._id}/quotes/edit/${quote?._id}`}
          className="hover:bg-project-dark-blue py-2 px-4"
        >
          <MdOutlineModeEditOutline />
        </Link>
        <span className="block h-[0.875rem] w-[0.2px] bg-project-gray"></span>
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
      {quote && !quoteLoading && <QuoteItem quote={quote} />}
    </div>
  );
};

export default QuoteView;
