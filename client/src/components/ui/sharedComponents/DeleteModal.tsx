import { useTranslate } from "../../../hooks/useTranslate";
import LoadingSpinner from "./LoadingSpinner";
import ModalWrapper from "./ModalWrapper";

const DeleteModal = ({ setDeleteModalIsOpen, onSubmit, deleteIsLoading }) => {
  const { t } = useTranslate();
  return (
    <ModalWrapper setModalIsVisible={setDeleteModalIsOpen}>
      <div className="p-4">
        <p className="text-center mb-5">{t("are_you_sure_with_delete")}</p>
        <div className="flex justify-center gap-10">
          <button
            onClick={() => onSubmit()}
            className="bg-project-red py-1 px-2 rounded h-8 min-w-16 flex justify-center items-center"
          >
            {deleteIsLoading ? <LoadingSpinner /> : t("delete")}
          </button>
          <button>{t("cancel")}</button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DeleteModal;
