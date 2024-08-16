import ModalWrapper from "../../ui/sharedComponents/ModalWrapper";
import { useTranslate } from "../../../hooks/useTranslate";
import { Link, useSearchParams } from "react-router-dom";
import sendCheckSvg from "./../../../assets/images/send-check-fill.svg";

const CheckEmail = ({ text }: { text: string }) => {
  const { t } = useTranslate();
  const [, setSearchParams] = useSearchParams();

  return (
    <ModalWrapper
      isLanding={true}
      isReadOnly={true}
      setModalIsVisible={() => setSearchParams({ action: "" })}
    >
      <div className="flex flex-col items-center p-6 px-20 md:px-0">
        <img className="h-12" src={sendCheckSvg} alt="send-check-svg" />
        <h1 className="text-2xl font-helvetica-medium mt-4 mb-5">
          {t("thank_you")}!
        </h1>
        <p className="mb-10 text-center p-2">{t(`${text}`)}</p>
        <Link
          target="_blank"
          to={"https://mailtrap.io/inboxes/2088227/messages/"}
          className="w-full bg-project-red py-2 md:py-[0.375rem] rounded mt-1 md:w-max md:px-4 text-center"
        >
          {t("go_to_my_email")}
        </Link>
      </div>
    </ModalWrapper>
  );
};

export default CheckEmail;
