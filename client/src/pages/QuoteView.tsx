import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteQuote, getQuote } from "../services/quote";
import { QuoteType } from "../types/quote";
import LazyImageDisplay from "../components/ui/sharedComponents/lazyImage/LazyImageDisplay";
import LoadingSpinnerWithWrapper from "../components/ui/sharedComponents/LoadingSpinnerWithWrapper";
import { VscComment } from "react-icons/vsc";
import { IoMdHeartEmpty } from "react-icons/io";
import UserImageAndName from "../components/ui/sharedComponents/UserImageAndName";
import { IoSend } from "react-icons/io5";
import { useTranslate } from "../hooks/useTranslate";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState } from "react";
import DeleteModal from "../components/ui/sharedComponents/DeleteModal";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { createComment } from "../services/comments";
import LoadingSpinner from "../components/ui/sharedComponents/LoadingSpinner";

const QuoteView = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { lang } = useSelector((state: RootState) => state.lang);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const { t } = useTranslate();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const [commentValue, setCommentValue] = useState("");

  const { mutate: createCommentMutate, isPending: commentIsCreating } =
    useMutation({
      mutationFn: createComment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["quote", id] });
      },
      onError: () => {
        toast.error(t("something_went_wrong"));
      },
    });

  const submitComment = () => {
    if (commentValue.trim() === "") {
      return;
    }
    createCommentMutate({
      quoteId: id as string,
      userId: currentUser?._id as string,
      text: commentValue,
    });

    setCommentValue("");
  };

  return (
    <div>
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
            <p className="flex items-center gap-2">
              10
              <IoMdHeartEmpty className="h-7 w-7" />
            </p>
          </div>

          <div className=" mt-6 flex flex-col gap-4">
            {quote?.comments?.map((comment) => (
              <div className="flex flex-col gap-2 border-b border-gray-700 pb-4">
                <UserImageAndName
                  imgSrc={comment?.userId?.image || ""}
                  userName={comment?.userId?.username || ""}
                />
                <p className="ml-12 text-gray-400">{comment?.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <img
              className="h-10 w-10 rounded-full shrink-0"
              src={currentUser?.image}
              alt="avatar"
            />
            <div className="w-full h-12 relative">
              <textarea
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                className="w-full bg-project-light-blue rounded resize-none h-full p-2 pr-10 outline-none focus:border-project-gray border border-transparent transition-all scrollbar-thin"
                placeholder={t("write_a_comment")}
              ></textarea>
              <button
                onClick={submitComment}
                disabled={commentValue.trim() === "" || commentIsCreating}
                className="absolute top-1/2 right-5 -translate-y-1/2"
              >
                {commentIsCreating ? <LoadingSpinner /> : <IoSend />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteView;
