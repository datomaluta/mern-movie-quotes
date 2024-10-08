import { useSelector } from "react-redux";
import UserImageAndName from "../ui/sharedComponents/UserImageAndName";
import { RootState } from "../../redux/store";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment } from "../../services/comments";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslate } from "../../hooks/useTranslate";
import { AnimatePresence } from "framer-motion";
import CommentEditForm from "../comments/CommentEditForm";
import DeleteModal from "../ui/sharedComponents/DeleteModal";
import { IoSend } from "react-icons/io5";
import { CommentType } from "../../types/comment";
import LoadingSpinner from "../ui/sharedComponents/LoadingSpinner";

const QuoteCommentsSection = ({
  comments,
  quoteId,
}: {
  comments: CommentType[];
  quoteId: string;
}) => {
  const { t } = useTranslate();

  const { currentUser } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  const [commentDeleteModalIsOpen, setCommentDeleteModalIsOpen] =
    useState(false);
  const [commentEditModalIsOpen, setCommentEditModalIsOpen] = useState(false);
  const [chosenComment, setChosenComment] = useState<CommentType | null>(null);
  const [commentValue, setCommentValue] = useState("");

  const { mutate: commentCreateMutate, isPending: commentCreateLoading } =
    useMutation({
      mutationFn: createComment,
      onSuccess: () => {
        setCommentValue("");
        queryClient.invalidateQueries({ queryKey: ["quote", quoteId] });
        queryClient.invalidateQueries({ queryKey: ["newsfeed-quotes"] });
      },
      onError: () => {
        toast.error(t("something_went_wrong"));
      },
    });

  const { mutate: commentDeleteMutate, isPending: commentDeleteIsLoading } =
    useMutation({
      mutationFn: deleteComment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["quote", quoteId] });
        queryClient.invalidateQueries({ queryKey: ["newsfeed-quotes"] });
        setCommentDeleteModalIsOpen(false);
      },
      onError: () => {
        toast.error(t("something_went_wrong"));
      },
    });

  return (
    <>
      <AnimatePresence>
        {commentEditModalIsOpen && (
          <CommentEditForm
            setCommentEditModalIsOpen={setCommentEditModalIsOpen}
            comment={chosenComment}
          />
        )}

        {commentDeleteModalIsOpen && (
          <DeleteModal
            deleteIsLoading={commentDeleteIsLoading}
            onSubmit={() => commentDeleteMutate(chosenComment?._id as string)}
            setDeleteModalIsOpen={setCommentDeleteModalIsOpen}
          />
        )}
      </AnimatePresence>

      {comments?.length ? (
        <div className="mt-6 flex flex-col gap-4 overflow-hidden sm:text-sm">
          {comments?.map((comment) => (
            <div
              key={comment?._id}
              className="flex flex-col gap-2 items-start justify-between border-b border-gray-700 pb-4"
            >
              <UserImageAndName
                imgSrc={comment?.userId?.image || ""}
                userName={comment?.userId?.username || ""}
              />
              <p className="ml-12 sm:ml-10 text-gray-400">{comment?.text}</p>

              {currentUser?._id === comment?.userId?._id && (
                <div className="flex items-center gap-3  ml-auto">
                  <button
                    onClick={() => {
                      setCommentEditModalIsOpen(true);
                      setChosenComment(comment);
                    }}
                    className="hover:bg-project-light-blue rounded"
                  >
                    <MdOutlineModeEditOutline />
                  </button>

                  <button
                    onClick={() => {
                      setCommentDeleteModalIsOpen(true);
                      setChosenComment(comment);
                    }}
                    className="hover:bg-project-light-blue rounded"
                  >
                    <RiDeleteBin6Line className="text-project-danger" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
      <div className="mt-6 flex items-center gap-4 sm:text-sm">
        <img
          className="h-10 w-10 sm:h-8 sm:w-8 rounded-full shrink-0 object-cover"
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
            onClick={() => commentCreateMutate({ quoteId, text: commentValue })}
            disabled={commentValue.trim() === ""}
            className="absolute top-1/2 right-5 -translate-y-1/2"
          >
            {commentCreateLoading ? <LoadingSpinner /> : <IoSend />}
          </button>
        </div>
      </div>
    </>
  );
};

export default QuoteCommentsSection;
