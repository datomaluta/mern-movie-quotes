import { useState } from "react";
import { useTranslate } from "../../hooks/useTranslate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FaCaretDown } from "react-icons/fa";
import { setLanguage } from "../../redux/language/languageSlice";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useSelector((state: RootState) => state.lang);
  const { t } = useTranslate();
  const [languageSwitcherIsOpen, setLanguageSwitcherIsOpen] = useState(false);

  const dispatch = useDispatch();

  return (
    <>
      <header className="flex justify-between items-center px-16 md:px-4 fixed top-6 w-full z-40 ">
        <p className="text-project-yellow font-helvetica-medium">
          MOVIE QUOTES
        </p>
        <div className="flex items-center gap-4 md:gap-2">
          <div className="relative">
            <button
              onClick={() =>
                setLanguageSwitcherIsOpen((currentState) => !currentState)
              }
              className="flex gap-1 items-center px-2 py-2"
            >
              {lang === "en" ? "Eng" : "ქარ"} <FaCaretDown />
            </button>
            {languageSwitcherIsOpen && (
              <div className="flex flex-col bg-project-light-blue items-start  absolute bottom-0 left-0 translate-y-full w-full rounded overflow-hidden">
                <button
                  onClick={() => dispatch(setLanguage("en"))}
                  className="p-2 hover:bg-project-red w-full"
                >
                  Eng
                </button>
                <button
                  onClick={() => dispatch(setLanguage("ka"))}
                  className="p-2 hover:bg-project-red w-full"
                >
                  ქარ
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => dispatch(setLanguage("ka"))}
            className="bg-project-red text-white px-2 py-2 rounded w-28 md:w-20 md:py-1"
          >
            Sign up
          </button>
          <button className="rounded w-24 border border-white text-white px-2 py-[7px] md:hidden">
            {t("login")}
          </button>
        </div>
      </header>
      {children}
      <footer className="bg-project-dark-blue text-xs px-16 md:px-4 py-4">
        <p>© 2024 movie quotes. All rights reserved.</p>
      </footer>
    </>
  );
};

export default LandingLayout;
