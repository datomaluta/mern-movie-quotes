import { FaCaretDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../redux/language/languageSlice";
import { RootState } from "../redux/store";
import { useTranslate } from "../hooks/useTranslate";
import { useState } from "react";

const Home = () => {
  const { lang } = useSelector((state: RootState) => state.lang);
  const { t } = useTranslate();
  const [languageSwitcherIsOpen, setLanguageSwitcherIsOpen] = useState(false);

  const dispatch = useDispatch();
  return (
    <div className="bg-project-dark-blue min-h-screen text-white pt-[80vh] md:pt-[60vh] ">
      {/* <div className="bg-yellow-500  max-w-[700px] mx-auto mt-[200px] md:mt-[100px]">
        <h1 className="text-center text-[3.75rem] sm:text-2xl text-project-yellow font-helvetica-bold ">
          Find any quote in millions of movie lines
        </h1>
        <button className="bg-project-red px-4 py-2 rounded font-helvetica-medium mt-6 mx-auto block">
          Get started
        </button>
      </div> */}
      <div className="bg-dark-blue-gradient absolute top-0 right-0 w-full h-[80vh] md:h-[60vh]">
        <div className="max-w-[700px] mx-auto mt-[200px] ">
          <h1 className="text-center text-[3.75rem] md:text-2xl text-project-yellow font-helvetica-bold px-4">
            Find any quote in millions of movie lines
          </h1>
          <button className="bg-project-red px-4 py-2 rounded font-helvetica-medium mt-6 mx-auto block">
            Get started
          </button>
        </div>
      </div>
      <div className="h-[1080px] xl:h-[800px] lg:h-[600px] md:h-[350px] bg-custom-gradient bg-no-repeat bg-cover bg-center-top transition-all relative">
        <div className="absolute top-[30%] left-[10%] max-w-[761px]">
          <div className="flex items-start gap-4">
            <span className="h-[2px]  w-12 bg-white block mt-10"></span>
            <h1 className="text-5xl font-helvetica-bold leading-[70px]">
              “You have to leave somethig behind to go forward”
            </h1>
          </div>
          <p className="text-3xl font-helvetica-bold mt-4 ml-12">
            Interstellar, 2014
          </p>
        </div>
      </div>

      <div className="h-[4000px] bg-red-500">d</div>
    </div>
  );
};

export default Home;
