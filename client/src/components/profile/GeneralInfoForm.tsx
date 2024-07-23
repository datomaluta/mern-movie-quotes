import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CustomInput from "../ui/customInputs/CustomInput";
import { useTranslate } from "../../hooks/useTranslate";
import useUploadImage from "../../hooks/useUploadImage";
import { app } from "../../firebase.ts";
import { useEffect } from "react";

import ImagePicker from "./ImagePicker.tsx";

type FormData = {
  username: string;
  email: string;
  image: FileList | null;
};

const GeneralInfoForm = () => {
  const { t } = useTranslate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const { uploadImage, imageFileUploadError, imageFileUploadProgress, imgUrl } =
    useUploadImage(app);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      image: null,
    },
  });
  const selectedFile = useWatch({ control, name: "image" });

  const submitHandler = (data: FormData) => {
    console.log(data, imgUrl);
  };

  useEffect(() => {
    if (selectedFile) {
      uploadImage(selectedFile[0]);
    }
  }, [selectedFile, uploadImage]);

  return (
    <form
      id="general-info-form"
      className="max-w-[60%] md:max-w-full mx-auto pt-10"
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[40%]">
        {/* <div className="flex flex-col items-center gap-2">
          <div className="w-[11.75rem]  h-[11.75rem]  rounded-full overflow-hidden relative bg-project-light-blue">
            {imageFileUploadProgress ? (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 100,
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${
                      imageFileUploadProgress / 100
                    })`,
                  },
                }}
              />
            ) : (
              ""
            )}
            <img
              className={`w-[11.75rem]  h-[11.75rem] object-cover   ${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                "opacity-60"
              }`}
              src={imgPreview || currentUser?.image}
              alt="img-preview"
            />
          </div>

          <label className="cursor-pointer" htmlFor="image">
            {t("upload_new_photo")}
          </label>
          <input
            {...register("image", {
              onChange: hanldeImageChange,
            })}
            type="file"
            id="image"
            hidden
          />

          <div className="flex gap-4 min-h-8">
            {selectedFile !== currentUser?.image &&
              imageUploadButtonIsVisible && (
                <>
                  <button
                    onClick={() => {
                      setValue("image", currentUser?.image);
                      setImgPreview(null);
                    }}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={() => {
                      uploadImage(selectedFile[0]);
                      setImageUploadButtonIsVisible(false);
                    }}
                    className="bg-green-600 px-3 py-1 rounded-lg"
                  >
                    {t("upload")}
                  </button>
                </>
              )}
          </div>
          {imageFileUploadError && (
            <p className="text-project-red">{imageFileUploadError}</p>
          )}
        </div> */}
        <ImagePicker
          imageFileUploadProgress={imageFileUploadProgress}
          register={register}
          imageFileUploadError={imageFileUploadError}
          imgPreview={imgUrl}
        />
      </div>

      <CustomInput
        name="username"
        register={register}
        rule={{
          required: t("required_field"),
          minLength: { value: 3, message: t("min_3_characters") },
          maxLength: { value: 15, message: t("min_3_characters") },
          pattern: {
            value: /^[a-z]+$/,
            message: t("only_lower_latin_letters"),
          },
        }}
        type="text"
        label="username"
        placeholder={t("username_placeholder_text")}
        errorText={errors?.username?.message as string | undefined}
      />

      <CustomInput
        name="email"
        register={register}
        rule={{
          required: t("required_field"),
          pattern: {
            value: /^\S+@\S+$/,
            message: t("invalid_email"),
          },
        }}
        type="text"
        label="email"
        placeholder={t("email_placeholder_text")}
        errorText={errors?.email?.message as string | undefined}
      />
    </form>
  );
};

export default GeneralInfoForm;
