import { useSelector } from "react-redux";
import UserImageAndName from "../ui/sharedComponents/UserImageAndName";
import { RootState } from "../../redux/store";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../services/comments";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslate } from "../../hooks/useTranslate";
import { AnimatePresence } from "framer-motion";
import CommentEditForm from "../comments/CommentEditForm";
import DeleteModal from "../ui/sharedComponents/DeleteModal";
import { IoSend } from "react-icons/io5";
import { CommentType } from "../../types/comment";
import { DefaultEventsMap } from "@socket.io/component-emitter"; // Import the type for DefaultEventsMap if needed
import { io, Socket } from "socket.io-client";
import { UserType } from "../../types/user";

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
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const [localComments, setLocalComments] = useState<CommentType[]>(comments);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("notification_comment", (notification) => {
      console.log("Notification received:", notification);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [queryClient, quoteId]);

  const { mutate: commentDeleteMutate, isPending: commentDeleteIsLoading } =
    useMutation({
      mutationFn: deleteComment,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["quote", quoteId] });
        setCommentDeleteModalIsOpen(false);
      },
      onError: () => {
        toast.error(t("something_went_wrong"));
      },
    });

  const createComment2 = () => {
    if (!socketRef.current) return;

    if (commentValue.trim() === "") {
      return;
    }

    socketRef.current.emit("createComment", { quoteId, text: commentValue });

    setLocalComments((prev) => {
      return [
        ...prev,
        {
          _id: Date.now().toString(),
          text: commentValue,
          userId: currentUser as UserType,
          quoteId: quoteId,
        },
      ];
    });
    setCommentValue("");
  };

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

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

      <div className=" mt-6 flex flex-col gap-4 overflow-hidden">
        {localComments?.map((comment) => (
          <div
            key={comment?._id}
            className="flex flex-col gap-2 items-start justify-between border-b border-gray-700 pb-4"
          >
            <UserImageAndName
              imgSrc={comment?.userId?.image || ""}
              userName={comment?.userId?.username || ""}
            />
            <p className="ml-12 text-gray-400">{comment?.text}</p>

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
            onClick={createComment2}
            disabled={commentValue.trim() === ""}
            className="absolute top-1/2 right-5 -translate-y-1/2"
          >
            <IoSend />
          </button>
        </div>
      </div>
    </>
  );
};

export default QuoteCommentsSection;
