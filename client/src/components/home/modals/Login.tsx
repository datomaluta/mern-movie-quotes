import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import ModalWrapper from "../../ui/ModalWrapper";
import CustomInput from "../../ui/customInputs/CustomInput";
import { useState } from "react";
import { useTranslate } from "../../../hooks/useTranslate";
import { useSearchParams } from "react-router-dom";

const Login = () => {
  const { t } = useTranslate();
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const submitHandler = (data) => {
    console.log(data);
  };
  return (
    <ModalWrapper
      isLanding={true}
      setModalIsVisible={() => setSearchParams({ action: "" })}
    >
      <div className="flex flex-col items-center max-w-[360px] w-full mx-auto">
        <h1 className="text-3xl font-helvetica-medium mb-3 xl:text-xl md:text-lg xl:mb-0 md:text-project-gray md:font-helvetica-light">
          {t("login_to_your_account")}
        </h1>
        <p className="text-project-gray xl:hidden">{t("welcome_back")}!</p>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="w-full mt-6 md:mt-2"
        >
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
            rule={{ required: t("required_field") }}
            type={passwordIsVisible ? "text" : "password"}
            label="password"
            placeholder={t("******")}
            errorText={errors?.password?.message as string | undefined}
            passwordIsVisible={passwordIsVisible}
            setPasswordIsVisible={setPasswordIsVisible}
          />

          <button className="w-full bg-project-red py-2 md:py-[6px]  rounded mt-1">
            {t("sign_in")}
          </button>
        </form>

        <button
          type="button"
          className="w-full border border-white py-2 md:py-[6px] rounded flex gap-2 items-center justify-center mt-4 md:mt-2"
        >
          <FaGoogle />
          {t("sign_in_with_google")}
        </button>
        <div className="flex items-center gap-2 mt-8 md:mt-4">
          <p className="text-project-gray md:text-sm">
            {t("dont_have_an_account")}
          </p>
          <button
            className="text-blue-600 underline md:text-sm"
            onClick={() => setSearchParams({ action: "register" })}
          >
            {t("sign_up")}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default Login;
