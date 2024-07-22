import { useTranslate } from "../../hooks/useTranslate";
import { useSearchParams } from "react-router-dom";
import LanguageSwitcher from "../ui/sharedComponents/LanguageSwitcher";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslate();
  const [, setSearchParams] = useSearchParams();

  return (
    <>
      <header className="flex justify-between items-center px-16 md:px-4 fixed top-6 w-full z-40 ">
        <p className="text-project-yellow font-helvetica-medium">
          MOVIE QUOTES
        </p>
        <div className="flex items-center gap-4 md:gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setSearchParams({ action: "register" })}
            className="bg-project-red text-white px-2 py-2 rounded min-w-28 md:w-20 md:py-1"
          >
            {t("sign_up")}
          </button>
          <button
            onClick={() => setSearchParams({ action: "login" })}
            className="rounded w-24 border border-white text-white px-2 py-[7px] md:hidden"
          >
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
