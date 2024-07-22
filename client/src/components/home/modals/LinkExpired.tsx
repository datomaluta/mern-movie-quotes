import ModalWrapper from "../../ui/sharedComponents/ModalWrapper";
import { useTranslate } from "../../../hooks/useTranslate";
import { useSearchParams } from "react-router-dom";
import { FcExpired } from "react-icons/fc";

const LinkExpired = () => {
  const { t } = useTranslate();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <ModalWrapper
      isLanding={true}
      isReadOnly={true}
      setModalIsVisible={() => setSearchParams({ action: "" })}
    >
      <div className="flex flex-col items-center p-6 px-20 md:px-0">
        <FcExpired className="h-12 w-12 text-project-dark-blue" />
        <h1 className="text-2xl font-helvetica-medium mt-4 mb-5">
          {t("link_expired")}!
        </h1>
        <p className="mb-10 text-center">{t("link_expired_text")}</p>
        {searchParams.get("action") === "password-link-expired" && (
          <button
            onClick={() => setSearchParams({ action: "forgot-password" })}
            className="w-full bg-project-red py-2 md:py-[6px] rounded mt-1 md:w-max md:px-4 text-center"
          >
            {t("request_another_link")}
          </button>
        )}
      </div>
    </ModalWrapper>
  );
};

export default LinkExpired;
