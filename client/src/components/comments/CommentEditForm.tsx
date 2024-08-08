import toast from "react-hot-toast";
import { useTranslate } from "../../hooks/useTranslate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../../services/comments";
import ModalWrapper from "../ui/sharedComponents/ModalWrapper";
import { useForm } from "react-hook-form";
import {
  CommentFormDataToSendType,
  CommentFormDataType,
  CommentType,
} from "../../types/comment";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import LoadingSpinner from "../ui/sharedComponents/LoadingSpinner";
import { Dispatch, SetStateAction, useEffect } from "react";

const CommentEditForm = ({
  comment,
  setCommentEditModalIsOpen,
}: {
  comment: CommentType | null;
  setCommentEditModalIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { t } = useTranslate();
  const { id: quoteId } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CommentFormDataType>();

  const { mutate: updateCommentMutate, isPending: commentIsEditing } =
    useMutation({
      mutationFn: updateComment,
      onSuccess: () => {
        toast.success(t("comment_updated_successfully"));
        queryClient.invalidateQueries({ queryKey: ["quote", quoteId] });
        setTimeout(() => {
          setCommentEditModalIsOpen(false);
        }, 2000);
      },
      onError: () => {
        toast.error(t("something_went_wrong"));
      },
    });

  const submitHandler = (data: CommentFormDataType) => {
    const requestObject: CommentFormDataToSendType = {
      text: data.text,
      quoteId: quoteId as string,
      userId: currentUser?._id as string,
    };

    updateCommentMutate({ data: requestObject, id: comment?._id as string });
  };

  useEffect(() => {
    if (comment) {
      setValue("text", comment?.text);
    }
  }, [comment, setValue]);

  return (
    <ModalWrapper setModalIsVisible={() => setCommentEditModalIsOpen(false)}>
      <div className="p-4">
        <h1 className="text-center mb-8 text-lg font-helvetica-medium">
          {t("edit_comment")}
        </h1>
        <form onSubmit={handleSubmit(submitHandler)}>
          <textarea
            {...register("text", { required: t("required_field") })}
            className="w-full bg-project-light-blue rounded resize-none p-2  outline-none focus:border-project-gray border border-project-gray transition-all h-14"
            placeholder={t("write_a_comment")}
          ></textarea>
          <p className="h-7 mb-4 text-project-danger">{errors.text?.message}</p>

          <button className="w-full bg-project-red py-2 md:py-[6px] rounded mt-1 flex justify-center items-center min-h-10 md:min-h-9">
            {commentIsEditing ? <LoadingSpinner /> : t("submit")}
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default CommentEditForm;
