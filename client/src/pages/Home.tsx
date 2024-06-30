import { FaCaretDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../redux/language/languageSlice";
import { RootState } from "../redux/store";

const Home = () => {
  const { lang } = useSelector((state: RootState) => state.lang);
  console.log(lang);
  const dispatch = useDispatch();
  return (
    <div className="bg-project-dark-blue min-h-screen text-white pt-6 ">
      <header className="flex justify-between items-center px-16 md:px-4">
        <p className="text-project-yellow ">MOVIE QUOTES</p>
        <div className="flex items-center gap-4 md:gap-2">
          <button className="flex items-center px-2 py-2">
            Eng <FaCaretDown />
          </button>
          <button
            onClick={() => dispatch(setLanguage("ka"))}
            className="bg-project-red text-white px-2 py-2 rounded w-28 md:w-20 md:py-1"
          >
            Sign up
          </button>
          <button
            onClick={() => dispatch(setLanguage("en"))}
            className="rounded w-24 border border-white text-white px-2 py-[7px] md:hidden"
          >
            Log in
          </button>
        </div>
      </header>
      <h1 className="text-center text-3xl mt-10 ">ეს ახალი ერაა ბეიბი</h1>
    </div>
  );
};

export default Home;
