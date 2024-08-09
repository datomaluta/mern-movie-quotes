import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LikeType } from "../../types/like";
import { getLikes, likeQuote, unlikeQuote } from "../../services/likes";
import toast from "react-hot-toast";
import { useTranslate } from "../../hooks/useTranslate";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const QuoteLikesSection = ({ quoteId }: { quoteId: string }) => {
  const { t } = useTranslate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  const { data: likes, isLoading: likesLoading } = useQuery<LikeType[]>({
    queryKey: ["likes", quoteId],
    queryFn: () =>
      getLikes(`quoteId=${quoteId}`).then((res) => res.data?.data?.likes),
  });
  const likesArray = likes?.map((like) => like.userId._id);

  const { mutate: likeQuoteMutate, isPending: likeQuoteLoading } = useMutation({
    mutationFn: likeQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", quoteId] });
    },
    onError: () => {
      toast.error(t("something_went_wrong"));
    },
  });

  const { mutate: unlikeQuoteMutate, isPending: unlikeQuoteLoading } =
    useMutation({
      mutationFn: unlikeQuote,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["likes", quoteId] });
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
                    like.userId._id === currentUser?._id &&
                    like.quoteId === quoteId
                )?._id || ""
              )
            : likeQuoteMutate({
                quoteId: quoteId as string,
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
