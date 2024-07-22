import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toggleLanguage } from "../../../redux/language/languageSlice";

const LanguageToggle = ({ className }: { className?: string }) => {
  const dispatch = useDispatch();
  const { lang } = useSelector((state: RootState) => state.lang);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => dispatch(toggleLanguage())}
        className={`w-12 h-7 shrink-0 rounded-full py-[2px] block px-[3px] ${
          lang === "light" ? "bg-zinc-300" : "bg-project-light-blue"
        } transition-all duration-300 ${className}`}
      >
        <div
          className={`h-6 w-6 rounded-full bg-white ftransition-all duration-300 flex items-center justify-center 
      
        ${lang === "en" ? "translate-x-0" : "translate-x-3/4"}`}
        >
          {lang === "ka" ? (
            <p className="text-project-dark-blue font-helvetica-medium">Ka</p>
          ) : (
            <p className="text-project-dark-blue font-helvetica-medium">En</p>
          )}
        </div>
      </button>
      <p>{lang === "en" ? "English" : "ქართული"}</p>
    </div>
  );
};

export default LanguageToggle;
