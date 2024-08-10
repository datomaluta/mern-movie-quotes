import { Controller, useForm, useWatch } from "react-hook-form";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useUploadImage from "../../../hooks/useUploadImage";
import { app } from "../../../firebase";
import { useTranslate } from "../../../hooks/useTranslate";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import SpecialTextarea from "../../ui/customInputs/SpecialTextarea";
import DragAndDrop from "../../ui/customInputs/DragAndDrop";
import LoadingSpinner from "../../ui/sharedComponents/LoadingSpinner";
import { useParams } from "react-router-dom";
import LoadingSpinnerWithWrapper from "../../ui/sharedComponents/LoadingSpinnerWithWrapper";
import CustomSelect from "../../ui/customInputs/CustomSelect";
import { QuoteFormDataType, QuoteType } from "../../../types/quote";
import { getQuote } from "../../../services/quote";
import { getMovies } from "../../../services/movies";
import { MovieType } from "../../../types/movie";

const QuoteForm = ({
  submitHandler,
  actionLoading,
  action,
}: {
  submitHandler: (data: QuoteFormDataType) => void;
  actionLoading: boolean;
  action: "create" | "edit";
}) => {
  const { t } = useTranslate();
  const { lang } = useSelector((state: RootState) => state.lang);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { quoteId, movieId } = useParams();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<QuoteFormDataType>();

  const { uploadImage, imageFileUploadError, imgUrl, imageFileUploading } =
    useUploadImage(app);

  const { data: quote, isLoading: quoteLoading } = useQuery<QuoteType>({
    queryKey: ["quote", quoteId],
    queryFn: () =>
      getQuote(quoteId as string).then((res) => res.data?.data?.quote),
    enabled: !!quoteId && action === "edit",
  });

  const { data: movies } = useQuery<MovieType[]>({
    queryKey: ["movies"],
    queryFn: () => getMovies({}).then((res) => res.data?.data?.movies),
  });

  const image = useWatch({
    name: "image",
    control,
  });

  useEffect(() => {
    if (image) {
      uploadImage(image[0] as File);
    }
  }, [image, uploadImage]);

  useEffect(() => {
    if (action === "edit" && quote) {
      setValue("text_en", quote?.text["en"]);
      setValue("text_ka", quote?.text["ka"]);
      // setValue("movieId", quote?.movieId._id);
    }
  }, [action, setValue, quote, lang]);

  useEffect(() => {
    if (movieId) {
      setValue("movieId", movieId);
    } else {
      setValue("movieId", quote?.movieId?._id as string);
    }
  }, [movieId, setValue, movies, quote]);

  return (
    <div className="max-w-[961px] bg-project-dark-blue rounded-xl relative">
      <p className="border-b border-zinc-700 py-6 text-center font-helvetica-medium text-xl">
        {t(action === "create" ? "add_quote" : "edit_quote")}
      </p>
      <div className="flex items-center gap-2 mt-8 px-8 md:px-4">
        <img
          className="h-12 w-12 rounded-full"
          src={currentUser?.image}
          alt="avatar"
        />
        <p className="font-helvetica-medium">{currentUser?.username}</p>
      </div>

      {quoteLoading && <LoadingSpinnerWithWrapper blur />}
      <form
        onSubmit={handleSubmit((data) =>
          submitHandler({ ...data, imgUrl: imgUrl as string })
        )}
        className="p-8 md:p-4 md:mt-6 flex flex-col gap-4"
      >
        <CustomSelect
          name="movieId"
          register={register}
          options={movies?.map((movie) => ({
            id: movie._id,
            name: movie.title[lang],
          }))}
          placeholder={t("choose_movie")}
          errorText={(errors?.movieId?.message as string) || ""}
          rules={{
            required: t("required_field"),
          }}
          disabled={!!movieId}
        />

        <SpecialTextarea
          register={register}
          name="text_en"
          placeholder="Quote text"
          span="Eng"
          error={(errors?.text_en?.message as string) || ""}
          rules={{
            required: t("required_field"),
          }}
        />
        <SpecialTextarea
          register={register}
          name="text_ka"
          placeholder="ციტატის ტექსტი"
          span="ქარ"
          error={(errors?.text_ka?.message as string) || ""}
          rules={{
            required: t("required_field"),
          }}
        />

        <Controller
          name="image"
          control={control}
          rules={{
            required: action === "create" ? t("required_field") : false,
          }}
          render={({ field }) => (
            <DragAndDrop
              control={field}
              imgUrl={imgUrl || quote?.image}
              imageFileUploading={imageFileUploading}
              imageFileUploadError={imageFileUploadError}
              validationError={(errors?.image?.message as string) || ""}
            />
          )}
        />

        <button
          disabled={imageFileUploading}
          className="bg-project-red hover:bg-project-dark-red w-full py-2 rounded mt-6 disabled:bg-red-400 min-h-10 flex justify-center items-center"
        >
          {actionLoading ? (
            <LoadingSpinner />
          ) : (
            t(`${action === "create" ? "add_quote" : "edit_quote"}`)
          )}
        </button>
      </form>
    </div>
  );
};

export default QuoteForm;
