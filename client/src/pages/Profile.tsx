import { useForm } from "react-hook-form";
import CustomInput from "../components/ui/customInputs/CustomInput";
import { useTranslate } from "../hooks/useTranslate";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type FormData = {
  username: string;
  email: string;
  image: any;
};

const Profile = () => {
  const { t } = useTranslate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      image: currentUser?.image,
    },
  });

  const submitHandler = (data) => {
    console.log(data);
  };

  return (
    <div className="">
      <h1 className="text-xl font-helvetica-medium">{t("my_profile")}</h1>

      <div className="bg-project-dark-blue mt-28 relative  rounded-xl py-36 px-4">
        <form
          className="max-w-[60%] md:max-w-full mx-auto"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center gap-2">
              <div className="w-[11.75rem]  h-[11.75rem] rounded-full overflow-hidden ">
                <img
                  className="h-full w-full object-cover"
                  src={
                    "https://cdn-imgix.headout.com/media/images/c9db3cea62133b6a6bb70597326b4a34-388-dubai-img-worlds-of-adventure-tickets-01.jpg?auto=format&w=814.9333333333333&h=458.4&q=90&ar=16%3A9&crop=faces"
                  }
                  alt=""
                />
              </div>
              <label htmlFor="image">{t("upload_new_photo")}</label>
              <input type="file" id="image" hidden />
            </div>
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
        <button className="max-w-[60%] mx-auto block w-full text-blue-500 text-left">
          {t("change_password")}
        </button>
      </div>
      <div className="flex gap-6 mt-4 justify-end">
        <button>{t("cancel")}</button>
        <button className="bg-project-red px-3 py-1 rounded">
          {t("save_changes")}
        </button>
      </div>
    </div>
  );
};

export default Profile;
