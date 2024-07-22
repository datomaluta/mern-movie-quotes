import { useForm } from "react-hook-form";
import { FaLongArrowAltLeft } from "react-icons/fa";
import ModalWrapper from "../../ui/sharedComponents/ModalWrapper";
import CustomInput from "../../ui/customInputs/CustomInput";
import { useTranslate } from "../../../hooks/useTranslate";
import { useSearchParams } from "react-router-dom";
import { forgotPassword } from "../../../services/auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../ui/sharedComponents/LoadingSpinner";

type FormData = {
  email: string;
};

const ForgotPassword = () => {
  const { t } = useTranslate();
  const [, setSearchParams] = useSearchParams();

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      //   navigate("/news-feed");
      setSearchParams({ action: "check-email-password" });
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
    mutate(data);
  };

  return (
    <ModalWrapper
      isLanding={true}
      setModalIsVisible={() => setSearchParams({ action: "" })}
    >
      <div className="flex flex-col items-center max-w-[360px] w-full mx-auto">
        <h1 className="text-3xl font-helvetica-medium mb-3 xl:text-xl md:text-lg xl:mb-0 md:text-project-gray md:font-helvetica-light">
          {t("forgot_password")}?
        </h1>
        <p className="text-project-gray text-center mt-4">
          {t("forgot_password_instruction")}!
        </p>

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
                value: /^\S+@\S+$/,
                message: t("invalid_email"),
              },
            }}
            type="text"
            label="email"
            placeholder={t("email_placeholder_text")}
            errorText={errors?.email?.message as string | undefined}
          />

          <button className="w-full bg-project-red py-2 md:py-[6px] rounded mt-2 flex justify-center items-center min-h-10 md:min-h-9">
            {isPending ? <LoadingSpinner /> : t("send_instructions")}
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

export default ForgotPassword;
