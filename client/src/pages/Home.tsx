import { useSearchParams } from "react-router-dom";
import LandingBackgroundContainer from "../components/ui/LandingBackgroundContainer";
import { useTranslate } from "../hooks/useTranslate";
import { AnimatePresence } from "framer-motion";
import Register from "../components/home/modals/Register";
import Login from "../components/home/modals/Login";

const Home = () => {
  const { t } = useTranslate();
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get("action");

  return (
    <div className="bg-project-dark-blue min-h-screen text-white pt-[100vh]">
      <div className="bg-dark-blue-gradient absolute top-0 right-0 w-full h-[100vh] ">
        <div className="max-w-[700px] mx-auto mt-[300px] ">
          <h1 className="text-center text-[3.75rem] md:text-2xl text-project-yellow font-helvetica-bold px-4">
            {t("find_any_quote_in_millions_of_movie_lines")}
          </h1>
          <button
            onClick={() => setSearchParams({ action: "register" })}
            className="bg-project-red px-4 py-2 rounded mt-6 mx-auto block"
          >
            {t("get_started")}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {action === "register" && <Register />}
        {action === "login" && <Login />}
      </AnimatePresence>

      <LandingBackgroundContainer
        className="bg-gradient-interstellar"
        quote={t("you_have_to_leave_something_behind_to_go_forward")}
        movie={t("interstellar")}
        year="2014"
      />

      <LandingBackgroundContainer
        className="bg-gradient-tenebaums"
        quote={t("tenenbaums_quote")}
        movie={t("the_royal_tenenbaums")}
        year="2001"
      />

      <LandingBackgroundContainer
        className="bg-gradient-lotr"
        quote={t("lotr_quote")}
        movie={t("the_lord_of_the_rings")}
        year="2001"
      />
    </div>
  );
};

export default Home;
