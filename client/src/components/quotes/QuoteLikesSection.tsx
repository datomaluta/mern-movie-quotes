import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LikeType } from "../../types/like";
import { useParams } from "react-router-dom";
import { getLikes, likeQuote, unlikeQuote } from "../../services/likes";
import toast from "react-hot-toast";
import { useTranslate } from "../../hooks/useTranslate";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const QuoteLikesSection = () => {
  const { id } = useParams();
  const { t } = useTranslate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  const { data: likes, isLoading: likesLoading } = useQuery<LikeType[]>({
    queryKey: ["likes", id],
    queryFn: () =>
      getLikes(`quoteId=${id}`).then((res) => res.data?.data?.likes),
  });
  const likesArray = likes?.map((like) => like.userId._id);

  const { mutate: likeQuoteMutate, isPending: likeQuoteLoading } = useMutation({
    mutationFn: likeQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", id] });
    },
    onError: () => {
      toast.error(t("something_went_wrong"));
    },
  });

  const { mutate: unlikeQuoteMutate, isPending: unlikeQuoteLoading } =
    useMutation({
      mutationFn: unlikeQuote,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["likes", id] });
        toast.success("Quote unliked!");
      },
      onError: () => {
        toast.error(t("something_went_wrong"));
      },
    });

  return (
    <div className="flex items-center gap-2">
      {likesArray?.length}

      <button
        disabled={likeQuoteLoading || unlikeQuoteLoading || likesLoading}
        onClick={() => {
          likesArray?.includes(currentUser?._id as string)
            ? unlikeQuoteMutate(
                likes?.find(
                  (like) =>
                    like.userId._id === currentUser?._id && like.quoteId === id
                )?._id || ""
              )
            : likeQuoteMutate({
                quoteId: id as string,
                userId: currentUser?._id as string,
              });
        }}
        className="disabled:cursor-not-allowed"
      >
        {likesArray?.includes(currentUser?._id as string) ? (
          <IoMdHeart className="h-7 w-7 fill-red-500" />
        ) : (
          <IoMdHeartEmpty className="h-7 w-7" />
        )}
      </button>
    </div>
  );
};

export default QuoteLikesSection;
