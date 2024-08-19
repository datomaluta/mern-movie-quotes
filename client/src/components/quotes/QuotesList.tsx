import { AnimatePresence } from "framer-motion";
import { QuoteType } from "../../types/quote";
import QuotesCard from "./QuotesCard";
import { useState } from "react";
import { useTranslate } from "../../hooks/useTranslate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQuote } from "../../services/quote";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import DeleteModal from "../ui/sharedComponents/DeleteModal";

const QuotesList = ({ quotes }: { quotes: QuoteType[] }) => {
  const { t } = useTranslate();
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [chosenQuote, setChosenQuote] = useState<QuoteType | null>(null);
  const queryClient = useQueryClient();
  const { id } = useParams();
  console.log(quotes)

  const { mutate: quoteDeleteMutate, isPending: deleteIsLoading } = useMutation(
    {
      mutationFn: (quoteId: string) => deleteQuote(quoteId),
      onSuccess: () => {
        setDeleteModalIsOpen(false);
        queryClient.invalidateQueries({ queryKey: ["movie", id] });
        queryClient.invalidateQueries({ queryKey: ["movie-quotes", id] });
        toast.success(t("quote_deleted_successfully"));
      },
      onError: () => {
        toast.error(t("something_went_wrong"));
      },
    }
  );

  return (
    <>
      <AnimatePresence>
        {deleteModalIsOpen && (
          <DeleteModal
            deleteIsLoading={deleteIsLoading}
            onSubmit={() => quoteDeleteMutate(chosenQuote?._id as string)}
            setDeleteModalIsOpen={setDeleteModalIsOpen}
          />
        )}
      </AnimatePresence>
      <div>
        {quotes?.map((quote) => (
          <QuotesCard
            quote={quote}
            key={quote._id}
            setChosenQuote={setChosenQuote}
            setDeleteModalIsOpen={setDeleteModalIsOpen}
          />
        ))}
      </div>
    </>
  );
};

export default QuotesList;
