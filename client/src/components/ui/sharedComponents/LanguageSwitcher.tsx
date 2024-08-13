import { useState } from "react";
import { RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { FaCaretDown } from "react-icons/fa";
import { setLanguage } from "../../../redux/language/languageSlice";

const LanguageSwitcher = ({ className }: { className?: string }) => {
  const { lang } = useSelector((state: RootState) => state.lang);
  const [languageSwitcherIsOpen, setLanguageSwitcherIsOpen] = useState(false);
  const dispatch = useDispatch();

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() =>
          setLanguageSwitcherIsOpen((currentState) => !currentState)
        }
        className="flex gap-1 items-center px-2 py-2"
      >
        {lang === "en" ? "Eng" : "ქარ"} <FaCaretDown />
      </button>
      {languageSwitcherIsOpen && (
        <div className="flex flex-col bg-project-light-blue items-start  absolute z-40 bottom-0 left-0 translate-y-full w-full rounded overflow-hidden">
          <button
            onClick={() => {
              dispatch(setLanguage("en"));
              setLanguageSwitcherIsOpen(false);
            }}
            className="p-2 hover:bg-project-red w-full"
          >
            Eng
          </button>
          <button
            onClick={() => {
              dispatch(setLanguage("ka"));
              setLanguageSwitcherIsOpen(false);
            }}
            className="p-2 hover:bg-project-red w-full"
          >
            ქარ
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
