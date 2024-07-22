import { BsHouse } from "react-icons/bs";
import { PiVideoCameraLight } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { useTranslate } from "../../../hooks/useTranslate";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const SidebarContent = () => {
  const { t } = useTranslate();
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="flex flex-col gap-10 ">
      <Link to={"/profile"} className="flex items-center gap-4 group">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-red-500 border-2 border-project-red">
          <img
            className="h-full w-full object-cover"
            src={currentUser?.image}
            alt="avatar"
          />
        </div>
        <div>
          <p className="text-xl xl:text-base ">{currentUser?.username}</p>
          <p className="text-project-gray group-hover:underline xl:text-sm">
            {t("edit_your_profile")}
          </p>
        </div>
      </Link>
      <Link className={`flex gap-4 text-lg xl:text-base `} to={"/news-feed"}>
        <BsHouse
          className={`w-12 h-7 ${
            pathname.includes("news-feed") ? "text-project-red" : ""
          }`}
        />
        <span className="font-helvetica-capslight">{t("news_feed")}</span>
      </Link>
      <Link className={`flex gap-4 text-lg xl:text-base `} to={"/movies"}>
        <PiVideoCameraLight
          className={`w-12 h-7 ${
            pathname.includes("movies") ? "text-project-red" : ""
          }`}
        />
        <span className="font-helvetica-capslight">{t("list_of_movies")}</span>
      </Link>
    </div>
  );
};

export default SidebarContent;
