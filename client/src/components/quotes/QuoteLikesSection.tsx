import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LikeType } from "../../types/like";
import { getLikes, unlikeQuote } from "../../services/likes";
// import toast from "react-hot-toast";
// import { useTranslate } from "../../hooks/useTranslate";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslate } from "../../hooks/useTranslate";
import { useSocket } from "../../context/SocketContext";

const QuoteLikesSection = ({ quoteId }: { quoteId: string }) => {
  const { t } = useTranslate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const [likedQuotes, setLikedQuotes] = useState<string[]>([]);
  const { emit } = useSocket();

  const { data: likes, isLoading: likesLoading } = useQuery<LikeType[]>({
    queryKey: ["likes", quoteId],
    queryFn: () =>
      getLikes(`quoteId=${quoteId}`).then((res) => res.data?.data?.likes),
  });
  const likesArray = likes?.map((like) => like.userId._id) || [];

  const { mutate: unlikeQuoteMutate, isPending: unlikeQuoteLoading } =
    useMutation({
      mutationFn: unlikeQuote,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["likes", quoteId] });
        setLikedQuotes((prev) => prev.filter((id) => id !== currentUser?._id));
        toast.success("Quote unliked!");
      },
      onError: () => {
        toast.error(t("something_went_wrong"));
      },
    });

  const likeQuote = (quoteId: string) => {
    emit("like", { quoteId });
    setLikedQuotes((prev) => [...prev, currentUser?._id as string]);
  };

  return (
    <div className="flex items-center gap-2">
      {likedQuotes?.includes(currentUser?._id as string)
        ? likesArray?.length + 1
        : likesArray?.length}

      <button
        disabled={unlikeQuoteLoading || likesLoading}
        onClick={() => {
          likesArray?.includes(currentUser?._id as string) ||
          likedQuotes?.includes(currentUser?._id as string)
            ? unlikeQuoteMutate(quoteId)
            : likeQuote(quoteId);
        }}
        className="disabled:cursor-not-allowed"
      >
        {likesArray?.includes(currentUser?._id as string) ||
        likedQuotes?.includes(currentUser?._id as string) ? (
          <IoMdHeart className="h-7 w-7 fill-red-500" />
        ) : (
          <IoMdHeartEmpty className="h-7 w-7" />
        )}
      </button>
    </div>
  );
};

export default QuoteLikesSection;
