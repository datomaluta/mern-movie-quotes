import { useSearchParams } from "react-router-dom";
import LandingBackgroundContainer from "../components/ui/sharedComponents/LandingBackgroundContainer";
import { useTranslate } from "../hooks/useTranslate";
import { AnimatePresence } from "framer-motion";
import Register from "../components/home/modals/Register";
import Login from "../components/home/modals/Login";
import CheckEmail from "../components/home/modals/CheckEmail";
import ForgotPassword from "../components/home/modals/ForgotPassword";
import NewPassword from "../components/home/modals/NewPassword";
import Success from "../components/home/modals/Success";
import LinkExpired from "../components/home/modals/LinkExpired";
import LandingLayout from "../components/layouts/LandingLayout";

const Home = () => {
  const { t } = useTranslate();
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get("action");

  return (
    <LandingLayout>
      <div className="bg-project-dark-blue min-h-screen text-white pt-[100vh]">
        <div className="bg-dark-blue-gradient absolute top-0 right-0 w-full h-[100vh] ">
          <div className="max-w-[43.75rem] mx-auto mt-[18.75rem] ">
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
          {action === "check-email-verify" && (
            <CheckEmail text={"please_check_email_verify"} />
          )}
          {action === "account-verified" && (
            <Success text={"your_account_has_been_activated"} />
          )}
          {action === "forgot-password" && <ForgotPassword />}
          {action === "check-email-password" && (
            <CheckEmail text={"please_check_email_password"} />
          )}
          {action === "new-password" && <NewPassword />}
          {action === "password-changed" && (
            <Success text={"your_password_has_been_changed"} />
          )}
          {action === "password-link-expired" && <LinkExpired />}
          {action === "verify-link-expired" && <LinkExpired />}
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
    </LandingLayout>
  );
};

export default Home;
