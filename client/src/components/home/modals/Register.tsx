import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import ModalWrapper from "../../ui/ModalWrapper";
import CustomInput from "../../ui/customInputs/CustomInput";
import { useState } from "react";
import { useTranslate } from "../../../hooks/useTranslate";
import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../../../services/auth";
import LoadingSpinner from "../../ui/LoadingSpinner";

const Register = () => {
  const { t } = useTranslate();
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const { mutate: registerMutate, isPending: registerIsPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      setSearchParams({ action: "check-email" });
    },
    onError: () => {
      console.log("Error happened");
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm();

  const submitHandler = (data) => {
    if (data.password !== data.confirm_password) {
      setError("confirm_password", {
        type: "manual",
        message: t("passwords_do_not_match"),
      });
      return;
    }

    console.log(data);
    registerMutate(data);
  };

  return (
    <ModalWrapper
      isLanding={true}
      setModalIsVisible={() => setSearchParams({ action: "" })}
    >
      <div className="flex flex-col items-center max-w-[360px] w-full mx-auto">
        <h1 className="text-3xl font-helvetica-medium mb-3 xl:text-xl md:text-lg xl:mb-0 md:text-project-gray md:font-helvetica-light">
          {t("create_an_account")}
        </h1>
        <p className="text-project-gray xl:hidden">
          {t("start_your_journey")}!
        </p>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="w-full mt-6 md:mt-2"
        >
          <CustomInput
            name="username"
            register={register}
            rule={{
              required: t("required_field"),
              minLength: { value: 3, message: t("min_3_characters") },
              maxLength: { value: 15, message: t("min_3_characters") },
              pattern: {
                value: /^[a-z]+$/i,
                message: t("only_lower_latin_letters"),
              },
            }}
            type="text"
            label="username"
            placeholder={t("username_placeholder_text")}
            errorText={errors?.name?.message as string | undefined}
          />

          <CustomInput
            name="email"
            register={register}
            rule={{
              required: t("required_field"),
              pattern: {
                value: /^\S+@\S+$/i,
                message: t("invalid_email"),
              },
            }}
            type="text"
            label="email"
            placeholder={t("email_placeholder_text")}
            errorText={errors?.email?.message as string | undefined}
          />

          <CustomInput
            name="password"
            register={register}
            rule={{
              required: t("required_field"),
              minLength: { value: 4, message: t("min_8_characters") },
              maxLength: { value: 15, message: t("min_8_characters") },
              pattern: {
                value: /^[a-z0-9]+$/i,
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
                value: /^[a-z0-9]+$/i,
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

          <button className="w-full bg-project-red py-2 md:py-[6px] rounded mt-1 flex justify-center items-center min-h-10 md:min-h-9">
            {registerIsPending ? <LoadingSpinner /> : t("sign_up")}
          </button>
        </form>

        <button
          type="button"
          className="w-full border border-white py-2 md:py-[6px] rounded flex gap-2 items-center justify-center mt-4 md:mt-2"
        >
          <FaGoogle />
          {t("sign_up_with_google")}
        </button>
        <div className="flex items-center gap-2 mt-8 md:mt-4">
          <p className="text-project-gray md:text-sm">
            {t("already_have_an_account")}
          </p>
          <button
            className="text-blue-600 underline md:text-sm"
            onClick={() => setSearchParams({ action: "login" })}
          >
            {t("login")}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default Register;
