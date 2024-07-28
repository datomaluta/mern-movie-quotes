import { useTranslate } from "../hooks/useTranslate";
// import { useSelector } from "react-redux";
// import { RootState } from "../redux/store";
import { useSearchParams } from "react-router-dom";
import GeneralInfoForm from "../components/profile/GeneralInfoForm";
import PasswordForm from "../components/profile/PasswordForm";

const Profile = () => {
  const { t } = useTranslate();
  const [searchParams] = useSearchParams();

  return (
    <div className="max-w-[58.625rem]">
      <h1 className="text-xl font-helvetica-medium">{t("my_profile")}</h1>

      <div
        className={`bg-project-dark-blue  relative rounded-xl ${
          searchParams.get("tab") === "general"
            ? "pt-36 pb-12 mt-28"
            : " py-12 mt-12"
        } px-4`}
      >
        {searchParams.get("tab") === "general" && <GeneralInfoForm />}
        {searchParams.get("tab") === "password" && <PasswordForm />}
      </div>
    </div>
  );
};

export default Profile;
