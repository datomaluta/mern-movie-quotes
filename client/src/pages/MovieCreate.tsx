import { useSelector } from "react-redux";
import { useTranslate } from "../hooks/useTranslate";
import { RootState } from "../redux/store";
import { Controller, useForm, useWatch } from "react-hook-form";
import SpecialInput from "../components/ui/customInputs/SpecialInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getGenres } from "../services/genre";
import MultiSelect from "../components/ui/customInputs/MultiSelect";
import { Genre } from "../types/genre";
import SpecialTextarea from "../components/ui/customInputs/SpecialTextarea";
import DragAndDrop from "../components/ui/customInputs/DragAndDrop";
import useUploadImage from "../hooks/useUploadImage";
import { app } from "../firebase";
import { useEffect } from "react";
import { MovieFormDataType } from "../types/movie";
import { createMovie } from "../services/movies";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/ui/sharedComponents/LoadingSpinner";

const MovieCreate = () => {
  const { t } = useTranslate();
  const { lang } = useSelector((state: RootState) => state.lang);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const { uploadImage, imageFileUploadError, imgUrl, imageFileUploading } =
    useUploadImage(app);

  const { data: genres, isLoading: genresLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenres().then((res) => res.data?.data?.genres),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<MovieFormDataType>();

  const { mutate: createMovieMutate, isPending: createMovieIsPending } =
    useMutation({
      mutationFn: createMovie,
      onSuccess: () => {
        toast.success(t("movie_create_successfully"));
        setTimeout(() => {
          navigate("/movies");
        }, 2000);
      },
    });

  const submitHandler = (data: MovieFormDataType) => {
    // console.log(data);
    if (imgUrl) {
      const requestObj = {
        title: {
          en: data.title_en,
          ka: data.title_ka,
        },
        genreIds: data.genreIds.map((genre) => genre.id),
        releaseYear: data.releaseYear,
        director: {
          en: data.director_en,
          ka: data.director_ka,
        },
        income: data.income,
        description: {
          en: data.description_en,
          ka: data.description_ka,
        },
        poster: imgUrl,
      };

      console.log(requestObj);
      createMovieMutate(requestObj);
    } else {
      return;
    }
  };

  const poster = useWatch({
    name: "poster",
    control,
  });

  useEffect(() => {
    if (poster) {
      uploadImage(poster[0] as File);
    }
  }, [poster, uploadImage]);

  // console.log(poster);

  return (
    <>
      <div className="max-w-[961px] bg-project-dark-blue rounded-xl">
        <p className="border-b border-zinc-700 py-6 text-center font-helvetica-medium text-xl">
          {t("add_movie")}
        </p>
        <div className="flex items-center gap-2 mt-8 px-8 md:px-4">
          <img
            className="h-12 w-12 rounded-full"
            src={currentUser?.image}
            alt="avatar"
          />
          <p className="font-helvetica-medium">{currentUser?.username}</p>
        </div>
        <form
          onSubmit={handleSubmit(submitHandler)}
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
                data={genres?.map((genre: Genre) => ({
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
            rules={{ required: t("required_field") }}
            render={({ field }) => (
              <DragAndDrop
                control={field}
                imgUrl={imgUrl}
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
            {createMovieIsPending ? <LoadingSpinner /> : t("add_movie")}
          </button>
        </form>
      </div>
    </>
  );
};

export default MovieCreate;
