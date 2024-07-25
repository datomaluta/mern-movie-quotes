import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CustomInput from "../ui/customInputs/CustomInput";
import { useTranslate } from "../../hooks/useTranslate";
import useUploadImage from "../../hooks/useUploadImage";
import { app } from "../../firebase.ts";
import { useEffect } from "react";

import ImagePicker from "./ImagePicker.tsx";
import { useSearchParams } from "react-router-dom";
import { removeEmpty } from "../../utils/objectFunctions.ts";
import { updateMe } from "../../services/user.ts";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { saveUserInfo } from "../../redux/user/userSlice.ts";
import LoadingSpinner from "../ui/sharedComponents/LoadingSpinner.tsx";

type FormData = {
  username: string;
  email: string;
  image: FileList | null;
};

type toSendFormData = {
  username: string;
  email: string;
  image: string;
};

const GeneralInfoForm = () => {
  const { t } = useTranslate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const {
    uploadImage,
    imageFileUploadError,
    imageFileUploadProgress,
    imgUrl,
    resetImageUpload,
    imageFileUploading,
  } = useUploadImage(app);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      image: null,
    },
  });
  const imageInput = useWatch({ control, name: "image" });

  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: (response: any) => {
      toast.success(t("profile_updated_successfully"));
      dispatch(saveUserInfo(response?.data?.data?.user));
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const submitHandler = (data: FormData) => {
    const requestData = {
      ...data,
      image: imgUrl,
    };

    mutate(removeEmpty(requestData) as toSendFormData);
  };

  useEffect(() => {
    if (imageInput) {
      uploadImage(imageInput[0]);
    }
  }, [imageInput, uploadImage]);

  return (
    <form
      id="general-info-form"
      className="max-w-[60%] md:max-w-full mx-auto pt-10 min-h-[22rem]"
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
            {imageInput !== currentUser?.image &&
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
                      uploadImage(imageInput[0]);
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
          imgUrl={imgUrl}
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
        readOnly={currentUser?.isGoogleUser}
      />

      <button
        onClick={() =>
          setSearchParams({
            tab: "password",
          })
        }
        className="mx-auto inline-block text-blue-500 text-left"
      >
        {t("change_password")}
      </button>

      {isDirty && (
        <div className="flex gap-6 mt-16 justify-end">
          <button
            onClick={() => {
              reset({
                username: currentUser?.username,
                email: currentUser?.email,
                image: null,
              });
              resetImageUpload();
            }}
            className="text-red-500"
          >
            {t("cancel")}
          </button>
          <button
            disabled={imageFileUploading || isPending}
            onClick={() => {}}
            className="bg-project-red px-4 py-2 rounded w-36 flex justify-center items-center h-10 disabled:bg-red-500 disabled:cursor-not-allowed"
          >
            {isPending ? <LoadingSpinner /> : t("save_changes")}
          </button>
        </div>
      )}
    </form>
  );
};

export default GeneralInfoForm;
