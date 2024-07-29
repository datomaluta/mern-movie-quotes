import { useSelector } from "react-redux";
import { useTranslate } from "../hooks/useTranslate";
import { RootState } from "../redux/store";
import { Controller, useForm, useWatch } from "react-hook-form";
import SpecialInput from "../components/ui/customInputs/SpecialInput";
import { useQuery } from "@tanstack/react-query";
import { getGenres } from "../services/genre";
import MultiSelect from "../components/ui/customInputs/MultiSelect";
import { Genre } from "../types/genre";
import SpecialTextarea from "../components/ui/customInputs/SpecialTextarea";
import DragAndDrop from "../components/ui/customInputs/DragAndDrop";
import useUploadImage from "../hooks/useUploadImage";
import { app } from "../firebase";
import { useEffect } from "react";

const MovieCreate = () => {
  const { t } = useTranslate();
  const { lang } = useSelector((state: RootState) => state.lang);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const {
    uploadImage,
    imageFileUploadError,
    imageFileUploadProgress,
    imgUrl,
    resetImageUpload,
    imageFileUploading,
  } = useUploadImage(app);

  const { data: genres, isLoading: genresLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenres().then((res) => res.data?.data?.genres),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  const submitHandler = (data) => {
    console.log(data);
  };

  const poster = useWatch({
    name: "poster",
    control,
  });

  useEffect(() => {
    if (poster) {
      uploadImage(poster[0]);
    }
  }, [poster, uploadImage]);

  console.log(poster);

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
            render={({ field }) => (
              <DragAndDrop
                control={field}
                imgUrl={imgUrl}
                imageFileUploading={imageFileUploading}
              />
            )}
          />

          <button className="bg-project-red hover:bg-project-dark-red w-full py-2 rounded mt-6">
            {t("add_movie")}
          </button>
        </form>
      </div>
    </>
  );
};

export default MovieCreate;
