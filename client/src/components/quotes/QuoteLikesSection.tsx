import { useQuery } from "@tanstack/react-query";
import { LikeType } from "../../types/like";
import { getLikes } from "../../services/likes";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";

const QuoteLikesSection = ({ quoteId }: { quoteId: string }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [quoteLikes, setQuoteLikes] = useState<string[]>([]);
  const { emit, socket } = useSocket();
  const [likeUnlikestate, setLikeUnlikeState] = useState("");

  useEffect(() => {
    socket?.on("like_error", () => {
      setQuoteLikes((prev) => prev.filter((id) => id !== currentUser?._id));
      setLikeUnlikeState("");
    });
    socket?.on("unlike_error", () => {
      setQuoteLikes((prev) => [...prev, currentUser?._id as string]);
      setLikeUnlikeState("");
    });
  }, [socket, currentUser?._id, quoteId]);

  const {
    data: likes,
    isLoading: likesLoading,
    isSuccess,
  } = useQuery<LikeType[]>({
    queryKey: ["likes", quoteId],
    queryFn: () =>
      getLikes(`quoteId=${quoteId}`).then((res) => res.data?.data?.likes),
  });

  useEffect(() => {
    setQuoteLikes(likes?.map((like) => like.userId._id) || []);
  }, [isSuccess, likes]);

  const likeQuote = useCallback(() => {
    emit("like", { quoteId });
  }, [emit, quoteId]);

  const unlikeQuote = useCallback(() => {
    emit("unlike", { quoteId });
  }, [emit, quoteId]);

  useEffect(() => {
    const likeOrUnlike = setTimeout(() => {
      if (likeUnlikestate === "like") {
        likeQuote();
      } else if (likeUnlikestate === "unlike") {
        unlikeQuote();
      }
    }, 1000);

    return () => clearTimeout(likeOrUnlike);
  }, [likeUnlikestate, likeQuote, unlikeQuote]);

  const handleLike = () => {
    setQuoteLikes((prev) => [...prev, currentUser?._id as string]);
    setLikeUnlikeState("like");
  };

  const handleUnlike = () => {
    setQuoteLikes((prev) => prev.filter((id) => id !== currentUser?._id));
    setLikeUnlikeState("unlike");
  };

  return (
    <div className="flex items-center gap-2">
      {quoteLikes?.length}
      <button
        disabled={likesLoading}
        onClick={() => {
          quoteLikes?.includes(currentUser?._id as string)
            ? handleUnlike()
            : handleLike();
        }}
        className="disabled:cursor-not-allowed"
      >
        {quoteLikes?.includes(currentUser?._id as string) ? (
          <IoMdHeart className="h-7 w-7 fill-red-500" />
        ) : (
          <IoMdHeartEmpty className="h-7 w-7" />
        )}
      </button>
    </div>
  );
};

export default QuoteLikesSection;
