import { useForm } from "react-hook-form";
import ModalWrapper from "../../ui/sharedComponents/ModalWrapper";
import CustomInput from "../../ui/customInputs/CustomInput";
import { useState } from "react";
import { useTranslate } from "../../../hooks/useTranslate";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signin } from "../../../services/auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../ui/sharedComponents/LoadingSpinner";
import OAuth from "../../google/OAuth";

type FormData = {
  email_or_username: string;
  password: string;
};

const Login = () => {
  const { t } = useTranslate();
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { mutate: loginMutate, isPending: loginLoading } = useMutation({
    mutationFn: signin,
    onSuccess: () => {
      navigate("/news-feed");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>();

  const submitHandler = (data: FormData) => {
    loginMutate(data);
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
            name="email_or_username"
            register={register}
            rule={{
              required: t("required_field"),
              minLength: {
                value: 3,
                message: t("min_length_3"),
              },
            }}
            type="text"
            label="email_or_username"
            placeholder={t("email_placeholder_text")}
            errorText={errors?.email_or_username?.message as string | undefined}
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

          <div className="flex justify-end mb-4">
            <button
              onClick={() => setSearchParams({ action: "forgot-password" })}
              className="text-blue-600 underline"
              type="button"
            >
              {t("forgot_password")}
            </button>
          </div>

          <button className="w-full bg-project-red py-2 md:py-[6px] rounded mt-1 flex justify-center items-center min-h-10 md:min-h-9">
            {loginLoading ? <LoadingSpinner /> : t("login")}
          </button>
        </form>

        <OAuth />
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
