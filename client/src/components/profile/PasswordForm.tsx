import { useForm } from "react-hook-form";
import CustomInput from "../ui/customInputs/CustomInput";
import { useTranslate } from "../../hooks/useTranslate";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateMyPassword } from "../../services/user";
import toast from "react-hot-toast";
import LoadingSpinner from "../ui/sharedComponents/LoadingSpinner";

type FormData = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

const PasswordForm = () => {
  const { t } = useTranslate();
  const [currentPasswordIsVisible, setCurrentPasswordIsVisible] =
    useState(false);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setError,
  } = useForm<FormData>();

  const { mutate, isPending } = useMutation({
    mutationFn: updateMyPassword,
    onSuccess: () => {
      toast.success(t("password_updated_successfully"));
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const submitHandler = (data: FormData) => {
    if (data.new_password !== data.confirm_password) {
      setError("confirm_password", {
        type: "manual",
        message: t("passwords_do_not_match"),
      });
      return;
    }

    mutate(data);
    reset();
  };

  return (
    <form
      id="password-form"
      className="max-w-[60%] md:max-w-full mx-auto min-h-[24rem]"
      onSubmit={handleSubmit(submitHandler)}
    >
      <CustomInput
        name="current_password"
        register={register}
        rule={{
          required: t("required_field"),
        }}
        type={currentPasswordIsVisible ? "text" : "password"}
        label="current_password"
        placeholder={t("current_password")}
        errorText={errors?.current_password?.message as string | undefined}
        passwordIsVisible={currentPasswordIsVisible}
        setPasswordIsVisible={setCurrentPasswordIsVisible}
      />

      <CustomInput
        name="new_password"
        register={register}
        rule={{
          required: t("required_field"),
          minLength: { value: 4, message: t("min_8_characters") },
          maxLength: { value: 15, message: t("min_8_characters") },
          pattern: {
            value: /^[a-z0-9]+$/,
            message: t("only_lower_latin_letters_and_numbers"),
          },
        }}
        type={passwordIsVisible ? "text" : "password"}
        label="password"
        placeholder={t("password_placeholder_text")}
        errorText={errors?.new_password?.message as string | undefined}
        passwordIsVisible={passwordIsVisible}
        setPasswordIsVisible={setPasswordIsVisible}
      />

      <CustomInput
        name="confirm_password"
        register={register}
        rule={{
          required: t("required_field"),
          minLength: { value: 4, message: t("min_8_characters") },
          maxLength: { value: 15, message: t("min_8_characters") },
          pattern: {
            value: /^[a-z0-9]+$/,
            message: t("only_lower_latin_letters_and_numbers"),
          },
        }}
        type={passwordIsVisible ? "text" : "password"}
        label="confirm_password"
        placeholder={t("confirm_password_placeholder_text")}
        errorText={errors?.confirm_password?.message as string | undefined}
        passwordIsVisible={passwordIsVisible}
        setPasswordIsVisible={setPasswordIsVisible}
      />

      <button
        onClick={() =>
          setSearchParams({
            tab: "general",
          })
        }
        className="mx-auto inline-block text-blue-500 text-left"
      >
        {t("back_to_general_info")}
      </button>

      {isDirty && (
        <div className="flex gap-6 mt-16 justify-end">
          <button
            onClick={() => {
              reset({
                current_password: "",
                new_password: "",
                confirm_password: "",
              });
            }}
            className="text-red-500"
          >
            {t("cancel")}
          </button>
          <button
            disabled={isPending}
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

export default PasswordForm;
