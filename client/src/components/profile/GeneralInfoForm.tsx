import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CustomInput from "../ui/customInputs/CustomInput";
import { useTranslate } from "../../hooks/useTranslate";
import useUploadImage from "../../hooks/useUploadImage";
import { app } from "../../firebase.ts";
import { useEffect, useState } from "react";

import ImagePicker from "./ImagePicker.tsx";
import { useSearchParams } from "react-router-dom";
import { removeEmpty } from "../../utils/objectFunctions.ts";
import { updateMe } from "../../services/user.ts";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { saveUserInfo } from "../../redux/user/userSlice.ts";
import LoadingSpinner from "../ui/sharedComponents/LoadingSpinner.tsx";
import { UserType } from "../../types/user";

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
  const [saveChangeIsVisible, setSaveChangeIsVisible] = useState(false);

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
    formState: { errors },
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
  const usernameInput = useWatch({ control, name: "username" });
  const emailInput = useWatch({ control, name: "email" });

  useEffect(() => {
    if (
      usernameInput !== currentUser?.username ||
      emailInput !== currentUser?.email ||
      imageInput !== null
    ) {
      setSaveChangeIsVisible(true);
    } else {
      setSaveChangeIsVisible(false);
    }
  }, [usernameInput, emailInput, imageInput, currentUser]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: (response: { data: { data: { user: UserType } } }) => {
      toast.success(t("profile_updated_successfully"));
      dispatch(saveUserInfo(response?.data?.data?.user));
      setSaveChangeIsVisible(false);
    },
    onError: (error: { response: { data: { message: string } } }) => {
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

      {!currentUser?.isGoogleUser && (
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
      )}

      {saveChangeIsVisible && (
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
