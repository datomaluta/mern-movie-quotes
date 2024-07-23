import { useTranslate } from "../hooks/useTranslate";
// import { useSelector } from "react-redux";
// import { RootState } from "../redux/store";
import { useSearchParams } from "react-router-dom";
import GeneralInfoForm from "../components/profile/GeneralInfoForm";
import PasswordForm from "../components/profile/PasswordForm";

const Profile = () => {
  const { t } = useTranslate();
  // const { currentUser } = useSelector((state: RootState) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="">
      <h1 className="text-xl font-helvetica-medium">{t("my_profile")}</h1>

      <div className="bg-project-dark-blue mt-28 relative rounded-xl py-36 px-4">
        {searchParams.get("tab") === "general" && <GeneralInfoForm />}
        {searchParams.get("tab") === "password" && <PasswordForm />}

        <button
          onClick={() =>
            setSearchParams({
              tab:
                searchParams.get("tab") === "general" ? "password" : "general",
            })
          }
          className="max-w-[60%] mx-auto block w-full text-blue-500 text-left"
        >
          {searchParams.get("tab") === "general"
            ? t("change_password")
            : t("back_to_general_info")}
        </button>
      </div>

      <div className="flex gap-6 mt-4 justify-end">
        <button>{t("cancel")}</button>
        <button
          type="submit"
          form={
            searchParams.get("tab") === "general"
              ? "general-info-form"
              : "password-form"
          }
          className="bg-project-red px-4 py-2 rounded"
        >
          {t("save_changes")}
        </button>
      </div>
    </div>
  );
};

export default Profile;
