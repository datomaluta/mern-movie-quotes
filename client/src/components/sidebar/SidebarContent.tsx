import { BsHouse } from "react-icons/bs";
import { PiVideoCameraLight } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { useTranslate } from "../../hooks/useTranslate";

const SidebarContent = () => {
  const { t } = useTranslate();
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-10 ">
      <Link to={"/"} className="flex items-center gap-2 group">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
            alt="avatar"
          />
        </div>
        <div>
          <p className="text-xl xl:text-base ">Nino Tabagari</p>
          <p className="text-project-gray group-hover:underline xl:text-sm">
            {t("edit_your_profile")}
          </p>
        </div>
      </Link>
      <Link className={`flex gap-2 text-xl xl:text-base `} to={"/"}>
        <BsHouse
          className={`w-16 h-7 ${
            pathname.includes("news-feed") ? "text-project-red" : ""
          }`}
        />
        <span>News feed</span>
      </Link>
      <Link className={`flex gap-2 text-xl xl:text-base `} to={"/"}>
        <PiVideoCameraLight
          className={`w-16 h-7 ${
            pathname.includes("movies") ? "text-project-red" : ""
          }`}
        />
        <span>List of movies</span>
      </Link>
    </div>
  );
};

export default SidebarContent;
