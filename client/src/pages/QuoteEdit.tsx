import { useMutation } from "@tanstack/react-query";
import QuoteForm from "../components/quotes/form/QuoteForm";
import { updateQuote } from "../services/quote";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { QuoteFormDataToSendType, QuoteFormDataType } from "../types/quote";
import { useTranslate } from "../hooks/useTranslate";

const QuoteEdit = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { movieId, quoteId } = useParams();

  const { mutate: updateQuoteMutate, isPending: updateQuoteIsPending } =
    useMutation({
      mutationFn: updateQuote,
      onSuccess: () => {
        toast.success(t("quote_updated_successfully"));
        setTimeout(() => {
          if (movieId) {
            navigate(`/movies/${movieId}`);
          }
        }, 2000);
      },
    });

  const submitHandler = (data: QuoteFormDataType) => {
    let requestObj: QuoteFormDataToSendType = {
      movieId: data.movieId,
      text: {
        en: data.text_en,
        ka: data.text_ka,
      },
    };

    if (data.imgUrl) {
      requestObj = {
        ...requestObj,
        image: data.imgUrl,
      };
    }

    updateQuoteMutate({ data: requestObj, id: quoteId as string });
  };

  return (
    <div>
      <QuoteForm
        submitHandler={submitHandler}
        action="edit"
        actionLoading={updateQuoteIsPending}
      />
    </div>
  );
};

export default QuoteEdit;
