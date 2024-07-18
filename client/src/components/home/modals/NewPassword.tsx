import { useForm } from "react-hook-form";
import { FaLongArrowAltLeft } from "react-icons/fa";
import ModalWrapper from "../../ui/ModalWrapper";
import CustomInput from "../../ui/customInputs/CustomInput";
import { useTranslate } from "../../../hooks/useTranslate";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../../../services/auth";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { useState } from "react";

type FormData = {
  password: string;
  confirm_password: string;
};

const NewPassword = () => {
  const { t } = useTranslate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setSearchParams({ action: "password-changed" });
    },
    onError: () => {
      //   toast.error(error?.response?.data?.message);
      setSearchParams({ action: "password-link-expired" });
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>();

  const submitHandler = (data: FormData) => {
    mutate({ data: data, token: searchParams.get("token") as string });
  };

  return (
    <ModalWrapper
      isLanding={true}
      setModalIsVisible={() => setSearchParams({ action: "" })}
    >
      <div className="flex flex-col items-center max-w-[360px] w-full mx-auto">
        <h1 className="text-3xl font-helvetica-medium mb-3 xl:text-xl md:text-lg xl:mb-0 md:text-project-gray md:font-helvetica-light">
          {t("create_new_password")}
        </h1>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="w-full mt-6 md:mt-2"
        >
          <CustomInput
            name="password"
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
            errorText={errors?.password?.message as string | undefined}
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

          <button className="w-full bg-project-red py-2 md:py-[6px] rounded mt-2 flex justify-center items-center min-h-10 md:min-h-9">
            {isPending ? <LoadingSpinner /> : t("reset_password")}
          </button>
        </form>

        <div className="flex items-center gap-2 mt-8 md:mt-4">
          <button
            className="text-project-gray md:text-sm flex items-center gap-2"
            onClick={() => setSearchParams({ action: "login" })}
          >
            <FaLongArrowAltLeft />
            {t("back_to_log_in")}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default NewPassword;
