import { Controller, useForm, useWatch } from "react-hook-form";
import SpecialInput from "../../ui/customInputs/SpecialInput";
import MultiSelect from "../../ui/customInputs/MultiSelect";
import { useQuery } from "@tanstack/react-query";
import { getGenres } from "../../../services/genre";
import { MovieFormDataType, MovieType } from "../../../types/movie";
import { useEffect } from "react";
import useUploadImage from "../../../hooks/useUploadImage";
import { app } from "../../../firebase";
import { useTranslate } from "../../../hooks/useTranslate";
import { GenreType } from "../../../types/genre";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import SpecialTextarea from "../../ui/customInputs/SpecialTextarea";
import DragAndDrop from "../../ui/customInputs/DragAndDrop";
import LoadingSpinner from "../../ui/sharedComponents/LoadingSpinner";
import { useParams } from "react-router-dom";
import { getMovie } from "../../../services/movies";
import LoadingSpinnerWithWrapper from "../../ui/sharedComponents/LoadingSpinnerWithWrapper";

const MovieForm = ({
  submitHandler,
  actionLoading,
  action,
}: {
  submitHandler: (data: MovieFormDataType) => void;
  actionLoading: boolean;
  action: "create" | "edit";
}) => {
  const { t } = useTranslate();
  const { lang } = useSelector((state: RootState) => state.lang);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<MovieFormDataType>();

  const { uploadImage, imageFileUploadError, imgUrl, imageFileUploading } =
    useUploadImage(app);

  const { data: genres, isLoading: genresLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenres().then((res) => res.data?.data?.genres),
  });

  const { data: movie, isLoading: movieLoading } = useQuery<MovieType>({
    queryKey: ["movie", id],
    queryFn: () => getMovie(id as string).then((res) => res.data?.data?.movie),
    enabled: !!id && action === "edit",
  });

  const poster = useWatch({
    name: "poster",
    control,
  });

  useEffect(() => {
    if (poster) {
      uploadImage(poster[0] as File);
    }
  }, [poster, uploadImage]);

  useEffect(() => {
    if (action === "edit" && movie) {
      setValue("title_en", movie?.title["en"]);
      setValue("title_ka", movie?.title["ka"]);
      setValue("description_en", movie?.description["en"]);
      setValue("description_ka", movie?.description["ka"]);
      setValue("director_en", movie?.director["en"]);
      setValue("director_ka", movie?.director["ka"]);
      setValue("releaseYear", movie?.releaseYear);
      setValue("income", movie?.income);
      setValue(
        "genreIds",
        movie?.genreIds.map((genre: GenreType) => ({
          id: genre._id,
          name: genre.name[lang],
        }))
      );
    }
  }, [action, setValue, movie, lang]);

  return (
    <div className="max-w-[60rem] bg-project-dark-blue rounded-xl relative oveflow-hidden">
      <p className="border-b border-zinc-700 py-6 text-center font-helvetica-medium text-xl">
        {t(action === "create" ? "add_movie" : "edit_movie")}
      </p>
      <div className="flex items-center gap-2 mt-8 px-8 md:px-4">
        <img
          className="h-12 w-12 rounded-full"
          src={currentUser?.image}
          alt="avatar"
        />
        <p className="font-helvetica-medium">{currentUser?.username}</p>
      </div>

      {movieLoading && <LoadingSpinnerWithWrapper blur />}
      <form
        onSubmit={handleSubmit((data) =>
          submitHandler({ ...data, imgUrl: imgUrl as string })
        )}
        className="p-8 md:p-4 md:mt-6 flex flex-col gap-4"
      >
        <SpecialInput
          register={register}
          name="title_en"
          type="text"
          placeholder="Movie name"
          span="Eng"
          error={(errors?.title_en?.message as string) || ""}
          rules={{
            required: t("required_field"),
          }}
        />
        <SpecialInput
          register={register}
          name="title_ka"
          type="text"
          placeholder="ფილმის სახელი"
          span="ქარ"
          error={(errors?.title_ka?.message as string) || ""}
          rules={{
            required: t("required_field"),
          }}
        />
        <Controller
          name="genreIds"
          control={control}
          rules={{ required: t("required_field") }}
          render={({ field: { onChange, value } }) => (
            <MultiSelect
              data={genres?.map((genre: GenreType) => ({
                id: genre._id,
                name: genre.name[lang],
              }))}
              loading={genresLoading}
              value={value}
              onChange={onChange}
              error={(errors?.genreIds?.message as string) || ""}
              placeholder="select_genre"
            />
          )}
        />
        <SpecialInput
          register={register}
          name="releaseYear"
          type="number"
          placeholder="წელი/Year"
          error={(errors?.releaseYear?.message as string) || ""}
          rules={{
            required: t("required_field"),
          }}
        />
        <SpecialInput
          register={register}
          name="director_en"
          type="text"
          placeholder="Director"
          span="Eng"
          error={(errors?.director_en?.message as string) || ""}
          rules={{
            required: t("required_field"),
          }}
        />
        <SpecialInput
          register={register}
          name="director_ka"
          type="text"
          placeholder="რეჟისორი"
          span="ქარ"
          error={(errors?.director_ka?.message as string) || ""}
          rules={{
            required: t("required_field"),
          }}
        />

        <SpecialInput
          register={register}
          name="income"
          type="number"
          placeholder={t("income")}
          error={(errors?.income?.message as string) || ""}
          rules={{
            required: t("required_field"),
          }}
        />

        <SpecialTextarea
          register={register}
          name="description_en"
          placeholder="Movie description"
          span="Eng"
          error={(errors?.description_en?.message as string) || ""}
          rules={{
            required: t("required_field"),
          }}
        />
        <SpecialTextarea
          register={register}
          name="description_ka"
          placeholder="ფილმის აღწერა"
          span="ქარ"
          error={(errors?.description_ka?.message as string) || ""}
          rules={{
            required: t("required_field"),
          }}
        />

        <Controller
          name="poster"
          control={control}
          rules={{
            required: action === "create" ? t("required_field") : false,
          }}
          render={({ field }) => (
            <DragAndDrop
              control={field}
              imgUrl={imgUrl || movie?.poster}
              imageFileUploading={imageFileUploading}
              imageFileUploadError={imageFileUploadError}
              validationError={(errors?.poster?.message as string) || ""}
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
            t(`${action === "create" ? "add_movie" : "edit_movie"}`)
          )}
        </button>
      </form>
    </div>
  );
};

export default MovieForm;
