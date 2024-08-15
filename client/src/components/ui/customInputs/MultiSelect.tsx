import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useTranslate } from "../../../hooks/useTranslate";

const MultiSelect = ({
  data,
  loading,
  value,
  onChange,
  error,
  placeholder,
}: {
  data: { id: string; name: string }[];
  loading: boolean;
  value: { id: string; name: string }[];
  onChange: (selected: { id: string; name: string }[]) => void;
  error?: string;
  placeholder: string;
}) => {
  const { t } = useTranslate();

  const [optionsTabIsOpen, setOptionsTabIsOpen] = useState(false);
  const selectedOptions = value || [];
  const selectedOptionsIds = selectedOptions.map((option) => option.id);
  const filteredOptions = data?.filter(
    (o) => !selectedOptionsIds.includes(o.id)
  );

  return (
    <div>
      <div className="relative">
        <div
          className="border border-project-gray rounded cursor-pointer p-2 flex gap-3 justify-between"
          onClick={() => setOptionsTabIsOpen((currState) => !currState)}
        >
          <div className="flex gap-3 flex-wrap">
            {selectedOptions.length ? (
              selectedOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center bg-project-light-blue rounded"
                >
                  <span className="pl-2 py-1 text-sm">{option.name}</span>
                  <button
                    className="ml-2 hover:bg-red-500 p-1 h-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newSelectedOptions = selectedOptions.filter(
                        (o) => o.id !== option.id
                      );
                      onChange(newSelectedOptions);
                    }}
                  >
                    <IoMdClose />
                  </button>
                </div>
              ))
            ) : (
              <span className="text-project-gray">{t(placeholder)}</span>
            )}
          </div>
          <button type="button">
            <FaChevronDown className="text-project-gray h-3 w-3" />
          </button>
        </div>
        {optionsTabIsOpen && (
          <div className="h-[200px] overflow-auto bg-project-light-blue rounded absolute -bottom-0 w-full translate-y-full flex flex-col z-50">
            {loading && <p className="px-2 py-2">{t("loading")}</p>}
            {filteredOptions?.length && !loading ? (
              filteredOptions.map((option) => (
                <button
                  type="button"
                  className=" text-left mb-1 px-2 hover:bg-project-middle-blue py-1"
                  key={option.id}
                  onClick={() => {
                    const newSelectedOptions = [...selectedOptions, option];
                    onChange(newSelectedOptions);
                  }}
                >
                  {option.name}
                </button>
              ))
            ) : (
              <p className="px-2 py-2">{t("no_options")}</p>
            )}
          </div>
        )}
      </div>
      <p className="text-project-danger h-5 text-sm mt-1">{error}</p>
    </div>
  );
};

export default MultiSelect;
