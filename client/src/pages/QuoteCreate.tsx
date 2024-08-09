import { useMutation } from "@tanstack/react-query";
import QuoteForm from "../components/quotes/form/QuoteForm";
import { createQuote } from "../services/quote";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { QuoteFormDataType } from "../types/quote";
import { useTranslate } from "../hooks/useTranslate";

const QuoteCreate = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { movieId } = useParams();

  const { mutate: createQuoteMutate, isPending: createQuoteIsPending } =
    useMutation({
      mutationFn: createQuote,
      onSuccess: () => {
        toast.success(t("quote_create_successfully"));
        setTimeout(() => {
          if (movieId) {
            navigate(`/movies/${movieId}`);
          } else {
            navigate("/news-feed");
          }
        }, 2000);
      },
    });

  const submitHandler = (data: QuoteFormDataType) => {
    console.log(data);
    if (!data.imgUrl) {
      return;
    }

    const requestObj = {
      movieId: data.movieId,
      text: {
        en: data.text_en,
        ka: data.text_ka,
      },
      image: data.imgUrl,
    };

    createQuoteMutate(requestObj);
  };

  return (
    <div>
      <QuoteForm
        submitHandler={submitHandler}
        action="create"
        actionLoading={createQuoteIsPending}
      />
    </div>
  );
};

export default QuoteCreate;
