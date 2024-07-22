import ModalWrapper from "../../ui/sharedComponents/ModalWrapper";
import { useTranslate } from "../../../hooks/useTranslate";
import { Link, useSearchParams } from "react-router-dom";
import activatedSvg from "./../../../assets/images/activated-fill.svg";

const Success = ({ text }: { text: string }) => {
  const { t } = useTranslate();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <ModalWrapper
      isLanding={true}
      isReadOnly={true}
      setModalIsVisible={() => setSearchParams({ action: "" })}
    >
      <div className="flex flex-col items-center p-6 px-20 md:px-0">
        <img className="h-12" src={activatedSvg} alt="activated-check-svg" />
        <h1 className="text-2xl font-helvetica-medium mt-4 mb-5">
          {t("success")}!
        </h1>
        <p className="mb-10 text-center">{t(`${text}`)}</p>
        {searchParams.get("action") === "account-verified" ? (
          <Link
            to={"/news-feed"}
            className="w-full bg-project-red py-2 md:py-[6px] rounded mt-1 md:w-max md:px-4 text-center"
          >
            {t("go_to_my_news_feed")}
          </Link>
        ) : (
          <button
            onClick={() => setSearchParams({ action: "login" })}
            className="w-full bg-project-red py-2 md:py-[6px] rounded mt-1 md:w-max md:px-4 text-center"
          >
            {t("login")}
          </button>
        )}
      </div>
    </ModalWrapper>
  );
};

export default Success;
